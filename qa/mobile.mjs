/**
 * Responsive + a11y capture.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.SKY_URL || "http://localhost:5173";

mkdirSync("qa/shots", { recursive: true });
const PORT = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn(
  "google-chrome",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === "page");
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("no chrome");
}
const ws = new WebSocket(await wsUrl());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});

const shots = [
  { name: "m-01-hero-day", t: "12:00", scroll: 0 },
  { name: "m-02-hero-sunset", t: "18:40", scroll: 0 },
  { name: "m-03-reveal", t: "18:40", scroll: 0.55 },
  { name: "m-04-works", t: "18:40", scroll: "work" },
];

for (const s of shots) {
  await send("Page.navigate", { url: `${BASE}/?t=${s.t}` });
  await sleep(2300);
  if (s.scroll === "work") {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo({top: document.querySelector('#work').offsetTop + 120, behavior:'instant'}); 1`,
    });
  } else if (s.scroll > 0) {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo({top: (document.querySelector('.hero').offsetHeight - innerHeight) * ${s.scroll}, behavior:'instant'}); 1`,
    });
  }
  await sleep(800);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`qa/shots/${s.name}.png`, Buffer.from(shot.result.data, "base64"));
  console.log("captured", s.name);
}

// a11y + reduced motion checks
const audit = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const slider = document.querySelector('[role=slider]');
    const buttons = [...document.querySelectorAll('button')];
    const labels = buttons.map(b => b.getAttribute('aria-label') || b.textContent.trim());
    return {
      sliderRole: !!slider,
      sliderValue: slider?.getAttribute('aria-valuetext'),
      tabbableSlider: slider?.tabIndex,
      unlabeledButtons: buttons.filter(b => !(b.getAttribute('aria-label') || b.textContent.trim())).length,
      reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      labels,
    };
  })()`,
});
console.log(JSON.stringify(audit.result.result.value, null, 2));

ws.close();
chrome.kill("SIGKILL");
process.exit(0);
