const dots = Array.from(document.querySelectorAll(".rail-dot"));
const screens = Array.from(document.querySelectorAll("[data-screen]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const workCards = Array.from(document.querySelectorAll(".work-card"));
const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
const galleryModal = document.querySelector(".gallery-modal");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryTitle = document.querySelector("#gallery-title");
const galleryCopy = document.querySelector("#gallery-copy");
const galleryClose = document.querySelector("[data-gallery-close]");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const projects = {
  "warm-care": {
    title: "暖肤洗护 AI 场景叙事",
    copy: "以暖色浴室、肌肤距离和泡沫细节组织洗护产品的亲密感，让同一组瓶器在氛围图、使用图和质感特写中保持统一识别。",
    images: Array.from({ length: 8 }, (_, index) => `./assets/works/warm-care/${String(index + 1).padStart(2, "0")}.jpg`)
  },
  "men-care": {
    title: "男士洗护自然场景生成",
    copy: "围绕 ETAE 男士洗护系列，将包装放入冰雪海岸、植物肌理和冷冽户外场景，强化清爽、力量与品牌层次。",
    images: Array.from({ length: 9 }, (_, index) => `./assets/works/men-care/${String(index + 1).padStart(2, "0")}.jpg`)
  },
  "green-set": {
    title: "Off & Relax 绿意套组视觉",
    copy: "以岩石、苔藓与透光树影建立套组氛围，把单品、组合和局部材质延展成清新连贯的洗护视觉序列。",
    images: Array.from({ length: 8 }, (_, index) => `./assets/works/green-set/${String(index + 1).padStart(2, "0")}.jpg`)
  },
  modeling: {
    title: "功效护肤建模精修",
    copy: "聚焦安瓶、面霜与功效护肤容器，通过建模渲染、材质高光和包装细节精修，放大产品的专业感与可信度。",
    images: Array.from({ length: 6 }, (_, index) => `./assets/works/modeling/${String(index + 1).padStart(2, "0")}.jpg`)
  },
  "photo-retouch": {
    title: "香氛护肤摄影精修",
    copy: "从橙花香氛到水感护肤，将实拍素材的色彩、液体质感、肤感光线和陈列关系打磨成更利于销售展示的画面。",
    images: Array.from({ length: 12 }, (_, index) => `./assets/works/photo-retouch/${String(index + 1).padStart(2, "0")}.jpg`)
  },
  "mixed-visuals": {
    title: "彩妆护发商业视觉实验",
    copy: "汇合彩妆光泽、护发瓶组和道具构成实验，探索高饱和产品在商业场景中的节奏、触感与陈列冲击力。",
    images: Array.from({ length: 8 }, (_, index) => `./assets/works/mixed-visuals/${String(index + 1).padStart(2, "0")}.jpg`)
  }
};

const initialIndex = Math.max(
  0,
  screens.findIndex((screen) => screen.id === window.location.hash.slice(1))
);
let currentIndex = initialIndex;
let isWheelLocked = false;
let wheelDelta = 0;
let wheelResetTimer;

function getNearestScreenIndex() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  return screens.reduce((nearestIndex, screen, index) => {
    const currentDistance = Math.abs(screen.offsetTop - scrollTop);
    const nearestDistance = Math.abs(screens[nearestIndex].offsetTop - scrollTop);
    return currentDistance < nearestDistance ? index : nearestIndex;
  }, 0);
}

function setActiveScreen(index) {
  currentIndex = Math.max(0, Math.min(index, screens.length - 1));
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentIndex);
  });
}

function goToScreen(index) {
  const nextIndex = Math.max(0, Math.min(index, screens.length - 1));
  const screen = screens[nextIndex];
  const top = screen?.offsetTop ?? 0;

  if (!screen) return;

  setActiveScreen(nextIndex);
  window.scrollTo({ top, behavior: "smooth" });
  document.documentElement.scrollTo?.({ top, behavior: "smooth" });
  document.body.scrollTo?.({ top, behavior: "smooth" });
  history.replaceState(null, "", `#${screen.id}`);
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    setActiveScreen(screens.indexOf(visible.target));
  },
  { threshold: [0.45, 0.6, 0.75] }
);

