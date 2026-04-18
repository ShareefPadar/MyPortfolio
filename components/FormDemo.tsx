"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Scale, Activity, Target, Trophy, Home, Ruler, TrendingUp } from "lucide-react";

// --- Chart data ---
const chartPoints = [93, 91.5, 90.2, 89.1, 88.0, 87.3, 86.5, 85.8, 85.0, 84.2, 83.6, 83.0, 82.5, 82.0, 81.6, 81.2, 80.8, 80.4, 80.0];
const goalWeight = 72;
const avgWeight = 84.5;
const CHART_W = 260;
const CHART_H = 90;
const minVal = Math.min(...chartPoints, goalWeight) - 1;
const maxVal = Math.max(...chartPoints) + 1;

const toXY = (val: number, idx: number, total: number) => ({
  x: (idx / (total - 1)) * CHART_W,
  y: CHART_H - ((val - minVal) / (maxVal - minVal)) * CHART_H,
});

const polylineStr = chartPoints.map((v, i) => { const p = toXY(v, i, chartPoints.length); return `${p.x},${p.y}`; }).join(" ");
const areaStr = [`0,${CHART_H}`, ...chartPoints.map((v, i) => { const p = toXY(v, i, chartPoints.length); return `${p.x},${p.y}`; }), `${CHART_W},${CHART_H}`].join(" ");
const goalY = CHART_H - ((goalWeight - minVal) / (maxVal - minVal)) * CHART_H;
const avgY = CHART_H - ((avgWeight - minVal) / (maxVal - minVal)) * CHART_H;

// Chart colours kept inline — SVG attributes don't support Tailwind classes
const C = { cyan: "#00c8dc", green: "#10b981", amber: "#f59e0b", bg: "#0A0C14" };

type Tab = "home" | "stats" | "progress";

const NAV: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "stats", label: "Stats", Icon: Ruler },
  { id: "progress", label: "Progress", Icon: TrendingUp },
];

