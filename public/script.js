const $ = (selector) => document.querySelector(selector);
const windows = [...document.querySelectorAll("[data-window]")];
let topIndex = 60;

function openWindow(name) {
  const win = document.querySelector(`[data-window="${name}"]`);
  if (!win) return;
  win.classList.add("open");
  win.setAttribute("aria-hidden", "false");
  win.style.zIndex = ++topIndex;
  const bar = win.querySelector(".window-bar");
  if (bar) bar.focus();
}

function closeWindow(win) {
  win.classList.remove("open");
  win.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-open]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openWindow(control.dataset.open);
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeWindow(button.closest("[data-window]")));
});

document.querySelectorAll(".window").forEach((win) => {
  win.addEventListener("pointerdown", () => win.style.zIndex = ++topIndex);
  const bar = win.querySelector(".window-bar");
  let drag = null;
  bar.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = win.getBoundingClientRect();
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    bar.setPointerCapture(event.pointerId);
  });
  bar.addEventListener("pointermove", (event) => {
    if (!drag) return;
    win.style.left = `${event.clientX - drag.x + win.offsetWidth / 2}px`;
    win.style.top = `${event.clientY - drag.y + win.offsetHeight / 2}px`;
    win.style.transform = "translate(-50%, -50%)";
  });
  bar.addEventListener("pointerup", () => { drag = null; });
});

function updateClock() {
  const clock = $("#menu-clock");
  if (!clock) return;
  clock.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit"
  }).format(new Date()).replace(" at", "");
}
updateClock();
setInterval(updateClock, 30000);
