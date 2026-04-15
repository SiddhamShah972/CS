import { useState } from "react";
import axios from "axios";

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState("idle");

  const hasResult = Boolean(result);
  const trustScore = hasResult ? Number(result?.trust_score ?? 0) : null;
  const deepfakeScore = result?.ai_analysis ? Number(result.ai_analysis.deepfake_score ?? 0) : null;
  const verdict = result?.ai_analysis?.verdict ?? "Not available";
  const confidenceBand =
    trustScore === null
      ? "Awaiting verification"
      : trustScore >= 80
        ? "High confidence"
        : trustScore >= 50
          ? "Review advised"
          : "Critical review";
  const riskLevel =
    trustScore === null
      ? "Awaiting verification"
      : trustScore >= 80
        ? "Low tamper risk"
        : trustScore >= 50
          ? "Medium tamper risk"
          : "High tamper risk";
  const trustBarClass =
    trustScore === null
      ? "from-slate-500 via-slate-400 to-slate-300"
      : trustScore >= 80
      ? "from-emerald-400 via-lime-300 to-cyan-300"
      : trustScore >= 50
        ? "from-amber-300 via-orange-300 to-yellow-200"
        : "from-rose-400 via-red-400 to-orange-300";
  const trustCircumference = 2 * Math.PI * 52;
  const normalizedTrustScore = trustScore === null ? 0 : Math.min(Math.max(trustScore, 0), 100);
  const trustStrokeOffset =
    trustCircumference - (normalizedTrustScore / 100) * trustCircumference;
  const provenanceSignal = hasResult ? (result.status === "VERIFIED" ? 100 : 0) : null;
  const forensicSignal = hasResult && deepfakeScore !== null ? Math.max(0, Math.min(100, 100 - deepfakeScore)) : null;
  const confidenceSignal = trustScore;
  const evidenceStrength =
    trustScore === null
      ? "Pending"
      : `${Math.max(0, Math.min(100, Math.round(trustScore - ((deepfakeScore ?? 0) / 3))))}% stable`;
  const trustSignals = [
    { label: "Provenance", value: provenanceSignal, tone: "from-emerald-400 to-cyan-300" },
    { label: "Forensic", value: forensicSignal, tone: "from-sky-400 to-blue-300" },
    { label: "Confidence", value: confidenceSignal, tone: "from-amber-300 to-orange-300" },
  ];

  const fileSummary = file
    ? {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || "Unknown type",
      }
    : null;

  const uploadVideo = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      setLastAction("upload");
      await axios.post(`${API_BASE_URL}/api/upload`, formData);
      alert("Video signed successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Upload failed";
      alert(`Upload failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyVideo = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      setLastAction("verify");
      const res = await axios.post(`${API_BASE_URL}/api/verify`, formData);
      setResult(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Verification failed";
      alert(`Verification failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(180deg,_#081120_0%,_#0b1326_45%,_#050814_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(2,12,27,0.45)] backdrop-blur">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.25fr_0.9fr] lg:px-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Provenance Intelligence Layer
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  Human-Centered Verification
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-['Space_Grotesk',_'Segoe_UI',_sans-serif] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                  TrustChain AI
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                  A video provenance and forensic review console that combines signed
                  upload records, verification logic, AI fallback analysis, and
                  operator-friendly explanation inside a single interface.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Goal
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    Detect provenance gaps before suspicious media reaches decision-makers.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    HCI Focus
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    Reduce ambiguity with explicit system mode, evidence, and visual cues.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    QA Focus
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    Harden ingestion, metadata durability, and failure transparency.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Live Operator Panel
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    Intake + Verification
                  </p>
                </div>
                <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                  {loading ? "Pipeline active" : "Ready"}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.95))] p-5">
                <label className="block text-sm font-medium text-slate-200">
                  Select candidate video evidence
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mt-3 block w-full rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400/15 file:px-4 file:py-2 file:font-medium file:text-cyan-100 hover:border-cyan-300/40"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={uploadVideo}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-emerald-400 to-lime-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Upload & Sign
                  </button>

                  <button
                    onClick={verifyVideo}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Verify Video
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      File
                    </p>
                    <p className="mt-2 truncate text-sm text-slate-100">
                      {fileSummary?.name ?? "No file selected"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Size
                    </p>
                    <p className="mt-2 text-sm text-slate-100">
                      {fileSummary?.size ?? "--"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Last Action
                    </p>
                    <p className="mt-2 text-sm text-slate-100">
                      {lastAction === "idle"
                        ? "Waiting for operator"
                        : lastAction === "upload"
                          ? "Upload signing"
                          : "Authenticity verification"}
                    </p>
                  </div>
                </div>

                {loading && (
                  <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                    Processing the media pipeline. Provenance generation and verification can take a moment for larger files.
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Verification Outcome
                </p>
                <span className="hidden h-5 w-px bg-white/10 sm:block" />
                <h2 className="text-2xl font-semibold text-white">
                  Media Trust Assessment
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                {result ? result.status : "Awaiting result"}
              </span>
            </div>

            {result ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {result.status}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Trust Score
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {trustScore}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        System Mode
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {result.status === "VERIFIED" ? "Provenance Verified" : "AI Forensic Mode"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Verdict
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {result.ai_analysis ? verdict : "Trusted record"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.85),rgba(2,6,23,0.95))] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          System Mode: {result.status === "VERIFIED" ? "Provenance Verified" : "AI Forensic Mode"}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {confidenceBand} with {riskLevel.toLowerCase()} based on current trust evidence.
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                        Outcome interpretation layer
                      </div>
                    </div>

                    <div className="mt-5 h-5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${trustBarClass} transition-all duration-700`}
                        style={{ width: `${normalizedTrustScore}%` }}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          Trust interpretation
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{confidenceBand}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          Risk posture
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{riskLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          AI deepfake score
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {result.ai_analysis ? deepfakeScore : "Not required"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 2xl:grid-cols-[1fr_0.98fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
                    <h3 className="text-lg font-semibold text-white">
                      Decision Matrix
                    </h3>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                      <div className="grid grid-cols-3 bg-slate-900/80 text-xs uppercase tracking-[0.18em] text-slate-400">
                        <div className="border-r border-white/10 px-4 py-3">Metric</div>
                        <div className="border-r border-white/10 px-4 py-3">Observed</div>
                        <div className="px-4 py-3">Interpretation</div>
                      </div>
                      <div className="grid grid-cols-3 border-t border-white/10 text-sm">
                        <div className="border-r border-white/10 px-4 py-3 text-slate-300">Provenance status</div>
                        <div className="border-r border-white/10 px-4 py-3 text-white">{result.status}</div>
                        <div className="px-4 py-3 text-slate-300">
                          {result.status === "VERIFIED"
                            ? "Historical trust evidence was found."
                            : "No matching provenance record was found."}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 border-t border-white/10 text-sm">
                        <div className="border-r border-white/10 px-4 py-3 text-slate-300">Trust score</div>
                        <div className="border-r border-white/10 px-4 py-3 text-white">{trustScore}</div>
                        <div className="px-4 py-3 text-slate-300">{confidenceBand}</div>
                      </div>
                      <div className="grid grid-cols-3 border-t border-white/10 text-sm">
                        <div className="border-r border-white/10 px-4 py-3 text-slate-300">Forensic verdict</div>
                        <div className="border-r border-white/10 px-4 py-3 text-white">
                          {result.ai_analysis ? verdict : "N/A"}
                        </div>
                        <div className="px-4 py-3 text-slate-300">
                          {result.ai_analysis
                            ? "AI heuristic triggered due to missing provenance."
                            : "Verification completed via provenance evidence only."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
                    <h3 className="text-lg font-semibold text-white">
                      Verification Diagram
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      A compact systems view of how TrustChain AI routes each file.
                    </p>
                    <div className="mt-6 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.96),rgba(2,6,23,0.82))] p-5">
                      <svg viewBox="0 0 620 240" className="w-full">
                        <defs>
                          <linearGradient id="pathGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#34d399" />
                          </linearGradient>
                        </defs>
                        <rect x="20" y="85" width="125" height="72" rx="18" fill="#0f172a" stroke="#334155" />
                        <text x="82" y="112" textAnchor="middle" fill="#e2e8f0" fontSize="16">Video Input</text>
                        <text x="82" y="133" textAnchor="middle" fill="#94a3b8" fontSize="12">operator upload</text>

                        <rect x="185" y="85" width="150" height="72" rx="18" fill="#0f172a" stroke="#334155" />
                        <text x="260" y="112" textAnchor="middle" fill="#e2e8f0" fontSize="16">Hash + Metadata</text>
                        <text x="260" y="133" textAnchor="middle" fill="#94a3b8" fontSize="12">sign and compare</text>

                        <rect x="385" y="34" width="190" height="72" rx="18" fill="#0f172a" stroke="#22c55e" />
                        <text x="480" y="61" textAnchor="middle" fill="#dcfce7" fontSize="16">Verified Path</text>
                        <text x="480" y="82" textAnchor="middle" fill="#86efac" fontSize="12">provenance verified</text>

                        <rect x="385" y="138" width="190" height="72" rx="18" fill="#0f172a" stroke="#38bdf8" />
                        <text x="480" y="165" textAnchor="middle" fill="#e0f2fe" fontSize="16">AI Forensic Path</text>
                        <text x="480" y="186" textAnchor="middle" fill="#7dd3fc" fontSize="12">deepfake scoring fallback</text>

                        <path d="M145 121 H185" stroke="url(#pathGlow)" strokeWidth="4" strokeLinecap="round" />
                        <path d="M335 121 H360 Q375 121 375 106 V84" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <path d="M335 121 H360 Q375 121 375 136 V174" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />

                        <circle cx="335" cy="121" r="7" fill="#e2e8f0" />
                        <text x="363" y="100" fill="#86efac" fontSize="12">record found</text>
                        <text x="363" y="146" fill="#7dd3fc" fontSize="12">record missing</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/40 p-8 text-left">
                <p className="text-base font-medium text-slate-200">
                  No verification result yet.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Upload and verify a video to populate the trust dashboard, system
                  mode, forensic indicators, and outcome explanations.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Graphical Outcome Visualization
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Trust Signal Overview
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  Live view
                </span>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Trust Dial
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 140 140" className="h-40 w-40">
                      <circle
                        cx="70"
                        cy="70"
                        r="52"
                        fill="none"
                        stroke="rgba(148,163,184,0.18)"
                        strokeWidth="14"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="52"
                        fill="none"
                        stroke="url(#trustRing)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={trustCircumference}
                        strokeDashoffset={trustStrokeOffset}
                        transform="rotate(-90 70 70)"
                      />
                      <defs>
                        <linearGradient id="trustRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                      <text x="70" y="64" textAnchor="middle" fill="#f8fafc" fontSize="30" fontWeight="700">
                        {hasResult ? trustScore : "--"}
                      </text>
                      <text x="70" y="86" textAnchor="middle" fill="#94a3b8" fontSize="11" letterSpacing="2">
                        TRUST SCORE
                      </text>
                    </svg>
                    <p className="mt-3 text-sm font-medium text-slate-200">{confidenceBand}</p>
                    <p className="mt-1 text-center text-sm text-slate-400">{riskLevel}</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Verification Balance
                  </p>
                  <div className="mt-6 flex h-[184px] items-end justify-between gap-4">
                    {trustSignals.map((bar) => (
                      <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
                        <span className="text-xs text-slate-400">{bar.value === null ? "—" : bar.value}</span>
                        <div className="flex h-full w-full items-end rounded-full bg-slate-900/80 p-2">
                          <div
                            className={`w-full rounded-full bg-gradient-to-t ${bar.tone} shadow-[0_12px_32px_rgba(15,23,42,0.35)]`}
                            style={{ height: `${bar.value === null ? 6 : Math.max(6, bar.value)}%` }}
                          />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Active Mode
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {result ? (result.status === "VERIFIED" ? "Provenance Verified" : "AI Forensic Mode") : "Awaiting analysis"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Forensic Verdict
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {result?.ai_analysis ? verdict : "Trusted record"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Evidence Strength
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {evidenceStrength}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Decision Visualization
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Outcome Flow Map
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  Visual logic
                </span>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
                <div className="relative flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-300 text-sm font-bold text-slate-950">
                      01
                    </div>
                    <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-sm font-semibold text-white">Media uploaded and fingerprinted</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Hash generation and metadata comparison initialize the trust pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="ml-6 h-8 w-px bg-gradient-to-b from-cyan-300/70 to-transparent" />

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-300 text-sm font-bold text-slate-950">
                      02
                    </div>
                    <div className="grid flex-1 gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-sm font-semibold text-emerald-100">Verified branch</p>
                        <p className="mt-1 text-sm text-emerald-50/80">
                          Provenance exists, confidence increases, forensic fallback is skipped.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
                        <p className="text-sm font-semibold text-sky-100">Forensic branch</p>
                        <p className="mt-1 text-sm text-sky-50/80">
                          Provenance missing, AI analyzes the clip and estimates synthetic risk.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 h-8 w-px bg-gradient-to-b from-sky-300/70 to-transparent" />

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-300 text-sm font-bold text-slate-950">
                      03
                    </div>
                    <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-sm font-semibold text-white">Human-readable decision output</p>
                      <p className="mt-1 text-sm text-slate-400">
                        System mode, trust score, and verdict are presented for operator review and final judgment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
