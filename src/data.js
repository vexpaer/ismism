import catalogAliases from "./catalog-aliases.json";
import catalogTitles from "./catalog-titles.json";

export const QUADRANTS = [
  {
    id: 1,
    name: "秩序",
    english: "Order",
    row: "场域",
    column: "现象",
    color: "#d4b25d",
    description: "从共同场域中的可见结构、规则与稳定关系出发。",
  },
  {
    id: 2,
    name: "冲突",
    english: "Conflict",
    row: "场域",
    column: "目的",
    color: "#c94d3d",
    description: "从共同场域中的目标竞争、张力与方向分歧出发。",
  },
  {
    id: 3,
    name: "中心",
    english: "Center",
    row: "本体",
    column: "现象",
    color: "#315c72",
    description: "追问现象背后的主体、尺度、核心或最终根据。",
  },
  {
    id: 4,
    name: "虚无",
    english: "Nothingness",
    row: "本体",
    column: "目的",
    color: "#5b5363",
    description: "追问目的、根据与意义在极限处如何瓦解或转化。",
  },
];

const entry = (
  id,
  title,
  english,
  summary,
  {
    children = [],
    thesis,
    history,
    debate,
    aliases = [],
    reading = [],
    status = "published",
    contentLevel = "curated",
  } = {},
) => ({
  id,
  title,
  english,
  summary,
  thesis: thesis ?? summary,
  history:
    history ??
    "该词条仍在继续整理。站内说明用于呈现思想坐标与概念关系，不替代专业研究或原典阅读。",
  debate:
    debate ??
    "这套坐标提供一条可讨论的定位路径，而不是唯一、绝对或价值中立的分类结论。",
  aliases,
  reading,
  status,
  contentLevel,
  children,
});

const pending = (id, quadrant) =>
  entry(
    id,
    `${quadrant.name}向：待整理`,
    "Open coordinate",
    `这个${quadrant.name}坐标尚未录入完整词条。空位被有意保留，以呈现体系仍可生长。`,
    { status: "open" },
  );

const withOpenCoordinates = (id, children) =>
  QUADRANTS.map(
    (quadrant) =>
      children.find((child) => Number(child.id.split("-").at(-1)) === quadrant.id) ??
      pending(`${id}-${quadrant.id}`, quadrant),
  );

const physicalism = entry(
  "1-1-1",
  "物理主义",
  "Physicalism",
  "认为世界中的事实最终依赖于物理事实，心理与社会现象也必须与物理世界保持一致。",
  {
    thesis: "没有与物理事实完全相同、却在其他事实上不同的可能世界。",
    history:
      "现代物理主义承接自然主义传统，并在心灵哲学、科学哲学和因果解释问题中形成多种版本。",
    debate:
      "核心争论包括意识能否被还原、规范性如何进入自然世界，以及物理学自身是否提供封闭的本体论。",
    reading: ["自然主义与物理主义", "心身问题", "还原与涌现"],
    children: withOpenCoordinates("1-1-1", [
      entry(
        "1-1-1-1",
        "科学独断论",
        "Scientific Dogmatism",
        "把特定科学结论或方法抬升为不可修正的终极裁判。",
        {
          thesis: "科学的权威被误读为结论不可修订，方法上的成功被扩张为对所有问题的独占解释权。",
          debate: "它需要与尊重证据的科学实在论区分：批判对象不是科学，而是对科学权威的僵化使用。",
        },
      ),
      entry(
        "1-1-1-2",
        "有机进化论",
        "Organic Evolutionism",
        "以演化、适应与组织涌现解释生命形式及其历史变化。",
        {
          thesis: "复杂秩序可以从差异、选择与持续反馈中形成，而无需预设静止不变的本质。",
          history: "演化思想从生物学扩展至社会理论和认识论时，产生了富有解释力也充满争议的类比。",
          debate: "需要警惕把描述性的生物演化直接变成社会规范，尤其是社会达尔文主义式的跳跃。",
          reading: ["演化论", "复杂系统", "涌现"],
        },
      ),
      entry(
        "1-1-1-3",
        "科学消费主义",
        "Scientific Consumerism",
        "把科学知识包装为可消费的身份、结论或权威符号。",
        {
          thesis: "知识消费可以制造理解的表象，却省略方法、证据不确定性与可修正过程。",
          debate: "普及与消费并非天然对立；问题在于复杂性被压缩后，受众是否仍能辨认知识的边界。",
        },
      ),
      entry(
        "1-1-1-4",
        "宇宙悲观主义",
        "Cosmic Pessimism",
        "从宇宙尺度审视人的中心地位、意义愿望与有限处境。",
        {
          thesis: "宇宙对人的价值诉求并无保证，意义必须在这种不保证之中被重新提出。",
          debate: "承认尺度上的非中心性不必推出生活毫无价值；两者之间仍需要额外论证。",
        },
      ),
    ]),
  },
);

