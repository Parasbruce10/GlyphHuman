// ============================================================
// ✅ FIX: React ko global window se access karo
// ============================================================
const React = window.React;
const ReactDOM = window.ReactDOM;

// React Hook Destructuring
const { useState, useEffect } = React;

// ============================================================
// 1. Header Component
// ============================================================
const Header = ({ setActivePage }) => {
    return (
        <header className="app-header">
            <div className="header-logo" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
                <span className="logo-icon">✦</span> GlyphHuman
            </div>
        </header>
    );
};

// ============================================================
// 2. Main Dashboard Form Component (Humanizer)
// ============================================================
const MainContent = () => {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const getWordCount = (text) => {
        const cleanText = text.trim();
        return cleanText === "" ? 0 : cleanText.split(/\s+/).length;
    };

    const handleHumanize = async (e) => {
        e.preventDefault();
        
        if (!inputText.trim()) {
            alert("Please paste or type some AI generated text first!");
            return;
        }

        setIsLoading(true);
        setCopySuccess(false);
        
        try {
            const response = await fetch("https://hamzaparas-glyphhuman.hf.space/humanize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                throw new Error("Backend connection error");
            }

            const data = await response.json();
            setOutputText(data.humanized);
            
        } catch (error) {
            console.error("Humanize Error:", error);
            alert("Flask server contact nahi ho pa raha. Check karein terminal par python app.py chal raha hai!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setInputText("");
        setOutputText("");
        setCopySuccess(false);
    };

    const handleCopyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '35px', marginBottom: '20px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px', fontFamily: 'system-ui, sans-serif' }}>
                    AI Text <span style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Humanizer</span> ✨
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Convert your robotic AI content into natural, human-written style instantly and bypass AI detectors.
                </p>
            </div>

            <form className="premium-dashboard-form" onSubmit={handleHumanize}>
                <div className="form-panel input-panel-side">
                    <div className="panel-header-strip">
                        <span className="panel-headline">AI Generated Text Form</span>
                        {inputText && (
                            <button type="button" className="action-link-btn clear-color" onClick={handleReset}>
                                Clear Form
                            </button>
                        )}
                    </div>
                    
                    <textarea 
                        className="form-modern-textarea"
                        placeholder="Paste your robotic or AI-generated text here (e.g. from ChatGPT, Claude)..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    
                    <div className="panel-footer-strip">
                        <span className="live-stat-badge">{getWordCount(inputText)} words</span>
                        <span className="live-stat-badge">{inputText.length} characters</span>
                    </div>
                </div>

                <div className="form-action-divider">
                    <button 
                        type="submit"
                        className="glow-humanize-submit-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="css-loading-circle"></span>
                        ) : (
                            <>Humanize Text <span className="spark-emoji">✨</span></>
                        )}
                    </button>
                </div>

                <div className="form-panel output-panel-side">
                    <div className="panel-header-strip">
                        <span className="panel-headline">Humanized Output Form</span>
                        {outputText && (
                            <button 
                                type="button" 
                                className={`action-link-btn copy-color ${copySuccess ? 'success-pulse' : ''}`}
                                onClick={handleCopyToClipboard}
                            >
                                {copySuccess ? "Copied! ✓" : "Copy Text"}
                            </button>
                        )}
                    </div>
                    
                    <div className={`form-modern-output-view ${!outputText ? 'view-placeholder-active' : ''}`}>
                        {outputText ? (
                            outputText
                        ) : (
                            <div className="empty-form-placeholder">
                                <p>Your polished, human-written alternative text will be displayed here beautifully.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="panel-footer-strip">
                        {outputText ? (
                            <span className="status-badge-success">✓ 100% Human Score Optimized</span>
                        ) : (
                            <span className="status-badge-pending">Awaiting Input</span>
                        )}
                    </div>
                </div>
            </form>
        </main>
    );
};

