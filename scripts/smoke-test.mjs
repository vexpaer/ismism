import { chromium } from "playwright-core";

const baseUrl = process.env.ISMISM_URL ?? "http://127.0.0.1:5173/ismism/";
const executablePath =
  process.env.EDGE_PATH ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];

page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});

const clickCoordinate = async (id) => {
  await page.locator(`[data-choice-id="${id}"]`).click();
  await page.waitForURL(new RegExp(`#\\/cube\\/${id.replaceAll("-", "\\/")}$`));
  await page.waitForTimeout(160);
};

await page.goto(baseUrl, { waitUntil: "networkidle" });
const canvas = page.locator("canvas.cube-canvas");
await canvas.waitFor({ state: "visible" });
await page.waitForTimeout(900);
const canvasBox = await canvas.boundingBox();
if (!canvasBox) throw new Error("Cube canvas has no bounding box.");
await page.mouse.click(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
await page.waitForURL(/#\/cube\/1$/);

await page.goto(`${baseUrl}#/cube`, { waitUntil: "networkidle" });
await clickCoordinate("1");
await clickCoordinate("1-1");
await clickCoordinate("1-1-1");
await clickCoordinate("1-1-1-2");

await page.locator('[data-open-wiki="1-1-1-2"]').click();
await page.waitForURL(/#\/wiki\/1-1-1-2$/);
await page.locator(".wiki-article").waitFor({ state: "visible" });
await page.locator("#wiki-title").waitFor({ state: "visible" });
const wikiTitle = await page.locator("#wiki-title").textContent();
if (wikiTitle?.trim() !== "有机进化论") errors.push(`unexpected wiki title: ${wikiTitle}`);
if ((await page.locator(".wiki-prose p").count()) !== 2) errors.push("Wiki overview does not have 2 paragraphs");
if ((await page.locator(".wiki-key-grid article").count()) !== 3) errors.push("Wiki does not have 3 key ideas");
if ((await page.locator(".wiki-depth-grid li").count()) < 2) errors.push("Wiki debates are incomplete");
if ((await page.locator(".wiki-reading span").count()) < 2) errors.push("Wiki reading list is incomplete");

await page.goto(`${baseUrl}#/wiki/2-4-3`, { waitUntil: "networkidle" });
await page.locator(".wiki-article").waitFor({ state: "visible" });
await page.waitForTimeout(120);
if ((await page.evaluate(() => window.scrollY)) > 1) errors.push("Wiki navigation did not reset scroll position");
if (!(await page.locator(".wiki-kind").textContent())?.includes("站内坐标解释")) {
  errors.push("interpretive coordinate is missing its editorial status");
}

await page.goto(`${baseUrl}#/wiki/5-3`, { waitUntil: "networkidle" });
await page.waitForURL(/#\/cube\/5\/3$/);
if (!(await page.locator("#stage-hint").textContent())?.includes("待整理")) {
  errors.push("open Wiki coordinate did not fall back to its cube explanation");
}

await page.goto(`${baseUrl}#/cube`, { waitUntil: "networkidle" });
await page.keyboard.press("/");
await page.locator("#search-input").fill("现象学");
await page.locator('[data-search-node="3-1"]').click();
await page.waitForURL(/#\/wiki\/3-1$/);

await page.goto(`${baseUrl}#/cube`, { waitUntil: "networkidle" });
await page.keyboard.press("/");
await page.locator("#search-input").fill("伦理智性主义");
await page.locator('[data-search-node="2-1-2-1"]').waitFor({ state: "visible" });
await page.keyboard.press("Escape");

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}#/cube/1/1/1`, { waitUntil: "networkidle" });
const viewport = await page.evaluate(() => ({
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
}));
if (viewport.scrollWidth > viewport.clientWidth + 1) {
  errors.push(`mobile horizontal overflow: ${viewport.scrollWidth} > ${viewport.clientWidth}`);
}

await page.setViewportSize({ width: 768, height: 1024 });
await page.goto(`${baseUrl}#/wiki/1-1-1-2`, { waitUntil: "networkidle" });
await page.locator(".wiki-article").waitFor({ state: "visible" });
const tabletViewport = await page.evaluate(() => ({
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
}));
if (tabletViewport.scrollWidth > tabletViewport.clientWidth + 1) {
  errors.push(`tablet Wiki overflow: ${tabletViewport.scrollWidth} > ${tabletViewport.clientWidth}`);
}

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${baseUrl}#/wiki/1-1-1-2`, { waitUntil: "networkidle" });
await page.locator(".wiki-article").waitFor({ state: "visible" });
const reducedMotionStyle = await page.locator(".wiki-header > *").first().getAttribute("style");
if (reducedMotionStyle?.match(/transform|opacity|visibility/)) {
  errors.push(`reduced-motion Wiki still received GSAP inline styles: ${reducedMotionStyle}`);
}

await page.goto(`${baseUrl}#/cube/5`, { waitUntil: "networkidle" });
const openCoordinate = page.locator('[data-choice-id="5-3"]');
await openCoordinate.waitFor({ state: "visible" });
if ((await openCoordinate.getAttribute("aria-disabled")) === "true") {
  errors.push("open coordinate is interactive but exposed as aria-disabled");
}
if (!(await openCoordinate.getAttribute("aria-label"))?.includes("查看坐标说明")) {
  errors.push("open coordinate is missing an accessible explanatory label");
}

await browser.close();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  "Smoke test passed: cube drill-down, complete Wiki content, search, mobile width, reduced motion, and open-coordinate semantics.",
);
