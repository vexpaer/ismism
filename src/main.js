import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { gsap } from "gsap";

import "./styles.css";
import {
  ALL_NODES,
  CATALOG_NAMED_COUNT,
  NODE_MAP,
  QUADRANTS,
  ROOT_FACE_ORDER,
  ROOTS,
  getPath,
  publishedNodes,
} from "./data.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#/cube" aria-label="主义主义首页">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span><b>主义主义</b><small>ISMISM</small></span>
    </a>
    <nav class="site-nav" aria-label="主要导航">
      <a href="#cube-stage">坐标体</a>
      <a href="#index">目录</a>
      <a href="#method">方法</a>
      <button class="text-button" type="button" data-search-open>搜索 <kbd>/</kbd></button>
    </nav>
  </header>

  <main id="main-content">
    <div id="explore-view">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow" id="coordinate-label">ISM CUBE · 思想坐标 000</p>
          <h1 id="hero-title">旋转世界，<br><em>进入一种<br>解释。</em></h1>
          <p class="hero-lede" id="hero-summary">
            这不是可以被打乱的魔方，而是一套坐标稳定的思想索引。旋转用于观察，点击用于定位。
          </p>

          <div class="breadcrumbs" id="breadcrumbs" aria-label="当前位置"></div>

          <div class="hero-actions">
            <button class="primary-button" type="button" id="start-button">开始定位</button>
            <button class="secondary-button" type="button" id="current-wiki-button" hidden>阅读当前词条</button>
            <button class="icon-button" type="button" id="back-button" aria-label="返回上一层" hidden>↙</button>
          </div>

          <dl class="route-facts" aria-label="坐标说明">
            <div><dt>X</dt><dd>现象 → 目的</dd></div>
            <div><dt>Y</dt><dd>场域 → 本体</dd></div>
            <div><dt>Z</dt><dd>领域 → 词条</dd></div>
          </dl>
        </div>

        <div class="cube-column">
          <div class="cube-frame" id="cube-stage">
            <div class="canvas-mount" id="canvas-mount" aria-hidden="true"></div>
            <div class="stage-grid" aria-hidden="true"></div>
            <span class="axis axis-top">场域</span>
            <span class="axis axis-bottom">本体</span>
            <span class="axis axis-left">现象</span>
            <span class="axis axis-right">目的</span>
            <div class="cube-fallback" id="cube-fallback" hidden>
              <strong>三维视图暂不可用</strong>
              <span>仍可使用下方的文字坐标完成导航。</span>
            </div>
            <p class="stage-hint" id="stage-hint">拖动旋转 · 点击一个面进入</p>
          </div>

          <section class="choice-panel" aria-labelledby="choice-title">
            <div class="choice-heading">
              <div>
                <p class="micro-label">ACCESSIBLE MAP</p>
                <h2 id="choice-title" tabindex="-1">选择思想领域</h2>
              </div>
              <span class="live-status" id="live-status" aria-live="polite"></span>
            </div>
            <div class="choice-grid root-choices" id="choice-grid"></div>
          </section>

          <aside class="arrival-card" id="arrival-card" hidden aria-live="polite"></aside>
        </div>
      </section>

      <section class="thesis-band" aria-label="网站宣言">
        <p>我们用主义理解世界</p>
        <span aria-hidden="true">/</span>
        <p>也用主义误解世界</p>
        <span aria-hidden="true">/</span>
        <p>坐标不是结论，而是争论的起点</p>
      </section>

      <section class="method-section" id="method" aria-labelledby="method-title">
        <div class="section-heading">
          <p class="eyebrow">THE COORDINATE</p>
          <h2 id="method-title">四象不是四种颜色，<br>而是两条问题轴。</h2>
        </div>
        <div class="method-layout">
          <div class="coordinate-diagram" role="img" aria-label="横轴从现象到目的，纵轴从场域到本体，四个象限依次为秩序、冲突、中心与虚无">
            <span class="diagram-axis top">场域</span>
            <span class="diagram-axis bottom">本体</span>
            <span class="diagram-axis left">现象</span>
            <span class="diagram-axis right">目的</span>
            ${QUADRANTS.map(
              (quadrant) => `
                <article style="--quadrant-color:${quadrant.color}">
                  <span>0${quadrant.id}</span>
                  <h3>${quadrant.name}</h3>
                  <p>${quadrant.row} × ${quadrant.column}</p>
                </article>`,
            ).join("")}
          </div>
          <div class="method-copy">
            <p class="large-copy">PDF 中的思想表不是一条从上到下的排行榜，而是一棵能够递归展开的四叉树。</p>
            <p>五个总域构成外层入口；进入之后，每一层都保留相同的四象位置。一个词条的编号，也就是它被定位的完整路径。目前已有 ${CATALOG_NAMED_COUNT} 个已校对节点可以打开 Wiki。</p>
            <ol>
              <li><b>总域</b><span>形而下学、形而上学、观念论、实践、现代性</span></li>
              <li><b>母题</b><span>总域中的四个核心问题群</span></li>
              <li><b>谱系</b><span>母题中的理论家族</span></li>
              <li><b>词条</b><span>最终抵达的主义、理论或概念</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section class="index-section" id="index" aria-labelledby="index-title">
        <div class="section-heading index-heading">
          <div>
            <p class="eyebrow">FIELD INDEX</p>
            <h2 id="index-title">不旋转，也能抵达。</h2>
          </div>
          <button class="secondary-button" type="button" data-search-open>搜索全部词条</button>
        </div>
        <div class="field-index" id="field-index"></div>
      </section>

      <section class="principle-section" aria-labelledby="principle-title">
        <p class="eyebrow">A MAP WITH AN ARGUMENT</p>
        <h2 id="principle-title">它不是“中立百科”。</h2>
        <div class="principle-grid">
          <p>每个坐标都包含判断，因此每个词条都会解释“为什么放在这里”，并允许读者反驳。</p>
          <p>树状位置只表示主坐标。影响、继承、反对与误读通过关联词条表达，不强行压缩成唯一谱系。</p>
          <p>尚未整理的位置保持为空心坐标，让体系的边界、缺口和继续生长的可能都可见。</p>
        </div>
      </section>
    </div>

    <section class="wiki-view" id="wiki-view" hidden aria-labelledby="wiki-title"></section>
  </main>

  <footer class="site-footer">
    <a class="brand footer-brand" href="#/cube"><b>主义主义</b><small>ISMISM</small></a>
    <p>一套可旋转、可质疑、仍在生长的思想坐标。</p>
    <a href="https://github.com/vexpaer/ismism" rel="noreferrer">GitHub ↗</a>
  </footer>

  <dialog class="search-dialog" id="search-dialog">
    <form method="dialog" class="search-shell">
      <div class="search-topline">
        <label for="search-input">搜索思想词条</label>
        <button class="icon-button" value="close" aria-label="关闭搜索">×</button>
      </div>
      <input id="search-input" type="search" autocomplete="off" placeholder="例如：物理主义 / Phenomenology / 1-1-1-2" />
      <div class="search-results" id="search-results" aria-live="polite"></div>
      <p class="search-help">输入名称、英文名或坐标；按 Esc 关闭。</p>
    </form>
  </dialog>
