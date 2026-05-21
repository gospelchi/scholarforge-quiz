import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0B1437",
  navyLight: "#111C47",
  navyCard: "#162050",
  gold: "#F0B429",
  goldLight: "#FFD166",
  goldDim: "#C89A1F",
  white: "#F5F7FF",
  muted: "#8A99C2",
  success: "#22D3A5",
  danger: "#FF6B6B",
  blue: "#4A90D9",
};

const questions = [
  {
    id: "degree_class",
    label: "What is your degree classification?",
    icon: "🎓",
    type: "select",
    options: [
      { value: "first", label: "First Class (4.5–5.0 / 70%+)", score: 30 },
      { value: "upper_second", label: "Second Class Upper (3.5–4.49 / 60–69%)", score: 24 },
      { value: "lower_second", label: "Second Class Lower (2.2 / 50–59%)", score: 16 },
      { value: "third", label: "Third Class / Pass", score: 8 },
      { value: "in_progress", label: "Still in school", score: 18 },
    ],
    weight: 30,
  },
  {
    id: "english_test",
    label: "Do you have an English proficiency test?",
    icon: "🌍",
    type: "select",
    options: [
      { value: "ielts_high", label: "IELTS 7.0+", score: 10 },
      { value: "ielts_mid", label: "IELTS 6.0–6.9", score: 7 },
      { value: "toefl", label: "TOEFL 90+", score: 9 },
      { value: "planned", label: "Planning to take one", score: 4 },
      { value: "none", label: "None yet", score: 0 },
    ],
    weight: 10,
  },
  {
    id: "research",
    label: "Research & publication experience?",
    icon: "🔬",
    type: "select",
    options: [
      { value: "published", label: "Published paper(s)", score: 10 },
      { value: "thesis", label: "Strong thesis/dissertation", score: 7 },
      { value: "some", label: "Some research experience", score: 4 },
      { value: "none", label: "None yet", score: 0 },
    ],
    weight: 10,
  },
  {
    id: "work_experience",
    label: "Relevant work or professional experience?",
    icon: "💼",
    type: "select",
    options: [
      { value: "3plus", label: "3+ years relevant experience", score: 10 },
      { value: "1to3", label: "1–3 years", score: 7 },
      { value: "less1", label: "Under 1 year", score: 4 },
      { value: "none", label: "None / Fresh graduate", score: 1 },
    ],
    weight: 10,
  },
  {
    id: "leadership",
    label: "Leadership & extracurricular involvement?",
    icon: "🏆",
    type: "select",
    options: [
      { value: "strong", label: "President / Director / Founder of org", score: 10 },
      { value: "moderate", label: "Committee member / Volunteer lead", score: 7 },
      { value: "some", label: "Club member / Participant", score: 4 },
      { value: "none", label: "Little to none", score: 1 },
    ],
    weight: 10,
  },
  {
    id: "target_degree",
    label: "What degree level are you targeting?",
    icon: "📚",
    type: "select",
    options: [
      { value: "msc", label: "Master's (MSc / MA / MBA)", score: 10 },
      { value: "phd", label: "PhD / Doctorate", score: 10 },
      { value: "postdoc", label: "Postdoc / Research Fellowship", score: 10 },
      { value: "undergrad", label: "Undergraduate", score: 7 },
    ],
    weight: 10,
  },
  {
    id: "target_country",
    label: "Where do you want to study?",
    icon: "✈️",
    type: "multiselect",
    options: [
      { value: "uk", label: "🇬🇧 United Kingdom" },
      { value: "usa", label: "🇺🇸 United States" },
      { value: "canada", label: "🇨🇦 Canada" },
      { value: "germany", label: "🇩🇪 Germany" },
      { value: "australia", label: "🇦🇺 Australia" },
      { value: "netherlands", label: "🇳🇱 Netherlands" },
      { value: "other", label: "🌍 Other / Open" },
    ],
    weight: 0,
  },
  {
    id: "field",
    label: "Your field of study?",
    icon: "🧠",
    type: "select",
    options: [
      { value: "stem", label: "STEM (Science, Tech, Engineering, Math)" },
      { value: "social", label: "Social Sciences / Public Policy" },
      { value: "business", label: "Business / Economics / Finance" },
      { value: "health", label: "Medicine / Public Health" },
      { value: "arts", label: "Arts / Humanities / Law" },
      { value: "education", label: "Education / Development" },
    ],
    weight: 0,
  },
  {
    id: "sop_ready",
    label: "How ready is your Statement of Purpose (SOP)?",
    icon: "📝",
    type: "select",
    options: [
      { value: "polished", label: "Polished and ready", score: 10 },
      { value: "draft", label: "I have a draft", score: 6 },
      { value: "started", label: "Just started", score: 3 },
      { value: "none", label: "Not started yet", score: 0 },
    ],
    weight: 10,
  },
  {
    id: "referees",
    label: "Do you have strong academic/professional referees?",
    icon: "🤝",
    type: "select",
    options: [
      { value: "yes_strong", label: "Yes — 2–3 strong referees ready", score: 10 },
      { value: "yes_some", label: "Yes — 1–2 referees, somewhat ready", score: 6 },
      { value: "working", label: "Still working on it", score: 3 },
      { value: "no", label: "Not yet", score: 0 },
    ],
    weight: 10,
  },
];

