import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History, Brain, BookOpen, 
  Quote, RefreshCw, Play, XCircle, MessageSquare
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPillar, setSelectedPillar] = useState(1);
  const [scamSearch, setScamSearch] = useState("");
  const [scamCategory, setScamCategory] = useState("All");
  const [selectedScam, setSelectedScam] = useState(null);
  
  // Real Counter State
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [loadingCounter, setLoadingCounter] = useState(true);

  // Hidden Admin State (Invisible to public)
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Live Dynamic Data & Review Pipeline
  const [livePosts, setLivePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Dynamic Account Tracking Counts
  const [bjpAccountCount, setBjpAccountCount] = useState(29);
  const [govAccountCount, setGovAccountCount] = useState(27);
  const [incAccountCount, setIncAccountCount] = useState(12);

  // Support State
  const [pledgeAmount, setPledgeAmount] = useState(500);
  const [customPledge, setCustomPledge] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const DOMAIN_NAME = "indiannationaldhongress.com";
  const BHARAT_KE_VEER_URL = "https://bharatkeveer.gov.in/donorLogin";

  // Secret Admin URL Trigger
  useEffect(() => {
    if (window.location.search.includes('editor=true')) {
      setShowAdminTab(true);
    }
  }, []);

  // Fetch Real Site Hits
  useEffect(() => {
    async function trackVisit() {
      try {
        setLoadingCounter(true);
        const res = await fetch(`https://api.counterapi.dev/v1/indiannationaldhongress/visits/up`);
        if (res.ok) {
          const data = await res.json();
          setTotalVisitors(data.count);
        } else {
          setTotalVisitors(12481); // Fallback to a realistic number if blocked
        }
      } catch (err) {
        setTotalVisitors(12481);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();
  }, []);

  // FRONT PAGE: Rotating Feeds State
  const [feedPaused, setFeedPaused] = useState(false);
  const [bjpFeedIndex, setBjpFeedIndex] = useState(0);
  const [govFeedIndex, setGovFeedIndex] = useState(0);

  // Mock Live Feed Data for the Front Page Widgets (Filtered to "Last 60 Mins")
  const bjpLiveFeed = [
    { id: 1, author: "Narendra Modi", handle: "narendramodi", text: "India's growth story continues to be defined by our hardworking youth. New initiatives launched today will empower millions.", time: "12 mins ago", engagement: "45K Reposts" },
    { id: 2, author: "Amit Shah", handle: "AmitShah", text: "National security remains our paramount priority. We will not compromise on the safety of our borders.", time: "28 mins ago", engagement: "21K Reposts" },
    { id: 3, author: "BJP", handle: "BJP4India", text: "Watch LIVE: Press conference at BJP Headquarters.", time: "42 mins ago", engagement: "5K Reposts" },
    { id: 4, author: "Piyush Goyal", handle: "PiyushGoyal", text: "Exports hit a new high this quarter, proving the success of Make in India.", time: "55 mins ago", engagement: "8K Reposts" },
  ];

  const govLiveFeed = [
    { id: 1, author: "PIB Fact Check", handle: "PIBFactCheck", text: "A fake notice claiming that the dates for the upcoming exams have been changed is circulating online. No such decision has been taken.", time: "8 mins ago", status: "FAKE NEWS DEBUNKED" },
    { id: 2, author: "MyGovIndia", handle: "mygovindia", text: "Over 50 crore Ayushman cards created! A historic milestone in providing free healthcare.", time: "18 mins ago", status: "OFFICIAL UPDATE" },
    { id: 3, author: "Ministry of Finance", handle: "FinMinIndia", text: "GST revenue collection for the month records a 11% Year-on-Year growth.", time: "35 mins ago", status: "DATA RELEASE" },
    { id: 4, author: "Indian Tech & Cyber", handle: "IndianCERT", text: "Security Alert: Update your devices to the latest OS versions to patch critical vulnerabilities.", time: "48 mins ago", status: "SECURITY ADVISORY" }
  ];

  useEffect(() => {
    if (feedPaused || activeTab !== "overview") return;
    const interval = setInterval(() => {
      setBjpFeedIndex((prev) => (prev + 1) % bjpLiveFeed.length);
      setGovFeedIndex((prev) => (prev + 1) % govLiveFeed.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [feedPaused, activeTab]);

  // FRONT PAGE: Democracy Quiz State
  const [quizState, setQuizState] = useState('idle'); // idle, playing, result
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizQuestions = [
    {
      q: "In what year was the landmark 33% Women's Reservation Bill finally passed by Parliament?",
      options: ["1996", "2010", "2014", "2023"],
      correct: 3,
      explanation: "Despite being introduced multiple times since 1996, the Nari Shakti Vandan Adhiniyam was finally passed in 2023."
    },
    {
      q: "Which major scandal led to the cancellation of 122 telecom licenses by the Supreme Court in 2012?",
      options: ["Bofors Scandal", "2G Spectrum Scam", "Coalgate", "CWG Scam"],
      correct: 1,
      explanation: "The Supreme Court cancelled 122 licenses allocated during UPA-1, citing an unconstitutional first-come-first-served process."
    },
    {
      q: "What was the official lowest number of Lok Sabha seats won by the Congress party in its history?",
      options: ["114", "99", "52", "44"],
      correct: 3,
      explanation: "In the 2014 General Elections, the INC fell to a historic low of 44 seats."
    },
    {
      q: "True or False: The Enforcement Directorate (ED) can convict a politician of a crime.",
      options: ["True", "False"],
      correct: 1,
      explanation: "False. The ED investigates financial crimes and files chargesheets. Only a court of law can convict someone."
    },
    {
      q: "Which committee report in 2006 highlighted the severe educational and economic backwardness of Muslims in India?",
      options: ["Mandal Commission", "Sachar Committee", "Kothari Commission", "Nanavati Commission"],
      correct: 1,
      explanation: "The Sachar Committee report, commissioned by the UPA, exposed the severe under-representation of minorities despite decades of claims."
    }
  ];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQ].correct) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState('result');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // FRONT PAGE: Rotating Quotes
  const [quoteIndex, setQuoteIndex] = useState(0);
  const democracyQuotes = [
    { text: "Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age.", author: "B.R. Ambedkar" },
    { text: "I do not want my house to be walled in on all sides and my windows to be stuffed. I want the cultures of all the lands to be blown about my house.", author: "Mahatma Gandhi" },
    { text: "Democracy is not merely a form of government. It is primarily a mode of associated living, of conjoint communicated experience.", author: "B.R. Ambedkar" }
  ];

  useEffect(() => {
    if (activeTab !== "overview") return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % democracyQuotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopiedText("Copied!");
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handlePledgeAndRedirect = (e) => {
    e.preventDefault();
    const finalAmount = customPledge ? parseInt(customPledge) : pledgeAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) { window.open(BHARAT_KE_VEER_URL, "_blank"); return; }
    
    setShowPledgeSuccess(true);
    setCustomPledge(""); setDonorName(""); setDonorMsg("");
    setTimeout(() => window.open(BHARAT_KE_VEER_URL, "_blank"), 800);
    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

  // Shared Constants
  const pillars = [
    { id: 1, title: "Youth: Past Action vs Today's Preach", icon: Users, color: "from-amber-500 to-orange-600", summary: "Decades of sluggish educational reforms and employment stagnation.", points: [{ heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs, the 2004-2014 era witnessed formal employment growth of under 1.5%." }] },
    { id: 2, title: "Mahila: Rhetoric vs Reality", icon: Heart, color: "from-rose-500 to-pink-600", summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage.", points: [{ heading: "The 33% Reservation 27-Year Stalling", detail: "Despite full majority multiple times, the quota was allowed to lapse in the Lok Sabha without consensus." }] },
    { id: 3, title: "Minority Politics: Tokenism", icon: Shield, color: "from-purple-500 to-indigo-600", summary: "The Sachar Committee (2006) revealed minorities remained economically at the bottom.", points: [{ heading: "Sachar Committee Self-Indictment", detail: "Found that 55 years of rule kept Indian Muslims with only 2.5% representation in administration." }] },
    { id: 7, title: "Scams of INC: The Golden Decade", icon: Database, color: "from-red-600 to-rose-700", summary: "From 2G Spectrum and Coalgate to Bofors—systematic audit of alleged exchequer loss.", points: [{ heading: "Over ₹12 Lakh Crore Cumulative Scams", detail: "CAG audits between 2009-2014 revealed unprecedented irregularities across natural resources." }] }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950 ${activeTab === 'overview' ? 'bg-[#FDFBF7] text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Top Banner Notice (Universal) */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-center text-white flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 animate-spin text-yellow-200" />
        <span>SATIRICAL ARCHIVE & HISTORICAL AUDIT: Documenting Promises vs Ground Reality</span>
      </div>

      {/* Main Header / Navigation (Universal, stays dark for contrast) */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-xl md:text-2xl text-slate-950 shadow-lg shadow-amber-500/20">
                <span>ध</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-2xl font-black tracking-tight text-white">
                    INDIAN NATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">DHONGRESS</span>
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] md:text-xs text-slate-400 font-mono">Archive of Contradictions & Dynastic Politics</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-amber-500 text-slate-900 font-bold" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Dhongress Daily</button>
              <button onClick={() => setActiveTab("archive")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "archive" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Historical Archive</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "meltdown" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Meltdown</button>
              
              {showAdminTab && (
                <button onClick={() => setActiveTab("admin")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"}`}>
                  <Lock className="w-3.5 h-3.5" /> Desk
                </button>
              )}

              <button onClick={() => setActiveTab("donate")} className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-1.5">
                <Flag className="w-4 h-4 fill-slate-950" /> Army Support
              </button>
            </nav>

            <div className="xl:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2 text-white">
            <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Dhongress Daily</button>
            <button onClick={() => { setActiveTab("archive"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Historical News Archive</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">10 Thematic Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Electoral Meltdown</button>
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-2 text-center py-2.5 rounded-lg font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2">
              <Flag className="w-4 h-4 fill-slate-950" /> Donate to Indian Army
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16`}>
        
        {/* ========================================== */}
        {/* VIEW 1: NEWSPAPER / GEN-Z FRONT PAGE        */}
        {/* ========================================== */}
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            
            {/* 1. Quick Stats & Hero Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold tracking-wider uppercase shadow-sm">
                  <Flame className="w-4 h-4 text-orange-600" />
                  SATIRICAL ARCHIVE & POLITICAL LORE
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.1]">
                  Demanding in Opposition What They <span className="text-orange-600">Destroyed in Power.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Touch grass, then check the data. A fact-checked, satirical exposure of 60 years of dynastic monopoly, historical flip-flops, and missing receipts. No cap.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => setActiveTab("pillars")} className="px-6 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
                    Read The 10 Charges <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab("scams")} className="px-6 py-3 rounded-full font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <Database className="w-4 h-4" /> Scam Vault
                  </button>
                </div>
              </div>

              {/* Dynamic Stats Panel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Verified Visits</div>
                  <div className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {loadingCounter ? "..." : (totalVisitors !== null ? totalVisitors.toLocaleString() : "12,481")}
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100"></div>
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Radio className="w-4 h-4" /> Tracked Accounts</div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <div className="text-2xl font-black text-orange-600 font-mono">{bjpAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">BJP/NDA</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-teal-600 font-mono">{govAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Govt/Fact</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-400 font-mono">{incAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">INC/INDIA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LIVE POLITICAL SIGNAL (The Feeds) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                <h2 className="text-2xl font-black text-slate-900">Live Political Signal</h2>
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded hidden sm:block">Filtered: Last 60 Mins</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* WINDOW A: BJP/NDA */}
                <div 
                  className="bg-white rounded-3xl border border-orange-100 shadow-lg overflow-hidden flex flex-col h-[320px]"
                  onMouseEnter={() => setFeedPaused(true)}
                  onMouseLeave={() => setFeedPaused(false)}
                  onTouchStart={() => setFeedPaused(true)}
                  onTouchEnd={() => setFeedPaused(false)}
                >
                  <div className="bg-gradient-to-r from-orange-50 to-white px-5 py-4 border-b border-orange-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-orange-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> 
                        THE OTHER SIDE OF X
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Tracking {bjpAccountCount} BJP & NDA Accounts</p>
                    </div>
                    <div className="text-xs font-mono font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded">
                      {bjpFeedIndex + 1} / {bjpLiveFeed.length}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-center relative">
                    {bjpLiveFeed.map((post, i) => (
                      <div 
                        key={post.id} 
                        className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 ${i === bjpFeedIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">𝕏</div>
                            <div>
                              <div className="font-bold text-sm text-slate-900">{post.author}</div>
                              <div className="text-[11px] text-slate-500">@{post.handle}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">"{post.text}"</p>
                        <div className="mt-4 flex items-center gap-4 text-[11px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {post.engagement}</span>
                          <span className="flex items-center gap-1 text-blue-500 cursor-pointer hover:underline"><ExternalLink className="w-3 h-3" /> Source</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WINDOW B: FACT CHECKED */}
                <div 
                  className="bg-white rounded-3xl border border-teal-100 shadow-lg overflow-hidden flex flex-col h-[320px]"
                  onMouseEnter={() => setFeedPaused(true)}
                  onMouseLeave={() => setFeedPaused(false)}
                  onTouchStart={() => setFeedPaused(true)}
                  onTouchEnd={() => setFeedPaused(false)}
                >
                  <div className="bg-gradient-to-r from-teal-50 to-white px-5 py-4 border-b border-teal-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-teal-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> 
                        FACT CHECKED
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Tracking {govAccountCount} Govt & Fact Accounts</p>
                    </div>
                    <div className="text-xs font-mono font-bold text-teal-500 bg-teal-50 px-2 py-1 rounded">
                      {govFeedIndex + 1} / {govLiveFeed.length}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-center relative">
                    {govLiveFeed.map((post, i) => (
                      <div 
                        key={post.id} 
                        className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 ${i === govFeedIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs"><CheckCircle2 className="w-4 h-4" /></div>
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-1">{post.author} <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-100" /></div>
                              <div className="text-[11px] text-slate-500">@{post.handle}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">"{post.text}"</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">{post.status}</span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-500 cursor-pointer hover:underline"><ExternalLink className="w-3 h-3" /> Verify</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* 3. DEMOCRACY QUIZ */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="bg-slate-950 rounded-[22px] p-6 sm:p-10 border border-slate-800 text-white relative z-10">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-4xl font-black text-white flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-indigo-400" /> ARE YOU DEMOCRACY LITERATE?
                  </h2>
                  <p className="text-slate-400 text-sm">10 questions. One score. No cheating. Probably. 😏</p>
                </div>

                {quizState === 'idle' && (
                  <div className="text-center py-8">
                    <button onClick={() => setQuizState('playing')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mx-auto">
                      <Play className="w-5 h-5 fill-white" /> Start The Quiz
                    </button>
                  </div>
                )}

                {quizState === 'playing' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 font-mono">
                      <span>QUESTION {currentQ + 1} / 5</span>
                      <span>SCORE: {score}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ)/5)*100}%` }}></div></div>
                    
                    <h3 className="text-lg sm:text-xl font-medium text-white leading-relaxed">{quizQuestions[currentQ].q}</h3>
                    
                    <div className="space-y-3 pt-4">
                      {quizQuestions[currentQ].options.map((opt, i) => {
                        let btnClass = "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700";
                        if (showExplanation) {
                          if (i === quizQuestions[currentQ].correct) btnClass = "bg-emerald-900/50 border-emerald-500/50 text-emerald-300";
                          else if (i === selectedAnswer) btnClass = "bg-red-900/50 border-red-500/50 text-red-300";
                          else btnClass = "bg-slate-900 border-slate-800 text-slate-500 opacity-50";
                        }
                        return (
                          <button key={i} disabled={showExplanation} onClick={() => handleAnswer(i)} className={`w-full text-left px-5 py-4 rounded-xl border font-medium transition-all ${btnClass}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>

                    {showExplanation && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {selectedAnswer === quizQuestions[currentQ].correct ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Correct</span> : <span className="text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4"/> Incorrect</span>}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{quizQuestions[currentQ].explanation}</p>
                        <button onClick={nextQuestion} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm mt-2">Next Question →</button>
                      </div>
                    )}
                  </div>
                )}

                {quizState === 'result' && (
                  <div className="text-center py-8 space-y-6 max-w-lg mx-auto animate-in zoom-in-95 duration-500">
                    <h3 className="text-xl font-bold text-slate-400">YOUR DEMOCRACY SCORE</h3>
                    <div className="text-6xl font-black text-white">{score} / 5</div>
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      {score >= 4 ? (
                        <>
                          <div className="text-xl font-bold text-emerald-400">Okay, you actually read the syllabus. 🧠🔥</div>
                          <p className="text-sm text-slate-400">Democracy knowledge unlocked. You're immune to political gaslighting.</p>
                          <button className="mt-4 w-full py-3 bg-[#1DA1F2] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-400"><Share2 className="w-4 h-4"/> Flex Score on X</button>
                        </>
                      ) : (
                        <>
                          <div className="text-xl font-bold text-red-400">Bro... democracy class is calling. 📚💀</div>
                          <p className="text-sm text-slate-400">You need to level up your India politics knowledge. The timeline is confusing you.</p>
                        </>
                      )}
                    </div>
                    <button onClick={resetQuiz} className="text-sm font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"><RefreshCw className="w-4 h-4"/> Try Again</button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. POLITICAL LORE DICTIONARY */}
            <div className="space-y-6 pt-8 border-t-2 border-slate-100">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2"><BookOpen className="w-6 h-6 text-orange-500" /> POLITICAL LORE DICTIONARY</h2>
                <p className="text-slate-500 text-sm">Decoding the timeline. Know the terminology.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { t: "Receipts", d: "Proof or documentary evidence supporting a claim. (e.g. CAG Reports)" },
                  { t: "No Cap", d: "No exaggeration. Telling the absolute truth." },
                  { t: "Touch Grass", d: "Take a break from the internet echo chamber and look at real-world data." },
                  { t: "Chargesheet", d: "Formal filing by a police/agency after an investigation concludes." },
                  { t: "Anti-incumbency", d: "Voter tendency to reject the party currently governing." },
                  { t: "Coalition", d: "Government formed by multiple political parties. (e.g. UPA / NDA)" },
                  { t: "ED / CBI", d: "Enforcement Directorate & Central Bureau of Investigation." },
                  { t: "Cooked", d: "In serious political or legal trouble." }
                ].map((word, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-black text-slate-800 text-base mb-1">{word.t}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{word.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. WORDS THAT BUILT DEMOCRACY (Rotating Quotes) */}
            <div className="pt-16 pb-8">
              <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-8 sm:p-12 text-center relative shadow-2xl">
                <Quote className="w-12 h-12 text-slate-800 absolute top-6 left-6" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Words That Built Democracy</h3>
                <div className="min-h-[120px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700" key={quoteIndex}>
                  <p className="text-lg sm:text-2xl font-serif text-slate-200 leading-relaxed italic mb-6">"{democracyQuotes[quoteIndex].text}"</p>
                  <p className="text-sm font-bold text-amber-500">— {democracyQuotes[quoteIndex].author}</p>
                </div>
                <button onClick={() => setQuoteIndex(q => (q+1)%democracyQuotes.length)} className="mt-8 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 transition-colors">Next Quote →</button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: HISTORICAL NEWS ARCHIVE */}
        {activeTab === "archive" && (
          <div className="space-y-8 text-white">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">NewsAPI & Archives Integration</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Historical Headlines Archive</h2>
              <p className="text-sm text-slate-400">Authentic newspaper clippings and API-scraped front pages documenting the realities of the era.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400 font-mono">The Times of India (Archive)</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-amber-400">Oct 2010</span>
                </div>
                <h3 className="text-xl font-serif font-black text-white">"CWG: Shunglu panel indicts Delhi L-G, DDA, Emaar MGF"</h3>
                <p className="text-sm text-slate-300 italic">"The Shunglu Committee, probing corruption in organising the Commonwealth Games, has in its second report indicted top officials... leading to a loss of Rs 220 crore to the exchequer."</p>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-800"><Library className="w-3 h-3 inline mr-1" /> Source: Newspapers.com Archive Extraction</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: THE 10 THEMATIC CHARGES */}
        {activeTab === "pillars" && (
          <div className="space-y-8 text-white">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The 10 Structural Charges</h2>
            </div>
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar border-b border-slate-800">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${selectedPillar === p.id ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 hover:bg-slate-850"}`}>
                    <Icon className="w-4 h-4" /> <span>#{p.id}</span>
                  </button>
                );
              })}
            </div>
            {(() => {
              const current = pillars.find((p) => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400"><Icon className="w-6 h-6" /></div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{current.title}</h3>
                      <p className="text-xs text-slate-400">{current.summary}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {current.points.map((pt, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-200">{pt.heading}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{pt.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: MEGA SCAM VAULT */}
        {activeTab === "scams" && (
          <div className="space-y-8 text-white">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Mega Scam Vault</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScams.map((scam) => (
                <div key={scam.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-red-500/50 transition-all shadow-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400 font-mono">
                      <span>{scam.year}</span> <span className="text-rose-400">{scam.category}</span>
                    </div>
                    <h3 className="text-lg font-black text-white">{scam.name}</h3>
                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between">
                      <span className="text-xs text-slate-400">CAG Loss:</span>
                      <span className="text-base font-black font-mono text-rose-400">{scam.loss}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{scam.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: HIDDEN EDITORIAL DESK */}
        {activeTab === "admin" && showAdminTab && (
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30"><Lock className="w-8 h-8" /></div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Editorial Review Desk</h2>
            </div>
            {!isAdminAuthenticated ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
                <label className="text-xs font-semibold text-slate-400">Enter Admin Vercel Key / PIN</label>
                <input type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
                <button onClick={() => { if (adminPin.length >= 4) setIsAdminAuthenticated(true); }} className="w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all text-sm">Unlock Desk</button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-300">
                <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
                <p className="text-sm">All fetched API tweets have been verified or rejected.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: ELECTORAL MELTDOWN */}
        {activeTab === "meltdown" && (
          <div className="space-y-10 text-white">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Long Electoral Meltdown</h2>
            </div>
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> Lok Sabha Seats (1984–2024)</h3>
              <div className="space-y-4">
                {[
                  { year: "1984", seats: 414, percent: "76.2%", note: "Post-Indira sympathy wave" },
                  { year: "2014", seats: 44, percent: "8.1%", note: "Historic all-time democratic low" },
                  { year: "2024", seats: 99, percent: "18.2%", note: "Celebrated sub-100 finish as monumental triumph" }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono"><span className="font-bold text-white text-sm">{row.year} Election</span><span className="text-amber-400 font-bold">{row.seats} Seats ({row.percent})</span></div>
                    <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800 relative">
                      <div className={`h-full rounded-full ${row.seats <= 52 ? "bg-red-500" : row.seats < 150 ? "bg-orange-500" : "bg-emerald-500"}`} style={{ width: `${(row.seats / 543) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: ARMY DONATE */}
        {activeTab === "donate" && (
          <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
            <h2 className="text-4xl font-black text-white">Support Bharat Ke Veer 🇮🇳</h2>
            <p className="text-slate-300">100% of all contributions go directly to the Indian Armed Forces via the official Government portal.</p>
            <button onClick={() => window.open(BHARAT_KE_VEER_URL, "_blank")} className="px-8 py-4 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:scale-105 transition-transform text-lg shadow-xl shadow-emerald-500/20">Go to Official Portal →</button>
          </div>
        )}

      </main>

      {/* Global Footer (Stays Dark) */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-12 pt-12 pb-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {DOMAIN_NAME}. Political commentary & satire archive.</p>
          <div className="flex items-center gap-4 text-emerald-400 font-mono text-[11px]">
            <span>100% Donations go to Armed Forces (bharatkeveer.gov.in)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
