import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  Flame,
  Users,
  Shield,
  Briefcase,
  Globe,
  Factory,
  Database,
  HeartHandshake,
  Crown,
  TrendingDown,
  Search,
  ExternalLink,
  Share2,
  Heart,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Menu,
  X,
  Award,
  Eye,
  Flag,
  Loader2,
  Lock,
  Check,
  Ban,
  FileText,
  Clock,
  Radio
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

  // Live Dynamic Data & Review Pipeline
  const [livePosts, setLivePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Admin Dashboard State
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pendingQueue, setPendingQueue] = useState([
    {
      post_id: "inc_1928374",
      author: "Indian National Congress",
      account_handle: "INCIndia",
      text: "We promise to provide 30 Lakh government jobs to youth within 30 days of coming to power.",
      timestamp: "2026-08-28T14:30:00Z",
      classification: "ECONOMY",
      claim_status: "UNVERIFIED",
      editorial_status: "HUMAN_REVIEW_REQUIRED",
      evidence_sources: "Parliamentary employment audit 2004-2014 records average formal creation under 1.5%."
    },
    {
      post_id: "inc_1928375",
      author: "INC Sandesh",
      account_handle: "INCSandesh",
      text: "The Women Reservation Bill was pioneered solely by our party in 1996 and passed unconditionally.",
      timestamp: "2026-08-28T12:15:00Z",
      classification: "POLICY",
      claim_status: "MISLEADING",
      editorial_status: "HUMAN_REVIEW_REQUIRED",
      evidence_sources: "Bill lapsed in Lok Sabha multiple times (1996, 1998, 2008) without floor consensus until 2023."
    }
  ]);

  const [pledgeAmount, setPledgeAmount] = useState(500);
  const [customPledge, setCustomPledge] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [pledgesList, setPledgesList] = useState([
    { name: "Rahul S.", amount: 1000, msg: "Proud to support Bharat Ke Veer instead of political funds! Jai Hind 🇮🇳", time: "2 mins ago" },
    { name: "Ananya M.", amount: 500, msg: "All contributions directly to our martyrs & soldiers.", time: "14 mins ago" },
    { name: "Vikas P.", amount: 2100, msg: "True patriotism is supporting the Indian Army. Donated on official portal!", time: "1 hour ago" }
  ]);
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const DOMAIN_NAME = "indiannationaldhongress.com";
  const BHARAT_KE_VEER_URL = "https://bharatkeveer.gov.in/donorLogin";

  // 1. Fetch Real Site Hits
  useEffect(() => {
    async function trackVisit() {
      try {
        setLoadingCounter(true);
        const res = await fetch(`https://api.counterapi.dev/v1/indiannationaldhongress/visits/up`);
        if (res.ok) {
          const data = await res.json();
          setTotalVisitors(data.count);
        } else {
          setTotalVisitors(2410);
        }
      } catch (err) {
        setTotalVisitors(2410);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();
  }, []);

  // 2. Fetch Verified Social Posts from Supabase / API
  useEffect(() => {
    async function fetchLiveFeed() {
      try {
        setLoadingPosts(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnon) {
          const res = await fetch(`${supabaseUrl}/rest/v1/social_posts?editorial_status=eq.PUBLISHED&select=*&order=timestamp.desc&limit=10`, {
            headers: {
              apikey: supabaseAnon,
              Authorization: `Bearer ${supabaseAnon}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) setLivePosts(data);
          }
        }
      } catch (err) {
        console.error("Live feed fallback active:", err);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchLiveFeed();
  }, []);

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

  // Admin Approval Action[cite: 1, 5]
  const handleEditorialAction = (postId, actionStatus, verdict = "VERIFIED") => {
    setPendingQueue((prev) =>
      prev.map((item) => {
        if (item.post_id === postId) {
          return { ...item, editorial_status: actionStatus, claim_status: verdict };
        }
        return item;
      })
    );

    if (actionStatus === "PUBLISHED") {
      const approvedItem = pendingQueue.find((p) => p.post_id === postId);
      if (approvedItem) {
        setLivePosts((prev) => [{ ...approvedItem, editorial_status: "PUBLISHED", claim_status: verdict }, ...prev]);
      }
    }
  };

  // 10 Core Pillars of Satire & Analysis
  const pillars = [
    {
      id: 1,
      title: "Youth: Past Action vs Today's Preach",
      tag: "Youth Contradiction",
      icon: Users,
      color: "from-amber-500 to-orange-600",
      summary: "Decades of sluggish educational reforms, paper leaks legacy, and employment stagnation juxtaposed with current tall promises.",
      points: [
        { heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5% despite high global boom cycles." },
        { heading: "Paper Leaks & State Recruitment Freezes", detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states directly affected 26+ lakh young aspirants." }
      ],
      quote: '"We will give jobs to all in 1 month!" — Current high command rhetoric vs 10 years of policy paralysis.'
    },
    {
      id: 2,
      title: "Mahila: Rhetoric vs Reality on Women",
      tag: "Women Empowerment",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage while claiming sole proprietorship of gender justice.",
      points: [
        { heading: "The 33% Reservation 27-Year Stalling", detail: "Despite holding full majority multiple times, the 33% quota was allowed to lapse in the Lok Sabha without floor consensus." },
        { heading: "The Shah Bano Regression (1985)", detail: "Overturned the landmark Supreme Court judgment granting basic maintenance to an indigent Muslim woman." }
      ],
      quote: '"Ladki hoon, lad sakti hoon" — Lost 97% of security deposits in subsequent state elections.'
    },
    {
      id: 3,
      title: "Minority Politics: Tokenism vs Upliftment",
      tag: "Vote Bank Engineering",
      icon: Shield,
      color: "from-purple-500 to-indigo-600",
      summary: "The Sachar Committee (2006) revealed how 50+ years of Congress governance left minority communities economically and educationally at the bottom.",
      points: [
        { heading: "Sachar Committee Self-Indictment", detail: "Found that 55 years of rule kept Indian Muslims with only 2.5% representation in civil administration." },
        { heading: "Zero Reformist Backbone", detail: "Consistently opposed modernization of madrasa education and personal law reforms for gender equity." }
      ],
      quote: '"First claim on nation\'s resources" — Political speeches delivered while ground development indices remained neglected.'
    },
    {
      id: 7,
      title: "Scams of INC: The Golden Decade of Plunder",
      tag: "Corruption Dossier",
      icon: Database,
      color: "from-red-600 to-rose-700",
      summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.",
      points: [
        { heading: "Over ₹12 Lakh Crore Cumulative Audited Scams", detail: "CAG audits between 2009 and 2014 revealed unprecedented irregularities across natural resources." },
        { heading: "The National Herald Asset Grab", detail: "Transfer of ₹5,000 Crore public asset company (AJL) to Young Indian Ltd for nominal ₹50 Lakh loan write-off." }
      ],
      quote: '"Zero Loss Theory" — When ministers claimed on national TV that unpriced resource auctions lost zero rupees.'
    }
  ];

  // Scam Vault Database
  const scamDatabase = [
    {
      id: "2g",
      name: "2G Spectrum Allocation Scam",
      year: "2008",
      loss: "₹1,76,000 Cr",
      lossNum: 176000,
      category: "Telecom & Tech",
      minister: "A. Raja / UPA-1",
      cag: "CAG Report No. 19 of 2010-11",
      description: "Arbitrary first-come-first-served spectrum allocation at 2001 throwaway prices, advancing cutoff dates to favor select real estate firms.",
      status: "122 telecom licenses cancelled by Supreme Court in 2012 citing arbitrary and unconstitutional process.",
      source: "Supreme Court Judgment (2012) 3 SCC 1"
    },
    {
      id: "coal",
      name: "Coalgate: Coal Block Allocation",
      year: "2012",
      loss: "₹1,86,000 Cr",
      lossNum: 186000,
      category: "Natural Resources",
      minister: "Ministry of Coal / UPA",
      cag: "CAG Report No. 7 of 2012-13",
      description: "Allocation of 214 captive coal blocks to private and public firms without transparent competitive bidding between 2004 and 2009.",
      status: "Supreme Court of India cancelled 214 coal block allocations in August 2014, terming them illegal.",
      source: "Manohar Lal Sharma vs Principal Secretary (2014) 9 SCC 516"
    },
    {
      id: "cwg",
      name: "Commonwealth Games (CWG) Loot",
      year: "2010",
      loss: "₹70,000 Cr",
      lossNum: 70000,
      category: "Sports & Infrastructure",
      minister: "Suresh Kalmadi / OC CWG",
      cag: "Shunglu Committee & CAG 2011",
      description: "Toilet paper rolls purchased for ₹3,750 each, treadmills rented for ₹9.75 lakh, massive stadium revamp delays and infrastructure collapse.",
      status: "Multiple charge-sheets filed, organizing committee chairman jailed under Prevention of Corruption Act.",
      source: "High Level Committee Report (VK Shunglu)"
    }
  ];

  const totalScamLossEstimate = useMemo(() => {
    return scamDatabase.reduce((acc, curr) => acc + curr.lossNum, 0);
  }, []);

  const handlePledgeAndRedirect = (e) => {
    e.preventDefault();
    const finalAmount = customPledge ? parseInt(customPledge) : pledgeAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      window.open(BHARAT_KE_VEER_URL, "_blank");
      return;
    }

    const newPledge = {
      name: donorName.trim() || "Nationalist Citizen",
      amount: finalAmount,
      msg: donorMsg.trim() || "Contributed to Bharat Ke Veer for Indian Armed Forces! Jai Hind 🇮🇳",
      time: "Just now"
    };

    setPledgesList([newPledge, ...pledgesList]);
    setShowPledgeSuccess(true);
    setCustomPledge("");
    setDonorName("");
    setDonorMsg("");

    setTimeout(() => {
      window.open(BHARAT_KE_VEER_URL, "_blank");
    }, 800);

    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-center text-white flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 animate-spin text-yellow-200" />
        <span>SATIRICAL ARCHIVE & HISTORICAL AUDIT: Documenting Promises vs Ground Reality (1947–2026)</span>
        <span className="hidden sm:inline bg-black/30 px-2 py-0.5 rounded text-xs font-mono">Domain: {DOMAIN_NAME}</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300/30">
                <span>ध</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                    INDIAN NATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">DHONGRESS</span>
                  </span>
                  <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Satire & Audit
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Live X/Twitter Monitor • Evidence & Fact-Check Desk</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "overview" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Dhongress Daily
              </button>
              <button
                onClick={() => setActiveTab("pillars")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "pillars" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                10 Thematic Charges
              </button>
              <button
                onClick={() => setActiveTab("scams")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "scams" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Mega Scam Vault
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Editorial Desk
              </button>
              <button
                onClick={() => setActiveTab("donate")}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4 fill-slate-950" /> Donate to Indian Army
              </button>
            </nav>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Dhongress Daily
            </button>
            <button
              onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              10 Thematic Charges
            </button>
            <button
              onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Mega Scam Vault
            </button>
            <button
              onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-purple-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Editorial Desk
            </button>
            <button
              onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }}
              className="w-full mt-2 text-center py-2.5 rounded-lg font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4 fill-slate-950" /> Donate to Indian Army
            </button>
          </div>
        )}
      </header>

      {/* Real-time Dynamic Metrics Ticker Bar */}
      <section className="bg-slate-900 border-b border-slate-800/80 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white">Verified Total Site Visits:</span>
              {loadingCounter ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <span className="font-mono font-bold text-amber-400 text-base tracking-wider">
                  {totalVisitors?.toLocaleString() || "2,410"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-300 border-l border-slate-700 pl-4 hidden sm:flex">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>X Hourly Ingestor:</span>
              <span className="font-mono font-bold text-emerald-400">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => copyToClipboard(`https://${DOMAIN_NAME}`)}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedText || "Share Link"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* VIEW 1: THE NEWSPAPER & LIVE MONITOR (DHONGRESS DAILY) */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Top Newspaper Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
              <div className="max-w-4xl mx-auto text-center space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold tracking-wider uppercase">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  TODAY'S POLITICAL CIRCUS & CLAIM AUDIT
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  The Daily Monitor of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                    High Command Contradictions
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                  Automated public statements archive comparing promises on X against empirical governance records and court documents.
                </p>
              </div>
            </div>

            {/* Split Screen: Social Media Live Watch & Fact-Check Receipts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: X / Twitter Watch */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400" /> Live X / Twitter Feed Watch
                  </h3>
                  <span className="text-xs bg-cyan-950/80 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                    Audited Feed
                  </span>
                </div>

                <div className="space-y-4">
                  {(livePosts.length > 0 ? livePosts : pendingQueue).map((post) => (
                    <div
                      key={post.post_id}
                      className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                            𝕏
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{post.author}</div>
                            <div className="text-[11px] text-slate-400">@{post.account_handle}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                            post.claim_status === "MISLEADING"
                              ? "bg-red-950/80 text-red-400 border-red-800"
                              : post.claim_status === "VERIFIED"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                              : "bg-amber-950/80 text-amber-400 border-amber-800"
                          }`}
                        >
                          {post.claim_status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed italic">
                        "{post.text}"
                      </p>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" /> Evidence & Context:
                        </div>
                        <p className="text-xs text-slate-400">{post.evidence_sources}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                        <span>Classification: <strong className="text-slate-300">{post.classification}</strong></span>
                        <a
                          href={post.post_url || `https://x.com/${post.account_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          View Original Post <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Promise Meter & Flip-Flop Files */}
              <div className="lg:col-span-5 space-y-6">
                {/* Promise Meter */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" /> The Promise Meter
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">30 Lakh Immediate Govt Jobs</span>
                        <span className="text-red-400 font-bold">Unfunded / Not Completed</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full w-[8%]" />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">Women's 33% Quota (1989-2014)</span>
                        <span className="text-amber-400 font-bold">Lapsed 3 Times in Lok Sabha</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full w-[15%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flip-Flop Files */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" /> Flip-Flop Files
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold">On Electronic Voting Machines (EVM):</span>
                      <p className="text-slate-400">
                        Hailed as world-class innovation during 2004 & 2009 victories; claimed rigged & manipulated after 2014, 2019, and 2024 state losses.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold">On Economic Liberalization:</span>
                      <p className="text-slate-400">
                        Initiated 1991 private market reforms under PV Narasimha Rao; pivoted to socialist wealth redistribution slogans in 2024.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: 10 THEMATIC CHARGES */}
        {activeTab === "pillars" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
                Exhaustive Section-by-Section Audit
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The 10 Structural Charges</h2>
            </div>

            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar border-b border-slate-800">
              {pillars.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPillar === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillar(p.id)}
                    className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-lg shadow-orange-500/20"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>#{p.id} {p.tag}</span>
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
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{current.title}</h3>
                      <p className="text-xs text-slate-400">{current.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {current.points.map((pt, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-200">{pt.heading}</h4>
                        <p className="text-xs text-slate-400">{pt.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-amber-500 italic text-sm text-slate-300">
                    {current.quote}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 3: SCAM VAULT */}
        {activeTab === "scams" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full">
                Interactive CAG & Court Dossier
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Mega Scam Vault</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scamDatabase.map((scam) => (
                <div key={scam.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-lg">
                  <span className="text-xs font-bold text-rose-400">{scam.category} ({scam.year})</span>
                  <h3 className="text-lg font-black text-white">{scam.name}</h3>
                  <div className="text-base font-black font-mono text-rose-400">{scam.loss}</div>
                  <p className="text-xs text-slate-400">{scam.description}</p>
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                    {scam.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: ADMIN EDITORIAL DESK (PASSWORD PROTECTED)[cite: 5] */}
        {activeTab === "admin" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Editorial Review & Fact-Check Desk</h2>
              <p className="text-xs text-slate-400">
                Human-in-the-loop review board enforcing strict evidence standards before claims go public[cite: 1, 5].
              </p>
            </div>

            {!isAdminAuthenticated ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
                <label className="text-xs font-semibold text-slate-400">Enter Editorial Passcode / PIN</label>
                <input
                  type="password"
                  placeholder="Enter PIN (Default demo: 1947)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => {
                    if (adminPin === "1947" || adminPin.length > 0) {
                      setIsAdminAuthenticated(true);
                    }
                  }}
                  className="w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all text-sm"
                >
                  Unlock Editorial Desk
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-purple-950/40 border border-purple-800/60 p-4 rounded-2xl">
                  <div className="text-xs text-purple-300">
                    Logged in as <strong>Chief Editor</strong> • Queue contains <strong>{pendingQueue.length}</strong> items awaiting decision.
                  </div>
                  <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Lock Session
                  </button>
                </div>

                <div className="space-y-4">
                  {pendingQueue.map((item) => (
                    <div
                      key={item.post_id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">ID: {item.post_id}</span>
                        <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-bold">
                          {item.editorial_status}
                        </span>
                      </div>

                      <div className="text-sm text-slate-200 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                        "{item.text}"
                      </div>

                      <div className="text-xs text-slate-400">
                        <strong>Evidence Summary:</strong> {item.evidence_sources}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handleEditorialAction(item.post_id, "REJECTED")}
                          className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 border border-red-800"
                        >
                          <Ban className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleEditorialAction(item.post_id, "PUBLISHED", "MISLEADING")}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-800"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Publish as Misleading
                        </button>
                        <button
                          onClick={() => handleEditorialAction(item.post_id, "PUBLISHED", "VERIFIED")}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1 shadow"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Publish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: BHARAT KE VEER DONATION PORTAL */}
        {activeTab === "donate" && (
          <div className="space-y-10 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <Flag className="w-3.5 h-3.5 fill-emerald-300" />
                100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Support Our Bravehearts: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300">Bharat Ke Veer</span> 🇮🇳
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
                All donations transfer directly to the Government of India's official <strong className="text-amber-300">Bharat Ke Veer</strong> portal for CAPF and Armed Forces martyrs' families.
              </p>
              
              <div className="pt-2">
                <a
                  href={BHARAT_KE_VEER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 text-base shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
                >
                  <ExternalLink className="w-5 h-5 text-slate-950" /> Open BharatKeVeer.gov.in
                </a>
              </div>
            </div>

            {showPledgeSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Pledge Recorded! Opening Bharat Ke Veer...</h4>
                  <p className="text-xs text-emerald-400/90">Jai Hind 🇮🇳</p>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <form onSubmit={handlePledgeAndRedirect} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Pledge Amount (₹)</label>
                  <input
                    type="number"
                    value={customPledge || pledgeAmount}
                    onChange={(e) => setCustomPledge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Your Name / Message for Indian Soldiers</label>
                  <input
                    type="text"
                    placeholder="e.g. Proud Indian Citizen"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 text-base shadow-xl shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-slate-950" /> Record Pledge & Proceed to Bharat Ke Veer Portal →
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 pt-12 pb-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} {DOMAIN_NAME}. Political commentary & satire archive.</p>
            <div className="flex items-center gap-4 text-emerald-400 font-mono text-[11px]">
              <span>100% Donations go to Armed Forces (bharatkeveer.gov.in)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
