/**
 * Clock interaction test (real CDP input events).
 *   node qa/clock.mjs [baseUrl]
 * Uses the CSS "vector" variant so software GL doesn't slow the run.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const base = process.argv[2] || "http://localhost:5173";
const PORT = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn("google-chrome", ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`, "--window-size=1440,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 80 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {} await sleep(150); }
const ws = new WebSocket(wsUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") console.log("EXC", m.params.exceptionDetails.exception?.description?.slice(0, 300)); };
const send = (method, params = {}) => new Promise((res) => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })); });
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
const mouse = (type, x, y, extra = {}) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1, pointerType: "mouse", ...extra });
const shot = async (name, clip) => { const r = await send("Page.captureScreenshot", { format: "png", clip: { ...clip, scale: 2 } }); writeFileSync(name, Buffer.from(r.result.data, "base64")); };
const readout = () => ev(`(() => { const s = document.querySelector('.time-clock-face'); return { now: s.getAttribute('aria-valuetext'), digits: document.querySelector('.clock-digits')?.innerText.replace(/\\s/g,'') ?? document.querySelector('.clock-input')?.value }; })()`);

await send("Page.enable"); await send("Runtime.enable");
await send("Page.navigate", { url: `${base}/?t=12:00&variant=vector` });
await sleep(2500);
const r = await ev(`(() => { const b = document.querySelector('.time-clock-face').getBoundingClientRect(); const h = document.querySelector('.hud').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, hud: { x: h.x, y: h.y, width: h.width, height: h.height } }; })()`);
const cx = r.x + r.w / 2, cy = r.y + r.w / 2, R = (r.w / 200) * 87;
const at = (hour) => { const a = ((180 + hour * 15) * Math.PI) / 180; return [cx + R * Math.sin(a), cy - R * Math.cos(a)]; };
const clip = { x: r.hud.x - 4, y: r.hud.y - 4, width: r.hud.width + 8, height: r.hud.height + 8 };
await shot("/tmp/clock-0-noon.png", clip);
console.log("start", await readout());

// 1. press on the ring at 18:00 → glides there
let [x, y] = at(18);
await mouse("mousePressed", x, y);
await sleep(900);
console.log("press @18:00 →", await readout());
// 2. keep dragging round through 21:00 and past midnight to 02:00 in one gesture
for (let h = 18; h <= 26; h += 0.25) { [x, y] = at(h % 24); await mouse("mouseMoved", x, y); await sleep(16); }
await sleep(700);
await mouse("mouseReleased", x, y);
console.log("drag 18→02 (through midnight) →", await readout());
await shot("/tmp/clock-1-drag.png", clip);

// 3. wheel up over the hours digits: +1h per notch
const seg = await ev(`(() => { const s = [...document.querySelectorAll('.clock-seg')].map(e => e.getBoundingClientRect()); return s.map(b => [b.x + b.width/2, b.y + b.height/2]); })()`);
await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: seg[0][0], y: seg[0][1], deltaX: 0, deltaY: -102 });
await sleep(900);
console.log("wheel hours +3 notches →", await readout());
// 4. drag the minutes up by ~40px: +5 min per 13px
await mouse("mousePressed", seg[1][0], seg[1][1]);
for (let d = 0; d <= 40; d += 4) { await mouse("mouseMoved", seg[1][0], seg[1][1] - d); await sleep(16); }
await mouse("mouseReleased", seg[1][0], seg[1][1] - 40);
await sleep(900);
console.log("drag minutes up 40px →", await readout());
await shot("/tmp/clock-2-digits.png", clip);

// 5. click the hours → type 7:30pm, Enter
await mouse("mousePressed", seg[0][0], seg[0][1]);
await mouse("mouseReleased", seg[0][0], seg[0][1]);
await sleep(300);
console.log("editing:", await ev(`document.activeElement?.className`));
await send("Input.insertText", { text: "7:30pm" });
await shot("/tmp/clock-3-typing.png", clip);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
await sleep(400);
console.log("typed 7:30pm (mid-glide) →", await readout());
await sleep(1600);
console.log("typed 7:30pm (settled) →", await readout());
await shot("/tmp/clock-4-dusk.png", clip);

// 6. timelapse
const play = await ev(`(() => { const b = document.querySelector('.time-clock-play').getBoundingClientRect(); return [b.x + b.width/2, b.y + b.height/2]; })()`);
await mouse("mousePressed", play[0], play[1]); await mouse("mouseReleased", play[0], play[1]);
await sleep(2000);
console.log("after 2s timelapse →", await readout());
await mouse("mousePressed", play[0], play[1]); await mouse("mouseReleased", play[0], play[1]);
// 7. back to now
const now = await ev(`(() => { const b = document.querySelector('.time-clock-now').getBoundingClientRect(); return [b.x + b.width/2, b.y + b.height/2]; })()`);
await mouse("mousePressed", now[0], now[1]); await mouse("mouseReleased", now[0], now[1]);
await sleep(2500);
console.log("back to now →", await readout(), "local:", await ev(`new Date().toTimeString().slice(0,5)`));
await shot("/tmp/clock-5-live.png", clip);
ws.close(); chrome.kill("SIGKILL"); process.exit(0);
