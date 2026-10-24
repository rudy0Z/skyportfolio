/**
 * QA capture — screenshots a matrix of (time × variant × scroll) states.
 * Usage: node qa/capture.mjs
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.SKY_URL || "http://localhost:5173";

const PORT = 9700 + Math.floor(Math.random() * 200);
mkdirSync("qa/shots", { recursive: true });

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

const shots = [
  { name: "01-hero-dawn", t: "06:00", v: "volumetric", scroll: 0 },
  { name: "02-hero-midday", t: "12:00", v: "volumetric", scroll: 0 },
  { name: "03-hero-golden", t: "17:30", v: "volumetric", scroll: 0 },
  { name: "04-hero-sunset", t: "18:40", v: "volumetric", scroll: 0 },
  { name: "05-hero-dusk", t: "20:30", v: "volumetric", scroll: 0 },
  { name: "06-hero-night", t: "02:00", v: "volumetric", scroll: 0 },
  { name: "07-midday-dither", t: "12:00", v: "dither", scroll: 0 },
  { name: "08-midday-vector", t: "12:00", v: "vector", scroll: 0 },
  { name: "09-sunset-dither", t: "18:40", v: "dither", scroll: 0 },
  { name: "10-night-vector", t: "02:00", v: "vector", scroll: 0 },
  { name: "11-reveal-40", t: "17:30", v: "volumetric", scroll: 0.4 },
  { name: "12-reveal-65", t: "17:30", v: "volumetric", scroll: 0.65 },
  { name: "13-works", t: "17:30", v: "volumetric", scroll: 1.0 },
  { name: "14-works-night", t: "21:00", v: "volumetric", scroll: 1.0 },
];

for (const s of shots) {
  await send("Page.navigate", { url: `${BASE}/?t=${s.t}&variant=${s.v}` });
  await sleep(2400);
  if (s.scroll > 0) {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo({ top: (document.querySelector('.hero').offsetHeight - innerHeight) * ${s.scroll} + (${s.scroll >= 1 ? '400' : '0'}), behavior: 'instant' }); 'scrolled'`,
      awaitPromise: true,
    });
    await sleep(900);
  }
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`qa/shots/${s.name}.png`, Buffer.from(shot.result.data, "base64"));
  console.log("captured", s.name);
}

ws.close();
chrome.kill("SIGKILL");
process.exit(0);