const scientificRealism = entry(
  "1-1",
  "科学实在论",
  "Scientific Realism",
  "科学理论不仅组织经验，也试图描述一个独立于观察者而存在的世界。",
  {
    thesis: "成熟科学理论的成功，至少部分来自其对不可直接观察实体和结构的近真描述。",
    history: "科学实在论在二十世纪围绕理论实体、解释成功与科学革命展开持续争论。",
    debate: "反实在论者强调欠决定性、历史断裂与经验等价理论，质疑成功能否保证真理。",
    children: withOpenCoordinates("1-1", [
      physicalism,
      entry("1-1-2", "建构论", "Constructivism", "知识对象的意义和秩序在实践、语言与共同体中被建构。"),
      entry("1-1-3", "认知主义", "Cognitivism", "以表征、信息加工与认知结构解释心智活动。"),
      entry("1-1-4", "行为主义", "Behaviorism", "以可观察行为及其与环境的关系作为解释中心。"),
    ]),
  },
);

const roots = [
  entry(
    "1",
    "形而下学",
    "Infraphysics",
    "从自然、经验与可观察世界出发，追问知识体系如何获得现实支点。",
    {
      thesis: "天真的前反思状态如何被悬置、检验并重建为可讨论的世界图景？",
      children: withOpenCoordinates("1", [
        scientificRealism,
        entry("1-2", "宗教实在论", "Religious Realism", "宗教对象被理解为不依赖个体信念而存在的实在。"),
        entry("1-3", "庸俗的唯我论", "Vulgar Solipsism", "把个人视角未经论证地当作世界的唯一尺度。"),
        entry("1-4", "平庸主义", "Mediocrism", "以习惯、常识与平均状态消解思想的风险和差异。"),
      ]),
    },
  ),
  entry(
    "2",
    "形而上学",
    "Metaphysics",
    "研究存在、根据、同一性、因果与可能性的最一般结构。",
    {
      children: withOpenCoordinates("2", [
        entry("2-1", "在场形而上学", "Metaphysics of Presence", "把直接在场、同一与可把握性视为意义和真理的基础。"),
        entry("2-2", "辩证形而上学", "Dialectical Metaphysics", "通过矛盾、否定与转化理解存在结构的运动。"),
        entry("2-3", "表现形而上学", "Metaphysics of Representation", "考察世界如何通过表象、模型和再现成为可理解对象。"),
        entry("2-4", "哲学的认知陷阱", "Philosophical Traps", "收集把语言习惯、直觉或分类误当成本体事实的常见错误。"),
      ]),
    },
  ),
  entry(
    "3",
    "观念论",
    "Idealism",
    "研究经验、意识、观念与世界结构之间无法轻易切开的关系。",
    {
      children: withOpenCoordinates("3", [
        entry("3-1", "现象学", "Phenomenology", "描述事物如何向意识显现，并悬置未经检验的自然态度。"),
        entry("3-2", "德国观念论", "German Idealism", "从主体性、自由与理性整体性重建经验条件。"),
        entry("3-3", "生存论", "Existential Ontology", "从人的有限存在、抉择与世界关系追问存在。"),
        entry("3-4", "符号学", "Semiotics", "研究符号如何生产、传递并改变意义。"),
      ]),
    },
  ),
  entry(
    "4",
    "实践",
    "Praxis",
    "把思想放回行动、制度、生产、组织与共同生活之中。",
    {
      children: withOpenCoordinates("4", [
        entry("4-1", "政治·经济·意识形态批判", "Critique", "分析权力、生产关系和观念如何共同塑造现实。"),
        entry("4-2", "现实的正规化", "Normalization", "研究制度如何把特定行为和身份制造为正常。"),
        entry("4-3", "建设理想社会", "Social Construction", "比较理想共同体如何被设计、组织与实践。"),
        entry("4-4", "不可避免的失落", "Inevitable Loss", "面对行动结果、理想消耗与历史挫折。"),
      ]),
    },
  ),
  entry(
    "5",
    "现代性",
    "Modernity",
    "考察现代世界对等级、绝对性、主体和进步叙事的继承与拆解。",
    {
      children: withOpenCoordinates("5", [
        entry("5-1", "理念等级制", "Ideal Hierarchy", "思想、价值和主体如何被排列进垂直秩序。"),
        entry("5-2", "绝对者的绝路", "The Absolute's Impasse", "追踪绝对根据在现代思想中的反复建立与崩解。"),
      ]),
    },
  ),
];

const treeIndex = new Map();
const indexTree = (node) => {
  treeIndex.set(node.id, node);
  node.children.forEach(indexTree);
};
roots.forEach(indexTree);

