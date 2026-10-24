/**
 * Screenshot driver for the WebGL sky.
 *   node qa/shoot.mjs <url> <out.png> [--w 1440 --h 900 --wait 6000 --eval "js" --scroll 0]
 * Waits for the sky canvas to report its first frame, prints console errors.
 * Headless Chrome renders WebGL on SwiftShader (CPU): slow, but pixel-correct.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const W = +opt("w", 1440), H = +opt("h", 900), WAIT = +opt("wait", 4000);
const EVAL = opt("eval", ""), SCROLL = +opt("scroll", 0);
const PORT = 9400 + Math.floor(Math.random() * 400);

const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars",
  "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist",
  `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 80 && !wsUrl; i++) {
  try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); wsUrl = l.find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {}
  await sleep(150);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.consoleAPICalled" && /error|warn/.test(m.params.type)) console.log("console:", m.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 400));
  if (m.method === "Runtime.exceptionThrown") console.log("exception:", m.params.exceptionDetails.exception?.description?.slice(0, 400));
};
const send = (method, params = {}) => new Promise((res) => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
await send("Page.navigate", { url });
const t0 = Date.now();
await sleep(600);
for (let i = 0; i < 600; i++) {
  const r = await ev(`document.querySelector('.photo-sky')?.dataset.ready ?? (document.querySelector('[data-sky-variant]') ? 'css' : 'none')`);
  if (r === "true" || r === "css") break;
  await sleep(200);
}
console.log(`ready after ${Date.now() - t0}ms`);
if (SCROLL) { await ev(`window.scrollTo(0, ${SCROLL})`); }
if (EVAL) console.log("eval:", JSON.stringify(await ev(EVAL)));
await sleep(WAIT);
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log(`wrote ${out}`);
ws.close(); chrome.kill("SIGKILL"); process.exit(0);
