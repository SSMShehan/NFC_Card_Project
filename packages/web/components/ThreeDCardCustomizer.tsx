"use client";

import React, { useState } from "react";
import { Settings2, User } from "lucide-react";

// --- OPTIONS ---
const FOIL_COLORS = [
  { id: "gold", label: "24k Gold", value: "#cfa15a", light: "#e6c583" },
  { id: "silver", label: "Sterling Silver", value: "#cfcfcf", light: "#ffffff" },
  { id: "rose", label: "Rose Gold", value: "#c08c85", light: "#d9b3ae" },
];

const ACCENT_COLORS = [
  { id: "cyan", label: "Neon Cyan", value: "#29b6d8" },
  { id: "green", label: "Matrix Green", value: "#00FF66" },
  { id: "purple", label: "Cyber Purple", value: "#B026FF" },
  { id: "orange", label: "Blaze Orange", value: "#FF5500" },
];

function RealisticQRCode({ color = "var(--gold)" }: { color?: string }) {
  const size = 29;
  const cellSize = 100 / size;
  const rects = [];

  const isAnchor = (cx: number, cy: number, x: number, y: number, w: number) => {
    const dx = x - cx;
    const dy = y - cy;
    return (dx >= 0 && dx < w && dy >= 0 && dy < w);
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Anchors (7x7) + 1 module quiet zone (8x8 total exclusion)
      if (isAnchor(0, 0, x, y, 8) || isAnchor(size - 8, 0, x, y, 8) || isAnchor(0, size - 8, x, y, 8)) continue;

      // Alignment (5x5) at 20,20
      if (isAnchor(20, 20, x, y, 5)) continue;

      // Center logo cutout (11x11 in center to be safe)
      if (x >= 9 && x <= 19 && y >= 9 && y <= 19) continue;

      // Timing patterns (dotted lines connecting anchors)
      if (x === 6 || y === 6) {
        if (x === 6 && y > 7 && y < size - 7) {
          if (y % 2 === 0) rects.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill={color} />);
          continue;
        }
        if (y === 6 && x > 7 && x < size - 7) {
          if (x % 2 === 0) rects.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill={color} />);
          continue;
        }
      }

      // Pseudo-random fill (approx 50% density)
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      if (hash - Math.floor(hash) > 0.5) {
        rects.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill={color} />);
      }
    }
  }

  const drawAnchor = (ax: number, ay: number) => (
    <g transform={`translate(${ax * cellSize}, ${ay * cellSize})`} fill={color}>
      <rect x="0" y="0" width={7 * cellSize} height={7 * cellSize} />
      <rect x={1 * cellSize} y={1 * cellSize} width={5 * cellSize} height={5 * cellSize} fill="#0e0f10" />
      <rect x={2 * cellSize} y={2 * cellSize} width={3 * cellSize} height={3 * cellSize} />
    </g>
  );

  const drawAlignment = (ax: number, ay: number) => (
    <g transform={`translate(${ax * cellSize}, ${ay * cellSize})`} fill={color}>
      <rect x="0" y="0" width={5 * cellSize} height={5 * cellSize} />
      <rect x={1 * cellSize} y={1 * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#0e0f10" />
      <rect x={2 * cellSize} y={2 * cellSize} width={1 * cellSize} height={1 * cellSize} />
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="0" y="0" width="100" height="100" fill="#0e0f10" />

      {rects}

      {drawAnchor(0, 0)}
      {drawAnchor(size - 7, 0)}
      {drawAnchor(0, size - 7)}
      {drawAlignment(20, 20)}

      <rect x={32} y={32} width={36} height={36} rx={5} fill="#f4efe6" />
      <g transform="translate(40, 37) scale(0.42)">
        <rect x="2" y="14" width="15" height="7" rx="2" fill="#0e0f10" />
        <path d="M12 14 L26 14 L26 34 Q26 49 19 55 Q12 49 12 34 Z" fill="#0e0f10" />
        <path d="M24 16 L39 3" stroke="#0e0f10" strokeWidth="7" strokeLinecap="round" />
        <circle cx="40" cy="2" r="5.5" fill="#0e0f10" />
      </g>
    </svg>
  );
}