// ============================================================
// 3. Detector Component
// ============================================================
const DetectorContent = () => {
    const [inputText, setInputText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scores, setScores] = useState(null);

    const handleDetect = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) {
            alert("Bhai, pehle thora text toh paste karo!");
            return;
        }

        setIsAnalyzing(true);
        setScores(null);

        try {
            const response = await fetch("https://hamzaparas-glyphhuman.hf.space/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            setScores({ ai: data.ai, human: data.human });

        } catch (error) {
            console.error("Error analyzing text:", error);
            alert("API connect nahi ho rahi. Make sure Python server chal raha hai!");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '35px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    AI Content <span style={{ background: 'linear-gradient(45deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Detector</span> 🔍
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Paste your text below to analyze how much of it is written by AI versus a Human.
                </p>
            </div>

            <form className="premium-dashboard-form" onSubmit={handleDetect} style={{ minHeight: '400px' }}>
                <div className="form-panel input-panel-side">
                    <div className="panel-header-strip">
                        <span className="panel-headline">Text to Analyze</span>
                        {inputText && (
                            <button type="button" className="action-link-btn clear-color" onClick={() => {setInputText(""); setScores(null);}}>
                                Clear
                            </button>
                        )}
                    </div>
                    <textarea 
                        className="form-modern-textarea"
                        placeholder="Paste text here to detect AI probability..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                <div className="form-action-divider">
                    <button type="submit" className="glow-humanize-submit-btn" disabled={isAnalyzing} style={{ background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)', boxShadow: '0 4px 25px rgba(234, 88, 12, 0.45)' }}>
                        {isAnalyzing ? <span className="css-loading-circle"></span> : <>Analyze Text 🔍</>}
                    </button>
                </div>

                <div className="form-panel output-panel-side">
                    <div className="panel-header-strip">
                        <span className="panel-headline">Detection Results</span>
                    </div>
                    
                    <div className={`form-modern-output-view ${!scores ? 'view-placeholder-active' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        {!scores ? (
                            <div className="empty-form-placeholder">Awaiting text analysis...</div>
                        ) : (
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}>
                                    <h3 style={{ color: '#fca5a5', margin: 0 }}>🤖 AI Generated</h3>
                                    <h2 style={{ fontSize: '2.5rem', color: '#ef4444', margin: '5px 0' }}>{scores.ai}%</h2>
                                </div>
                                <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
                                    <h3 style={{ color: '#6ee7b7', margin: 0 }}>👤 Human Written</h3>
                                    <h2 style={{ fontSize: '2.5rem', color: '#10b981', margin: '5px 0' }}>{scores.human}%</h2>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </main>
    );
};

// ============================================================
// 4. Contact Component
// ============================================================
const ContactContent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            alert("Bhai, saari fields fill karna zaroori hain!");
            return;
        }

        setIsSubmitting(true);
        setFormStatus("");

        try {
            const response = await fetch("https://formspree.io/f/xzdwbwyk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message, _replyto: email })
            });

            if (response.ok) {
                setFormStatus("success");
                form.reset();
            } else {
                setFormStatus("error");
            }
        } catch (error) {
            setFormStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '35px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    Contact <span style={{ background: 'linear-gradient(45deg, #06b6d4, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span> ✉️
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Have questions or feedback? Drop us a message and we'll get back to you directly.
                </p>
            </div>

            <div className="premium-dashboard-form" style={{ maxWidth: '600px', padding: '40px', flexDirection: 'column', gap: '20px', minHeight: 'auto', margin: '0 auto 40px auto' }}>
                {formStatus === "success" && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#6ee7b7', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                        ✓ Message Sent Successfully! Paras will check it soon.
                    </div>
                )}
                {formStatus === "error" && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#fca5a5', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                        ✕ OOPS! Kuch masla hua hai. Dobara try karein.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Name</label>
                        <input type="text" name="name" placeholder="Enter your full name" required style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                        <input type="email" name="email" placeholder="example@gmail.com" required style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</label>
                        <textarea name="message" placeholder="Type your message here..." required style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', minHeight: '120px', resize: 'vertical' }} />
                    </div>

                    <button type="submit" className="glow-humanize-submit-btn" disabled={isSubmitting} style={{ width: '100%', marginTop: '10px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', boxShadow: '0 4px 25px rgba(6, 182, 212, 0.45)' }}>
                        {isSubmitting ? <span className="css-loading-circle"></span> : <>Send Message 🚀</>}
                    </button>
                </form>
            </div>
        </main>
    );
};

// ============================================================
// 5. Terms Component (Shortened)
// ============================================================
const TermsContent = () => {
    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '35px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    Terms & <span style={{ background: 'linear-gradient(45deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Conditions</span> 📜
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Effective Date: May 2026 | Please read our operational guidelines carefully.
                </p>
            </div>

            <div className="premium-terms-card-view">
                <p style={{ color: '#f1f5f9', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', margin: '0 0 20px 0' }}>
                    Welcome to <strong>GlyphHuman</strong>. By accessing or utilizing our AI Text Humanizer and AI Content Detector, you acknowledge and agree to be bound by the following comprehensive Terms & Conditions.
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#a855f7' }}>1.</span> Use of Services and Licensing
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>GlyphHuman grants you a non-exclusive, non-transferable, and revocable license to utilize our heuristic processing tools.</li>
                        <li>You retain complete, absolute ownership of any text inputs you submit through our platform.</li>
                    </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#a855f7' }}>2.</span> Prohibited Activities
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>Deploy automated bots to spam our backend API.</li>
                        <li>Utilize our service to process content that violates local laws.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                    <h3 style={{ color: '#c084fc', fontSize: '16px', marginBottom: '6px', margin: '0' }}>
                        📧 Contact Information
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>
                        For any legal inquiries: <a href="mailto:resumeprohub1@gmail.com" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>resumeprohub1@gmail.com</a>
                    </p>
                </div>
            </div>
        </main>
    );
};

// ============================================================
// 6. Privacy Component (Shortened)
// ============================================================
const PrivacyContent = () => {
    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '35px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    Privacy <span style={{ background: 'linear-gradient(45deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span> 🛡️
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Effective Date: May 2026 | We prioritize and secure your data confidentiality.
                </p>
            </div>

            <div className="premium-terms-card-view">
                <p style={{ color: '#f1f5f9', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', margin: '0 0 20px 0' }}>
                    At <strong>GlyphHuman</strong>, one of our main priorities is the privacy of our visitors.
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#06b6d4' }}>1.</span> Text Data and Input Processing
                    </h3>
                    <p style={{ margin: '0 0 8px 0' }}>GlyphHuman operates as an instant text optimization utility.</p>
                    <ul style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li><strong>We do not save, store, or cache your text.</strong> Once processed, data is instantly wiped.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                    <h3 style={{ color: '#22d3ee', fontSize: '16px', marginBottom: '6px', margin: '0' }}>
                        ✅ Consent
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>
                        By utilizing our website, you consent to our Privacy Policy.
                    </p>
                </div>
            </div>
        </main>
    );
};

// ============================================================
// 7. About Component (Shortened)
// ============================================================
const AboutContent = () => {
    return (
        <main className="app-main humanizer-page-layout">
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '35px', padding: '0 15px' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    About <span style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GlyphHuman</span> ✨
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Bridging the gap between artificial intelligence and natural human expression.
                </p>
            </div>

            <div className="premium-terms-card-view">
                <p style={{ color: '#f1f5f9', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', margin: '0 0 20px 0', lineHeight: '1.8' }}>
                    Welcome to <strong>GlyphHuman</strong>, your ultimate digital companion designed to bridge the gap between artificial intelligence and natural human expression.
                </p>

                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ color: '#fff', fontSize: '19px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🚀 Our Mission
                    </h3>
                    <p style={{ margin: '0', lineHeight: '1.7' }}>
                        Our mission is simple: to empower writers, students, content creators, and professionals to refine their text seamlessly.
                    </p>
                </div>
            </div>
        </main>
    );
};

// ============================================================
// 8. Home Component
// ============================================================
const HomeContent = ({ setActivePage }) => {
    const [typedText, setTypedText] = useState("");
    const words = [
        "Transforming AI prose to human writing...",
        "Bypassing AI detectors instantly...",
        "100% secure — zero data stored...",
        "Natural language, real results..."
    ];

    useEffect(() => {
        let wi = 0, ci = 0, del = false;
        let timeout;
        const type = () => {
            const w = words[wi];
            if (!del) {
                setTypedText(w.substring(0, ci + 1));
                ci++;
                if (ci === w.length) { del = true; timeout = setTimeout(type, 2200); return; }
            } else {
                setTypedText(w.substring(0, ci - 1));
                ci--;
                if (ci === 0) { del = false; wi = (wi + 1) % words.length; timeout = setTimeout(type, 400); return; }
            }
            timeout = setTimeout(type, del ? 35 : 70);
        };
        type();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <main className="app-main premium-home-layout">
            <div className="orb-lights">
                <div className="orb-1"></div>
                <div className="orb-2"></div>
                <div className="orb-3"></div>
            </div>

            <section className="home-hero-section">
                <div className="home-hero-text animate-fade-in-left">
                    <div className="premium-badge">
                        <div className="badge-live-dot"></div>
                        Next-Gen AI Text Optimizer
                    </div>

                    <h1 className="home-main-title">
                        Make AI Text<br />
                        <span className="gradient-text-accent">Sound Human</span>
                    </h1>

                    <div className="typewriter-container">
                        <span className="tw-prefix">Output →</span>
                        <span className="typewriter-text">{typedText}</span>
                        <div className="typewriter-cursor"></div>
                    </div>

                    <p className="home-description" style={{color:'#94a3b8',fontSize:'16px',lineHeight:'1.75',marginBottom:'32px',maxWidth:'480px'}}>
                        GlyphHuman transforms robotic AI-generated content into natural, fluid human prose. Bypass AI detectors, preserve your meaning, and write with confidence — instantly.
                    </p>

                    <div className="home-stats-row">
                        <div className="home-stat">
                            <div className="home-stat-num">100+</div>
                            <div className="home-stat-label">Texts Humanized</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-num">80%</div>
                            <div className="home-stat-label">Detection Bypass Rate</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-num">0ms</div>
                            <div className="home-stat-label">Data Stored</div>
                        </div>
                    </div>

                    <div className="home-cta-group">
                        <button onClick={() => setActivePage('humanizer')} className="cta-btn-primary">
                            ✨ Humanize Text Now
                        </button>
                        <button onClick={() => setActivePage('detector')} className="cta-btn-secondary">
                            🔍 Check AI Score
                        </button>
                    </div>
                </div>

                <div className="home-hero-graphic animate-fade-in-right">
                    <div className="hero-visual-card">
                        <div className="hvc-header">
                            <span className="hvc-title">Live Processing</span>
                            <span className="hvc-live"><div className="hvc-live-dot"></div>Active</span>
                        </div>

                        <div className="hvc-input-mock">
                            <div className="hvc-label">AI Generated Input</div>
                            <div className="hvc-line" style={{width:'100%'}}></div>
                            <div className="hvc-line" style={{width:'88%'}}></div>
                            <div className="hvc-line" style={{width:'75%'}}></div>
                            <div className="hvc-line" style={{width:'60%'}}></div>
                        </div>

                        <div className="hvc-progress">
                            <div className="hvc-progress-row">
                                <span className="hvc-pname">🤖 AI Detected</span>
                                <span className="hvc-ppct" style={{color:'#ef4444'}}>78%</span>
                            </div>
                            <div className="hvc-track">
                                <div className="hvc-fill hvc-fill-ai"></div>
                            </div>
                        </div>

                        <button className="hvc-btn">
                            <span className="hvc-spark">✦</span> Humanize Now
                        </button>

                        <div className="hvc-output">
                            <div className="hvc-label" style={{color:'#10b981'}}>✓ Humanized Output</div>
                            <div className="hvc-out-line" style={{width:'100%'}}></div>
                            <div className="hvc-out-line" style={{width:'88%'}}></div>
                            <div className="hvc-out-line" style={{width:'70%'}}></div>
                        </div>

                        <div className="float-chip chip-success">✓ 100% Human Score</div>
                        <div className="float-chip chip-secure">🔒 Zero Data Stored</div>
                    </div>
                </div>
            </section>

            <div className="home-trust-bar">
                <div className="trust-item"><span className="trust-icon">⚡</span><span className="trust-text"><strong>Instant</strong> Processing</span></div>
                <div className="trust-item"><span className="trust-icon">🛡️</span><span className="trust-text"><strong>100%</strong> Confidential</span></div>
                <div className="trust-item"><span className="trust-icon">🎯</span><span className="trust-text"><strong>Bypasses</strong> Detectors</span></div>
                <div className="trust-item"><span className="trust-icon">🤖</span><span className="trust-text"><strong>No</strong> AI Model Used</span></div>
                <div className="trust-item"><span className="trust-icon">🆓</span><span className="trust-text"><strong>Completely</strong> Free</span></div>
            </div>

            <section className="home-how-section animate-fade-in-up" style={{textAlign:'center'}}>
                <span className="home-section-tag">Simple Process</span>
                <h2 className="home-section-title">How It <span className="gradient-text-accent" style={{display:'inline'}}>Works</span></h2>
                <p className="home-section-sub">Three simple steps to transform your AI text into natural human writing</p>
                <div className="steps-row">
                    <div className="step-item">
                        <div className="step-num">📋</div>
                        <div className="step-connector"></div>
                        <div className="step-title">Paste Your Text</div>
                        <div className="step-desc">Copy any AI-generated content and paste it into the Humanizer panel</div>
                    </div>
                    <div className="step-item">
                        <div className="step-num">⚙️</div>
                        <div className="step-connector"></div>
                        <div className="step-title">Click Humanize</div>
                        <div className="step-desc">Our Python engine analyzes patterns and transforms robotic phrases instantly</div>
                    </div>
                    <div className="step-item">
                        <div className="step-num">✨</div>
                        <div className="step-title">Copy & Use</div>
                        <div className="step-desc">Get natural, human-sounding text ready to copy, share, or publish</div>
                    </div>
                </div>
            </section>

            <section className="home-features-section animate-fade-in-up" style={{marginTop:'70px',textAlign:'center'}}>
                <span className="home-section-tag">Core Features</span>
                <h2 className="home-section-title">Why Choose <span className="gradient-text-accent" style={{display:'inline'}}>GlyphHuman?</span></h2>
                <p className="home-section-sub">Powerful tools to make your writing genuinely human and undetectable</p>

                <div className="features-grid-layout" style={{textAlign:'left'}}>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-purple"><span className="feature-icon">⚡</span></div>
                        <h3>Instant Processing</h3>
                        <p>Convert AI text to natural prose in milliseconds. Lightning-fast algorithmic results, zero queue time.</p>
                    </div>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-cyan"><span className="feature-icon">🛡️</span></div>
                        <h3>100% Confidential</h3>
                        <p>Your content is processed and instantly wiped. No storage, no logs, no compromise on privacy.</p>
                    </div>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-pink"><span className="feature-icon">🎯</span></div>
                        <h3>Bypass AI Detectors</h3>
                        <p>Smart word-mapping and burstiness simulation help bypass GPTZero, Turnitin, and other detectors.</p>
                    </div>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-green"><span className="feature-icon">🤖</span></div>
                        <h3>No AI Model Used</h3>
                        <p>Pure Python logic — no GPT or Claude API calls. Lightweight, fast, and fully transparent.</p>
                    </div>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-amber"><span className="feature-icon">📊</span></div>
                        <h3>AI Score Detector</h3>
                        <p>Check any text for AI probability. Get instant AI vs Human percentage breakdown.</p>
                    </div>
                    <div className="feature-card-item">
                        <div className="feat-icon-wrap icon-indigo"><span className="feature-icon">🆓</span></div>
                        <h3>Completely Free</h3>
                        <p>Full access to all tools at zero cost. No subscriptions, no limits, no hidden charges ever.</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

// ============================================================
// 9. Footer Component
// ============================================================
const Footer = ({ setActivePage }) => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-top-row">
                    <div className="footer-brand">
                        <div className="header-logo" onClick={() => setActivePage('home')} style={{ cursor: 'pointer', fontSize: '24px', marginBottom: '12px', justifyContent: 'flex-start' }}>
                            <span className="logo-icon">✦</span> GlyphHuman
                        </div>
                        <p className="footer-desc">
                            Bridging the gap between artificial intelligence and natural human expression. Transform robotic text into natural prose and bypass AI detectors effortlessly.
                        </p>
                    </div>

                    <div className="footer-links-col">
                        <h4 className="footer-col-title">Quick Nav</h4>
                        <a href="#home" onClick={(e) => { e.preventDefault(); setActivePage('home'); }} className="footer-link">Home</a>
                        <a href="#humanizer" onClick={(e) => { e.preventDefault(); setActivePage('humanizer'); }} className="footer-link">Humanizer</a>
                        <a href="#detector" onClick={(e) => { e.preventDefault(); setActivePage('detector'); }} className="footer-link">AI Detector</a>
                        <a href="#about" onClick={(e) => { e.preventDefault(); setActivePage('about'); }} className="footer-link">About Us</a>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); setActivePage('contact'); }} className="footer-link">Contact</a>
                    </div>

                    <div className="footer-links-col">
                        <h4 className="footer-col-title">Legal</h4>
                        <a href="#privacy" onClick={(e) => { e.preventDefault(); setActivePage('privacy'); }} className="footer-link">Privacy Policy</a>
                        <a href="#terms" onClick={(e) => { e.preventDefault(); setActivePage('terms'); }} className="footer-link">Terms & Conditions</a>
                    </div>
                </div>

                <div className="footer-bottom-row">
                    <div className="footer-credits">
                        <span className="copyright-text">
                            © 2026 <span className="brand-accent">GlyphHuman</span>. All rights reserved.
                        </span>
                    </div>
                    
                    <div className="footer-badge-wrapper">
                        <span className="heart-badge">
                            Created with <span className="heart-emoji">❤️</span> by <span className="author-name">Paras</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ============================================================
// 10. App Component
// ============================================================
const App = () => {
    const [activePage, setActivePage] = useState('home');

    useEffect(() => {
        console.log("✅ GlyphHuman interface loaded successfully!");
    }, []);

    const renderPage = () => {
        switch(activePage) {
            case 'home': return <HomeContent setActivePage={setActivePage} />;
            case 'humanizer': return <MainContent />;
            case 'detector': return <DetectorContent />;
            case 'contact': return <ContactContent />;
            case 'terms': return <TermsContent />;
            case 'privacy': return <PrivacyContent />;
            case 'about': return <AboutContent />;
            default: return <HomeContent setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="app-container">
            <Header setActivePage={setActivePage} />
            {renderPage()}
            <Footer setActivePage={setActivePage} />
        </div>
    );
};

// ============================================================
// 11. Render to DOM
// ============================================================
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("❌ Root element not found!");
}
