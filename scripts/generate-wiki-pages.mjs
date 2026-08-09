import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { articleKindLabel } from "../src/article-meta.js";

const titles = JSON.parse(await readFile(new URL("../src/catalog-titles.json", import.meta.url), "utf8"));
const roots = {
  1: "形而下学",
  2: "形而上学",
  3: "观念论",
  4: "实践",
  5: "现代性",
};
const entries = { ...roots, ...titles };
const base = "/ismism/";
const contentFiles = (await readdir("src/content")).filter((file) => file.endsWith(".json"));
const articles = Object.assign(
  {},
  ...(await Promise.all(
    contentFiles.map(async (file) => JSON.parse(await readFile(join("src/content", file), "utf8"))),
  )),
);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

for (const [id, title] of Object.entries(entries)) {
  const article = articles[id];
  const directory = join("dist", "wiki", id);
  await mkdir(directory, { recursive: true });
  const target = `${base}#/wiki/${id}`;
  const directUrl = `https://vexpaer.github.io${base}wiki/${id}/`;
  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(article.definition)}">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="${directUrl}">
    <title>${escapeHtml(title)} · 主义主义</title>
    <script>location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <main itemscope itemtype="https://schema.org/Article">
      <h1>${escapeHtml(title)}</h1>
      <p>思想坐标 ${id} · ${escapeHtml(articleKindLabel(article.kind, article.editorialStatus))}</p>
      <p itemprop="description">${escapeHtml(article.definition)}</p>
      ${article.overview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n      ")}
      <h2>理解支点</h2>
      <ul>
        ${article.keyIdeas
          .map((idea) => `<li><strong>${escapeHtml(idea.title)}</strong>：${escapeHtml(idea.text)}</li>`)
          .join("\n        ")}
      </ul>
      <p><a href="${target}">进入完整 Wiki 词条</a></p>
    </main>
  </body>
</html>`;
  await writeFile(join(directory, "index.html"), html, "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://vexpaer.github.io/ismism/</loc></url>
${Object.keys(entries)
  .map((id) => `  <url><loc>https://vexpaer.github.io/ismism/wiki/${id}/</loc></url>`)
  .join("\n")}
</urlset>\n`;
await writeFile("dist/sitemap.xml", sitemap, "utf8");

console.log(`Generated ${Object.keys(entries).length} static Wiki entry routes and sitemap.xml.`);
