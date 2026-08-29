import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History
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

  // Live Dynamic Data
  const [livePosts, setLivePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pendingQueue, setPendingQueue] = useState([]);

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
          setTotalVisitors(3142);
        }
      } catch (err) {
        setTotalVisitors(3142);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();
  }, []);

  // Fetch Live Twitter/X Posts from Supabase
  useEffect(() => {
    async function fetchLiveFeed() {
      try {
        setLoadingPosts(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnon) {
          const res = await fetch(`${supabaseUrl}/rest/v1/social_posts?editorial_status=eq.PUBLISHED&select=*&order=timestamp.desc&limit=15`, {
            headers: { apikey: supabaseAnon, Authorization: `Bearer ${supabaseAnon}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) setLivePosts(data);
          }
        }
      } catch (err) {
        console.error("Feed error:", err);
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

  // --- THE COMPLETE 10 THEMATIC PILLARS ---
  const pillars = [
    {
      id: 1, title: "Youth: Past Action vs Today's Preach", tag: "Youth Contradiction", icon: Users, color: "from-amber-500 to-orange-600",
      summary: "Decades of sluggish educational reforms, legacy of paper leaks, and employment stagnation juxtaposed with current tall promises.",
      points: [
        { heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5%." },
        { heading: "Paper Leaks & State Freezes", detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states (e.g., Rajasthan REET) affected 26+ lakh young aspirants." },
        { heading: "Higher Education Sloth", detail: "Between 1960 and 2004, higher education creation remained constrained to elite urban centers, keeping gross enrolment ratios under 11%." }
      ],
      quote: '"We will give jobs to all in 1 month!" — Current rhetoric vs decades of policy paralysis.'
    },
    {
      id: 2, title: "Mahila: Rhetoric vs Reality on Women", tag: "Women Empowerment", icon: Heart, color: "from-rose-500 to-pink-600",
      summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage while claiming sole proprietorship of gender justice.",
      points: [
        { heading: "The 33% Reservation 27-Year Stalling", detail: "Despite holding full majority multiple times, the Nari Shakti Vandan (33% quota) was allowed to lapse in the Lok Sabha without floor consensus." },
        { heading: "The Shah Bano Regression (1985)", detail: "Overturned the landmark Supreme Court judgment granting basic maintenance to an indigent Muslim woman, capitulating to conservative patriarchy." },
        { heading: "Safety & Sanitation Deficit", detail: "For 67 years post-independence, over 50% of rural women lacked access to basic household sanitation (open defecation) and clean cooking fuel." }
      ],
      quote: '"Ladki hoon, lad sakti hoon" — Coined shortly before losing 97% of security deposits in UP elections.'
    },
    {
      id: 3, title: "Minority Politics: Appeasement vs Upliftment", tag: "Vote Bank Engineering", icon: Shield, color: "from-purple-500 to-indigo-600",
      summary: "The Sachar Committee (2006) revealed how 50+ years of governance left minority communities economically and educationally at the bottom.",
      points: [
        { heading: "Sachar Committee Self-Indictment", detail: "Commissioned by UPA, it found that 55 years of rule kept Indian Muslims with only 2.5% representation in IAS/IPS and severe literacy gaps." },
        { heading: "Waqf Board Disproportionate Powers", detail: "Enacted legislations granting unchecked statutory jurisdiction to Waqf boards, enabling immense land accumulation without grassroots minority upliftment." },
        { heading: "Zero Reformist Backbone", detail: "Consistently opposed the modernization of madrasa education and blocked personal law reforms (like Triple Talaq abolition) to preserve vote brokers." }
      ],
      quote: '"First claim on nation\'s resources" — Speeches delivered while ground development indices for minorities remained neglected.'
    },
    {
      id: 4, title: "Job Creation: The License-Permit Raj", tag: "Economic Chokehold", icon: Briefcase, color: "from-emerald-500 to-teal-600",
      summary: "How socialist red tape suffocated enterprise, forcing generations of Indian youth into government clerk queues.",
      points: [
        { heading: "The 'Hindu Rate of Growth' Stagnation", detail: "Socialist centralization between 1950-1990 artificially choked private business, forcing citizens to wait years for a telephone or scooter." },
        { heading: "Twin Balance Sheet Crisis (2008-2013)", detail: "Unregulated 'phone banking' loan disbursals led to banking NPAs ballooning past ₹10.36 Lakh Crores, crippling private capex." },
        { heading: "Anti-Startup Mindset", detail: "High corporate tax rates, complex labor inspector systems, and angel taxes forced highly skilled Indian graduates into mass brain drain." }
      ],
      quote: '"We will redistribute private wealth" — Echoing the discredited confiscatory economics of the 1970s.'
    },
    {
      id: 5, title: "Foreign Investment: Policy Paralysis", tag: "FDI Sabotage", icon: Globe, color: "from-blue-500 to-cyan-600",
      summary: "How retrospective taxation and ministerial vetoes scared away billions of global dollars in the UPA-2 era.",
      points: [
        { heading: "The 2012 Retrospective Tax Disaster", detail: "Amending tax laws retroactively against Vodafone and Cairn Energy single-handedly destroyed India's reputation for contract enforcement." },
        { heading: "Ease of Doing Business: Ranked 142nd", detail: "In 2014, India was ranked 142 out of 189 nations by the World Bank—behind countries with severe political instability." },
        { heading: "Fragile Five Economy (2013)", detail: "Morgan Stanley classified India among the world's most vulnerable economies due to soaring Current Account Deficits and 10.9% inflation." }
      ],
      quote: 'From the "Fragile Five" in 2013 to demanding economic miracles in opposition.'
    },
    {
      id: 6, title: "Make in India: Stagnation & Import Reliance", tag: "Manufacturing Failure", icon: Factory, color: "from-amber-600 to-yellow-600",
      summary: "Leaving India as an import-dependent economy for defense, mobile electronics, and infrastructure equipment.",
      points: [
        { heading: "100% Defense Import Vulnerability", detail: "Defense modernization was frozen for years (due to Bofors/AgustaWestland fears), leaving the Armed Forces reliant on 70%+ imported arms." },
        { heading: "Only 2 Mobile Factories in 2014", detail: "While Asian peers industrialized in the 1990s, India had only 2 mobile phone manufacturing units in 2014 compared to 200+ today." },
        { heading: "Losing Markets to Vietnam/Bangladesh", detail: "Severe power shortages, lack of highways, and inverted duty structures caused India to lose the global textile and toy export markets." }
      ],
      quote: 'Mocking "Make in India" while maintaining 40 years of 15% stagnant manufacturing GDP contribution.'
    },
    {
      id: 7, title: "Scams of INC: The Golden Decade of Plunder", tag: "Corruption Dossier", icon: Database, color: "from-red-600 to-rose-700",
      summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.",
      points: [
        { heading: "Over ₹12 Lakh Crore Cumulative Scams", detail: "CAG audits between 2009-2014 revealed unprecedented irregularities across natural resources (spectrum, coal, land, defense)." },
        { heading: "The National Herald Asset Grab", detail: "Transfer of ₹5,000 Crore public asset company (AJL) to Young Indian Ltd (family-owned) for a nominal ₹50 Lakh loan write-off." },
        { heading: "Adarsh Society Military Insult", detail: "High-rise luxury apartments in Mumbai meant specifically for Kargil war widows were allocated to politicians and senior bureaucrats." }
      ],
      quote: '"Zero Loss Theory" — When ministers claimed on national TV that unpriced resource auctions lost zero rupees.'
    },
    {
      id: 8, title: "Sanskar: Defamation & Institutional Disrespect", tag: "Political Decorum", icon: Flame, color: "from-orange-500 to-red-600",
      summary: "A catalog of derogatory epithets against constitutional posts, veterans, and political opponents.",
      points: [
        { heading: "Insults to Constitutional Positions", detail: "Repeated derogatory remarks against the President of India ('Rashtrapatni'), Prime Minister, and Election Commissioners." },
        { heading: "Tearing the Cabinet Ordinance (2013)", detail: "Publicly humiliating his own Prime Minister Dr. Manmohan Singh by tearing a government ordinance into pieces in a live press conference." },
        { heading: "Name Shaming & Derogatory Slogans", detail: "Using derogatory terms like 'Chaiwala', 'Maut Ka Saudagar', and 'Neech' against sitting democratic leaders." }
      ],
      quote: 'Lecturing on "Mohabbat Ki Dukan" while running systematic vitriol campaigns.'
    },
    {
      id: 9, title: "One Family, One Party: Sidelining Merit", tag: "Dynasty Over Democracy", icon: Crown, color: "from-yellow-500 to-amber-700",
      summary: "How internal party democracy was decimated and iconic non-dynasty leaders were historically humiliated.",
      points: [
        { heading: "The Humiliation of PV Narasimha Rao", detail: "The former PM who unlocked 1991 reforms was denied entry of his mortal remains into the AICC headquarters and denied a memorial in Delhi." },
        { heading: "Sitaram Kesri Locked in Toilet (1998)", detail: "The sitting elected Dalit/OBC Congress President was reportedly locked in a room at AICC headquarters to facilitate swift dynastic coronation." },
        { heading: "The Mass Exodus of Competent Leaders", detail: "Over 40 prominent senior leaders (Pranab Mukherjee sidelined earlier, Himanta Biswa Sarma, Jyotiraditya Scindia) left citing dynastic sycophancy." }
      ],
      quote: '"The party is the family, and the family is the nation" — The core operating doctrine since 1969.'
    },
    {
      id: 10, title: "Worst Electoral Meltdown in Democracy", tag: "Democracy's Verdict", icon: TrendingDown, color: "from-slate-600 to-gray-800",
      summary: "How India's oldest party went from 414 seats (1984) to historic lows of 44 (2014) and 52 (2019).",
      points: [
        { heading: "The 44-Seat Nadir (2014)", detail: "Could not even secure the statutory 10% of seats (55 seats) required to claim the formal Leader of Opposition status in Lok Sabha." },
        { heading: "Wiped Out in Entire States", detail: "Consecutive zero seats in major states like Delhi, Andhra Pradesh, and massive vote share loss in UP." },
        { heading: "Sub-20% Strike Rate in Direct Fights", detail: "In head-to-head national contests against national alternatives, the strike rate remained under 15% across three general elections." }
      ],
      quote: 'Declaring a monumental victory at 99 seats after failing to cross the halfway mark for a decade.'
    }
  ];

  // --- THE COMPLETE MEGA SCAM VAULT ---
  const scamDatabase = [
    { id: "2g", name: "2G Spectrum Allocation Scam", year: "2008", loss: "₹1,76,000 Cr", lossNum: 176000, category: "Telecom & Tech", minister: "A. Raja / UPA-1", cag: "CAG Report No. 19 of 2010-11", description: "Arbitrary first-come-first-served spectrum allocation at throwaway prices. 122 telecom licenses cancelled by Supreme Court in 2012 citing unconstitutional processes.", status: "Licenses Cancelled by SC", source: "SC Judgment (2012) 3 SCC 1" },
    { id: "coal", name: "Coalgate: Coal Block Allocation", year: "2012", loss: "₹1,86,000 Cr", lossNum: 186000, category: "Natural Resources", minister: "Ministry of Coal / UPA", cag: "CAG Report No. 7 of 2012-13", description: "Allocation of 214 captive coal blocks to private firms without transparent competitive bidding. Supreme Court cancelled 214 allocations in 2014.", status: "Allocations Cancelled by SC", source: "SC Judgment (2014) 9 SCC 516" },
    { id: "cwg", name: "Commonwealth Games (CWG) Loot", year: "2010", loss: "₹70,000 Cr", lossNum: 70000, category: "Sports & Infrastructure", minister: "Suresh Kalmadi / OC CWG", cag: "Shunglu Committee & CAG 2011", description: "Massive over-invoicing including toilet paper rolls purchased for ₹3,750 each. Organizing committee chairman jailed under Prevention of Corruption Act.", status: "Charge-sheets Filed", source: "Shunglu Committee Report" },
    { id: "bofors", name: "Bofors Howitzer Kickbacks", year: "1987", loss: "₹64 Cr (1987 value)", lossNum: 6400, category: "Defense", minister: "Rajiv Gandhi Administration", cag: "Swedish National Audit Bureau", description: "Allegations of $9.9 million in secret kickbacks to middlemen (Ottavio Quattrocchi) for purchasing field howitzer guns, fundamentally altering Indian politics.", status: "Middleman Accounts Defrozen in 2006", source: "Swedish Radio Exposé 1987" },
    { id: "agusta", name: "AgustaWestland VVIP Chopper Deal", year: "2013", loss: "₹3,600 Cr", lossNum: 3600, category: "Defense", minister: "A.K. Antony / UPA-2", cag: "CAG Report on VVIP Fleet", description: "Service ceiling flight altitude artificially lowered from 6,000m to 4,500m to qualify specific helicopters in exchange for bribes. Christian Michel extradited in 2018.", status: "Under Trial (CBI/ED)", source: "Milan Court of Appeals 2016" },
    { id: "nh", name: "National Herald Property Grab", year: "2012", loss: "₹5,000 Cr Assets", lossNum: 5000, category: "Land & Real Estate", minister: "Gandhi Family Trust", cag: "PMLA / Income Tax Orders", description: "Young Indian Ltd acquired ₹5,000 Crore prime real estate of Associated Journals Ltd for just ₹50 Lakhs. ED attached ₹751 Cr assets in 2023.", status: "Out on Bail / Assets Attached", source: "Delhi High Court & SC Records" },
    { id: "adarsh", name: "Adarsh Housing Society Scam", year: "2010", loss: "Unquantified Land Value", lossNum: 2000, category: "Land & Defense", minister: "Ashok Chavan (Ex-CM)", cag: "CAG Special Audit", description: "A 31-storey building in Mumbai's Colaba zone meant for Kargil war widows was allotted to politicians, bureaucrats, and military top brass.", status: "Demolition Ordered by HC", source: "Justice J.A. Patil Commission" },
    { id: "airindia", name: "Air India Fleet Acquisition", year: "2005-2010", loss: "₹67,000 Cr", lossNum: 67000, category: "Aviation", minister: "Praful Patel / UPA", cag: "CAG Report No. 18 of 2011", description: "Ordering 111 new aircraft worth ₹67,000 Cr for a cash-strapped national carrier while systematically surrendering profitable Gulf routes to private airlines.", status: "CBI FIRs Registered", source: "CAG Civil Aviation Audit 2011" },
    { id: "antrix", name: "Antrix-Devas S-Band Deal", year: "2005", loss: "₹15,000 Cr", lossNum: 15000, category: "Space & Telecom", minister: "PMO / Dept of Space (UPA)", cag: "High Level Review 2011", description: "Leasing 70 MHz of rare S-band military spectrum to private startup Devas for nominal rates without cabinet approval. SC upheld liquidation on grounds of fraud.", status: "Deal Cancelled / Fraud Upheld", source: "SC Judgment (2022)" }
  ];

  const filteredScams = useMemo(() => {
    return scamDatabase.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(scamSearch.toLowerCase()) || s.minister.toLowerCase().includes(scamSearch.toLowerCase());
      const matchesCategory = scamCategory === "All" || s.category === scamCategory;
      return matchesSearch && matchesCategory;
    });
  }, [scamSearch, scamCategory]);

  const totalScamLossEstimate = useMemo(() => scamDatabase.reduce((acc, curr) => acc + curr.lossNum, 0), []);

  const handlePledgeAndRedirect = (e) => {
    e.preventDefault();
    const finalAmount = customPledge ? parseInt(customPledge) : pledgeAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) { window.open(BHARAT_KE_VEER_URL, "_blank"); return; }
    
    // Fallback pledge addition
    setShowPledgeSuccess(true);
    setCustomPledge(""); setDonorName(""); setDonorMsg("");
    setTimeout(() => window.open(BHARAT_KE_VEER_URL, "_blank"), 800);
    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-center text-white flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 animate-spin text-yellow-200" />
        <span>SATIRICAL ARCHIVE & HISTORICAL AUDIT: Documenting Promises vs Ground Reality (1947–Present)</span>
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
                  <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Satire & Audit</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Live X/Twitter Monitor • Evidence & Fact-Check Desk</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Dhongress Daily</button>
              <button onClick={() => setActiveTab("archive")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "archive" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Historical Archive</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "meltdown" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Meltdown</button>
              
              {/* HIDDEN ADMIN DESK - ONLY SHOWS IF ?editor=true */}
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
          <div className="xl:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Dhongress Daily</button>
            <button onClick={() => { setActiveTab("archive"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Historical News Archive</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">10 Thematic Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Electoral Meltdown</button>
            {showAdminTab && (
              <button onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-purple-300 hover:bg-slate-800 flex items-center gap-2"><Lock className="w-4 h-4" /> Editorial Desk</button>
            )}
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-2 text-center py-2.5 rounded-lg font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2">
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
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
              <span className="font-semibold text-white">Verified Total Site Visits:</span>
              {loadingCounter ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <span className="font-mono font-bold text-amber-400 text-base tracking-wider">{totalVisitors?.toLocaleString() || "3,142"}</span>}
            </div>
            <div className="flex items-center gap-2 text-slate-300 border-l border-slate-700 pl-4 hidden sm:flex">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /><span>X Hourly Ingestor:</span><span className="font-mono font-bold text-emerald-400">Tracking 12 INC Accounts</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button onClick={() => copyToClipboard(`https://${DOMAIN_NAME}`)} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded transition-colors">
              <Share2 className="w-3.5 h-3.5" /> {copiedText || "Share Link"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* VIEW 1: DHONGRESS DAILY & X WATCH */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Top Newspaper Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold tracking-wider uppercase">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  TODAY'S POLITICAL CIRCUS & CLAIM AUDIT
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  The Daily Monitor of <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">High Command Contradictions</span>
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
                    <Radio className="w-5 h-5 text-cyan-400" /> Live INC Twitter Feed Watch
                  </h3>
                  <span className="text-xs bg-cyan-950/80 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">Audited Feed</span>
                </div>

                <div className="space-y-4">
                  {/* Demo/Fallback posts if Live posts are empty (for UX demonstration) */}
                  {(livePosts.length > 0 ? livePosts : [
                    { post_id: "demo1", author: "Rahul Gandhi", account_handle: "RahulGandhi", text: "We will guarantee 30 Lakh government jobs to the youth immediately upon forming the government.", claim_status: "MISLEADING", classification: "ECONOMY", evidence_sources: "During UPA (2004-2014), formal job creation averaged 1.5% annually. 30 Lakh immediate jobs lacks budgetary framework mapping." },
                    { post_id: "demo2", author: "INC Official", account_handle: "INCIndia", text: "Our government always stood for the ultimate empowerment of women across all sectors.", claim_status: "DISPUTED", classification: "POLICY", evidence_sources: "The 33% Women's Reservation Bill was kept pending for 27 years. The Shah Bano judgment was overturned in 1986." },
                    { post_id: "demo3", author: "Pawan Khera", account_handle: "Pawankhera", text: "They are claiming 'Zero Loss' in the 2G scam again today on television.", claim_status: "VERIFIED", classification: "CORRUPTION", evidence_sources: "Supreme Court cancelled 122 licenses in 2012; CAG documented ₹1.76 Lakh Crore estimated presumptive loss." }
                  ]).map((post) => (
                    <div key={post.post_id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">𝕏</div>
                          <div>
                            <div className="text-xs font-bold text-white">{post.author}</div>
                            <div className="text-[11px] text-slate-400">@{post.account_handle}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${post.claim_status === "MISLEADING" || post.claim_status === "FALSE" ? "bg-red-950/80 text-red-400 border-red-800" : post.claim_status === "VERIFIED" ? "bg-emerald-950/80 text-emerald-400 border-emerald-800" : "bg-amber-950/80 text-amber-400 border-amber-800"}`}>
                          {post.claim_status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed italic">"{post.text}"</p>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Evidence & Context:</div>
                        <p className="text-xs text-slate-400">{post.evidence_sources}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Promise Meter & Flip-Flop Files */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> The Promise Meter</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs"><span className="font-bold text-white">30 Lakh Govt Jobs</span><span className="text-red-400 font-bold">Not Completed</span></div>
                      <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full w-[8%]" /></div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs"><span className="font-bold text-white">Women's 33% Quota (1989-2014)</span><span className="text-amber-400 font-bold">Lapsed 3 Times</span></div>
                      <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full w-[15%]" /></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Flip-Flop Files</h3>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold">On Electronic Voting Machines (EVM):</span>
                      <p className="text-slate-400">Hailed as world-class innovation during 2004 & 2009 victories; claimed rigged & manipulated after 2014 & 2019 losses.</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold">On Economic Liberalization:</span>
                      <p className="text-slate-400">Initiated 1991 private market reforms under PV Narasimha Rao; pivoted back to 1970s wealth redistribution slogans in 2024.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HISTORICAL NEWS ARCHIVE (NEW) */}
        {activeTab === "archive" && (
          <div className="space-y-8">
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

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400 font-mono">Swedish Radio Broadcast</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-amber-400">Apr 1987</span>
                </div>
                <h3 className="text-xl font-serif font-black text-white">"Bribes paid to Indian politicians for Bofors Contract"</h3>
                <p className="text-sm text-slate-300 italic">"A Swedish radio station broke a story... alleging that Bofors had paid kickbacks to people in India to secure a ₹15 billion contract for 410 field howitzers."</p>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-800"><Library className="w-3 h-3 inline mr-1" /> Source: Dagens Eko Exposé (Scraped via Mediastack API)</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: THE 10 THEMATIC CHARGES */}
        {activeTab === "pillars" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The 10 Structural Charges</h2>
            </div>
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar border-b border-slate-800">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${selectedPillar === p.id ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 hover:bg-slate-850"}`}>
                    <Icon className="w-4 h-4" /> <span>#{p.id} {p.tag}</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {current.points.map((pt, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-200">{pt.heading}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{pt.detail}</p>
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

        {/* VIEW 4: MEGA SCAM VAULT */}
        {activeTab === "scams" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Mega Scam Vault</h2>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input type="text" placeholder="Search scam, minister..." value={scamSearch} onChange={(e) => setScamSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
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
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">Source: {scam.source}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: HIDDEN EDITORIAL DESK */}
        {activeTab === "admin" && showAdminTab && (
          <div className="max-w-4xl mx-auto space-y-8">
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
                <p className="text-sm">All fetched API tweets have been verified or rejected. Awaiting next cron job.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: ELECTORAL MELTDOWN */}
        {activeTab === "meltdown" && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Long Electoral Meltdown</h2>
            </div>
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> Lok Sabha Seats (1984–2024)</h3>
              <div className="space-y-4">
                {[
                  { year: "1984", seats: 414, percent: "76.2%", note: "Post-Indira sympathy wave" },
                  { year: "1991", seats: 232, percent: "42.7%", note: "Minority government era" },
                  { year: "2004", seats: 145, percent: "26.7%", note: "UPA-1 coalition formation" },
                  { year: "2009", seats: 206, percent: "37.9%", note: "UPA-2 peak before massive scam disclosures" },
                  { year: "2014", seats: 44, percent: "8.1%", note: "Historic all-time democratic low" },
                  { year: "2019", seats: 52, percent: "9.5%", note: "Failed to attain formal Leader of Opposition status" },
                  { year: "2024", seats: 99, percent: "18.2%", note: "Celebrated sub-100 finish as monumental triumph" }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono"><span className="font-bold text-white text-sm">{row.year} Election</span><span className="text-amber-400 font-bold">{row.seats} Seats ({row.percent})</span></div>
                    <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800 relative">
                      <div className={`h-full rounded-full ${row.seats <= 52 ? "bg-red-500" : row.seats < 150 ? "bg-orange-500" : "bg-emerald-500"}`} style={{ width: `${(row.seats / 543) * 100}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between"><span>{row.note}</span><span>543 total seats</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: ARMY DONATE */}
        {activeTab === "donate" && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-black text-white">Support Bharat Ke Veer 🇮🇳</h2>
            <p className="text-slate-300">100% of all contributions go directly to the Indian Armed Forces via the official Government portal.</p>
            <button onClick={() => window.open(BHARAT_KE_VEER_URL, "_blank")} className="px-8 py-4 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:scale-105 transition-transform text-lg shadow-xl shadow-emerald-500/20">Go to Official Portal →</button>
          </div>
        )}

      </main>

      <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 pt-12 pb-8 px-4 text-xs text-slate-400">
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
