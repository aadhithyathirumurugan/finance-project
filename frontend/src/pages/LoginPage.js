import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { TrendingUp, Shield, PieChart, Wallet, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      // Pass the entire response object — AuthContext.login expects a single object
      login(res.data);
      toast.success(`Welcome, ${res.data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(-4deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-22px) scale(1.04); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes pieRotate {
          from { transform: rotate(-90deg); stroke-dashoffset: 100; }
          to { transform: rotate(-90deg); stroke-dashoffset: 30; }
        }
        .login-input:focus {
          border-color: #a8926a !important;
          box-shadow: 0 0 0 3px rgba(168, 146, 106, 0.15) !important;
        }
        .login-submit:hover {
          background: linear-gradient(135deg, #5a5a5a 0%, #3d3d3d 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
        }
        .test-account-card:hover {
          border-color: #a8926a !important;
          background: #faf8f5 !important;
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .login-page-layout { flex-direction: column !important; }
          .login-left-panel { display: none !important; }
          .login-right-panel { padding: 32px 20px !important; }
          .login-mobile-brand { display: flex !important; }
        }
      `}</style>

      <div className="login-page-layout" style={styles.page}>
        {/* ===== LEFT PANEL ===== */}
        <div className="login-left-panel" style={styles.leftPanel}>
          {/* Dot pattern */}
          <div style={styles.patternOverlay}></div>

          {/* Paper-cut shapes */}
          <div style={styles.paperCut1}>
            <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
              <rect x="0" y="0" width="120" height="160" rx="8" fill="rgba(255,255,255,0.06)" />
              <line x1="15" y1="30" x2="105" y2="30" stroke="rgba(168,146,106,0.25)" strokeWidth="1" />
              <line x1="15" y1="45" x2="85" y2="45" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="15" y1="60" x2="95" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="15" y1="75" x2="70" y2="75" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <rect x="15" y="95" width="30" height="8" rx="2" fill="rgba(168,146,106,0.2)" />
              <rect x="50" y="95" width="20" height="8" rx="2" fill="rgba(255,255,255,0.06)" />
              <circle cx="100" cy="15" r="6" fill="rgba(168,146,106,0.2)" />
            </svg>
          </div>

          <div style={styles.paperCut2}>
            <svg width="100" height="130" viewBox="0 0 100 130" fill="none">
              <rect x="0" y="0" width="100" height="130" rx="6" fill="rgba(255,255,255,0.05)" />
              <text x="12" y="22" fontSize="8" fill="rgba(168,146,106,0.35)" fontFamily="Inter">₹ RECEIPT</text>
              <line x1="10" y1="32" x2="90" y2="32" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />
              <text x="12" y="48" fontSize="7" fill="rgba(255,255,255,0.12)" fontFamily="Inter">Salary</text>
              <text x="70" y="48" fontSize="7" fill="rgba(168,146,106,0.25)" fontFamily="Inter">+75K</text>
              <text x="12" y="63" fontSize="7" fill="rgba(255,255,255,0.12)" fontFamily="Inter">Rent</text>
              <text x="70" y="63" fontSize="7" fill="rgba(168,146,106,0.25)" fontFamily="Inter">-12K</text>
              <text x="12" y="78" fontSize="7" fill="rgba(255,255,255,0.12)" fontFamily="Inter">Food</text>
              <text x="70" y="78" fontSize="7" fill="rgba(168,146,106,0.25)" fontFamily="Inter">-4K</text>
              <line x1="10" y1="88" x2="90" y2="88" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />
              <text x="12" y="104" fontSize="8" fontWeight="bold" fill="rgba(168,146,106,0.35)" fontFamily="Inter">NET: +59K</text>
            </svg>
          </div>

          {/* Mini bar chart */}
          <div style={styles.miniBarChart}>
            <svg width="140" height="100" viewBox="0 0 140 100" fill="none">
              <rect x="0" y="0" width="140" height="100" rx="10" fill="rgba(255,255,255,0.05)" />
              <text x="12" y="18" fontSize="8" fill="rgba(168,146,106,0.4)" fontFamily="Inter" fontWeight="600">Monthly Spend</text>
              {/* Bars */}
              <rect x="15" y="55" width="14" height="30" rx="3" fill="rgba(168,146,106,0.3)" style={{transformOrigin:'15px 85px', animation:'barGrow 1.2s ease 0.3s both'}} />
              <rect x="35" y="40" width="14" height="45" rx="3" fill="rgba(168,146,106,0.4)" style={{transformOrigin:'35px 85px', animation:'barGrow 1.2s ease 0.5s both'}} />
              <rect x="55" y="50" width="14" height="35" rx="3" fill="rgba(168,146,106,0.25)" style={{transformOrigin:'55px 85px', animation:'barGrow 1.2s ease 0.7s both'}} />
              <rect x="75" y="30" width="14" height="55" rx="3" fill="rgba(168,146,106,0.45)" style={{transformOrigin:'75px 85px', animation:'barGrow 1.2s ease 0.9s both'}} />
              <rect x="95" y="45" width="14" height="40" rx="3" fill="rgba(168,146,106,0.35)" style={{transformOrigin:'95px 85px', animation:'barGrow 1.2s ease 1.1s both'}} />
              <rect x="115" y="60" width="14" height="25" rx="3" fill="rgba(168,146,106,0.2)" style={{transformOrigin:'115px 85px', animation:'barGrow 1.2s ease 1.3s both'}} />
              {/* Baseline */}
              <line x1="12" y1="87" x2="132" y2="87" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          </div>

          {/* Mini line graph */}
          <div style={styles.miniLineGraph}>
            <svg width="130" height="80" viewBox="0 0 130 80" fill="none">
              <rect x="0" y="0" width="130" height="80" rx="10" fill="rgba(255,255,255,0.05)" />
              <text x="10" y="16" fontSize="7" fill="rgba(168,146,106,0.4)" fontFamily="Inter" fontWeight="600">Income Trend</text>
              <polyline
                points="15,55 30,45 45,50 60,35 75,40 90,28 105,32 120,22"
                fill="none"
                stroke="rgba(168,146,106,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="200"
                style={{animation:'drawLine 2s ease 0.5s both'}}
              />
              {/* Data dots */}
              <circle cx="15" cy="55" r="2.5" fill="rgba(168,146,106,0.6)" />
              <circle cx="45" cy="50" r="2.5" fill="rgba(168,146,106,0.6)" />
              <circle cx="75" cy="40" r="2.5" fill="rgba(168,146,106,0.6)" />
              <circle cx="105" cy="32" r="2.5" fill="rgba(168,146,106,0.6)" />
              {/* Grid lines */}
              <line x1="15" y1="65" x2="120" y2="65" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <line x1="15" y1="45" x2="120" y2="45" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <line x1="15" y1="25" x2="120" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Donut/Pie chart */}
          <div style={styles.miniPieChart}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <circle cx="45" cy="45" r="30" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
              <circle cx="45" cy="45" r="30" stroke="rgba(168,146,106,0.35)" strokeWidth="10" fill="none"
                strokeDasharray="188.5" strokeDashoffset="120"
                style={{transform:'rotate(-90deg)', transformOrigin:'45px 45px'}} />
              <circle cx="45" cy="45" r="30" stroke="rgba(168,146,106,0.18)" strokeWidth="10" fill="none"
                strokeDasharray="188.5" strokeDashoffset="150"
                style={{transform:'rotate(30deg)', transformOrigin:'45px 45px'}} />
              <text x="45" y="47" fontSize="9" fill="rgba(168,146,106,0.5)" fontFamily="Inter" fontWeight="700" textAnchor="middle">68%</text>
            </svg>
          </div>

          {/* Floating geometric shapes */}
          <div style={{...styles.floatingShape, ...styles.shape1}}></div>
          <div style={{...styles.floatingShape, ...styles.shape2}}></div>

          {/* Main content */}
          <div style={styles.leftContent}>
            <div style={styles.logoRow}>
              <div style={styles.logo}>
                <Wallet size={20} />
              </div>
              <span style={styles.logoText}>FinTrack</span>
            </div>

            <h1 style={styles.heroTitle}>
              Smart Finance<br />Management
            </h1>
            <p style={styles.heroDesc}>
              Track income, expenses, and stay on top of your financial goals
              with our powerful analytics dashboard.
            </p>

            <div style={styles.features}>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div style={styles.featureTitle}>Track Income & Expenses</div>
                  <div style={styles.featureDesc}>Monitor all your transactions in one place</div>
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <PieChart size={18} />
                </div>
                <div>
                  <div style={styles.featureTitle}>Visual Analytics</div>
                  <div style={styles.featureDesc}>Charts and graphs to understand your spending</div>
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <Shield size={18} />
                </div>
                <div>
                  <div style={styles.featureTitle}>Role Based Access</div>
                  <div style={styles.featureDesc}>Secure login with Admin, Analyst & Viewer roles</div>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div style={styles.statsStrip}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>₹2.4L</div>
                <div style={styles.statLabel}>Tracked</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>150+</div>
                <div style={styles.statLabel}>Records</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>3</div>
                <div style={styles.statLabel}>Roles</div>
              </div>
            </div>
          </div>

          {/* Corner glows */}
          <div style={styles.cornerTopRight}></div>
          <div style={styles.cornerBottomLeft}></div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="login-right-panel" style={styles.rightPanel}>
          {/* Background accents */}
          <div style={styles.rightBgCircle1}></div>
          <div style={styles.rightBgCircle2}></div>

          {/* Small decorative graph on right side */}
          <div style={styles.rightMiniGraph}>
            <svg width="80" height="50" viewBox="0 0 80 50" fill="none" opacity="0.15">
              <polyline points="5,40 15,32 25,36 35,20 45,28 55,15 65,22 75,10" fill="none" stroke="#a8926a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div style={styles.rightMiniDots}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.08">
              {[0,1,2,3,4].map(row => [0,1,2,3,4].map(col => (
                <circle key={`${row}-${col}`} cx={6 + col * 12} cy={6 + row * 12} r="2" fill="#a8926a" />
              )))}
            </svg>
          </div>

          <div style={styles.formWrapper}>
            {/* Mobile brand */}
            <div className="login-mobile-brand" style={styles.mobileBrand}>
              <Wallet size={18} color="#a8926a" />
              <span style={styles.mobileBrandText}>FinTrack</span>
            </div>

            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Enter your credentials to access your account</p>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  className="login-input"
                  style={styles.input}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <input
                  className="login-input"
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="login-submit"
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>Sign In <ArrowRight size={16} style={{ marginLeft: "6px" }} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>Demo Accounts</span>
              <span style={styles.dividerLine}></span>
            </div>

            {/* Test accounts — only Analyst and Viewer */}
            <div style={styles.testAccounts}>
              <div className="test-account-card" style={styles.testAccount}>
                <div style={styles.testAccountLeft}>
                  <span style={{...styles.roleBadge, background: "#e5e7eb", color: "#4b5563"}}>Analyst</span>
                  <span style={styles.testEmail}>analyst@finance.com</span>
                </div>
                <span style={styles.testPass}>analyst123</span>
              </div>
              <div className="test-account-card" style={styles.testAccount}>
                <div style={styles.testAccountLeft}>
                  <span style={{...styles.roleBadge, background: "#f0ece4", color: "#8b7355"}}>Viewer</span>
                  <span style={styles.testEmail}>viewer@finance.com</span>
                </div>
                <span style={styles.testPass}>viewer123</span>
              </div>
            </div>

            {/* Footer */}
            <div style={styles.footerNote}>
              <span>Student Finance Management System</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },

  // === LEFT PANEL ===
  leftPanel: {
    flex: "1",
    background: "linear-gradient(160deg, #3a3a3a 0%, #4a4a4a 30%, #5c5c5c 60%, #6b6b6b 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    position: "relative",
    overflow: "hidden",
  },
  patternOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    zIndex: 1,
  },
  leftContent: {
    maxWidth: "440px",
    position: "relative",
    zIndex: 3,
    animation: "fadeSlideUp 0.6s ease",
  },

  // Paper cut decorations
  paperCut1: {
    position: "absolute",
    top: "40px",
    right: "30px",
    zIndex: 2,
    opacity: 0.9,
    transform: "rotate(6deg)",
    animation: "float1 8s ease-in-out infinite",
  },
  paperCut2: {
    position: "absolute",
    bottom: "50px",
    right: "50px",
    zIndex: 2,
    opacity: 0.85,
    transform: "rotate(-4deg)",
    animation: "float2 9s ease-in-out infinite",
  },

  // Mini charts
  miniBarChart: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%) rotate(2deg)",
    zIndex: 2,
    opacity: 0.9,
    animation: "float3 7s ease-in-out infinite",
  },
  miniLineGraph: {
    position: "absolute",
    bottom: "40px",
    left: "30px",
    zIndex: 2,
    opacity: 0.85,
    transform: "rotate(-3deg)",
    animation: "float1 10s ease-in-out infinite",
  },
  miniPieChart: {
    position: "absolute",
    top: "50px",
    left: "40px",
    zIndex: 2,
    opacity: 0.8,
    animation: "float2 8s ease-in-out infinite",
  },

  // Floating shapes
  floatingShape: {
    position: "absolute",
    zIndex: 1,
  },
  shape1: {
    width: "60px",
    height: "60px",
    border: "2px solid rgba(168,146,106,0.12)",
    borderRadius: "12px",
    top: "20%",
    left: "22%",
    transform: "rotate(25deg)",
    animation: "float2 11s ease-in-out infinite",
  },
  shape2: {
    width: "40px",
    height: "40px",
    background: "rgba(168,146,106,0.08)",
    borderRadius: "50%",
    bottom: "30%",
    left: "15%",
    animation: "float3 9s ease-in-out infinite",
  },

  // Corner decorations
  cornerTopRight: {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,146,106,0.1) 0%, transparent 70%)",
    top: "-60px",
    right: "-60px",
    zIndex: 1,
  },
  cornerBottomLeft: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
    bottom: "-50px",
    left: "-50px",
    zIndex: 1,
  },

  // Logo
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logo: {
    width: "42px",
    height: "42px",
    background: "rgba(168, 146, 106, 0.25)",
    border: "1px solid rgba(168, 146, 106, 0.35)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    color: "#d4c5a9",
  },
  logoText: {
    fontSize: "21px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  // Hero
  heroTitle: {
    fontSize: "32px",
    fontWeight: "800",
    lineHeight: "1.2",
    marginBottom: "14px",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #ffffff 0%, #d4c5a9 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroDesc: {
    fontSize: "15px",
    lineHeight: "1.7",
    opacity: 0.85,
    marginBottom: "28px",
    color: "#d4d0c8",
  },

  // Features
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "28px",
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  featureIcon: {
    width: "38px",
    height: "38px",
    background: "rgba(168, 146, 106, 0.2)",
    border: "1px solid rgba(168, 146, 106, 0.25)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "#d4c5a9",
  },
  featureTitle: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "2px",
    color: "#f0ece4",
  },
  featureDesc: {
    fontSize: "12px",
    color: "#b8b3a8",
  },

  // Stats strip
  statsStrip: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "16px 24px",
  },
  statItem: {
    flex: 1,
    textAlign: "center",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#d4c5a9",
    marginBottom: "2px",
  },
  statLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600",
  },
  statDivider: {
    width: "1px",
    height: "30px",
    background: "rgba(255,255,255,0.1)",
  },

  // === RIGHT PANEL ===
  rightPanel: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background: "linear-gradient(180deg, #f7f5f0 0%, #eeebe4 100%)",
    position: "relative",
    overflow: "hidden",
  },
  rightBgCircle1: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,146,106,0.07) 0%, transparent 70%)",
    top: "-40px",
    right: "-60px",
  },
  rightBgCircle2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(100,100,100,0.04) 0%, transparent 70%)",
    bottom: "-30px",
    left: "-30px",
  },
  rightMiniGraph: {
    position: "absolute",
    top: "30px",
    right: "40px",
    zIndex: 1,
  },
  rightMiniDots: {
    position: "absolute",
    bottom: "40px",
    left: "30px",
    zIndex: 1,
  },

  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    zIndex: 2,
    animation: "fadeSlideUp 0.6s ease 0.15s both",
  },

  // Mobile brand
  mobileBrand: {
    display: "none",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  mobileBrandText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#4a4a4a",
  },

  // Form
  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2d2d2d",
    marginBottom: "6px",
    letterSpacing: "-0.3px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#8a8478",
    marginBottom: "28px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#b91c1c",
    padding: "11px 16px",
    fontSize: "13px",
    marginBottom: "18px",
    textAlign: "center",
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#4a4540",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #d4cfc5",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
    color: "#2d2d2d",
    outline: "none",
    transition: "all 0.2s ease",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #4a4a4a 0%, #333333 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    marginTop: "6px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Divider
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "26px 0 16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #c9c3b8, transparent)",
  },
  dividerText: {
    fontSize: "11px",
    color: "#9e9688",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  // Test accounts
  testAccounts: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  testAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "11px 14px",
    background: "#ffffff",
    border: "1.5px solid #e2ddd4",
    borderRadius: "10px",
    fontSize: "12px",
    transition: "all 0.2s ease",
    cursor: "default",
  },
  testAccountLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  roleBadge: {
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    flexShrink: 0,
  },
  testEmail: {
    color: "#4a4540",
    fontWeight: "500",
  },
  testPass: {
    color: "#a39e94",
    fontFamily: "'Courier New', monospace",
    fontSize: "12px",
    fontWeight: "500",
    background: "#f5f3ee",
    padding: "2px 8px",
    borderRadius: "4px",
  },

  // Footer
  footerNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "28px",
    fontSize: "11px",
    color: "#a09890",
    fontWeight: "500",
  },
};

export default LoginPage;