screens.forEach((screen) => observer.observe(screen));

if (window.location.hash && initialIndex >= 0) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => goToScreen(initialIndex));
  });
}

sectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const targetIndex = screens.findIndex((screen) => screen.id === targetId);

    if (targetIndex === -1) return;

    event.preventDefault();
    goToScreen(targetIndex);
  });
});

function handleWheel(event) {
  if (
    document.body.classList.contains("is-modal-open") ||
    window.matchMedia("(max-width: 720px)").matches ||
    event.ctrlKey
  ) {
    return;
  }

  const deltaY = event.deltaY ?? event.wheelDelta * -1 ?? event.detail ?? 0;
  const deltaX = event.deltaX ?? 0;
  const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : 0;
  if (Math.abs(delta) < 1) return;

  event.preventDefault();
  if (isWheelLocked) return;

  window.clearTimeout(wheelResetTimer);
  wheelDelta += delta;
  wheelResetTimer = window.setTimeout(() => {
    wheelDelta = 0;
  }, 140);

  if (Math.abs(wheelDelta) < 42) return;

  isWheelLocked = true;
  currentIndex = getNearestScreenIndex();
  goToScreen(currentIndex + (wheelDelta > 0 ? 1 : -1));
  wheelDelta = 0;

  window.setTimeout(() => {
    isWheelLocked = false;
  }, 820);
}

[window, document, document.documentElement, document.body].forEach((target) => {
  target.addEventListener("wheel", handleWheel, { passive: false, capture: true });
  target.addEventListener("mousewheel", handleWheel, { passive: false, capture: true });
});

window.addEventListener("keydown", (event) => {
  const nextKeys = ["ArrowDown", "PageDown", " "];
  const previousKeys = ["ArrowUp", "PageUp"];

  if (lightbox.classList.contains("is-open") && event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (galleryModal.classList.contains("is-open") && event.key === "Escape") {
    closeGallery();
    return;
  }

  if (document.body.classList.contains("is-modal-open")) return;

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    goToScreen(currentIndex + 1);
  }

  if (previousKeys.includes(event.key)) {
    event.preventDefault();
    goToScreen(currentIndex - 1);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    workCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

function openGallery(projectId) {
  const project = projects[projectId];
  if (!project) return;

  galleryTitle.textContent = project.title;
  galleryCopy.textContent = project.copy;
  galleryGrid.replaceChildren(
    ...project.images.map((src, index) => {
      const button = document.createElement("button");
      const image = document.createElement("img");
      const label = `VIEW ${String(index + 1).padStart(2, "0")}`;

      button.className = "gallery-item";
      button.type = "button";
      button.dataset.label = label;
      button.setAttribute("aria-label", `放大查看 ${project.title} 第 ${index + 1} 张图片`);
      image.src = src;
      image.alt = `${project.title} 作品图 ${index + 1}`;
      image.loading = index < 3 ? "eager" : "lazy";
      image.decoding = "async";
      button.append(image);
      button.addEventListener("click", () => openLightbox(src, image.alt, `${project.title} / ${label}`));
      return button;
    })
  );

  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");
  galleryGrid.querySelector("button")?.focus();
}

function closeGallery() {
  closeLightbox();
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-modal-open");
}

function openLightbox(src, alt, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
}

workCards.forEach((card) => {
  card.addEventListener("click", () => openGallery(card.dataset.project));
});

galleryClose.addEventListener("click", closeGallery);
lightboxClose.addEventListener("click", closeLightbox);

galleryModal.addEventListener("click", (event) => {
  if (event.target === galleryModal) closeGallery();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
