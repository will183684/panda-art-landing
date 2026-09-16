const CAPACITY = 6;

const LEVEL_COLORS = {
  L1: "#2E86AB",
  L2: "#2AA876",
  L3: "#8E44AD",
  L4: "#E67E22",
  L5: "#C0392B",
  L6: "#5146d9",
  COLOR_PENCIL: "#D6336C",
  SKETCH: "#B8860B",
  PRIVATE: "#7F8C8D"
};

const LEVEL_LABELS = {
  L1: "L1",
  L2: "L2",
  L3: "L3",
  L4: "L4",
  L5: "L5",
  L6: "L6",
  COLOR_PENCIL: "彩铅",
  SKETCH: "素描",
  PRIVATE: "Private / 1-on-1"
};

const schedule = {
  "周一": [
    { time: "5:00 PM", level: "L4", count: 2 },
    { time: "6:00 PM", level: "L4", count: 4 },
    { time: "6:10 PM", level: "L3", count: 2 },
    { time: "7:05 PM", level: "L5", count: 5 },
    { time: "7:15 PM", level: "L4", count: 5 }
  ],
  "周二": [
    { time: "5:00 PM", level: "PRIVATE", count: 1, note: "1-on-1" },
    { time: "5:50 PM", level: "L4", count: 5 },
    { time: "6:00 PM", level: "L2", count: 4 },
    { time: "7:00 PM", level: "L3", count: 5 }
  ],
  "周四": [
    { time: "5:50 PM", level: "L6", count: 2 },
    { time: "6:10 PM", level: "L6", colorKey: "SKETCH", count: 2, badge: "素描" },
    { time: "6:55 PM", level: "L1", count: 3 }
  ],
  "周五": [
    { time: "5:00 PM", level: "L6", colorKey: "COLOR_PENCIL", count: 1, badge: "彩铅" }
  ]
};

function colorFor(cls) {
  return LEVEL_COLORS[cls.colorKey] || LEVEL_COLORS[cls.level];
}

function buildBoard() {
  const board = document.getElementById("scheduleBoard");
  Object.entries(schedule).forEach(([day, classes]) => {
    const col = document.createElement("div");
    col.className = "day-col";

    const title = document.createElement("div");
    title.className = "day-title";
    title.innerHTML = `<span>${day}</span><span class="day-count">${classes.length} 节</span>`;
    col.appendChild(title);

    classes.forEach(cls => {
      const base = colorFor(cls);
      const card = document.createElement("div");
      card.className = "class-card";
      card.style.borderColor = base;
      card.style.setProperty("--c", base);
      card.style.setProperty("--fill", Math.min(cls.count / CAPACITY, 1) * 100 + "%");

      const fill = document.createElement("div");
      fill.className = "class-fill";
      card.appendChild(fill);

      const content = document.createElement("div");
      content.className = "class-content";

      if (cls.badge) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.style.color = base;
        badge.textContent = cls.badge;
        content.appendChild(badge);
      }

      const time = document.createElement("div");
      time.className = "time";
      time.textContent = cls.time;
      content.appendChild(time);

      const level = document.createElement("div");
      level.className = "level";
      level.textContent = LEVEL_LABELS[cls.level];
      content.appendChild(level);

      if (cls.note) {
        const note = document.createElement("div");
        note.className = "level";
        note.textContent = cls.note;
        content.appendChild(note);
      }

      card.appendChild(content);
      col.appendChild(card);
    });

    board.appendChild(col);
  });
}

function buildLegend() {
  const legend = document.getElementById("legend");
  Object.keys(LEVEL_COLORS).forEach(key => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.innerHTML = `<span class="dot" style="--c:${LEVEL_COLORS[key]}"></span>${LEVEL_LABELS[key]}`;
    legend.appendChild(tag);
  });
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text || "已复制";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyText(text, successText) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successText || "已复制");
  } catch (error) {
    showToast("复制失败，请手动复制");
  }
}

function initTabs() {
  const buttons = document.querySelectorAll("[data-tab-btn]");
  if (!buttons.length) return;

  const trialEyebrow = document.getElementById("trialEyebrow");
  const trialHeading = document.getElementById("trialHeading");

  function setTab(tab) {
    document.body.setAttribute("data-active-tab", tab);
    buttons.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tabBtn === tab)));

    if (tab === "chinese") {
      if (trialEyebrow) trialEyebrow.textContent = "预约中文试课";
      if (trialHeading) trialHeading.textContent = "联系教务老师，预约中文试课";
    } else {
      if (trialEyebrow) trialEyebrow.textContent = "$6 跟班试课";
      if (trialHeading) trialHeading.textContent = "联系教务老师，预约试课";
    }
  }

  buttons.forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tabBtn)));
  setTab("art");
}

document.addEventListener("click", (event) => {
  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    copyText(copyTarget.dataset.copy, "已复制微信号");
  }
});

buildBoard();
buildLegend();
initTabs();