const FormDemo = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="w-full max-w-sm mx-auto bg-form-bg border border-white/[7%] rounded-3xl shadow-2xl overflow-hidden font-sans select-none relative">
      {/* Cyan ambient glow */}
      <div className="absolute top-0 left-0 w-32 h-48 pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse at 0% 30%, rgba(0,200,220,0.12) 0%, transparent 70%)" }} />

      <AnimatePresence mode="wait">

        {/* ── HOME ── */}
        {activeTab === "home" && (
          <motion.div key="home" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22 }} className="p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">Hello, Guest</h3>
                <p className="text-xs mt-0.5 text-white/40">Exploring the demo data</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[6%] border border-white/[8%]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4 flex flex-col items-center gap-1 bg-white/[4%] border border-white/[7%]">
                <Scale size={22} className="text-form-cyan" />
                <p className="text-2xl font-bold mt-1 text-form-cyan">80.0</p>
                <p className="text-xs text-white/40">kg</p>
                <div className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-white/[6%] text-form-cyan">
                  ↓ 0.2kg this wk
                </div>
              </div>
              <div className="rounded-2xl p-4 flex flex-col items-center gap-1 bg-white/[4%] border border-white/[7%]">
                <Activity size={22} className="text-emerald-500" />
                <p className="text-2xl font-bold mt-1 text-form-cyan">24.7</p>
                <p className="text-xs text-white/40">BMI</p>
                <div className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/[12%] text-emerald-400">
                  Healthy
                </div>
              </div>
            </div>

            {/* Chart card */}
            <div className="rounded-2xl p-4 bg-white/[3%] border border-white/[6%]">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-white">Trend</p>
                <div className="flex gap-1.5">
                  {["1M", "3M", "All"].map((p, i) => (
                    <span key={p} className={`text-xs px-2 py-0.5 rounded-full ${i === 2 ? "bg-form-cyan text-black" : "text-white/35 border border-white/10"}`}>{p}</span>
                  ))}
                </div>
              </div>
              <svg width="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" style={{ height: "80px", display: "block" }}>
                <defs>
                  <linearGradient id="ftGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.cyan} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={areaStr} fill="url(#ftGrad2)" />
                <polyline points={polylineStr} fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {chartPoints.filter((_, i) => i % 3 === 0).map((v, i) => {
                  const p = toXY(v, i * 3, chartPoints.length);
                  return <circle key={i} cx={p.x} cy={p.y} r="3" fill={C.bg} stroke={C.cyan} strokeWidth="1.5" />;
                })}
                <line x1="0" y1={avgY} x2={CHART_W} y2={avgY} stroke={C.amber} strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
                <text x={CHART_W - 4} y={avgY - 3} textAnchor="end" fontSize="7" fill={C.amber} opacity="0.8">Avg</text>
                <line x1="0" y1={goalY} x2={CHART_W} y2={goalY} stroke={C.green} strokeWidth="1" strokeDasharray="4 3" opacity="0.65" />
                <text x={CHART_W - 4} y={goalY - 3} textAnchor="end" fontSize="7" fill={C.green} opacity="0.8">Goal</text>
              </svg>
              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-white/25">Apr 25</p>
                <p className="text-xs text-white/25">Mar 26</p>
              </div>
            </div>

            {/* Forecast card */}
            <div className="rounded-2xl p-4 flex items-center justify-between bg-white/[3%] border border-white/[6%]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/[15%]">
                  <Target size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-400">Slow &amp; Steady</p>
                  <p className="text-xs mt-0.5 text-white/40">Trending at 0.2kg/week</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-white/25">Est. Goal</p>
                <p className="text-sm font-bold text-white mt-0.5">Feb 2027</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STATS ── */}
        {activeTab === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22 }} className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white">Stats</h3>
              <p className="text-xs mt-0.5 text-white/40">Log optional body measurements.</p>
            </div>
            <div className="rounded-2xl p-5 space-y-4 bg-white/[3%] border border-white/[6%]">
              <div className="flex flex-col items-center gap-1 pb-2">
                <Ruler size={24} className="text-form-cyan" />
                <p className="text-sm font-bold mt-1 text-form-cyan">Log New Sizes</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Waist (cm)", val: "92" },
                  { label: "Chest (cm)", val: "100" },
                  { label: "Hips (cm)", val: "101" },
                  { label: "Arms (cm)", val: "35" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl p-3 bg-white/[4%] border border-white/[7%]">
                    <p className="text-xs mb-1 text-white/40">{m.label}</p>
                    <p className="text-base font-bold text-white">{m.val}</p>
                  </div>
                ))}
              </div>
              <div className="w-full py-3 rounded-xl text-sm font-bold text-center text-black"
                style={{ background: `linear-gradient(90deg, ${C.cyan}, #4facfe)` }}>
                Save Sizes
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PROGRESS ── */}
        {activeTab === "progress" && (
          <motion.div key="progress" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22 }} className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white">Progress</h3>
              <p className="text-xs mt-0.5 text-white/40">Celebrate your journey.</p>
            </div>
            <div className="rounded-2xl p-4 flex items-center justify-between bg-white/[3%] border border-white/[6%]">
              <div>
                <p className="text-xs text-white/40">Total Logs</p>
                <p className="text-3xl font-bold mt-0.5 text-form-cyan">26</p>
              </div>
              <div className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[6%] border border-white/[8%] text-white/50">
                View History
              </div>
            </div>
            <p className="text-sm font-bold text-white">Milestones</p>
            {[
              { title: "First Step", desc: "You logged your baseline. Amazing start.", textCls: "text-form-cyan", bgCls: "bg-form-cyan/[12%]", icon: C.cyan },
              { title: "Consistency Key", desc: "5 logs completed. You're building habits.", textCls: "text-emerald-400", bgCls: "bg-emerald-500/[12%]", icon: C.green },
            ].map((m) => (
              <div key={m.title} className="rounded-2xl p-4 flex items-center gap-3 bg-white/[3%] border border-white/[6%]">
                <div className={`p-2.5 rounded-full shrink-0 ${m.bgCls}`}>
                  <Trophy size={18} style={{ color: m.icon }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{m.title}</p>
                  <p className="text-xs mt-0.5 text-white/40">{m.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>

      {/* BOTTOM NAV */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-around py-3 px-2 rounded-2xl bg-white/5 border border-white/[7%]">
          {NAV.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${active ? "text-form-cyan" : "text-white/35"}`}
              >
                <Icon size={18} />
                <span className="text-xs font-bold">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormDemo;
