import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import {
  LayoutDashboard, Search, Snowflake, ListChecks, Users, Megaphone, Radar,
  ArrowLeftRight, Bell, Moon, Sun, Plus, Pencil, Trash2, Check, X, Info,
  AlertTriangle, ShieldAlert, Lock, Pill, Thermometer, CalendarClock,
  CalendarDays, CalendarRange, ChevronRight, Send, CheckCircle2, Building2,
  FileBarChart, MapPin, FlaskConical, GraduationCap, ExternalLink, LifeBuoy,
  Palette, LogOut, Sparkles, CalendarOff, BookOpen, Award, ClipboardCheck,
  ThumbsUp, ThumbsDown, Warehouse, PackagePlus, Flag, Star, FileText,
  ClipboardList, Link2, Settings, ScanSearch, Compass, UserCircle, Upload,
  Image, Pin, Camera, Clock, Phone, Mail,
  Smartphone, CreditCard, ShieldCheck, StickyNote, BellOff, Stethoscope, RotateCcw, HeartPulse, Share2, Download, User, Eye, EyeOff, MessageCircle, Menu, PackageCheck, UserCheck,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea,
} from "recharts";

/* ================= THEME ================= */
const BASE = {
  light: { bg: "#F4F7FC", surface: "#FFFFFF", surfaceAlt: "#F0F5FB", head: "#1E5B94", border: "#E2EAF4", text: "#15263B", textMuted: "#6B7C93", primary: "#2D7DD2", primarySoft: "#E8F1FB", accent: "#17A2A0", gold: "#C9A23F", goldSoft: "#FAF2DC", sidebar: "#173456", sidebarText: "#A9BCD4", sidebarActive: "#D4B254", danger: "#E0584B", dangerSoft: "#FCEDEB", warning: "#D9892A", warningSoft: "#FCF2E3", success: "#2B9D5B", successSoft: "#E7F6EC", cold: "#3A9BE0", coldSoft: "#E8F3FC", purple: "#7E5BC4", purpleSoft: "#F0EAFA", zebra: "#F8FBFE", input: "#FFFFFF", chartGrid: "#EAF0F7" },
  dark: { bg: "#0A1726", surface: "#122339", surfaceAlt: "#0E1D30", head: "#0A1828", border: "#22405E", text: "#E9F1FA", textMuted: "#94AAC4", primary: "#4D9DE8", primarySoft: "#143352", accent: "#2FC0BE", gold: "#D4B254", goldSoft: "#2A2310", sidebar: "#0A1828", sidebarText: "#94AAC4", sidebarActive: "#D4B254", danger: "#EC7A70", dangerSoft: "#2C1816", warning: "#E6AC52", warningSoft: "#2C2314", success: "#62C988", successSoft: "#14271B", cold: "#62B2E8", coldSoft: "#132A40", purple: "#B196DD", purpleSoft: "#1E1733", zebra: "#0E1D30", input: "#0E1D30", chartGrid: "#1E3A58" },
};
const FONTS = { Inter: "'Inter', system-ui, sans-serif", System: "system-ui, 'Segoe UI', sans-serif", Serif: "Georgia, 'Times New Roman', serif", Mono: "ui-monospace, monospace" };
const SCRIPT = "'Shadows Into Light', 'Segoe Script', 'Comic Sans MS', cursive";
// Khazeen wordmark with a serif ℞ tucked above the K, like a prescription pad.
// fontSize controls overall size; inner pieces use em so it scales cleanly (incl. clamp()).
function Wordmark({ size = 54, color = "#fff", gold = "#C9A23F", rx = "#fff", reg = 0.34 }) {
  return (<span style={{ display: "inline-flex", alignItems: "flex-start", fontFamily: SCRIPT, fontWeight: 400, fontSize: size, color, lineHeight: 1, maxWidth: "100%" }}>
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ position: "absolute", top: "-0.42em", left: "-0.04em", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, fontSize: "0.5em", color: rx, lineHeight: 1, pointerEvents: "none" }}>&#8478;</span>
      K
    </span>
    <span>hazeen</span>
    <sup style={{ fontSize: `${reg}em`, fontFamily: "system-ui", color: gold, marginTop: "0.08em" }}>&reg;</sup>
  </span>);
}
const DEFAULT_BRAND = { appName: "Khazeen", primary: "", accent: "", font: "Inter", cpdLink: "https://accreditation.moph.gov.qa", logo: "💊", density: "Comfortable" };

const ThemeCtx = createContext(); const useT = () => useContext(ThemeCtx);
const AppCtx = createContext(); const useApp = () => useContext(AppCtx);

const ROLE = {
  Admin: { emoji: "⚙️", sub: "Full system control", color: "#475569" },
  Management: { emoji: "🏛️", sub: "Oversight & delegation", color: "#1A5276" },
  "Sub-Manager": { emoji: "📋", sub: "Operations & standards", color: "#0E7C7B" },
  Inspector: { emoji: "🔍", sub: "Zone pharmacy inspection", color: "#6C3FA0" },
  Pharmacist: { emoji: "💊", sub: "Dispense & monitor", color: "#2E86C1" },
  Medical: { emoji: "🩺", sub: "Clinical view & request", color: "#9A3B5E" },
  Store: { emoji: "📦", sub: "Main store control", color: "#A65A11" },
};
const MEDICAL_PROFESSIONS = ["Doctor", "Nurse", "Paramedic", "Pharmacy Technician", "Dentist", "Optometrist", "Pharmacist"];
const ROLE_PW = { Admin: "khazeen", Management: "khazeen", "Sub-Manager": "khazeen", Inspector: "khazeen", Pharmacist: "khazeen", Medical: "khazeen", Store: "khazeen" };
const ZONES = ["North", "Mid", "South"];
const NAV = {
  home: { label: "Home", icon: UserCircle }, hub: { label: "Global hub", icon: Megaphone }, dashboard: { label: "Dashboard", icon: LayoutDashboard },
  findme: { label: "FindMe", icon: Search }, invlog: { label: "Inventory log", icon: ClipboardList },
  dispensing: { label: "Daily log", icon: CalendarDays }, coldchain: { label: "Cold chain", icon: Snowflake },
  logs: { label: "Logs", icon: ClipboardList },
  chronic: { label: "Chronic Pts log", icon: HeartPulse },
  recall: { label: "Batches & recall", icon: ScanSearch },
  controlled: { label: "Controlled register", icon: ShieldCheck },
  handover: { label: "Shift handover", icon: StickyNote },
  clinical: { label: "Clinical tools", icon: FlaskConical }, cpd: { label: "CPD", icon: GraduationCap },
  tasks: { label: "My tasks", icon: ListChecks }, approvals: { label: "Approvals", icon: ClipboardCheck },
  users: { label: "Users", icon: Users }, store: { label: "Main store", icon: Warehouse },
  storetasks: { label: "Store tasks", icon: ListChecks }, storereq: { label: "My requests", icon: ArrowLeftRight }, storereqs: { label: "Requests", icon: PackageCheck },
  radar: { label: "Expiry radar", icon: Radar }, requests: { label: "My requests", icon: ArrowLeftRight },
  inspect: { label: "Inspections", icon: ScanSearch }, zones: { label: "Zones", icon: Compass },
  profile: { label: "Profile", icon: UserCircle }, notifs: { label: "Notifications", icon: Bell },
  settings: { label: "Settings", icon: Settings },
};
const NAV_BY_ROLE = {
  Admin: ["home", "hub", "dashboard", "findme", "clinical", "cpd", "tasks", "approvals", "inspect", "zones", "users", "store", "notifs", "settings"],
  Management: ["home", "hub", "dashboard", "findme", "logs", "clinical", "cpd", "tasks", "approvals", "controlled", "inspect", "zones", "users", "store", "notifs"],
  "Sub-Manager": ["home", "hub", "dashboard", "findme", "logs", "clinical", "cpd", "tasks", "approvals", "controlled", "inspect", "zones", "users", "notifs"],
  Inspector: ["home", "hub", "inspect", "findme", "clinical", "cpd", "tasks", "notifs"],
  Pharmacist: ["home", "hub", "dashboard", "logs", "coldchain", "recall", "controlled", "handover", "clinical", "cpd", "tasks", "storereq", "notifs"],
  Medical: ["home", "hub", "logs", "radar", "requests", "clinical", "cpd", "tasks", "notifs"],
  Store: ["home", "hub", "store", "storereqs", "storetasks", "clinical", "cpd", "notifs"],
};
/* camps now carry a zone; admin/mgmt/sub-manager can re-categorize */
const DEFAULT_CAMP_ZONES = { "Al-Udeid Clinic": "South", "Tariq Camp": "Mid", "Doha HQ": "North", "Al-Rayyan Field Clinic": "Mid" };
const DEFAULT_CAMPS = Object.keys(DEFAULT_CAMP_ZONES);

/* ================= HELPERS ================= */
function InfoDot({ text }) {
  const t = useT(); const [o, setO] = useState(false); const ref = useRef(null);
  useEffect(() => { const c = (e) => { if (ref.current && !ref.current.contains(e.target)) setO(false); }; document.addEventListener("mousedown", c); return () => document.removeEventListener("mousedown", c); }, []);
  return (<span ref={ref} style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }}>
    <button onClick={() => setO(!o)} aria-label="Info" style={{ width: 18, height: 18, borderRadius: "50%", border: "none", cursor: "pointer", background: t.surfaceAlt, color: t.textMuted, display: "grid", placeItems: "center", padding: 0 }}><Info size={12} /></button>
    {o && <span style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", width: 250, background: t.text, color: t.surface, fontSize: 12, lineHeight: 1.5, padding: "10px 12px", borderRadius: 9, zIndex: 70, fontWeight: 400, textAlign: "left", boxShadow: "0 6px 24px rgba(0,0,0,0.3)" }}>{text}</span>}
  </span>);
}
const card = (t) => ({ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20, boxShadow: "0 4px 16px rgba(30,91,148,0.06)" });
const ttl = (t) => ({ fontSize: 15, fontWeight: 700, color: t.text, margin: 0, display: "flex", alignItems: "center", gap: 8 });
const btn = (t, k = "primary") => k === "primary"
  ? { display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 999, border: "none", background: t.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", boxShadow: "0 3px 10px rgba(45,125,210,0.28)" }
  : k === "gold"
  ? { display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 999, border: "none", background: t.gold, color: "#3A2E08", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "0 3px 10px rgba(201,162,63,0.3)" }
  : { display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 16px", borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" };
const roundIcon = (t, bg) => ({ width: 38, height: 38, borderRadius: "50%", background: bg, display: "grid", placeItems: "center", flexShrink: 0 });
const pill = (t) => ({ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: t.textMuted, background: t.surfaceAlt, border: `1px solid ${t.border}`, padding: "4px 10px", borderRadius: 999 });
const miniBtn = (t) => ({ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", display: "grid", placeItems: "center", padding: 0 });
/* export-to-PDF: opens a print window with a Ministry letterhead; the browser's print dialog saves/shares as PDF.
   opts can be a string (legacy extra meta) or { camp, person, mil, extra } identity object. */
function exportPDF(title, bodyHTML, opts = {}) {
  const o = typeof opts === "string" ? { extra: opts } : (opts || {});
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { alert("Please allow pop-ups to export the PDF."); return; }
  const stamp = new Date().toLocaleString("en-GB");
  const idRows = [
    o.camp ? `<tr><td class="k">Camp / clinic</td><td>${escapeHTML(o.camp)}</td></tr>` : "",
    o.person ? `<tr><td class="k">Prepared by</td><td>${escapeHTML(o.person)}${o.role ? " — " + escapeHTML(o.role) : ""}</td></tr>` : "",
    o.mil ? `<tr><td class="k">Military no.</td><td>${escapeHTML(o.mil)}</td></tr>` : "",
    `<tr><td class="k">Date</td><td>${stamp}</td></tr>`,
    o.extra ? `<tr><td class="k">Reference</td><td>${escapeHTML(o.extra)}</td></tr>` : "",
  ].join("");
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(title)}</title>
    <style>
      *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
      body{margin:0;padding:32px;color:#0B1F38}
      .lh{display:flex;align-items:center;gap:14px;border-bottom:3px solid #C8A24B;padding-bottom:14px;margin-bottom:14px}
      .logo{width:54px;height:54px;border-radius:50%;background:#0B1F38;border:2px solid #C8A24B;display:flex;align-items:center;justify-content:center;color:#C8A24B;font-size:24px}
      .bk{font-size:30px;color:#0B1F38;font-family:'Brush Script MT',cursive}
      .mod{font-size:11px;color:#B8902F;letter-spacing:2px;margin-top:2px}
      h1{font-size:19px;margin:4px 0 10px}
      .idtbl{border-collapse:collapse;margin-bottom:16px;font-size:12px}
      .idtbl td{padding:3px 10px 3px 0}
      .idtbl .k{color:#5A6E88;font-weight:bold;white-space:nowrap}
      table.data{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}
      table.data th{background:#0B1F38;color:#fff;text-align:left;padding:7px 9px;font-size:11px}
      table.data td{border-bottom:1px solid #D9E2EE;padding:6px 9px}
      table.data tr:nth-child(even) td{background:#F2F5FA}
      .sig{margin-top:42px;display:flex;gap:60px}
      .sig div{flex:1;border-top:1px solid #0B1F38;padding-top:6px;font-size:12px}
      .ft{margin-top:30px;font-size:10px;color:#8DA5BE;border-top:1px solid #D9E2EE;padding-top:8px}
      @media print{.noprint{display:none}}
    </style></head><body>
    <div class="lh"><div class="logo">💊</div><div><div class="bk">Khazeen®</div><div class="mod">MINISTRY OF DEFENCE · QATAR</div></div></div>
    <h1>${escapeHTML(title)}</h1>
    <table class="idtbl">${idRows}</table>
    ${bodyHTML.replace(/<table>/g, '<table class="data">')}
    <div class="ft">Khazeen® Pharmacy Solutions® · Run by MoDQ · Generated from the Khazeen system for physical record-keeping.</div>
    <div class="noprint" style="margin-top:24px;text-align:center"><button onclick="window.print()" style="padding:10px 22px;background:#0B1F38;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer">Print / Save as PDF</button></div>
    </body></html>`);
  w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 350);
}
const escapeHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/* reusable export control: Desktop (save as PDF), Email (mailto), WhatsApp (wa.me) */
function ExportButton({ title, build, ghost = true, small = false }) {
  const t = useT(); const { me } = useApp(); const [open, setOpen] = useState(false); const [wa, setWa] = useState(""); const [pos, setPos] = useState(null); const ref = useRef(null);
  const idFor = () => ({ camp: me?.camp, person: me?.name, mil: me?.mil, role: me?.role });
  const doPDF = () => { const b = build(); exportPDF(b.title || title, b.bodyHTML, { ...idFor(), extra: b.extra }); setOpen(false); };
  const summary = () => { const b = build(); const id = idFor(); return `${b.title || title}\n${id.camp ? "Camp/clinic: " + id.camp + "\n" : ""}${id.person ? "Prepared by: " + id.person + (id.mil ? " (Mil. " + id.mil + ")" : "") + "\n" : ""}Date: ${new Date().toLocaleString("en-GB")}\n\n${b.text || "See the attached Khazeen PDF for the full record."}`; };
  const doEmail = () => { const b = build(); window.open(`mailto:?subject=${encodeURIComponent("Khazeen — " + (b.title || title))}&body=${encodeURIComponent(summary() + "\n\n(Attach the Khazeen PDF you saved.)")}`); setOpen(false); };
  const doWA = () => { const num = wa.replace(/[^0-9]/g, ""); window.open(`https://wa.me/${num}?text=${encodeURIComponent(summary())}`, "_blank"); setOpen(false); };
  const toggle = () => { if (open) { setOpen(false); return; } const r = ref.current?.getBoundingClientRect(); if (r) { const w = 250; const left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8)); setPos({ left, top: r.bottom + 6 }); } setOpen(true); };
  return (<span ref={ref} style={{ display: "inline-block" }}>
    <button onClick={toggle} style={small ? { ...miniBtn(t), width: 30, height: 30, color: t.primary } : btn(t, ghost ? "ghost" : "primary")} title="Export / share">{small ? <Share2 size={14} /> : <><Share2 size={15} /> Export</>}</button>
    {open && pos && (<>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000 }} />
      <div style={{ position: "fixed", left: pos.left, top: pos.top, zIndex: 2001, width: 250, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: "0 12px 34px rgba(11,31,56,0.28)", padding: 8 }}>
        <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 700, padding: "4px 8px 6px", textTransform: "uppercase", letterSpacing: 0.4 }}>Export / share</div>
        <button onClick={doPDF} style={menuItem(t)}><Download size={16} color={t.primary} /> Save to desktop (PDF)</button>
        <button onClick={doEmail} style={menuItem(t)}><Mail size={16} color={t.accent} /> Email</button>
        <div style={{ borderTop: `1px solid ${t.border}`, margin: "6px 0", paddingTop: 8 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "0 6px" }}>
            <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="WhatsApp no. e.g. 974…" style={{ flex: 1, height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 12.5, padding: "0 9px", outline: "none", minWidth: 0 }} />
            <button onClick={doWA} disabled={!wa.replace(/[^0-9]/g, "")} title="Send via WhatsApp" style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: wa.replace(/[^0-9]/g, "") ? "#25D366" : t.border, color: "#fff", cursor: wa.replace(/[^0-9]/g, "") ? "pointer" : "default", display: "grid", placeItems: "center", flexShrink: 0 }}><Send size={15} /></button>
          </div>
        </div>
      </div>
    </>)}
  </span>);
}
const menuItem = (t) => ({ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, color: t.text, textAlign: "left" });
const d2e = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);
const today = () => new Date().toISOString().slice(0, 10);
const prevMonthLabel = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }); };
const thisMonthLabel = () => new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
function licenseLevel(expiry) { const d = d2e(expiry);
  if (d <= 14) return { lv: "critical", txt: "expires in under 2 weeks", days: d };
  if (d <= 60) return { lv: "danger", txt: "expires within 2 months", days: d };
  if (d <= 120) return { lv: "warning", txt: "expires within 4 months", days: d };
  if (d <= 182) return { lv: "notice", txt: "expires within 6 months", days: d };
  return null; }
function Modal({ title, icon: Icon, onClose, children, width = 470 }) {
  const t = useT();
  return (<div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(6,16,30,0.55)", display: "grid", placeItems: "center", zIndex: 95, padding: 20 }}>
    <div onClick={(e) => e.stopPropagation()} style={{ width, maxWidth: "100%", background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: t.surface, zIndex: 1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, fontSize: 15 }}>{Icon && <Icon size={18} color={t.primary} />} {title}</span>
        <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}><X size={17} /></button>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  </div>);
}
function Page({ title, subtitle, info, action, children }) {
  const t = useT();
  return (<div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
      <div><h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 4, height: 22, borderRadius: 3, background: t.gold, display: "inline-block" }} />{title} {info && <InfoDot text={info} />}</h1>{subtitle && <p style={{ margin: "5px 0 0 14px", color: t.textMuted, fontSize: 13.5 }}>{subtitle}</p>}</div>
      {action && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{action}</div>}
    </div>{children}
  </div>);
}
function Metric({ label, value, tone, info }) {
  const t = useT(); const c = { primary: t.primary, accent: t.accent, warning: t.warning, success: t.success, cold: t.cold, purple: t.purple }[tone] || t.primary;
  return (<div style={{ background: t.surfaceAlt, borderRadius: 10, padding: 14 }}><div style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 5 }}>{label} {info && <InfoDot text={info} />}</div><div style={{ fontSize: 24, fontWeight: 700, color: c, marginTop: 4 }}>{value}</div></div>);
}
/* rating colour: green 9–10, yellow 6–8, red ≤5 */
function rateColor(t, r) { if (r == null) return { fg: t.textMuted, bg: t.surfaceAlt }; if (r >= 9) return { fg: t.success, bg: t.successSoft }; if (r >= 6) return { fg: t.warning, bg: t.warningSoft }; return { fg: t.danger, bg: t.dangerSoft }; }
function RatingCircle({ value, size = 38 }) {
  const t = useT(); const c = rateColor(t, value);
  return (<span title={value == null ? "Not yet rated" : `Rated ${value}/10`} style={{ width: size, height: size, borderRadius: "50%", display: "inline-grid", placeItems: "center", flexShrink: 0, background: c.bg, border: `2.5px solid ${c.fg}`, color: c.fg, fontWeight: 800, fontSize: size * 0.34 }}>{value == null ? "–" : value}</span>);
}
/* custom SVG glyphs per role, drawn in a colored circle — professional, distinct, theme-aware */
const ROLE_GLYPH = {
  Admin: (s) => (<g><circle cx="12" cy="12" r="3.1" /><path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" /></g>),
  Management: (s) => (<g><path d="M12 3.2 21 8H3z" /><path d="M5.5 8v8M9.5 8v8M14.5 8v8M18.5 8v8" /><path d="M3.4 19.6h17.2M2.6 16.6h18.8" /></g>),
  "Sub-Manager": (s) => (<g><rect x="6" y="4.2" width="12" height="16.2" rx="2" /><path d="M9 4.2V3.4a3 3 0 0 1 6 0v.8" /><path d="m8.8 12.4 2 2 4.4-4.4" /></g>),
  Inspector: (s) => (<g><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /><path d="M8 10.5h5M10.5 8v5" /></g>),
  Pharmacist: (s) => (<g><path d="M5 9.5h14l-1.4 9.1a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7z" /><path d="M3.5 9.5 12 4l8.5 5.5" /><path d="M12 12.5v4.5M9.8 14.7h4.4" /></g>),
  Medical: (s) => (<g><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M6 3H4.5M14 3h1.5" /><path d="M10 16v1.5a3.5 3.5 0 0 0 7 0V14" /><circle cx="18.5" cy="12" r="1.9" /></g>),
  Store: (s) => (<g><path d="M3.2 7.5 12 3l8.8 4.5v9L12 21l-8.8-4.5z" /><path d="M3.2 7.5 12 12l8.8-4.5M12 12v9" /></g>),
};
function RoleGlyph({ role, size = 44, selected = false, title, onDark = false }) {
  const t = useT(); const meta = ROLE[role] || {}; const c = meta.color || t.primary; const glyph = ROLE_GLYPH[role];
  const stroke = onDark ? "#E7EEF6" : c; const ring = onDark ? t.gold : c;
  return (<span title={title || `${role} — ${meta.sub || ""}`} style={{ width: size, height: size, borderRadius: "50%", display: "inline-grid", placeItems: "center", flexShrink: 0, background: onDark ? "rgba(255,255,255,0.05)" : c + "1A", border: onDark ? `1px solid ${selected ? t.gold : "rgba(200,162,75,0.4)"}` : "none", boxShadow: selected ? `0 0 0 3px ${ring}` : "none", transition: "box-shadow .15s, border-color .15s" }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{glyph ? glyph(size) : <circle cx="12" cy="12" r="8" />}</svg>
  </span>);
}
/* upload-and-confirm: attach a photo/PDF then manually confirm extracted values */
function UploadConfirm({ label, fields, onConfirm, hint }) {
  const t = useT(); const [open, setOpen] = useState(false); const [file, setFile] = useState(null); const [vals, setVals] = useState({}); const ref = useRef(null);
  const pick = (e) => { const f = e.target.files?.[0]; if (f) { setFile({ name: f.name, type: f.type }); } };
  const done = fields.every((f) => (vals[f.key] ?? "") !== "");
  if (!open) return <button onClick={() => setOpen(true)} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}><Upload size={13} /> {label}</button>;
  return (<Modal title={label} icon={Camera} onClose={() => setOpen(false)} width={460}>
    {hint && <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 12, display: "flex", gap: 6 }}><Info size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {hint}</div>}
    <input ref={ref} type="file" accept="image/*,application/pdf" onChange={pick} style={{ display: "none" }} />
    <button onClick={() => ref.current?.click()} style={{ width: "100%", height: 92, border: `2px dashed ${t.border}`, borderRadius: 12, background: t.surfaceAlt, cursor: "pointer", color: t.textMuted, display: "grid", placeItems: "center", marginBottom: 14 }}>
      {file ? <span style={{ display: "flex", alignItems: "center", gap: 8, color: t.text, fontSize: 13, fontWeight: 600 }}>{file.type === "application/pdf" ? <FileText size={18} color={t.primary} /> : <Image size={18} color={t.primary} />} {file.name}</span>
        : <span style={{ display: "grid", placeItems: "center", gap: 4 }}><Upload size={22} /><span style={{ fontSize: 12.5 }}>Tap to attach a photo or PDF</span></span>}
    </button>
    {file && (<><div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Confirm the values read from the file:</div>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>{fields.map((f) => (<div key={f.key}><label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 4, display: "block" }}>{f.label}</label><input type={f.type || "text"} value={vals[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", height: 40, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" }} /></div>))}</div>
      <button onClick={() => { onConfirm(vals, file); setOpen(false); }} disabled={!done} style={{ ...btn(t), width: "100%", height: 44, justifyContent: "center", opacity: done ? 1 : 0.5 }}><Check size={16} /> Confirm & record</button>
      <p style={{ fontSize: 11, color: t.textMuted, marginTop: 10, display: "flex", gap: 6 }}><Info size={12} /> The app reads the file and pre-fills these; you confirm before it's recorded.</p>
    </>)}
  </Modal>);
}
/* notification kinds */
const NOTIF_KINDS = { Approval: { icon: ClipboardCheck, fg: "primary" }, Rating: { icon: Star, fg: "warning" }, "Camp change": { icon: MapPin, fg: "accent" }, Requests: { icon: ArrowLeftRight, fg: "primary" }, Request: { icon: ArrowLeftRight, fg: "primary" }, Task: { icon: ListChecks, fg: "accent" }, Location: { icon: MapPin, fg: "accent" }, Store: { icon: Warehouse, fg: "primary" }, License: { icon: Award, fg: "warning" }, Expiry: { icon: AlertTriangle, fg: "danger" }, Inspection: { icon: ScanSearch, fg: "accent" } };
/* distinct colour per user at a site, so multiple staff entries are tellable apart */
const AUTHOR_COLORS = ["#1A5276", "#0E7C7B", "#6C3FA0", "#A65A11", "#9A3B5E", "#1E7E45", "#2E86C1", "#B9770E"];
function authorColor(name) { if (!name) return "#8094A8"; let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return AUTHOR_COLORS[h % AUTHOR_COLORS.length]; }
function initials(name) { if (!name) return "?"; const p = name.replace(/[^A-Za-z .]/g, "").trim().split(/\s+/); return ((p[0]?.[0] || "") + (p[p.length - 1]?.[0] || "")).toUpperCase() || "?"; }
function AuthorDot({ name, time, size = 24 }) {
  const t = useT(); const [open, setOpen] = useState(false); const ref = useRef(null); const c = authorColor(name);
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  if (!name) return null;
  return (<span ref={ref} style={{ position: "relative", display: "inline-flex" }}
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} title={`Done by ${name}${time ? " · " + time : ""}`} style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${c}`, background: c + "22", color: c, fontSize: size * 0.4, fontWeight: 800, cursor: "pointer", display: "grid", placeItems: "center", padding: 0, flexShrink: 0 }}>{initials(name)}</button>
    {open && <span style={{ position: "absolute", bottom: size + 6, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: t.text, color: t.surface, fontSize: 11.5, fontWeight: 600, padding: "6px 10px", borderRadius: 8, zIndex: 80, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>Done by {name}{time ? ` · ${time}` : ""}</span>}
  </span>);
}

/* ================= SPLASH (pitch landing) ================= */
function Splash({ appName, logo, onEnter }) {
  const NAVY = "#0B1F38", GOLD = "#C8A24B", GOLD2 = "#E2C063", MUT = "#9DB2CC";
  const caps = [
    { g: () => <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>, t: "Unified work", d: "Stock, dispensing, store and clinic — one place, one record." },
    { g: () => <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10.5H13z" />, t: "Ease of action & access", d: "Request, approve, dispatch — the right control, a tap away." },
    { g: () => <><path d="M5 12.5a7 7 0 0 1 14 0" /><path d="M2 12.5a10 10 0 0 1 20 0" /><circle cx="12" cy="13" r="1.6" /></>, t: "Instant live connection", d: "Every camp linked in real time — one change, everyone sees it." },
    { g: () => <><path d="M3 14c3 0 3-5 6-5s3 5 6 5 3-5 6-5" /><path d="M3 19c3 0 3-3 6-3s3 3 6 3 3-3 6-3" /></>, t: "Flow & rhythm", d: "Daily routines, cycles and deadlines that keep work moving." },
  ];
  return (<div style={{ minHeight: "100vh", width: "100%", maxWidth: "100%", background: "radial-gradient(120% 90% at 50% -10%, #12345C 0%, #0B1F38 55%)", color: "#F2F6FB", display: "grid", placeItems: "center", padding: "24px 16px", fontFamily: "inherit", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
    <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: "min(320px, 90vw)", height: "min(320px, 90vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,162,75,0.16), transparent 70%)", pointerEvents: "none" }} />
    <div style={{ width: "min(660px, 100%)", maxWidth: "100%", textAlign: "center", position: "relative", boxSizing: "border-box" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#0E2A4A", border: `2px solid ${GOLD}`, display: "grid", placeItems: "center", margin: "0 auto 16px", boxShadow: "0 0 0 8px rgba(200,162,75,0.06), 0 12px 36px rgba(0,0,0,0.45)", overflow: "hidden", fontSize: 40 }}>{logo && logo.startsWith("blob:") ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (logo || "💊")}</div>
      <h1 style={{ margin: 0, lineHeight: 1, fontSize: "clamp(30px, 9vw, 50px)" }}><Wordmark size="1em" color="#fff" gold={GOLD} /></h1>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 11, marginTop: 9, flexWrap: "wrap" }}>
        <span style={{ height: 1, width: 46, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
        <p style={{ fontSize: "clamp(9px, 2.6vw, 11.5px)", color: GOLD, letterSpacing: 2, margin: 0, whiteSpace: "nowrap" }}>MINISTRY OF DEFENCE · QATAR</p>
        <span style={{ height: 1, width: 46, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
      </div>
      <p style={{ fontSize: "clamp(13px, 3.8vw, 15.5px)", color: "#D7E2EF", marginTop: 16, lineHeight: 1.6, maxWidth: 560, marginInline: "auto" }}>One connected system, easier work flow, live actions.</p>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 26, margin: "28px 0 26px" }}>
        {caps.map((c, i) => (<span key={i} style={{ display: "grid", placeItems: "center" }}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GOLD2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{c.g()}</svg></span>))}
      </div>
      <button onClick={onEnter} style={{ height: 50, padding: "0 38px", borderRadius: 12, border: "none", background: "linear-gradient(180deg, #D9B45C, #C8A24B)", color: NAVY, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: "0 10px 26px rgba(200,162,75,0.28)" }}>Enter Khazeen <ChevronRight size={19} /></button>
      <p style={{ fontSize: 11, color: "rgba(157,178,204,0.7)", marginTop: 16 }}>Khazeen® v1.0 · Pharmacy Solutions® · Run by MoDQ · Preview build for demonstration</p>
    </div>
  </div>);
}

/* ================= LOGIN ================= */
function Login({ onLogin, appName, logo }) {
  const t = useT(); const [role, setRole] = useState(null); const [stage, setStage] = useState("pick"); const [pw, setPw] = useState(""); const [err, setErr] = useState(false); const [showPw, setShowPw] = useState(false);
  // per-role passwords for the demo (defaults to khazeen). In production these are per-user, hashed, server-side.
  const [pwMap, setPwMap] = useState(() => ({ ...ROLE_PW }));
  const [custom, setCustom] = useState({}); // which roles have set a custom password
  const [np1, setNp1] = useState(""); const [np2, setNp2] = useState(""); // new password fields
  const [channel, setChannel] = useState("email"); const [code, setCode] = useState(""); const [sentCode, setSentCode] = useState(""); const [codeErr, setCodeErr] = useState(false); const [msg, setMsg] = useState("");
  const NAVY = "#0B1F38", NAVY2 = "#0E2A4A", GOLD = "#C8A24B", LINE = "#1C3A5E", MUT = "#9DB2CC";
  const curPw = (r) => pwMap[r] || "khazeen";
  const tryLogin = (r, pass) => { if (pass === curPw(r)) { if (r === "Management") { setStage("tier"); } else { onLogin(r); } } else { setErr(true); } };
  const submit = () => { setErr(false); tryLogin(role, pw); };
  const goReset = () => { setStage("reset_pick"); setCode(""); setSentCode(""); setCodeErr(false); setMsg(""); setNp1(""); setNp2(""); };
  const goSet = () => { setStage("setpw"); setNp1(""); setNp2(""); setMsg(""); };
  const sendCode = () => { const c = String(Math.floor(1000 + Math.random() * 9000)); setSentCode(c); setStage("reset_code"); setCode(""); setCodeErr(false);
    const dest = channel === "email" ? "the account email" : channel === "sms" ? "the registered phone (SMS)" : "WhatsApp"; setMsg(`Demo: a 4-digit code was "sent" to ${dest}.`); };
  const confirmReset = () => { if (code.trim() !== sentCode) { setCodeErr(true); return; } if (!np1 || np1 !== np2) { setCodeErr(false); return; } setPwMap((p) => ({ ...p, [role]: np1 })); setCustom((p) => ({ ...p, [role]: true })); setStage("pw"); setPw(""); setErr(false); setMsg("Password reset. Sign in with your new password."); };
  const saveSet = () => { if (!np1 || np1 !== np2) return; setPwMap((p) => ({ ...p, [role]: np1 })); setCustom((p) => ({ ...p, [role]: true })); setStage("pw"); setPw(""); setErr(false); setMsg("Password set. Use it to sign in."); };
  const dfld = { width: "100%", height: 46, borderRadius: 11, border: `1px solid ${LINE}`, background: NAVY, color: "#fff", fontSize: 15, padding: "0 14px", outline: "none", boxSizing: "border-box" };
  return (<div style={{ minHeight: "100vh", width: "100%", maxWidth: "100%", background: NAVY, color: "#F2F6FB", display: "grid", placeItems: "center", padding: "24px 16px", fontFamily: "inherit", position: "relative", boxSizing: "border-box", overflowX: "hidden" }}>
    <div style={{ width: "min(940px, 100%)", maxWidth: "100%", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: NAVY2, border: `2px solid ${GOLD}`, display: "grid", placeItems: "center", margin: "0 auto 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.35)", overflow: "hidden", fontSize: 40 }}>{logo && logo.startsWith("blob:") ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (logo || "💊")}</div>
        <h1 style={{ margin: 0, lineHeight: 1, fontSize: "clamp(30px, 9vw, 46px)" }}><Wordmark size="1em" color="#fff" gold={GOLD} /></h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
          <span style={{ height: 1, width: 40, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <p style={{ fontSize: 11.5, color: GOLD, letterSpacing: 1.5, margin: 0 }}>MINISTRY OF DEFENCE · QATAR</p>
          <span style={{ height: 1, width: 40, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>
        <p style={{ fontSize: 13, color: MUT, marginTop: 8 }}>Pharmacy Solutions<sup>®</sup> — unified stock, dispensing & clinical governance</p>
      </div>
      <div style={{ background: NAVY2, border: `1px solid ${LINE}`, borderRadius: 18, padding: "26px 28px", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
        {stage === "pick" ? (<>
          <div style={{ fontSize: 13, color: MUT, marginBottom: 16, textAlign: "center", letterSpacing: 0.3 }}>Select your access profile to sign in</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {Object.entries(ROLE).filter(([name]) => name !== "Admin" && name !== "Sub-Manager").map(([name, meta]) => { const sel = role === name;
              return (<button key={name} onClick={() => setRole(name)} title={`${name} — ${meta.sub}`} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "grid", placeItems: "center", gap: 7 }}>
                <RoleGlyph role={name} size={62} selected={sel} onDark /><span style={{ fontSize: 11, color: sel ? GOLD : MUT, fontWeight: sel ? 700 : 500 }}>{name}</span></button>); })}
          </div>
          <div style={{ fontSize: 12, color: MUT, textAlign: "center", marginTop: 16, minHeight: 17 }}>{role ? ROLE[role].sub : "Tap a profile to continue."}</div>
          <button onClick={() => { if (role) { setStage("pw"); setPw(""); setErr(false); } }} disabled={!role} style={{ width: "100%", height: 50, borderRadius: 11, border: "none", marginTop: 18, fontSize: 15, fontWeight: 700, cursor: role ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: role ? GOLD : "#2A3F5A", color: "#0B1F38", opacity: role ? 1 : 0.4, transition: "opacity .15s" }}>Continue <ChevronRight size={18} /></button>
        </>) : stage === "tier" ? (<>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <RoleGlyph role="Management" size={56} onDark />
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Choose your level</div><div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>Sign in as main management or as a sub-manager</div></div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <button onClick={() => onLogin("Management")} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", borderRadius: 14, border: `1px solid ${LINE}`, background: NAVY, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(200,162,75,0.12)", border: `1px solid ${GOLD}`, display: "grid", placeItems: "center", flexShrink: 0 }}><RoleGlyph role="Management" size={30} onDark /></span>
              <span><span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>Main management</span><span style={{ display: "block", fontSize: 12, color: MUT, marginTop: 2 }}>Full oversight, users, store & approvals</span></span>
              <ChevronRight size={18} color={MUT} style={{ marginLeft: "auto" }} />
            </button>
            <button onClick={() => onLogin("Sub-Manager")} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", borderRadius: 14, border: `1px solid ${LINE}`, background: NAVY, color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(23,162,160,0.14)", border: `1px solid #17A2A0`, display: "grid", placeItems: "center", flexShrink: 0 }}><RoleGlyph role="Sub-Manager" size={30} onDark /></span>
              <span><span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>Sub-management</span><span style={{ display: "block", fontSize: 12, color: MUT, marginTop: 2 }}>Operations & standards, store requests</span></span>
              <ChevronRight size={18} color={MUT} style={{ marginLeft: "auto" }} />
            </button>
          </div>
          <button onClick={() => { setStage("pw"); setPw(""); }} style={{ width: "100%", height: 38, borderRadius: 9, border: "none", marginTop: 12, background: "transparent", color: MUT, fontSize: 12.5, cursor: "pointer" }}>← Back</button>
        </>) : stage === "setpw" ? (<>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <RoleGlyph role={role} size={52} onDark />
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Set your password</div><div style={{ fontSize: 12, color: MUT }}>{role}</div></div>
          </div>
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>New password</div>
          <input type="text" value={np1} autoFocus onChange={(e) => setNp1(e.target.value)} placeholder="Choose a password" style={{ ...dfld, marginBottom: 12 }} />
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>Confirm password</div>
          <input type="text" value={np2} onChange={(e) => setNp2(e.target.value)} placeholder="Re-enter password" style={dfld} />
          {np2 && np1 !== np2 && <div style={{ fontSize: 12, color: "#E5736A", marginTop: 8 }}>Passwords don't match.</div>}
          <button onClick={saveSet} disabled={!np1 || np1 !== np2} style={{ width: "100%", height: 50, borderRadius: 11, border: "none", marginTop: 16, fontSize: 15, fontWeight: 700, cursor: np1 && np1 === np2 ? "pointer" : "default", background: np1 && np1 === np2 ? GOLD : "#2A3F5A", color: "#0B1F38", opacity: np1 && np1 === np2 ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Check size={17} /> Save password</button>
          <button onClick={() => { setStage("pw"); setMsg(""); }} style={{ width: "100%", height: 38, borderRadius: 9, border: "none", marginTop: 8, background: "transparent", color: MUT, fontSize: 12.5, cursor: "pointer" }}>← Back</button>
        </>) : stage === "reset_pick" ? (<>
          <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Reset password</div><div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>Send a verification code to {role}'s registered contact</div></div>
          <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>{[{ k: "email", l: "Email", ic: Mail }, { k: "sms", l: "Phone (SMS)", ic: Smartphone }, { k: "whatsapp", l: "WhatsApp", ic: Send }].map((o) => { const on = channel === o.k; const Ic = o.ic;
            return (<button key={o.k} onClick={() => setChannel(o.k)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 11, border: `1px solid ${on ? GOLD : LINE}`, background: on ? "rgba(200,162,75,0.12)" : NAVY, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}><Ic size={17} color={on ? GOLD : MUT} /> {o.l}{on && <Check size={15} color={GOLD} style={{ marginLeft: "auto" }} />}</button>); })}</div>
          <button onClick={sendCode} style={{ width: "100%", height: 50, borderRadius: 11, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", background: GOLD, color: "#0B1F38", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Send size={16} /> Send code</button>
          <button onClick={() => { setStage("pw"); setMsg(""); }} style={{ width: "100%", height: 38, borderRadius: 9, border: "none", marginTop: 8, background: "transparent", color: MUT, fontSize: 12.5, cursor: "pointer" }}>← Back to sign in</button>
        </>) : stage === "reset_code" ? (<>
          <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Enter code & new password</div></div>
          {msg && <div style={{ fontSize: 12, color: GOLD, background: "rgba(200,162,75,0.1)", border: `1px solid ${LINE}`, borderRadius: 9, padding: "9px 11px", marginBottom: 14, textAlign: "center" }}>{msg} <b>Code: {sentCode}</b></div>}
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>Verification code</div>
          <input type="text" value={code} autoFocus onChange={(e) => { setCode(e.target.value); setCodeErr(false); }} placeholder="4-digit code" style={{ ...dfld, marginBottom: 12, letterSpacing: 4 }} />
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>New password</div>
          <input type="text" value={np1} onChange={(e) => setNp1(e.target.value)} placeholder="Choose a new password" style={{ ...dfld, marginBottom: 12 }} />
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>Confirm new password</div>
          <input type="text" value={np2} onChange={(e) => setNp2(e.target.value)} placeholder="Re-enter password" style={dfld} />
          {codeErr && <div style={{ fontSize: 12, color: "#E5736A", marginTop: 8 }}>Incorrect code.</div>}
          {np2 && np1 !== np2 && <div style={{ fontSize: 12, color: "#E5736A", marginTop: 8 }}>Passwords don't match.</div>}
          <button onClick={confirmReset} disabled={!code || !np1 || np1 !== np2} style={{ width: "100%", height: 50, borderRadius: 11, border: "none", marginTop: 16, fontSize: 15, fontWeight: 700, cursor: code && np1 && np1 === np2 ? "pointer" : "default", background: code && np1 && np1 === np2 ? GOLD : "#2A3F5A", color: "#0B1F38", opacity: code && np1 && np1 === np2 ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Check size={17} /> Reset password</button>
          <button onClick={() => setStage("reset_pick")} style={{ width: "100%", height: 38, borderRadius: 9, border: "none", marginTop: 8, background: "transparent", color: MUT, fontSize: 12.5, cursor: "pointer" }}>← Choose another channel</button>
        </>) : (<>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <RoleGlyph role={role} size={58} onDark />
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{role}</div><div style={{ fontSize: 12, color: MUT }}>{ROLE[role].sub}</div></div>
          </div>
          {msg && <div style={{ fontSize: 12, color: GOLD, marginBottom: 10, textAlign: "center" }}>{msg}</div>}
          <div style={{ fontSize: 12.5, color: MUT, marginBottom: 6 }}>Enter password</div>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} value={pw} autoFocus onChange={(e) => { setPw(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Password" style={{ width: "100%", height: 48, borderRadius: 11, border: `1px solid ${err ? "#E5736A" : LINE}`, background: NAVY, color: "#fff", fontSize: 15, padding: "0 44px 0 14px", outline: "none", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} title={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", color: MUT, cursor: "pointer", display: "grid", placeItems: "center" }}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {err && <div style={{ fontSize: 12, color: "#E5736A", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={13} /> Incorrect password. Try again.</div>}
          <button onClick={submit} disabled={!pw} style={{ width: "100%", height: 50, borderRadius: 11, border: "none", marginTop: 16, fontSize: 15, fontWeight: 700, cursor: pw ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: pw ? GOLD : "#2A3F5A", color: "#0B1F38", opacity: pw ? 1 : 0.5 }}>Sign in <ChevronRight size={18} /></button>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 8 }}>
            <button onClick={goSet} style={{ flex: 1, height: 36, borderRadius: 9, border: `1px solid ${LINE}`, background: "transparent", color: MUT, fontSize: 12, cursor: "pointer" }}>Set / change password</button>
            <button onClick={goReset} style={{ flex: 1, height: 36, borderRadius: 9, border: `1px solid ${LINE}`, background: "transparent", color: MUT, fontSize: 12, cursor: "pointer" }}>Forgot password?</button>
          </div>
          <button onClick={() => { setStage("pick"); setPw(""); setErr(false); setMsg(""); }} style={{ width: "100%", height: 38, borderRadius: 9, border: "none", marginTop: 8, background: "transparent", color: MUT, fontSize: 12.5, cursor: "pointer" }}>← Choose a different profile</button>
          <div style={{ fontSize: 11, color: "rgba(157,178,204,0.6)", textAlign: "center", marginTop: 10 }}>{custom[role] ? "Using your custom password." : <>Default demo password: <b style={{ color: MUT }}>khazeen</b></>}</div>
        </>)}
      </div>
      <p style={{ fontSize: 11, color: "rgba(157,178,204,0.7)", textAlign: "center", marginTop: 16 }}>Secure access · Passwords here are a front-end demo — real authentication is enforced server-side in production. Khazeen® v1.0</p>
    </div>
    <button onClick={() => { setRole("Admin"); setStage("pw"); setPw(""); setErr(false); }} aria-label="Administrator sign-in" title="Administrator" style={{ position: "fixed", bottom: 16, right: 16, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, background: NAVY2, color: GOLD, cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", opacity: 0.9, zIndex: 40 }}><Settings size={17} /></button>
  </div>);
}

/* ================= HUB ================= */
const HUB_SEED = [
  { id: 1, tag: "Policy", title: "Updated cold-chain excursion procedure", body: "Any fridge reading outside 2–8°C must be logged and the batch quarantined within 1 hour.", by: "🏛️", time: "Today 07:10", pinned: true, oks: ["Yaqeen", "S. Hassan"], comments: [] },
  { id: 2, tag: "Cycle", title: "October order cycle closes 28 Sep", body: "Submit reorder and store requests before the 28th.", by: "📋", time: "Yesterday", pinned: false, oks: [], comments: [{ id: 1, by: "Yaqeen", text: "Does this include controlled-drug reorders?", time: "Yesterday" }] },
  { id: 3, tag: "Stock requirement", title: "Insulin shipment arriving Thursday", body: "Main store receives Insulin Glargine. Camps may request redistribution.", by: "📦", time: "2 days ago", pinned: false, oks: ["M. Obaidly"], comments: [] },
];
const TAGS = ["Policy", "Stock requirement", "Cycle", "General"];
function PostCard({ p, tc, myName, canPin, canUnsend, onPin, onUnsend, onOk, onComment }) {
  const t = useT(); const c = tc(p.tag); const oks = p.oks || []; const comments = p.comments || [];
  const okd = oks.includes(myName);
  const [showOks, setShowOks] = useState(false); const [showComments, setShowComments] = useState(false); const [draft, setDraft] = useState("");
  const send = () => { const v = draft.trim(); if (!v) return; onComment(v); setDraft(""); setShowComments(true); };
  return (<div style={{ ...card(t), borderColor: p.pinned ? t.primary + "66" : t.border }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ width: 38, height: 38, borderRadius: "50%", background: t.primarySoft, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{p.by}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>{p.pinned && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: t.primary }}><Pin size={12} /> Pinned</span>}<span style={{ fontSize: 11.5, fontWeight: 700, color: c.fg, background: c.bg, padding: "3px 10px", borderRadius: 20 }}>{p.tag}</span></div>
        <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 3 }}>{p.time}</div>
      </div>
      <span style={{ marginLeft: "auto", display: "inline-flex", gap: 6 }}>{canPin && <button onClick={onPin} aria-label="Pin" style={miniBtn(t)}><Pin size={13} color={p.pinned ? t.primary : t.textMuted} /></button>}{canUnsend && <button onClick={onUnsend} aria-label="Unsend" title="Unsend" style={{ ...miniBtn(t), color: t.danger }}><Trash2 size={13} /></button>}</span>
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{p.title}</div><div style={{ fontSize: 13.5, color: t.textMuted, lineHeight: 1.6 }}>{p.body}</div>
    {p.attachments && p.attachments.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>{p.attachments.map((a, ai) => a.kind === "image"
      ? <a key={ai} href={a.url} target="_blank" rel="noreferrer" style={{ display: "block", borderRadius: 14, overflow: "hidden", border: `1px solid ${t.border}` }}><img src={a.url} alt={a.name} style={{ height: 120, maxWidth: 240, objectFit: "cover", display: "block" }} /></a>
      : <a key={ai} href={a.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: t.primary, background: t.primarySoft, padding: "8px 12px", borderRadius: 999, textDecoration: "none", border: `1px solid ${t.border}` }}><FileText size={15} /> {a.name}</a>)}</div>)}
    {/* action row: OK (acknowledge) + comments */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
      <button onClick={onOk} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, border: `1px solid ${okd ? t.success : t.border}`, background: okd ? t.successSoft : t.surface, color: okd ? t.success : t.textMuted, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}><Check size={15} /> OK</button>
      {oks.length > 0 && <button onClick={() => setShowOks((v) => !v)} style={{ fontSize: 12, color: t.textMuted, background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>{oks.length} confirmed</button>}
      <button onClick={() => setShowComments((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.textMuted, fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}><MessageCircle size={15} /> {comments.length > 0 ? `${comments.length} comment${comments.length === 1 ? "" : "s"}` : "Comment"}</button>
    </div>
    {showOks && oks.length > 0 && <div style={{ marginTop: 10, padding: "10px 13px", borderRadius: 14, background: t.surfaceAlt, fontSize: 12.5 }}><div style={{ fontWeight: 700, color: t.textMuted, marginBottom: 6, fontSize: 11 }}>Confirmed by</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{oks.map((n) => <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: t.successSoft, color: t.success, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}><Check size={11} /> {n}</span>)}</div></div>}
    {showComments && <div style={{ marginTop: 12, display: "grid", gap: 9 }}>
      {comments.map((cm) => (<div key={cm.id} style={{ display: "flex", gap: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: t.primarySoft, color: t.primary, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{cm.by.split(" ").map((s) => s[0]).join("").slice(0, 2)}</span>
        <div style={{ flex: 1, background: t.surfaceAlt, borderRadius: 14, padding: "9px 13px" }}><div style={{ fontSize: 12, fontWeight: 700 }}>{cm.by} <span style={{ fontWeight: 400, color: t.textMuted, fontSize: 11 }}>· {cm.time}</span></div><div style={{ fontSize: 13, color: t.text, marginTop: 3, lineHeight: 1.5 }}>{cm.text}</div></div>
      </div>))}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Add a comment or answer…" style={{ flex: 1, height: 38, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13, padding: "0 15px", outline: "none" }} />
        <button onClick={send} disabled={!draft.trim()} aria-label="Send" style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: draft.trim() ? t.primary : t.surfaceAlt, color: draft.trim() ? "#fff" : t.textMuted, cursor: draft.trim() ? "pointer" : "default", display: "grid", placeItems: "center", flexShrink: 0 }}><Send size={15} /></button>
      </div>
    </div>}
  </div>);
}
function Hub({ canPost, canPin, canUnsendAny, emoji }) {
  const t = useT(); const { camps, campZones, ratings, showRatings, setShowRatings, posts, setPosts, me } = useApp();
  const [modal, setModal] = useState(false);
  const myName = me?.name || "You";
  const tc = (tag) => tag === "Policy" ? { fg: t.danger, bg: t.dangerSoft } : tag === "Cycle" ? { fg: t.warning, bg: t.warningSoft } : tag === "Stock requirement" ? { fg: t.accent, bg: t.primarySoft } : { fg: t.textMuted, bg: t.surfaceAlt };
  const togglePin = (id) => setPosts((p) => p.map((x) => x.id === id ? { ...x, pinned: !x.pinned } : x));
  const unsend = (id) => setPosts((p) => p.filter((x) => x.id !== id));
  const toggleOk = (id) => setPosts((p) => p.map((x) => { if (x.id !== id) return x; const oks = x.oks || []; return { ...x, oks: oks.includes(myName) ? oks.filter((n) => n !== myName) : [...oks, myName] }; }));
  const addComment = (id, text) => setPosts((p) => p.map((x) => x.id === id ? { ...x, comments: [...(x.comments || []), { id: Date.now(), by: myName, text, time: "Just now" }] } : x));
  const canUnsend = (p) => canUnsendAny || p.by === emoji;
  const sorted = [...posts].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  return (<Page title="Global hub" subtitle="Shared space — live for every role. Pharmacy ratings by zone, plus policy, cycles and stock updates."
    info="One shared hub seen by all roles. Posts, pins and unsends update live for everyone (in this preview, across roles in the app; in production, across all signed-in devices via the live backend). Management & Sub-Manager can pin and unsend any post; authors can unsend their own."
    action={<><span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: t.success, background: t.successSoft, padding: "5px 11px", borderRadius: 20 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: t.success }} /> Live</span>{canPost && <button onClick={() => setModal(true)} style={btn(t)}><Plus size={15} /> Post update</button>}</>}>
    {/* zones → camps with rating circles */}
    <div style={{ ...card(t), marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={ttl(t)}><Compass size={17} color={t.primary} /> Pharmacy ratings by zone <InfoDot text="Inspector ratings per pharmacy (camp/clinic). Green 9–10, yellow 6–8, red ≤5. You can hide these for yourself with the toggle." /></p>
        <button onClick={() => setShowRatings(!showRatings)} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}>{showRatings ? <><Check size={13} /> Ratings on</> : <><X size={13} /> Ratings hidden</>}</button>
      </div>
      {ZONES.map((zone) => { const zc = camps.filter((c) => campZones[c] === zone); if (zc.length === 0) return null;
        return (<div key={zone} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{zone} zone</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {zc.map((c) => (<div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: t.surfaceAlt }}>
              {showRatings ? <RatingCircle value={ratings[c] ?? null} /> : <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: t.surface, color: t.textMuted }}><Building2 size={17} /></span>}
              <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{c}</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{showRatings ? (ratings[c] != null ? `Rated ${ratings[c]}/10` : "Not yet rated") : "Rating hidden"}</div></div>
            </div>))}
          </div>
        </div>); })}
    </div>
    {/* posts feed */}
    <div style={{ display: "grid", gap: 14 }}>{sorted.map((p) => <PostCard key={p.id} p={p} tc={tc} myName={myName} canPin={canPin} canUnsend={canUnsend(p)} onPin={() => togglePin(p.id)} onUnsend={() => unsend(p.id)} onOk={() => toggleOk(p.id)} onComment={(text) => addComment(p.id, text)} />)}</div>
    {!canPost && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted, marginTop: 14 }}><Lock size={13} /> Updates are posted by management and admins.</div>}
    {modal && <PostModal canPin={canPin} onClose={() => setModal(false)} onSave={(p) => { setPosts((x) => [{ ...p, id: Date.now(), by: emoji, time: "Just now", oks: [], comments: [] }, ...x]); setModal(false); }} />}
  </Page>);
}
function PostModal({ canPin, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ tag: "Policy", title: "", body: "", pinned: false, attachments: [] }); const v = f.title && f.body;
  const [improving, setImproving] = useState(false); const [suggestion, setSuggestion] = useState(null); const [aiError, setAiError] = useState(""); const fileRef = useRef(null);
  const addFiles = (list) => { const items = Array.from(list || []).map((file) => ({ name: file.name, url: URL.createObjectURL(file), kind: file.type.startsWith("image/") ? "image" : "file" })); setF((x) => ({ ...x, attachments: [...x.attachments, ...items] })); };
  const removeAtt = (i) => setF((x) => ({ ...x, attachments: x.attachments.filter((_, j) => j !== i) }));
  const fld = { width: "100%", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const improve = async () => {
    if (!f.title && !f.body) return; setImproving(true); setSuggestion(null); setAiError("");
    try {
      const prompt = `You are helping a Ministry of Defence pharmacy operations officer polish a short internal announcement for a staff hub. Fix spelling and grammar, keep it clear, concise and professional, and improve the wording so the message reads well and is not embarrassing — but DO NOT invent facts, numbers, names or dates that are not present. Keep the same meaning and language. Category: "${f.tag}".

Current title: "${f.title}"
Current message: "${f.body}"

Respond ONLY with a JSON object, no markdown, no preamble, in exactly this shape:
{"title": "improved title", "body": "improved message"}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const text = (data.content || []).map((i) => i.type === "text" ? i.text : "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setSuggestion({ title: parsed.title || f.title, body: parsed.body || f.body });
    } catch (e) { setAiError("Couldn't reach the writing assistant just now. You can still post as written."); }
    setImproving(false);
  };
  return (<Modal title="Post update to hub" icon={Megaphone} onClose={onClose}>
    <label style={lab}>Category</label><select value={f.tag} onChange={(e) => setF({ ...f, tag: e.target.value })} style={{ ...fld, height: 42, marginBottom: 14 }}>{TAGS.map((x) => <option key={x}>{x}</option>)}</select>
    <label style={lab}>Title</label><input value={f.title} autoFocus onChange={(e) => setF({ ...f, title: e.target.value })} style={{ ...fld, height: 42, marginBottom: 14 }} placeholder="Short headline" />
    <label style={lab}>Message</label><textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} rows={4} style={{ ...fld, marginBottom: 10, resize: "vertical" }} placeholder="What does the team need to know?" />
    <button onClick={improve} disabled={improving || (!f.title && !f.body)} style={{ ...btn(t, "ghost"), width: "100%", height: 40, justifyContent: "center", marginBottom: 12, opacity: (improving || (!f.title && !f.body)) ? 0.6 : 1, borderColor: t.accent + "88", color: t.accent }}>{improving ? <><Sparkles size={15} /> Improving…</> : <><Sparkles size={15} /> Improve writing & fix typos</>}</button>
    {aiError && <div style={{ fontSize: 12, color: t.warning, marginBottom: 12, display: "flex", gap: 6 }}><Info size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {aiError}</div>}
    {suggestion && (<div style={{ border: `1px solid ${t.accent}`, background: t.primarySoft, borderRadius: 11, padding: 12, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: t.accent, marginBottom: 8 }}><Sparkles size={13} /> SUGGESTED REWRITE</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>{suggestion.title}</div>
      <div style={{ fontSize: 13, color: t.text, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{suggestion.body}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => { setF({ ...f, title: suggestion.title, body: suggestion.body }); setSuggestion(null); }} style={{ ...btn(t), height: 34, fontSize: 12.5 }}><Check size={14} /> Use this</button>
        <button onClick={() => setSuggestion(null)} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12.5 }}>Keep mine</button>
      </div>
    </div>)}
    <label style={lab}>Attachments</label>
    <input ref={fileRef} type="file" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} style={{ display: "none" }} />
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
      <button onClick={() => fileRef.current?.click()} style={{ ...btn(t, "ghost"), height: 38 }}><Image size={15} /> Picture / PDF / file</button>
    </div>
    {f.attachments.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>{f.attachments.map((a, i) => (<div key={i} style={{ position: "relative", border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden", background: t.surfaceAlt }}>
      {a.kind === "image" ? <img src={a.url} alt={a.name} style={{ height: 72, width: 96, objectFit: "cover", display: "block" }} /> : <div style={{ height: 72, width: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6 }}><FileText size={20} color={t.primary} /><span style={{ fontSize: 10, color: t.textMuted, textAlign: "center", overflow: "hidden", maxWidth: 108, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{a.name}</span></div>}
      <button onClick={() => removeAtt(i)} aria-label="Remove" style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(11,31,56,0.78)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><X size={11} /></button>
    </div>))}</div>)}
    {canPin && <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 18, cursor: "pointer" }}><input type="checkbox" checked={f.pinned} onChange={(e) => setF({ ...f, pinned: e.target.checked })} /> <Pin size={14} color={t.primary} /> Pin this post to the top</label>}
    <button onClick={() => onSave(f)} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Send size={16} /> Publish to all staff</button>
  </Modal>);
}

/* ================= DASHBOARD ================= */
const TREND = [{ month: "Jan", thisYear: 2100, lastYear: 1980 }, { month: "Feb", thisYear: 1980, lastYear: 1870 }, { month: "Mar", thisYear: 2350, lastYear: 2010 }, { month: "Apr", thisYear: 2210, lastYear: 2190 }, { month: "May", thisYear: 2480, lastYear: 2100 }, { month: "Jun", thisYear: 2310, lastYear: 2240 }];
const CAMP_F = { "Al-Udeid Clinic": 0.34, "Tariq Camp": 0.26, "Doha HQ": 0.30, "Al-Rayyan Field Clinic": 0.13 };
function AdminDashboard() {
  const t = useT();
  const items = ADMIN_REQ_SEED;
  const open = items.filter((r) => r.status === "open"); const done = items.filter((r) => r.status === "done");
  const kc = (k) => k === "Fix" ? t.warning : k === "Add" ? t.success : k === "Change request" ? t.accent : t.primary;
  const comments = [
    { by: "🏛️ M. Obaidly", text: "Zone re-categorisation looks good — thanks for the quick turnaround.", time: "Today 09:10" },
    { by: "📋 Dalia & Asmaa", text: "Please prioritise the license-number fix before month-end reporting.", time: "Yesterday" },
  ];
  return (<Page title="Dashboard" subtitle="Requests from Management & Sub-Manager — fulfillment overview."
    info="Admin's dashboard tracks what Management and Sub-Manager have asked for and whether it's been fulfilled. Act on items in the Approvals screen; this is the at-a-glance status and their comments.">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
      <Metric label="Open requests" value={open.length} tone="warning" />
      <Metric label="Fulfilled" value={done.length} tone="success" />
      <Metric label="Fulfillment rate" value={`${Math.round((done.length / items.length) * 100)}%`} tone="primary" info="Share of admin requests completed." />
      <Metric label="Comments" value={comments.length} tone="accent" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      <div style={card(t)}>
        <p style={{ ...ttl(t), marginBottom: 12 }}><ClipboardCheck size={17} color={t.primary} /> Request fulfillment</p>
        <div style={{ display: "grid", gap: 10 }}>{items.map((r) => { const c = kc(r.kind); const isOpen = r.status === "open";
          return (<div key={r.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 10, background: t.surfaceAlt }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isOpen ? t.warning : r.status === "rejected" ? t.danger : t.success, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11.5, color: t.textMuted }}><span style={{ color: c, fontWeight: 700 }}>{r.kind}</span> · by {r.by} · {r.time}</div></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: isOpen ? t.warning : r.status === "rejected" ? t.danger : t.success, background: isOpen ? t.warningSoft : r.status === "rejected" ? t.dangerSoft : t.successSoft, padding: "3px 10px", borderRadius: 20 }}>{isOpen ? "Open" : r.status === "rejected" ? "Rejected" : "Fulfilled"}</span>
          </div>); })}</div>
        <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Act on these in the Approvals screen.</div>
      </div>
      <div style={card(t)}>
        <p style={{ ...ttl(t), marginBottom: 12 }}><Megaphone size={17} color={t.accent} /> Comments</p>
        <div style={{ display: "grid", gap: 10 }}>{comments.map((cm, i) => (<div key={i} style={{ padding: "11px 13px", borderRadius: 10, background: t.surfaceAlt }}>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>{cm.text}</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 6 }}>{cm.by} · {cm.time}</div>
        </div>))}</div>
      </div>
    </div>
  </Page>);
}
function Dashboard({ role, allocatedCamp }) {
  const t = useT(); const { camps } = useApp();
  if (role === "Admin") return <AdminDashboard />;
  const privileged = ["Admin", "Management", "Sub-Manager", "Store"].includes(role);
  const [camp, setCamp] = useState(privileged ? "All camps" : allocatedCamp);
  const f = camp === "All camps" ? 1 : (CAMP_F[camp] ?? 0.2);
  const tip = { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12, color: t.text };
  const stockData = (camp === "All camps" ? camps : [camp]).map((c) => ({ camp: c.split(" ")[0], inStock: Math.round(1284 * (CAMP_F[c] ?? 0.2)), low: Math.round(23 * (CAMP_F[c] ?? 0.2)) }));
  const trend = TREND.map((m) => ({ ...m, thisYear: Math.round(m.thisYear * f), lastYear: Math.round(m.lastYear * f) }));
  const kpis = [
    { label: "Total dispensing (mo)", value: Math.round(13430 * f).toLocaleString(), tone: "primary", info: "Total units dispensed this month for the selected scope." },
    { label: "Prescriptions (mo)", value: Math.round(4120 * f).toLocaleString(), tone: "accent", info: "Total prescriptions dispensed this month." },
    { label: "Of which chronic", value: Math.round(880 * f).toLocaleString(), tone: "warning", info: "Chronic-medication prescriptions, counted separately." },
    { label: "Low on stock", value: Math.round(23 * f), tone: "danger", info: "Items below reorder level." },
  ];
  return (<Page title="Dashboard" subtitle={camp === "All camps" ? "Overview across all camps and clinics." : `Scoped to ${camp}.`}
    info="Total dispensing can be viewed per camp. Privileged profiles switch camps; camp staff see only their allocated site."
    action={privileged
      ? <select value={camp} onChange={(e) => setCamp(e.target.value)} style={{ height: 40, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, padding: "0 12px", fontWeight: 600 }}><option>All camps</option>{camps.map((c) => <option key={c}>{c}</option>)}</select>
      : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 14px", borderRadius: 10, background: t.surfaceAlt, fontSize: 13, fontWeight: 600, color: t.textMuted }}><MapPin size={14} /> {allocatedCamp}</span>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>
      {kpis.map((k) => (<div key={k.label} style={card(t)}><div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>{k.label} <InfoDot text={k.info} /></div><div style={{ fontSize: 30, fontWeight: 700, margin: "6px 0 2px", color: { primary: t.primary, accent: t.accent, warning: t.warning, danger: t.danger }[k.tone] }}>{k.value}</div></div>))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      <div style={card(t)}><p style={ttl(t)}><Building2 size={17} color={t.primary} /> Stock by camp</p>
        <div style={{ height: 230, marginTop: 12 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={stockData} barGap={4}><CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} vertical={false} /><XAxis dataKey="camp" tick={{ fill: t.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: t.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tip} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="inStock" name="In stock" fill={t.primary} radius={[5, 5, 0, 0]} /><Bar dataKey="low" name="Low" fill={t.warning} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      <div style={card(t)}><p style={ttl(t)}><FileBarChart size={17} color={t.accent} /> Dispensing vs last year</p>
        <div style={{ height: 230, marginTop: 12 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} vertical={false} /><XAxis dataKey="month" tick={{ fill: t.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: t.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tip} /><Legend wrapperStyle={{ fontSize: 12 }} /><Line type="monotone" dataKey="thisYear" name="This year" stroke={t.primary} strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="lastYear" name="Last year" stroke={t.accent} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></div>
    </div>
  </Page>);
}

/* ================= FINDME ================= */
const MED_NET = [
  { name: "Paracetamol 500mg", code: "1230", camps: [{ camp: "Al-Udeid Clinic", batch: "PAR-2025-A", expiry: "2026-11-30", qty: 160 }, { camp: "Tariq Camp", batch: "PAR-2025-B", expiry: "2027-01-15", qty: 540 }, { camp: "Doha HQ", batch: "PAR-2024-Z", expiry: "2026-09-20", qty: 210 }] },
  { name: "Augmentin 1000mg", code: "1235", camps: [{ camp: "Al-Udeid Clinic", batch: "AUG2026-X", expiry: "2026-08-04", qty: 0 }, { camp: "Tariq Camp", batch: "AUG2026-Y", expiry: "2026-08-04", qty: 70 }, { camp: "Doha HQ", batch: "AUG2026-Z", expiry: "2026-12-01", qty: 12 }] },
  { name: "Insulin Glargine", code: "1700", camps: [{ camp: "Doha HQ", batch: "INS-0042", expiry: "2026-07-28", qty: 22 }, { camp: "Al-Rayyan Field Clinic", batch: "INS-0051", expiry: "2026-10-12", qty: 8 }] },
  { name: "Ceftriaxone 1g", code: "1450", camps: [{ camp: "Al-Udeid Clinic", batch: "CEF-2291", expiry: "2026-07-04", qty: 80 }, { camp: "Tariq Camp", batch: "CEF-2305", expiry: "2026-11-22", qty: 140 }] },
];
function FindMe() {
  const t = useT(); const [q, setQ] = useState("");
  const results = useMemo(() => q.trim() === "" ? [] : MED_NET.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.code.includes(q)), [q]);
  return (<Page title="FindMe" subtitle="Search any medication to see where it's held across every camp." info="Aggregates inventory logs from each camp. Type a medication name or code to see live quantities, batches and expiry everywhere it's stocked.">
    <div style={{ position: "relative", maxWidth: 460, marginBottom: 18 }}><Search size={18} color={t.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} /><input value={q} autoFocus onChange={(e) => setQ(e.target.value)} placeholder="e.g. Augmentin, Insulin, 1230…" style={{ width: "100%", height: 46, paddingLeft: 42, paddingRight: 12, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14.5, outline: "none", boxSizing: "border-box" }} /></div>
    {q.trim() === "" && <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "40px 0" }}>Start typing to locate a medication across all sites.</div>}
    {q.trim() !== "" && results.length === 0 && <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "40px 0" }}>No medication matches "{q}".</div>}
    <div style={{ display: "grid", gap: 16 }}>{results.map((m) => { const total = m.camps.reduce((s, c) => s + c.qty, 0);
      return (<div key={m.code} style={card(t)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div><span style={{ fontSize: 16, fontWeight: 700 }}>{m.name}</span><span style={{ fontSize: 12, color: t.textMuted, fontFamily: "monospace", marginLeft: 8 }}>code {m.code}</span></div><span style={{ fontSize: 13, fontWeight: 700, color: t.primary, background: t.primarySoft, padding: "5px 12px", borderRadius: 20 }}>{total.toLocaleString()} total</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>{m.camps.map((c) => { const dd = d2e(c.expiry), out = c.qty === 0, near = dd <= 90;
          return (<div key={c.camp} style={{ background: t.surfaceAlt, borderRadius: 10, padding: 12, borderLeft: `4px solid ${out ? t.danger : near ? t.warning : t.cold}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600 }}><MapPin size={12} color={t.textMuted} /> {c.camp}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}><span style={{ fontSize: 22, fontWeight: 800, color: out ? t.danger : t.text }}>{out ? "out" : c.qty}</span><span style={{ fontSize: 11, color: t.textMuted }}>units</span></div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4, fontFamily: "monospace" }}>{c.batch}</div>
            <div style={{ fontSize: 11, color: near ? t.warning : t.textMuted, marginTop: 2, fontWeight: near ? 700 : 400, display: "flex", alignItems: "center", gap: 4 }}>{near && <AlertTriangle size={10} />} exp {dd <= 90 ? `${dd}d` : new Date(c.expiry).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</div></div>); })}</div>
      </div>); })}</div>
  </Page>);
}

/* ================= INVENTORY LOG ================= */
const MOVE_TYPES = ["Expiry box", "Crash cart", "Emergency room", "Dispensed (extra)"];
const REMARK_FLAGS = ["RESERVED", "Store cold", "High alert", "LASA"];
const LOG_SEED = [
  { id: 1, code: "1230", name: "Paracetamol 500mg", batch: "PAR-2025-A", expiry: "2026-11-30", date: today(), begin: 2010, dispensed: 1850, moveTo: "Tariq Camp", moved: 120, flags: [], min: 400, max: 2500, controlled: false, received: 0, counted: null, by: "Yaqeen", at: "08:40" },
  { id: 2, code: "1234", name: "Augmentin 650mg", batch: "AUG-650-X", expiry: "2026-08-15", date: today(), begin: 600, dispensed: 420, moveTo: "—", moved: 0, flags: ["RESERVED"], min: 150, max: 800, controlled: false, received: 0, counted: null, by: "S. Hassan", at: "09:15" },
  { id: 3, code: "1450", name: "Ceftriaxone 1g", batch: "CEF-2291", expiry: "2026-07-04", date: today(), begin: 200, dispensed: 60, moveTo: "Expiry box", moved: 16, flags: ["High alert"], min: 60, max: 300, controlled: false, received: 0, counted: null, by: "Yaqeen", at: "11:02" },
  { id: 4, code: "1700", name: "Insulin Glargine", batch: "INS-0042", expiry: "2026-07-28", date: today(), begin: 120, dispensed: 86, moveTo: "Al-Rayyan Field Clinic", moved: 10, flags: ["Store cold"], min: 40, max: 200, controlled: false, received: 0, counted: null, by: "S. Hassan", at: "13:30" },
  { id: 5, code: "1820", name: "Morphine sulfate 10mg", batch: "MOR-CD-77", expiry: "2026-09-20", date: today(), begin: 80, dispensed: 22, moveTo: "—", moved: 0, flags: ["High alert", "Controlled"], min: 20, max: 120, controlled: true, received: 0, counted: null, by: "Yaqeen", at: "14:05" },
];
const ARCHIVE_SEED = [
  { id: 5001, camp: "Al-Udeid Clinic", month: "June 2026", closedBy: "Yaqeen", closedOn: "2026-07-01", rows: [
    { code: "1230", name: "Paracetamol 500mg", begin: 1800, received: 400, dispensed: 1620, moved: 90, closing: 490 },
    { code: "1234", name: "Augmentin 650mg", begin: 700, received: 0, dispensed: 510, moved: 0, closing: 190 },
    { code: "1450", name: "Ceftriaxone 1g", begin: 240, received: 60, dispensed: 88, moved: 20, closing: 192 },
    { code: "1700", name: "Insulin Glargine", begin: 140, received: 40, dispensed: 96, moved: 12, closing: 72 },
    { code: "1820", name: "Morphine sulfate 10mg", begin: 90, received: 0, dispensed: 30, moved: 0, closing: 60 },
  ] },
  { id: 5002, camp: "Al-Udeid Clinic", month: "May 2026", closedBy: "Yaqeen", closedOn: "2026-06-01", rows: [
    { code: "1230", name: "Paracetamol 500mg", begin: 1600, received: 600, dispensed: 1400, moved: 0, closing: 800 },
    { code: "1234", name: "Augmentin 650mg", begin: 620, received: 200, dispensed: 470, moved: 50, closing: 300 },
    { code: "1450", name: "Ceftriaxone 1g", begin: 200, received: 100, dispensed: 76, moved: 0, closing: 224 },
    { code: "1700", name: "Insulin Glargine", begin: 120, received: 40, dispensed: 84, moved: 0, closing: 76 },
  ] },
  { id: 5003, camp: "Tariq Camp", month: "June 2026", closedBy: "Dalia & Asmaa", closedOn: "2026-07-01", rows: [
    { code: "1230", name: "Paracetamol 500mg", begin: 1000, received: 1200, dispensed: 1500, moved: 0, closing: 700 },
    { code: "1234", name: "Augmentin 650mg", begin: 1500, received: 2000, dispensed: 2600, moved: 0, closing: 900 },
  ] },
];
function autoRemarks(r, t, disp) { const used = disp == null ? r.dispensed : disp; const rem = r.begin - used - r.moved, dd = d2e(r.expiry), out = [];
  if (rem <= r.begin * 0.15) out.push({ k: "Low quantity", fg: t.warning, bg: t.warningSoft });
  if (dd <= 90) out.push({ k: "Near expiry", fg: t.danger, bg: t.dangerSoft }); return out; }

/* ================= CHRONIC PATIENTS LOG (Pharmacist enters · Medical views) ================= */
const RANKS = ["Recruit", "Private", "Corporal", "Sergeant", "Staff Sergeant", "Warrant Officer", "2nd Lieutenant", "Lieutenant", "Captain", "Major", "Lt. Colonel", "Colonel", "Brigadier", "Civilian"];
const CHRONIC_SEED = [
  { id: 1, name: "A. Al-Sulaiti", rank: "Sergeant", mil: "QA-44821", date: today(), meds: "Metformin 850mg, Amlodipine 5mg", qty: 60, notes: "Monthly refill — diabetes + HTN" },
  { id: 2, name: "K. Al-Marri", rank: "Captain", mil: "QA-11907", date: today(), meds: "Atorvastatin 20mg", qty: 30, notes: "Lipid control" },
];
function ChronicLog({ mode, allocatedCamp, role, userName }) {
  const t = useT(); const viewer = mode === "viewer";
  const [rows, setRows] = useState(CHRONIC_SEED); const [q, setQ] = useState(""); const [modal, setModal] = useState(null);
  const filtered = rows.filter((r) => q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.mil.toLowerCase().includes(q.toLowerCase()) || r.meds.toLowerCase().includes(q.toLowerCase()));
  const save = (r) => { if (r.id) setRows((p) => p.map((x) => x.id === r.id ? r : x)); else setRows((p) => [{ ...r, id: Date.now() }, ...p]); setModal(null); };
  const remove = (id) => setRows((p) => p.filter((x) => x.id !== id));
  const exportAll = () => { const body = filtered.map((r, i) => `<tr><td>${i + 1}</td><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.rank)}</td><td>${escapeHTML(r.mil)}</td><td>${escapeHTML(r.date)}</td><td>${escapeHTML(r.meds)}</td><td>${r.qty}</td><td>${escapeHTML(r.notes || "")}</td></tr>`).join("");
    exportPDF("Chronic patients log", `<table><thead><tr><th>#</th><th>Patient</th><th>Rank</th><th>Military no.</th><th>Date</th><th>Medications</th><th>Qty</th><th>Notes</th></tr></thead><tbody>${body}</tbody></table>`, `${allocatedCamp} · ${filtered.length} patient(s)`); };
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, textAlign: "left", borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  return (<Page title="Chronic Pts log" subtitle={viewer ? `${allocatedCamp} — view only.` : `${allocatedCamp} — chronic patient medication record.`}
    info="A standing record of chronic patients and their regular medications: name, rank, military number, date, medications and quantity, plus notes. Pharmacists add and edit; Medical can view. Export to a PDF (with the camp/clinic name in the header) for physical records."
    action={<div style={{ display: "flex", gap: 8 }}><ExportButton title="Chronic patients log" build={() => ({ bodyHTML: `<table><thead><tr><th>#</th><th>Patient</th><th>Rank</th><th>Military no.</th><th>Date</th><th>Medications</th><th>Qty</th><th>Notes</th></tr></thead><tbody>${filtered.map((r, i) => `<tr><td>${i + 1}</td><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.rank)}</td><td>${escapeHTML(r.mil)}</td><td>${escapeHTML(r.date)}</td><td>${escapeHTML(r.meds)}</td><td>${r.qty}</td><td>${escapeHTML(r.notes || "")}</td></tr>`).join("")}</tbody></table>`, text: `${filtered.length} chronic patient(s).` })} />{!viewer && <button onClick={() => setModal({ name: "", rank: RANKS[1], mil: "", date: today(), meds: "", qty: "", notes: "" })} style={btn(t)}><Plus size={15} /> Add patient</button>}</div>}>
    <div style={{ position: "relative", marginBottom: 14, maxWidth: 420 }}><Search size={16} color={t.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, military no. or medication…" style={{ width: "100%", height: 42, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14, padding: "0 14px 0 40px", outline: "none", boxSizing: "border-box" }} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
      <Metric label="Chronic patients" value={rows.length} tone="primary" />
      <Metric label="On multiple meds" value={rows.filter((r) => r.meds.includes(",")).length} tone="accent" />
      <Metric label="Total dispensed (qty)" value={rows.reduce((s, r) => s + (Number(r.qty) || 0), 0).toLocaleString()} tone="success" />
    </div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
        <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "center", width: 34 }}>#</th><th style={th}>Patient</th><th style={th}>Rank</th><th style={th}>Military no.</th><th style={th}>Date</th><th style={th}>Medications</th><th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>Notes</th>{!viewer && <th style={{ ...th, textAlign: "right" }}></th>}</tr></thead>
        <tbody>{filtered.map((r, i) => (<tr key={r.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
          <td style={{ ...td, textAlign: "center", color: t.textMuted, fontWeight: 700 }}>{i + 1}</td>
          <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
          <td style={td}>{r.rank}</td>
          <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{r.mil}</td>
          <td style={{ ...td, fontSize: 12, color: t.textMuted }}>{r.date}</td>
          <td style={{ ...td, maxWidth: 220, whiteSpace: "normal" }}>{r.meds}</td>
          <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{Number(r.qty).toLocaleString()}</td>
          <td style={{ ...td, maxWidth: 200, whiteSpace: "normal", color: t.textMuted, fontSize: 12 }}>{r.notes}</td>
          {!viewer && <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}><button onClick={() => setModal(r)} aria-label="Edit" style={{ ...miniBtn(t), color: t.primary }}><Pencil size={12} /></button> <button onClick={() => remove(r.id)} aria-label="Remove" style={{ ...miniBtn(t), color: t.danger }}><Trash2 size={12} /></button></td>}
        </tr>))}{filtered.length === 0 && <tr><td colSpan={viewer ? 8 : 9} style={{ ...td, textAlign: "center", color: t.textMuted, padding: 28 }}>No chronic patients recorded yet.</td></tr>}</tbody>
      </table>
    </div></div>
    {viewer && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted, marginTop: 12 }}><Lock size={13} /> View only — chronic entries are added by the camp pharmacist.</div>}
    {modal && <ChronicModal initial={modal} onClose={() => setModal(null)} onSave={save} />}
  </Page>);
}
function ChronicModal({ initial, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ ...initial });
  const v = f.name.trim() && f.mil.trim() && f.meds.trim() && f.qty !== "";
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={f.id ? "Edit chronic patient" : "Add chronic patient"} icon={HeartPulse} onClose={onClose} width={540}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Patient name</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={fld} placeholder="Full name" /></div>
      <div><label style={lab}>Rank</label><select value={f.rank} onChange={(e) => setF({ ...f, rank: e.target.value })} style={fld}>{RANKS.map((r) => <option key={r}>{r}</option>)}</select></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Military no.</label><input value={f.mil} onChange={(e) => setF({ ...f, mil: e.target.value })} style={fld} placeholder="QA-00000" /></div>
      <div><label style={lab}>Date</label><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} style={fld} /></div>
    </div>
    <label style={lab}>Medications</label><textarea value={f.meds} onChange={(e) => setF({ ...f, meds: e.target.value })} rows={2} style={{ ...fld, height: "auto", padding: "10px 12px", resize: "vertical", marginBottom: 14, fontFamily: "inherit" }} placeholder="e.g. Metformin 850mg, Amlodipine 5mg" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 18 }}>
      <div><label style={lab}>Quantity</label><input type="number" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={fld} placeholder="0" /></div>
      <div><label style={lab}>Notes / remarks</label><input value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} style={fld} placeholder="Optional" /></div>
    </div>
    <button onClick={() => onSave({ ...f, qty: Number(f.qty) || 0 })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> {f.id ? "Save changes" : "Add patient"}</button>
  </Modal>);
}

/* ================= BATCH TRACEABILITY & RECALL ================= */
const BATCH_SEED = [
  { id: 1, code: "1230", name: "Paracetamol 500mg", batch: "PAR-2025-A", supplier: "Qatar Pharma", received: "2025-09-12", qty: 2010, expiry: "2026-11-30", locations: "Al-Udeid Clinic, Tariq Camp", status: "active" },
  { id: 2, code: "1234", name: "Augmentin 650mg", batch: "AUG-650-X", supplier: "GSK Gulf", received: "2025-10-02", qty: 600, expiry: "2026-08-15", locations: "Al-Udeid Clinic", status: "active" },
  { id: 3, code: "1450", name: "Ceftriaxone 1g", batch: "CEF-2291", supplier: "Hikma", received: "2025-08-20", qty: 200, expiry: "2026-07-04", locations: "Al-Udeid Clinic", status: "active" },
  { id: 4, code: "1700", name: "Insulin Glargine", batch: "INS-0042", supplier: "Sanofi", received: "2025-11-01", qty: 120, expiry: "2026-07-28", locations: "Al-Rayyan Field Clinic", status: "active" },
];
function BatchRecall({ allocatedCamp, userName }) {
  const t = useT(); const { notify } = useApp();
  const [rows, setRows] = useState(BATCH_SEED); const [q, setQ] = useState(""); const [recallFor, setRecallFor] = useState(null);
  const filtered = rows.filter((r) => q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.batch.toLowerCase().includes(q.toLowerCase()) || r.code.includes(q) || r.supplier.toLowerCase().includes(q.toLowerCase()));
  const recalled = rows.filter((r) => r.status === "recalled").length;
  const doRecall = (r, reason) => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: "recalled", reason } : x)); notify("Expiry", ["Pharmacist", "Management", "Sub-Manager", "Store"], `🚨 RECALL: ${r.name} batch ${r.batch} (${r.supplier}). ${reason} Quarantine all stock at: ${r.locations}.`); setRecallFor(null); };
  const undo = (id) => setRows((p) => p.map((x) => x.id === id ? { ...x, status: "active", reason: undefined } : x));
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, textAlign: "left", borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  return (<Page title="Batches & recall" subtitle={`${allocatedCamp} — batch-level traceability and recall handling.`}
    info="Every batch is traced from supplier and received date through to the locations holding it. If a supplier or authority issues a recall, flag the batch: it's quarantined and an alert goes to all sites holding that batch so they can pull it from the shelf."
    action={<ExportButton title="Batch traceability" build={() => ({ bodyHTML: `<table><thead><tr><th>Code</th><th>Medication</th><th>Batch</th><th>Supplier</th><th>Received</th><th>Qty</th><th>Expiry</th><th>Locations</th><th>Status</th></tr></thead><tbody>${filtered.map((r) => `<tr><td>${escapeHTML(r.code)}</td><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.batch)}</td><td>${escapeHTML(r.supplier)}</td><td>${escapeHTML(r.received)}</td><td>${r.qty}</td><td>${escapeHTML(r.expiry)}</td><td>${escapeHTML(r.locations)}</td><td>${r.status}</td></tr>`).join("")}</tbody></table>`, text: `${filtered.length} batch(es).` })} />}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
      <Metric label="Tracked batches" value={rows.length} tone="primary" />
      <Metric label="Recalled / quarantined" value={recalled} tone={recalled ? "danger" : "success"} info="Batches flagged for recall — pull from shelf." />
      <Metric label="Suppliers" value={new Set(rows.map((r) => r.supplier)).size} tone="accent" />
    </div>
    <div style={{ position: "relative", marginBottom: 14, maxWidth: 380 }}><Search size={16} color={t.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medication, batch or supplier…" style={{ width: "100%", height: 42, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14, padding: "0 14px 0 40px", outline: "none", boxSizing: "border-box" }} /></div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
        <thead><tr style={{ background: t.head }}><th style={th}>Medication</th><th style={th}>Batch</th><th style={th}>Supplier</th><th style={th}>Received</th><th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>Expiry</th><th style={th}>Locations</th><th style={{ ...th, textAlign: "right" }}>Action</th></tr></thead>
        <tbody>{filtered.map((r, i) => { const recalledRow = r.status === "recalled";
          return (<tr key={r.id} style={{ background: recalledRow ? t.dangerSoft : i % 2 ? t.zebra : t.surface }}>
            <td style={{ ...td, fontWeight: 600 }}>{r.name}<div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: "monospace" }}>{r.code}</div></td>
            <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{r.batch}</td>
            <td style={td}>{r.supplier}</td>
            <td style={{ ...td, fontSize: 12, color: t.textMuted }}>{r.received}</td>
            <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{r.qty.toLocaleString()}</td>
            <td style={{ ...td, fontSize: 12 }}>{new Date(r.expiry).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</td>
            <td style={{ ...td, fontSize: 12, color: t.textMuted, maxWidth: 180, whiteSpace: "normal" }}>{r.locations}</td>
            <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>{recalledRow
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: t.danger, background: t.surface, padding: "3px 9px", borderRadius: 12 }}>RECALLED</span><button onClick={() => undo(r.id)} style={{ ...btn(t, "ghost"), height: 28, fontSize: 11.5 }}>Undo</button></span>
              : <button onClick={() => setRecallFor(r)} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12, color: t.danger, borderColor: t.danger + "55" }}><AlertTriangle size={13} /> Recall</button>}</td>
          </tr>); })}</tbody>
      </table>
    </div></div>
    {recallFor && <RecallModal item={recallFor} onClose={() => setRecallFor(null)} onConfirm={(reason) => doRecall(recallFor, reason)} />}
  </Page>);
}
function RecallModal({ item, onClose, onConfirm }) {
  const t = useT(); const [reason, setReason] = useState("");
  const fld = { width: "100%", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (<Modal title="Flag batch for recall" icon={AlertTriangle} onClose={onClose}>
    <div style={{ background: t.dangerSoft, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: t.danger }}>{item.name}</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>Batch {item.batch} · {item.supplier} · held at {item.locations}</div>
    </div>
    <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" }}>Reason for recall</label>
    <textarea value={reason} autoFocus onChange={(e) => setReason(e.target.value)} rows={3} style={{ ...fld, marginBottom: 16, resize: "vertical" }} placeholder="e.g. Supplier quality alert — particulate contamination." />
    <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16, display: "flex", gap: 6 }}><Info size={13} style={{ flexShrink: 0, marginTop: 1 }} /> All sites holding this batch will be notified to quarantine and pull it from the shelf.</div>
    <button onClick={() => onConfirm(reason.trim() || "Recall issued.")} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", background: t.danger }}><AlertTriangle size={16} /> Issue recall &amp; notify sites</button>
  </Modal>);
}

/* ================= CONTROLLED-DRUG REGISTER (double-signature) ================= */
const CD_SEED = [
  { id: 1, date: today(), drug: "Morphine sulfate 10mg", batch: "MOR-CD-77", txn: "Dispensed", qty: 2, balance: 78, patient: "A. Al-Sulaiti (QA-44821)", by: "Yaqeen", witness: "S. Hassan" },
  { id: 2, date: today(), drug: "Morphine sulfate 10mg", batch: "MOR-CD-77", txn: "Received", qty: 50, balance: 80, patient: "—", by: "Yaqeen", witness: "Capt. Hassan Al-Kuwari" },
];
const CD_TXN = ["Dispensed", "Received", "Wasted", "Returned"];
function ControlledRegister({ allocatedCamp, userName, role }) {
  const t = useT();
  const [rows, setRows] = useState(CD_SEED); const [modal, setModal] = useState(false);
  const add = (r) => { setRows((p) => [{ id: Date.now(), date: today(), ...r }, ...p]); setModal(false); };
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, textAlign: "left", borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  const txnColor = (x) => x === "Dispensed" ? t.primary : x === "Received" ? t.success : x === "Wasted" ? t.danger : t.warning;
  return (<Page title="Controlled-drug register" subtitle={`${allocatedCamp} — legally controlled substances. Every entry requires a witness signature.`}
    info="A tamper-evident register for controlled drugs. Every transaction (dispensed, received, wasted, returned) records a running balance and must be signed by the pharmacist and a witness — the double-signature required for controlled substances. Entries can't be edited or deleted, only added (corrections are new lines)."
    action={<><ExportButton title="Controlled-drug register" build={() => ({ bodyHTML: `<table><thead><tr><th>Date</th><th>Drug</th><th>Batch</th><th>Transaction</th><th>Qty</th><th>Balance</th><th>Patient</th><th>Pharmacist</th><th>Witness</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${escapeHTML(r.date)}</td><td>${escapeHTML(r.drug)}</td><td>${escapeHTML(r.batch)}</td><td>${escapeHTML(r.txn)}</td><td>${r.qty}</td><td>${r.balance}</td><td>${escapeHTML(r.patient)}</td><td>${escapeHTML(r.by)}</td><td>${escapeHTML(r.witness)}</td></tr>`).join("")}</tbody></table>`, text: `${rows.length} controlled-drug entries.` })} /><button onClick={() => setModal(true)} style={btn(t)}><Plus size={15} /> New entry</button></>}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: t.warning, background: t.warningSoft, borderRadius: 10, padding: "10px 13px", marginBottom: 16 }}><ShieldCheck size={15} /> Controlled substances — double-signature enforced. Entries are append-only for audit integrity.</div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
        <thead><tr style={{ background: t.head }}><th style={th}>Date</th><th style={th}>Drug</th><th style={th}>Transaction</th><th style={{ ...th, textAlign: "right" }}>Qty</th><th style={{ ...th, textAlign: "right" }}>Balance</th><th style={th}>Patient</th><th style={th}>Pharmacist</th><th style={th}>Witness</th></tr></thead>
        <tbody>{rows.map((r, i) => (<tr key={r.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
          <td style={{ ...td, fontSize: 12, color: t.textMuted, whiteSpace: "nowrap" }}>{r.date}</td>
          <td style={{ ...td, fontWeight: 600 }}>{r.drug}<div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: "monospace" }}>{r.batch}</div></td>
          <td style={td}><span style={{ fontSize: 11, fontWeight: 700, color: txnColor(r.txn), background: txnColor(r.txn) + "1A", padding: "3px 9px", borderRadius: 12 }}>{r.txn}</span></td>
          <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{r.qty}</td>
          <td style={{ ...td, textAlign: "right", fontWeight: 800, color: t.primary }}>{r.balance}</td>
          <td style={{ ...td, fontSize: 12 }}>{r.patient}</td>
          <td style={{ ...td, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Pencil size={11} color={t.success} /> {r.by}</span></td>
          <td style={{ ...td, fontSize: 12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={11} color={t.success} /> {r.witness}</span></td>
        </tr>))}</tbody>
      </table>
    </div></div>
    {modal && <CDModal lastBalance={rows[0]?.balance ?? 0} userName={userName} onClose={() => setModal(false)} onSave={add} />}
  </Page>);
}
function CDModal({ lastBalance, userName, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ drug: "Morphine sulfate 10mg", batch: "MOR-CD-77", txn: "Dispensed", qty: "", patient: "", by: userName, witness: "" });
  const qty = Number(f.qty) || 0;
  const newBal = f.txn === "Received" || f.txn === "Returned" ? lastBalance + qty : lastBalance - qty;
  const v = f.drug.trim() && f.qty && f.by.trim() && f.witness.trim() && (f.txn !== "Dispensed" || f.patient.trim());
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="New controlled-drug entry" icon={ShieldCheck} onClose={onClose} width={540}>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Drug</label><input value={f.drug} onChange={(e) => setF({ ...f, drug: e.target.value })} style={fld} /></div>
      <div><label style={lab}>Batch</label><input value={f.batch} onChange={(e) => setF({ ...f, batch: e.target.value })} style={fld} /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Transaction</label><select value={f.txn} onChange={(e) => setF({ ...f, txn: e.target.value })} style={fld}>{CD_TXN.map((x) => <option key={x}>{x}</option>)}</select></div>
      <div><label style={lab}>Quantity</label><input type="number" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={fld} placeholder="0" /></div>
    </div>
    {f.txn === "Dispensed" && <><label style={lab}>Patient (name + military no.)</label><input value={f.patient} onChange={(e) => setF({ ...f, patient: e.target.value })} style={{ ...fld, marginBottom: 14 }} placeholder="e.g. A. Al-Sulaiti (QA-44821)" /></>}
    <div style={{ background: t.surfaceAlt, borderRadius: 10, padding: "10px 13px", marginBottom: 14, fontSize: 13, display: "flex", justifyContent: "space-between" }}><span style={{ color: t.textMuted }}>New running balance</span><b style={{ color: newBal < 0 ? t.danger : t.primary }}>{newBal}</b></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
      <div><label style={lab}>Pharmacist</label><input value={f.by} onChange={(e) => setF({ ...f, by: e.target.value })} style={fld} /></div>
      <div><label style={lab}>Witness (2nd signature)</label><input value={f.witness} onChange={(e) => setF({ ...f, witness: e.target.value })} style={fld} placeholder="Required" /></div>
    </div>
    <button onClick={() => onSave({ drug: f.drug.trim(), batch: f.batch.trim(), txn: f.txn, qty, balance: newBal, patient: f.patient.trim() || "—", by: f.by.trim(), witness: f.witness.trim() })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><ShieldCheck size={16} /> Record with both signatures</button>
  </Modal>);
}

/* ================= SHIFT HANDOVER ================= */
const HANDOVER_SEED = [
  { id: 1, shift: "Morning → Afternoon", by: "Yaqeen", time: "Today 14:00", note: "Fridge temp logged at 4.6°C. Ceftriaxone CEF-2291 moved to expiry box (16 units). Awaiting Augmentin delivery from main store." },
  { id: 2, shift: "Night → Morning", by: "S. Hassan", time: "Today 07:30", note: "Quiet night. Insulin stock low — flagged for reorder. One controlled-drug entry pending witness." },
];
function Handover({ allocatedCamp, userName }) {
  const t = useT(); const [rows, setRows] = useState(HANDOVER_SEED); const [modal, setModal] = useState(false);
  const add = (r) => { setRows((p) => [{ id: Date.now(), time: "Just now", by: userName, ...r }, ...p]); setModal(false); };
  return (<Page title="Shift handover" subtitle={`${allocatedCamp} — pass the key information to the next shift.`}
    info="A simple running handover log. At the end of a shift, note what the next pharmacist needs to know — outstanding tasks, deliveries, fridge readings, anything pending. Entries are time-stamped and attributed."
    action={<><ExportButton title="Shift handover log" build={() => ({ bodyHTML: `<table><thead><tr><th>Shift</th><th>By</th><th>Time</th><th>Note</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${escapeHTML(r.shift)}</td><td>${escapeHTML(r.by)}</td><td>${escapeHTML(r.time)}</td><td>${escapeHTML(r.note)}</td></tr>`).join("")}</tbody></table>`, text: `${rows.length} handover note(s).` })} /><button onClick={() => setModal(true)} style={btn(t)}><Plus size={15} /> New handover</button></>}>
    <div style={{ display: "grid", gap: 12 }}>{rows.map((r) => (<div key={r.id} style={card(t)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700 }}><RotateCcw size={15} color={t.primary} /> {r.shift}</span>
        <span style={{ fontSize: 11.5, color: t.textMuted }}>{r.by} · {r.time}</span>
      </div>
      <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.6 }}>{r.note}</div>
    </div>))}</div>
    {modal && <HandoverModal userName={userName} onClose={() => setModal(false)} onSave={add} />}
  </Page>);
}
function HandoverModal({ userName, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ shift: "Morning → Afternoon", note: "" }); const v = f.note.trim();
  const fld = { width: "100%", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="New shift handover" icon={StickyNote} onClose={onClose}>
    <label style={lab}>Shift</label><select value={f.shift} onChange={(e) => setF({ ...f, shift: e.target.value })} style={{ ...fld, height: 42, marginBottom: 14 }}>{["Morning → Afternoon", "Afternoon → Night", "Night → Morning"].map((s) => <option key={s}>{s}</option>)}</select>
    <label style={lab}>Handover note</label><textarea value={f.note} autoFocus onChange={(e) => setF({ ...f, note: e.target.value })} rows={5} style={{ ...fld, marginBottom: 18, resize: "vertical" }} placeholder="What does the next shift need to know? Pending tasks, deliveries, fridge readings, alerts…" />
    <button onClick={() => onSave({ shift: f.shift, note: f.note.trim() })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> Post handover</button>
  </Modal>);
}
function LogsScreen({ role, privileged, canEditStock, allocatedCamp, userName }) {
  const t = useT(); const { camps } = useApp(); const isMed = role === "Medical";
  const isMgmt = role === "Management" || role === "Sub-Manager"; // view-only across camps
  const viewerMode = isMed || isMgmt; // these roles never enter quantities
  const showReqStocks = role === "Pharmacist" || isMgmt;
  const [tab, setTab] = useState(isMed ? "inventory" : "daily");
  const [viewCamp, setViewCamp] = useState(isMgmt ? (camps && camps[0]) || allocatedCamp : allocatedCamp);
  const camp = isMgmt ? viewCamp : allocatedCamp;
  const allTabs = [{ k: "daily", label: "Daily log", icon: CalendarDays }, { k: "inventory", label: "Inventory log", icon: ClipboardList }, { k: "chronic", label: "Chronic Pts log", icon: HeartPulse }];
  let tabs = isMed ? allTabs.filter((x) => x.k !== "daily") : allTabs;
  if (showReqStocks) tabs = [...tabs, { k: "reqstocks", label: "Medical Req. stocks", icon: PackageCheck }];
  tabs = [...tabs, { k: "history", label: "History", icon: Clock }]; // monthly archive for all who see logs
  return (<div>
    {isMgmt && <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textMuted, display: "inline-flex", alignItems: "center", gap: 6 }}><Eye size={14} /> Viewing camp/clinic:</span>
      <select value={viewCamp} onChange={(e) => setViewCamp(e.target.value)} style={{ height: 40, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, padding: "0 12px", fontWeight: 700 }}>{(camps || []).map((c) => <option key={c}>{c}</option>)}</select>
      <span style={{ fontSize: 11.5, color: t.textMuted }}>View-only — quantities are entered by the camp pharmacist.</span>
    </div>}
    <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: t.surfaceAlt, border: `1px solid ${t.border}`, marginBottom: 4, flexWrap: "wrap" }}>
      {tabs.map((x) => { const on = tab === x.k; const Ic = x.icon;
        return (<button key={x.k} onClick={() => setTab(x.k)} style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700, background: on ? t.primary : "transparent", color: on ? "#fff" : t.textMuted, boxShadow: on ? "0 3px 10px rgba(45,125,210,0.28)" : "none", transition: "all .15s" }}><Ic size={15} /> {x.label}</button>); })}
    </div>
    {tab === "history"
      ? <HistoryLog camp={camp} role={role} />
      : tab === "daily" && !isMed
      ? <Dispensing canEdit={canEditStock && !isMgmt} privileged={privileged} allocatedCamp={camp} viewer={isMgmt} />
      : tab === "chronic"
      ? <ChronicLog mode={viewerMode ? "viewer" : "full"} allocatedCamp={camp} role={role} userName={userName} />
      : tab === "reqstocks"
      ? <MedReqStocks allocatedCamp={camp} userName={userName} />
      : <InventoryLog mode={viewerMode ? "viewer" : "full"} allocatedCamp={camp} role={role} userName={userName} />}
  </div>);
}
function HistoryLog({ camp, role }) {
  const t = useT(); const { archive } = useApp();
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}`, textAlign: "left" };
  const td = { padding: "9px 11px", fontSize: 13, borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  const months = (archive || []).filter((a) => a.camp === camp);
  const [sel, setSel] = useState(null);
  const snap = months.find((m) => m.id === sel) || months[0];
  const exportSnap = (m) => exportPDF(`Inventory archive — ${m.camp} — ${m.month}`, `<table><thead><tr><th>Code</th><th>Medication</th><th>Begin</th><th>Received</th><th>Dispensed</th><th>Moved</th><th>Closing balance</th></tr></thead><tbody>${m.rows.map((r) => `<tr><td>${escapeHTML(r.code)}</td><td>${escapeHTML(r.name)}</td><td>${r.begin}</td><td>${r.received}</td><td>${r.dispensed}</td><td>${r.moved}</td><td>${r.closing}</td></tr>`).join("")}</tbody></table>`, { camp: m.camp, extra: `Archive · ${m.month}` });
  return (<div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
      <div><div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><Clock size={19} color={t.primary} /> History</div>
      <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 4 }}>{camp} — archived monthly inventory snapshots. Each month is saved when the pharmacist closes it with a month-end count.</div></div>
    </div>
    {months.length === 0
      ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "34px 16px" }}>No archived months yet for {camp}. A snapshot is saved here each time a month-end count is confirmed.</div>
      : <>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>{months.map((m) => { const on = (snap && snap.id === m.id); return (<button key={m.id} onClick={() => setSel(m.id)} style={{ height: 36, padding: "0 15px", borderRadius: 999, border: `1px solid ${on ? t.primary : t.border}`, background: on ? t.primary : t.surface, color: on ? "#fff" : t.text, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>{m.month}</button>); })}</div>
        {snap && <div style={{ ...card(t) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <div><div style={{ fontSize: 15, fontWeight: 800 }}>{snap.month}</div><div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>Closed by {snap.closedBy} · {snap.closedOn}</div></div>
            <button onClick={() => exportSnap(snap)} style={btn(t, "ghost")}><FileText size={15} /> Export</button>
          </div>
          <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead><tr style={{ background: t.head }}><th style={th}>Code</th><th style={th}>Medication</th><th style={{ ...th, textAlign: "right" }}>Begin</th><th style={{ ...th, textAlign: "right" }}>Received</th><th style={{ ...th, textAlign: "right" }}>Dispensed</th><th style={{ ...th, textAlign: "right" }}>Moved</th><th style={{ ...th, textAlign: "right" }}>Closing</th></tr></thead>
            <tbody>{snap.rows.map((r, i) => (<tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}><td style={{ ...td, fontFamily: "monospace", color: t.textMuted }}>{r.code}</td><td style={{ ...td, fontWeight: 600 }}>{r.name}</td><td style={{ ...td, textAlign: "right" }}>{r.begin}</td><td style={{ ...td, textAlign: "right", color: t.success }}>{r.received}</td><td style={{ ...td, textAlign: "right", color: t.primary }}>{r.dispensed}</td><td style={{ ...td, textAlign: "right", color: t.warning }}>{r.moved}</td><td style={{ ...td, textAlign: "right", fontWeight: 800 }}>{r.closing}</td></tr>))}</tbody>
          </table></div>
        </div>}
      </>}
  </div>);
}
function MedReqStocks({ allocatedCamp, userName }) {
  const t = useT(); const { medReqs, patchMedReq, adjustInv, notify } = useApp();
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}`, textAlign: "left" };
  const td = { padding: "9px 11px", fontSize: 13, borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  const rows = (medReqs || []).filter((r) => r.pharmAction && (r.source === allocatedCamp || r.destCamp === allocatedCamp));
  const codeFor = (name) => { const m = STORE_STOCK_SEED.find((s) => s.name === name) || LOG_SEED.find((s) => s.name === name); return m ? m.code : name; };
  const confirm = (r) => {
    const code = codeFor(r.item);
    if (r.pharmAction === "fulfil") { adjustInv(allocatedCamp, code, "mov", r.qty); notify("Stock", ["Pharmacist"], `➖ ${r.qty} × ${r.item} deducted from ${allocatedCamp} (sent to ${r.destCamp}). Confirm receipt at ${r.destCamp}.`); patchMedReq(r.id, { stage: "receive", pharmAction: null, confirmedAt: today() }); }
    else { adjustInv(allocatedCamp, code, "recv", r.qty); notify("Stock", ["Pharmacist", "Management"], `➕ ${r.qty} × ${r.item} added to ${allocatedCamp} (received from ${r.source}). Transfer complete.`); patchMedReq(r.id, { stage: "done", pharmAction: "received", confirmedAt: today() }); }
  };
  return (<div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
      <div><div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><PackageCheck size={19} color={t.primary} /> Medical Req. stocks</div>
      <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 4 }}>Approved transfers you chose to fulfil or receive at {allocatedCamp}. Confirm to apply the stock change to the inventory log.</div></div>
    </div>
    {rows.length === 0
      ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "34px 16px", marginTop: 14 }}>Nothing here yet. When you choose <strong>Fulfil</strong> or <strong>Receive</strong> on an approved request (in My requests), it appears here to confirm the stock change.</div>
      : <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginTop: 14 }}><div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead><tr style={{ background: t.head }}><th style={th}>Date</th><th style={th}>Medication</th><th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>From → To</th><th style={th}>Requested by</th><th style={th}>Type</th><th style={{ ...th, textAlign: "right" }}>Action</th></tr></thead>
          <tbody>{rows.map((r) => { const done = r.pharmAction === "received" || r.stage === "done"; const isFulfil = r.pharmAction === "fulfil";
            return (<tr key={r.id} style={{ borderBottom: `1px solid ${t.border}` }}>
              <td style={td}>{r.confirmedAt || r.actionDate || today()}</td>
              <td style={{ ...td, fontWeight: 600 }}>{r.item}</td>
              <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{r.qty}</td>
              <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: t.textMuted }}>{r.source} <ArrowLeftRight size={12} /> {r.destCamp}</span></td>
              <td style={{ ...td, color: t.textMuted }}>{r.fromPharmacist ? "💊" : "🩺"} {r.by}</td>
              <td style={td}><span style={{ fontSize: 11, fontWeight: 700, color: isFulfil ? t.danger : t.success, background: isFulfil ? t.dangerSoft : t.successSoft, padding: "3px 9px", borderRadius: 12 }}>{isFulfil ? "Fulfil · deduct" : "Receive · add"}</span></td>
              <td style={{ ...td, textAlign: "right" }}>{done
                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: isFulfil ? t.danger : t.success }}><Check size={13} /> {isFulfil ? `−${r.qty} deducted` : `+${r.qty} added`}</span>
                : <button onClick={() => confirm(r)} style={{ ...btn(t), height: 32, fontSize: 12, background: isFulfil ? t.danger : t.success }}><Check size={13} /> Confirm {isFulfil ? "deduction" : "addition"}</button>}</td>
            </tr>); })}</tbody>
        </table>
      </div></div>}
  </div>);
}
function InventoryLog({ mode, allocatedCamp, role, userName }) {
  const t = useT(); const { camps, dispensedMap, setBegin, invAdj, addArchive } = useApp(); const viewer = mode === "viewer";
  const [rows, setRows] = useState(LOG_SEED); const [q, setQ] = useState(""); const [add, setAdd] = useState(false); const [report, setReport] = useState(false); const [flagFor, setFlagFor] = useState(null); const [counting, setCounting] = useState(false);
  // dispensed flows in from Daily dispensing: if a matching code exists for this camp, use that month total
  const dispOf = (r) => { const v = dispensedMap[`${allocatedCamp}|${r.code}`]; return v == null ? r.dispensed : v; };
  const adjOf = (r) => (invAdj && invAdj[`${allocatedCamp}|${r.code}`]) || { recv: 0, mov: 0 }; // confirmed medical-request stock actions
  const rem = (r) => { const a = adjOf(r); return r.begin + (r.received || 0) + a.recv - dispOf(r) - r.moved - a.mov; }; // balance = begin + received + reqReceived − dispensed − moved − reqMoved
  const snapshotMonth = () => { addArchive({ camp: allocatedCamp, month: prevMonthLabel(), closedBy: userName, closedOn: today(), rows: rows.map((r) => { const a = adjOf(r); return { code: r.code, name: r.name, begin: r.begin, received: (r.received || 0) + a.recv, dispensed: dispOf(r), moved: r.moved + a.mov, closing: rem(r) }; }) }); };
  // month-end carry-forward: counted shelf balance becomes next month's beginning; received/dispensed/moved reset
  const carryForward = (counts) => setRows((p) => p.map((r) => { const c = counts[r.id]; const beginNext = c == null || c === "" ? rem(r) : Number(c); return { ...r, begin: Math.max(0, beginNext), received: 0, dispensed: 0, moved: 0, moveTo: "—", counted: null, date: today(), by: userName, at: nowT() }; }));
  const filtered = rows.filter((r) => q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.batch.toLowerCase().includes(q.toLowerCase()) || r.code.includes(q));
  useEffect(() => { rows.forEach((r) => { if (r.code && r.code !== "—") setBegin(allocatedCamp, r.code, r.begin + (r.received || 0)); }); }, [rows, allocatedCamp]);
  const nowT = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const set = (id, f, v) => setRows((p) => p.map((r) => r.id === id ? { ...r, [f]: (f === "moveTo" || f === "recvFrom") ? v : Math.max(0, Number(v) || 0), date: today(), by: userName, at: nowT() } : r));
  const toggleFlag = (id, fl) => setRows((p) => p.map((r) => r.id === id ? { ...r, flags: r.flags.includes(fl) ? r.flags.filter((x) => x !== fl) : [...r.flags, fl] } : r));
  const th = { padding: "10px 9px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "8px 9px", fontSize: 13, textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const num = (r, k) => <input type="number" value={r[k] ?? 0} min={0} onChange={(e) => set(r.id, k, e.target.value)} style={{ width: 52, height: 30, textAlign: "right", borderRadius: 7, fontSize: 13, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 6px", outline: "none", fontFamily: "inherit" }} />;
  const moveOpts = ["—", ...MOVE_TYPES, ...camps];
  const Remarks = ({ r }) => { const auto = autoRemarks(r, t, dispOf(r));
    return (<div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: viewer ? "flex-start" : "flex-end", alignItems: "center" }}>
      {auto.map((a) => <span key={a.k} style={{ fontSize: 10.5, fontWeight: 700, color: a.fg, background: a.bg, padding: "2px 7px", borderRadius: 12 }}>{a.k}</span>)}
      {r.flags.map((fl) => { const vip = fl === "RESERVED"; return <span key={fl} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: vip ? t.purple : t.accent, background: vip ? t.purpleSoft : t.primarySoft, padding: "2px 7px", borderRadius: 12 }}>{vip && <Star size={9} />}{fl}</span>; })}
      {!viewer && <button onClick={() => setFlagFor(flagFor === r.id ? null : r.id)} aria-label="Flag" style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", display: "grid", placeItems: "center", position: "relative" }}><Flag size={11} color={t.textMuted} />
        {flagFor === r.id && <span onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 26, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 9, padding: 6, zIndex: 20, width: 130, boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>{REMARK_FLAGS.map((fl) => <button key={fl} onClick={() => toggleFlag(r.id, fl)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "5px 7px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: t.text, borderRadius: 6, textAlign: "left" }}><span style={{ width: 14 }}>{r.flags.includes(fl) ? <Check size={12} color={t.success} /> : null}</span>{fl}</button>)}</span>}
      </button>}
    </div>); };
  return (<Page title="Inventory log" subtitle={viewer ? `${allocatedCamp} — view only.` : `${allocatedCamp} — saved to this camp's records (continues across staff changes).`}
    info="Records belong to the camp/clinic, not the individual — a re-allocated colleague continues the same log. The Dispensed column is fed automatically from Daily dispensing: when an item's code matches, its month-to-date dispensed total appears here (shown with a calendar mark) and drives the remaining balance. Choose a 'Move to' destination and the moved quantity is deducted. Upload a prescription photo to count dispensing, or a batch-box photo to register a beginning balance — you confirm the read values before they're recorded. Remarks flag low quantity, near expiry, RESERVED, cold storage, high-alert and LASA."
    action={<>
      {!viewer && <ExportButton title="Inventory log" build={() => ({ bodyHTML: `<table><thead><tr><th>Code</th><th>Medication</th><th>Batch</th><th>Begin</th><th>Received</th><th>Dispensed</th><th>Moved</th><th>Remaining</th></tr></thead><tbody>${filtered.map((r) => `<tr><td>${escapeHTML(r.code)}</td><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.batch)}</td><td>${r.begin}</td><td>${r.received || 0}${r.recvFrom && (r.received || 0) > 0 ? ` (${escapeHTML(r.recvFrom)})` : ""}</td><td>${dispOf(r)}</td><td>${r.moved}</td><td>${rem(r)}</td></tr>`).join("")}</tbody></table>`, text: `${filtered.length} item(s) in the inventory log.` })} />}
      {!viewer && <>
      <UploadConfirm label="Prescription photo" hint="Attach a prescription photo; confirm the medication and quantity dispensed to record it." fields={[{ key: "name", label: "Medication" }, { key: "qty", label: "Quantity dispensed", type: "number" }]} onConfirm={(v, file) => setRows((p) => [{ id: Date.now(), code: "—", name: v.name, batch: "from Rx", expiry: "2027-12-31", date: today(), begin: Number(v.qty) || 0, dispensed: Number(v.qty) || 0, moveTo: "—", moved: 0, flags: [], source: "📷 Rx: " + file.name, by: userName, at: nowT() }, ...p])} />
      <UploadConfirm label="Batch box photo" hint="Attach a photo of the medication boxes with the batch number visible; confirm the details to register a beginning balance." fields={[{ key: "code", label: "Code" }, { key: "name", label: "Medication" }, { key: "batch", label: "Batch number" }, { key: "expiry", label: "Expiry (YYYY-MM-DD)" }, { key: "begin", label: "Beginning balance", type: "number" }]} onConfirm={(v, file) => setRows((p) => [...p, { id: Date.now(), code: v.code || "—", name: v.name, batch: v.batch || "—", expiry: v.expiry || "2027-12-31", date: today(), begin: Number(v.begin) || 0, dispensed: 0, moveTo: "—", moved: 0, flags: [], source: "📦 " + file.name, by: userName, at: nowT() }])} />
      <button onClick={() => setReport(true)} style={btn(t, "ghost")}><FileText size={15} /> Month-end report</button>
      <button onClick={() => setCounting(true)} style={btn(t, "ghost")}><ClipboardCheck size={15} /> Month-end count</button>
      <button onClick={() => setAdd(true)} style={btn(t)}><Plus size={15} /> Add medication</button>
      </>}
    </>}>
    <div style={{ position: "relative", maxWidth: 300, marginBottom: 14 }}><Search size={16} color={t.textMuted} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" style={{ width: "100%", height: 40, paddingLeft: 34, paddingRight: 12, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, outline: "none", boxSizing: "border-box" }} /></div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        {viewer ? (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "left" }}>Code</th><th style={{ ...th, textAlign: "left" }}>Batch</th><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={th}>Quantity</th><th style={{ ...th, textAlign: "left" }}>Remarks</th></tr></thead>
            <tbody>{filtered.map((r, i) => { const R = rem(r); return (<tr key={r.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
              <td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontWeight: 600 }}>{r.code}</td><td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontSize: 12 }}>{r.batch}</td><td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{r.name}</td>
              <td style={{ ...td, fontWeight: 800, color: R <= r.begin * 0.15 ? t.warning : t.text }}>{R.toLocaleString()}</td><td style={{ ...td, textAlign: "left" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Remarks r={r} /><AuthorDot name={r.by} time={r.at} /></span></td></tr>); })}</tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1040 }}>
            <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "left" }}>Code</th><th style={{ ...th, textAlign: "left" }}>Date</th><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={{ ...th, textAlign: "left" }}>Batch</th><th style={th}>Begin</th><th style={th}>Received<br/>from store</th><th style={th}>Dispensed</th><th style={{ ...th, textAlign: "left" }}>Move to</th><th style={th}>Moved</th><th style={{ ...th, color: "#fff" }}>Available<br/>balance</th><th style={{ ...th, textAlign: "left" }}>Remarks</th><th style={{ ...th, textAlign: "center" }}>By</th></tr></thead>
            <tbody>{filtered.map((r, i) => { const R = rem(r), over = R < 0, dd = d2e(r.expiry); const ex = dd <= 30 ? t.danger : dd <= 90 ? t.warning : t.textMuted;
              return (<tr key={r.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
                <td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontWeight: 600 }}>{r.code}</td>
                <td style={{ ...td, textAlign: "left", fontSize: 12, color: t.textMuted }}>{r.date}</td>
                <td style={{ ...td, textAlign: "left" }}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: ex }}>exp {dd <= 90 ? `${dd}d` : new Date(r.expiry).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</div></td>
                <td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontSize: 12 }}>{r.batch}</td>
                <td style={td}>{viewer ? <span style={{ fontWeight: 600 }}>{r.begin.toLocaleString()}</span> : num(r, "begin")}</td>
                <td style={td}>{viewer
                  ? <div><span style={{ color: (r.received || 0) > 0 ? t.success : t.textMuted, fontWeight: 600 }}>{(r.received || 0).toLocaleString()}</span>{(r.received || 0) > 0 && r.recvFrom && <div style={{ fontSize: 9.5, color: t.textMuted }}>{r.recvFrom}</div>}</div>
                  : <div style={{ display: "grid", gap: 3, justifyItems: "end" }}>{num(r, "received")}{(r.received || 0) > 0 && <select value={r.recvFrom || "Main store"} onChange={(e) => set(r.id, "recvFrom", e.target.value)} title="Where the stock came from" style={{ height: 24, borderRadius: 6, fontSize: 10, border: `1px solid ${t.border}`, background: t.input, color: t.accent, padding: "0 4px", fontWeight: 600, maxWidth: 96 }}>{["Main store", ...camps.filter((c) => c !== allocatedCamp), "Other"].map((s) => <option key={s}>{s}</option>)}</select>}</div>}</td>
                <td style={td}>{(() => { const linked = dispensedMap[`${allocatedCamp}|${r.code}`] != null; return linked
                  ? <span title="From Daily dispensing" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: t.accent }}>{dispOf(r).toLocaleString()} <CalendarDays size={11} /></span>
                  : num(r, "dispensed"); })()}</td>
                <td style={{ ...td, textAlign: "left" }}><select value={r.moveTo} onChange={(e) => set(r.id, "moveTo", e.target.value)} style={{ height: 30, borderRadius: 7, fontSize: 12, border: `1px solid ${t.border}`, background: t.input, color: r.moveTo === "—" ? t.textMuted : t.accent, padding: "0 6px", fontWeight: 600, maxWidth: 150 }}>{moveOpts.map((m) => <option key={m}>{m}</option>)}</select></td>
                <td style={td}>{num(r, "moved")}</td>
                <td style={td}><span style={{ fontWeight: 800, fontSize: 14, color: over ? t.danger : R <= r.begin * 0.15 ? t.warning : t.success }}>{R.toLocaleString()}</span>{over && <div style={{ fontSize: 10, color: t.danger, fontWeight: 700 }}>over-issued</div>}</td>
                <td style={{ ...td, textAlign: "left", position: "relative" }}><Remarks r={r} /></td>
                <td style={{ ...td, textAlign: "center" }}><AuthorDot name={r.by} time={r.at} /></td></tr>); })}</tbody>
          </table>
        )}
      </div>
    </div>
    {add && <AddRow onClose={() => setAdd(false)} onSave={(row) => { setRows((p) => [...p, { ...row, id: Date.now(), date: today(), dispensed: 0, received: 0, moveTo: "—", moved: 0, flags: [], by: userName, at: nowT() }]); setAdd(false); }} />}
    {report && <MonthReport rows={rows} allocatedCamp={allocatedCamp} onClose={() => setReport(false)} />}
    {counting && <MonthEndCount rows={rows} dispOf={dispOf} rem={rem} allocatedCamp={allocatedCamp} userName={userName} onClose={() => setCounting(false)} onConfirm={(counts) => { snapshotMonth(); carryForward(counts); setCounting(false); }} />}
  </Page>);
}
function MonthEndCount({ rows, dispOf, rem, allocatedCamp, userName, onClose, onConfirm }) {
  const t = useT(); const [counts, setCounts] = useState({}); const [step, setStep] = useState("enter");
  const theo = (r) => rem(r); // theoretical (book) balance
  const countedVal = (r) => counts[r.id] === undefined || counts[r.id] === "" ? null : Number(counts[r.id]);
  const variance = (r) => { const c = countedVal(r); return c == null ? null : c - theo(r); };
  const anyCounted = rows.some((r) => countedVal(r) != null);
  const th = { padding: "8px 9px", fontSize: 11, fontWeight: 600, color: t.textMuted, textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "7px 9px", fontSize: 12.5, textAlign: "right", borderBottom: `1px solid ${t.border}` };
  return (<Modal title="Month-end physical count" icon={ClipboardCheck} onClose={onClose} width={760}>
    {step === "enter" ? (<>
      <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14, lineHeight: 1.5 }}>Closing <b>{prevMonthLabel()}</b> for {allocatedCamp}. Enter the <b>actual quantity counted on the shelf</b> for each item. The app compares it to the theoretical (book) balance and records any variance. On confirm, this month is archived to History, the counted figure becomes <b>{thisMonthLabel()}'s beginning balance</b>, and dispensed/moved reset.</div>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}><div style={{ overflowX: "auto", maxHeight: 360 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead><tr style={{ background: t.surfaceAlt }}><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={th}>Begin</th><th style={th}>Received</th><th style={th}>Dispensed</th><th style={th}>Moved</th><th style={th}>Theoretical</th><th style={th}>Counted</th><th style={th}>Variance</th></tr></thead>
          <tbody>{rows.map((r) => { const v = variance(r); return (<tr key={r.id}>
            <td style={{ ...td, textAlign: "left" }}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: "monospace" }}>{r.code} · {r.batch}</div></td>
            <td style={td}>{r.begin.toLocaleString()}</td><td style={td}>{(r.received || 0).toLocaleString()}</td><td style={td}>{dispOf(r).toLocaleString()}</td><td style={td}>{r.moved.toLocaleString()}</td>
            <td style={{ ...td, fontWeight: 700 }}>{theo(r).toLocaleString()}</td>
            <td style={td}><input type="number" min={0} value={counts[r.id] ?? ""} onChange={(e) => setCounts((p) => ({ ...p, [r.id]: e.target.value }))} placeholder="—" style={{ width: 64, height: 30, textAlign: "right", borderRadius: 7, fontSize: 12.5, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 6px", outline: "none", fontFamily: "inherit" }} /></td>
            <td style={{ ...td, fontWeight: 700, color: v == null ? t.textMuted : v === 0 ? t.success : v < 0 ? t.danger : t.warning }}>{v == null ? "—" : v > 0 ? `+${v}` : v}</td>
          </tr>); })}</tbody>
        </table>
      </div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: t.textMuted, marginTop: 10 }}><Info size={13} /> Leave a count blank to carry the theoretical balance forward unchanged. Negative variance = shelf has less than the books (loss/usage not logged); positive = more than expected.</div>
      <button onClick={() => setStep("confirm")} disabled={!anyCounted} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", marginTop: 16, opacity: anyCounted ? 1 : 0.5 }}><ChevronRight size={16} /> Review &amp; close month</button>
    </>) : (<>
      <div style={{ fontSize: 13, color: t.text, marginBottom: 14, lineHeight: 1.5 }}>Confirm the month-end close for <b>{allocatedCamp}</b>. The counted shelf balance becomes next month's beginning balance:</div>
      <div style={{ display: "grid", gap: 8, marginBottom: 16, maxHeight: 300, overflowY: "auto" }}>{rows.map((r) => { const c = countedVal(r); const next = c == null ? theo(r) : c; const v = variance(r);
        return (<div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, background: t.surfaceAlt }}>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: t.textMuted }}>{c == null ? "no count — carrying theoretical" : `counted ${c.toLocaleString()}`}{v != null && v !== 0 && <span style={{ color: v < 0 ? t.danger : t.warning, fontWeight: 700 }}> · variance {v > 0 ? "+" : ""}{v}</span>}</div></div>
          <div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 10.5, color: t.textMuted }}>next begin</div><div style={{ fontSize: 15, fontWeight: 800, color: t.primary }}>{next.toLocaleString()}</div></div>
        </div>); })}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep("enter")} style={{ ...btn(t, "ghost"), flex: "0 0 auto", height: 46 }}>← Back</button>
        <button onClick={() => onConfirm(counts)} style={{ ...btn(t), flex: 1, height: 46, justifyContent: "center" }}><Check size={16} /> Close month &amp; carry forward</button>
      </div>
    </>)}
  </Modal>);
}
function AddRow({ onClose, onSave }) {  const t = useT(); const [f, setF] = useState({ code: "", name: "", batch: "", expiry: "", begin: "" }); const v = f.code && f.name && f.begin !== "";
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="Add medication" icon={Plus} onClose={onClose}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}><div><label style={lab}>Code</label><input value={f.code} autoFocus onChange={(e) => setF({ ...f, code: e.target.value })} style={fld} placeholder="1234" /></div><div><label style={lab}>Name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} style={fld} placeholder="Augmentin 1000mg" /></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12, marginBottom: 18 }}><div><label style={lab}>Batch</label><input value={f.batch} onChange={(e) => setF({ ...f, batch: e.target.value })} style={fld} /></div><div><label style={lab}>Expiry</label><input type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} style={fld} /></div><div><label style={lab}>Begin bal.</label><input type="number" value={f.begin} onChange={(e) => setF({ ...f, begin: e.target.value })} style={fld} /></div></div>
    <button onClick={() => onSave({ ...f, begin: Number(f.begin) })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Plus size={16} /> Add</button>
  </Modal>);
}
function MonthReport({ rows, allocatedCamp, onClose }) {
  const t = useT(); const [sent, setSent] = useState(false); const { dispensedMap } = useApp();
  const dispOf = (r) => { const v = dispensedMap[`${allocatedCamp}|${r.code}`]; return v == null ? r.dispensed : v; };
  const sums = useMemo(() => { const o = { Dispensed: 0 }; MOVE_TYPES.forEach((m) => o[m] = 0); rows.forEach((r) => { o.Dispensed += dispOf(r); if (MOVE_TYPES.includes(r.moveTo)) o[r.moveTo] += r.moved; }); return o; }, [rows, dispensedMap]);
  const [cats, setCats] = useState(() => Object.entries(sums).map(([k, v]) => ({ k, v }))); const [extra, setExtra] = useState("");
  const td = { padding: "8px 12px", fontSize: 13, borderBottom: `1px solid ${t.border}` };
  if (sent) return (<Modal title="Report sent" icon={CheckCircle2} onClose={onClose} width={400}><div style={{ textAlign: "center" }}><CheckCircle2 size={44} color={t.success} style={{ margin: "0 auto 10px" }} /><p style={{ fontSize: 13, color: t.textMuted, margin: "0 0 18px" }}>Month-end report sent as a table to the configured email / WhatsApp recipients.</p><button onClick={onClose} style={{ ...btn(t), width: "100%", height: 42, justifyContent: "center" }}>Done</button></div></Modal>);
  return (<Modal title="Month-end report" icon={FileText} onClose={onClose} width={520}>
    <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 14 }}>{allocatedCamp} · {prevMonthLabel()} <span style={{ color: t.textMuted }}>(month being closed)</span></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}><Metric label="Working days" value={22} tone="primary" /><Metric label="Total prescriptions" value={(4120).toLocaleString()} tone="accent" /><Metric label="Of which chronic" value={(880).toLocaleString()} tone="warning" /></div>
    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Category totals (adjustable)</div>
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}><thead><tr style={{ background: t.surfaceAlt }}><th style={{ ...td, textAlign: "left", fontSize: 11.5, color: t.textMuted }}>Category</th><th style={{ ...td, textAlign: "right", fontSize: 11.5, color: t.textMuted }}>Units</th><th style={{ ...td, width: 40 }}></th></tr></thead>
      <tbody>{cats.map((c, i) => (<tr key={i}><td style={{ ...td, textAlign: "left" }}>{c.k}</td><td style={{ ...td, textAlign: "right" }}><input type="number" value={c.v} onChange={(e) => setCats((p) => p.map((x, j) => j === i ? { ...x, v: Number(e.target.value) || 0 } : x))} style={{ width: 80, height: 28, textAlign: "right", borderRadius: 6, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 6px" }} /></td><td style={{ ...td, textAlign: "center" }}><button onClick={() => setCats((p) => p.filter((_, j) => j !== i))} aria-label="Remove" style={{ border: "none", background: "transparent", cursor: "pointer", color: t.danger }}><Trash2 size={13} /></button></td></tr>))}</tbody>
    </table>
    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}><input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Add a category…" style={{ flex: 1, height: 38, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13, padding: "0 12px", outline: "none" }} /><button onClick={() => { if (extra.trim()) { setCats((p) => [...p, { k: extra.trim(), v: 0 }]); setExtra(""); } }} style={btn(t, "ghost")}><Plus size={14} /> Add</button></div>
    <button onClick={() => setSent(true)} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center" }}><Send size={16} /> Send report as table</button>
  </Modal>);
}

/* ================= DAILY DISPENSING (grid: dates × medications) ================= */
const WEEKEND = [5, 6], DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const nextMonthISO = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10); };
const nextYearISO = () => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().slice(0, 10); };
const DISP_MEDS_SEED = [
  { id: "m1", code: "1230", name: "Paracetamol 500mg", batches: [{ batch: "PAR-2025-A", qty: 500, expiry: nextMonthISO() }, { batch: "PAR-2026-B", qty: 500, expiry: nextYearISO() }] },
  { id: "m2", code: "1235", name: "Augmentin 1000mg", batches: [{ batch: "AUG2026-X", qty: 200, expiry: "2026-08-04" }] },
  { id: "m3", code: "1450", name: "Ceftriaxone 1g", batches: [{ batch: "CEF-2291", qty: 120, expiry: "2026-07-04" }] },
];
function Dispensing({ canEdit, privileged, allocatedCamp, viewer }) {
  const canEditEff = canEdit && !viewer;
  const t = useT(); const { camps, setDispensed, beginMap, me } = useApp(); const now = new Date(), year = now.getFullYear(), month = now.getMonth();
  const [camp, setCamp] = useState(privileged ? "All camps" : allocatedCamp);
  const total = new Date(year, month + 1, 0).getDate();
  const [rows, setRows] = useState(() => DISP_MEDS_SEED.map((m) => ({ kind: "med", ...m })));
  const [addMed, setAddMed] = useState(false);
  const [period, setPeriod] = useState("Monthly"); // Daily / Monthly / Yearly (privileged review framing)
  const [itemFilter, setItemFilter] = useState("All items"); // All items or a specific medication
  const [showPerItem, setShowPerItem] = useState(false);
  const [selDay, setSelDay] = useState(null); // chosen day-of-month, or null = whole month
  const [selWeek, setSelWeek] = useState(null); // chosen week (1-based), or null
  const days = useMemo(() => { const a = []; for (let d = 1; d <= total; d++) { const dow = new Date(year, month, d).getDay(); a.push({ d, dow, weekend: WEEKEND.includes(dow) }); } return a; }, [total]);
  // weekends are shown by default (muted); marking one as workday flips its colour
  const [workday, setWorkday] = useState({});
  const isWork = (x) => !x.weekend || !!workday[x.d];
  const [vals, setVals] = useState(() => { const o = {}; [...camps, "Store"].forEach((c, ci) => days.forEach((x) => { if (!WEEKEND.includes(x.dow)) DISP_MEDS_SEED.forEach((m, mi) => { o[`${c}|${x.d}|${m.id}`] = Math.round(8 + ((x.d * (ci + 1) * (mi + 2) * 3) % 60)); }); })); return o; });
  const cellKey = (c, d, m) => `${c}|${d}|${m}`;
  const getCell = (d, m) => { if (camp === "All camps") return camps.reduce((s, c) => s + (Number(vals[cellKey(c, d, m)]) || 0), 0); return Number(vals[cellKey(camp, d, m)]) || 0; };
  const setCell = (d, m, v) => setVals((p) => ({ ...p, [cellKey(camp, d, m)]: Math.max(0, Number(v) || 0) }));
  const editable = canEditEff && camp !== "All camps";
  const meds = rows.filter((r) => r.kind === "med");
  const medTotal = (mid) => days.reduce((s, x) => s + getCell(x.d, mid), 0);
  const dayTotal = (d) => meds.reduce((s, m) => s + getCell(d, m.id), 0);
  const grand = days.reduce((s, x) => s + dayTotal(x.d), 0);
  const itemsDispensedOnDay = (d) => meds.filter((m) => getCell(d, m.id) > 0).length; // distinct meds dispensed that day
  const weekCount = Math.ceil(total / 7);
  const weekDays = (w) => days.filter((x) => Math.ceil(x.d / 7) === w); // days in week w (1-based)
  const itemsDispensedInWeek = (w) => { const wd = weekDays(w); return meds.filter((m) => wd.some((x) => getCell(x.d, m.id) > 0)).length; };
  // scoped meds: respect the medication picker (All items vs one med)
  const scopedMeds = itemFilter === "All items" ? meds : meds.filter((m) => m.name === itemFilter);
  const scopeLabel = itemFilter === "All items" ? "all medications" : itemFilter;
  const qtyOnDay = (d) => scopedMeds.reduce((s, m) => s + getCell(d, m.id), 0); // total units that day for the scope
  const qtyInWeek = (w) => weekDays(w).reduce((s, x) => s + qtyOnDay(x.d), 0); // total units that week
  const qtyInMonth = () => days.reduce((s, x) => s + qtyOnDay(x.d), 0); // total units that month
  const itemsDispensedInMonth = () => meds.filter((m) => days.some((x) => getCell(x.d, m.id) > 0)).length;
  const onHand = (m) => (m.batches || []).reduce((s, b) => s + (Number(b.qty) || 0), 0);
  const addMedication = (m) => setRows((p) => [...p, { kind: "med", id: "m" + Date.now(), ...m }]);
  const addTitle = () => setRows((p) => [...p, { kind: "title", id: "tt" + Date.now(), label: "Section title" }]);
  const setRowLabel = (id, label) => setRows((p) => p.map((r) => r.id === id ? { ...r, label } : r));
  const removeRow = (id) => setRows((p) => p.filter((r) => r.id !== id));
  const dd = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);
  // push each item's month-to-date dispensed total into the shared store so the Inventory log reflects it
  useEffect(() => { if (camp === "All camps") return; meds.forEach((m) => { if (m.code && m.code !== "—") setDispensed(camp, m.code, medTotal(m.id)); }); }, [vals, rows, camp]);

  const th = { padding: "7px 8px", fontSize: 10.5, fontWeight: 600, color: "#C6D6E8", borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap", background: t.head };
  const td = { padding: "5px 7px", fontSize: 12.5, textAlign: "center", borderBottom: `1px solid ${t.border}` };
  // frozen-left columns: only Code + Medication
  const W = { code: 60, med: 156 };
  const L = { code: 0, med: W.code };
  const frozenTh = (left, w, label, align = "left") => (<th style={{ ...th, textAlign: align, position: "sticky", top: 0, left, zIndex: 5, minWidth: w, width: w }}>{label}</th>);
  const frozenTd = (left, w, bg, content, extra = {}) => (<td style={{ ...td, textAlign: "left", position: "sticky", left, zIndex: 2, background: bg, minWidth: w, width: w, ...extra }}>{content}</td>);
  const scTh = (w, label, align = "center") => (<th style={{ ...th, textAlign: align, position: "sticky", top: 0, zIndex: 4, minWidth: w, width: w }}>{label}</th>);
  let medIdx = 0;

  return (<Page title="Daily log" subtitle={`${now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · ${camp}`}
    info="Code and Medication stay frozen on the left; #, Batch, Expiry and the whole month of days scroll to the right. An item can hold several batches/expiries with their own quantity (e.g. 500 expiring next month, 500 next year). Weekends show in a muted colour; tap a weekend header to make it a workday. Each day cell is that day's dispensed quantity — the month total flows through to the Inventory log's Dispensed column for the same code."
    action={<div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {privileged && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: t.success, background: t.successSoft, padding: "8px 11px", borderRadius: 20 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: t.success }} /> Live</span>}
      {privileged ? <select value={camp} onChange={(e) => setCamp(e.target.value)} style={{ height: 40, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, padding: "0 12px", fontWeight: 600 }}><option>All camps</option>{camps.map((c) => <option key={c}>{c}</option>)}<option value="Store">Store</option></select> : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 14px", borderRadius: 10, background: t.surfaceAlt, fontSize: 13, fontWeight: 600, color: t.textMuted }}><MapPin size={14} /> {allocatedCamp}</span>}
      <select value={itemFilter} onChange={(e) => setItemFilter(e.target.value)} title="Filter by medication" style={{ height: 40, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, padding: "0 12px", fontWeight: 600, maxWidth: 200 }}><option>All items</option>{meds.map((m) => <option key={m.id}>{m.name}</option>)}</select>
      {editable && !privileged && <><button onClick={addTitle} style={btn(t, "ghost")}><Plus size={15} /> Add title row</button><button onClick={() => setAddMed(true)} style={btn(t)}><Plus size={15} /> Add item</button></>}
    </div>}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      <span style={{ fontSize: 12.5, color: t.textMuted, fontWeight: 600 }}>Show for:</span>
      <select value={selWeek != null ? `w${selWeek}` : (selDay ?? "")} onChange={(e) => { const v = e.target.value; if (v === "") { setSelDay(null); setSelWeek(null); } else if (v.startsWith("w")) { setSelWeek(Number(v.slice(1))); setSelDay(null); } else { setSelDay(Number(v)); setSelWeek(null); } }} style={{ height: 38, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13.5, padding: "0 12px", fontWeight: 600 }}>
        <option value="">Whole month</option>
        <optgroup label="By week">{Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => { const wd = weekDays(w); const first = wd[0]?.d, last = wd[wd.length - 1]?.d; return <option key={`w${w}`} value={`w${w}`}>Week {w} · {first}–{last} {now.toLocaleDateString("en-GB", { month: "short" })}</option>; })}</optgroup>
        <optgroup label="By day">{days.map((x) => <option key={x.d} value={x.d}>{x.d} {now.toLocaleDateString("en-GB", { month: "short" })} · {DAY_NAMES[x.dow]}</option>)}</optgroup>
      </select>
      {(selDay != null || selWeek != null) && <button onClick={() => { setSelDay(null); setSelWeek(null); }} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12 }}>Clear</button>}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
      {selWeek != null ? (<>
        <Metric label={`Total dispensed · Week ${selWeek}`} value={qtyInWeek(selWeek).toLocaleString()} tone="primary" info={`Total units dispensed in week ${selWeek} for ${scopeLabel}.`} />
        <Metric label={`Medications dispensed · Week ${selWeek}`} value={itemsDispensedInWeek(selWeek)} tone="accent" info="How many different medications had any dispensing during the selected week." />
      </>) : selDay != null ? (<>
        <Metric label={`Total dispensed · ${selDay} ${now.toLocaleDateString("en-GB", { month: "short" })}`} value={qtyOnDay(selDay).toLocaleString()} tone="primary" info={`Total units dispensed on the selected day for ${scopeLabel}.`} />
        <Metric label={`Medications dispensed · ${selDay} ${now.toLocaleDateString("en-GB", { month: "short" })}`} value={itemsDispensedOnDay(selDay)} tone="accent" info="How many different medications had any dispensing on the selected day (e.g. Panadol, Augmentin, Metformin = 3)." />
      </>) : (<>
        <button onClick={() => setShowPerItem((v) => !v)} style={{ all: "unset", cursor: "pointer", display: "block" }} title="Show per item">
          <div style={{ ...card(t), padding: "12px 14px", borderColor: showPerItem ? t.primary : t.border }}>
            <div style={{ fontSize: 11.5, color: t.textMuted, display: "flex", alignItems: "center", gap: 5 }}>Total dispensed · {period === "Yearly" ? "year" : period === "Daily" || period === "Weekly" ? "month" : "month"} <ChevronRight size={13} style={{ transform: showPerItem ? "rotate(90deg)" : "none", transition: "transform .15s" }} /></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: t.primary, marginTop: 3 }}>{qtyInMonth().toLocaleString()}</div>
            <div style={{ fontSize: 10.5, color: t.textMuted, marginTop: 2 }}>{scopeLabel} · tap for per item</div>
          </div>
        </button>
        <Metric label="Medications dispensed" value={itemsDispensedInMonth()} tone="accent" info="How many different medications had any dispensing this month." />
      </>)}
      <Metric label="Items" value={meds.length} tone="success" info="Number of medications/items in this pharmacy." />
      <Metric label={period === "Yearly" ? "Period" : period === "Weekly" ? "Weeks" : "Days in month"} value={period === "Yearly" ? "Year" : period === "Weekly" ? weekCount : total} tone="warning" />
    </div>
    {(selDay != null || selWeek != null) && <div style={{ fontSize: 11.5, color: t.textMuted, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Showing {selWeek != null ? `week ${selWeek}` : `${selDay} ${now.toLocaleDateString("en-GB", { month: "short" })}`} for {scopeLabel}. Use the medication filter above to switch between one medication and all.</div>}
    {showPerItem && selDay == null && selWeek == null && (<div style={{ ...card(t), marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><p style={ttl(t)}><CalendarDays size={16} color={t.accent} /> Total dispensed — per item</p><span style={{ fontSize: 12, color: t.textMuted }}>{camp} · this month</span></div>
      {meds.length === 0 ? <div style={{ fontSize: 13, color: t.textMuted }}>No items yet.</div> : <div style={{ display: "grid", gap: 8 }}>{[...meds].map((m) => ({ m, tot: medTotal(m.id) })).sort((a, b) => b.tot - a.tot).map(({ m, tot }) => { const pct = grand ? Math.round((tot / grand) * 100) : 0;
        return (<div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 150, minWidth: 150, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
          <div style={{ flex: 1, height: 16, borderRadius: 8, background: t.surfaceAlt, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: t.accent, borderRadius: 8 }} /></div>
          <div style={{ width: 96, textAlign: "right", fontSize: 13 }}><b>{tot.toLocaleString()}</b> <span style={{ color: t.textMuted, fontSize: 11 }}>{pct}%</span></div>
        </div>); })}</div>}
    </div>)}
    {camp === "All camps" && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: t.textMuted, marginBottom: 12 }}><Info size={14} /> Pick a camp to edit cells and add items. "All camps" shows the combined totals.</div>}
    {privileged && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12, padding: "9px 13px", borderRadius: 10, background: t.primarySoft }}>
      <span style={{ fontSize: 12.5, color: t.text, display: "inline-flex", alignItems: "center", gap: 7 }}><Radar size={14} color={t.primary} /> Live review · <b>{period}</b> · <b>{itemFilter}</b> · <b>{camp}</b> — updates as staff enter quantities at the camps.</span>
      <button onClick={() => { const cols = days.map((x) => x.d).join("</th><th>"); const body = meds.filter((m) => itemFilter === "All items" || m.name === itemFilter).map((m) => `<tr><td>${escapeHTML(m.code)}</td><td>${escapeHTML(m.name)}</td>${days.map((x) => `<td>${getCell(x.d, m.id)}</td>`).join("")}<td><b>${medTotal(m.id)}</b></td></tr>`).join(""); exportPDF(`Daily log — ${camp}`, `<table><thead><tr><th>Code</th><th>Medication</th><th>${cols}</th><th>Total</th></tr></thead><tbody>${body}</tbody></table>`, { camp, person: me?.name, mil: me?.mil, role: me?.role, extra: `${period} · ${itemFilter} · ${now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}` }); }} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}><FileText size={13} /> Export PDF</button>
    </div>}
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11.5, color: t.textMuted, marginBottom: 8 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: t.warningSoft, border: `1px solid ${t.warning}55` }} /> Weekend</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: t.surface, border: `1px solid ${t.border}` }} /> Workday</span>
      {editable && <span>· tap a weekend day's header to make it a workday</span>}
    </div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflow: "auto", maxHeight: 580 }}>
      <table style={{ borderCollapse: "collapse" }}>
        <thead><tr>
          {frozenTh(L.code, W.code, "Code")}
          {frozenTh(L.med, W.med, "Medication")}
          {scTh(34, "#")}
          {scTh(96, "Batch")}
          {scTh(120, "Expiry")}
          {scTh(64, "Available")}
          {days.map((x) => { const work = isWork(x); return (<th key={x.d} onClick={() => editable && x.weekend && setWorkday((p) => ({ ...p, [x.d]: !p[x.d] }))} title={x.weekend && editable ? "Tap to toggle workday" : ""} style={{ ...th, textAlign: "center", position: "sticky", top: 0, zIndex: 4, minWidth: 38, cursor: editable && x.weekend ? "pointer" : "default", background: x.weekend && !work ? "#3A3320" : t.head }}>
            <div style={{ fontSize: 12, color: "#fff" }}>{x.d}</div><div style={{ fontSize: 8.5, fontWeight: 400, color: x.weekend && !work ? "#E0A446" : "#9FB6CE" }}>{DAY_NAMES[x.dow]}</div>
          </th>); })}
          <th style={{ ...th, textAlign: "center", position: "sticky", top: 0, right: 0, zIndex: 5, color: "#fff", minWidth: 64 }}>Month</th>
        </tr></thead>
        <tbody>{rows.filter((r) => itemFilter === "All items" || (r.kind === "med" && r.name === itemFilter)).map((r, ri) => { const bg = ri % 2 ? t.zebra : t.surface;
          if (r.kind === "title") return (<tr key={r.id}>
            {frozenTd(L.code, W.code, t.primarySoft, <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Pin size={11} color={t.primary} /></span>, { textAlign: "center" })}
            <td colSpan={4 + days.length + 1} style={{ ...td, textAlign: "left", position: "sticky", left: L.med, zIndex: 1, background: t.primarySoft }}>{editable
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><input value={r.label} onChange={(e) => setRowLabel(r.id, e.target.value)} style={{ height: 24, borderRadius: 6, border: `1px solid ${t.border}`, background: t.input, color: t.primary, fontWeight: 700, fontSize: 12, padding: "0 8px", outline: "none", fontFamily: "inherit", width: 220 }} /><button onClick={() => removeRow(r.id)} aria-label="Remove" style={{ ...miniBtn(t), width: 20, height: 20, color: t.danger }}><Trash2 size={10} /></button></span>
              : <span style={{ fontWeight: 700, color: t.primary, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.4 }}>{r.label}</span>}</td>
          </tr>);
          medIdx++; const num = medIdx; const batches = r.batches || [];
          return (<tr key={r.id}>
            {frozenTd(L.code, W.code, bg, <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{r.code}</span>)}
            {frozenTd(L.med, W.med, bg, <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>{editable && <button onClick={() => removeRow(r.id)} aria-label="Remove" style={{ ...miniBtn(t), width: 18, height: 18, marginLeft: "auto", color: t.danger, flexShrink: 0 }}><Trash2 size={9} /></button>}</span>)}
            <td style={{ ...td, fontWeight: 700, color: t.textMuted, minWidth: 34 }}>{num}</td>
            <td style={{ ...td, textAlign: "left", minWidth: 96 }}><div style={{ display: "grid", gap: 2 }}>{batches.map((b, bi) => <div key={bi} style={{ fontFamily: "monospace", fontSize: 11 }}>{b.batch}</div>)}</div></td>
            <td style={{ ...td, textAlign: "left", minWidth: 120 }}><div style={{ display: "grid", gap: 2 }}>{batches.map((b, bi) => { const ex = dd(b.expiry); return (<div key={bi} style={{ fontSize: 10.5, display: "flex", justifyContent: "space-between", gap: 6, color: ex <= 60 ? t.danger : ex <= 120 ? t.warning : t.textMuted }}><span style={{ fontWeight: 700 }}>{b.qty}</span><span>{new Date(b.expiry).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}{ex <= 120 ? ` · ${ex}d` : ""}</span></div>); })}{batches.length === 0 && <span style={{ color: t.textMuted }}>—</span>}</div></td>
            <td style={{ ...td, minWidth: 64 }}>{(() => { const b = beginMap[`${camp}|${r.code}`]; return b == null ? <span style={{ color: t.textMuted }} title="Set in the Inventory log for this code">—</span> : <span style={{ fontWeight: 700, color: t.text }} title="Total available — opening balance plus any stock received (from the Inventory log)">{b.toLocaleString()}</span>; })()}</td>
            {days.map((x) => { const work = isWork(x); return (<td key={x.d} style={{ ...td, background: x.weekend && !work ? t.warningSoft : undefined }}>{editable
              ? <input type="number" min={0} value={getCell(x.d, r.id)} onChange={(e) => setCell(x.d, r.id, e.target.value)} style={{ width: 40, height: 26, textAlign: "center", borderRadius: 6, fontSize: 12, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 2px", outline: "none", fontFamily: "inherit" }} />
              : <span>{getCell(x.d, r.id).toLocaleString()}</span>}</td>); })}
            <td style={{ ...td, position: "sticky", right: 0, background: bg, fontWeight: 800, color: t.primary }}>{medTotal(r.id).toLocaleString()}</td>
          </tr>); })}</tbody>
      </table>
    </div></div>
    {addMed && <AddDispMed onClose={() => setAddMed(false)} onSave={(m) => { addMedication(m); setAddMed(false); }} />}
  </Page>);
}
function AddDispMed({ onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ code: "", name: "" });
  const [batches, setBatches] = useState([{ batch: "", qty: "", expiry: "" }]);
  const v = f.name.trim();
  const fld = { width: "100%", height: 40, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13.5, padding: "0 11px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const setB = (i, k, val) => setBatches((p) => p.map((b, j) => j === i ? { ...b, [k]: val } : b));
  return (<Modal title="Add medication / item" icon={Plus} onClose={onClose} width={540}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}><div><label style={lab}>Code</label><input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} style={fld} placeholder="1234" /></div><div><label style={lab}>Medication / item</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={fld} placeholder="Paracetamol 500mg" /></div></div>
    <label style={lab}>Batches & expiries (add one line per expiry)</label>
    <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>{batches.map((b, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.4fr auto", gap: 8, alignItems: "center" }}>
      <input value={b.batch} onChange={(e) => setB(i, "batch", e.target.value)} style={fld} placeholder="Batch no." />
      <input type="number" value={b.qty} onChange={(e) => setB(i, "qty", e.target.value)} style={fld} placeholder="Qty" />
      <input type="date" value={b.expiry} onChange={(e) => setB(i, "expiry", e.target.value)} style={fld} />
      <button onClick={() => setBatches((p) => p.length > 1 ? p.filter((_, j) => j !== i) : p)} aria-label="Remove batch" style={{ ...miniBtn(t), color: t.danger }}><X size={13} /></button>
    </div>))}</div>
    <button onClick={() => setBatches((p) => [...p, { batch: "", qty: "", expiry: "" }])} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12, marginBottom: 18 }}><Plus size={13} /> Add another expiry</button>
    <button onClick={() => onSave({ code: f.code || "—", name: f.name, batches: batches.filter((b) => b.batch || b.qty || b.expiry).map((b) => ({ batch: b.batch || "—", qty: Number(b.qty) || 0, expiry: b.expiry || "2027-12-31" })) })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Plus size={16} /> Add item row</button>
  </Modal>);
}


/* ================= COLD CHAIN (single fridge — stock record) ================= */
const COLD_SEED = [
  { id: 1, name: "Insulin Glargine", qty: 22, unit: "pens", expiry: "2026-07-28", store: "2–8°C", remarks: "Do not freeze. In-use pen up to 28 days." },
  { id: 2, name: "Insulin Aspart", qty: 14, unit: "pens", expiry: "2026-09-15", store: "2–8°C", remarks: "Protect from light." },
  { id: 3, name: "Influenza vaccine", qty: 40, unit: "doses", expiry: "2026-10-30", store: "2–8°C", remarks: "Discard if frozen." },
  { id: 4, name: "Hepatitis B vaccine", qty: 25, unit: "doses", expiry: "2027-02-10", store: "2–8°C", remarks: "Shake well before use." },
];
const STORE_TEMP_OPTS = ["2–8°C (refrigerate)", "Below 25°C", "Below 30°C", "-20°C (freezer)", "15–25°C (room)"];
function ColdChain({ canEdit, allocatedCamp }) {
  const t = useT(); const [rows, setRows] = useState(COLD_SEED); const [q, setQ] = useState(""); const [modal, setModal] = useState(null);
  const dd = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);
  const filtered = rows.filter((r) => q === "" || r.name.toLowerCase().includes(q.toLowerCase()));
  const save = (r) => { if (r.id) setRows((p) => p.map((x) => x.id === r.id ? r : x)); else setRows((p) => [{ ...r, id: Date.now() }, ...p]); setModal(null); };
  const remove = (id) => setRows((p) => p.filter((x) => x.id !== id));
  const nearExp = rows.filter((r) => dd(r.expiry) <= 90).length;
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, textAlign: "left", borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  return (<Page title="Cold chain" subtitle={`${allocatedCamp} · one fridge — stock record (2–8°C)`}
    info="A simple record of what's in the fridge: medication, quantity, expiry, the suggested storage temperature for each item, and remarks. No temperature charting — just the stock and its cold-storage requirements. Near-expiry items (within 90 days) are flagged."
    action={<><ExportButton title="Cold chain — fridge stock" build={() => ({ bodyHTML: `<table><thead><tr><th>Medication</th><th>Qty</th><th>Expiry</th><th>Suggested storage</th><th>Remarks</th></tr></thead><tbody>${filtered.map((r) => `<tr><td>${escapeHTML(r.name)}</td><td>${r.qty} ${escapeHTML(r.unit || "")}</td><td>${escapeHTML(r.expiry)}</td><td>${escapeHTML(r.store)}</td><td>${escapeHTML(r.remarks || "")}</td></tr>`).join("")}</tbody></table>`, text: `${filtered.length} item(s) in the fridge.` })} />{canEdit && <button onClick={() => setModal({ name: "", qty: "", unit: "pens", expiry: "", store: "2–8°C (refrigerate)", remarks: "" })} style={btn(t)}><Plus size={15} /> Add item</button>}</>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
      <Metric label="Items in fridge" value={rows.length} tone="cold" />
      <Metric label="Total units" value={rows.reduce((s, r) => s + (Number(r.qty) || 0), 0).toLocaleString()} tone="primary" />
      <Metric label="Near expiry (≤90d)" value={nearExp} tone={nearExp ? "warning" : "success"} info="Items expiring within 90 days." />
    </div>
    <div style={{ position: "relative", marginBottom: 14, maxWidth: 360 }}><Search size={16} color={t.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medication…" style={{ width: "100%", height: 42, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14, padding: "0 14px 0 40px", outline: "none", boxSizing: "border-box" }} /></div>
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
        <thead><tr style={{ background: t.head }}><th style={th}>Medication</th><th style={{ ...th, textAlign: "right" }}>Quantity</th><th style={th}>Expiry</th><th style={th}>Suggested storage</th><th style={th}>Remarks</th>{canEdit && <th style={{ ...th, textAlign: "right" }}></th>}</tr></thead>
        <tbody>{filtered.map((r, i) => { const d = dd(r.expiry); const exC = d <= 30 ? t.danger : d <= 90 ? t.warning : t.textMuted;
          return (<tr key={r.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
            <td style={{ ...td, fontWeight: 600 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Snowflake size={14} color={t.cold} /> {r.name}</span></td>
            <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{Number(r.qty).toLocaleString()} <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400 }}>{r.unit}</span></td>
            <td style={td}><div>{new Date(r.expiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div><div style={{ fontSize: 11, fontWeight: 700, color: exC }}>{d <= 0 ? "expired" : d <= 90 ? `${d}d left` : ""}</div></td>
            <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: t.cold, background: t.coldSoft, padding: "3px 10px", borderRadius: 20 }}><Thermometer size={12} /> {r.store}</span></td>
            <td style={{ ...td, color: t.textMuted, fontSize: 12, maxWidth: 220, whiteSpace: "normal" }}>{r.remarks}</td>
            {canEdit && <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}><button onClick={() => setModal(r)} aria-label="Edit" style={{ ...miniBtn(t), color: t.primary }}><Pencil size={12} /></button> <button onClick={() => remove(r.id)} aria-label="Remove" style={{ ...miniBtn(t), color: t.danger }}><Trash2 size={12} /></button></td>}
          </tr>); })}{filtered.length === 0 && <tr><td colSpan={canEdit ? 6 : 5} style={{ ...td, textAlign: "center", color: t.textMuted, padding: 26 }}>No items in the fridge yet.</td></tr>}</tbody>
      </table>
    </div></div>
    {modal && <ColdModal initial={modal} onClose={() => setModal(null)} onSave={save} />}
  </Page>);
}
function ColdModal({ initial, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ ...initial });
  const v = f.name.trim() && f.qty !== "" && f.expiry;
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={f.id ? "Edit fridge item" : "Add fridge item"} icon={Snowflake} onClose={onClose} width={500}>
    <label style={lab}>Medication</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={{ ...fld, marginBottom: 14 }} placeholder="e.g. Insulin Glargine" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Quantity</label><input type="number" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={fld} placeholder="0" /></div>
      <div><label style={lab}>Unit</label><input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} style={fld} placeholder="pens / doses" /></div>
      <div><label style={lab}>Expiry</label><input type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} style={fld} /></div>
    </div>
    <label style={lab}>Suggested storage temperature</label><select value={f.store} onChange={(e) => setF({ ...f, store: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{STORE_TEMP_OPTS.map((o) => <option key={o}>{o}</option>)}</select>
    <label style={lab}>Remarks</label><input value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} style={{ ...fld, marginBottom: 18 }} placeholder="e.g. Do not freeze; protect from light" />
    <button onClick={() => onSave({ ...f, qty: Number(f.qty) || 0 })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> {f.id ? "Save changes" : "Add item"}</button>
  </Modal>);
}

/* ================= CLINICAL ================= */
const QNF = {
  "augmentin 1000mg": { name: "Amoxicillin/Clavulanate 1000mg", cls: "Beta-lactam antibiotic", code: "1235", dose: "1 tab every 12h", note: "Take with food. Renal dose adjustment.", indications: "Respiratory, ENT, urinary and skin infections caused by susceptible organisms.", contra: "History of penicillin hypersensitivity or cholestatic jaundice with amoxicillin/clavulanate.", storage: "Store below 25°C, protect from moisture.", pregnancy: "Category B — generally considered safe." },
  "paracetamol 500mg": { name: "Paracetamol 500mg", cls: "Analgesic / antipyretic", code: "1230", dose: "1–2 tabs every 4–6h, max 4g/day", note: "Caution in hepatic impairment.", indications: "Mild to moderate pain and fever.", contra: "Severe hepatic impairment; known hypersensitivity.", storage: "Store below 30°C.", pregnancy: "Considered safe at recommended doses." },
  "warfarin": { name: "Warfarin 5mg", cls: "Anticoagulant (vitamin K antagonist)", code: "1810", dose: "Individualised to target INR", note: "Many interactions — review concurrent meds.", indications: "Prophylaxis/treatment of thromboembolism, AF, mechanical valves.", contra: "Active bleeding, severe hypertension, pregnancy.", storage: "Store below 25°C, protect from light.", pregnancy: "Contraindicated — teratogenic." },
  "metformin 850mg": { name: "Metformin 850mg", cls: "Biguanide antidiabetic", code: "1310", dose: "1 tab 2–3×/day with meals", note: "Hold before contrast imaging.", indications: "Type 2 diabetes mellitus, first-line.", contra: "eGFR <30, acute metabolic acidosis.", storage: "Store below 30°C.", pregnancy: "Used in pregnancy where indicated — specialist guidance." },
  "ceftriaxone 1g": { name: "Ceftriaxone 1g", cls: "3rd-gen cephalosporin", code: "1450", dose: "1–2g once daily IV/IM", note: "Avoid with IV calcium in neonates.", indications: "Serious systemic infections, meningitis, sepsis.", contra: "Cephalosporin hypersensitivity; neonates with hyperbilirubinaemia.", storage: "Store powder below 25°C; reconstituted per label.", pregnancy: "Category B." },
  "amoxicillin 500mg": { name: "Amoxicillin 500mg", cls: "Beta-lactam antibiotic", code: "1102", dose: "250–500mg every 8h", note: "Adjust in renal impairment.", indications: "Common bacterial infections.", contra: "Penicillin hypersensitivity.", storage: "Store below 25°C.", pregnancy: "Category B." },
  "insulin glargine": { name: "Insulin Glargine", cls: "Long-acting insulin analogue", code: "1700", dose: "Once daily SC, individualised", note: "Cold chain — store 2–8°C.", indications: "Diabetes mellitus requiring basal insulin.", contra: "Hypoglycaemia; hypersensitivity.", storage: "Refrigerate 2–8°C; in-use pen up to 28 days below 30°C.", pregnancy: "Used in pregnancy under specialist care." },
};
const QNF_REF = "https://www.moph.gov.qa";
const INTERACTIONS = [
  { a: "warfarin", b: "augmentin 1000mg", sev: "major", text: "Antibiotics can potentiate warfarin — monitor INR." },
  { a: "warfarin", b: "paracetamol 500mg", sev: "moderate", text: "Prolonged paracetamol may raise INR." },
  { a: "warfarin", b: "ceftriaxone 1g", sev: "moderate", text: "Cephalosporins may enhance anticoagulant effect — monitor INR." },
];
function Clinical({ role }) {
  const t = useT(); const [q, setQ] = useState(""); const [picked, setPicked] = useState([]); const [details, setDetails] = useState(null);
  const [lookupHist, setLookupHist] = useState([]); const [checkHist, setCheckHist] = useState([]);
  const [qnf, setQnf] = useState(QNF); const [formulary, setFormulary] = useState({ name: "Qatar National Formulary (sample set)", version: "demo", count: Object.keys(QNF).length }); const [updateOpen, setUpdateOpen] = useState(false);
  const matches = useMemo(() => { const s = q.trim().toLowerCase(); if (!s) return []; return Object.entries(qnf).filter(([k, v]) => k.includes(s) || v.name.toLowerCase().includes(s) || v.code.includes(s)); }, [q, qnf]);
  const addDrug = (key) => { if (!picked.includes(key)) setPicked([...picked, key]); };
  const recordLookup = (key) => setLookupHist((p) => [key, ...p.filter((x) => x !== key)].slice(0, 8));
  const pairs = useMemo(() => { const o = []; for (let i = 0; i < picked.length; i++) for (let j = i + 1; j < picked.length; j++) { const hit = INTERACTIONS.find((x) => (x.a === picked[i] && x.b === picked[j]) || (x.a === picked[j] && x.b === picked[i])); o.push({ pair: [picked[i], picked[j]], hit }); } return o; }, [picked]);
  const saveCheck = () => { if (picked.length < 2) return; const worst = pairs.reduce((w, r) => { const rank = { major: 3, moderate: 2, minor: 1 }; const s = r.hit ? r.hit.sev : "none"; return (rank[s] || 0) > (rank[w] || 0) ? s : w; }, "none"); setCheckHist((p) => [{ id: Date.now(), drugs: picked.map((k) => qnf[k]?.name || k), worst, when: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }, ...p].slice(0, 8)); };
  const sev = (s) => s === "major" ? { fg: t.danger, bg: t.dangerSoft } : s === "moderate" ? { fg: t.warning, bg: t.warningSoft } : s === "minor" ? { fg: t.warning, bg: t.warningSoft } : { fg: t.success, bg: t.successSoft };
  const fld = { width: "100%", height: 44, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14.5, padding: "0 14px", outline: "none", boxSizing: "border-box" };
  const loadFormulary = (drugs, meta) => { const map = {}; drugs.forEach((d) => { map[d.name.toLowerCase()] = { name: d.name, cls: d.cls || "—", code: d.code || "—", dose: d.dose || "See formulary", note: d.note || "", indications: d.indications || "Per formulary monograph.", contra: d.contra || "Per formulary monograph.", storage: d.storage || "Per label.", pregnancy: d.pregnancy || "Consult formulary." }; });
    setQnf(map); setFormulary({ name: meta.name, version: meta.version, count: drugs.length }); setUpdateOpen(false); };
  const canUpdate = role === "Admin" || role === "Management";
  return (<Page title="Clinical tools" subtitle="QNF lookup and interaction checking — available to all roles." info="Reference tools for safe prescribing. The formulary is maintained by Admin & Management from an official QNF/NF PDF; in production it connects to the live Qatar National Formulary and an up-to-date interaction database."
    action={canUpdate && <button onClick={() => setUpdateOpen(true)} style={btn(t, "gold")}><Upload size={15} /> Update formulary (PDF)</button>}>
    <div style={{ ...card(t), marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={roundIcon(t, t.primarySoft)}><BookOpen size={18} color={t.primary} /></div>
      <div style={{ flex: 1, minWidth: 180 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{formulary.name}</div><div style={{ fontSize: 12, color: t.textMuted }}>{formulary.count} medications loaded · version {formulary.version}</div></div>
      {canUpdate ? <button onClick={() => setUpdateOpen(true)} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12 }}><Upload size={13} /> Load a new QNF/NF PDF</button>
        : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted }}><Lock size={13} /> Maintained by Admin & Management</span>}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* QNF lookup with search dropdown + add + read more */}
      <div style={card(t)}><p style={ttl(t)}><BookOpen size={17} color={t.primary} /> QNF lookup <InfoDot text="Search the loaded formulary. Each result can be added to the interaction checker or opened in a 'Read more' details box with an external link." /></p>
        <div style={{ position: "relative", margin: "12px 0" }}><Search size={16} color={t.textMuted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a medication or code…" style={{ ...fld, paddingLeft: 40 }} /></div>
        {q.trim() && matches.length === 0 && <div style={{ fontSize: 13, color: t.textMuted }}>No entry for "{q}" in the loaded formulary.</div>}
        <div style={{ display: "grid", gap: 8 }}>{matches.map(([key, v]) => (<div key={key} style={{ background: t.surfaceAlt, borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontSize: 14, fontWeight: 700 }}>{v.name}</div><div style={{ fontSize: 11.5, color: t.accent, fontWeight: 600 }}>{v.cls} · code {v.code}</div></div></div>
          <div style={{ fontSize: 12.5, marginTop: 6 }}><span style={{ color: t.textMuted }}>Dose: </span>{v.dose}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button onClick={() => { addDrug(key); recordLookup(key); }} style={{ ...btn(t), height: 32, fontSize: 12 }}><Plus size={13} /> Add to interaction check</button>
            <button onClick={() => { setDetails(key); recordLookup(key); }} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}><BookOpen size={13} /> Read more</button>
          </div>
        </div>))}</div>
        {lookupHist.length > 0 && (<div style={{ marginTop: 16, borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CalendarClock size={13} /> Recent lookups</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{lookupHist.filter((k) => qnf[k]).map((k) => <button key={k} onClick={() => setDetails(k)} style={{ fontSize: 11.5, padding: "4px 9px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer" }}>{qnf[k]?.name || k}</button>)}</div>
        </div>)}
      </div>
      {/* Interaction checker with save history */}
      <div style={card(t)}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><p style={ttl(t)}><FlaskConical size={17} color={t.accent} /> Interaction checker <InfoDot text="Add two or more medications to screen every pair, graded major / moderate / minor. Save a check to keep it in history." /></p>{picked.length >= 2 && <button onClick={saveCheck} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12 }}><Check size={13} /> Save check</button>}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0" }}>{picked.length === 0 && <span style={{ fontSize: 13, color: t.textMuted }}>Add drugs from QNF lookup, or pick below.</span>}{picked.map((d) => <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: t.primary, background: t.primarySoft, padding: "5px 10px", borderRadius: 20 }}>{qnf[d]?.name || d}<button onClick={() => setPicked(picked.filter((x) => x !== d))} aria-label="Remove" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, color: t.primary, display: "grid" }}><X size={13} /></button></span>)}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{Object.keys(qnf).filter((d) => !picked.includes(d)).map((d) => <button key={d} onClick={() => addDrug(d)} style={{ fontSize: 11.5, padding: "4px 9px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.textMuted, cursor: "pointer" }}>+ {qnf[d].name}</button>)}</div>
        {picked.length >= 2 && <div style={{ display: "grid", gap: 8 }}>{pairs.map((r, i) => { const c = r.hit ? sev(r.hit.sev) : { fg: t.success, bg: t.successSoft }; return (<div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: c.bg, borderLeft: `4px solid ${c.fg}` }}><div style={{ fontSize: 12.5, fontWeight: 700, display: "flex", justifyContent: "space-between" }}><span>{qnf[r.pair[0]]?.name} + {qnf[r.pair[1]]?.name}</span><span style={{ color: c.fg, textTransform: "capitalize" }}>{r.hit ? r.hit.sev : "no interaction"}</span></div><div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{r.hit ? r.hit.text : "No clinically significant interaction in the sample database."}</div></div>); })}</div>}
        {checkHist.length > 0 && (<div style={{ marginTop: 16, borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CalendarClock size={13} /> Saved checks</div>
          <div style={{ display: "grid", gap: 6 }}>{checkHist.map((h) => { const c = sev(h.worst); return (<div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, background: t.surfaceAlt }}><span style={{ fontSize: 12, fontWeight: 600 }}>{h.drugs.join(" + ")}</span><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: c.fg, background: c.bg, padding: "2px 8px", borderRadius: 12, textTransform: "capitalize" }}>{h.worst === "none" ? "clear" : h.worst}</span><span style={{ fontSize: 11, color: t.textMuted }}>{h.when}</span></span></div>); })}</div>
        </div>)}
      </div>
    </div>
    <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Clinical decisions remain the prescriber's responsibility — confirm against the current QNF.</div>
    {details && <DrugDetails drug={qnf[details]} onClose={() => setDetails(null)} onAdd={() => { addDrug(details); setDetails(null); }} added={picked.includes(details)} />}
    {updateOpen && <QNFUpdateModal onClose={() => setUpdateOpen(false)} onLoad={loadFormulary} />}
  </Page>);
}
const SAMPLE_PARSE = [
  { name: "Amoxicillin/Clavulanate 1g", cls: "Beta-lactam antibiotic", code: "1235", dose: "1 tab q12h", indications: "Respiratory, ENT, urinary, skin infections.", contra: "Penicillin hypersensitivity.", storage: "Below 25°C.", pregnancy: "Category B." },
  { name: "Paracetamol 500mg", cls: "Analgesic / antipyretic", code: "1230", dose: "1–2 tabs q4–6h, max 4g/day", indications: "Mild–moderate pain and fever.", contra: "Severe hepatic impairment.", storage: "Below 30°C.", pregnancy: "Safe at recommended doses." },
  { name: "Metformin 850mg", cls: "Biguanide antidiabetic", code: "1310", dose: "1 tab 2–3×/day with meals", indications: "Type 2 diabetes, first-line.", contra: "eGFR <30.", storage: "Below 30°C.", pregnancy: "Specialist guidance." },
  { name: "Atorvastatin 20mg", cls: "HMG-CoA reductase inhibitor", code: "1520", dose: "10–80mg once daily", indications: "Hyperlipidaemia, CV risk reduction.", contra: "Active liver disease, pregnancy.", storage: "Below 25°C.", pregnancy: "Contraindicated." },
  { name: "Amlodipine 5mg", cls: "Calcium channel blocker", code: "1610", dose: "5–10mg once daily", indications: "Hypertension, angina.", contra: "Severe hypotension, shock.", storage: "Below 30°C.", pregnancy: "Use only if essential." },
  { name: "Omeprazole 20mg", cls: "Proton pump inhibitor", code: "1410", dose: "20–40mg once daily", indications: "GORD, peptic ulcer, H. pylori.", contra: "Hypersensitivity.", storage: "Below 25°C.", pregnancy: "Generally considered safe." },
  { name: "Salbutamol inhaler", cls: "Short-acting beta-2 agonist", code: "1720", dose: "1–2 puffs as needed", indications: "Asthma, bronchospasm.", contra: "Hypersensitivity.", storage: "Below 30°C, do not freeze.", pregnancy: "Considered safe." },
  { name: "Ceftriaxone 1g", cls: "3rd-gen cephalosporin", code: "1450", dose: "1–2g once daily IV/IM", indications: "Serious systemic infections, meningitis.", contra: "Cephalosporin hypersensitivity.", storage: "Below 25°C.", pregnancy: "Category B." },
];
function QNFUpdateModal({ onClose, onLoad }) {
  const t = useT(); const [stage, setStage] = useState("pick"); const [file, setFile] = useState(null); const [drugs, setDrugs] = useState([]); const [progress, setProgress] = useState(0); const ref = useRef(null);
  const pick = (e) => { const f = e.target.files?.[0]; if (f) { setFile({ name: f.name }); setStage("parsing"); setProgress(0);
    let p = 0; const iv = setInterval(() => { p += Math.random() * 22 + 8; if (p >= 100) { p = 100; clearInterval(iv); setDrugs(SAMPLE_PARSE.map((d, i) => ({ ...d, id: i, keep: true }))); setTimeout(() => setStage("confirm"), 350); } setProgress(Math.min(100, Math.round(p))); }, 260); } };
  const fld = { width: "100%", height: 38, borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13, padding: "0 10px", outline: "none", boxSizing: "border-box" };
  const kept = drugs.filter((d) => d.keep);
  return (<Modal title="Update formulary from PDF" icon={Upload} onClose={onClose} width={620}>
    {stage === "pick" && (<>
      <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14, display: "flex", gap: 6 }}><Info size={14} style={{ flexShrink: 0, marginTop: 1 }} /> Upload an official Qatar National Formulary (or other NF) PDF. Khazeen reads the monographs, then you review and confirm before they replace the current data.</div>
      <input ref={ref} type="file" accept="application/pdf" onChange={pick} style={{ display: "none" }} />
      <button onClick={() => ref.current?.click()} style={{ width: "100%", height: 120, border: `2px dashed ${t.border}`, borderRadius: 12, background: t.surfaceAlt, cursor: "pointer", color: t.textMuted, display: "grid", placeItems: "center", gap: 6 }}><FileText size={26} color={t.primary} /><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Tap to attach the QNF / NF PDF</span><span style={{ fontSize: 11.5 }}>e.g. qatar_national_formulary_2026.pdf</span></button>
    </>)}
    {stage === "parsing" && (<div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><FileText size={20} color={t.primary} /><div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{file?.name}</div><div style={{ fontSize: 12, color: t.textMuted }}>Reading monographs and mapping fields…</div></div></div>
      <div style={{ height: 10, background: t.surfaceAlt, borderRadius: 20, overflow: "hidden" }}><div style={{ width: `${progress}%`, height: "100%", background: t.primary, borderRadius: 20, transition: "width .25s" }} /></div>
      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 8, textAlign: "center" }}>{progress}% · extracting name, code, dose, indications, contraindications…</div>
    </div>)}
    {stage === "confirm" && (<>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 12, color: t.success, fontWeight: 600 }}><CheckCircle2 size={16} /> Parsed {file?.name} — mapped {drugs.length} medications. Review and edit, then load.</div>
      <div style={{ display: "grid", gap: 8, maxHeight: 320, overflowY: "auto", marginBottom: 16 }}>{drugs.map((d) => (<div key={d.id} style={{ background: t.surfaceAlt, borderRadius: 10, padding: "10px 12px", opacity: d.keep ? 1 : 0.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <button onClick={() => setDrugs((p) => p.map((x) => x.id === d.id ? { ...x, keep: !x.keep } : x))} aria-label="Include" style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer", border: `1.5px solid ${d.keep ? t.success : t.border}`, background: d.keep ? t.success : "transparent", display: "grid", placeItems: "center" }}>{d.keep && <Check size={13} color="#fff" />}</button>
          <input value={d.name} onChange={(e) => setDrugs((p) => p.map((x) => x.id === d.id ? { ...x, name: e.target.value } : x))} style={{ ...fld, fontWeight: 700, flex: 2 }} />
          <input value={d.code} onChange={(e) => setDrugs((p) => p.map((x) => x.id === d.id ? { ...x, code: e.target.value } : x))} style={{ ...fld, width: 70, flex: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}><input value={d.cls} onChange={(e) => setDrugs((p) => p.map((x) => x.id === d.id ? { ...x, cls: e.target.value } : x))} style={{ ...fld, fontSize: 12 }} /><input value={d.dose} onChange={(e) => setDrugs((p) => p.map((x) => x.id === d.id ? { ...x, dose: e.target.value } : x))} style={{ ...fld, fontSize: 12 }} /></div>
      </div>))}</div>
      <button onClick={() => onLoad(kept, { name: file?.name?.replace(/\.pdf$/i, "") || "Uploaded formulary", version: new Date().toISOString().slice(0, 10) })} disabled={kept.length === 0} style={{ ...btn(t, "gold"), width: "100%", height: 46, justifyContent: "center", opacity: kept.length ? 1 : 0.5 }}><Check size={16} /> Load {kept.length} medications into the formulary</button>
      <p style={{ fontSize: 11, color: t.textMuted, marginTop: 10, display: "flex", gap: 6 }}><Info size={12} style={{ flexShrink: 0, marginTop: 1 }} /> Prototype: parsing is simulated from a representative sample so you can see the workflow. In production a PDF/vision pipeline extracts the full formulary, which a pharmacist confirms before publishing to all camps.</p>
    </>)}
  </Modal>);
}
function DrugDetails({ drug, onClose, onAdd, added }) {
  const t = useT();
  const row = (label, val) => (<div style={{ padding: "9px 0", borderTop: `1px solid ${t.border}` }}><div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div><div style={{ fontSize: 13, marginTop: 3 }}>{val}</div></div>);
  return (<Modal title="Read more" icon={BookOpen} onClose={onClose} width={500}>
    <div style={{ fontSize: 18, fontWeight: 700 }}>{drug.name}</div>
    <div style={{ fontSize: 12.5, color: t.accent, fontWeight: 600, marginBottom: 6 }}>{drug.cls} · code {drug.code}</div>
    {row("Indications", drug.indications)}
    {row("Dose", drug.dose)}
    {row("Contraindications", drug.contra)}
    {row("Storage", drug.storage)}
    {row("Pregnancy", drug.pregnancy)}
    {row("Note", drug.note)}
    <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
      <button onClick={onAdd} disabled={added} style={{ ...btn(t), flex: 1, height: 44, justifyContent: "center", opacity: added ? 0.5 : 1 }}><Plus size={15} /> {added ? "Already added" : "Add to interaction check"}</button>
      <a href={QNF_REF} target="_blank" rel="noreferrer" style={{ ...btn(t, "ghost"), height: 44, justifyContent: "center" }}><ExternalLink size={15} /> Full QNF entry</a>
    </div>
    <p style={{ fontSize: 11, color: t.textMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> Summary shown in-app; the external link opens the official formulary reference.</p>
  </Modal>);
}


/* ================= CPD ================= */
/* MOPH online CPD resources — shared (all roles) */
const CPD_SHARED = [
  { label: "Medscape", url: "http://www.medscape.com", audience: "Phys., Nur. & Pharm.", note: "" },
  { label: "Elsevier CME", url: "http://courses.elseviercme.com", audience: "Phys. & other HCPs", note: "" },
  { label: "Cleveland Clinic CME", url: "http://www.clevelandclinicmeded.com", audience: "Phys., Nur. & other HCPs", note: "" },
  { label: "ExchangeCME", url: "http://www.exchangecme.com", audience: "Phys. & other HCPs", note: "" },
  { label: "myCME", url: "http://www.mycme.com", audience: "All HCPs", note: "Some activities are paid for" },
  { label: "FreeCME", url: "http://www.freecme.com", audience: "All HCPs", note: "" },
  { label: "StudyPRN", url: "https://www.studyprn.com", audience: "Phys., Nur., Pharm. & other HCPs", note: "Some activities are paid for" },
  { label: "MedPage Today", url: "http://www.medpagetoday.com", audience: "Phys. & other HCPs", note: "" },
  { label: "Pharmacy Magazine", url: "http://www.pharmacymagazine.co.uk", audience: "Pharm. & Pharm. Tech.", note: "" },
  { label: "ACHL CME", url: "http://www.achlcme.org", audience: "All HCPs", note: "" },
  { label: "PRIME Inc. CME", url: "https://primeinc.org/cme/credit/type/online", audience: "All HCPs", note: "Offers free webinars also" },
];
/* Doctor (view-user) only */
const CPD_DOCTOR_ONLY = [
  { label: "American CME", url: "http://www.americancme.com", audience: "Paramedics", note: "" },
  { label: "VivaLearning", url: "https://www.vivalearning.com", audience: "Dental health professionals", note: "Offers live webinars too" },
  { label: "Colgate Oral Health Network", url: "https://www.colgateoralhealthnetwork.com/dental-ce-courses/", audience: "Dental health professionals", note: "Offers live webinars too" },
  { label: "WCO / WCEA", url: "https://wco.wcea.education", audience: "Optometrists", note: "Some activities are paid for" },
];
const CPD_BY_ROLE = {
  Pharmacist: { cat1: 18, cat23: 14, target1: 20, target23: 20, recs: [["Cat 1", "QCHP-accredited clinical pharmacy workshop"], ["Cat 1", "Antimicrobial stewardship e-module"], ["Cat 2&3", "Reflective case log: near-expiry dispensing"]] },
  Medical: { cat1: 22, cat23: 10, target1: 25, target23: 15, recs: [["Cat 1", "Accredited prescribing-safety CME"], ["Cat 2&3", "Audit: near-expiry prescribing"], ["Cat 2&3", "Reflective journal on interaction alerts"]] },
  Admin: { cat1: 12, cat23: 16, target1: 15, target23: 15, recs: [["Cat 1", "Healthcare leadership accredited seminar"], ["Cat 2&3", "Quality-improvement project"]] },
  Management: { cat1: 10, cat23: 18, target1: 15, target23: 15, recs: [["Cat 1", "Pharmacy governance accredited course"], ["Cat 2&3", "Service-evaluation report"]] },
  "Sub-Manager": { cat1: 14, cat23: 12, target1: 15, target23: 15, recs: [["Cat 1", "Operational standards workshop"], ["Cat 2&3", "SOP-review reflective log"]] },
  Inspector: { cat1: 12, cat23: 14, target1: 15, target23: 15, recs: [["Cat 1", "GPP & inspection standards accredited course"], ["Cat 2&3", "Inspection audit reflective log"]] },
  Store: { cat1: 8, cat23: 10, target1: 15, target23: 15, recs: [["Cat 1", "Supply-chain & GDP accredited course"], ["Cat 2&3", "Inventory-control reflective log"]] },
};
function CPD({ role, license, cpdLink }) {
  const sources = role === "Medical" ? [...CPD_SHARED, ...CPD_DOCTOR_ONLY] : CPD_SHARED;
  const t = useT(); const data = CPD_BY_ROLE[role] || CPD_BY_ROLE.Pharmacist; const [creds, setCreds] = useState({ user: "", pass: "" }); const [saved, setSaved] = useState(false);
  const lic = licenseLevel(license.expiry); const lc = lic ? (lic.lv === "critical" || lic.lv === "danger" ? { fg: t.danger, bg: t.dangerSoft } : { fg: t.warning, bg: t.warningSoft }) : { fg: t.success, bg: t.successSoft };
  const bar = (v, tg, c) => <div style={{ height: 8, background: t.surfaceAlt, borderRadius: 20, overflow: "hidden", marginTop: 6 }}><div style={{ width: `${Math.min(100, (v / tg) * 100)}%`, height: "100%", background: c, borderRadius: 20 }} /></div>;
  const cfld = { height: 40, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13.5, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  return (<Page title="CPD" subtitle="Continuing professional development — DHP / QCHP cycle." info="Save your MOPH accreditation login to auto-fill your license and CPD progress. Category 1 is accredited group learning; Categories 2 & 3 are self-directed."
    action={<a href={cpdLink} target="_blank" rel="noreferrer" style={btn(t)}><ExternalLink size={15} /> Open DHP CPD portal</a>}>
    <div style={{ ...card(t), marginBottom: 16, borderColor: lc.fg + "55", background: lic ? lc.bg : t.surface }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={roundIcon(t, lic ? lc.bg : t.successSoft)}><Award size={20} color={lic ? lc.fg : t.success} /></div><div><div style={{ fontSize: 14, fontWeight: 700 }}>License {license.number}</div><div style={{ fontSize: 12.5, color: t.textMuted }}>Expires {new Date(license.expiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {lic ? `${lic.days} days left` : "valid"}</div></div></div>
        {lic && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: lc.fg, background: t.surface, padding: "6px 12px", borderRadius: 20 }}><AlertTriangle size={14} /> License {lic.txt} — renew soon</span>}
      </div>
      {lic && <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><Bell size={12} /> Reminders escalate at 6 months, 4 months, 2 months and 2 weeks before expiry.</div>}
    </div>
    <div style={{ ...card(t), marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div style={roundIcon(t, t.primarySoft)}><Link2 size={20} color={t.primary} /></div><div><div style={{ fontSize: 14, fontWeight: 600 }}>MOPH accreditation login</div><div style={{ fontSize: 12.5, color: t.textMuted }}>{saved ? "Saved — login is stored on this device to auto-fill the portal." : "Save your portal login to auto-fill license & CPD progress."}</div></div>
        {saved && <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: t.success, background: t.successSoft, padding: "6px 12px", borderRadius: 20 }}><CheckCircle2 size={14} /> Saved</span>}
      </div>
      {!saved ? (<>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input value={creds.user} onChange={(e) => setCreds({ ...creds, user: e.target.value })} placeholder="Portal username" style={cfld} />
          <input type="password" value={creds.pass} onChange={(e) => setCreds({ ...creds, pass: e.target.value })} placeholder="Portal password" style={cfld} />
        </div>
        <button onClick={() => setSaved(true)} disabled={!creds.user || !creds.pass} style={{ ...btn(t), height: 40, opacity: (creds.user && creds.pass) ? 1 : 0.5 }}><Lock size={15} /> Save login</button>
      </>) : (<button onClick={() => { setSaved(false); setCreds({ user: "", pass: "" }); }} style={{ ...btn(t, "ghost"), height: 36, fontSize: 12 }}>Update login</button>)}
      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 10, display: "flex", gap: 6 }}><Info size={13} style={{ flexShrink: 0, marginTop: 1 }} /> Stored locally on this device only (prototype). In production this uses a secure backend connection to the MOPH accreditation system.</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
      <div style={card(t)}><p style={ttl(t)}><Sparkles size={17} color={t.accent} /> Recommended approved activities</p><div style={{ display: "grid", gap: 10, marginTop: 12 }}>{data.recs.map(([cat, title], i) => { const c1 = cat === "Cat 1"; const c = c1 ? { fg: t.primary, bg: t.primarySoft } : { fg: t.accent, bg: t.primarySoft }; return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: t.surfaceAlt }}><GraduationCap size={18} color={c.fg} /><div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{title}</div><span style={{ fontSize: 11, fontWeight: 700, color: c.fg, background: c.bg, padding: "3px 10px", borderRadius: 20 }}>{cat}</span></div>); })}</div></div>
      <div style={card(t)}><p style={ttl(t)}><BookOpen size={17} color={t.primary} /> Accredited online CPD resources <InfoDot text="MOPH online CPD resource list, with target audience and notes. Some activities are paid; check each provider." /></p><div style={{ display: "grid", gap: 8, marginTop: 12, maxHeight: 360, overflowY: "auto" }}>{sources.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: "9px 12px", borderRadius: 10, background: t.surfaceAlt, textDecoration: "none" }}><div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: t.primary }}><ExternalLink size={12} /> {s.label}</div><div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{s.audience}{s.note ? ` · ${s.note}` : ""}</div></a>)}</div></div>
    </div>
    <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Live MOPH sync and the official accredited-resource list are configured in production / via the Design panel.</div>
  </Page>);
}

/* ================= MY TASKS (self-entered, private) ================= */
const FREQ = { daily: { label: "Daily", icon: CalendarClock }, monthly: { label: "Monthly", icon: CalendarDays }, quarterly: { label: "Quarterly", icon: CalendarRange } };
const MYTASK_SEED = [
  { id: 1, freq: "daily", title: "Check crash cart seal", note: "Morning round", done: true },
  { id: 2, freq: "daily", title: "Log today's dispensing", note: "End of shift", done: false },
  { id: 3, freq: "monthly", title: "Reconcile near-expiry shelf", note: "1st of month", done: false },
  { id: 4, freq: "quarterly", title: "Tidy controlled-drug register", note: "", done: false },
];
const ASSIGNED_TASK_SEED = [
  { id: 7001, title: "Complete monthly narcotics reconciliation", detail: "Cross-check the controlled register against physical count.", due: "End of week", assignee: "Yaqeen", assigneeRole: "Pharmacist", by: "M. Obaidly", done: false },
  { id: 7002, title: "Update cold-chain temperature log", detail: "Twice-daily fridge readings for insulin storage.", due: "Today", assignee: "Nawras", assigneeRole: "Store", by: "Dalia & Asmaa", done: true },
];
function MyTasks({ role, userName }) {
  const t = useT(); const [tasks, setTasks] = useState(MYTASK_SEED); const [modal, setModal] = useState(null);
  const { assignedTasks, assignTask, toggleAssigned, removeAssigned, notify, users } = useApp();
  const canAssign = role === "Management" || role === "Sub-Manager" || role === "Admin";
  const [assignModal, setAssignModal] = useState(false);
  const forMe = (assignedTasks || []).filter((x) => x.assignee === userName || x.assigneeRole === role);
  const byMe = (assignedTasks || []).filter((x) => x.by === userName);
  const toggle = (id) => setTasks((p) => p.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const save = (task) => { if (task.id) setTasks((p) => p.map((x) => x.id === task.id ? task : x)); else setTasks((p) => [...p, { ...task, id: Date.now(), done: false }]); setModal(null); };
  return (<Page title="My tasks" subtitle="Your own to-do list, plus any tasks assigned to you."
    info="Your personal tasks are private. Tasks assigned to you by management appear at the top. Management/Sub-management can delegate tasks to any staff member."
    action={<>{canAssign && <button onClick={() => setAssignModal(true)} style={btn(t)}><Send size={15} /> Assign task</button>}<button onClick={() => setModal({})} style={btn(t, canAssign ? "ghost" : "primary")}><Plus size={15} /> Add task</button></>}>
    {forMe.length > 0 && <div style={{ ...card(t), marginBottom: 16, borderLeft: `4px solid ${t.accent}` }}>
      <div style={{ ...ttl(t), marginBottom: 12 }}><UserCheck size={16} color={t.accent} /> Assigned to you</div>
      <div style={{ display: "grid", gap: 9 }}>{forMe.map((task) => (<div key={task.id} style={{ padding: "11px 12px", borderRadius: 10, background: t.surfaceAlt, border: `1px solid ${t.border}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <button onClick={() => toggleAssigned(task.id)} aria-label="Done" style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer", marginTop: 1, border: `1.5px solid ${task.done ? t.success : t.border}`, background: task.done ? t.success : "transparent", display: "grid", placeItems: "center" }}>{task.done && <Check size={14} color="#fff" />}</button>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700, textDecoration: task.done ? "line-through" : "none", color: task.done ? t.textMuted : t.text }}>{task.title}</div>{task.detail && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>{task.detail}</div>}<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{task.due && <span style={pill(t)}><CalendarClock size={11} /> {task.due}</span>}<span style={{ ...pill(t), color: t.accent }}>from {task.by}</span></div></div>
      </div>))}</div>
    </div>}
    {canAssign && byMe.length > 0 && <div style={{ ...card(t), marginBottom: 16 }}>
      <div style={{ ...ttl(t), marginBottom: 12 }}><Send size={16} color={t.primary} /> Tasks you assigned</div>
      <div style={{ display: "grid", gap: 9 }}>{byMe.map((task) => (<div key={task.id} style={{ padding: "11px 12px", borderRadius: 10, background: t.surfaceAlt, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? t.textMuted : t.text }}>{task.title}</div><div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 3 }}>to {task.assignee} ({task.assigneeRole}){task.due ? ` · ${task.due}` : ""}</div></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11.5, fontWeight: 700, color: task.done ? t.success : t.warning, background: task.done ? t.successSoft : t.warningSoft, padding: "3px 10px", borderRadius: 12 }}>{task.done ? "Done" : "Open"}</span><button onClick={() => removeAssigned(task.id)} aria-label="Remove" style={miniBtn(t)}><Trash2 size={12} color={t.danger} /></button></div>
      </div>))}</div>
    </div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
      {Object.entries(FREQ).map(([key, meta]) => { const list = tasks.filter((x) => x.freq === key); const Icon = meta.icon;
        return (<div key={key} style={card(t)}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}><div style={roundIcon(t, t.primarySoft)}><Icon size={18} color={t.primary} /></div><div><div style={{ fontSize: 15, fontWeight: 600 }}>{meta.label}</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{list.filter((x) => x.done).length} of {list.length} done</div></div></div>
          <div style={{ display: "grid", gap: 9 }}>
            {list.length === 0 && <div style={{ fontSize: 12.5, color: t.textMuted, padding: "12px 0", textAlign: "center" }}>No {meta.label.toLowerCase()} tasks yet.</div>}
            {list.map((task) => (<div key={task.id} style={{ padding: "11px 12px", borderRadius: 10, background: t.surfaceAlt, border: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <button onClick={() => toggle(task.id)} aria-label="Done" style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer", marginTop: 1, border: `1.5px solid ${task.done ? t.success : t.border}`, background: task.done ? t.success : "transparent", display: "grid", placeItems: "center" }}>{task.done && <Check size={14} color="#fff" />}</button>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? t.textMuted : t.text }}>{task.title}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{task.time && <span style={pill(t)}><Clock size={11} /> {task.time}</span>}{task.notify && <span style={{ ...pill(t), color: t.primary }}><Bell size={11} /> Reminder on</span>}{task.note && <span style={pill(t)}><CalendarClock size={11} /> {task.note}</span>}</div></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><button onClick={() => setModal(task)} aria-label="Edit" style={miniBtn(t)}><Pencil size={12} color={t.textMuted} /></button><button onClick={() => setTasks((p) => p.filter((x) => x.id !== task.id))} aria-label="Delete" style={miniBtn(t)}><Trash2 size={12} color={t.danger} /></button></div>
              </div></div>))}
            <button onClick={() => setModal({ freq: key })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 36, borderRadius: 9, border: `1px dashed ${t.border}`, background: "transparent", color: t.textMuted, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}><Plus size={14} /> Add {meta.label.toLowerCase()} task</button>
          </div>
        </div>); })}
    </div>
    {modal && <MyTaskModal initial={modal} onClose={() => setModal(null)} onSave={save} />}
    {assignModal && <AssignTaskModal users={users} userName={userName} onClose={() => setAssignModal(false)} onSave={(tk) => { assignTask({ ...tk, by: userName }); notify("Tasks", [tk.assigneeRole], `📋 New task assigned to you by ${userName}: "${tk.title}"${tk.due ? ` (due ${tk.due})` : ""}.`); setAssignModal(false); }} />}
  </Page>);
}
function AssignTaskModal({ users, userName, onClose, onSave }) {
  const t = useT();
  const staff = (users || []).filter((u) => u.status === "active" && u.role !== "Admin");
  const [f, setF] = useState({ assignId: staff[0] ? String(staff[0].id) : "", title: "", detail: "", due: "" });
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const fld = { width: "100%", height: 44, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const pick = staff.find((u) => String(u.id) === f.assignId);
  const submit = () => { if (!pick || !f.title.trim()) return; onSave({ title: f.title.trim(), detail: f.detail.trim(), due: f.due.trim(), assignee: pick.name, assigneeRole: pick.role }); };
  return (<Modal title="Assign a task" icon={Send} onClose={onClose}>
    <label style={lab}>Assign to</label>
    <select value={f.assignId} onChange={(e) => setF({ ...f, assignId: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{staff.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.role === "Medical" ? (u.profession || "Medical") : u.role} ({u.camp})</option>)}</select>
    <label style={lab}>Task title</label>
    <input value={f.title} autoFocus onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Complete monthly stock count" style={{ ...fld, marginBottom: 14 }} />
    <label style={lab}>Details (optional)</label>
    <textarea value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} rows={3} placeholder="Any instructions…" style={{ ...fld, height: "auto", padding: 12, marginBottom: 14, resize: "vertical", fontFamily: "inherit" }} />
    <label style={lab}>Due (optional)</label>
    <input value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} placeholder="e.g. Today, End of week, 15 Jul" style={{ ...fld, marginBottom: 18 }} />
    <button onClick={submit} disabled={!pick || !f.title.trim()} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: (!pick || !f.title.trim()) ? 0.5 : 1 }}><Send size={16} /> Assign task</button>
  </Modal>);
}
function MyTaskModal({ initial, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ id: initial.id, freq: initial.freq || "daily", title: initial.title || "", note: initial.note || "", time: initial.time || "", notify: initial.notify || false, done: initial.done || false }); const v = f.title.trim();
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={f.id ? "Edit task" : "Add task"} icon={ClipboardList} onClose={onClose}>
    <label style={lab}>What do you want to get done?</label><input autoFocus value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Check crash cart seal" style={{ ...fld, marginBottom: 14 }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}><div><label style={lab}>Repeats</label><select value={f.freq} onChange={(e) => setF({ ...f, freq: e.target.value })} style={fld}><option value="daily">Daily</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></select></div><div><label style={lab}>Time</label><input type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} style={fld} /></div></div>
    <label style={lab}>Note (optional)</label><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. before handover" style={{ ...fld, marginBottom: 14 }} />
    <button onClick={() => setF({ ...f, notify: !f.notify })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, border: `1px solid ${f.notify ? t.primary : t.border}`, background: f.notify ? t.primarySoft : t.surface, cursor: "pointer", marginBottom: 20, color: t.text }}>
      {f.notify ? <Bell size={17} color={t.primary} /> : <BellOff size={17} color={t.textMuted} />}<span style={{ fontSize: 13.5, fontWeight: 600, textAlign: "left", flex: 1 }}>Remind me{f.time ? ` at ${f.time}` : ""}</span><span style={{ fontSize: 11.5, fontWeight: 700, color: f.notify ? t.primary : t.textMuted }}>{f.notify ? "On" : "Off"}</span>
    </button>
    <button onClick={() => onSave(f)} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> {f.id ? "Save changes" : "Add task"}</button>
  </Modal>);
}

/* ================= APPROVALS ================= */
const REQ_SEED = [
  { id: 1, type: "Transfer", item: "Augmentin 1000mg", batch: "#AUG2026-X", qty: 50, from: "Tariq Camp", to: "Al-Udeid Clinic", by: "🩺 Dr. Al-Thani", status: "pending" },
  { id: 2, type: "Store", item: "Insulin Glargine", batch: "#INS-0042", qty: 30, from: "Main store", to: "Al-Rayyan Field Clinic", by: "💊 Yaqeen", status: "pending" },
  { id: 3, type: "Store", item: "Paracetamol 500mg", batch: "#PAR-2025-A", qty: 500, from: "Main store", to: "Doha HQ", by: "💊 S. Hassan", status: "approved", actor: "You", time: "Today 09:02" },
];
const STAGE_META = {
  source_confirm: { l: "Awaiting source confirmation", fg: "warning", step: 1 },
  mgmt_approve: { l: "Awaiting management approval", fg: "warning", step: 2 },
  fulfil: { l: "Approved — awaiting fulfilment", fg: "primary", step: 3 },
  receive: { l: "In transit — awaiting receipt", fg: "primary", step: 4 },
  done: { l: "Completed", fg: "success", step: 5 },
  declined: { l: "Declined", fg: "danger", step: 0 },
};
function stageBadge(t, stage) { const m = STAGE_META[stage] || { l: stage, fg: "textMuted" }; const fg = t[m.fg] || t.textMuted; const bg = t[m.fg + "Soft"] || t.surfaceAlt; return { fg, bg, l: m.l, step: m.step }; }
function StageTrack({ t, stage }) {
  const steps = ["Requested", "Source", "Approval", "Fulfil", "Delivered"];
  const cur = (STAGE_META[stage] || {}).step || 0;
  return (<div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, flexWrap: "wrap" }}>{steps.map((s, i) => { const done = i + 1 <= cur; return (<span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: done ? t.success : t.border }} /><span style={{ fontSize: 10.5, fontWeight: done ? 700 : 500, color: done ? t.text : t.textMuted }}>{s}</span>{i < steps.length - 1 && <span style={{ width: 14, height: 2, background: done ? t.success : t.border, borderRadius: 2 }} />}</span>); })}</div>);
}
const MED_REQ_SEED = [
  { id: 901, item: "Paracetamol 500mg", qty: 100, source: "Tariq Camp", destCamp: "Al-Rayyan Field Clinic", by: "Dr. Al-Thani", fromPharmacist: false, stage: "mgmt_approve", srcActor: "(Tariq pharmacist)", time: "Today 08:14" },
  { id: 902, item: "Insulin Glargine", qty: 20, source: "Main store", destCamp: "Al-Rayyan Field Clinic", by: "Dr. Al-Thani", fromPharmacist: false, stage: "source_confirm", time: "Today 09:05" },
];
const ADMIN_REQ_SEED = [
  { id: 1, kind: "Change request", title: "Add a new camp to the South zone", detail: "Please create 'Al-Wakrah Clinic' and assign it to South.", by: "🏛️ M. Obaidly", status: "open", time: "Today 08:30" },
  { id: 2, kind: "Fix", title: "Correct a user's license number", detail: "Yaqeen's license should read PH-33910, not PH-33901.", by: "📋 Dalia & Asmaa", status: "open", time: "Yesterday" },
  { id: 3, kind: "Add", title: "Add 'Optometrist' as a medical profession option", detail: "Needed for the new eye clinic staff.", by: "🏛️ M. Obaidly", status: "done", time: "2 days ago" },
];
function Approvals({ role }) {
  const t = useT(); const { notify, me, medReqs, patchMedReq, storeReqs, patchStoreReq } = useApp();
  const storeAct = (r, decision) => {
    if (decision === "approved") { patchStoreReq(r.id, { stage: "store_fulfil", actor: me?.name || "Management" }); notify("Store", ["Store"], `✅ ${r.type === "urgent" ? "Urgent request" : "Monthly demand"} from ${r.camp} approved — please fulfil & dispatch.`); notify("Requests", ["Pharmacist"], `Your ${r.type === "urgent" ? "urgent request" : "monthly demand"} for ${r.camp} was approved by ${me?.name || "management"}. The store will dispatch it.`); }
    else { patchStoreReq(r.id, { stage: "declined", actor: me?.name || "Management" }); notify("Requests", ["Pharmacist"], `Your ${r.type === "urgent" ? "urgent request" : "monthly demand"} for ${r.camp} was declined by ${me?.name || "management"}.`); }
  };
  const isAdmin = role === "Admin";
  const [reqs, setReqs] = useState(REQ_SEED);
  const [adminReqs, setAdminReqs] = useState(ADMIN_REQ_SEED); const [compose, setCompose] = useState(false); const [editing, setEditing] = useState(null);
  const medAct = (r, decision) => {
    if (decision === "approved") {
      patchMedReq(r.id, { stage: "fulfil", actor: me?.name || "Management" });
      const srcRole = r.source === "Main store" ? "Store" : "Pharmacist";
      notify("Requests", [srcRole], `✅ Approved: please fulfil ${r.qty} × ${r.item} from ${r.source} → ${r.destCamp} (requested by ${r.by}). Action it in your Actions tab.`);
      notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `${r.item}: approved by ${me?.name || "management"}. ${r.source} will fulfil it.`);
    } else {
      patchMedReq(r.id, { stage: "declined", actor: me?.name || "Management" });
      notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `Your request for ${r.qty} × ${r.item} from ${r.source} was declined by ${me?.name || "management"}.`);
    }
  };
  const act = (id, status) => setReqs((p) => p.map((r) => { if (r.id !== id) return r;
    notify("Approval", ["Store"], `${r.item} (${r.qty} units → ${r.to}) was ${status} by management. ${status === "approved" ? "Proceed with the exchange." : "Do not proceed."}`);
    return { ...r, status, actor: "You", time: "Just now" }; }));
  const sc = (s) => s === "approved" ? { fg: t.success, bg: t.successSoft, l: "Approved" } : s === "rejected" ? { fg: t.danger, bg: t.dangerSoft, l: "Rejected" } : { fg: t.warning, bg: t.warningSoft, l: "Pending" };
  // ADMIN view: requests that come only from Management & Sub-Manager
  const adminAct = (id, status) => setAdminReqs((p) => p.map((r) => r.id === id ? { ...r, status } : r));
  const saveAdminReq = (r) => { if (r.id) setAdminReqs((p) => p.map((x) => x.id === r.id ? { ...x, ...r } : x)); else setAdminReqs((p) => [{ ...r, id: Date.now(), by: "🏛️ You", status: "open", time: "Just now" }, ...p]); setCompose(false); setEditing(null); };
  const kc = (k) => k === "Fix" ? t.warning : k === "Add" ? t.success : k === "Change request" ? t.accent : t.primary;

  if (isAdmin) {
    const open = adminReqs.filter((r) => r.status === "open");
    return (<Page title="Requests to Admin" subtitle="Requests raised by Management & Sub-Manager — fix, edit, add or change."
      info="Only Management and Sub-Manager can raise requests to the administrator. As Admin you can act on each (mark done / reject), and edit or add request items as you work them."
      action={<button onClick={() => { setEditing({ kind: "Change request", title: "", detail: "" }); }} style={btn(t)}><Plus size={15} /> Add request item</button>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
        <Metric label="Open requests" value={open.length} tone="warning" />
        <Metric label="From Management" value={adminReqs.filter((r) => r.by.includes("🏛️")).length} tone="primary" />
        <Metric label="From Sub-Manager" value={adminReqs.filter((r) => r.by.includes("📋")).length} tone="accent" />
        <Metric label="Completed" value={adminReqs.filter((r) => r.status === "done").length} tone="success" />
      </div>
      <div style={{ display: "grid", gap: 12 }}>{adminReqs.map((r) => { const c = kc(r.kind); const open = r.status === "open";
        return (<div key={r.id} style={card(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: c, background: c + "1A", padding: "2px 9px", borderRadius: 12 }}>{r.kind}</span><span style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</span></div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: open ? t.warning : r.status === "rejected" ? t.danger : t.success, background: open ? t.warningSoft : r.status === "rejected" ? t.dangerSoft : t.successSoft, padding: "4px 11px", borderRadius: 20 }}>{open ? "Open" : r.status === "rejected" ? "Rejected" : "Done"}</span>
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 8 }}>{r.detail}</div>
          <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>by {r.by} · {r.time}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {open ? (<><button onClick={() => adminAct(r.id, "done")} style={{ ...btn(t), height: 32, fontSize: 12 }}><Check size={13} /> Mark done</button>
              <button onClick={() => setEditing(r)} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}><Pencil size={13} /> Edit</button>
              <button onClick={() => adminAct(r.id, "rejected")} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12, color: t.danger }}><X size={13} /> Reject</button></>)
              : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted }}><Lock size={12} /> Closed</span>}
          </div>
        </div>); })}</div>
      {editing && <AdminReqModal initial={editing} onClose={() => setEditing(null)} onSave={saveAdminReq} />}
    </Page>);
  }
  // MANAGEMENT / SUB-MANAGER view: normal approvals + a "Request from Admin" action
  const exportReqs = () => { const rowsH = reqs.map((r) => `<tr><td>${escapeHTML(r.type)}</td><td>${escapeHTML(r.item)}</td><td>${escapeHTML(r.batch)}</td><td>${r.qty}</td><td>${escapeHTML(r.from)} → ${escapeHTML(r.to)}</td><td>${escapeHTML(r.by)}</td><td>${escapeHTML(sc(r.status).l)}</td></tr>`).join("");
    exportPDF("Transfer & store requests", `<table><thead><tr><th>Type</th><th>Item</th><th>Batch</th><th>Qty</th><th>From → To</th><th>By</th><th>Status</th></tr></thead><tbody>${rowsH}</tbody></table>`, `${reqs.length} request(s)`); };
  const exportOne = (r) => exportPDF(`${r.type} request — ${r.item}`, `<table><tbody>
      <tr><th style="width:160px">Item</th><td>${escapeHTML(r.item)}</td></tr><tr><th>Batch</th><td>${escapeHTML(r.batch)}</td></tr><tr><th>Quantity</th><td>${r.qty} units</td></tr>
      <tr><th>From → To</th><td>${escapeHTML(r.from)} → ${escapeHTML(r.to)}</td></tr><tr><th>Requested by</th><td>${escapeHTML(r.by)}</td></tr><tr><th>Status</th><td>${escapeHTML(sc(r.status).l)}${r.actor ? " · by " + escapeHTML(r.actor) + " (" + escapeHTML(r.time || "") + ")" : ""}</td></tr>
    </tbody></table><div class="sig"><div>Requested by &amp; signature</div><div>Approved by &amp; signature</div></div>`, { camp: me?.camp, person: me?.name, mil: me?.mil, role: me?.role, extra: `${r.type} request` });
  return (<Page title="Approvals" subtitle="Transfer and store requests awaiting a decision." info="Approve or reject requests. Once actioned, a request locks to view-only so it can't be actioned twice; the audit trail records who decided and when. Use 'Request from Admin' to raise a fix/change with the administrator. Export any request to a signed PDF for physical records."
    action={<><ExportButton title="Transfer & store requests" build={() => ({ bodyHTML: `<table><thead><tr><th>Type</th><th>Item</th><th>Batch</th><th>Qty</th><th>From → To</th><th>By</th><th>Status</th></tr></thead><tbody>${reqs.map((r) => `<tr><td>${escapeHTML(r.type)}</td><td>${escapeHTML(r.item)}</td><td>${escapeHTML(r.batch)}</td><td>${r.qty}</td><td>${escapeHTML(r.from)} → ${escapeHTML(r.to)}</td><td>${escapeHTML(r.by)}</td><td>${escapeHTML(sc(r.status).l)}</td></tr>`).join("")}</tbody></table>`, text: `${reqs.length} request(s).` })} /><button onClick={() => setCompose(true)} style={btn(t, "ghost")}><Settings size={15} /> Request from Admin</button></>}>
    {(medReqs || []).filter((r) => r.stage === "mgmt_approve").length > 0 && <div style={{ marginBottom: 18 }}>
      <div style={{ ...ttl(t), marginBottom: 10 }}><Stethoscope size={16} color={t.accent} /> Item requests (medical & pharmacy)</div>
      <div style={{ display: "grid", gap: 12 }}>{(medReqs || []).filter((r) => r.stage === "mgmt_approve").map((r) => (
        <div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.warning, background: t.warningSoft, padding: "4px 12px", borderRadius: 20 }}>Awaiting approval</span></div>
          <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{r.source} <ArrowLeftRight size={12} /> {r.destCamp}</span><span>by {r.fromPharmacist ? "💊" : "🩺"} {r.by}</span><span>{r.time}</span></div>
          <div style={{ fontSize: 11.5, color: t.success, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}><ShieldCheck size={12} /> Stock confirmed by {r.srcActor || r.source}.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><button onClick={() => medAct(r, "approved")} style={btn(t)}><ThumbsUp size={15} /> Approve</button><button onClick={() => medAct(r, "declined")} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><ThumbsDown size={15} /> Decline</button></div>
          <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> Approving notifies {r.source === "Main store" ? "the store" : `the pharmacist at ${r.source}`} to fulfil it. First to act (you or the other manager) decides.</div>
        </div>))}</div>
    </div>}
    {(storeReqs || []).filter((r) => r.stage === "mgmt_approve").length > 0 && <div style={{ marginBottom: 18 }}>
      <div style={{ ...ttl(t), marginBottom: 10 }}><PackagePlus size={16} color={t.accent} /> Store demands (monthly / urgent)</div>
      <div style={{ display: "grid", gap: 12 }}>{(storeReqs || []).filter((r) => r.stage === "mgmt_approve").map((r) => { const urgent = r.type === "urgent";
        return (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${urgent ? t.danger : t.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: urgent ? t.danger : t.accent, background: urgent ? t.dangerSoft : t.primarySoft, padding: "2px 9px", borderRadius: 12 }}>{urgent ? <AlertTriangle size={11} /> : <CalendarDays size={11} />} {urgent ? "Urgent request" : "Monthly demand"}</span><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.camp}</span></div><span style={{ fontSize: 12, fontWeight: 700, color: t.warning, background: t.warningSoft, padding: "4px 12px", borderRadius: 20 }}>Awaiting approval</span></div>
          <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>{r.lines.length} item{r.lines.length > 1 ? "s" : ""} · by 💊 {r.by} · {r.time}</div>
          <div style={{ overflowX: "auto", marginTop: 10 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}><thead><tr style={{ background: t.head }}><th style={{ padding: "8px 10px", fontSize: 11, textAlign: "left", color: "#C6D6E8" }}>Medication</th><th style={{ padding: "8px 10px", fontSize: 11, textAlign: "right", color: "#C6D6E8" }}>Qty</th></tr></thead><tbody>{r.lines.map((l, i) => (<tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}><td style={{ padding: "7px 10px", fontSize: 13 }}>{l.item}</td><td style={{ padding: "7px 10px", fontSize: 13, textAlign: "right", fontWeight: 700 }}>{l.qty}</td></tr>))}</tbody></table></div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button onClick={() => storeAct(r, "approved")} style={btn(t)}><ThumbsUp size={15} /> Approve</button><button onClick={() => storeAct(r, "declined")} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><ThumbsDown size={15} /> Decline</button></div>
          <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> Approving sends it to the store to fulfil & dispatch. First to act decides.</div>
        </div>); })}</div>
    </div>}
    <div style={{ display: "grid", gap: 12 }}>{reqs.map((r) => { const s = sc(r.status), pending = r.status === "pending";
      return (<div key={r.id} style={card(t)}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: r.type === "Store" ? t.accent : t.primary, background: t.primarySoft, padding: "2px 8px", borderRadius: 12 }}>{r.type}</span><span style={{ fontSize: 15, fontWeight: 700 }}>{r.item}</span></div><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><button onClick={() => exportOne(r)} title="Export PDF" aria-label="Export PDF" style={{ ...miniBtn(t), width: 30, height: 30, color: t.primary }}><FileText size={14} /></button><span style={{ fontSize: 12, fontWeight: 700, color: s.fg, background: s.bg, padding: "4px 12px", borderRadius: 20 }}>{s.l}</span></span></div>
        <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span style={{ fontFamily: "monospace" }}>batch {r.batch}</span><span>{r.qty} units</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{r.from} <ArrowLeftRight size={12} /> {r.to}</span><span>by {r.by}</span></div>
        {pending ? (<div style={{ display: "flex", gap: 8, marginTop: 14 }}><button onClick={() => act(r.id, "approved")} style={btn(t)}><ThumbsUp size={15} /> Approve</button><button onClick={() => act(r.id, "rejected")} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><ThumbsDown size={15} /> Reject</button></div>) : (<div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, color: t.textMuted }}><Lock size={13} /> {s.l} by {r.actor} · {r.time} · locked to prevent double action</div>)}
      </div>); })}</div>
    {compose && <AdminReqModal initial={{ kind: "Change request", title: "", detail: "" }} toAdmin onClose={() => setCompose(false)} onSave={(r) => { notify("Requests", ["Admin"], `New ${r.kind.toLowerCase()} from ${role}: ${r.title}`); setCompose(false); }} />}
  </Page>);
}
function AdminReqModal({ initial, toAdmin, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ id: initial.id, kind: initial.kind || "Change request", title: initial.title || "", detail: initial.detail || "" });
  const v = f.title.trim() && f.detail.trim();
  const fld = { width: "100%", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={toAdmin ? "Request from Admin" : (f.id ? "Edit request" : "Add request item")} icon={Settings} onClose={onClose}>
    <label style={lab}>Type</label><select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })} style={{ ...fld, height: 42, marginBottom: 14 }}>{["Change request", "Fix", "Add", "Edit"].map((k) => <option key={k}>{k}</option>)}</select>
    <label style={lab}>Title</label><input value={f.title} autoFocus onChange={(e) => setF({ ...f, title: e.target.value })} style={{ ...fld, height: 42, marginBottom: 14 }} placeholder="Short summary" />
    <label style={lab}>Detail</label><textarea value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} rows={4} style={{ ...fld, marginBottom: 18, resize: "vertical" }} placeholder="What needs to be fixed, added or changed?" />
    <button onClick={() => onSave(f)} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Send size={16} /> {toAdmin ? "Send to Admin" : (f.id ? "Save changes" : "Add request")}</button>
  </Modal>);
}

/* ================= USERS ================= */
const USER_SEED = [
  { id: 1, name: "Capt. Hassan Al-Kuwari", role: "Admin", camp: "Doha HQ", license: "PH-10293", phone: "+974 5500 1122", status: "active" },
  { id: 2, name: "M. Obaidly", role: "Management", camp: "Doha HQ", license: "PH-19002", phone: "+974 5500 2211", status: "active" },
  { id: 3, name: "Dalia & Asmaa", role: "Sub-Manager", camp: "Tariq Camp", license: "PH-20481", phone: "+974 5500 3344", status: "active" },
  { id: 4, name: "Shayma'a", role: "Inspector", camp: "Mid zone", license: "PH-41200", phone: "+974 5500 4040", status: "active" },
  { id: 5, name: "Yaqeen", role: "Pharmacist", camp: "Al-Udeid Clinic", license: "PH-33910", phone: "+974 5500 5566", status: "active" },
  { id: 6, name: "Dr. Al-Thani", role: "Medical", profession: "Doctor", camp: "Al-Rayyan Field Clinic", license: "MD-88410", phone: "+974 5500 9900", status: "active" },
  { id: 7, name: "Nawras", role: "Pharmacist", camp: "Store", storeRole: "Store Lead", license: "ST-70021", phone: "+974 5501 6677", status: "active" },
  { id: 8, name: "H. Nasser", role: "Pharmacist", camp: "Store", storeRole: "Store Pharmacist", license: "ST-70044", phone: "+974 5501 7788", status: "active" },
];
function UsersScreen({ canAllocate, canApproveUsers, adderRole, canViewProfiles }) {
  const t = useT(); const { camps, campZones, addCamp, removeCamp, notify, users, setUsers } = useApp(); const [campModal, setCampModal] = useState(false); const [viewing, setViewing] = useState(null); const [editing, setEditing] = useState(null); const [adding, setAdding] = useState(false);
  const toggle = (id) => setUsers((p) => p.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "disconnected" : "active" } : u));
  const setCamp = (id, camp) => setUsers((p) => p.map((u) => { if (u.id !== id) return u;
    if (camp === "Store") { notify("Store", ["Pharmacist"], `📍 ${u.name}'s location changed to the Main store (Store Pharmacist). They now appear in the store team and sign-in.`); return { ...u, camp, storeRole: u.storeRole || "Store Pharmacist" }; }
    notify("Camp change", [u.role], `📍 ${u.name} re-allocated to ${camp}.${u.camp === "Store" ? " Removed from the Main store." : ""} Previous records remain on the site for the next staff.`); return { ...u, camp, storeRole: undefined }; }));
  const saveEdit = (next) => { setUsers((p) => p.map((u) => u.id === next.id ? next : u)); notify("Camp change", [next.role], `📱 SMS sent to ${next.phone}: your profile details were updated by an administrator (name, license or contact). The change now applies across Khazeen.`); setEditing(null); };
  const addUser = (u) => { const pending = adderRole === "Sub-Manager"; const nu = { ...u, id: Date.now(), status: pending ? "pending" : "active", addedBy: adderRole }; setUsers((p) => [...p, nu]);
    if (pending) notify("Users", ["Management"], `🕒 New ${u.role} "${u.name}" (${u.camp}) added by Sub-management — awaiting your approval.`);
    else notify("Camp change", [u.role], `New ${u.role}${u.profession ? ` (${u.profession})` : ""} account created: ${u.name}, allocated to ${u.camp}.`);
    setAdding(false); };
  const approveUser = (id) => setUsers((p) => p.map((u) => { if (u.id !== id) return u; notify("Camp change", [u.role], `Your ${u.role} account (${u.name}, ${u.camp}) was approved and is now active.`); return { ...u, status: "active" }; }));
  const rejectUser = (id) => setUsers((p) => p.filter((u) => u.id !== id));
  const pendingUsers = users.filter((u) => u.status === "pending");
  const roleLabel = (u) => u.role === "Medical" ? (u.profession || "Medical") : u.role;
  const th = { padding: "11px 12px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "left", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "10px 12px", fontSize: 13, textAlign: "left", borderBottom: `1px solid ${t.border}` };
  return (<Page title="Users" subtitle={canAllocate ? "Add roles, allocate users to camps, and manage access." : "Staff directory."}
    info="Management/Admin/Sub-Manager add roles (Store, Pharmacist or Medical — Medical also carries a profession such as Doctor or Nurse), allocate users to a camp/clinic, and connect or disconnect access. Re-allocating notifies the user — records stay on the camp/store so the next allocated user continues the workflow."
    action={<><ExportButton title="Users directory" build={() => ({ bodyHTML: `<table><thead><tr><th>Name</th><th>Role</th><th>Camp/clinic</th><th>License</th><th>Access</th></tr></thead><tbody>${users.map((u) => `<tr><td>${escapeHTML(u.name)}</td><td>${escapeHTML(roleLabel(u))}${u.role === "Medical" ? " (Medical viewer)" : ""}</td><td>${escapeHTML(u.camp)}</td><td>${escapeHTML(u.license)}</td><td>${u.status === "active" ? "Connected" : "Disconnected"}</td></tr>`).join("")}</tbody></table>`, text: `${users.length} user(s).` })} />{canAllocate && <button onClick={() => setCampModal(true)} style={btn(t, "ghost")}><Building2 size={15} /> Manage camps</button>}{canAllocate && <button onClick={() => setAdding(true)} style={btn(t)}><Plus size={15} /> Add role</button>}</>}>
    {canApproveUsers && pendingUsers.length > 0 && <div style={{ marginBottom: 16, background: t.surface, border: `1px solid ${t.warning}`, borderRadius: 14, padding: 16 }}>
      <div style={{ ...ttl(t), marginBottom: 10 }}><Clock size={16} color={t.warning} /> Pending approval — added by Sub-management ({pendingUsers.length})</div>
      <div style={{ display: "grid", gap: 8 }}>{pendingUsers.map((u) => (<div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", background: t.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><RoleGlyph role={u.role} size={30} /><div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{roleLabel(u)} · {u.camp} · {u.license || "no license"}</div></div></div>
        <div style={{ display: "flex", gap: 8 }}><button onClick={() => approveUser(u.id)} style={{ ...btn(t), height: 34, fontSize: 12.5 }}><Check size={14} /> Approve</button><button onClick={() => rejectUser(u.id)} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12.5, color: t.danger, borderColor: t.danger + "55" }}><X size={14} /> Reject</button></div>
      </div>))}</div>
    </div>}
    {adderRole === "Sub-Manager" && pendingUsers.length > 0 && <div style={{ marginBottom: 16, background: t.warningSoft, borderRadius: 12, padding: "10px 14px", fontSize: 12.5, color: t.warning, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Clock size={14} /> {pendingUsers.length} user(s) you added are awaiting Management approval before they go active.</div>}
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
        <thead><tr style={{ background: t.head }}><th style={th}>Name</th><th style={{ ...th, textAlign: "center" }}>Profile</th><th style={th}>Role</th><th style={th}>Camp / clinic</th><th style={th}>Zone</th><th style={th}>License</th><th style={{ ...th, textAlign: "right" }}>Access</th>{canViewProfiles && <th style={{ ...th, textAlign: "right" }}></th>}</tr></thead>
        <tbody>{(() => {
          const colCount = canViewProfiles ? 8 : 7;
          const renderRow = (u, i) => (<tr key={u.id} style={{ background: i % 2 ? t.zebra : t.surface }}>
            <td style={{ ...td, fontWeight: 600 }}>{canAllocate ? <button onClick={() => setEditing(u)} className="khz-name-edit" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: t.text, font: "inherit", fontWeight: 600, cursor: "pointer", padding: 0 }}>{u.name} <Pencil size={12} color={t.textMuted} style={{ opacity: 0.55 }} /></button> : u.name}</td>
            <td style={{ ...td, textAlign: "center" }}><span style={{ display: "inline-flex" }}><RoleGlyph role={u.role} size={32} title={`${roleLabel(u)} — ${ROLE[u.role]?.sub}`} /></span></td>
            <td style={td}><div style={{ fontWeight: 600 }}>{u.camp === "Store" ? (u.storeRole || "Store Pharmacist") : roleLabel(u)}</div>{u.role === "Medical" && <div style={{ fontSize: 11, color: t.textMuted }}>Medical (viewer)</div>}</td>
            <td style={td}>{canAllocate && u.role !== "Inspector" ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><select value={u.camp} onChange={(e) => setCamp(u.id, e.target.value)} style={{ height: 30, borderRadius: 7, fontSize: 12.5, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 6px", fontWeight: 600 }}>{camps.map((c) => <option key={c}>{c}</option>)}{u.role === "Pharmacist" && <option value="Store">Store</option>}</select>{u.camp === "Store" && u.storeRole && <span style={{ fontSize: 10, fontWeight: 700, color: u.storeRole === "Store Lead" ? t.primary : t.accent, background: t.primarySoft, padding: "2px 7px", borderRadius: 12, whiteSpace: "nowrap" }}>{u.storeRole === "Store Lead" ? "Lead" : "Pharm"}</span>}</span> : <span style={{ color: t.textMuted, display: "inline-flex", alignItems: "center", gap: 5 }}>{u.camp === "Store" && <Warehouse size={12} />}{u.camp}</span>}</td>
            <td style={{ ...td, color: t.textMuted, fontSize: 12 }}>{u.camp === "Store" ? "Main store" : (campZones[u.camp] || (u.camp.includes("zone") ? u.camp.replace(" zone", "") : "—"))}</td>
            <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{u.license}</td>
            <td style={{ ...td, textAlign: "right" }}>{u.status === "pending" ? <span style={{ fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px", color: t.warning, background: t.warningSoft }}>Pending</span> : <button onClick={() => canAllocate && toggle(u.id)} disabled={!canAllocate} style={{ fontSize: 12, fontWeight: 700, cursor: canAllocate ? "pointer" : "default", border: "none", borderRadius: 20, padding: "4px 12px", color: u.status === "active" ? t.success : t.danger, background: u.status === "active" ? t.successSoft : t.dangerSoft }}>{u.status === "active" ? "Connected" : "Disconnected"}</button>}</td>
            {canViewProfiles && <td style={{ ...td, textAlign: "right" }}><button onClick={() => setViewing(u)} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12 }}><UserCircle size={13} /> Profile</button></td>}
          </tr>);
          const rank = (u) => {
            if (u.role === "Admin") return 0;
            if (u.role === "Management") return 1;
            if (u.role === "Sub-Manager") return 2;
            if (u.camp === "Store" && u.storeRole === "Store Lead") return 3;
            if (u.role === "Inspector") return 4;
            if (u.camp === "Store") return 5; // store pharmacists right after inspector
            return 6; // camp pharmacists, medical, etc.
          };
          return [...users].sort((a, b) => rank(a) - rank(b)).map((u, i) => renderRow(u, i));
        })()}</tbody>
      </table>
    </div></div>
    {!canAllocate && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted, marginTop: 12 }}><Lock size={13} /> Adding roles, camp allocation and access changes are reserved for management.</div>}
    {campModal && <CampModal camps={camps} campZones={campZones} addCamp={addCamp} removeCamp={removeCamp} onClose={() => setCampModal(false)} />}
    {viewing && <ViewProfileModal u={viewing} onClose={() => setViewing(null)} />}
    {editing && <EditUserModal u={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}
    {adding && <AddRoleModal camps={camps} onClose={() => setAdding(false)} onSave={addUser} />}
  </Page>);
}
function AddRoleModal({ camps, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ category: "", profession: "Doctor", name: "", camp: camps[0] || "", license: "", phone: "" });
  const cats = [{ key: "Pharmacist", label: "Pharmacist", desc: "Camp/clinic dispensing — or set location to Store", icon: Pill }, { key: "Medical", label: "Medical", desc: "Clinical viewer — Doctor, Nurse, etc.", icon: Stethoscope }];
  const isMed = f.category === "Medical";
  const camp = f.camp;
  const v = f.category && f.name.trim() && camp && (!isMed || f.profession);
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const save = () => onSave({ role: f.category, profession: isMed ? f.profession : undefined, name: f.name.trim(), camp, storeRole: camp === "Store" ? "Store Pharmacist" : undefined, license: f.license.trim() || "—", phone: f.phone.trim() || "—" });
  return (<Modal title="Add role" icon={Plus} onClose={onClose} width={520}>
    <label style={lab}>Category</label>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>{cats.map((c) => { const on = f.category === c.key; const Icon = c.icon;
      return (<button key={c.key} onClick={() => setF({ ...f, category: c.key })} style={{ padding: "14px 10px", borderRadius: 11, border: `1px solid ${on ? t.primary : t.border}`, background: on ? t.primarySoft : t.surface, cursor: "pointer", textAlign: "center", display: "grid", placeItems: "center", gap: 6 }}>
        <span style={{ width: 38, height: 38, borderRadius: "50%", background: on ? t.surface : t.surfaceAlt, display: "grid", placeItems: "center" }}><Icon size={18} color={on ? t.primary : t.textMuted} /></span>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{c.label}</span><span style={{ fontSize: 10.5, color: t.textMuted, lineHeight: 1.3 }}>{c.desc}</span></button>); })}</div>
    {isMed && (<><label style={lab}>Medical profession</label><select value={f.profession} onChange={(e) => setF({ ...f, profession: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{MEDICAL_PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select></>)}
    <label style={lab}>Full name</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={{ ...fld, marginBottom: 14 }} placeholder="e.g. Dr. S. Al-Marri" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>{f.category === "Pharmacist" ? "Allocate to" : "Allocated camp / clinic"}</label><select value={f.camp} onChange={(e) => setF({ ...f, camp: e.target.value })} style={fld}>{camps.map((c) => <option key={c}>{c}</option>)}{f.category === "Pharmacist" && <option value="Store">Store (store pharmacist)</option>}</select></div>
      <div><label style={lab}>License no.</label><input value={f.license} onChange={(e) => setF({ ...f, license: e.target.value })} style={fld} placeholder="optional" /></div>
    </div>
    <label style={lab}>Phone (for SMS)</label><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} style={{ ...fld, marginBottom: 18 }} placeholder="+974 …" />
    <button onClick={save} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Plus size={16} /> Create {isMed ? `${f.profession} (Medical)` : (f.category || "role")}</button>
  </Modal>);
}
function ViewProfileModal({ u, onClose }) {
  const t = useT(); const { campZones } = useApp();
  const row = (l, v) => (<div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${t.border}`, fontSize: 13 }}><span style={{ color: t.textMuted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>);
  return (<Modal title="Staff profile" icon={UserCircle} onClose={onClose}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}><RoleGlyph role={u.role} size={60} /><div><div style={{ fontSize: 17, fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 12.5, color: t.textMuted }}>{u.role === "Medical" ? `${u.profession || "Medical"} · Medical (viewer)` : `${u.role} · ${ROLE[u.role].sub}`}</div></div></div>
    {u.role === "Medical" && row("Profession", u.profession || "—")}{row("Camp / clinic", u.camp)}{row("Zone", campZones[u.camp] || "—")}{row("License", u.license)}{row("Phone", u.phone)}{row("Access", u.status === "active" ? "Connected" : "Disconnected")}
    <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 14, display: "flex", gap: 6 }}><Info size={13} /> License & certificate documents are attached on the user's own Profile page.</div>
  </Modal>);
}
function EditUserModal({ u, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ ...u });
  const v = f.name.trim();
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="Edit user" icon={Pencil} onClose={onClose}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><RoleGlyph role={u.role} size={44} /><div><div style={{ fontSize: 14, fontWeight: 700 }}>{u.role === "Medical" ? (f.profession || "Medical") : u.role}</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{u.role === "Medical" ? "Medical (viewer)" : ROLE[u.role].sub}</div></div></div>
    <label style={lab}>Name</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={{ ...fld, marginBottom: 14 }} />
    {u.role === "Medical" && (<><label style={lab}>Medical profession</label><select value={f.profession || "Doctor"} onChange={(e) => setF({ ...f, profession: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{MEDICAL_PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select></>)}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>License</label><input value={f.license} onChange={(e) => setF({ ...f, license: e.target.value })} style={fld} /></div>
      <div><label style={lab}>Phone (for SMS)</label><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} style={fld} /></div>
    </div>
    <div style={{ fontSize: 11.5, color: t.textMuted, marginBottom: 16, display: "flex", gap: 6 }}><Smartphone size={13} style={{ flexShrink: 0, marginTop: 1 }} /> Saving applies this change across Khazeen and sends an SMS to {f.phone || "the user"} notifying them of the edit.</div>
    <button onClick={() => onSave({ ...f, name: f.name.trim() })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> Save & notify by SMS</button>
  </Modal>);
}
function CampModal({ camps, campZones, addCamp, removeCamp, onClose }) {
  const t = useT(); const [name, setName] = useState(""); const [zone, setZone] = useState("Mid");
  return (<Modal title="Camps & clinics" icon={Building2} onClose={onClose}>
    <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>{camps.map((c) => (<div key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 9, background: t.surfaceAlt }}><span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}><MapPin size={14} color={t.primary} /> {c} <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400 }}>· {campZones[c]} zone</span></span><button onClick={() => removeCamp(c)} aria-label="Remove" style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", display: "grid", placeItems: "center", color: t.danger }}><Trash2 size={13} /></button></div>))}</div>
    <div style={{ display: "flex", gap: 8 }}><input value={name} autoFocus onChange={(e) => setName(e.target.value)} placeholder="New camp / clinic name" style={{ flex: 1, height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none" }} /><select value={zone} onChange={(e) => setZone(e.target.value)} style={{ height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13, padding: "0 10px", fontWeight: 600 }}>{ZONES.map((z) => <option key={z}>{z}</option>)}</select><button onClick={() => { if (name.trim()) { addCamp(name.trim(), zone); setName(""); } }} style={btn(t)}><Plus size={15} /></button></div>
  </Modal>);
}

/* ================= STORE (large-scale main store) ================= */
const STORE_ALERT_SEED = [
  { id: 1, kind: "Task", title: "Task from Store Lead", body: "Count carton stock for Augmentin 1000mg — due today.", time: "Today 08:30", status: "new" },
  { id: 2, kind: "Request", title: "Request from Sub-Manager", body: "Prepare 2,000 units of Paracetamol for Tariq Camp's monthly demand.", time: "Today 08:05", status: "new" },
  { id: 3, kind: "Location", title: "Team change", body: "H. Nasser's location was set to the Main store (Store Pharmacist).", time: "Today 07:50", status: "new" },
  { id: 4, kind: "Expiry", title: "Insulin Glargine nearing expiry", body: "Cold box INS-MS-09 expires in 38 days — prioritise dispatch or redistribute.", time: "Today 07:20", status: "new" },
  { id: 5, kind: "License", title: "License expiry reminder", body: "A store pharmacist's license expires in 30 days — renew via MOPH.", time: "Yesterday", status: "new" },
  { id: 6, kind: "Approval", title: "Request approved by Lead", body: "Your request to dispatch 30 insulin pens to Al-Rayyan was approved.", time: "Yesterday", status: "new" },
  { id: 7, kind: "Request", title: "Update from Management", body: "Prepare the October bulk order by the 25th.", time: "Yesterday", status: "new" },
];
const STORE_STOCK_SEED = [
  { code: "1230", name: "Paracetamol 500mg", batch: "PAR-MS-01", expiry: "2027-05-30", packSize: 1000, packs: 12, reorder: 4, unit: "cartons", by: "Nawras", at: "08:20" },
  { code: "1235", name: "Augmentin 1000mg", batch: "AUG-MS-04", expiry: "2026-12-01", packSize: 200, packs: 17, reorder: 6, unit: "cartons", by: "H. Nasser", at: "08:55" },
  { code: "1700", name: "Insulin Glargine", batch: "INS-MS-09", expiry: "2026-10-12", packSize: 40, packs: 16, reorder: 10, unit: "cold boxes", by: "Nawras", at: "09:40" },
  { code: "1450", name: "Ceftriaxone 1g", batch: "CEF-MS-22", expiry: "2027-02-18", packSize: 50, packs: 36, reorder: 8, unit: "cartons", by: "L. Ibrahim", at: "10:15" },
  { code: "1310", name: "Metformin 850mg", batch: "MET-MS-13", expiry: "2027-08-09", packSize: 500, packs: 5, reorder: 6, unit: "cartons", by: "H. Nasser", at: "11:30" },
];
const STORE_INCOMING_SEED = [
  { id: 1, type: "Urgent", item: "Insulin Glargine", qty: 30, to: "Al-Rayyan Field Clinic", by: "💊 Yaqeen", status: "new", notes: [] },
  { id: 2, type: "Monthly demand", item: "Augmentin 1000mg", qty: 2000, to: "Tariq Camp", by: "📋 Dalia & Asmaa", status: "forwarded", notes: ["Forwarded to 🏛️ management & 📋 Sub-Manager"] },
  { id: 3, type: "Request", item: "Paracetamol 500mg", qty: 500, to: "Doha HQ", by: "💊 S. Hassan", status: "approved", notes: ["Forwarded for approval", "Approved by 🏛️ management"] },
  { id: 4, type: "Request", item: "Ceftriaxone 1g", qty: 300, to: "Al-Udeid Clinic", by: "💊 Hassan Al-Kuwari", status: "dispatched", notes: ["Approved by 📋 Sub-Manager", "Dispatched by store"] },
];
const STORE_TASKS_SEED = [
  { id: 1, title: "Count carton stock for Augmentin 1000mg", assignedBy: "Store lead", assignee: "H. Nasser", due: "Today", done: false },
  { id: 2, title: "Verify cold-box temperature log for insulin", assignedBy: "Store lead", assignee: "H. Nasser", due: "Today", done: true },
  { id: 3, title: "Restock picking shelf — Paracetamol", assignedBy: "Store lead", assignee: "All store pharmacists", due: "Tomorrow", done: false },
  { id: 4, title: "Reconcile dispatch notes for the week", assignedBy: "Management", assignee: "All store pharmacists", due: "Thu", done: false },
];
const STORE_PHARM_SEED = [
  { id: 1, name: "Nawras", staffId: "ST-70021", role: "Store Lead" },
  { id: 2, name: "H. Nasser", staffId: "ST-70044", role: "Store Pharmacist" },
  { id: 3, name: "L. Ibrahim", staffId: "ST-70058", role: "Store Pharmacist" },
];
/* Entry gate: pick Store Lead or Store Pharmacist profile before the store opens */
function StoreGate({ canManageTeam, userName }) {
  const t = useT(); const { users, setUsers, notify } = useApp(); const [profile, setProfile] = useState(null); const [picking, setPicking] = useState(false);
  // store team = pharmacists whose location is Store; designation stored on storeRole
  const team = users.filter((u) => u.role === "Pharmacist" && u.camp === "Store").map((u) => ({ id: u.id, name: u.name, staffId: u.license || "—", role: u.storeRole || "Store Pharmacist" }));
  if (profile) return <StoreScreen profile={profile} userName={userName} canManageTeam={canManageTeam || profile === "Store Lead"} team={team} onSwitch={() => setProfile(null)} />;
  const pharmacists = team.filter((m) => m.role === "Store Pharmacist");
  const leads = team.filter((m) => m.role === "Store Lead");
  const lead = leads[0];
  const candidates = users.filter((u) => u.role === "Pharmacist" && u.camp !== "Store");
  const roleIcon = (role, size = 26) => role === "Store Lead" ? <ShieldCheck size={size} color={t.primary} /> : <ClipboardList size={size} color={t.accent} />;
  const Card = ({ kind, who, sub }) => (<button onClick={() => setProfile(kind)} style={{ ...card(t), cursor: "pointer", textAlign: "center", padding: 24 }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.surfaceAlt, display: "grid", placeItems: "center", margin: "0 auto 12px" }}>{roleIcon(kind, 30)}</div>
    <div style={{ fontSize: 16, fontWeight: 700 }}>{kind}</div><div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 3 }}>{who}</div><div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>{sub}</div>
  </button>);
  const addExisting = (userId, designation) => { const u = users.find((x) => x.id === userId); setUsers((p) => p.map((x) => x.id === userId ? { ...x, camp: "Store", storeRole: designation } : x)); if (u) notify("Store", ["Pharmacist"], `${u.name} added to the Main store as ${designation}.`); setPicking(false); };
  const setDesignation = (id, designation) => setUsers((p) => p.map((u) => u.id === id ? { ...u, storeRole: designation } : u));
  const removeMember = (id) => setUsers((p) => p.map((u) => u.id === id ? { ...u, camp: ALLOCATED.Pharmacist || "Doha HQ", storeRole: undefined } : u));
  return (<Page title="Main store — sign in" subtitle="Choose your store profile to continue."
    info="The main store team is made up of pharmacists whose location is Store. Add a pharmacist from the Users directory and mark them Store Lead or Store Pharmacist (several leads are allowed). Designation is set here; location can be set here or in Users."
    action={canManageTeam && <button onClick={() => setPicking(true)} style={btn(t)}><Plus size={15} /> Add store member</button>}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 620 }}>
      <Card kind="Store Lead" who={leads.length ? leads.map((l) => l.name).join(", ") : "—"} sub="Full store control · assigns tasks · manages team" />
      <Card kind="Store Pharmacist" who={`${pharmacists.length} record keeper${pharmacists.length === 1 ? "" : "s"}`} sub="Record keeping · stock · request actions · tasks" />
    </div>
    <div style={{ ...card(t), marginTop: 16, maxWidth: 620 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><p style={ttl(t)}><Users size={16} color={t.primary} /> Store team</p>{canManageTeam && <button onClick={() => setPicking(true)} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12 }}><Plus size={13} /> Add from Users</button>}</div>
      <div style={{ display: "grid", gap: 8 }}>{team.length === 0 ? <div style={{ fontSize: 13, color: t.textMuted, padding: "8px 2px" }}>No one is allocated to the store yet. Add a pharmacist from the Users directory, or set a pharmacist's location to Store in the Users screen.</div> : team.map((m) => (<div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 9, background: t.surfaceAlt }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 34, height: 34, borderRadius: "50%", background: t.surface, display: "grid", placeItems: "center" }}>{roleIcon(m.role, 17)}</span><div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11.5, color: t.textMuted, fontFamily: "monospace" }}>{m.staffId}</div></div></div>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{canManageTeam
          ? <select value={m.role} onChange={(e) => setDesignation(m.id, e.target.value)} style={{ height: 30, borderRadius: 16, border: `1px solid ${t.border}`, background: t.surface, color: m.role === "Store Lead" ? t.primary : t.accent, fontWeight: 700, fontSize: 11, padding: "0 8px" }}>{["Store Lead", "Store Pharmacist"].map((r) => <option key={r}>{r}</option>)}</select>
          : <span style={{ fontSize: 11, fontWeight: 700, color: m.role === "Store Lead" ? t.primary : t.accent, background: t.primarySoft, padding: "3px 10px", borderRadius: 20 }}>{m.role}</span>}
          {canManageTeam && <button onClick={() => removeMember(m.id)} aria-label="Remove from store" title="Remove from store" style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", display: "grid", placeItems: "center", color: t.danger }}><Trash2 size={12} /></button>}</span>
      </div>))}</div>
      {!canManageTeam && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted, marginTop: 12 }}><Lock size={13} /> Adding or editing store members is done by the store lead, management or Sub-Manager.</div>}
    </div>
    {picking && <StorePickModal candidates={candidates} onClose={() => setPicking(false)} onAdd={addExisting} />}
  </Page>);
}
function StorePickModal({ candidates, onClose, onAdd }) {
  const t = useT(); const [sel, setSel] = useState(null); const [designation, setDesignation] = useState("Store Pharmacist");
  return (<Modal title="Add store member" icon={Plus} onClose={onClose} width={520}>
    <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14 }}>Pick a pharmacist from the Users directory and choose their store designation. This sets their location to Store.</div>
    <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 6, display: "block" }}>Pharmacist</label>
    {candidates.length === 0 ? <div style={{ fontSize: 13, color: t.textMuted, padding: "10px 0 16px" }}>All pharmacists are already in the store. Create more in the Users screen.</div>
      : <div style={{ display: "grid", gap: 8, marginBottom: 16, maxHeight: 220, overflowY: "auto" }}>{candidates.map((u) => { const on = sel === u.id;
        return (<button key={u.id} onClick={() => setSel(u.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${on ? t.primary : t.border}`, background: on ? t.primarySoft : t.surface, cursor: "pointer", textAlign: "left" }}>
          <RoleGlyph role="Pharmacist" size={30} /><div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{u.camp} · {u.license}</div></div>{on && <Check size={16} color={t.primary} />}</button>); })}</div>}
    <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 6, display: "block" }}>Designation</label>
    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>{["Store Lead", "Store Pharmacist"].map((r) => { const on = designation === r;
      return (<button key={r} onClick={() => setDesignation(r)} style={{ flex: 1, height: 44, borderRadius: 10, border: `1px solid ${on ? t.primary : t.border}`, background: on ? t.primarySoft : t.surface, color: t.text, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{r === "Store Lead" ? <ShieldCheck size={15} /> : <ClipboardList size={15} />} {r}</button>); })}</div>
    <button onClick={() => sel && onAdd(sel, designation)} disabled={!sel} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: sel ? 1 : 0.5 }}><Plus size={16} /> Add to store</button>
  </Modal>);
}
function StoreScreen({ profile, userName, canManageTeam, team, setTeam, onSwitch }) {
  const t = useT(); const [stock, setStock] = useState(STORE_STOCK_SEED); const [incoming, setIncoming] = useState(STORE_INCOMING_SEED);
  const [add, setAdd] = useState(false); const [toast, setToast] = useState(null);
  const isLead = profile === "Store Lead";
  const [alerts, setAlerts] = useState(STORE_ALERT_SEED); const [forwardFor, setForwardFor] = useState(null);
  const nowT = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const setPacks = (code, v) => setStock((p) => p.map((s) => s.code === code ? { ...s, packs: Math.max(0, Number(v) || 0), by: userName, at: nowT() } : s));
  const totalUnits = (s) => s.packs * s.packSize;
  const lowCount = stock.filter((s) => s.packs <= s.reorder).length;
  const grandUnits = stock.reduce((a, s) => a + totalUnits(s), 0);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const act = (id, action) => setIncoming((p) => p.map((r) => { if (r.id !== id) return r;
    if (action === "forward") { flash(`Forwarded to 🏛️ management & 📋 Sub-Manager · ${r.by} notified`); return { ...r, status: "forwarded", notes: [...r.notes, `Forwarded for approval by ${userName}`] }; }
    if (action === "reject") { flash(`Rejected · ${r.by} notified`); return { ...r, status: "rejected", notes: [...r.notes, `Rejected by ${userName}`] }; }
    if (action === "dispatch") { flash(`Dispatched to ${r.to} · ${r.by} notified`); return { ...r, status: "dispatched", notes: [...r.notes, `Dispatched by ${userName}`] }; }
    return r; }));
  const alertAct = (id, action, target) => { const a = alerts.find((x) => x.id === id);
    if (action === "all") { flash(`"${a.title}" sent to all store pharmacists`); setAlerts((p) => p.map((x) => x.id === id ? { ...x, status: "forwarded", to: "all pharmacists" } : x)); }
    else if (action === "one" && target) { flash(`"${a.title}" sent to ${target}`); setAlerts((p) => p.map((x) => x.id === id ? { ...x, status: "forwarded", to: target } : x)); }
    else if (action === "later") { flash("Reminder set — you'll be alerted again later"); setAlerts((p) => p.map((x) => x.id === id ? { ...x, status: "later" } : x)); }
    else if (action === "close") setAlerts((p) => p.map((x) => x.id === id ? { ...x, status: "closed" } : x));
    else if (action === "read") setAlerts((p) => p.map((x) => x.id === id ? { ...x, status: "read" } : x));
    setForwardFor(null);
  };
  const liveAlerts = alerts.filter((a) => !["closed"].includes(a.status));
  const sc = (s) => ({ new: { fg: t.warning, l: "New — review" }, forwarded: { fg: t.cold, l: "Awaiting approval" }, approved: { fg: t.success, l: "Approved — to dispatch" }, dispatched: { fg: t.primary, l: "Dispatched" }, rejected: { fg: t.danger, l: "Rejected" } }[s]);
  const tc = (type) => type === "Urgent" ? { fg: t.danger, bg: t.dangerSoft } : type === "Monthly demand" ? { fg: t.accent, bg: t.primarySoft } : { fg: t.primary, bg: t.primarySoft };
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const open = incoming.filter((r) => !["dispatched", "rejected"].includes(r.status));
  return (<Page title="Main store" subtitle={`Signed in as ${profile} · large-scale bulk stock and the camp-request action queue.`}
    info="Bulk quantities in cartons / cold boxes (pack size × packs = total units); items at/below reorder flag. The store reviews each incoming request and acts — forwarding it to management & Sub-Manager for approval (which notifies the requester), then dispatching once approved. Every status change notifies the involved roles."
    action={<><ExportButton title="Main store — bulk stock" build={() => ({ bodyHTML: `<table><thead><tr><th>Code</th><th>Medication</th><th>Batch</th><th>Pack size</th><th>Packs</th><th>Total units</th><th>Unit</th></tr></thead><tbody>${stock.map((s) => `<tr><td>${escapeHTML(s.code)}</td><td>${escapeHTML(s.name)}</td><td>${escapeHTML(s.batch)}</td><td>${s.packSize}</td><td>${s.packs}</td><td>${(s.packSize * s.packs).toLocaleString()}</td><td>${escapeHTML(s.unit)}</td></tr>`).join("")}</tbody></table>`, text: `${stock.length} bulk line(s) in the main store.` })} /><span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 12px", borderRadius: 9, background: t.surfaceAlt, fontSize: 12.5, fontWeight: 600, color: t.textMuted }}>{profile === "Store Lead" ? "🧑‍⚕️" : "📦"} {profile}</span><button onClick={onSwitch} style={btn(t, "ghost")}>Switch profile</button><UploadConfirm label="Photo count" hint="Attach a photo of the stock; confirm the item, unit and pack count to record it." fields={[{ key: "name", label: "Medication" }, { key: "unit", label: "Unit", placeholder: "cartons / cold boxes" }, { key: "packs", label: "Packs counted", type: "number" }, { key: "packSize", label: "Pack size", type: "number" }]} onConfirm={(v) => setStock((p) => [...p, { code: "—", name: v.name, batch: "PHOTO-" + Date.now().toString().slice(-4), expiry: "2027-12-31", packSize: Number(v.packSize) || 1, packs: Number(v.packs) || 0, reorder: 4, unit: v.unit || "cartons", by: userName, at: nowT() }])} /><button onClick={() => setAdd(true)} style={btn(t)}><Plus size={15} /> Add bulk item</button></>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
      <Metric label="Bulk lines" value={stock.length} tone="primary" />
      <Metric label="Total units held" value={grandUnits.toLocaleString()} tone="accent" info="Sum of packs × pack size across all bulk lines." />
      <Metric label="At/below reorder" value={lowCount} tone="warning" info="Bulk lines whose pack count has reached the reorder level." />
      <Metric label="Open requests" value={open.length} tone="success" />
    </div>
    {/* store notifications — lead acts, pharmacists acknowledge */}
    {liveAlerts.length > 0 && (<div style={{ ...card(t), marginBottom: 16 }}>
      <p style={{ ...ttl(t), marginBottom: 12 }}><Bell size={17} color={t.gold} /> Store notifications <InfoDot text={isLead ? "Tasks and requests from the Lead, Management or Sub-Manager, plus location, expiry, license and request-approval alerts. As Store Lead you can send each to all pharmacists, choose one, snooze, or close it." : "Tasks and requests from the Lead, Management or Sub-Manager, plus location, expiry, license and approval alerts. Mark as read or snooze to be reminded later."} /></p>
      <div style={{ display: "grid", gap: 10 }}>{liveAlerts.map((a) => { const k = NOTIF_KINDS[a.kind] || {}; const Icon = k.icon || Bell; const fg = t[k.fg] || t.primary;
        return (<div key={a.id} style={{ padding: "12px 14px", borderRadius: 10, background: a.status === "read" || a.status === "forwarded" ? t.surface : t.surfaceAlt, border: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={roundIcon(t, fg + "1A")}><Icon size={17} color={fg} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ fontSize: 10.5, fontWeight: 700, color: fg }}>{a.kind}</span><span style={{ fontSize: 11, color: t.textMuted }}>{a.time}</span>{a.status === "forwarded" && <span style={{ fontSize: 10.5, fontWeight: 700, color: t.success, background: t.successSoft, padding: "1px 8px", borderRadius: 12 }}>Sent to {a.to}</span>}{a.status === "later" && <span style={{ fontSize: 10.5, fontWeight: 700, color: t.warning, background: t.warningSoft, padding: "1px 8px", borderRadius: 12 }}>Snoozed</span>}{a.status === "read" && <span style={{ fontSize: 10.5, fontWeight: 600, color: t.textMuted }}>Read</span>}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{a.title}</div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 2 }}>{a.body}</div>
              {a.status !== "forwarded" && a.status !== "read" && (<div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                {isLead ? (<>
                  <button onClick={() => alertAct(a.id, "all")} style={{ ...btn(t), height: 30, fontSize: 12 }}><Users size={13} /> Send to all pharmacists</button>
                  <button onClick={() => setForwardFor(a.id)} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12 }}><Send size={13} /> Choose one</button>
                  <button onClick={() => alertAct(a.id, "later")} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12 }}><Clock size={13} /> Remind later</button>
                  <button onClick={() => alertAct(a.id, "close")} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12, color: t.textMuted }}><X size={13} /> Close</button>
                </>) : (<>
                  <button onClick={() => alertAct(a.id, "read")} style={{ ...btn(t), height: 30, fontSize: 12 }}><Check size={13} /> Mark read</button>
                  <button onClick={() => alertAct(a.id, "later")} style={{ ...btn(t, "ghost"), height: 30, fontSize: 12 }}><Clock size={13} /> Remind later</button>
                </>)}
              </div>)}
            </div>
          </div>
          {forwardFor === a.id && isLead && (<div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>Send to which pharmacist?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{team.filter((m) => m.role === "Store Pharmacist").map((m) => <button key={m.id} onClick={() => alertAct(a.id, "one", m.name)} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer", fontWeight: 600 }}>{m.name}</button>)}{team.filter((m) => m.role === "Store Pharmacist").length === 0 && <span style={{ fontSize: 12, color: t.textMuted }}>No pharmacists on the team yet.</span>}</div>
          </div>)}
        </div>); })}</div>
    </div>)}
    <div style={card(t)}><p style={{ ...ttl(t), marginBottom: 12 }}><Warehouse size={17} color={t.primary} /> Bulk stock</p>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
        <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "left" }}>Code</th><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={{ ...th, textAlign: "left" }}>Batch</th><th style={{ ...th, textAlign: "center" }}>Expiry</th><th style={th}>Pack size</th><th style={th}>Packs</th><th style={th}>Reorder at</th><th style={{ ...th, color: "#fff" }}>Total units</th><th style={{ ...th, textAlign: "center" }}>By</th></tr></thead>
        <tbody>{stock.map((s, i) => { const dd = d2e(s.expiry); const low = s.packs <= s.reorder;
          return (<tr key={s.code} style={{ background: i % 2 ? t.zebra : t.surface }}>
            <td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontWeight: 600 }}>{s.code}</td>
            <td style={{ ...td, textAlign: "left" }}><div style={{ fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11, color: t.textMuted }}>{s.unit}</div></td>
            <td style={{ ...td, textAlign: "left", fontFamily: "monospace", fontSize: 12 }}>{s.batch}</td>
            <td style={{ ...td, textAlign: "center", color: dd <= 90 ? t.warning : t.textMuted, fontWeight: dd <= 90 ? 700 : 400 }}>{dd <= 90 ? `${dd}d` : new Date(s.expiry).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</td>
            <td style={td}>{s.packSize.toLocaleString()}</td>
            <td style={td}><input type="number" value={s.packs} min={0} onChange={(e) => setPacks(s.code, e.target.value)} style={{ width: 56, height: 30, textAlign: "right", borderRadius: 7, fontSize: 13, border: `1px solid ${low ? t.warning : t.border}`, background: t.input, color: low ? t.warning : t.text, padding: "0 6px", outline: "none", fontWeight: low ? 700 : 400, fontFamily: "inherit" }} /></td>
            <td style={{ ...td, color: t.textMuted }}>{s.reorder}</td>
            <td style={td}><span style={{ fontWeight: 800, fontSize: 14, color: low ? t.warning : t.success }}>{totalUnits(s).toLocaleString()}</span>{low && <div style={{ fontSize: 10, color: t.warning, fontWeight: 700 }}>reorder</div>}</td>
            <td style={{ ...td, textAlign: "center" }}><AuthorDot name={s.by} time={s.at} /></td>
          </tr>); })}</tbody>
      </table></div>
    </div>
    <div style={{ ...card(t), marginTop: 16 }}><p style={{ ...ttl(t), marginBottom: 12 }}><PackagePlus size={17} color={t.accent} /> Request action queue</p>
      <div style={{ display: "grid", gap: 10 }}>{incoming.map((r) => { const s = sc(r.status); const c = tc(r.type);
        return (<div key={r.id} style={{ padding: "12px 14px", borderRadius: 10, background: t.surfaceAlt }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: c.fg, background: c.bg, padding: "2px 8px", borderRadius: 12 }}>{r.type}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.item} · {r.qty.toLocaleString()} units</div><div style={{ fontSize: 12, color: t.textMuted }}>to {r.to} · by {r.by}</div></div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: s.fg, background: t.surface, padding: "4px 11px", borderRadius: 20 }}>{s.l}</span>
          </div>
          {r.notes.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{r.notes.map((n, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, background: t.surface, border: `1px solid ${t.border}`, padding: "2px 8px", borderRadius: 12 }}><Bell size={10} /> {n}</span>)}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {r.status === "new" && <><button onClick={() => act(r.id, "forward")} style={{ ...btn(t), height: 32, fontSize: 12 }}><Send size={13} /> Forward for approval</button><button onClick={() => act(r.id, "reject")} style={{ ...btn(t, "ghost"), height: 32, fontSize: 12, color: t.danger, borderColor: t.danger + "55" }}><X size={13} /> Reject</button></>}
            {r.status === "forwarded" && <span style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}><Lock size={12} /> Awaiting 🏛️ management / 📋 Sub-Manager decision</span>}
            {r.status === "approved" && <button onClick={() => act(r.id, "dispatch")} style={{ ...btn(t), height: 32, fontSize: 12 }}><Send size={13} /> Dispatch & notify requester</button>}
            {(r.status === "dispatched" || r.status === "rejected") && <span style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}><Check size={12} /> Closed · all involved roles notified</span>}
          </div>
        </div>); })}</div>
    </div>
    {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: t.text, color: t.surface, fontSize: 13, fontWeight: 600, padding: "12px 18px", borderRadius: 12, zIndex: 90, boxShadow: "0 8px 28px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 8 }}><Bell size={15} /> {toast}</div>}
    {add && <AddBulkModal onClose={() => setAdd(false)} onSave={(row) => { setStock((p) => [...p, { ...row, batch: "MS-" + Date.now().toString().slice(-4), by: userName, at: nowT() }]); setAdd(false); }} />}
  </Page>);
}
function AddBulkModal({ onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ code: "", name: "", packSize: "", packs: "", reorder: "", unit: "cartons", expiry: "" });
  const v = f.code && f.name && f.packSize && f.packs;
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="Add bulk item" icon={Warehouse} onClose={onClose}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}><div><label style={lab}>Code</label><input value={f.code} autoFocus onChange={(e) => setF({ ...f, code: e.target.value })} style={fld} placeholder="1234" /></div><div><label style={lab}>Medication</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} style={fld} /></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}><div><label style={lab}>Pack size</label><input type="number" value={f.packSize} onChange={(e) => setF({ ...f, packSize: e.target.value })} style={fld} placeholder="1000" /></div><div><label style={lab}>Packs</label><input type="number" value={f.packs} onChange={(e) => setF({ ...f, packs: e.target.value })} style={fld} /></div><div><label style={lab}>Reorder at</label><input type="number" value={f.reorder} onChange={(e) => setF({ ...f, reorder: e.target.value })} style={fld} /></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, marginBottom: 18 }}><div><label style={lab}>Unit</label><select value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} style={fld}><option>cartons</option><option>cold boxes</option><option>pallets</option><option>boxes</option></select></div><div><label style={lab}>Expiry</label><input type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} style={fld} /></div></div>
    <button onClick={() => onSave({ code: f.code, name: f.name, packSize: Number(f.packSize), packs: Number(f.packs), reorder: Number(f.reorder) || 0, unit: f.unit, expiry: f.expiry || "2027-12-31" })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Plus size={16} /> Add bulk item</button>
  </Modal>);
}
/* Store record-keeper tasks (assigned by main store; mark done) */
function StoreTasks() {
  const t = useT(); const { users, storeTasks: tasks, setStoreTasks: setTasks } = useApp();
  const pharmacists = users.filter((u) => u.role === "Pharmacist" && u.camp === "Store");
  const leads = pharmacists.filter((u) => (u.storeRole || "Store Pharmacist") === "Store Lead");
  const keepers = pharmacists.filter((u) => (u.storeRole || "Store Pharmacist") === "Store Pharmacist");
  // perspective: act as the Lead (assign to anyone) or as a specific store pharmacist (see own + add own)
  const [asLead, setAsLead] = useState(true);
  const [who, setWho] = useState(keepers[0]?.name || "");
  const [modal, setModal] = useState(false);
  const toggle = (id) => setTasks((p) => p.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id) => setTasks((p) => p.filter((x) => x.id !== id));
  const visible = asLead ? tasks : tasks.filter((x) => x.assignee === who || x.assignee === "All store pharmacists");
  const add = (task) => { setTasks((p) => [{ id: Date.now(), done: false, ...task }, ...p]); setModal(false); };
  return (<Page title="Store tasks" subtitle={asLead ? "Assign and track tasks across the store team." : `Your tasks, ${who || "store pharmacist"} — tick them off or add your own.`}
    info="The Store Lead assigns tasks to a specific store pharmacist (or to everyone) and tracks them. Store pharmacists see what's assigned to them and can also add their own tasks. Switch perspective to see each view."
    action={<div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ display: "flex", borderRadius: 9, overflow: "hidden", border: `1px solid ${t.border}` }}>
        <button onClick={() => setAsLead(true)} style={{ height: 38, padding: "0 12px", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700, background: asLead ? t.primary : t.surface, color: asLead ? "#fff" : t.text }}>As Lead</button>
        <button onClick={() => setAsLead(false)} style={{ height: 38, padding: "0 12px", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700, background: !asLead ? t.primary : t.surface, color: !asLead ? "#fff" : t.text }}>As Pharmacist</button>
      </div>
      {!asLead && keepers.length > 0 && <select value={who} onChange={(e) => setWho(e.target.value)} style={{ height: 38, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13, padding: "0 10px", fontWeight: 600 }}>{keepers.map((k) => <option key={k.id}>{k.name}</option>)}</select>}
      <button onClick={() => setModal(true)} style={btn(t)}><Plus size={15} /> {asLead ? "Assign task" : "Add my task"}</button>
    </div>}>
    <div style={{ display: "grid", gap: 10 }}>{visible.length === 0 ? <div style={{ ...card(t), color: t.textMuted, fontSize: 13 }}>No tasks here yet.</div> : visible.map((task) => (<div key={task.id} style={card(t)}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button onClick={() => toggle(task.id)} aria-label="Done" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, cursor: "pointer", marginTop: 1, border: `1.5px solid ${task.done ? t.success : t.border}`, background: task.done ? t.success : "transparent", display: "grid", placeItems: "center" }}>{task.done && <Check size={15} color="#fff" />}</button>
        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? t.textMuted : t.text }}>{task.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}><span style={pill(t)}><Users size={11} /> {task.assignedBy}</span><span style={pill(t)}><User size={11} /> {task.assignee}</span><span style={pill(t)}><CalendarClock size={11} /> {task.due}</span></div></div>
        {(asLead || task.assignee === who) && <button onClick={() => remove(task.id)} aria-label="Remove" style={{ ...miniBtn(t), color: t.danger }}><Trash2 size={12} /></button>}
      </div></div>))}</div>
    {modal && <StoreTaskModal asLead={asLead} who={who} keepers={keepers} onClose={() => setModal(false)} onSave={add} />}
  </Page>);
}
function StoreTaskModal({ asLead, who, keepers, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ title: "", assignee: asLead ? (keepers[0]?.name || "All store pharmacists") : who, due: "Today" });
  const v = f.title.trim();
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={asLead ? "Assign store task" : "Add my task"} icon={ListChecks} onClose={onClose}>
    <label style={lab}>Task</label><input value={f.title} autoFocus onChange={(e) => setF({ ...f, title: e.target.value })} style={{ ...fld, marginBottom: 14 }} placeholder="e.g. Count carton stock for Augmentin" />
    {asLead && <><label style={lab}>Assign to</label><select value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })} style={{ ...fld, marginBottom: 14 }}><option>All store pharmacists</option>{keepers.map((k) => <option key={k.id}>{k.name}</option>)}</select></>}
    <label style={lab}>Due</label><input value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} style={{ ...fld, marginBottom: 18 }} placeholder="Today / Tomorrow / Thu" />
    <button onClick={() => onSave({ title: f.title.trim(), assignee: f.assignee, due: f.due || "Today", assignedBy: asLead ? "Store lead" : (who || "Self") })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Check size={16} /> {asLead ? "Assign task" : "Add task"}</button>
  </Modal>);
}
/* Requests from camps to the main store — three types, notifies management & Sub-Manager */
const REQ_TYPES = { monthly: { label: "Monthly demand", icon: CalendarDays, info: "Routine monthly bulk order for the camp's standard formulary." }, urgent: { label: "Urgent request", icon: AlertTriangle, info: "Time-critical need — flagged for fast approval." }, request: { label: "Request from store", icon: PackagePlus, info: "One-off request for a specific item and quantity." } };
const STORE_REQ_SEED = [
  { id: 8801, type: "urgent", camp: "Al-Udeid Clinic", by: "Yaqeen", stage: "mgmt_approve", time: "Today 08:05", lines: [{ item: "Insulin Glargine", prev: 40, qty: 30, note: "Cold-chain — running low" }] },
  { id: 8802, type: "monthly", camp: "Tariq Camp", by: "Yaqeen", stage: "store_fulfil", actor: "M. Obaidly", time: "Yesterday", lines: [{ item: "Paracetamol 500mg", prev: 1000, qty: 1200, note: "" }, { item: "Augmentin 1000mg", prev: 1500, qty: 2000, note: "Winter demand" }, { item: "Metformin 850mg", prev: 400, qty: 500, note: "New chronic pts" }] },
];
/* signature: upload an image, or sign manually by typing the name as a script signature */
function SignatureField({ value, onChange, label }) {
  const t = useT(); const ref = useRef(null);
  return (<div>
    <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5 }}>{label}</div>
    <div style={{ border: `1px dashed ${t.border}`, borderRadius: 10, padding: 10, background: t.surfaceAlt }}>
      {value?.img ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}><img src={value.img} alt="signature" style={{ height: 44, maxWidth: 180, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 3 }} /><button onClick={() => onChange(null)} style={{ ...miniBtn(t), color: t.danger }}><X size={13} /></button></div>
        : value?.typed ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}><span style={{ fontFamily: SCRIPT, fontSize: 24, color: t.text }}>{value.typed}</span><button onClick={() => onChange(null)} style={{ ...miniBtn(t), color: t.danger }}><X size={13} /></button></div>
        : <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => ref.current?.click()} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12 }}><Upload size={13} /> Upload signature</button>
            <span style={{ fontSize: 12, color: t.textMuted }}>or sign manually:</span>
            <input onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) onChange({ typed: e.target.value.trim() }); }} placeholder="type name + Enter" style={{ height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, padding: "0 10px", outline: "none", flex: 1, minWidth: 120 }} />
            <input ref={ref} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange({ img: URL.createObjectURL(f) }); }} style={{ display: "none" }} />
          </div>}
    </div>
  </div>);
}
function StoreRequest({ allocatedCamp, role, userName }) {
  const t = useT(); const { me, camps, addMedReq, notify, medReqs, patchMedReq, addStoreReq } = useApp();
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const td = { padding: "9px 11px", fontSize: 13, borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  const [tab, setTab] = useState("store");
  const [reqs, setReqs] = useState([
    { id: 1, type: "urgent", item: "Insulin Glargine", qty: 30, status: "approved", by: userName, sig: { typed: userName }, approver: "M. Obaidly", approverSig: { typed: "M. Obaidly" } },
    { id: 2, type: "monthly", item: "Monthly demand · 3 items", qty: 0, lines: [{ item: "Augmentin 1000mg", prev: 1500, qty: 2000, note: "Higher winter demand" }, { item: "Paracetamol 500mg", prev: 1000, qty: 1200, note: "" }, { item: "Metformin 850mg", prev: 400, qty: 500, note: "New chronic patients" }], status: "pending", by: userName, sig: { typed: userName } },
  ]);
  const [modal, setModal] = useState(null);
  const canApprove = role === "Management" || role === "Sub-Manager";
  const sc = (s) => s === "approved" ? { fg: t.success, bg: t.successSoft, l: "Approved" } : s === "dispatched" ? { fg: t.primary, bg: t.primarySoft, l: "Dispatched" } : s === "rejected" ? { fg: t.danger, bg: t.dangerSoft, l: "Rejected" } : { fg: t.warning, bg: t.warningSoft, l: "Pending" };
  const tc = (type) => type === "urgent" ? { fg: t.danger, bg: t.dangerSoft } : type === "monthly" ? { fg: t.accent, bg: t.primarySoft } : { fg: t.primary, bg: t.primarySoft };
  const approve = (id, sig) => setReqs((p) => p.map((r) => r.id === id ? { ...r, status: "approved", approver: userName, approverSig: sig } : r));
  const sigText = (s) => s?.typed ? s.typed : s?.img ? "[signed — image on file]" : "—";
  const myCampReqs = (medReqs || []).filter((r) => r.fromPharmacist && r.by === userName);
  const allocated = allocatedCamp;
  // Actions this pharmacist must take at their location:
  const toConfirmStock = (medReqs || []).filter((r) => r.stage === "source_confirm" && r.source === allocated && r.source !== "Main store");
  const toFulfil = (medReqs || []).filter((r) => r.stage === "fulfil" && r.source === allocated && !r.pharmAction);
  const toReceive = (medReqs || []).filter((r) => r.stage === "receive" && r.destCamp === allocated && !r.pharmAction);
  const actionCount = toConfirmStock.length + toFulfil.length + toReceive.length;
  const tabs = [{ k: "store", label: "Request from store", icon: PackagePlus }, { k: "camp", label: "Request from camp/clinic", icon: Building2 }, { k: "fulfil", label: `Actions${actionCount ? ` (${actionCount})` : ""}`, icon: PackageCheck }];
  const exportOne = (r) => exportPDF(`${r.type === "monthly" ? "Monthly demand" : REQ_TYPES[r.type].label} — ${r.item}`, r.lines
    ? `<table><thead><tr><th>Medication</th><th>Prev. received</th><th>Requested</th><th>Note</th></tr></thead><tbody>${r.lines.map((l) => `<tr><td>${escapeHTML(l.item)}</td><td>${l.prev}</td><td>${l.qty}</td><td>${escapeHTML(l.note || "")}</td></tr>`).join("")}</tbody></table><div class="sig"><div>Requested by: ${escapeHTML(r.by || "")}<br><br><i>${escapeHTML(sigText(r.sig))}</i></div><div>Approved by: ${escapeHTML(r.approver || "")}<br><br><i>${escapeHTML(sigText(r.approverSig))}</i></div></div>`
    : `<table><tbody><tr><th style="width:160px">Type</th><td>${escapeHTML(REQ_TYPES[r.type].label)}</td></tr><tr><th>Item</th><td>${escapeHTML(r.item)}</td></tr><tr><th>Quantity</th><td>${(r.qty || 0).toLocaleString()} units</td></tr><tr><th>Destination</th><td>Main store → ${escapeHTML(allocatedCamp)}</td></tr><tr><th>Status</th><td>${escapeHTML(sc(r.status).l)}</td></tr></tbody></table><div class="sig"><div>Requested by: ${escapeHTML(r.by || "")}<br><br><i>${escapeHTML(sigText(r.sig))}</i></div><div>Approved by: ${escapeHTML(r.approver || "")}<br><br><i>${escapeHTML(sigText(r.approverSig))}</i></div></div>`, { camp: allocatedCamp, person: me?.name, mil: me?.mil, role: me?.role, extra: r.type === "monthly" ? "Monthly demand" : REQ_TYPES[r.type].label });
  return (<Page title="My requests" subtitle={`Order stock to ${allocatedCamp} — from the main store or another camp/clinic.`}
    info="Two ways to request stock: a monthly demand to the main store (add many medications in one table), or a transfer request from another camp/clinic. Both go to Management/Sub-management for approval. Camp transfers notify the source camp's pharmacist on approval.">
    <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: t.surfaceAlt, border: `1px solid ${t.border}`, marginBottom: 16, flexWrap: "wrap" }}>
      {tabs.map((x) => { const on = tab === x.k; const Ic = x.icon;
        return (<button key={x.k} onClick={() => setTab(x.k)} style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700, background: on ? t.primary : "transparent", color: on ? "#fff" : t.textMuted, boxShadow: on ? "0 3px 10px rgba(45,125,210,0.28)" : "none", transition: "all .15s" }}><Ic size={15} /> {x.label}</button>); })}
    </div>

    {tab === "store" ? (<>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setModal("monthly")} style={btn(t)}><CalendarDays size={15} /> New monthly demand</button>
        <button onClick={() => setModal("urgent")} style={btn(t, "ghost")}><AlertTriangle size={15} /> Urgent request</button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>{reqs.map((r) => { const s = sc(r.status); const c = tc(r.type); const Icon = r.type === "monthly" ? CalendarDays : REQ_TYPES[r.type].icon;
        return (<div key={r.id} style={card(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: c.fg, background: c.bg, padding: "2px 8px", borderRadius: 12 }}><Icon size={11} /> {r.type === "monthly" ? "Monthly demand" : REQ_TYPES[r.type].label}</span><span style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</span></div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><button onClick={() => exportOne(r)} title="Export PDF" aria-label="Export PDF" style={{ ...miniBtn(t), width: 30, height: 30, color: t.primary }}><FileText size={14} /></button><span style={{ fontSize: 12, fontWeight: 700, color: s.fg, background: s.bg, padding: "4px 11px", borderRadius: 20 }}>{s.l}</span></span></div>
          {r.lines ? (<div style={{ marginTop: 10, overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
            <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={{ ...th, textAlign: "right" }}>Prev. received</th><th style={{ ...th, textAlign: "right" }}>Requested</th><th style={{ ...th, textAlign: "left" }}>Note</th></tr></thead>
            <tbody>{r.lines.map((l, i) => (<tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}><td style={td}>{l.item}</td><td style={{ ...td, textAlign: "right" }}>{l.prev}</td><td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{l.qty}</td><td style={{ ...td, color: t.textMuted }}>{l.note || "—"}</td></tr>))}</tbody>
          </table></div>) : (<div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 7 }}>{(r.qty || 0).toLocaleString()} units · Main store → {allocatedCamp}</div>)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10, fontSize: 11.5, color: t.textMuted, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Pencil size={12} /> Requested by {r.by} {r.sig?.typed ? <em style={{ fontFamily: SCRIPT, fontSize: 16, color: t.text, marginLeft: 2 }}>{r.sig.typed}</em> : ""}</span>
            {r.approver && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: t.success }}><Check size={12} /> Approved by {r.approver} {r.approverSig?.typed ? <em style={{ fontFamily: SCRIPT, fontSize: 16, marginLeft: 2 }}>{r.approverSig.typed}</em> : ""}</span>}
            {canApprove && r.status === "pending" && <button onClick={() => setModal({ approveId: r.id })} style={{ ...btn(t), height: 28, fontSize: 11.5 }}><Check size={12} /> Approve & sign</button>}
          </div>
        </div>); })}</div>
    </>) : tab === "camp" ? (<>
      <div style={{ marginBottom: 14 }}><button onClick={() => setModal("camp")} style={btn(t)}><Plus size={15} /> Request from a camp/clinic</button></div>
      {myCampReqs.length === 0
        ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "30px 16px" }}>No camp/clinic requests yet. Tap the button above to request stock from another camp or clinic.</div>
        : <div style={{ display: "grid", gap: 10 }}>{myCampReqs.map((r) => { const s = stageBadge(t, r.stage);
          return (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.primary}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: s.fg, background: s.bg, padding: "4px 11px", borderRadius: 20 }}>{s.l}</span></div>
            <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 7, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span>from <strong style={{ color: t.text }}>{r.source}</strong></span><span>{r.time}</span></div>
            {r.stage !== "declined" && <StageTrack t={t} stage={r.stage} />}
            {r.stage === "declined" && <div style={{ fontSize: 11.5, color: t.danger, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}><X size={13} /> Declined{r.actor ? ` by ${r.actor}` : r.srcDecliner ? ` by ${r.srcDecliner}` : ""}.</div>}
          </div>); })}</div>}
    </>) : (<>
      <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Requests needing your action at {allocated}: confirm stock, fulfil (send), or receive.</div>
      {actionCount === 0
        ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "30px 16px" }}>Nothing needs your action right now.</div>
        : <div style={{ display: "grid", gap: 14 }}>
          {toConfirmStock.length > 0 && <div>
            <div style={{ ...ttl(t), marginBottom: 8 }}><ShieldCheck size={16} color={t.warning} /> Confirm stock availability</div>
            <div style={{ display: "grid", gap: 10 }}>{toConfirmStock.map((r) => (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.warning}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.warning, background: t.warningSoft, padding: "4px 11px", borderRadius: 20 }}>Confirm stock</span></div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{r.source} <ArrowLeftRight size={12} /> {r.destCamp}</span><span>by {r.fromPharmacist ? "💊" : "🩺"} {r.by}</span></div>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>Do you have this stock? Confirm to send it to Management/Sub for approval.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => { patchMedReq(r.id, { stage: "mgmt_approve", srcActor: me?.name }); notify("Requests", ["Management", "Sub-Manager"], `📋 ${me?.name} confirmed stock for ${r.qty} × ${r.item} (${r.source} → ${r.destCamp}). Awaiting your approval.`); notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `${r.item}: ${r.source} confirmed stock. Now awaiting management approval.`); }} style={btn(t)}><Check size={15} /> Confirm stock</button>
                <button onClick={() => { patchMedReq(r.id, { stage: "declined", srcDecliner: me?.name }); notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `${r.item} request declined by ${r.source} — stock not available.`); }} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><X size={15} /> No stock</button>
              </div>
            </div>))}</div>
          </div>}
          {toFulfil.length > 0 && <div>
            <div style={{ ...ttl(t), marginBottom: 8 }}><PackageCheck size={16} color={t.primary} /> To send / fulfil (approved)</div>
            <div style={{ display: "grid", gap: 10 }}>{toFulfil.map((r) => (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.primary}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.primary, background: t.primarySoft, padding: "4px 11px", borderRadius: 20 }}>Approved</span></div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{r.source} <ArrowLeftRight size={12} /> {r.destCamp}</span></div>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>Requested by {r.fromPharmacist ? "💊" : "🩺"} {r.by} · Approved by {r.actor || "management"}</div>
              <button onClick={() => { patchMedReq(r.id, { pharmAction: "fulfil", actionDate: today() }); notify("Requests", ["Pharmacist"], `📦 ${r.qty} × ${r.item} to send from ${r.source}. Confirm the deduction in Logs → Medical Req. stocks.`); }} style={{ ...btn(t), marginTop: 12 }}><PackageCheck size={15} /> Fulfil (send)</button>
            </div>))}</div>
          </div>}
          {toReceive.length > 0 && <div>
            <div style={{ ...ttl(t), marginBottom: 8 }}><Download size={16} color={t.success} /> To receive</div>
            <div style={{ display: "grid", gap: 10 }}>{toReceive.map((r) => (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.success}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.primary, background: t.primarySoft, padding: "4px 11px", borderRadius: 20 }}>In transit</span></div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{r.source} <ArrowLeftRight size={12} /> {r.destCamp}</span></div>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>Requested by {r.fromPharmacist ? "💊" : "🩺"} {r.by}</div>
              <button onClick={() => { patchMedReq(r.id, { pharmAction: "receive", actionDate: today() }); notify("Requests", ["Pharmacist"], `📥 ${r.qty} × ${r.item} to receive at ${r.destCamp}. Confirm the addition in Logs → Medical Req. stocks.`); }} style={{ ...btn(t), marginTop: 12, background: t.success }}><Download size={15} /> Receive</button>
            </div>))}</div>
          </div>}
        </div>}
    </>)}

    {modal === "monthly" && <MonthlyDemandModal type="monthly" allocatedCamp={allocatedCamp} userName={userName} onClose={() => setModal(null)} onSave={(r) => { setReqs((p) => [{ ...r, id: Date.now(), status: "pending", by: userName }, ...p]); addStoreReq({ type: "monthly", camp: allocatedCamp, by: userName, lines: r.lines }); notify("Requests", ["Management", "Sub-Manager", "Store"], `💊 ${userName} submitted a monthly demand (${r.lines.length} items) for ${allocatedCamp}.`); setModal(null); }} />}
    {modal === "urgent" && <MonthlyDemandModal type="urgent" allocatedCamp={allocatedCamp} userName={userName} onClose={() => setModal(null)} onSave={(r) => { setReqs((p) => [{ ...r, id: Date.now(), status: "pending", by: userName }, ...p]); addStoreReq({ type: "urgent", camp: allocatedCamp, by: userName, lines: r.lines }); notify("Requests", ["Management", "Sub-Manager", "Store"], `🚨 URGENT: ${userName} submitted an urgent request (${r.lines.length} items) for ${allocatedCamp}.`); setModal(null); }} />}
    {modal === "camp" && <CampRequestModal camps={(camps || []).filter((c) => c !== allocatedCamp)} userName={userName} onClose={() => setModal(null)} onSave={(r) => { addMedReq({ item: r.item, qty: r.qty, source: r.source, by: userName, fromPharmacist: true, destCamp: allocatedCamp }); if (r.source === "Main store") notify("Requests", ["Store"], `💊 ${userName} requests ${r.qty} × ${r.item} from the store. Please confirm stock availability.`); else notify("Requests", ["Pharmacist"], `💊 ${userName} requests ${r.qty} × ${r.item} from ${r.source}. Please confirm stock availability.`); setModal(null); }} />}
    {modal && modal.approveId && <ApproveSignModal onClose={() => setModal(null)} onSave={(sig) => { approve(modal.approveId, sig); setModal(null); }} />}
  </Page>);
}
function MonthlyDemandModal({ type = "monthly", allocatedCamp, userName, onClose, onSave }) {
  const t = useT(); const [rows, setRows] = useState([{ item: STORE_STOCK_SEED[0].name, prev: "", qty: "", note: "" }]); const [sig, setSig] = useState({ typed: userName });
  const urgent = type === "urgent";
  const th = { padding: "9px 8px", fontSize: 11, fontWeight: 600, color: "#C6D6E8", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}` };
  const fld = { width: "100%", height: 38, borderRadius: 8, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13, padding: "0 8px", outline: "none", boxSizing: "border-box" };
  const setRow = (i, k, v) => setRows((p) => p.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const addRow = () => setRows((p) => [...p, { item: STORE_STOCK_SEED[0].name, prev: "", qty: "", note: "" }]);
  const delRow = (i) => setRows((p) => p.length > 1 ? p.filter((_, j) => j !== i) : p);
  const valid = rows.every((r) => r.item && r.qty) && rows.length > 0;
  const submit = () => { const lines = rows.map((r) => ({ item: r.item, prev: Number(r.prev) || 0, qty: Number(r.qty) || 0, note: r.note })); onSave({ type, item: `${urgent ? "Urgent request" : "Monthly demand"} · ${lines.length} item${lines.length > 1 ? "s" : ""}`, lines, sig }); };
  return (<Modal title={urgent ? "Urgent request" : "Monthly demand"} icon={urgent ? AlertTriangle : CalendarDays} onClose={onClose} width={620}>
    <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14 }}>{urgent ? "Add each medication urgently needed — flagged for fast handling." : "Add each medication you need this month."} Submitted as one request to the main store for {allocatedCamp}.</div>
    <div style={{ overflowX: "auto", marginBottom: 12 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
      <thead><tr style={{ background: t.head }}><th style={{ ...th, textAlign: "left" }}>Medication</th><th style={{ ...th, textAlign: "right", width: 110 }}>Prev. received</th><th style={{ ...th, textAlign: "right", width: 90 }}>Requested</th><th style={{ ...th, textAlign: "left" }}>Note</th><th style={{ ...th, width: 36 }}></th></tr></thead>
      <tbody>{rows.map((r, i) => (<tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
        <td style={{ padding: 5 }}><select value={r.item} onChange={(e) => setRow(i, "item", e.target.value)} style={fld}>{STORE_STOCK_SEED.map((s) => <option key={s.code}>{s.name}</option>)}</select></td>
        <td style={{ padding: 5 }}><input type="number" value={r.prev} onChange={(e) => setRow(i, "prev", e.target.value)} style={{ ...fld, textAlign: "right" }} placeholder="0" /></td>
        <td style={{ padding: 5 }}><input type="number" value={r.qty} onChange={(e) => setRow(i, "qty", e.target.value)} style={{ ...fld, textAlign: "right" }} placeholder="0" /></td>
        <td style={{ padding: 5 }}><input value={r.note} onChange={(e) => setRow(i, "note", e.target.value)} style={fld} placeholder="optional" /></td>
        <td style={{ padding: 5, textAlign: "center" }}><button onClick={() => delRow(i)} aria-label="Remove" style={{ ...miniBtn(t), width: 28, height: 28, color: t.danger }}><X size={13} /></button></td>
      </tr>))}</tbody>
    </table></div>
    <button onClick={addRow} style={{ ...btn(t, "ghost"), height: 36, fontSize: 12.5, marginBottom: 16 }}><Plus size={14} /> Add medication</button>
    <div style={{ marginBottom: 16 }}><SignatureField value={sig} onChange={setSig} label="Your signature (requester)" /></div>
    <div style={{ background: t.surfaceAlt, borderRadius: 10, padding: "10px 12px", marginBottom: 18, fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}><Bell size={13} color={t.primary} /> Notifies 🏛️ management and 📋 Sub-Manager for approval, then the store prepares it.</div>
    <button onClick={submit} disabled={!valid} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: valid ? 1 : 0.5, background: urgent ? t.danger : t.primary }}><Send size={16} /> Submit {urgent ? "urgent request" : "monthly demand"}</button>
  </Modal>);
}
function CampRequestModal({ camps, userName, onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ item: STORE_STOCK_SEED[0].name, qty: "", source: (camps && camps[0]) || "" });
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const v = f.item && f.qty && f.source;
  return (<Modal title="Request from camp/clinic" icon={Building2} onClose={onClose}>
    <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14 }}>Request a transfer from another camp or clinic. Goes to Management/Sub for approval; on approval the source pharmacist is notified.</div>
    <label style={lab}>Medication</label><select value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{STORE_STOCK_SEED.map((s) => <option key={s.code}>{s.name}</option>)}</select>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Quantity</label><input type="number" value={f.qty} autoFocus onChange={(e) => setF({ ...f, qty: e.target.value })} style={fld} placeholder="0" /></div>
      <div><label style={lab}>From camp/clinic</label><select value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} style={fld}>{camps.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
    </div>
    <button onClick={() => onSave({ item: f.item, qty: Number(f.qty), source: f.source })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Send size={16} /> Submit request</button>
  </Modal>);
}
function StoreRequests({ userName }) {
  const t = useT(); const { storeReqs, patchStoreReq, notify, medReqs, patchMedReq, adjustInv } = useApp();
  const th = { padding: "10px 11px", fontSize: 11.5, fontWeight: 600, color: "#C6D6E8", whiteSpace: "nowrap", borderBottom: `1px solid ${t.border}`, textAlign: "left" };
  const td = { padding: "9px 11px", fontSize: 13, borderBottom: `1px solid ${t.border}`, verticalAlign: "top" };
  const sc = (s) => s === "fulfilled" ? { fg: t.success, bg: t.successSoft, l: "Fulfilled" } : s === "declined" ? { fg: t.danger, bg: t.dangerSoft, l: "Declined" } : { fg: t.warning, bg: t.warningSoft, l: "To fulfil" };
  const pending = (storeReqs || []).filter((r) => r.stage === "store_fulfil");
  const decided = (storeReqs || []).filter((r) => r.stage === "fulfilled" || r.stage === "declined");
  // Path 2: medical/pharmacist requests where the source is the store
  const storeConfirm = (medReqs || []).filter((r) => r.stage === "source_confirm" && r.source === "Main store");
  const storeFulfil = (medReqs || []).filter((r) => r.stage === "fulfil" && r.source === "Main store" && !r.pharmAction);
  const fulfil = (r) => { patchStoreReq(r.id, { stage: "fulfilled", actor: userName, decidedAt: today() }); notify("Store", ["Pharmacist"], `📦 Your ${r.type === "urgent" ? "urgent request" : "monthly demand"} (${r.lines.length} item${r.lines.length > 1 ? "s" : ""}) for ${r.camp} has been fulfilled and dispatched from the main store.`); };
  const decline = (r) => { patchStoreReq(r.id, { stage: "declined", actor: userName, decidedAt: today() }); notify("Store", ["Pharmacist"], `Your ${r.type === "urgent" ? "urgent request" : "monthly demand"} for ${r.camp} was declined by the store.`); };
  const Card = ({ r, actionable }) => { const s = sc(r.stage === "store_fulfil" ? "pending" : r.stage); const urgent = r.type === "urgent";
    return (<div style={{ ...card(t), borderLeft: `4px solid ${urgent ? t.danger : t.primary}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: urgent ? t.danger : t.accent, background: urgent ? t.dangerSoft : t.primarySoft, padding: "2px 9px", borderRadius: 12 }}>{urgent ? <AlertTriangle size={11} /> : <CalendarDays size={11} />} {urgent ? "Urgent request" : "Monthly demand"}</span><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.camp}</span></div>
        <span style={{ fontSize: 12, fontWeight: 700, color: s.fg, background: s.bg, padding: "4px 11px", borderRadius: 20 }}>{s.l}</span>
      </div>
      <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>by 💊 {r.by} · {r.time}{r.actor && r.stage !== "store_fulfil" ? ` · ${r.stage === "fulfilled" ? "fulfilled" : "declined"} by ${r.actor}` : r.actor ? ` · approved by ${r.actor}` : ""}</div>
      <div style={{ overflowX: "auto", marginTop: 10 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
        <thead><tr style={{ background: t.head }}><th style={th}>Medication</th><th style={{ ...th, textAlign: "right" }}>Prev. received</th><th style={{ ...th, textAlign: "right" }}>Requested</th><th style={th}>Note</th></tr></thead>
        <tbody>{r.lines.map((l, i) => (<tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}><td style={td}>{l.item}</td><td style={{ ...td, textAlign: "right" }}>{l.prev}</td><td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{l.qty}</td><td style={{ ...td, color: t.textMuted }}>{l.note || "—"}</td></tr>))}</tbody>
      </table></div>
      {actionable && <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => fulfil(r)} style={btn(t)}><PackageCheck size={15} /> Fulfil & dispatch</button>
        <button onClick={() => decline(r)} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><X size={15} /> Decline</button>
      </div>}
    </div>);
  };
  return (<Page title="Requests" subtitle="Approved camp demands to dispatch, plus item requests to confirm/fulfil."
    info="Camp monthly demands & urgent requests arrive here after management approves them — you fulfil and dispatch. Item requests sourced from the store first need you to confirm stock (which sends them to management), then fulfil once approved.">
    {(storeConfirm.length > 0 || storeFulfil.length > 0) && <div style={{ marginBottom: 20 }}>
      <div style={{ ...ttl(t), marginBottom: 10 }}><Stethoscope size={16} color={t.accent} /> Item requests from the store</div>
      <div style={{ display: "grid", gap: 10 }}>
        {storeConfirm.map((r) => (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.warning}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.warning, background: t.warningSoft, padding: "4px 11px", borderRadius: 20 }}>Confirm stock</span></div>
          <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span>→ {r.destCamp}</span><span>by {r.fromPharmacist ? "💊" : "🩺"} {r.by}</span></div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => { patchMedReq(r.id, { stage: "mgmt_approve", srcActor: userName }); notify("Requests", ["Management", "Sub-Manager"], `🏪 Store confirmed stock for ${r.qty} × ${r.item} → ${r.destCamp}. Awaiting approval.`); notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `${r.item}: store confirmed stock. Awaiting management approval.`); }} style={btn(t)}><Check size={15} /> Confirm stock</button>
            <button onClick={() => { patchMedReq(r.id, { stage: "declined", srcDecliner: userName }); notify("Requests", [r.fromPharmacist ? "Pharmacist" : "Medical"], `${r.item} request declined — store has no stock.`); }} style={{ ...btn(t, "ghost"), color: t.danger, borderColor: t.danger + "55" }}><X size={15} /> No stock</button>
          </div>
        </div>))}
        {storeFulfil.map((r) => (<div key={r.id} style={{ ...card(t), borderLeft: `4px solid ${t.primary}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: t.primary, background: t.primarySoft, padding: "4px 11px", borderRadius: 20 }}>Approved — dispatch</span></div>
          <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12 }}><span>{r.qty} units</span><span>→ {r.destCamp}</span><span>approved by {r.actor || "management"}</span></div>
          <button onClick={() => { patchMedReq(r.id, { stage: "receive", pharmAction: null, dispatchedAt: today() }); notify("Requests", ["Pharmacist"], `📦 ${r.qty} × ${r.item} dispatched from the store to ${r.destCamp}. Confirm receipt on arrival.`); }} style={{ ...btn(t), marginTop: 12 }}><PackageCheck size={15} /> Dispatch</button>
        </div>))}
      </div>
    </div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
      <Metric label="To fulfil" value={pending.length} tone="warning" />
      <Metric label="Urgent" value={pending.filter((r) => r.type === "urgent").length} tone="danger" />
      <Metric label="Fulfilled" value={(storeReqs || []).filter((r) => r.stage === "fulfilled").length} tone="success" />
    </div>
    {pending.length === 0
      ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "30px 16px" }}>No approved demands to dispatch. Camp requests appear here once management approves them.</div>
      : <div style={{ display: "grid", gap: 12 }}>{pending.map((r) => <Card key={r.id} r={r} actionable />)}</div>}
    {decided.length > 0 && <><div style={{ ...ttl(t), margin: "22px 0 10px" }}><Clock size={16} color={t.textMuted} /> History</div>
      <div style={{ display: "grid", gap: 12 }}>{decided.map((r) => <Card key={r.id} r={r} />)}</div></>}
  </Page>);
}
function ApproveSignModal({ onClose, onSave }) {
  const t = useT(); const [sig, setSig] = useState(null);
  return (<Modal title="Approve & sign" icon={Check} onClose={onClose}>
    <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14 }}>Approving this request. Add your signature — upload an image or sign manually — to complete the approval for the physical record.</div>
    <div style={{ marginBottom: 18 }}><SignatureField value={sig} onChange={setSig} label="Approver signature" /></div>
    <button onClick={() => onSave(sig || { typed: "Approved" })} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center" }}><Check size={16} /> Confirm approval</button>
  </Modal>);
}
function StoreReqModal({ type, allocatedCamp, userName, onClose, onSave }) {
  const t = useT(); const meta = REQ_TYPES[type]; const Icon = meta.icon;
  const [f, setF] = useState({ item: STORE_STOCK_SEED[0].name, qty: "" }); const [sig, setSig] = useState({ typed: userName }); const v = f.item && f.qty;
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title={meta.label} icon={Icon} onClose={onClose}>
    <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 14 }}>{meta.info}</div>
    <label style={lab}>Item</label><select value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{STORE_STOCK_SEED.map((s) => <option key={s.code}>{s.name}</option>)}</select>
    <label style={lab}>Quantity (units)</label><input type="number" value={f.qty} autoFocus onChange={(e) => setF({ ...f, qty: e.target.value })} style={{ ...fld, marginBottom: 14 }} placeholder="0" />
    <div style={{ marginBottom: 14 }}><SignatureField value={sig} onChange={setSig} label="Your signature (requester)" /></div>
    <div style={{ background: t.surfaceAlt, borderRadius: 10, padding: "10px 12px", marginBottom: 18, fontSize: 12, color: t.textMuted }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><MapPin size={13} /> Deliver to {allocatedCamp}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Bell size={13} color={type === "urgent" ? t.danger : t.primary} /> Notifies 🏛️ management and 📋 Sub-Manager{type === "urgent" ? " — flagged urgent" : ""}</div>
    </div>
    <button onClick={() => onSave({ type, item: f.item, qty: Number(f.qty), sig })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5, background: type === "urgent" ? t.danger : t.primary }}><Send size={16} /> Submit {meta.label.toLowerCase()}</button>
  </Modal>);
}

/* ================= DOCTOR ================= */
const RADAR = [
  { name: "Ceftriaxone 1g", batch: "#CEF-2291", qty: 80, unit: "vials", camp: "Al-Udeid Clinic", days: 14, lv: "danger" },
  { name: "Insulin Glargine", batch: "#INS-0042", qty: 22, unit: "pens", camp: "Doha HQ", days: 38, lv: "warn" },
  { name: "Augmentin 1000mg", batch: "#AUG2026-X", qty: 50, unit: "boxes", camp: "Tariq Camp", days: 45, lv: "warn" },
];
function RadarScreen() {
  const t = useT(); const { camps } = useApp(); const [shift, setShift] = useState(true); const [modal, setModal] = useState(null); const sorted = [...RADAR].sort((a, b) => a.days - b.days);
  return (<Page title="Expiry radar" subtitle="High-value items nearing expiry — prioritise prescribing these batches." info="Items within the 60-day threshold pinned by urgency, with the camp holding each batch.">
    <div style={{ ...card(t), padding: "13px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, background: t.primarySoft, borderColor: t.primary + "55" }}><Bell size={18} color={t.primary} /><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>Start-of-shift expiry summary</div><div style={{ fontSize: 12.5, color: t.textMuted }}>Push + WhatsApp alert listing batches to prioritise.</div></div><button onClick={() => setShift(!shift)} aria-label="Toggle" style={{ width: 46, height: 26, borderRadius: 20, border: "none", cursor: "pointer", background: shift ? t.primary : t.border, position: "relative" }}><span style={{ position: "absolute", top: 3, left: shift ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} /></button></div>
    <div style={{ display: "grid", gap: 10 }}>{sorted.map((m, i) => { const c = m.lv === "danger" ? { fg: t.danger, bg: t.dangerSoft } : { fg: t.warning, bg: t.warningSoft };
      return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 15px", borderRadius: 11, background: c.bg, border: `1px solid ${c.fg}33`, borderLeft: `4px solid ${c.fg}` }}><AlertTriangle size={20} color={c.fg} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700 }}>{m.name}</div><div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 3 }}>{m.qty} {m.unit} · batch {m.batch} · {m.camp}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 17, fontWeight: 800, color: c.fg }}>{m.days}</div><div style={{ fontSize: 11, color: t.textMuted }}>days</div></div><button onClick={() => setModal(m)} style={{ ...btn(t), background: c.fg }}>Request <ChevronRight size={15} /></button></div>); })}</div>
    {modal && <ReqModal item={modal} camps={camps} onClose={() => setModal(null)} />}
  </Page>);
}
function ReqModal({ item, camps, onClose }) {
  const t = useT(); const [sent, setSent] = useState(false); const [from, setFrom] = useState(item.camp); const [to, setTo] = useState(camps.find((c) => c !== item.camp)); const [qty, setQty] = useState(item.qty);
  const fld = { width: "100%", height: 40, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 13.5, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  if (sent) return (<Modal title="Request submitted" icon={CheckCircle2} onClose={onClose} width={380}><div style={{ textAlign: "center" }}><CheckCircle2 size={44} color={t.success} style={{ margin: "0 auto 10px" }} /><p style={{ fontSize: 13, color: t.textMuted, margin: "0 0 18px" }}>Sent for approval. Once decided it locks to view-only.</p><button onClick={onClose} style={{ ...btn(t), width: "100%", height: 42, justifyContent: "center" }}>Done</button></div></Modal>);
  return (<Modal title="Stock transfer request" icon={ArrowLeftRight} onClose={onClose}><div style={{ fontSize: 14.5, fontWeight: 700 }}>{item.name}</div><div style={{ fontSize: 12.5, color: t.textMuted, fontFamily: "monospace", marginBottom: 16 }}>batch {item.batch}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}><div><label style={lab}>From</label><select value={from} onChange={(e) => setFrom(e.target.value)} style={fld}>{camps.map((c) => <option key={c}>{c}</option>)}</select></div><div><label style={lab}>To</label><select value={to} onChange={(e) => setTo(e.target.value)} style={fld}>{camps.map((c) => <option key={c}>{c}</option>)}</select></div></div>
    <div style={{ marginBottom: 16 }}><label style={lab}>Quantity</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} style={fld} /></div>
    <button onClick={() => setSent(true)} disabled={from === to} style={{ ...btn(t), width: "100%", height: 44, justifyContent: "center", opacity: from === to ? 0.5 : 1 }}><Send size={16} /> Submit for approval</button>
    {from === to && <p style={{ fontSize: 11.5, color: t.danger, textAlign: "center", margin: "8px 0 0" }}>Source and destination must differ.</p>}
  </Modal>);
}
const REQ_MEDS = ["Paracetamol 500mg", "Augmentin 1000mg", "Insulin Glargine", "Ceftriaxone 1g", "Morphine sulfate 10mg", "Metformin 850mg", "Amoxicillin 500mg", "Omeprazole 20mg"];
function MyRequests({ userName, allocatedCamp }) {
  const t = useT(); const { medReqs, addMedReq, notify, camps } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ item: REQ_MEDS[0], qty: 1, source: "Main store" });
  const sources = ["Main store", ...(camps || [])];
  const mine = (medReqs || []).filter((r) => !r.fromPharmacist && (r.by === userName || r.by === "Dr. Al-Thani"));
  const submit = () => {
    if (!f.item || !f.qty || f.qty < 1) return;
    addMedReq({ item: f.item, qty: Number(f.qty), source: f.source, by: userName, destCamp: allocatedCamp, fromPharmacist: false });
    if (f.source === "Main store") notify("Requests", ["Store"], `🩺 ${userName} requests ${f.qty} × ${f.item} from the store. Please confirm stock availability.`);
    else notify("Requests", ["Pharmacist"], `🩺 ${userName} requests ${f.qty} × ${f.item} from ${f.source}. Please confirm stock availability.`);
    setOpen(false); setF({ item: REQ_MEDS[0], qty: 1, source: "Main store" });
  };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 6, display: "block" };
  const fld = { width: "100%", height: 44, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  return (<Page title="My requests" subtitle="Items you've requested — track each stage from source confirmation to delivery."
    info="Request a medication from a camp/clinic or the main store. Flow: the source confirms stock → Management/Sub-management approves → the source fulfils and it's delivered to you. The status here updates at every stage."
    action={<button onClick={() => setOpen(true)} style={btn(t)}><Plus size={15} /> New request</button>}>
    {mine.length === 0
      ? <div style={{ ...card(t), textAlign: "center", color: t.textMuted, fontSize: 13.5, padding: "30px 16px" }}>No requests yet. Tap “New request” to ask for an item from a camp, clinic, or the store.</div>
      : <div style={{ display: "grid", gap: 10 }}>{mine.map((r) => { const s = stageBadge(t, r.stage);
        return (<div key={r.id} style={card(t)}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{r.item}</span><span style={{ fontSize: 12, fontWeight: 700, color: s.fg, background: s.bg, padding: "4px 11px", borderRadius: 20 }}>{s.l}</span></div>
          <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 7, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>{r.qty} units · from <strong style={{ color: t.text }}>{r.source}</strong></div>
          {r.stage !== "declined" && <StageTrack t={t} stage={r.stage} />}
          {r.srcActor && <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 6 }}>Stock confirmed by {r.srcActor}{r.actor ? ` · approved by ${r.actor}` : ""}</div>}
          {r.stage === "declined" && <div style={{ fontSize: 11.5, color: t.danger, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}><X size={13} /> Declined by {r.actor || r.srcDecliner || "reviewer"}{r.declineReason ? ` — ${r.declineReason}` : ""}.</div>}
        </div>); })}</div>}
    {open && <Modal title="New item request" icon={ArrowLeftRight} onClose={() => setOpen(false)}>
      <label style={lab}>Medication</label>
      <select value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{REQ_MEDS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 14 }}>
        <div><label style={lab}>Quantity</label><input type="number" min="1" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={fld} /></div>
        <div><label style={lab}>Request from</label><select value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} style={fld}>{sources.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> This goes to Management/Sub-management for approval. Once approved, the pharmacist at {f.source} is notified.</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}><button onClick={() => setOpen(false)} style={btn(t, "ghost")}>Cancel</button><button onClick={submit} style={btn(t)}><Send size={15} /> Submit request</button></div>
    </Modal>}
  </Page>);
}

/* ================= SUPPORT + DESIGN (admin) ================= */
function SupportPanel({ onClose }) {
  const t = useT(); const [msgs, setMsgs] = useState([{ role: "agent", text: "Hi — I'm your Khazeen support agent. Describe any issue, failure, or special request from management and I'll help resolve or route it." }]); const [input, setInput] = useState("");
  const chips = ["App not syncing at a camp", "Add a custom monthly report", "A user can't sign in", "Build a new dashboard widget"];
  const send = (text) => { if (!text.trim()) return; const reply = `Got it — "${text.trim()}". Here's how I'd approach this:\n\n1. Reproduce & scope (which camp, profile, screen).\n2. Likely cause + a quick fix to try now.\n3. If it needs a change, I'll draft the spec and route it to the dev queue.\n\nStart on step 1, or open a ticket for management visibility?`; setMsgs((m) => [...m, { role: "user", text: text.trim() }, { role: "agent", text: reply }]); setInput(""); };
  return (<Modal title="Support & AI agent" icon={LifeBuoy} onClose={onClose} width={560}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>{chips.map((c) => <button key={c} onClick={() => send(c)} style={{ fontSize: 12, padding: "6px 11px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer" }}>{c}</button>)}</div>
    <div style={{ display: "grid", gap: 10, maxHeight: 320, overflowY: "auto", marginBottom: 14 }}>{msgs.map((m, i) => (<div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "82%", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.55, padding: "10px 13px", borderRadius: 12, background: m.role === "user" ? t.primary : t.surfaceAlt, color: m.role === "user" ? "#fff" : t.text }}>{m.text}</div></div>))}</div>
    <div style={{ display: "flex", gap: 8 }}><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Describe the issue or request…" style={{ flex: 1, height: 44, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 14px", outline: "none" }} /><button onClick={() => send(input)} style={{ ...btn(t), height: 44 }}><Send size={16} /></button></div>
    <p style={{ fontSize: 11.5, color: t.textMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> In production this connects to an AI backend (e.g. the Claude API) and your ticketing system.</p>
  </Modal>);
}
function DesignPanel({ brand, setBrand, onClose }) {
  const t = useT(); const swatches = ["#1A5276", "#0E5C8A", "#0E7C7B", "#6C3FA0", "#9A3B5E", "#1E7E45", "#A65A11", "#2C3E50"];
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 8, display: "block" }; const set = (k, v) => setBrand({ ...brand, [k]: v });
  const logoRef = useRef(null); const logoEmojis = ["💊", "🏥", "⚕️", "🩺", "⚙️", "📦"];
  return (<Modal title="Design & branding" icon={Palette} onClose={onClose} width={500}>
    <label style={lab}>Logo</label>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.primary, display: "grid", placeItems: "center", fontSize: 22, overflow: "hidden", flexShrink: 0 }}>{brand.logo && brand.logo.startsWith("blob:") ? <img src={brand.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (brand.logo || "💊")}</div>
      {logoEmojis.map((e) => <button key={e} onClick={() => set("logo", e)} style={{ width: 38, height: 38, borderRadius: "50%", border: brand.logo === e ? `2px solid ${t.primary}` : `1px solid ${t.border}`, background: t.surfaceAlt, cursor: "pointer", fontSize: 18 }}>{e}</button>)}
      <button onClick={() => logoRef.current?.click()} style={{ ...btn(t, "ghost"), height: 38 }}><Upload size={14} /> Photo</button>
      <input ref={logoRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) set("logo", URL.createObjectURL(f)); }} style={{ display: "none" }} />
    </div>
    <label style={lab}>App name</label><input value={brand.appName} onChange={(e) => set("appName", e.target.value)} style={{ width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box", marginBottom: 18 }} />
    <label style={lab}>Primary colour</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>{swatches.map((s) => <button key={s} onClick={() => set("primary", s)} aria-label={s} style={{ width: 34, height: 34, borderRadius: "50%", background: s, cursor: "pointer", border: brand.primary === s ? `3px solid ${t.text}` : `1px solid ${t.border}` }} />)}<input type="color" value={brand.primary || "#1A5276"} onChange={(e) => set("primary", e.target.value)} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${t.border}`, cursor: "pointer", background: "none" }} /></div>
    <label style={lab}>Accent colour</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>{["#0E7C7B", "#2E86C1", "#9A3B5E", "#A65A11", "#6C3FA0"].map((s) => <button key={s} onClick={() => set("accent", s)} aria-label={s} style={{ width: 34, height: 34, borderRadius: "50%", background: s, cursor: "pointer", border: brand.accent === s ? `3px solid ${t.text}` : `1px solid ${t.border}` }} />)}<input type="color" value={brand.accent || "#0E7C7B"} onChange={(e) => set("accent", e.target.value)} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${t.border}`, cursor: "pointer", background: "none" }} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
      <div><label style={lab}>Font</label><select value={brand.font} onChange={(e) => set("font", e.target.value)} style={{ width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px" }}>{Object.keys(FONTS).map((f) => <option key={f}>{f}</option>)}</select></div>
      <div><label style={lab}>Table density</label><select value={brand.density || "Comfortable"} onChange={(e) => set("density", e.target.value)} style={{ width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px" }}><option>Comfortable</option><option>Compact</option></select></div>
    </div>
    <label style={lab}>DHP CPD / MOPH accreditation link</label><input value={brand.cpdLink} onChange={(e) => set("cpdLink", e.target.value)} style={{ width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 12.5, padding: "0 12px", outline: "none", boxSizing: "border-box", marginBottom: 20 }} />
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => setBrand(DEFAULT_BRAND)} style={{ ...btn(t, "ghost"), flex: "0 0 auto", height: 44 }} title="Restore the original Ministry of Defence navy & gold design"><RotateCcw size={15} /> Reset to default</button>
      <button onClick={onClose} style={{ ...btn(t), flex: 1, height: 44, justifyContent: "center" }}><Check size={16} /> Done — changes apply live</button>
    </div>
    <p style={{ fontSize: 11, color: t.textMuted, marginTop: 10, display: "flex", gap: 6 }}><Info size={12} style={{ flexShrink: 0, marginTop: 1 }} /> "Reset to default" restores the original Khazeen design (navy + gold, pill logo, Inter) — use it any time a custom look isn't working out.</p>
  </Modal>);
}
/* ================= SETTINGS (Admin) ================= */
function SettingsScreen({ brand, setBrand, dark, setDark }) {
  const t = useT(); const [design, setDesign] = useState(false); const [support, setSupport] = useState(false);
  const Tile = ({ icon: Icon, color, title, desc, onClick, btnLabel }) => (<div style={card(t)}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
      <div style={roundIcon(t, color + "1A")}><Icon size={20} color={color} /></div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div><div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 3, lineHeight: 1.5 }}>{desc}</div></div>
    </div>
    <button onClick={onClick} style={{ ...btn(t), marginTop: 14 }}>{btnLabel}</button>
  </div>);
  return (<Page title="Settings" subtitle="Administrator controls — branding, appearance and support."
    info="Admin-only. Customise the app's identity and theme, switch light/dark, and reach the support & AI agent. In production this also holds system configuration and integrations.">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      <Tile icon={Palette} color={t.accent} title="Design & branding" desc="Logo, app name, primary & accent colours, font, table density and the CPD link — applied live across the app." onClick={() => setDesign(true)} btnLabel={<><Palette size={15} /> Open design panel</>} />
      <Tile icon={LifeBuoy} color={t.primary} title="Support & AI agent" desc="Report issues or special requests from management; the assistant helps resolve or route them." onClick={() => setSupport(true)} btnLabel={<><LifeBuoy size={15} /> Open support</>} />
      <div style={card(t)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
          <div style={roundIcon(t, t.gold + "22")}>{dark ? <Moon size={20} color={t.gold} /> : <Sun size={20} color={t.gold} />}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700 }}>Appearance</div><div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 3, lineHeight: 1.5 }}>Switch between light and dark across the whole app.</div></div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ ...btn(t, "ghost"), marginTop: 14 }}>{dark ? <><Sun size={15} /> Switch to light</> : <><Moon size={15} /> Switch to dark</>}</button>
      </div>
    </div>
    <div style={{ ...card(t), marginTop: 16, fontSize: 12.5, color: t.textMuted, display: "flex", alignItems: "center", gap: 8 }}><Info size={15} /> Khazeen® v1.0 · Pharmacy Solutions® · Run by Ministry of Defence — Qatar.</div>
    {design && <DesignPanel brand={brand} setBrand={setBrand} onClose={() => setDesign(false)} />}
    {support && <SupportPanel onClose={() => setSupport(false)} />}
  </Page>);
}

/* ================= INSPECTIONS (Inspector role + viewable by mgmt) ================= */
const INSPECT_CHECKS = [
  { key: "disp_checked", label: "Dispensing records — checked" },
  { key: "disp_registered", label: "Dispensing records — registered" },
  { key: "disp_filed", label: "Dispensing records — filed" },
  { key: "cleanliness", label: "Pharmacy cleanliness & tidiness" },
  { key: "tasks_done", label: "Daily tasks completed" },
];
const INSPECT_SEED = [
  { id: 1, camp: "Tariq Camp", inspector: "Shayma'a", pharmacist: "Yaqeen", arrival: "09:10", leave: "09:55", rating: 7, comments: "Good order overall; expiry shelf needs tidying.", reqs: "Replace 2 broken shelf bins", checks: { disp_checked: true, disp_registered: true, disp_filed: false, cleanliness: true, tasks_done: true }, when: "Today" },
];
function Inspections({ role, allocatedCamp, notify }) {
  const t = useT(); const { camps, campZones, setRating } = useApp();
  const isInspector = role === "Inspector";
  const [reports, setReports] = useState(INSPECT_SEED); const [modal, setModal] = useState(null);
  const save = (r) => {
    if (r.id) setReports((p) => p.map((x) => x.id === r.id ? r : x));
    else setReports((p) => [{ ...r, id: Date.now(), when: "Just now" }, ...p]);
    setRating(r.camp, r.rating);
    notify("Rating", ["Management", "Sub-Manager"], `${r.camp} rated ${r.rating}/10 by Inspector ${r.inspector}.`);
    notify("Inspection", ["Management", "Sub-Manager"], `Inspection report filed for ${r.camp}.`);
    if (r.reqs && r.reqs.trim()) notify("Requests", ["Management", "Sub-Manager"], `Pharmacy requirement from ${r.camp}: ${r.reqs}`);
    setModal(null);
  };
  return (<Page title="Inspections" subtitle={isInspector ? "Inspect the pharmacies in your assigned zone and file reports." : "Inspection reports across all zones."}
    info="Inspectors record arrival/leave time, comments, a ✅/❌ checklist (dispensing records checked/registered/filed, cleanliness, daily tasks), pharmacy requirements (sent as requests), and a 0–10 rating. Filing notifies Management and Sub-Manager, and updates the camp's rating circle in the hub."
    action={<><ExportButton title="Inspection reports" build={() => ({ bodyHTML: `<table><thead><tr><th>Camp/clinic</th><th>Inspector</th><th>Pharmacist</th><th>Arrival</th><th>Leave</th><th>Rating</th><th>Comments</th></tr></thead><tbody>${reports.map((r) => `<tr><td>${escapeHTML(r.camp || "")}</td><td>${escapeHTML(r.inspector || "")}</td><td>${escapeHTML(r.pharmacist || "")}</td><td>${escapeHTML(r.arrive || "")}</td><td>${escapeHTML(r.leave || "")}</td><td>${r.rating}/10</td><td>${escapeHTML(r.comments || "")}</td></tr>`).join("")}</tbody></table>`, text: `${reports.length} inspection report(s).` })} />{isInspector && <button onClick={() => setModal({})} style={btn(t)}><Plus size={15} /> New inspection</button>}</>}>
    <div style={{ display: "grid", gap: 12 }}>{reports.map((r) => (<div key={r.id} style={card(t)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><RatingCircle value={r.rating} />
          <div><div style={{ fontSize: 15, fontWeight: 700 }}>{r.camp}</div><div style={{ fontSize: 12, color: t.textMuted }}>{campZones[r.camp] || "—"} zone · {r.when}</div></div></div>
        {isInspector && <button onClick={() => setModal(r)} style={{ ...btn(t, "ghost"), height: 34, fontSize: 12 }}><Pencil size={13} /> Edit</button>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, fontSize: 12.5, color: t.textMuted }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {r.arrival} → {r.leave}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Users size={13} /> Pharmacist: {r.pharmacist}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ScanSearch size={13} /> Inspector: {r.inspector}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 6, marginTop: 12 }}>{INSPECT_CHECKS.map((c) => (<div key={c.key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5 }}>{r.checks[c.key] ? <CheckCircle2 size={15} color={t.success} /> : <X size={15} color={t.danger} />} {c.label}</div>))}</div>
      {r.comments && <div style={{ marginTop: 12, fontSize: 13, background: t.surfaceAlt, borderRadius: 9, padding: "10px 12px" }}><span style={{ color: t.textMuted, fontWeight: 600 }}>Comments: </span>{r.comments}</div>}
      {r.reqs && <div style={{ marginTop: 8, fontSize: 12.5, color: t.accent, display: "flex", alignItems: "center", gap: 6 }}><ArrowLeftRight size={13} /> Requirement sent as request: {r.reqs}</div>}
    </div>))}</div>
    {modal && <InspectModal initial={modal} camps={camps.filter((c) => !isInspector || campZones[c] === "Mid")} onClose={() => setModal(null)} onSave={save} />}
  </Page>);
}
function InspectModal({ initial, camps, onClose, onSave }) {
  const t = useT();
  const [f, setF] = useState({ id: initial.id, camp: initial.camp || camps[0] || "", inspector: initial.inspector || "Shayma'a", pharmacist: initial.pharmacist || "", arrival: initial.arrival || "", leave: initial.leave || "", rating: initial.rating ?? 8, comments: initial.comments || "", reqs: initial.reqs || "", checks: initial.checks || { disp_checked: false, disp_registered: false, disp_filed: false, cleanliness: false, tasks_done: false } });
  const v = f.camp && f.pharmacist && f.arrival && f.leave;
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  const rc = rateColor(t, f.rating);
  return (<Modal title={f.id ? "Edit inspection" : "New inspection"} icon={ScanSearch} onClose={onClose} width={520}>
    <label style={lab}>Camp / clinic</label><select value={f.camp} onChange={(e) => setF({ ...f, camp: e.target.value })} style={{ ...fld, marginBottom: 14 }}>{camps.map((c) => <option key={c}>{c}</option>)}</select>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Inspector (name)</label><input value={f.inspector} onChange={(e) => setF({ ...f, inspector: e.target.value })} style={fld} /></div>
      <div><label style={lab}>Pharmacist (user)</label><input value={f.pharmacist} onChange={(e) => setF({ ...f, pharmacist: e.target.value })} style={fld} placeholder="Name" /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div><label style={lab}>Arrival time</label><input type="time" value={f.arrival} onChange={(e) => setF({ ...f, arrival: e.target.value })} style={fld} /></div>
      <div><label style={lab}>Leave time</label><input type="time" value={f.leave} onChange={(e) => setF({ ...f, leave: e.target.value })} style={fld} /></div>
    </div>
    <label style={lab}>Inspection checklist (tap to toggle ✅ / ❌)</label>
    <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>{INSPECT_CHECKS.map((c) => { const on = f.checks[c.key];
      return (<button key={c.key} onClick={() => setF({ ...f, checks: { ...f.checks, [c.key]: !on } })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, cursor: "pointer", fontSize: 13, color: t.text, textAlign: "left" }}>{on ? <CheckCircle2 size={17} color={t.success} /> : <X size={17} color={t.danger} />} {c.label}</button>); })}</div>
    <label style={lab}>Rating: <b style={{ color: rc.fg }}>{f.rating}/10</b></label>
    <input type="range" min={0} max={10} value={f.rating} onChange={(e) => setF({ ...f, rating: Number(e.target.value) })} style={{ width: "100%", marginBottom: 14, accentColor: rc.fg }} />
    <label style={lab}>Visit comments</label><textarea value={f.comments} onChange={(e) => setF({ ...f, comments: e.target.value })} rows={2} style={{ ...fld, height: "auto", padding: "10px 12px", marginBottom: 14, resize: "vertical", fontFamily: "inherit" }} />
    <label style={lab}>Pharmacy requirements (sent as a request to Management & Sub-Manager)</label><textarea value={f.reqs} onChange={(e) => setF({ ...f, reqs: e.target.value })} rows={2} style={{ ...fld, height: "auto", padding: "10px 12px", marginBottom: 18, resize: "vertical", fontFamily: "inherit" }} placeholder="e.g. needs a new fridge thermometer" />
    <button onClick={() => onSave(f)} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Send size={16} /> File report & notify management</button>
  </Modal>);
}

/* ================= ZONES (categorize camps + assign inspectors) ================= */
const INSPECTOR_SEED = [{ id: 1, name: "Shayma'a", zone: "Mid" }, { id: 2, name: "K. Fahad", zone: "North" }, { id: 3, name: "Y. Hamad", zone: "South" }];
function Zones() {
  const t = useT(); const { camps, campZones, setCampZone, ratings } = useApp();
  const [inspectors, setInspectors] = useState(INSPECTOR_SEED); const [addInsp, setAddInsp] = useState(false);
  return (<Page title="Zones" subtitle="Categorize camps/clinics into North, Mid and South — and assign inspectors."
    info="Group every camp/clinic into a zone. Inspectors are assigned per zone and inspect the pharmacies in their zone. Changing a camp's zone moves it instantly across the hub and inspection views."
    action={<button onClick={() => setAddInsp(true)} style={btn(t)}><Plus size={15} /> Add inspector</button>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {ZONES.map((zone) => { const zc = camps.filter((c) => campZones[c] === zone); const zi = inspectors.filter((i) => i.zone === zone);
        return (<div key={zone} style={card(t)}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}><div style={roundIcon(t, t.primarySoft)}><Compass size={18} color={t.primary} /></div><div><div style={{ fontSize: 15, fontWeight: 700 }}>{zone} zone</div><div style={{ fontSize: 11.5, color: t.textMuted }}>{zc.length} camp{zc.length === 1 ? "" : "s"} · {zi.length} inspector{zi.length === 1 ? "" : "s"}</div></div></div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: t.textMuted, marginBottom: 6 }}>🔍 Inspectors</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{zi.length === 0 ? <span style={{ fontSize: 12, color: t.textMuted }}>None assigned</span> : zi.map((i) => <span key={i.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: t.accent, background: t.primarySoft, padding: "4px 10px", borderRadius: 20 }}>{i.name}<button onClick={() => setInspectors((p) => p.filter((x) => x.id !== i.id))} aria-label="Remove" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, color: t.accent, display: "grid" }}><X size={12} /></button></span>)}</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: t.textMuted, marginBottom: 6 }}>Camps / clinics</div>
          <div style={{ display: "grid", gap: 6 }}>{zc.map((c) => (<div key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 10px", borderRadius: 9, background: t.surfaceAlt }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600 }}><RatingCircle value={ratings[c] ?? null} size={26} /> {c}</span>
            <select value={campZones[c]} onChange={(e) => setCampZone(c, e.target.value)} style={{ height: 28, borderRadius: 7, fontSize: 12, border: `1px solid ${t.border}`, background: t.input, color: t.text, padding: "0 6px", fontWeight: 600 }}>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
          </div>))}{zc.length === 0 && <span style={{ fontSize: 12, color: t.textMuted }}>No camps in this zone.</span>}</div>
        </div>); })}
    </div>
    {addInsp && <AddInspector onClose={() => setAddInsp(false)} onSave={(i) => { setInspectors((p) => [...p, { ...i, id: Date.now() }]); setAddInsp(false); }} />}
  </Page>);
}
function AddInspector({ onClose, onSave }) {
  const t = useT(); const [f, setF] = useState({ name: "", zone: "North" }); const v = f.name.trim();
  const fld = { width: "100%", height: 42, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Modal title="Add inspector" icon={ScanSearch} onClose={onClose}>
    <label style={lab}>Inspector name</label><input value={f.name} autoFocus onChange={(e) => setF({ ...f, name: e.target.value })} style={{ ...fld, marginBottom: 14 }} />
    <label style={lab}>Assigned zone</label><select value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })} style={{ ...fld, marginBottom: 18 }}>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
    <button onClick={() => onSave({ name: f.name.trim(), zone: f.zone })} disabled={!v} style={{ ...btn(t), width: "100%", height: 46, justifyContent: "center", opacity: v ? 1 : 0.5 }}><Plus size={16} /> Add inspector</button>
  </Modal>);
}

/* ================= NOTIFICATIONS (per-role center + channels) ================= */
function Notifications({ role }) {
  const t = useT(); const { notifs, setNotifs, channels, setChannels } = useApp();
  const [filter, setFilter] = useState("All");
  const mine = notifs.filter((n) => n.to.includes(role));
  const shown = filter === "All" ? mine : mine.filter((n) => n.kind === filter);
  const kinds = ["All", ...Object.keys(NOTIF_KINDS)];
  const tone = (k) => t[NOTIF_KINDS[k]?.fg] || t.primary;
  const markAll = () => setNotifs((p) => p.map((n) => n.to.includes(role) ? { ...n, read: true } : n));
  const Ch = ({ k, label, icon: Icon }) => (<button onClick={() => setChannels({ ...channels, [k]: !channels[k] })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: `1px solid ${channels[k] ? t.primary : t.border}`, background: channels[k] ? t.primarySoft : t.surface, cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.text }}><Icon size={16} color={channels[k] ? t.primary : t.textMuted} /> {label}<span style={{ marginLeft: "auto", fontSize: 11, color: channels[k] ? t.primary : t.textMuted }}>{channels[k] ? "On" : "Off"}</span></button>);
  return (<Page title="Notifications" subtitle="Your alerts, filtered by kind. Choose how you're notified."
    info="Notifications are role-specific and split by kind: Approval, Rating, Camp change, Requests, License, Expiry and Inspection. Toggle channels — keep in-app only, or turn push / email / WhatsApp on or off."
    action={<button onClick={markAll} style={btn(t, "ghost")}><Check size={15} /> Mark all read</button>}>
    <div style={{ ...card(t), marginBottom: 16 }}>
      <p style={{ ...ttl(t), marginBottom: 12 }}><Bell size={16} color={t.primary} /> Delivery channels</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <Ch k="inApp" label="In-app" icon={Bell} /><Ch k="push" label="Push" icon={Smartphone} /><Ch k="email" label="Email" icon={Mail} /><Ch k="whatsapp" label="WhatsApp" icon={Phone} />
      </div>
      <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><Info size={13} /> Turn everything but In-app off for in-app only, or pick a single channel.</div>
    </div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{kinds.map((k) => <button key={k} onClick={() => setFilter(k)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, border: `1px solid ${filter === k ? t.primary : t.border}`, background: filter === k ? t.primarySoft : t.surface, color: filter === k ? t.primary : t.textMuted, fontWeight: 600, cursor: "pointer" }}>{k}</button>)}</div>
    <div style={{ display: "grid", gap: 8 }}>{shown.length === 0 && <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13, padding: "30px 0" }}>No notifications{filter !== "All" ? ` of kind "${filter}"` : ""}.</div>}
      {shown.map((n) => { const Icon = NOTIF_KINDS[n.kind]?.icon || Bell; const c = tone(n.kind);
        return (<div key={n.id} onClick={() => setNotifs((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 10, background: n.read ? t.surface : t.surfaceAlt, border: `1px solid ${t.border}`, cursor: "pointer" }}>
          <div style={roundIcon(t, c + "22")}><Icon size={17} color={c} /></div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: c }}>{n.kind}</span><span style={{ fontSize: 11, color: t.textMuted }}>{n.time}</span>{!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.danger }} />}</div><div style={{ fontSize: 13.5, marginTop: 3 }}>{n.text}</div></div>
        </div>); })}</div>
  </Page>);
}

/* ================= HOME (personal landing) ================= */
const AFFIRMATIONS = {
  pharmacist: [
    "Every prescription you check is a patient protected. Precision is care.",
    "The pharmacist is the last safeguard before a medicine reaches a patient — your vigilance matters.",
    "Counsel with kindness: a patient who understands their medicine heals better.",
    "Accuracy, confidentiality, integrity — the quiet ethics that define our profession.",
    "Good stock discipline today prevents a shortage at someone's bedside tomorrow.",
    "You bridge science and humanity. Dispense knowledge alongside every dose.",
    "Double-check the dose, honour the patient. Diligence is compassion in practice.",
  ],
  medical: [
    "First, do no harm — and second, do real good. Your judgement changes lives.",
    "Listen fully before you decide. The history is half the diagnosis.",
    "Compassion is a clinical skill. Treat the person, not just the condition.",
    "Confidentiality is trust made tangible. Guard it as you would a life.",
    "Evidence guides, ethics anchor, empathy heals — practice all three.",
    "Behind every chart is a human being hoping for your best.",
    "Your calm presence is itself a treatment. Lead with steadiness.",
  ],
};
function ExpiryCockpit({ role }) {
  const t = useT();
  const dd = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);
  const rows = LOG_SEED.map((r) => ({ ...r, days: dd(r.expiry), bal: r.begin - r.dispensed - r.moved }));
  const expired = rows.filter((r) => r.days <= 0);
  const soon30 = rows.filter((r) => r.days > 0 && r.days <= 30);
  const soon90 = rows.filter((r) => r.days > 30 && r.days <= 90);
  const reorder = rows.filter((r) => r.min != null && r.bal <= r.min);
  const watch = [...expired.map((r) => ({ ...r, lv: "expired" })), ...soon30.map((r) => ({ ...r, lv: "30" })), ...soon90.map((r) => ({ ...r, lv: "90" }))].sort((a, b) => a.days - b.days);
  const Stat = ({ label, value, tone, icon: Icon }) => (<div style={{ ...card(t), padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, borderColor: value > 0 ? t[tone] + "55" : t.border }}>
    <span style={{ width: 40, height: 40, borderRadius: 11, background: t[tone + "Soft"], display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={19} color={t[tone]} /></span>
    <div><div style={{ fontSize: 23, fontWeight: 800, color: value > 0 ? t[tone] : t.text, lineHeight: 1 }}>{value}</div><div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 3 }}>{label}</div></div>
  </div>);
  return (<div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><AlertTriangle size={18} color={t.danger} /><span style={{ fontSize: 15, fontWeight: 700 }}>Expiry &amp; reorder cockpit</span><span style={{ fontSize: 11.5, color: t.textMuted }}>— what needs action today</span></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 14 }}>
      <Stat label="Expired" value={expired.length} tone="danger" icon={AlertTriangle} />
      <Stat label="Expiring ≤ 30 days" value={soon30.length} tone="danger" icon={CalendarClock} />
      <Stat label="Expiring ≤ 90 days" value={soon90.length} tone="warning" icon={CalendarClock} />
      <Stat label="Below reorder level" value={reorder.length} tone="accent" icon={PackagePlus} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div style={card(t)}>
        <p style={{ ...ttl(t), marginBottom: 10 }}><CalendarClock size={16} color={t.danger} /> Expiry watch</p>
        {watch.length === 0 ? <div style={{ fontSize: 12.5, color: t.textMuted }}>Nothing expiring within 90 days.</div>
          : <div style={{ display: "grid", gap: 7 }}>{watch.slice(0, 6).map((r) => { const c = r.lv === "90" ? t.warning : t.danger;
            return (<div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 11px", borderRadius: 9, background: t.surfaceAlt }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div><div style={{ fontSize: 10.5, color: t.textMuted, fontFamily: "monospace" }}>{r.batch} · {r.bal} on hand</div></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c, background: c + "1A", padding: "3px 9px", borderRadius: 12, whiteSpace: "nowrap" }}>{r.days <= 0 ? "expired" : `${r.days}d`}</span>
            </div>); })}</div>}
      </div>
      <div style={card(t)}>
        <p style={{ ...ttl(t), marginBottom: 10 }}><PackagePlus size={16} color={t.accent} /> Reorder this cycle</p>
        {reorder.length === 0 ? <div style={{ fontSize: 12.5, color: t.textMuted }}>All items above their reorder level.</div>
          : <div style={{ display: "grid", gap: 7 }}>{reorder.map((r) => { const suggested = Math.max(0, (r.max || r.min * 2) - r.bal);
            return (<div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 11px", borderRadius: 9, background: t.surfaceAlt }}>
              <PackagePlus size={14} color={t.accent} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div><div style={{ fontSize: 10.5, color: t.textMuted }}>{r.bal} on hand · min {r.min} / max {r.max}</div></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, background: t.primarySoft, padding: "3px 9px", borderRadius: 12, whiteSpace: "nowrap" }}>order {suggested}</span>
            </div>); })}</div>}
      </div>
    </div>
  </div>);
}
function Home({ role, userName, license }) {
  const t = useT(); const isMedical = role === "Medical";
  const set = isMedical ? AFFIRMATIONS.medical : AFFIRMATIONS.pharmacist;
  const idx = new Date().getDate() % set.length; const affirmation = set[idx];
  const [photo, setPhoto] = useState(""); const ref = useRef(null);
  const [note, setNote] = useState("Remember: check the fridge log before noon.");
  const greeting = (() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })();
  const showCockpit = !isMedical && role !== "Inspector";
  return (<Page title="Home" subtitle="Your space.">
    {/* header: greeting + today's reminder, full width, above the cockpit */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "stretch", marginBottom: 18 }}>
      <div style={card(t)}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: t.surfaceAlt, display: "grid", placeItems: "center", fontSize: 34, position: "relative", overflow: "hidden", flexShrink: 0 }}>
            {photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <RoleGlyph role={role} size={76} />}
            <button onClick={() => ref.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: t.primary, border: `2px solid ${t.surface}`, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><Camera size={12} /></button>
          </div>
          <input ref={ref} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} style={{ display: "none" }} />
          <div>
            <div style={{ fontSize: 13, color: t.textMuted }}>{greeting},</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: SCRIPT }}>{userName}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: t.textMuted, marginTop: 4 }}><RoleGlyph role={role} size={24} /> {role} · {ROLE[role].sub}</div>
          </div>
        </div>
      </div>
      <div style={{ ...card(t), background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`, color: "#fff", border: "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.6 }}><Sparkles size={15} /> Today's reminder</div>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginTop: 10 }}>{affirmation}</div>
        <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 12 }}>{isMedical ? "On the ethics & calling of medical practice" : "On the ethics & calling of pharmacy practice"}</div>
      </div>
    </div>
    {showCockpit && <ExpiryCockpit role={role} />}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 16 }}>
        {license && (() => { const lic = licenseLevel(license.expiry); return lic ? <div style={{ ...card(t), display: "flex", alignItems: "center", gap: 10, borderColor: t.warning + "55" }}><Award size={18} color={t.warning} /><span style={{ fontSize: 13 }}>License {lic.txt} — open CPD to plan renewal.</span></div> : null; })()}
      </div>
      {/* sticky note — straight & symmetric */}
      <div>
        <div style={{ background: "#FFF4B8", color: "#4A3F12", borderRadius: 14, padding: "18px 18px 22px", boxShadow: "0 8px 22px rgba(0,0,0,0.12)", minHeight: 200, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, marginBottom: 10, opacity: 0.7 }}><StickyNote size={15} /> My note</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Jot a reminder for yourself…" style={{ width: "100%", minHeight: 140, border: "none", background: "transparent", resize: "vertical", outline: "none", fontSize: 15, lineHeight: 1.6, color: "#4A3F12", fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", boxSizing: "border-box" }} />
        </div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 10, display: "flex", gap: 6 }}><Info size={12} /> Your note and photo stay on this device (prototype).</div>
      </div>
    </div>
  </Page>);
}

/* ================= PROFILE (credentials + license/cert upload) ================= */
const PROFILE_SEED = { name: "", phone: "+974 5500 0000", email: "user@modq.qa", license: "PH-33910", licenseExpiry: "2026-11-20", photo: "", docs: [{ id: 1, kind: "License", name: "pharmacy_license.pdf" }, { id: 2, kind: "Certificate", name: "bls_certificate.pdf" }] };
function Profile({ role, allocatedCamp, license }) {
  const t = useT();
  const [p, setP] = useState({ ...PROFILE_SEED, name: ROLE[role].sub, license: license.number, licenseExpiry: license.expiry });
  const [edit, setEdit] = useState(false); const ref = useRef(null);
  const lic = licenseLevel(p.licenseExpiry);
  const addDoc = (kind, name) => setP((x) => ({ ...x, docs: [...x.docs, { id: Date.now(), kind, name }] }));
  const fld = { width: "100%", height: 40, borderRadius: 9, border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, fontSize: 14, padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lab = { fontSize: 12, color: t.textMuted, fontWeight: 600, marginBottom: 5, display: "block" };
  return (<Page title="Profile" subtitle="Your credentials, license and certificates."
    info="Edit your photo and credentials, and upload your license and certificates. Management, Admin and Sub-Manager can view all profiles."
    action={<button onClick={() => setEdit(!edit)} style={btn(t, edit ? "primary" : "ghost")}>{edit ? <><Check size={15} /> Done</> : <><Pencil size={15} /> Edit</>}</button>}>
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
      <div style={card(t)}>
        <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: t.surfaceAlt, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>{p.photo ? <img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <RoleGlyph role={role} size={110} />}
            {edit && <button onClick={() => ref.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 34, height: 34, borderRadius: "50%", background: t.primary, border: `2px solid ${t.surface}`, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><Camera size={16} /></button>}
          </div>
          <input ref={ref} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setP((x) => ({ ...x, photo: URL.createObjectURL(f) })); }} style={{ display: "none" }} />
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><RoleGlyph role={role} size={26} /> {role === "Medical" ? "Doctor · Medical" : role}</div>
          <div style={{ fontSize: 12.5, color: t.textMuted, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {allocatedCamp}</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={card(t)}>
          <p style={{ ...ttl(t), marginBottom: 14 }}><CreditCard size={16} color={t.primary} /> Credentials</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Phone", "phone"], ["Email", "email"], ["License no.", "license"], ["License expiry", "licenseExpiry"]].map(([l, k]) => (<div key={k}><label style={lab}>{l}</label>{edit ? <input type={k === "licenseExpiry" ? "date" : "text"} value={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} style={fld} /> : <div style={{ fontSize: 14, fontWeight: 600, padding: "8px 0" }}>{k === "licenseExpiry" ? new Date(p[k]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : p[k]}</div>}</div>))}
          </div>
          {lic && <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: lic.lv === "notice" ? t.warning : t.danger, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} /> License {lic.txt}</div>}
        </div>
        <div style={card(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><p style={ttl(t)}><FileText size={16} color={t.accent} /> License & certificates</p>
            <UploadConfirm label="Upload document" hint="Attach your license or a certificate (photo or PDF) and confirm its type and name." fields={[{ key: "kind", label: "Document type", placeholder: "License / Certificate" }, { key: "name", label: "Document name", placeholder: "e.g. acls_certificate.pdf" }]} onConfirm={(v) => addDoc(v.kind, v.name)} /></div>
          <div style={{ display: "grid", gap: 8 }}>{p.docs.map((d) => (<div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 9, background: t.surfaceAlt }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9 }}><FileText size={16} color={t.primary} /><span><div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 11, color: t.textMuted }}>{d.kind}</div></span></span>
            {edit && <button onClick={() => setP((x) => ({ ...x, docs: x.docs.filter((y) => y.id !== d.id) }))} aria-label="Remove" style={{ ...miniBtn(t), color: t.danger }}><Trash2 size={12} /></button>}
          </div>))}</div>
        </div>
      </div>
    </div>
  </Page>);
}

/* ================= SHELL ================= */
function Shell({ role, dark, setDark, brand, setBrand, license, allocatedCamp, userName, onLogout }) {
  const t = useT(); const { notify, notifs } = useApp(); const nav = NAV_BY_ROLE[role]; const [route, setRoute] = useState(nav[0]);
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < 860);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { const onR = () => setMobile(window.innerWidth < 860); window.addEventListener("resize", onR); return () => window.removeEventListener("resize", onR); }, []);
  const go = (r) => { setRoute(r); setDrawer(false); };
  const canPost = role === "Admin" || role === "Management" || role === "Sub-Manager";
  const canPin = role === "Admin" || role === "Management" || role === "Sub-Manager";
  const canEditStock = ["Admin", "Management", "Sub-Manager", "Pharmacist"].includes(role);
  const privileged = ["Admin", "Management", "Sub-Manager"].includes(role);
  const lic = licenseLevel(license.expiry);
  const unread = notifs.filter((n) => n.to.includes(role) && !n.read).length;
  const screen = () => { switch (route) {
    case "home": return <Home role={role} userName={userName} license={license} />;
    case "hub": return <Hub canPost={canPost} canPin={canPin} canUnsendAny={canPin} emoji={ROLE[role].emoji} />;
    case "dashboard": return <Dashboard role={role} allocatedCamp={allocatedCamp} />;
    case "findme": return <FindMe />;
    case "logs": return <LogsScreen role={role} privileged={privileged} canEditStock={canEditStock} allocatedCamp={allocatedCamp} userName={userName} />;
    case "invlog": return <InventoryLog mode={role === "Medical" ? "viewer" : "full"} allocatedCamp={allocatedCamp} role={role} userName={userName} />;
    case "chronic": return <ChronicLog mode={role === "Medical" ? "viewer" : "full"} allocatedCamp={allocatedCamp} role={role} userName={userName} />;
    case "recall": return <BatchRecall allocatedCamp={allocatedCamp} userName={userName} />;
    case "controlled": return <ControlledRegister allocatedCamp={allocatedCamp} userName={userName} role={role} />;
    case "handover": return <Handover allocatedCamp={allocatedCamp} userName={userName} />;
    case "dispensing": return <Dispensing canEdit={canEditStock} privileged={privileged} allocatedCamp={allocatedCamp} />;
    case "coldchain": return <ColdChain canEdit={role === "Admin" || role === "Pharmacist"} allocatedCamp={allocatedCamp} />;
    case "clinical": return <Clinical role={role} />;
    case "cpd": return <CPD role={role} license={license} cpdLink={brand.cpdLink} />;
    case "tasks": return <MyTasks role={role} userName={userName} />;
    case "approvals": return <Approvals role={role} />;
    case "users": return <UsersScreen canAllocate={role === "Management" || role === "Admin" || role === "Sub-Manager"} canApproveUsers={role === "Management" || role === "Admin"} adderRole={role} canViewProfiles={privileged} />;
    case "store": return <StoreGate canManageTeam={role === "Management" || role === "Sub-Manager" || role === "Admin"} userName={userName} />;
    case "storetasks": return <StoreTasks />;
    case "storereqs": return <StoreRequests userName={userName} />;
    case "storereq": return <StoreRequest allocatedCamp={allocatedCamp} role={role} userName={userName} />;
    case "radar": return <RadarScreen />;
    case "requests": return <MyRequests userName={userName} allocatedCamp={allocatedCamp} />;
    case "inspect": return <Inspections role={role} allocatedCamp={allocatedCamp} notify={notify} />;
    case "zones": return <Zones />;
    case "notifs": return <Notifications role={role} />;
    case "profile": return <Profile role={role} allocatedCamp={allocatedCamp} license={license} />;
    case "settings": return <SettingsScreen brand={brand} setBrand={setBrand} dark={dark} setDark={setDark} />;
    default: return <Hub canPost={canPost} canPin={canPin} canUnsendAny={canPin} emoji={ROLE[role].emoji} />;
  } };
  return (<div style={{ display: "flex", minHeight: "100vh", background: t.bg, color: t.text }}>
    {mobile && drawer && <div onClick={() => setDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
    <aside style={{ width: 240, background: t.sidebar, display: "flex", flexDirection: "column", padding: "20px 14px", flexShrink: 0, ...(mobile ? { position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 41, transform: drawer ? "translateX(0)" : "translateX(-100%)", transition: "transform .25s", boxShadow: drawer ? "0 0 40px rgba(0,0,0,0.5)" : "none" } : {}) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 8px 16px" }}>
        <button onClick={() => go("profile")} title="Open your profile" aria-label="Profile" style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", borderRadius: "50%", boxShadow: route === "profile" ? `0 0 0 2px ${t.gold}` : "none" }}><RoleGlyph role={role} size={48} onDark /></button>
        <div style={{ lineHeight: 1.1 }}><div style={{ fontSize: 22 }}><Wordmark size="1em" color="#fff" gold={t.gold} /></div><div style={{ fontSize: 9.5, color: t.gold, letterSpacing: 0.5, marginTop: 2, textTransform: "uppercase" }}>{role} workspace</div></div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${t.gold}88, transparent)`, marginBottom: 14 }} />
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>{nav.map((key) => { const item = NAV[key]; const Icon = item.icon; const active = route === key;
        return (<button key={key} onClick={() => go(key)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", borderRadius: 999, border: "none", cursor: "pointer", textAlign: "left", background: active ? t.sidebarActive : "transparent", color: active ? "#2A2208" : t.sidebarText, fontSize: 13.5, fontWeight: active ? 700 : 500, boxShadow: active ? "0 3px 10px rgba(0,0,0,0.22)" : "none", transition: "all .15s" }}><Icon size={17} /> <span>{item.label}</span></button>); })}</nav>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12, marginTop: 8 }}><button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", borderRadius: 999, border: "none", cursor: "pointer", background: "transparent", color: t.sidebarText, fontSize: 13, fontWeight: 600 }}><LogOut size={16} /> Sign out</button>
        <div style={{ fontSize: 9.5, color: "rgba(157,178,204,0.6)", padding: "8px 12px 0", display: "flex", justifyContent: "space-between" }}><span>Khazeen® v1.0</span><span>Run by MoDQ</span></div></div>
    </aside>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <header style={{ height: 62, background: t.surface, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: mobile ? "0 14px" : "0 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          {mobile && <button onClick={() => setDrawer(true)} aria-label="Menu" style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}><Menu size={18} /></button>}
          <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 8, background: t.primarySoft, color: t.primary, flexShrink: 0 }}>{(() => { const I = NAV[route]?.icon || Megaphone; return <I size={16} />; })()}</span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{NAV[route]?.label || "Khazeen"}</div><div style={{ fontSize: 10.5, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Khazeen® · {allocatedCamp}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 7 : 10, flexShrink: 0 }}>
          {lic && !mobile && <span title={`License ${lic.txt}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: lic.lv === "notice" ? t.warning : t.danger, background: lic.lv === "notice" ? t.warningSoft : t.dangerSoft, padding: "6px 11px", borderRadius: 20 }}><Award size={14} /> License {lic.days}d</span>}
          <button onClick={() => setDark(!dark)} aria-label="Theme" style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button onClick={() => go("notifs")} aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${t.border}`, background: t.surfaceAlt, color: t.text, cursor: "pointer", display: "grid", placeItems: "center", position: "relative", flexShrink: 0 }}><Bell size={18} />{unread > 0 && <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: t.danger, color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", border: `2px solid ${t.surface}` }}>{unread}</span>}</button>
          {!mobile && <button onClick={() => go("profile")} style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 6px 0 4px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surfaceAlt, cursor: "pointer" }}><RoleGlyph role={role} size={28} /><span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, paddingRight: 4 }}>{userName}</span></button>}
        </div>
      </header>
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minWidth: 0, padding: mobile ? 14 : 24 }}>{screen()}</main>
    </div>
  </div>);
}

/* ================= ROOT ================= */
const ALLOCATED = { Pharmacist: "Al-Udeid Clinic", Medical: "Al-Rayyan Field Clinic", "Sub-Manager": "Tariq Camp", Store: "Doha HQ", Admin: "Doha HQ", Management: "Doha HQ", Inspector: "Mid zone" };
const USER_NAMES = { Pharmacist: "Yaqeen", Medical: "Dr. Al-Thani", "Sub-Manager": "Dalia & Asmaa", Store: "Nawras", Admin: "Capt. Hassan Al-Kuwari", Management: "M. Obaidly", Inspector: "Shayma'a" };
const USER_MIL = { Pharmacist: "QA-50231", Medical: "QA-44120", "Sub-Manager": "QA-33891", Store: "QA-61740", Admin: "QA-10002", Management: "QA-20015", Inspector: "QA-47783" };
function expiryInDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
const NOTIF_SEED = [
  { id: 1, kind: "Approval", to: ["Pharmacist"], text: "Your store request for Augmentin 1000mg was approved.", time: "10m ago", read: false },
  { id: 2, kind: "Rating", to: ["Management", "Sub-Manager"], text: "Al-Udeid Clinic rated 7/10 by Inspector Shayma'a.", time: "1h ago", read: false },
  { id: 3, kind: "Inspection", to: ["Management", "Sub-Manager"], text: "Inspection report filed for Tariq Camp.", time: "2h ago", read: false },
  { id: 4, kind: "License", to: ["Pharmacist"], text: "Your license expires in 150 days — plan renewal.", time: "Today", read: true },
  { id: 5, kind: "Camp change", to: ["Medical"], text: "You were re-allocated to Al-Rayyan Field Clinic.", time: "Yesterday", read: true },
];
export default function App() {
  const [dark, setDark] = useState(false);
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState(null);
  const [camps, setCamps] = useState(DEFAULT_CAMPS);
  const [campZones, setCampZones] = useState(DEFAULT_CAMP_ZONES);
  const [ratings, setRatings] = useState({ "Al-Udeid Clinic": 7, "Doha HQ": 9, "Tariq Camp": 5, "Al-Rayyan Field Clinic": 8 });
  const [notifs, setNotifs] = useState(NOTIF_SEED);
  const [channels, setChannels] = useState({ inApp: true, push: true, email: true, whatsapp: true });
  const [showRatings, setShowRatings] = useState(true); // per-user toggle for hub rating circles
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const base = BASE[dark ? "dark" : "light"];
  useEffect(() => {
    if (document.getElementById("khz-font")) return;
    const l = document.createElement("link"); l.id = "khz-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap";
    document.head.appendChild(l);
  }, []);
  const t = { ...base, primary: brand.primary || base.primary, accent: brand.accent || base.accent };
  const fontFamily = FONTS[brand.font] || FONTS.Inter;
  const license = { number: "PH-33910", expiry: expiryInDays(150) };
  const allocatedCamp = role ? (ALLOCATED[role] || camps[0]) : camps[0];
  const userName = role ? (USER_NAMES[role] || role) : "";
  const addCamp = (name, zone = "Mid") => { setCamps((p) => p.includes(name) ? p : [...p, name]); setCampZones((p) => ({ ...p, [name]: zone })); };
  const removeCamp = (name) => { setCamps((p) => p.length > 1 ? p.filter((c) => c !== name) : p); setCampZones((p) => { const n = { ...p }; delete n[name]; return n; }); };
  const setCampZone = (name, zone) => setCampZones((p) => ({ ...p, [name]: zone }));
  const setRating = (camp, val) => setRatings((p) => ({ ...p, [camp]: val }));
  const notify = (kind, to, text) => setNotifs((p) => [{ id: Date.now(), kind, to, text, time: "Just now", read: false }, ...p]);
  const [dispensedMap, setDispensedMap] = useState({}); // `${camp}|${code}` -> month-to-date dispensed
  const setDispensed = (camp, code, qty) => setDispensedMap((p) => ({ ...p, [`${camp}|${code}`]: qty }));
  const [beginMap, setBeginMap] = useState({}); // `${camp}|${code}` -> beginning balance (set in inventory, shown in daily)
  const setBegin = (camp, code, qty) => setBeginMap((p) => ({ ...p, [`${camp}|${code}`]: qty }));
  const [invAdj, setInvAdj] = useState({}); // `${camp}|${codeOrName}` -> { recv, mov } from confirmed medical-request stock actions
  const adjustInv = (camp, key, field, delta) => setInvAdj((p) => { const k = `${camp}|${key}`; const cur = p[k] || { recv: 0, mov: 0 }; return { ...p, [k]: { ...cur, [field]: (cur[field] || 0) + delta } }; });
  const [posts, setPosts] = useState(HUB_SEED); // global hub — shared across all roles, live
  const [storeTeam, setStoreTeam] = useState(STORE_PHARM_SEED); // store roster — shared with Users screen
  const [users, setUsers] = useState(USER_SEED); // all staff — single source of truth (Users screen + store gate)
  const [storeTasks, setStoreTasks] = useState(STORE_TASKS_SEED); // store tasks — shared, Lead-assignable
  const [assignedTasks, setAssignedTasks] = useState(ASSIGNED_TASK_SEED); // delegated tasks: { id, title, detail, due, assignee, assigneeRole, by, done }
  const assignTask = (tk) => setAssignedTasks((p) => [{ ...tk, id: Date.now(), done: false }, ...p]);
  const toggleAssigned = (id) => setAssignedTasks((p) => p.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const removeAssigned = (id) => setAssignedTasks((p) => p.filter((x) => x.id !== id));
  const [medReqs, setMedReqs] = useState(MED_REQ_SEED); // medical/pharmacy item requests — shared chain: create → approve → notify source pharmacist
  const addMedReq = (r) => setMedReqs((p) => [{ ...r, id: Date.now(), stage: r.source === "Main store" ? "source_confirm" : "source_confirm", time: "Just now" }, ...p]);
  const setMedReqStatus = (id, status, actor) => setMedReqs((p) => p.map((r) => r.id === id ? { ...r, status, actor: actor || r.actor, decidedAt: "Just now" } : r));
  const patchMedReq = (id, patch) => setMedReqs((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  const [storeReqs, setStoreReqs] = useState(STORE_REQ_SEED); // pharmacist→store requests (monthly/urgent), shared so the Store can fulfil
  const [archive, setArchive] = useState(ARCHIVE_SEED); // per-camp monthly inventory snapshots: { id, camp, month, rows:[{code,name,begin,received,dispensed,moved,closing}] }
  const addArchive = (snap) => setArchive((p) => [{ ...snap, id: Date.now() }, ...p]);
  const addStoreReq = (r) => setStoreReqs((p) => [{ ...r, id: Date.now(), stage: "mgmt_approve", time: "Just now" }, ...p]);
  const patchStoreReq = (id, patch) => setStoreReqs((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  const me = role ? { name: userName, role, camp: allocatedCamp, mil: USER_MIL[role] || "—" } : null;
  const ctx = { camps, campZones, addCamp, removeCamp, setCampZone, ratings, setRating, notifs, notify, setNotifs, channels, setChannels, showRatings, setShowRatings, dispensedMap, setDispensed, beginMap, setBegin, invAdj, adjustInv, posts, setPosts, me, storeTeam, setStoreTeam, users, setUsers, storeTasks, setStoreTasks, medReqs, addMedReq, setMedReqStatus, patchMedReq, storeReqs, addStoreReq, patchStoreReq, archive, addArchive, assignedTasks, assignTask, toggleAssigned, removeAssigned };
  return (
    <ThemeCtx.Provider value={t}>
      <AppCtx.Provider value={ctx}>
        <div style={{ fontFamily, width: "100%", overflowX: "hidden" }}>
          <style>{`*{box-sizing:border-box} html,body,#root{margin:0!important;padding:0!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important} #root{position:relative}`}</style>
          {!entered ? <Splash appName={brand.appName} logo={brand.logo} onEnter={() => setEntered(true)} />
            : role ? <Shell role={role} dark={dark} setDark={setDark} brand={brand} setBrand={setBrand} license={license} allocatedCamp={allocatedCamp} userName={userName} onLogout={() => setRole(null)} />
            : <Login onLogin={setRole} appName={brand.appName} logo={brand.logo} />}
        </div>
      </AppCtx.Provider>
    </ThemeCtx.Provider>
  );
}
