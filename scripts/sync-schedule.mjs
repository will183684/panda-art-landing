// Read-only: calls the landing_schedule() function on the attendance Supabase
// (migration 14) and writes schedule.json for the public page. The function
// returns only day/time/subject/level/active-student-count — no class names,
// no student info, no ids.
// Usage: node scripts/sync-schedule.mjs [--list]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(here, "..", "schedule.json");
const attendanceSrc =
  process.env.ATTENDANCE_SRC ||
  "/Users/caizhao/Documents/PandaArtAttendance/services/mockSupabase.ts";

let url = process.env.SUPABASE_URL;
let key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  const src = fs.readFileSync(attendanceSrc, "utf8");
  url = url || src.match(/SUPABASE_URL = "([^"]+)"/)?.[1];
  key = key || src.match(/SUPABASE_ANON_KEY = "([^"]+)"/)?.[1];
}
if (!url || !key) throw new Error("Supabase URL/key not found");

const res = await fetch(`${url}/rest/v1/rpc/landing_schedule`, {
  method: "POST",
  headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: "{}",
});
if (!res.ok) {
  const body = await res.text();
  if (res.status === 404) {
    throw new Error("landing_schedule() not found — run migration 14 in supabase_migration.sql first");
  }
  throw new Error(`landing_schedule: ${res.status} ${body}`);
}
const rows = await res.json();

const DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function levelFields(level) {
  if (/^L[1-6]$/.test(level)) return { level };
  if (level === "彩铅") return { level: "L6", colorKey: "COLOR_PENCIL", badge: "彩铅" };
  if (level === "素描") return { level: "L6", colorKey: "SKETCH", badge: "素描" };
  if (/^private$/i.test(level)) return { level: "PRIVATE", note: "1-on-1" };
  return null;
}

function to12h(t) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const classes = [];
for (const r of rows) {
  const lv = levelFields(r.level);
  if (!lv) {
    console.warn(`skipped: unrecognized level "${r.level}" (${DAYS[r.day_of_week]} ${r.start_time})`);
    continue;
  }
  classes.push({
    dow: r.day_of_week,
    day: DAYS[r.day_of_week],
    start: r.start_time,
    time: to12h(r.start_time),
    subject: r.subject,
    count: r.student_count,
    ...lv,
  });
}
classes.sort((a, b) => a.dow - b.dow || a.start.localeCompare(b.start));

if (process.argv.includes("--list")) {
  for (const c of classes) console.log(JSON.stringify(c));
  process.exit(0);
}

if (classes.length === 0) {
  console.error("no classes with a level set — leaving schedule.json untouched");
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), classes }, null, 2) + "\n");
console.log(`wrote ${classes.length} classes to ${outFile}`);
