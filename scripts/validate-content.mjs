import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const titles = JSON.parse(await readFile("src/catalog-titles.json", "utf8"));
const roots = {
  1: "形而下学",
  2: "形而上学",
  3: "观念论",
  4: "实践",
  5: "现代性",
};
const expected = { ...roots, ...titles };
const files = (await readdir("src/content"))
  .filter((file) => file.endsWith(".json"))
  .sort();

if (!files.length) throw new Error("No Wiki content files were found in src/content.");

const content = {};
const errors = [];
const sentenceUsage = new Map();
for (const file of files) {
  const entries = JSON.parse(await readFile(join("src/content", file), "utf8"));
  for (const [id, article] of Object.entries(entries)) {
    if (content[id]) errors.push(`${id}: duplicated in ${file}`);
    content[id] = article;
  }
}

const nonEmptyString = (value, min = 1) => typeof value === "string" && value.trim().length >= min;
const inRange = (value, min, max) => Array.isArray(value) && value.length >= min && value.length <= max;
const allStrings = (value) => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
};

for (const id of Object.keys(expected)) {
  const article = content[id];
  if (!article) {
    errors.push(`${id} ${expected[id]}: missing article`);
    continue;
  }
  if (!nonEmptyString(article.kind, 2)) errors.push(`${id}: kind is missing`);
  if (!nonEmptyString(article.definition, 45)) errors.push(`${id}: definition is too short`);
  if (!Array.isArray(article.overview) || article.overview.length !== 2) {
    errors.push(`${id}: overview must contain exactly 2 paragraphs`);
  } else if (article.overview.some((paragraph) => !nonEmptyString(paragraph, 55))) {
    errors.push(`${id}: overview paragraph is too short`);
  }
  if (!Array.isArray(article.keyIdeas) || article.keyIdeas.length !== 3) {
    errors.push(`${id}: keyIdeas must contain exactly 3 items`);
  } else if (
    article.keyIdeas.some((item) => !nonEmptyString(item?.title, 2) || !nonEmptyString(item?.text, 12))
  ) {
    errors.push(`${id}: key idea is incomplete`);
  }
  if (!nonEmptyString(article.history, 55)) errors.push(`${id}: history is too short`);
  if (!inRange(article.debates, 2, 3) || article.debates.some((item) => !nonEmptyString(item, 12))) {
    errors.push(`${id}: debates must contain 2–3 developed points`);
  }
  if (!nonEmptyString(article.placement, 40)) errors.push(`${id}: placement is too short`);
  if (!inRange(article.reading, 2, 4) || article.reading.some((item) => !nonEmptyString(item, 2))) {
    errors.push(`${id}: reading must contain 2–4 items`);
  }
  if (!inRange(article.sources, 0, 3)) {
    errors.push(`${id}: sources must contain 0–3 items`);
  } else {
    for (const source of article.sources) {
      if (!nonEmptyString(source?.label, 2) || !/^https?:\/\//.test(source?.url ?? "")) {
        errors.push(`${id}: source must have a label and an HTTP(S) URL`);
      }
    }
  }
  if (!["established", "interpretive"].includes(article.editorialStatus)) {
    errors.push(`${id}: editorialStatus must be established or interpretive`);
  }
  if (allStrings(article).some((value) => /\?{2,}|？{2,}|__placeholder|\bTODO\b/i.test(value))) {
    errors.push(`${id}: article contains placeholder or padding text`);
  }
  for (const [field, passages] of [
    ["overview", article.overview ?? []],
    ["history", [article.history]],
    ["placement", [article.placement]],
  ]) {
    for (const sentence of passages
      .flatMap((passage) => String(passage ?? "").split(/[。！？!?]/))
      .map((value) => value.trim())
      .filter((value) => value.length >= 10)) {
      const key = `${field}|${sentence}`;
      const ids = sentenceUsage.get(key) ?? new Set();
      ids.add(id);
      sentenceUsage.set(key, ids);
    }
  }
}

for (const id of Object.keys(content)) {
  if (!expected[id]) errors.push(`${id}: article does not match a named coordinate`);
}

for (const [key, ids] of sentenceUsage) {
  if (ids.size < 6) continue;
  const [field, sentence] = key.split("|");
  errors.push(`${field}: repeated template sentence across ${ids.size} articles: “${sentence}”`);
}

if (errors.length) {
  console.error(`Wiki content validation failed with ${errors.length} issue(s):`);
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const statusCounts = Object.values(content).reduce(
  (counts, article) => ({ ...counts, [article.editorialStatus]: (counts[article.editorialStatus] ?? 0) + 1 }),
  {},
);
const sourceCount = Object.values(content).reduce((count, article) => count + article.sources.length, 0);
console.log(
  `Validated ${Object.keys(content).length} complete Wiki articles across ${files.length} files ` +
    `(${statusCounts.established ?? 0} established, ${statusCounts.interpretive ?? 0} interpretive, ` +
    `${sourceCount} source links).`,
);