// ── ScoreRing ─────────────────────────────────────────────────────
function ScoreRing({ score, size = 140 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const target = score;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(Math.round(current));
      setOffset(circumference - (current / 100) * circumference);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const color = score >= 70 ? COLORS.success : score >= 45 ? COLORS.gold : COLORS.danger;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1E2D5A" strokeWidth={12} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: 32, fontWeight: 900, color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
          {displayScore}
        </span>
        <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>/ 100</span>
      </div>
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────
function ProgressBar({ value, color = COLORS.gold, label, animated = true }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(value), 100);
  }, [value]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.muted }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 7, background: "#1E2D5A", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99, transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: `0 0 10px ${color}55`
        }} />
      </div>
    </div>
  );
}

// ── Chip ──────────────────────────────────────────────────────────
function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
      border: active ? `2px solid ${COLORS.gold}` : "2px solid #1E2D5A",
      background: active ? `${COLORS.gold}18` : "transparent",
      color: active ? COLORS.goldLight : COLORS.muted,
      transition: "all 0.2s", marginRight: 8, marginBottom: 8,
      boxShadow: active ? `0 0 12px ${COLORS.gold}33` : "none"
    }}>{children}</button>
  );
}

// ── Email Capture Modal ───────────────────────────────────────────
function EmailCaptureModal({ onSubmit }) {
  const [form, setForm] = useState({ firstName: "", email: "", country: "", degreeLevel: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.firstName.trim() && form.email.includes("@") && form.country && form.degreeLevel;

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    background: "#0A1030", border: "1.5px solid #1E2D5A",
    color: COLORS.white, fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
    marginBottom: 14,
  };
  const labelStyle = {
    fontSize: 11, color: COLORS.muted, display: "block",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(6, 10, 30, 0.92)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: COLORS.navyCard,
        borderRadius: "22px 22px 0 0",
        padding: "28px 24px 40px",
        border: "1px solid #1E2D5A",
        borderBottom: "none",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 99,
            background: `${COLORS.gold}18`, border: `1px solid ${COLORS.gold}44`,
            fontSize: 11, fontWeight: 700, color: COLORS.gold,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12,
          }}>✦ Your Score Is Ready</div>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: COLORS.white,
            fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 8,
          }}>Where Should We Send<br />Your Full Intelligence Report?</h2>
          <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
            Enter your details to unlock your Scholarship Readiness Score™ and personalised action plan.
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input
              value={form.firstName} onChange={e => set("firstName", e.target.value)}
              placeholder="e.g. Amara" style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <select value={form.country} onChange={e => set("country", e.target.value)} style={inputStyle}>
              <option value="">Select…</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Email Address</label>
        <input
          type="email" value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="your@email.com" style={inputStyle}
        />

        <label style={labelStyle}>Current Degree Level</label>
        <select value={form.degreeLevel} onChange={e => set("degreeLevel", e.target.value)} style={{ ...inputStyle, marginBottom: 22 }}>
          <option value="">Select…</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Master's">Master's</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={() => valid && onSubmit(form)}
          style={{
            width: "100%", padding: "16px", borderRadius: 13, fontSize: 15, fontWeight: 700,
            background: valid ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDim})` : "#1E2D5A",
            color: valid ? COLORS.navy : COLORS.muted,
            border: "none", cursor: valid ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: valid ? `0 4px 24px ${COLORS.gold}44` : "none",
            transition: "all 0.2s",
          }}
        >
          Unlock My Scholarship Readiness Score™ →
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#2A3A6A", marginTop: 10 }}>
          No spam. Your data is private and secure.
        </p>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function ScholarForgeApp() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [animIn, setAnimIn] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const resultRef = useRef(null);

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  function selectAnswer(qId, value, isMulti = false) {
    if (isMulti) {
      const current = answers[qId] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      setAnswers(prev => ({ ...prev, [qId]: updated }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: value }));
      // Auto-advance for single-select after a short delay so user sees the highlight
      setTimeout(() => {
        next();
      }, 450);
    }
  }

  function next() {
    setAnimIn(false);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setAnimIn(true);
      } else {
        // Show email capture before revealing results
        setShowEmailModal(true);
      }
    }, 200);
  }

  function prev() {
    if (currentQ > 0) {
      setAnimIn(false);
      setTimeout(() => { setCurrentQ(q => q - 1); setAnimIn(true); }, 200);
    }
  }

  function handleEmailSubmit(formData) {
    console.log("ScholarForge Lead Captured:", formData);
    setLeadData(formData);
    // Use submitted first name if the landing page name is empty
    if (!name && formData.firstName) setName(formData.firstName);
    setShowEmailModal(false);
    computeResult(formData.firstName || name);
  }

  function computeScore() {
    let totalScore = 0;
    questions.forEach(q => {
      if (q.weight === 0) return;
      const ans = answers[q.id];
      if (!ans) return;
      const opt = q.options.find(o => o.value === ans);
      if (opt && opt.score !== undefined) {
        totalScore += opt.score;
      }
    });
    return Math.min(Math.round(totalScore), 100);
  }

  async function computeResult(displayName) {
    setLoading(true);
    setScreen("result");
    const score = computeScore();
    const applicantName = displayName || name || "the applicant";

    const profileSummary = questions.map(q => {
      const ans = answers[q.id];
      if (!ans) return "";
      if (Array.isArray(ans)) return `${q.label}: ${ans.join(", ")}`;
      const opt = q.options?.find(o => o.value === ans);
      return `${q.label}: ${opt?.label || ans}`;
    }).filter(Boolean).join("\n");

    const prompt = `You are ScholarForge AI, a premium scholarship intelligence system for African students.