function PremiumHeroGraphic() {
  const dots = [];
  for (let x = 15; x <= 135; x += 8) {
    for (let y = 35; y <= 155; y += 8) {
      const dist = Math.sqrt(Math.pow(x - 75, 2) + Math.pow(y - 95, 2));
      const maxDist = 52;
      if (dist < maxDist) {
        // Create a 3D sphere illusion by making dots larger in the center
        const normalized = 1 - (dist / maxDist);
        const r = normalized * 2.8;
        const opacity = normalized * 0.9 + 0.1;
        dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--cyan)" opacity={opacity} />);
      }
    }
  }

  return (
    <svg className="circuit-box" viewBox="0 0 150 190" fill="none" style={{ overflow: 'visible' }}>

      {/* Background ambient glow */}
      <circle cx="75" cy="95" r="45" fill="var(--cyan)" opacity="0.12" filter="blur(12px)" />

      {/* Technical Hexagonal Frame */}
      <polygon points="75,20 140,57 140,133 75,170 10,133 10,57" fill="none" stroke="var(--cyan)" strokeWidth="0.5" opacity="0.2" />

      {/* Halftone Sphere Core */}
      {dots}

      {/* NFC / Communication Orbital Rings */}
      <ellipse cx="75" cy="95" rx="65" ry="20" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.8" transform="rotate(-30 75 95)" />
      <ellipse cx="75" cy="95" rx="72" ry="12" stroke="var(--cyan)" strokeWidth="1" opacity="0.5" transform="rotate(40 75 95)" />
      <ellipse cx="75" cy="95" rx="80" ry="30" stroke="var(--cyan)" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.6" transform="rotate(10 75 95)" />

      {/* Center Focus Reticle */}
      <circle cx="75" cy="95" r="6" fill="none" stroke="var(--cyan)" strokeWidth="1.5" />
      <circle cx="75" cy="95" r="2" fill="var(--cyan)" />

      {/* Connecting Data Lines */}
      <path d="M 75 20 L 75 43" stroke="var(--cyan)" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
      <path d="M 75 147 L 75 170" stroke="var(--cyan)" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
      <path d="M 10 95 L 23 95" stroke="var(--cyan)" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
      <path d="M 127 95 L 140 95" stroke="var(--cyan)" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />

      {/* Edge Accents */}
      <path d="M 5 45 L 5 25 L 25 25" fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity="0.7" />
      <path d="M 145 45 L 145 25 L 125 25" fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity="0.7" />
      <path d="M 5 145 L 5 165 L 25 165" fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity="0.7" />
      <path d="M 145 145 L 145 165 L 125 165" fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export default function ThreeDCardCustomizer() {
  const [activeTab, setActiveTab] = useState<"design" | "details">("design");

  const [foil, setFoil] = useState(FOIL_COLORS[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].value);

  const [displayName, setDisplayName] = useState("JOHN DOE");
  const [designation, setDesignation] = useState("CHIEF ARCHITECT");

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

      {/* LEFT: Card Preview Area */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[600px] lg:h-[800px] bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#f4f4f5_50%,_#e4e4e7_100%)] rounded-[2.5rem] p-10 relative overflow-hidden shadow-inner border border-white/60">
        <style>{`
          .card-container {
            perspective: 1000px;
            width: 420px;
            height: 250px;
          }
          .card-flipper {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
          }
          .card-flipper.is-flipped {
            transform: rotateY(180deg);
          }
          .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            border-radius: 18px;
            overflow: hidden;
            background: linear-gradient(135deg, #232427 0%, #1a1b1d 40%, #0e0f10 100%);
            box-shadow: 0 20px 40px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.04);
          }
          .card-face::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
              100deg,
              rgba(255,255,255,0.015) 0px,
              rgba(255,255,255,0.015) 1px,
              transparent 1px,
              transparent 3px
            );
            pointer-events: none;
          }
          .card-face-back {
            transform: rotateY(180deg);
          }

          /* --- FRONT --- */
          .front-content {
            display: flex;
            align-items: center;
            padding: 0 26px;
            gap: 14px;
            height: 100%;
          }
          .circuit-box {
            flex: 0 0 150px;
            width: 150px;
            height: 190px;
          }
          .logo-group {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }
          .t-icon {
            flex: 0 0 36px;
            width: 36px;
            height: 55px;
          }
          .divider {
            flex: 0 0 1px;
            width: 1px;
            height: 42px;
            background: var(--gold);
            opacity: 0.5;
          }
          .brand-name {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 30px;
            letter-spacing: 3px;
            color: var(--gold-light);
            font-weight: 600;
          }
          .cyberlink {
            position: absolute;
            left: 34px;
            bottom: 22px;
            font-size: 11px;
            letter-spacing: 3px;
            color: var(--cyan);
            font-weight: 600;
          }

          /* --- BACK --- */
          .back-content {
            display: flex;
            align-items: center;
            padding: 0 30px;
            gap: 18px;
            height: 100%;
          }
          .info-sec {
            flex: 1 1 auto;
            min-width: 100px;
            padding-right: 15px;
          }
          .info-field {
            margin-bottom: 28px;
          }
          .info-field:last-child {
            margin-bottom: 0;
          }
          .info-label {
            font-size: 11px;
            letter-spacing: 2px;
            color: var(--gold);
            margin-bottom: 6px;
            font-weight: 600;
          }
          .info-value {
            font-size: 15px;
            letter-spacing: 0.5px;
            color: #f2f2f2;
            font-weight: 600;
            white-space: normal;
            word-break: break-word;
            line-height: 1.3;
          }
          .qr-wrap {
            flex: 0 0 118px;
            width: 118px;
            height: 118px;
            border-radius: 50%;
            border: 2px solid var(--gold);
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 30% 30%, #1c1d1f, #0e0f10);
          }
          .qr-wrap svg {
            width: 78px;
            height: 78px;
          }
          .nfc-icon {
            flex: 0 0 34px;
            width: 34px;
            height: 44px;
          }

          @media (max-width: 768px){
            .card-container { width: 340px; height: 202px; }
            .front-content { padding: 0 18px; }
            .circuit-box { flex-basis: 120px; width: 120px; }
            .brand-name { font-size: 24px; }
            .back-content { padding: 0 20px; }
            .qr-wrap { flex-basis: 96px; width: 96px; height: 96px; }
            .qr-wrap svg { width: 62px; height: 62px; }
            .info-value { font-size: 13px; }
          }
         `}</style>

        {/* Toggle Buttons */}
        <div className="absolute top-8 flex gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-black/5 shadow-sm z-10">
          <button onClick={() => setIsFlipped(false)} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${!isFlipped ? "bg-black text-white shadow-md" : "text-zinc-600 hover:text-black hover:bg-white/50"}`}>Front</button>
          <button onClick={() => setIsFlipped(true)} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${isFlipped ? "bg-black text-white shadow-md" : "text-zinc-600 hover:text-black hover:bg-white/50"}`}>Back</button>
        </div>

        {/* Card Render */}
        <div
          className="card-container cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            "--gold": foil.value,
            "--gold-light": foil.light,
            "--cyan": accentColor,
          } as React.CSSProperties}
        >
          <div className={`card-flipper shadow-2xl transition-all duration-700 ${isFlipped ? "is-flipped" : "hover:scale-[1.02]"}`}>

            {/* FRONT FACE */}
            <div className="card-face">
              <div className="front-content">
                <PremiumHeroGraphic />
                <div className="logo-group">
                  <svg className="t-icon h-[140px] w-auto" viewBox="0 0 100 120" fill="none">
                    {/* T Shape */}
                    <path d="M 15 30 L 15 46 L 31 46 L 47 30 Z" fill="var(--gold)" />
                    <path d="M 59 30 L 85 30 L 85 46 L 55 46 L 55 110 L 39 110 L 39 50 L 59 30 Z" fill="var(--gold)" />

                    {/* Foreground lines (gold stroke) */}
                    <g stroke="var(--gold)" strokeWidth="3" strokeLinecap="round">
                      <line x1="55" y1="38" x2="85" y2="26" />
                      <line x1="55" y1="38" x2="85" y2="50" />
                      <line x1="85" y1="26" x2="85" y2="50" />
                      <line x1="55" y1="38" x2="25" y2="70" />
                    </g>

                    {/* Nodes with dark background borders for embossed effect */}
                    <circle cx="55" cy="38" r="9" fill="var(--gold)" stroke="#17181a" strokeWidth="4" />
                    <circle cx="85" cy="26" r="7" fill="var(--gold)" stroke="#17181a" strokeWidth="3" />
                    <circle cx="85" cy="50" r="7" fill="var(--gold)" stroke="#17181a" strokeWidth="3" />
                    <circle cx="25" cy="70" r="5" fill="var(--gold)" stroke="#17181a" strokeWidth="3" />
                  </svg>
                  <div className="divider"></div>
                  <div className="brand-name relative pr-[20px]">
                    TAGIT
                    <svg viewBox="0 0 36 36" className="absolute top-[2px] right-[0px] w-[18px] h-[18px] text-[var(--gold-light)] overflow-visible">
                      <path d="M 4 12 A 6 6 0 0 1 4 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      <path d="M 12 6 A 14 14 0 0 1 12 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      <path d="M 20 0 A 22 22 0 0 1 20 36" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="cyberlink">CYBERLINK</div>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="card-face card-face-back">
              <div className="back-content">
                <div className="info-sec">
                  <div className="info-field">
                    <div className="info-label">NAME</div>
                    <div className="info-value">{displayName || "JOHN DOE"}</div>
                  </div>
                  <div className="info-field">
                    <div className="info-label">DESIGNATION</div>
                    <div className="info-value">{designation || "CHIEF ARCHITECT"}</div>
                  </div>
                </div>
                <div className="qr-wrap">
                  <RealisticQRCode />
                </div>
                <svg className="nfc-icon overflow-visible flex-shrink-0" viewBox="0 0 46 52" fill="none">
                  <path d="M8 21 A 7 7 0 0 1 8 31" stroke="var(--cyan)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M16 15 A 15 15 0 0 1 16 37" stroke="var(--cyan)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M24 9 A 23 23 0 0 1 24 43" stroke="var(--cyan)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M32 3 A 31 31 0 0 1 32 49" stroke="var(--cyan)" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="absolute bottom-8 text-xs text-zinc-400 font-medium tracking-widest uppercase">Click card to flip</p>
      </div>

      {/* RIGHT: Controls Panel */}
      <div className="lg:col-span-5 flex flex-col h-full lg:h-[800px]">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] ring-1 ring-neutral-200/50 flex flex-col h-full overflow-hidden">
          <div className="p-8 pb-0 border-b border-zinc-100">
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">Studio</h2>
            <p className="text-zinc-500 text-sm mb-8 font-medium">Customize your exact design.</p>
            <div className="flex space-x-2 bg-zinc-100 p-1.5 rounded-2xl mb-8">
              {[
                { id: "design", label: "Colors & Finish", icon: Settings2 },
                { id: "details", label: "Engraving", icon: User },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? "bg-white text-black shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 border border-transparent"}`}>
                  <tab.icon className="w-5 h-5 mb-0.5" />{tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8 flex-grow overflow-y-auto space-y-10 custom-scrollbar">
            {activeTab === "design" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Foil Overlay (Logos/QR)</label>
                  <div className="grid grid-cols-1 gap-3">
                    {FOIL_COLORS.map((fc) => (
                      <button key={fc.id} onClick={() => setFoil(fc)} className={`relative py-4 px-5 rounded-2xl border flex items-center justify-start gap-4 text-sm font-semibold transition-all ${foil.id === fc.id ? "border-zinc-500 bg-zinc-50 text-black shadow-sm" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"}`}>
                        <div className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: fc.value }}></div>{fc.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Neon Accent (Circuit/WiFi)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCENT_COLORS.map((ac) => (
                      <button key={ac.id} onClick={() => setAccentColor(ac.value)} className={`py-3 px-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${accentColor === ac.value ? "border-zinc-500 bg-zinc-50 text-black shadow-sm" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"}`}>
                        <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: ac.value }}></div>{ac.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "details" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Cardholder Name</label>
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value.toUpperCase())} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-all text-black font-medium placeholder-zinc-400" placeholder="e.g. JOHN DOE" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Official Title</label>
                  <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value.toUpperCase())} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 outline-none transition-all text-black font-medium placeholder-zinc-400" placeholder="e.g. CHIEF ARCHITECT" />
                </div>
              </div>
            )}
          </div>
          <div className="p-8 bg-zinc-50 border-t border-zinc-200 mt-auto">
            <button className="w-full py-5 rounded-2xl font-bold text-white uppercase tracking-widest text-sm bg-black hover:bg-zinc-800 shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Finalize Design
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
