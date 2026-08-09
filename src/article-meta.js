const KIND_LABELS = {
  concept: "概念导论",
  discipline: "思想领域",
  position: "哲学立场",
  tradition: "思想传统",
  topic: "主题导读",
  person: "思想家主题",
  "person-topic": "思想家主题",
  "text-topic": "文本主题",
  "person-text-tradition": "人物与文本传统",
  "site-interpretation": "站内解释性坐标",
  "interpretive-coordinate": "站内解释性坐标",
};

export const articleKindLabel = (kind, editorialStatus) => {
  if (KIND_LABELS[kind]) return KIND_LABELS[kind];
  if (/\p{Script=Han}/u.test(kind)) return kind;
  return editorialStatus === "interpretive" ? "站内解释性坐标" : "概念导论";
};
