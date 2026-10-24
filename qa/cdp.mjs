/**
 * Tiny CDP driver — launch headless Chrome, open a URL, run JS, screenshot.
 * Usage: node qa/cdp.mjs <url> <outfile> [evalExpression]
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [, , url, out, expr] = process.argv;
const PORT = 9333 + Math.floor(Math.random() * 200);

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

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("chrome did not start");
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
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
await send("Page.navigate", { url });
await sleep(3800);

if (expr) {
  const r = await send("Runtime.evaluate", {
    expression: expr,
    returnByValue: true,
    awaitPromise: true,
  });
  console.log(JSON.stringify(r.result?.result?.value ?? r.result, null, 2));
}

const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot.result?.data) {
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  console.log(`wrote ${out}`);
}

ws.close();
chrome.kill("SIGKILL");
process.exit(0);
