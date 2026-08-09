const articleLoaders = import.meta.glob("./content/*.json", { import: "default" });
const fileCache = new Map();

const fileForCoordinate = (id) => {
  const [root, branch] = id.split("-");
  if (!branch) return "./content/roots.json";
  if (root === "5") return "./content/root5.json";
  const half = Number(branch) <= 2 ? "a" : "b";
  return `./content/root${root}-${half}.json`;
};

const loadFile = (file) => {
  if (!fileCache.has(file)) {
    const loader = articleLoaders[file];
    if (!loader) throw new Error(`No Wiki content bundle is registered for ${file}.`);
    const request = loader().catch((error) => {
      if (fileCache.get(file) === request) fileCache.delete(file);
      throw error;
    });
    fileCache.set(file, request);
  }
  return fileCache.get(file);
};

export const loadArticle = async (id) => {
  const file = fileForCoordinate(id);
  const articles = await loadFile(file);
  const article = articles[id];
  if (!article) throw new Error(`Wiki article ${id} is missing from ${file}.`);
  return article;
};