`;

const elements = {
  exploreView: document.querySelector("#explore-view"),
  wikiView: document.querySelector("#wiki-view"),
  coordinateLabel: document.querySelector("#coordinate-label"),
  heroTitle: document.querySelector("#hero-title"),
  heroSummary: document.querySelector("#hero-summary"),
  breadcrumbs: document.querySelector("#breadcrumbs"),
  startButton: document.querySelector("#start-button"),
  wikiButton: document.querySelector("#current-wiki-button"),
  backButton: document.querySelector("#back-button"),
  cubeFrame: document.querySelector("#cube-stage"),
  canvasMount: document.querySelector("#canvas-mount"),
  stageHint: document.querySelector("#stage-hint"),
  fallback: document.querySelector("#cube-fallback"),
  choiceTitle: document.querySelector("#choice-title"),
  choiceGrid: document.querySelector("#choice-grid"),
  liveStatus: document.querySelector("#live-status"),
  arrivalCard: document.querySelector("#arrival-card"),
  fieldIndex: document.querySelector("#field-index"),
  searchDialog: document.querySelector("#search-dialog"),
  searchInput: document.querySelector("#search-input"),
  searchResults: document.querySelector("#search-results"),
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");

const routeForCube = (node) =>
  node ? `#/cube/${node.id.replaceAll("-", "/")}` : "#/cube";
const routeForWiki = (node) => `#/wiki/${node.id}`;

const parseRoute = () => {
  const route = window.location.hash || "#/cube";
  const parts = route.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "wiki") {
    return { view: "wiki", node: NODE_MAP.get(parts[1]) ?? ROOTS[0] };
  }
  if (parts[0] === "cube" && parts.length > 1) {
    return { view: "cube", node: NODE_MAP.get(parts.slice(1).join("-")) ?? null };
  }
  return { view: "cube", node: null };
};