const coordinateSort = ([left], [right]) => {
  const a = left.split("-").map(Number);
  const b = right.split("-").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if ((a[index] ?? -1) !== (b[index] ?? -1)) return (a[index] ?? -1) - (b[index] ?? -1);
  }
  return 0;
};

for (const [id, title] of Object.entries(catalogTitles).sort(coordinateSort)) {
  const aliases = catalogAliases[id] ?? [];
  const existing = treeIndex.get(id);
  if (existing) {
    existing.title = title;
    existing.aliases = [...new Set([...existing.aliases, ...aliases])];
    if (existing.status === "open") {
      existing.english = `ISM Coordinate ${id}`;
      existing.summary = "";
      existing.thesis = "";
      existing.history = "";
      existing.debate = "";
      existing.status = "published";
      existing.contentLevel = "coordinate";
    }
    continue;
  }

  const parentId = id.split("-").slice(0, -1).join("-");
  const parent = treeIndex.get(parentId);
  if (!parent) throw new Error(`Reviewed coordinate ${id} has no parent ${parentId}.`);
  const node = entry(id, title, `ISM Coordinate ${id}`, "", {
    aliases,
    contentLevel: "coordinate",
  });
  parent.children.push(node);
  treeIndex.set(id, node);
}

const fillOpenSlots = (node) => {
  const depth = node.id.split("-").length;
  if (depth < 4 && node.children.length) {
    for (const quadrant of QUADRANTS) {
      const id = `${node.id}-${quadrant.id}`;
      if (!node.children.some((child) => child.id === id)) node.children.push(pending(id, quadrant));
    }
    node.children.sort((left, right) => Number(left.id.split("-").at(-1)) - Number(right.id.split("-").at(-1)));
  }
  node.children.forEach(fillOpenSlots);
};
roots.forEach(fillOpenSlots);

export const ROOTS = roots;
export const CATALOG_NAMED_COUNT = Object.keys(catalogTitles).length + roots.length;

export const ROOT_FACE_ORDER = {
  right: roots[3],
  left: roots[2],
  top: roots[4],
  bottom: null,
  front: roots[0],
  back: roots[1],
};

export const ALL_NODES = [];
export const NODE_MAP = new Map();

const visit = (node, parent = null) => {
  node.parent = parent?.id ?? null;
  node.depth = node.id.split("-").length;
  node.quadrant = node.depth > 1 ? QUADRANTS[Number(node.id.split("-").at(-1)) - 1] : null;
  ALL_NODES.push(node);
  NODE_MAP.set(node.id, node);
  node.children.forEach((child) => visit(child, node));
};

ROOTS.forEach((root) => visit(root));

for (const node of ALL_NODES) {
  if (node.contentLevel !== "coordinate") continue;
  const path = [];
  let current = node;
  while (current) {
    path.unshift(current);
    current = current.parent ? NODE_MAP.get(current.parent) : null;
  }
  const root = path[0];
  const placement = path.map((item) => `「${item.title}」`).join(" → ");
  node.summary = `「${node.title}」是《主义主义》坐标表中的已命名词条，位于${root.title}路径 ${node.id}。`;
  node.thesis = `本页首先记录它在原始坐标表中的稳定位置：${placement}。这一位置构成继续解释和争论的入口。`;
  node.history = `当前基础词条已完成人工识别与坐标校对。更完整的思想史背景、代表文本和术语沿革将依据可核查资料继续扩展。`;
  node.debate = `需要进一步讨论「${node.title}」与同层坐标的边界，以及把它归入“${node.quadrant?.name ?? "总域"}”位置的理由是否充分。`;
}

for (const node of ALL_NODES) {
  if (node.depth > 4) throw new Error(`Coordinate ${node.id} exceeds the four-level model.`);
  if (node.parent && !node.id.startsWith(`${node.parent}-`)) {
    throw new Error(`Coordinate ${node.id} does not extend parent ${node.parent}.`);
  }
  if (node.depth > 1 && !/^[1-4]$/.test(node.id.split("-").at(-1))) {
    throw new Error(`Coordinate ${node.id} uses an invalid quadrant.`);
  }
  const occupied = new Set();
  for (const child of node.children) {
    const digit = child.id.split("-").at(-1);
    if (occupied.has(digit)) throw new Error(`Coordinate ${node.id} repeats quadrant ${digit}.`);
    occupied.add(digit);
  }
}

export const getPath = (nodeOrId) => {
  let node = typeof nodeOrId === "string" ? NODE_MAP.get(nodeOrId) : nodeOrId;
  const path = [];
  while (node) {
    path.unshift(node);
    node = node.parent ? NODE_MAP.get(node.parent) : null;
  }
  return path;
};

export const publishedNodes = () => ALL_NODES.filter((node) => node.status === "published");