A student named ${applicantName} completed the Scholarship Readiness Assessment™. Their profile:

${profileSummary}

Their overall readiness score is: ${score}/100

Generate a JSON response ONLY (no markdown, no backticks) with this exact structure:
{
  "verdict": "one of: Scholar-Ready | Strong Contender | Developing Profile | Early Stage",
  "headline": "a punchy 8-10 word motivational summary line",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "recommendations": ["specific action 1", "specific action 2", "specific action 3", "specific action 4"],
  "best_scholarships": ["Scholarship name 1", "Scholarship name 2", "Scholarship name 3"],
  "best_countries": ["Country 1", "Country 2", "Country 3"],
  "category_scores": {
    "Academic Strength": <0-100>,
    "English Readiness": <0-100>,
    "Research Profile": <0-100>,
    "Professional Experience": <0-100>,
    "Application Readiness": <0-100>
  },
  "next_milestone": "one specific next action to take this week"
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ ...parsed, score });
    } catch (e) {
      setResult({
        score,
        verdict: score >= 70 ? "Scholar-Ready" : score >= 45 ? "Strong Contender" : "Developing Profile",
        headline: "Your scholarship journey starts with clarity",
        strengths: ["Ambition to study abroad", "Completed full assessment", "Awareness of scholarship landscape"],
        gaps: ["Profile details need strengthening", "Application documents may need work", "Language test preparation"],
        recommendations: ["Take IELTS or TOEFL soon", "Start your SOP draft today", "Research 5 target scholarships", "Connect with a mentor"],
        best_scholarships: ["Commonwealth Scholarship", "Chevening", "DAAD"],
        best_countries: ["United Kingdom", "Germany", "Netherlands"],
        category_scores: { "Academic Strength": 60, "English Readiness": 40, "Research Profile": 30, "Professional Experience": 50, "Application Readiness": 35 },
        next_milestone: "Write the first paragraph of your SOP this week"
      });
    }
    setLoading(false);
  }

  const verdictColor = (v) => {
    if (v === "Scholar-Ready") return COLORS.success;
    if (v === "Strong Contender") return COLORS.gold;
    if (v === "Developing Profile") return COLORS.blue;
    return COLORS.muted;
  };

  const canContinue = () => {
    const ans = answers[question?.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  };

  // ── LANDING ──────────────────────────────────────────────────────
  if (screen === "landing") return (
    <div style={{
      minHeight: "100vh", background: COLORS.navy, fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px",
      backgroundImage: `radial-gradient(ellipse at 20% 20%, #1a2a6c22 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #F0B42911 0%, transparent 60%)`
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#162050", borderRadius: 14, padding: "10px 20px",
            border: "1px solid #F0B42930"
          }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.white, letterSpacing: "-0.02em" }}>
              Scholar<span style={{ color: COLORS.gold }}>Forge</span> AI
            </span>
          </div>
        </div>

        {/* Hero */}
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 42px)", fontFamily: "'Playfair Display', serif",
          color: COLORS.white, lineHeight: 1.15, marginBottom: 16, fontWeight: 900
        }}>
          Discover Your<br />
          <span style={{ color: COLORS.gold }}>Scholarship Readiness Score™</span>
        </h1>
        <p style={{ fontSize: 16, color: COLORS.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
          Answer 10 questions. Our Scholarship Intelligence System analyses your profile and gives you a personalised score, scholarship matches, and a winning action plan — in 60 seconds.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 36 }}>
          {[["10K+", "Students Assessed"], ["95%", "Found New Matches"], ["60s", "To Your Score"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>{n}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Name input */}
        <input
          placeholder="Your first name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 12,
            background: "#162050", border: "1.5px solid #1E2D5A",
            color: COLORS.white, fontSize: 15, outline: "none", marginBottom: 14,
            boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif"
          }}
        />

        <button onClick={() => setScreen("quiz")} style={{
          width: "100%", padding: "16px", borderRadius: 14, fontSize: 16, fontWeight: 700,
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDim})`,
          color: COLORS.navy, border: "none", cursor: "pointer",
          boxShadow: `0 4px 24px ${COLORS.gold}44`, letterSpacing: "0.02em",
          transition: "transform 0.15s"
        }}>
          Check My Scholarship Readiness Score™ →
        </button>

        <p style={{ fontSize: 12, color: "#4A5A8A", marginTop: 14 }}>
          Free · No account required · Takes 60 seconds
        </p>
      </div>
    </div>
  );

  // ── QUIZ ─────────────────────────────────────────────────────────
  if (screen === "quiz") return (
    <div style={{
      minHeight: "100vh", background: COLORS.navy, fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", padding: "0 16px 32px",
      backgroundImage: `radial-gradient(ellipse at 80% 0%, #F0B42908 0%, transparent 50%)`
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Email capture modal rendered over quiz */}
      {showEmailModal && <EmailCaptureModal onSubmit={handleEmailSubmit} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.white }}>
            Scholar<span style={{ color: COLORS.gold }}>Forge</span>
          </span>
        </div>
        <span style={{ fontSize: 13, color: COLORS.muted }}>{currentQ + 1} / {questions.length}</span>
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: "#162050", borderRadius: 99, marginBottom: 32, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.gold}88, ${COLORS.gold})`,
          borderRadius: 99, transition: "width 0.4s ease"
        }} />
      </div>

      {/* Question card */}
      <div style={{
        flex: 1, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.2s ease"
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{question.icon}</div>
        <h2 style={{
          fontSize: "clamp(18px, 4vw, 22px)", color: COLORS.white, fontFamily: "'Playfair Display', serif",
          fontWeight: 700, marginBottom: 24, lineHeight: 1.3
        }}>{question.label}</h2>

        {question.type === "multiselect" ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {question.options.map(opt => (
              <Chip
                key={opt.value}
                active={(answers[question.id] || []).includes(opt.value)}
                onClick={() => selectAnswer(question.id, opt.value, true)}
              >{opt.label}</Chip>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map(opt => {
              const selected = answers[question.id] === opt.value;
              return (
                <button key={opt.value} onClick={() => selectAnswer(question.id, opt.value)} style={{
                  padding: "14px 18px", borderRadius: 12, textAlign: "left", cursor: "pointer",
                  border: selected ? `1.5px solid ${COLORS.gold}` : "1.5px solid #1E2D5A",
                  background: selected ? `${COLORS.gold}14` : "#162050",
                  color: selected ? COLORS.goldLight : COLORS.white,
                  fontSize: 14, fontWeight: selected ? 600 : 400,
                  transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: selected ? `0 0 16px ${COLORS.gold}22` : "none"
                }}>
                  <span style={{ marginRight: 10, opacity: 0.5 }}>
                    {selected ? "●" : "○"}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {currentQ > 0 && (
          <button onClick={prev} style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #1E2D5A",
            background: "transparent", color: COLORS.muted, fontSize: 15, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>← Back</button>
        )}
        <button onClick={next} disabled={!canContinue()} style={{
          flex: 2, padding: "14px", borderRadius: 12, border: "none",
          background: canContinue() ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDim})` : "#1E2D5A",
          color: canContinue() ? COLORS.navy : COLORS.muted,
          fontSize: 15, fontWeight: 700, cursor: canContinue() ? "pointer" : "not-allowed",
          fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
          boxShadow: canContinue() ? `0 4px 16px ${COLORS.gold}44` : "none"
        }}>
          {currentQ === questions.length - 1 ? "Generate My Score ✦" : "Continue →"}
        </button>
      </div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────
  return (
    <div ref={resultRef} style={{
      minHeight: "100vh", background: COLORS.navy, fontFamily: "'DM Sans', sans-serif",
      padding: "0 16px 48px",
      backgroundImage: `radial-gradient(ellipse at 50% 0%, #F0B42912 0%, transparent 50%)`
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 24px" }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>
          ⚡ Scholar<span style={{ color: COLORS.gold }}>Forge</span>
        </span>
        <button onClick={() => { setScreen("landing"); setCurrentQ(0); setAnswers({}); setResult(null); setLeadData(null); }} style={{
          fontSize: 12, color: COLORS.muted, background: "transparent", border: "1px solid #1E2D5A",
          borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Retake →</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 20, animation: "spin 1.5s linear infinite" }}>✦</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: COLORS.muted, fontSize: 15 }}>Analysing your scholarship profile…</p>
          <p style={{ color: "#2A3A6A", fontSize: 13, marginTop: 8 }}>Powered by ScholarForge Scholarship Intelligence System</p>
        </div>
      ) : result ? (
        <>
          {/* Score hero */}
          <div style={{
            background: "#162050", borderRadius: 20, padding: "28px 24px",
            border: "1px solid #1E2D5A", marginBottom: 16, textAlign: "center",
            backgroundImage: `radial-gradient(ellipse at 50% 100%, ${COLORS.gold}0A 0%, transparent 60%)`
          }}>
            <div style={{ marginBottom: 4, fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Your Scholarship Readiness Score™
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
              <ScoreRing score={result.score} size={150} />
            </div>
            <div style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700,
              background: `${verdictColor(result.verdict)}22`,
              color: verdictColor(result.verdict),
              border: `1px solid ${verdictColor(result.verdict)}44`,
              marginBottom: 12
            }}>{result.verdict}</div>
            <h2 style={{
              fontSize: "clamp(16px, 4vw, 20px)", color: COLORS.white,
              fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.3
            }}>{result.headline}</h2>
          </div>

          {/* === EARLY CTA - RIGHT AFTER SCORE === */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <p style={{
              fontSize: 15,
              color: COLORS.white,
              lineHeight: 1.5,
              marginBottom: 16
            }}>
              Your Scholarship Readiness Score™ shows real potential.<br />
              Now get the complete intelligence system that turns this score into actual fully-funded offers.
            </p>

            <a
              href="https://selar.com/scholarshipblueprint"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDim})`,
                color: COLORS.navy,
                textDecoration: "none",
                boxShadow: `0 8px 32px ${COLORS.gold}44`,
              }}
            >
              Get The Global Scholar System™ Blueprint Now →
            </a>

            <p style={{ fontSize: 13, color: "#2A3A6A", marginTop: 12 }}>
              ₦5,000 • Instant access • Risk-free for serious applicants
            </p>
          </div>

          {/* Category breakdown */}
          <div style={{ background: "#162050", borderRadius: 20, padding: "22px 20px", border: "1px solid #1E2D5A", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 18 }}>📊 Profile Breakdown</h3>
            {Object.entries(result.category_scores || {}).map(([label, val]) => (
              <ProgressBar key={label} label={label} value={val}
                color={val >= 70 ? COLORS.success : val >= 45 ? COLORS.gold : COLORS.danger} />
            ))}
          </div>

          {/* Strengths & Gaps */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#162050", borderRadius: 18, padding: "18px 16px", border: "1px solid #1E2D5A" }}>
              <div style={{ fontSize: 13, color: COLORS.success, fontWeight: 700, marginBottom: 12 }}>✓ Strengths</div>
              {(result.strengths || []).map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8, lineHeight: 1.5 }}>• {s}</div>
              ))}
            </div>
            <div style={{ background: "#162050", borderRadius: 18, padding: "18px 16px", border: "1px solid #1E2D5A" }}>
              <div style={{ fontSize: 13, color: COLORS.danger, fontWeight: 700, marginBottom: 12 }}>⚠ Gaps</div>
              {(result.gaps || []).map((g, i) => (
                <div key={i} style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8, lineHeight: 1.5 }}>• {g}</div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: "#162050", borderRadius: 20, padding: "22px 20px", border: "1px solid #1E2D5A", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Action Plan</h3>
            {(result.recommendations || []).map((r, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12,
                padding: "12px 14px", background: "#0F1A3E", borderRadius: 12
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: `${COLORS.gold}22`,
                  color: COLORS.gold, fontSize: 12, fontWeight: 800, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Best matches */}
          <div style={{ background: "#162050", borderRadius: 20, padding: "22px 20px", border: "1px solid #1E2D5A", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏅 Top Scholarship Matches</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {(result.best_scholarships || []).map((s, i) => (
                <span key={i} style={{
                  padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: `${COLORS.gold}14`, color: COLORS.gold, border: `1px solid ${COLORS.gold}33`
                }}>✦ {s}</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>Best countries for your profile:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(result.best_countries || []).map((c, i) => (
                <span key={i} style={{
                  padding: "6px 12px", borderRadius: 99, fontSize: 12,
                  background: "#0F1A3E", color: COLORS.muted, border: "1px solid #1E2D5A"
                }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Next milestone */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}18, ${COLORS.gold}08)`,
            borderRadius: 18, padding: "20px", border: `1px solid ${COLORS.gold}33`, marginBottom: 24
          }}>
            <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
              ⚡ This Week's Priority
            </div>
            <p style={{ fontSize: 14, color: COLORS.white, lineHeight: 1.6, margin: 0 }}>{result.next_milestone}</p>
          </div>

          {/* === SECTION A: What Your Score Actually Means === */}
          <div style={{ background: "#162050", borderRadius: 20, padding: "22px 20px", border: "1px solid #1E2D5A", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              📐 What Your Scholarship Readiness Score™ Actually Means
            </h3>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 18 }}>
              This is not a motivational number. It is a diagnostic. Here is what each tier reflects about your real positioning with scholarship committees.
            </p>
            {[
              {
                range: "80–100", label: "Scholar-Ready", color: COLORS.success,
                desc: "Your profile is genuinely competitive. You have the academic record, documentation, and narrative clarity that selection committees reward. Your priority now is targeting the right scholarships and submitting a polished application — not building your profile from scratch."
              },
              {
                range: "60–79", label: "Strong Contender", color: COLORS.gold,
                desc: "You have real potential and a solid foundation, but one or two critical gaps are costing you. Most students in this range lose scholarships not because of academic weakness, but because their SOP is generic, their referees are underprepared, or they are applying to the wrong programmes for their profile."
              },
              {
                range: "40–59", label: "Developing Profile", color: COLORS.blue,
                desc: "Your application will be screened out before a committee reads your SOP. At this stage, the work is not about writing — it is about strategically building the profile indicators that committees use to shortlist. With 3–6 months of focused effort, this score is moveable."
              },
              {
                range: "Below 40", label: "Early Stage", color: COLORS.muted,
                desc: "You are earlier in the process than you may realise. That is not a problem — it is important information. Students who rush an application without the right profile waste the cycle and lose confidence. Your path forward is a structured 12-month plan, not an immediate application."
              },
            ].map(({ range, label, color, desc }) => (
              <div key={range} style={{
                padding: "14px 16px", borderRadius: 14, marginBottom: 10,
                border: `1px solid ${color}33`,
                background: result.score >= parseInt(range) || range === "Below 40"
                  ? `${color}10` : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                    background: `${color}20`, color, border: `1px solid ${color}44`
                  }}>{range}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{label}</span>
                  {((result.score >= 80 && range === "80–100") ||
                    (result.score >= 60 && result.score < 80 && range === "60–79") ||
                    (result.score >= 40 && result.score < 60 && range === "40–59") ||
                    (result.score < 40 && range === "Below 40")) && (
                    <span style={{ fontSize: 10, color, fontWeight: 700, marginLeft: "auto" }}>← You are here</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* === SECTION B: Why Strong Students Miss Scholarships === */}
          <div style={{ background: "#162050", borderRadius: 20, padding: "22px 20px", border: "1px solid #1E2D5A", marginBottom: 24 }}>
            <h3 style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              🔍 Why Many Strong Students Still Miss Scholarships
            </h3>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 18 }}>
              Academic excellence is necessary, but it is not sufficient. These are the five most common reasons qualified African students are rejected — and why the Scholarship Readiness Score™ alone is not enough.
            </p>
            {[
              {
                n: "01", title: "Generic Statements of Purpose",
                body: "Most SOPs read like they were written for any scholarship, by any applicant, from any country. Committees can tell. A winning SOP is specific, personal, and structurally aligned to what that scholarship values — not what you think sounds impressive."
              },
              {
                n: "02", title: "Applying to the Wrong Scholarships",
                body: "Many students apply to the most famous scholarships regardless of fit. Chevening, for example, is not primarily academic — it is a leadership programme. Misalignment between your profile and a scholarship's selection criteria is a quiet, invisible rejection reason."
              },
              {
                n: "03", title: "Underprepared Referees",
                body: "A weak or generic reference letter from an otherwise credible referee costs more than most applicants realise. Referees need to be briefed, given your materials, and guided on what to emphasise. This is not their job — it is yours."
              },
              {
                n: "04", title: "No Clear Narrative Thread",
                body: "Your academic record, work history, goals, and community impact must form a coherent story. When each part of your application exists independently rather than building toward a single, compelling argument, committees struggle to remember you — and move on."
              },
              {
                n: "05", title: "Applying Without a System",
                body: "Scholarship applications have moving parts: documents, deadlines, tailored essays, interview prep, and follow-up. Students who treat each application as a one-off task rather than a managed process make avoidable errors under pressure — and miss cycles they were qualified for."
              },
            ].map(({ n, title, body }) => (
              <div key={n} style={{
                display: "flex", gap: 14, marginBottom: 16,
                padding: "14px 16px", background: "#0F1A3E", borderRadius: 13,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 900, color: COLORS.gold,
                  fontFamily: "'Playfair Display', serif", flexShrink: 0,
                  minWidth: 24, paddingTop: 2,
                }}>{n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white, marginBottom: 5 }}>{title}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.7 }}>{body}</div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 4, padding: "16px", borderRadius: 13,
              background: `${COLORS.gold}0C`, border: `1px solid ${COLORS.gold}33`,
            }}>
              <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>
                The Global Scholar System™ was built specifically to solve these five problems — with step-by-step frameworks for your SOP, scholarship selection strategy, referee briefing, narrative development, and application management.
              </p>
            </div>
          </div>

          {/* === FINAL CTA === */}
          <div style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: 15, color: COLORS.white, textAlign: "center",
              marginBottom: 20, lineHeight: 1.65,
            }}>
              Your <strong>Scholarship Readiness Score™</strong> shows where you stand today.<br />
              <span style={{ color: COLORS.muted }}>The <strong style={{ color: COLORS.white }}>Global Scholar System™</strong> shows you exactly how to move forward.</span>
            </p>

            <a
              href="https://selar.com/scholarshipblueprint"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                padding: "18px 24px",
                borderRadius: 16,
                fontSize: 17,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDim})`,
                color: COLORS.navy,
                textAlign: "center",
                textDecoration: "none",
                boxShadow: `0 8px 32px ${COLORS.gold}44`,
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            >
              Get The Global Scholar System™ Blueprint Now →
            </a>

            <p style={{
              textAlign: "center", fontSize: 13, color: "#2A3A6A", margin: "8px 0 0"
            }}>
              ₦5,000 • Instant access • Risk-free for serious applicants
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#2A3A6A" }}>
            ScholarForge AI · Scholarship Intelligence System
          </p>
        </>
      ) : null}
    </div>
  );
}