const makeLabelTexture = ({ code, title, english, color, quadrant, tool = false }) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  const gradient = context.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, "#f0eadf");
  gradient.addColorStop(1, "#cfc8ba");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 1024);

  context.strokeStyle = "rgba(23, 24, 19, .22)";
  context.lineWidth = 3;
  context.strokeRect(34, 34, 956, 956);
  context.beginPath();
  context.moveTo(512, 34);
  context.lineTo(512, 990);
  context.moveTo(34, 512);
  context.lineTo(990, 512);
  context.stroke();

  context.fillStyle = color ?? "#171813";
  context.fillRect(64, 66, tool ? 160 : 112, 10);

  context.fillStyle = "#171813";
  context.font = '600 42px Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif';
  context.textBaseline = "top";
  context.fillText(code, 64, 105);

  const chars = [...title];
  const lineLength = title.length > 7 ? 5 : 4;
  const titleLines = [];
  while (chars.length) titleLines.push(chars.splice(0, lineLength).join(""));
  const fontSize = title.length > 9 ? 98 : title.length > 5 ? 114 : 142;
  context.font = `700 ${fontSize}px "Noto Serif SC", "Songti SC", SimSun, serif`;
  titleLines.slice(0, 3).forEach((line, index) => {
    context.fillText(line, 64, 260 + index * (fontSize + 24));
  });

  context.font = '500 34px Inter, "Noto Sans SC", sans-serif';
  context.fillStyle = "rgba(23, 24, 19, .72)";
  context.fillText(english ?? "", 66, 844);

  if (quadrant) {
    context.font = '600 29px Inter, "Noto Sans SC", sans-serif';
    context.fillStyle = color;
    context.fillText(`${quadrant.row} × ${quadrant.column}`, 66, 900);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
};

const makeMaterial = (options = {}) =>
  new THREE.MeshStandardMaterial({
    color: options.color ?? "#d8d1c4",
    map: options.map ?? null,
    roughness: 0.68,
    metalness: 0.04,
    transparent: true,
    opacity: options.opacity ?? 1,
    side: THREE.FrontSide,
  });

class CubeScene {
  constructor(mount, { onSelect, onTool }) {
    this.mount = mount;
    this.onSelect = onSelect;
    this.onTool = onTool;
    this.activeGroup = null;
    this.clickable = [];
    this.hovered = null;
    this.activeTimeline = null;
    this.floatTween = null;
    this.locked = false;
    this.pointerStart = null;
    this.reducedMotion = false;
    this.stageVisible = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    this.camera.position.set(0, 0, 8.2);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = "cube-canvas";
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    mount.append(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.rotateSpeed = 0.62;
    this.controls.minPolarAngle = Math.PI * 0.16;
    this.controls.maxPolarAngle = Math.PI * 0.84;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.scene.add(new THREE.HemisphereLight("#fff8e8", "#2a3440", 2.6));
    const keyLight = new THREE.DirectionalLight("#fff6dd", 4.2);
    keyLight.position.set(4, 6, 8);
    this.scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight("#58798b", 2.2);
    rimLight.position.set(-6, 1, -4);
    this.scene.add(rimLight);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(mount);
    this.resize();

    this.renderer.domElement.addEventListener("pointerdown", (event) => {
      this.pointerStart = { x: event.clientX, y: event.clientY };
    });
    this.renderer.domElement.addEventListener("pointermove", (event) => this.handleHover(event));
    this.renderer.domElement.addEventListener("pointerleave", () => this.setHovered(null));
    this.renderer.domElement.addEventListener("pointerup", (event) => this.handlePointerUp(event));

    this.motionMedia = gsap.matchMedia();
    this.motionMedia.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        coarsePointer: "(pointer: coarse)",
      },
      ({ conditions }) => {
        this.reducedMotion = conditions.reduceMotion;
        this.controls.enableDamping = !conditions.reduceMotion;
        this.controls.rotateSpeed = conditions.coarsePointer ? 0.42 : 0.62;
        if (this.reducedMotion) this.stopFloat();
      },
    );

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.stageVisible = entry.isIntersecting;
        this.updateLoop();
      },
      { threshold: 0.04 },
    );
    this.intersectionObserver.observe(mount);
    document.addEventListener("visibilitychange", () => this.updateLoop());
    this.updateLoop();
  }

  resize() {
    const width = Math.max(this.mount.clientWidth, 1);
    const height = Math.max(this.mount.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  updateLoop() {
    if (document.hidden || !this.stageVisible) {
      this.renderer.setAnimationLoop(null);
      return;
    }
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  resetCamera() {
    this.camera.position.set(0, 0, 8.2);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  disposeObject(object) {
    object.traverse((child) => {
      child.geometry?.dispose?.();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.filter(Boolean).forEach((material) => {
        material.map?.dispose?.();
        material.dispose?.();
      });
    });
  }

  clear() {
    this.stopFloat();
    this.activeTimeline?.kill();
    this.activeTimeline = null;
    this.locked = false;
    if (this.controls) this.controls.enabled = true;
    if (this.activeGroup) {
      this.scene.remove(this.activeGroup);
      this.disposeObject(this.activeGroup);
    }
    this.activeGroup = null;
    this.clickable = [];
    this.hovered = null;
  }

  setGroup(group, { intro = true } = {}) {
    this.clear();
    this.activeGroup = group;
    this.scene.add(group);
    this.resetCamera();
    if (intro && !this.reducedMotion) {
      gsap.fromTo(
        group.scale,
        { x: 0.78, y: 0.78, z: 0.78 },
        { x: 1, y: 1, z: 1, duration: 0.72, ease: "power3.out", overwrite: "auto" },
      );
      gsap.fromTo(group.position, { z: -0.5 }, { z: 0, duration: 0.8, ease: "power3.out" });
    }
    this.startFloat();
  }

  startFloat() {
    if (this.reducedMotion || !this.activeGroup) return;
    this.stopFloat();
    this.floatTween = gsap.to(this.activeGroup.position, {
      y: 0.1,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  stopFloat() {
    this.floatTween?.kill();
    this.floatTween = null;
  }

  showRoot({ intro = true } = {}) {
    const group = new THREE.Group();
    group.rotation.set(-0.16, 0.38, 0.025);
    const faces = [
      [ROOT_FACE_ORDER.right, "04", "#c94d3d"],
      [ROOT_FACE_ORDER.left, "03", "#315c72"],
      [ROOT_FACE_ORDER.top, "05", "#9c7448"],
      [null, "方法", "#171813"],
      [ROOT_FACE_ORDER.front, "01", "#d4b25d"],
      [ROOT_FACE_ORDER.back, "02", "#5b5363"],
    ];
    const materials = faces.map(([node, code, color]) =>
      makeMaterial({
        map: makeLabelTexture({
          code,
          title: node?.title ?? "坐标说明",
          english: node?.english ?? "METHOD / SEARCH",
          color,
          tool: !node,
        }),
      }),
    );
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(3.45, 3.45, 3.45, 8, 0.055), materials);
    mesh.userData.type = "root";
    mesh.userData.faceNodes = faces.map(([node]) => node);
    group.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 28),
      new THREE.LineBasicMaterial({ color: "#171813", transparent: true, opacity: 0.52 }),
    );
    edges.scale.setScalar(1.006);
    group.add(edges);

    this.setGroup(group, { intro });
    this.clickable = [mesh];
  }

  makeCubie(node, quadrant, position) {
    const geometry = new RoundedBoxGeometry(1.48, 1.48, 0.62, 6, 0.055);
    const sideMaterial = makeMaterial({ color: "#474943" });
    const backMaterial = makeMaterial({ color: "#23241f" });
    const frontMaterial = makeMaterial({
      map: makeLabelTexture({
        code: node.id,
        title: node.title,
        english: node.english,
        color: quadrant.color,
        quadrant,
      }),
    });
    const materials = [sideMaterial, sideMaterial.clone(), sideMaterial.clone(), sideMaterial.clone(), frontMaterial, backMaterial];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.copy(position);
    mesh.userData.type = "node";
    mesh.userData.node = node;
    mesh.userData.quadrant = quadrant;
    mesh.userData.baseScale = 1;
    if (node.status === "open") {
      frontMaterial.opacity = 0.58;
      sideMaterial.opacity = 0.7;
    }
    return mesh;
  }

  addDepthFrames(group, depth) {
    for (let index = 0; index < Math.min(depth, 3); index += 1) {
      const geometry = new THREE.BoxGeometry(3.2 - index * 0.12, 3.2 - index * 0.12, 0.08);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({
          color: index % 2 ? "#c94d3d" : "#315c72",
          transparent: true,
          opacity: 0.14 - index * 0.025,
        }),
      );
      edges.position.z = -0.75 - index * 0.34;
      edges.rotation.z = (index + 1) * 0.035;
      group.add(edges);
    }
  }

  showQuadrants(parent, { intro = true } = {}) {
    const group = new THREE.Group();
    const positions = [
      new THREE.Vector3(-0.79, 0.79, 0),
      new THREE.Vector3(0.79, 0.79, 0),
      new THREE.Vector3(-0.79, -0.79, 0),
      new THREE.Vector3(0.79, -0.79, 0),
    ];
    const meshes = QUADRANTS.map((quadrant, index) => {
      const node = parent.children.find((child) => Number(child.id.split("-").at(-1)) === quadrant.id);
      const mesh = this.makeCubie(node, quadrant, positions[index]);
      group.add(mesh);
      return mesh;
    });
    this.addDepthFrames(group, parent.depth);
    this.setGroup(group, { intro });
    this.clickable = meshes;
  }

  showArrival(node, { intro = true } = {}) {
    const group = new THREE.Group();
    const quadrant = node.quadrant ?? QUADRANTS[0];
    const mesh = this.makeCubie(node, quadrant, new THREE.Vector3(0, 0, 0.3));
    mesh.scale.setScalar(1.62);
    group.add(mesh);
    this.addDepthFrames(group, node.depth);
    this.setGroup(group, { intro });
    this.clickable = [mesh];
  }

  getMeshForNode(node) {
    return this.clickable.find((mesh) => mesh.userData.node?.id === node.id) ?? this.clickable[0] ?? null;
  }

  pointerFromEvent(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  getIntersection(event) {
    this.pointerFromEvent(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(this.clickable, false)[0] ?? null;
  }

  handleHover(event) {
    if (this.locked || event.pointerType === "touch") return;
    const intersection = this.getIntersection(event);
    this.setHovered(intersection?.object ?? null);
  }

  setHovered(mesh) {
    if (mesh === this.hovered) return;
    if (this.hovered?.userData.type === "node") {
      gsap.to(this.hovered.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: this.reducedMotion ? 0 : 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    this.hovered = mesh;
    if (mesh?.userData.type === "node") {
      gsap.to(mesh.scale, {
        x: 1.045,
        y: 1.045,
        z: 1.045,
        duration: this.reducedMotion ? 0 : 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    this.renderer.domElement.classList.toggle("is-hovering", Boolean(mesh));
  }

  handlePointerUp(event) {
    if (!this.pointerStart || this.locked) return;
    const distance = Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y);
    this.pointerStart = null;
    if (distance > 6) return;
    const intersection = this.getIntersection(event);
    if (!intersection) return;
    const mesh = intersection.object;
    if (mesh.userData.type === "root") {
      const materialIndex = intersection.face?.materialIndex ?? 0;
      const node = mesh.userData.faceNodes[materialIndex];
      if (node) this.onSelect(node, mesh, intersection);
      else this.onTool();
      return;
    }
    if (mesh.userData.node) this.onSelect(mesh.userData.node, mesh, intersection);
  }

  animateSelection(node, mesh, intersection, onComplete) {
    if (!mesh || this.reducedMotion) {
      onComplete();
      return;
    }
    this.stopFloat();
    this.activeTimeline?.kill();
    this.locked = true;
    this.controls.enabled = false;

    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    this.activeTimeline = timeline;
    timeline.addLabel("orient");

    if (mesh.userData.type === "root" && intersection?.face) {
      const normal = intersection.face.normal.clone().transformDirection(mesh.matrixWorld).normalize();
      timeline.to(
        this.camera.position,
        {
          x: normal.x * 8.2,
          y: normal.y * 8.2,
          z: normal.z * 8.2,
          duration: 0.54,
          onUpdate: () => this.camera.lookAt(0, 0, 0),
        },
        "orient",
      );
      const selectedIndex = intersection.face.materialIndex;
      const otherMaterials = mesh.material.filter((_, index) => index !== selectedIndex);
      timeline.to(otherMaterials, { opacity: 0.08, duration: 0.34, stagger: 0.025 }, "orient+=0.08");
      timeline.to(mesh.scale, { x: 1.16, y: 1.16, z: 1.16, duration: 0.48 }, "orient+=0.1");
    } else {
      const siblings = this.clickable.filter((candidate) => candidate !== mesh);
      const siblingMaterials = siblings.flatMap((candidate) => candidate.material);
      timeline.to(siblingMaterials, { opacity: 0.07, duration: 0.32, stagger: 0.018 }, "orient");
      timeline.to(
        siblings.map((candidate) => candidate.scale),
        { x: 0.82, y: 0.82, z: 0.82, duration: 0.4, stagger: 0.025 },
        "orient",
      );
      timeline.to(mesh.position, { x: 0, y: 0, z: 1.25, duration: 0.58 }, "orient+=0.08");
      timeline.to(mesh.scale, { x: 1.68, y: 1.68, z: 1.68, duration: 0.58 }, "orient+=0.08");
    }

    timeline.addLabel("swap", ">-0.04").call(
      () => {
        this.locked = false;
        this.controls.enabled = true;
        this.activeTimeline = null;
        onComplete();
      },
      [],
      "swap",
    );
  }
}

let currentNode = null;
let cubeScene = null;
let navigating = false;

const pushRoute = (hash) => {
  if (window.location.hash === hash) return;
  history.pushState(null, "", hash);
};

const renderBreadcrumbs = (node) => {
  const path = node ? getPath(node) : [];
  elements.breadcrumbs.innerHTML = `
    <button type="button" data-cube-home>全部主义</button>
    ${path
      .map(
        (item) => `
          <span aria-hidden="true">/</span>
          <button type="button" data-node-route="${item.id}">${escapeHtml(item.title)}</button>`,
      )
      .join("")}
  `;
};

const choiceButton = (node, index, root = false) => {
  const quadrant = root ? null : QUADRANTS[index];
  const isOpen = node.status === "open";
  return `
    <button
      class="choice-card ${root ? "root-card" : ""} ${isOpen ? "is-open" : ""}"
      type="button"
      data-choice-id="${node.id}"
      ${isOpen ? `aria-label="${escapeHtml(`${node.title}，尚未收录，查看坐标说明`)}"` : ""}
      style="--choice-color:${quadrant?.color ?? ["#d4b25d", "#5b5363", "#315c72", "#c94d3d", "#9c7448"][index]}"
    >
      <span class="choice-code">${root ? `0${node.id}` : `0${quadrant.id} · ${quadrant.name}`}</span>
      <strong>${escapeHtml(node.title)}</strong>
      <small>${escapeHtml(node.english)}</small>
      ${isOpen ? "<i>尚未收录 · 查看坐标</i>" : "<i>进入 ↘</i>"}
    </button>
  `;
};

const renderChoices = (parent) => {
  const nodes = parent ? parent.children : ROOTS;
  elements.choiceGrid.classList.toggle("root-choices", !parent);
  elements.choiceGrid.innerHTML = nodes.map((node, index) => choiceButton(node, index, !parent)).join("");
  elements.choiceTitle.textContent = parent ? `选择「${parent.title}」的下一坐标` : "选择思想领域";
};

const setHero = (node) => {
  currentNode = node;
  if (!node) {
    elements.coordinateLabel.textContent = "ISM CUBE · 思想坐标 000";
    elements.heroTitle.innerHTML = "旋转世界，<br><em>进入一种<br>解释。</em>";
    elements.heroSummary.textContent =
      "这不是可以被打乱的魔方，而是一套坐标稳定的思想索引。旋转用于观察，点击用于定位。";
    elements.startButton.textContent = "开始定位";
    elements.wikiButton.hidden = true;
    elements.backButton.hidden = true;
    return;
  }
  elements.coordinateLabel.textContent = `ISM CUBE · 思想坐标 ${node.id}`;
  elements.heroTitle.innerHTML = `${escapeHtml(node.title)}<br><em>${escapeHtml(node.english)}</em>`;
  elements.heroSummary.textContent = node.summary;
  elements.startButton.textContent = node.children.length ? "继续深入" : "查看抵达卡片";
  elements.wikiButton.hidden = node.status === "open";
  elements.wikiButton.textContent = "阅读当前词条";
  elements.backButton.hidden = false;
};

const renderArrival = (node) => {
  if (node.children.length) {
    elements.arrivalCard.hidden = true;
    return;
  }
  const path = getPath(node);
  elements.arrivalCard.hidden = false;
  elements.arrivalCard.innerHTML = `
    <p class="micro-label">ARRIVAL · ${node.id}</p>
    <div class="arrival-heading">
      <div><h2>${escapeHtml(node.title)}</h2><p>${escapeHtml(node.english)}</p></div>
      <span style="--arrival-color:${node.quadrant?.color ?? "#171813"}">${node.quadrant?.name ?? "词条"}</span>
    </div>
    <p>${escapeHtml(node.summary)}</p>
    <div class="arrival-path">${path.map((item) => `<span>${escapeHtml(item.title)}</span>`).join("<i>→</i>")}</div>
    <div class="arrival-actions">
      ${
        node.status === "open"
          ? '<button class="secondary-button" type="button" data-search-open>搜索已整理词条</button>'
          : `<button class="primary-button" type="button" data-open-wiki="${node.id}">进入完整词条</button>`
      }
      <button class="secondary-button" type="button" data-back-one>回到同层</button>
    </div>
  `;
};

const renderCubeState = (node, { intro = true, focusHeading = false } = {}) => {
  document.body.dataset.view = "cube";
  elements.exploreView.hidden = false;
  elements.wikiView.hidden = true;
  setHero(node);
  renderBreadcrumbs(node);
  if (node) renderArrival(node);
  else elements.arrivalCard.hidden = true;

  if (!node) {
    cubeScene?.showRoot({ intro });
    renderChoices(null);
    elements.cubeFrame.classList.remove("show-axes");
    elements.stageHint.textContent = "拖动旋转 · 点击一个面进入";
    elements.liveStatus.textContent = "当前位于全部主义";
  } else if (node.children.length) {
    cubeScene?.showQuadrants(node, { intro });
    renderChoices(node);
    elements.cubeFrame.classList.add("show-axes");
    elements.stageHint.textContent = "四象坐标固定 · 点击方块继续深入";
    elements.liveStatus.textContent = `当前位于 ${getPath(node)
      .map((item) => item.title)
      .join("，")}`;
  } else {
    cubeScene?.showArrival(node, { intro });
    const parent = node.parent ? NODE_MAP.get(node.parent) : null;
    renderChoices(parent);
    elements.cubeFrame.classList.add("show-axes");
    elements.stageHint.textContent = node.status === "open" ? "这个坐标仍待整理" : "已经抵达 · 可进入完整词条";
    elements.liveStatus.textContent = `已经抵达 ${node.title}`;
  }

  if (focusHeading) elements.choiceTitle.focus({ preventScroll: true });
};

const relatedNodes = (node) => {
  if (!node.parent) return node.children.slice(0, 4);
  const parent = NODE_MAP.get(node.parent);
  return parent.children.filter((candidate) => candidate.id !== node.id && candidate.status === "published").slice(0, 4);
};

const renderWiki = (node, { intro = true } = {}) => {
  currentNode = node;
  cubeScene?.stopFloat();
  document.body.dataset.view = "wiki";
  elements.exploreView.hidden = true;
  elements.wikiView.hidden = false;
  const path = getPath(node);
  const related = relatedNodes(node);
  const quadrant = node.quadrant;

  elements.wikiView.innerHTML = `
    <nav class="wiki-breadcrumbs" aria-label="词条路径">
      <a href="#/cube">主义坐标体</a>
      ${path.map((item) => `<span>/</span><a href="${routeForCube(item)}">${escapeHtml(item.title)}</a>`).join("")}
    </nav>

    <article class="wiki-article">
      <header class="wiki-header">
        <div>
          <p class="eyebrow">COORDINATE ${node.id}</p>
          <h1 id="wiki-title">${escapeHtml(node.title)}</h1>
          <p class="wiki-english">${escapeHtml(node.english)}</p>
        </div>
        <div class="wiki-actions">
          <a class="secondary-button" href="${routeForCube(node)}">回到坐标体</a>
          <button class="icon-button" type="button" data-share-node="${node.id}" aria-label="复制词条链接">↗</button>
        </div>
      </header>

      <p class="wiki-deck">${escapeHtml(node.summary)}</p>

      <div class="wiki-coordinate">
        <div class="coordinate-stamp" style="--stamp-color:${quadrant?.color ?? "#171813"}">
          <span>${node.id}</span>
          <strong>${quadrant?.name ?? "总域"}</strong>
          <small>${quadrant ? `${quadrant.row} × ${quadrant.column}` : "ROOT FIELD"}</small>
        </div>
        <div>
          <p class="micro-label">PLACEMENT</p>
          <h2>为什么放在这里？</h2>
          <p>${escapeHtml(
            quadrant
              ? `这个位置继承“${quadrant.name}”坐标：${quadrant.description}`
              : "这是五个总域之一，它从外层立方体进入后，再使用四象坐标继续定位。",
          )}</p>
          <div class="text-path">${path.map((item) => `<span>${escapeHtml(item.title)}</span>`).join("<i>→</i>")}</div>
        </div>
      </div>

      <div class="wiki-columns">
        <section>
          <p class="micro-label">CORE THESIS</p>
          <h2>核心命题</h2>
          <p>${escapeHtml(node.thesis)}</p>
        </section>
        <section>
          <p class="micro-label">CONTEXT</p>
          <h2>思想背景</h2>
          <p>${escapeHtml(node.history)}</p>
        </section>
        <section>
          <p class="micro-label">DEBATE</p>
          <h2>主要争论</h2>
          <p>${escapeHtml(node.debate)}</p>
        </section>
      </div>

      ${
        node.reading.length
          ? `<section class="wiki-reading"><p class="micro-label">READ NEXT</p><h2>继续理解</h2><div>${node.reading
              .map((item) => `<span>${escapeHtml(item)}</span>`)
              .join("")}</div></section>`
          : ""
      }

      <aside class="editorial-note">
        <strong>编辑说明</strong>
        <p>本站采用作者提供的思想坐标作为主要入口。分类本身也是一种论证：欢迎把它当成可检查、可反驳、可继续修订的地图，而非唯一标准答案。</p>
      </aside>

      <section class="related-section">
        <p class="micro-label">NEARBY COORDINATES</p>
        <h2>同层词条</h2>
        <div class="related-grid">
          ${
            related.length
              ? related
                  .map(
                    (item) => `<a href="${routeForWiki(item)}"><span>${item.id}</span><strong>${escapeHtml(
                      item.title,
                    )}</strong><small>${escapeHtml(item.english)}</small></a>`,
                  )
                  .join("")
              : "<p>这个坐标附近的词条仍在整理。</p>"
          }
        </div>
      </section>
    </article>
  `;

  window.scrollTo({ top: 0, behavior: "auto" });
  if (intro && !prefersReducedMotion()) {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
    timeline
      .fromTo(".wiki-header > *", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.09 })
      .fromTo(".wiki-deck", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "<0.18")
      .fromTo(".wiki-coordinate", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "<0.12");
  }
};

const renderRoute = ({ intro = true } = {}) => {
  navigating = false;
  const route = parseRoute();
  if (route.view === "wiki") renderWiki(route.node, { intro });
  else renderCubeState(route.node, { intro });
};

const navigateToNode = (node, mesh = null, intersection = null) => {
  if (navigating) return;
  if (node.status === "open") {
    pushRoute(routeForCube(node));
    renderCubeState(node, { intro: true, focusHeading: false });
    return;
  }
  navigating = true;
  const selectedMesh = mesh ?? cubeScene?.getMeshForNode(node);
  cubeScene?.animateSelection(node, selectedMesh, intersection, () => {
    pushRoute(routeForCube(node));
    renderCubeState(node, { intro: true, focusHeading: true });
    navigating = false;
  });
};

const renderFieldIndex = () => {
  elements.fieldIndex.innerHTML = ROOTS.map(
    (root, index) => `
      <article class="field-card" style="--field-number:'0${root.id}'; --field-color:${[
        "#d4b25d",
        "#5b5363",
        "#315c72",
        "#c94d3d",
        "#9c7448",
      ][index]}">
        <div class="field-card-heading">
          <span>0${root.id}</span>
          <div><h3>${escapeHtml(root.title)}</h3><p>${escapeHtml(root.english)}</p></div>
        </div>
        <p>${escapeHtml(root.summary)}</p>
        <div class="field-links">
          ${root.children
            .filter((child) => child.status === "published")
            .map((child) => `<a href="${routeForWiki(child)}"><span>${child.id}</span>${escapeHtml(child.title)}</a>`)
            .join("")}
        </div>
        <a class="field-enter" href="${routeForCube(root)}">进入这个领域 <span>↘</span></a>
      </article>
    `,
  ).join("");
};

const searchNodes = (query) => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return publishedNodes().slice(0, 8);
  return publishedNodes()
    .filter((node) =>
      [node.id, node.title, node.english, ...node.aliases].some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      ),
    )
    .slice(0, 12);
};

const renderSearchResults = () => {
  const matches = searchNodes(elements.searchInput.value);
  elements.searchResults.innerHTML = matches.length
    ? matches
        .map(
          (node) => `
            <button type="button" data-search-node="${node.id}">
              <span>${node.id}</span>
              <strong>${escapeHtml(node.title)}</strong>
              <small>${escapeHtml(node.english)}</small>
              <i>↗</i>
            </button>`,
        )
        .join("")
    : "<p>没有找到匹配词条。试试更短的名称或坐标。</p>";
};

const openSearch = () => {
  renderSearchResults();
  elements.searchDialog.showModal();
  requestAnimationFrame(() => elements.searchInput.focus());
};

const openWiki = (node) => {
  pushRoute(routeForWiki(node));
  renderWiki(node, { intro: true });
};

document.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-choice-id]");
  if (choice) {
    const node = NODE_MAP.get(choice.dataset.choiceId);
    navigateToNode(node);
    return;
  }

  const nodeRoute = event.target.closest("[data-node-route]");
  if (nodeRoute) {
    const node = NODE_MAP.get(nodeRoute.dataset.nodeRoute);
    pushRoute(routeForCube(node));
    renderCubeState(node, { intro: true });
    return;
  }

  if (event.target.closest("[data-cube-home]")) {
    pushRoute("#/cube");
    renderCubeState(null, { intro: true });
    return;
  }

  const wikiButton = event.target.closest("[data-open-wiki]");
  if (wikiButton) {
    openWiki(NODE_MAP.get(wikiButton.dataset.openWiki));
    return;
  }

  if (event.target.closest("[data-back-one]")) {
    const parent = currentNode?.parent ? NODE_MAP.get(currentNode.parent) : null;
    pushRoute(routeForCube(parent));
    renderCubeState(parent, { intro: true });
    return;
  }

  if (event.target.closest("[data-search-open]")) {
    openSearch();
    return;
  }

  const searchResult = event.target.closest("[data-search-node]");
  if (searchResult) {
    elements.searchDialog.close();
    openWiki(NODE_MAP.get(searchResult.dataset.searchNode));
    return;
  }

  const routeLink = event.target.closest('a[href^="#/"]');
  if (routeLink) {
    event.preventDefault();
    pushRoute(routeLink.getAttribute("href"));
    renderRoute({ intro: true });
    return;
  }

  const shareButton = event.target.closest("[data-share-node]");
  if (shareButton) {
    navigator.clipboard?.writeText(window.location.href);
    const original = shareButton.textContent;
    shareButton.textContent = "✓";
    window.setTimeout(() => (shareButton.textContent = original), 1400);
  }
});

elements.startButton.addEventListener("click", () => {
  if (!currentNode) {
    document.querySelector("[data-choice-id]")?.focus();
    elements.choiceGrid.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
    return;
  }
  if (currentNode.children.length) {
    document.querySelector("[data-choice-id]")?.focus();
    elements.choiceGrid.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
  } else {
    elements.arrivalCard.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  }
});

elements.wikiButton.addEventListener("click", () => currentNode && openWiki(currentNode));
elements.backButton.addEventListener("click", () => {
  const parent = currentNode?.parent ? NODE_MAP.get(currentNode.parent) : null;
  pushRoute(routeForCube(parent));
  renderCubeState(parent, { intro: true });
});

elements.searchInput.addEventListener("input", renderSearchResults);
document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(activeTag)) {
    event.preventDefault();
    openSearch();
  }
});

window.addEventListener("popstate", () => renderRoute({ intro: true }));

renderFieldIndex();

try {
  cubeScene = new CubeScene(elements.canvasMount, {
    onSelect: navigateToNode,
    onTool: () => document.querySelector("#method").scrollIntoView({ behavior: scrollBehavior() }),
  });
} catch (error) {
  console.error("WebGL initialization failed", error);
  elements.fallback.hidden = false;
  elements.canvasMount.hidden = true;
}

if (!window.location.hash) history.replaceState(null, "", "#/cube");
renderRoute({ intro: true });

if (!prefersReducedMotion()) {
  const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  introTimeline
    .fromTo(".site-header", { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 })
    .fromTo(
      ".hero-copy > *",
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.075 },
      "<0.08",
    )
    .fromTo(".cube-column", { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.85 }, "<0.1");
}

console.info(`ISMISM loaded: ${ALL_NODES.length} coordinate nodes`);
