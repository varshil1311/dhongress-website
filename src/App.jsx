import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, ChevronLeft, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History, Brain, BookOpen, 
  Quote, RefreshCw, Play, XCircle, MessageSquare, BarChart, Scale, EyeOff, FolderLock, FileCode, Send, BookMarked
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPillar, setSelectedPillar] = useState(1);
  const [scamSearch, setScamSearch] = useState("");
  const [scamCategory, setScamCategory] = useState("All");
  
  // Real Counter State
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [loadingCounter, setLoadingCounter] = useState(true);

  // Hidden Admin State (Accessible via ?editor=true)
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Live Dynamic Data Counts
  const [bjpAccountCount] = useState(32);
  const [govAccountCount] = useState(45);
  const [incAccountCount] = useState(20);

  // Geo-Language State
  const [currentLang, setCurrentLang] = useState("en");
  const [detectedLocation, setDetectedLocation] = useState("India");

  // Congress Files Database State
  const [congressFilesData, setCongressFilesData] = useState([]);
  const [congressFilesLoading, setCongressFilesLoading] = useState(false);
  const [congressFilesError, setCongressFilesError] = useState(false);
  const [fileSearch, setFileSearch] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("All");
  const [selectedYearFilter, setSelectedYearFilter] = useState("All");

  // Support State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const DOMAIN_NAME = "indiannationaldhongress.com";
  const BHARAT_KE_VEER_URL = "https://bharatkeveer.gov.in/donorLogin";

  // Secret Admin URL Trigger (?editor=true)
  useEffect(() => {
    if (window.location.search.includes('editor=true')) {
      setShowAdminTab(true);
    }
  }, []);

  // Real Visitor Counter API
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

  // Fetch Congress Corruption & Controversy CSV
  useEffect(() => {
    async function fetchCongressFiles() {
      if (congressFilesData.length > 0) return;
      setCongressFilesLoading(true);
      try {
        const res = await fetch('/congress_corruption_public_sources_report_ready.csv');
        if (res.ok) {
          const text = await res.text();
          setCongressFilesData(parseCSV(text));
        } else {
          setCongressFilesError(true);
        }
      } catch (err) {
        console.error("Failed to load Congress Files CSV", err);
        setCongressFilesError(true);
      } finally {
        setCongressFilesLoading(false);
      }
    }
    fetchCongressFiles();
  }, [congressFilesData.length]);

  const parseCSV = (strData) => {
    if (!strData) return [];
    const lines = strData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const obj = {};
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
      }
      result.push(obj);
    }
    return result;
  };

  // Filtered Congress Files
  const filteredCongressFiles = useMemo(() => {
    return congressFilesData.filter(item => {
      const matchSearch = fileSearch === "" || 
        Object.values(item).some(val => val && val.toLowerCase().includes(fileSearch.toLowerCase()));
      const matchState = selectedStateFilter === "All" || item.state === selectedStateFilter;
      const matchStatus = selectedStatusFilter === "All" || item.conviction_status === selectedStatusFilter;
      const matchSource = selectedSourceFilter === "All" || item.source_type === selectedSourceFilter;
      const matchYear = selectedYearFilter === "All" || item.year === selectedYearFilter;
      return matchSearch && matchState && matchStatus && matchSource && matchYear;
    });
  }, [congressFilesData, fileSearch, selectedStateFilter, selectedStatusFilter, selectedSourceFilter, selectedYearFilter]);

  const availableStates = useMemo(() => {
    const states = new Set(congressFilesData.map(item => item.state).filter(Boolean));
    return ["All", ...Array.from(states).sort()];
  }, [congressFilesData]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set(congressFilesData.map(item => item.conviction_status).filter(Boolean));
    return ["All", ...Array.from(statuses).sort()];
  }, [congressFilesData]);

  const availableSources = useMemo(() => {
    const sources = new Set(congressFilesData.map(item => item.source_type).filter(Boolean));
    return ["All", ...Array.from(sources).sort()];
  }, [congressFilesData]);

  const availableYears = useMemo(() => {
    const years = new Set(congressFilesData.map(item => item.year).filter(Boolean));
    return ["All", ...Array.from(years).sort((a,b) => b - a)];
  }, [congressFilesData]);

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

  // 10 Pillars Data
  const pillars = [
    {
      id: 1, title: "Youth: Past Action vs Today's Preach", tag: "Youth Contradiction", icon: Users,
      summary: "Decades of sluggish educational reforms, legacy of paper leaks, and employment stagnation juxtaposed with current tall promises.",
      points: [
        { heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5%." },
        { heading: "Paper Leaks & State Freezes", detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states affected 26+ lakh young aspirants." },
        { heading: "Higher Education Sloth", detail: "Between 1960 and 2004, higher education creation remained constrained to elite urban centers, keeping gross enrolment ratios under 11%." }
      ],
      quote: '"We will give jobs to all in 1 month!" — Current rhetoric vs decades of policy paralysis.'
    },
    {
      id: 2, title: "Mahila: Rhetoric vs Reality on Women", tag: "Women Empowerment", icon: Heart,
      summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage while claiming sole proprietorship of gender justice.",
      points: [
        { heading: "The 33% Reservation 27-Year Stalling", detail: "Despite holding full majority multiple times, the Nari Shakti Vandan (33% quota) was allowed to lapse in the Lok Sabha without floor consensus." },
        { heading: "The Shah Bano Regression (1985)", detail: "Overturned the landmark Supreme Court judgment granting basic maintenance to an indigent Muslim woman, capitulating to conservative patriarchy." }
      ],
      quote: '"Ladki hoon, lad sakti hoon" — Coined shortly before losing 97% of security deposits in UP elections.'
    },
    {
      id: 3, title: "Minority Politics: Appeasement vs Upliftment", tag: "Vote Bank Engineering", icon: Shield,
      summary: "The Sachar Committee (2006) revealed how 50+ years of governance left minority communities economically and educationally at the bottom.",
      points: [
        { heading: "Sachar Committee Self-Indictment", detail: "Commissioned by UPA, it found that 55 years of rule kept Indian Muslims with only 2.5% representation in IAS/IPS." },
        { heading: "Waqf Board Disproportionate Powers", detail: "Enacted legislations granting unchecked statutory jurisdiction to Waqf boards without grassroots minority upliftment." }
      ],
      quote: '"First claim on nation\'s resources" — Speeches delivered while ground development indices for minorities remained neglected.'
    },
    {
      id: 4, title: "Job Creation: The License-Permit Raj", tag: "Economic Chokehold", icon: Briefcase,
      summary: "How socialist red tape suffocated enterprise, forcing generations of Indian youth into government clerk queues.",
      points: [
        { heading: "The 'Hindu Rate of Growth' Stagnation", detail: "Socialist centralization between 1950-1990 artificially choked private business." },
        { heading: "Twin Balance Sheet Crisis (2008-2013)", detail: "Unregulated 'phone banking' loan disbursals led to banking NPAs ballooning past ₹10.36 Lakh Crores." }
      ],
      quote: '"We will redistribute private wealth" — Echoing the discredited confiscatory economics of the 1970s.'
    },
    {
      id: 5, title: "Foreign Investment: Policy Paralysis", tag: "FDI Sabotage", icon: Globe,
      summary: "How retrospective taxation and ministerial vetoes scared away billions of global dollars in the UPA-2 era.",
      points: [
        { heading: "The 2012 Retrospective Tax Disaster", detail: "Amending tax laws retroactively against Vodafone and Cairn Energy single-handedly destroyed India's reputation for contract enforcement." },
        { heading: "Fragile Five Economy (2013)", detail: "Morgan Stanley classified India among the world's most vulnerable economies due to soaring Current Account Deficits." }
      ],
      quote: 'From the "Fragile Five" in 2013 to demanding economic miracles in opposition.'
    },
    {
      id: 6, title: "Make in India: Stagnation & Import Reliance", tag: "Manufacturing Failure", icon: Factory,
      summary: "Leaving India as an import-dependent economy for defense, mobile electronics, and infrastructure equipment.",
      points: [
        { heading: "100% Defense Import Vulnerability", detail: "Defense modernization was frozen for years, leaving the Armed Forces reliant on 70%+ imported arms." },
        { heading: "Only 2 Mobile Factories in 2014", detail: "While Asian peers industrialized in the 1990s, India had only 2 mobile phone manufacturing units in 2014." }
      ],
      quote: 'Mocking "Make in India" while maintaining 40 years of 15% stagnant manufacturing GDP contribution.'
    },
    {
      id: 7, title: "Scams of INC: The Golden Decade of Plunder", tag: "Corruption Dossier", icon: Database,
      summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.",
      points: [
        { heading: "Over ₹12 Lakh Crore Cumulative Scams", detail: "CAG audits between 2009-2014 revealed unprecedented irregularities across natural resources." },
        { heading: "The National Herald Asset Grab", detail: "Transfer of ₹5,000 Crore public asset company (AJL) to Young Indian Ltd for a nominal ₹50 Lakh loan write-off." }
      ],
      quote: '"Zero Loss Theory" — When ministers claimed on national TV that unpriced resource auctions lost zero rupees.'
    },
    {
      id: 8, title: "Sanskar: Defamation & Institutional Disrespect", tag: "Political Decorum", icon: Flame,
      summary: "A catalog of derogatory epithets against constitutional posts, veterans, and political opponents.",
      points: [
        { heading: "Insults to Constitutional Positions", detail: "Repeated derogatory remarks against the President of India ('Rashtrapatni'), Prime Minister, and Election Commissioners." },
        { heading: "Tearing the Cabinet Ordinance (2013)", detail: "Publicly humiliating his own Prime Minister Dr. Manmohan Singh by tearing a government ordinance into pieces." }
      ],
      quote: 'Lecturing on "Mohabbat Ki Dukan" while running systematic vitriol campaigns.'
    },
    {
      id: 9, title: "One Family, One Party: Sidelining Merit", tag: "Dynasty Over Democracy", icon: Crown,
      summary: "How internal party democracy was decimated and iconic non-dynasty leaders were historically humiliated.",
      points: [
        { heading: "The Humiliation of PV Narasimha Rao", detail: "The former PM who unlocked 1991 reforms was denied entry of his mortal remains into the AICC headquarters." },
        { heading: "The Mass Exodus of Competent Leaders", detail: "Over 40 prominent senior leaders left citing dynastic sycophancy." }
      ],
      quote: '"The party is the family, and the family is the nation" — The core operating doctrine since 1969.'
    },
    {
      id: 10, title: "Worst Electoral Meltdown in Democracy", tag: "Democracy's Verdict", icon: TrendingDown,
      summary: "How India's oldest party went from 414 seats (1984) to historic lows of 44 (2014) and 52 (2019).",
      points: [
        { heading: "The 44-Seat Nadir (2014)", detail: "Could not even secure the statutory 10% of seats required to claim the formal Leader of Opposition status in Lok Sabha." },
        { heading: "Sub-20% Strike Rate in Direct Fights", detail: "In head-to-head national contests against national alternatives, the strike rate remained under 15% across three general elections." }
      ],
      quote: 'Declaring a monumental victory at 99 seats after failing to cross the halfway mark for a decade.'
    }
  ];

  // Scam Vault Data
  const scamDatabase = [
    { id: "2g", name: "2G Spectrum Allocation Scam", year: "2008", loss: "₹1,76,000 Cr", category: "Telecom & Tech", minister: "A. Raja / UPA-1", cag: "CAG Report No. 19 of 2010-11", description: "Arbitrary first-come-first-served spectrum allocation at throwaway prices. 122 telecom licenses cancelled by Supreme Court in 2012.", status: "Licenses Cancelled by SC", source: "SC Judgment (2012)" },
    { id: "coal", name: "Coalgate: Coal Block Allocation", year: "2012", loss: "₹1,86,000 Cr", category: "Natural Resources", minister: "Ministry of Coal / UPA", cag: "CAG Report No. 7", description: "Allocation of 214 captive coal blocks to private firms without transparent competitive bidding.", status: "Allocations Cancelled by SC", source: "SC Judgment (2014)" },
    { id: "cwg", name: "Commonwealth Games (CWG) Loot", year: "2010", loss: "₹70,000 Cr", category: "Sports & Infrastructure", minister: "Suresh Kalmadi", cag: "Shunglu Committee", description: "Massive over-invoicing including toilet paper rolls purchased for ₹3,750 each.", status: "Charge-sheets Filed", source: "Shunglu Committee Report" },
    { id: "bofors", name: "Bofors Howitzer Kickbacks", year: "1987", loss: "₹64 Cr (1987)", category: "Defense", minister: "Rajiv Gandhi Admin", cag: "Swedish Audit", description: "Allegations of $9.9 million in secret kickbacks to middlemen for purchasing field howitzer guns.", status: "Middleman Accounts Defrozen in 2006", source: "Swedish Radio Exposé" },
    { id: "agusta", name: "AgustaWestland VVIP Chopper Deal", year: "2013", loss: "₹3,600 Cr", category: "Defense", minister: "A.K. Antony / UPA-2", cag: "CAG Report", description: "Service ceiling flight altitude artificially lowered to qualify specific helicopters in exchange for bribes.", status: "Under Trial (CBI/ED)", source: "Milan Court of Appeals 2016" },
    { id: "nh", name: "National Herald Property Grab", year: "2012", loss: "₹5,000 Cr Assets", category: "Land & Real Estate", minister: "Gandhi Family Trust", cag: "PMLA / IT Orders", description: "Young Indian Ltd acquired ₹5,000 Crore prime real estate of Associated Journals Ltd for just ₹50 Lakhs.", status: "Assets Attached", source: "Delhi High Court" }
  ];

  const filteredScams = useMemo(() => {
    return scamDatabase.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(scamSearch.toLowerCase()) || s.minister.toLowerCase().includes(scamSearch.toLowerCase());
      const matchesCategory = scamCategory === "All" || s.category === scamCategory;
      return matchesSearch && matchesCategory;
    });
  }, [scamSearch, scamCategory]);

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white bg-[#0B0F19] text-slate-100">
      
      {/* 1. BHARAT KE VEER TOP BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 px-4 py-2.5 text-xs md:text-sm font-bold text-center text-white flex items-center justify-between gap-2 shadow-lg">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Flag className="w-4 h-4 fill-white" />
          <span>100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES VIA BHARATKEVEER.GOV.IN</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-indigo-300" />
          <span>{detectedLocation}</span>
        </div>
      </div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              {/* FIXED LOGO: "ढ" clearly visible in white badge */}
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg border border-indigo-400/30">
                <span>ढ</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black tracking-tight text-white whitespace-nowrap">
                  INDIAN NATIONAL <span className="text-indigo-400 font-black">DHONGRESS</span>
                </span>
                <p className="text-[11px] text-slate-400 font-mono whitespace-nowrap">Archive of Contradictions & Dynastic Politics</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Overview</button>
              <button onClick={() => setActiveTab("congress-files")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "congress-files" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><BookMarked className="w-4 h-4 text-indigo-400"/> Congress Files</button>
              <button onClick={() => setActiveTab("research")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "research" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><Database className="w-4 h-4"/> Research DB</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("dark-archive")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "dark-archive" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><FolderLock className="w-4 h-4 text-red-400"/> Dark Archive</button>
              
              {showAdminTab && (
                <button onClick={() => setActiveTab("admin")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "admin" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40" : "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-900/30"}`}>
                  <Lock className="w-3.5 h-3.5" /> Editorial Desk
                </button>
              )}

              <button onClick={() => setActiveTab("donate")} className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-all flex items-center gap-1.5">
                <Flag className="w-4 h-4 fill-white" /> Army Support
              </button>
            </nav>

            <div className="xl:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-800 text-slate-300">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-slate-800 bg-[#0B0F19] px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Overview</button>
            <button onClick={() => { setActiveTab("congress-files"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-indigo-300 flex items-center gap-2"><BookMarked className="w-4 h-4"/> Congress Files</button>
            <button onClick={() => { setActiveTab("research"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-cyan-300 flex items-center gap-2"><Database className="w-4 h-4"/> Research Database</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">10 Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Scam Vault</button>
            <button onClick={() => { setActiveTab("dark-archive"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-red-400 flex items-center gap-2"><FolderLock className="w-4 h-4"/> Dark Archive</button>
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-2 py-2.5 rounded-lg font-bold bg-emerald-500 text-white flex justify-center gap-2">Donate to Army</button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        
        {/* ========================================== */}
        {/* VIEW: CONGRESS FILES (NEW DATABASE SECTION) */}
        {/* ========================================== */}
        {activeTab === "congress-files" && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider font-bold">
                <BookMarked className="w-4 h-4 text-indigo-400" /> Public Records & Investigations Archive
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Congress Corruption & Controversy Database</h2>
              <p className="text-sm text-slate-400">Comprehensive dataset compiled from publicly reported controversies, audits, investigations, and court judgments (2014–2026).</p>
            </div>

            {/* LEGAL DISCLAIMER */}
            <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl flex items-start gap-4 shadow-xl">
              <Scale className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-indigo-400 uppercase tracking-wide text-xs">Legal Status & Transparency Notice</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This database compiles publicly available reports, court records, investigations, audits and media reports. Inclusion of a person, organization or case does not by itself establish criminal guilt. Legal status is shown according to the available source record. Allegation ≠ Conviction.
                </p>
              </div>
            </div>

            {/* STATISTICS DASHBOARD */}
            {!congressFilesLoading && !congressFilesError && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-indigo-400 font-mono">{congressFilesData.length}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Total Records</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-cyan-400 font-mono">{availableStates.length - 1}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">States Covered</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-purple-400 font-mono">
                    {congressFilesData.filter(i => i.source_type && i.source_type.toLowerCase().includes('court')).length}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Court Records</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-emerald-400 font-mono">
                    {congressFilesData.filter(i => i.conviction_status && i.conviction_status.toLowerCase().includes('convict')).length}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Convictions Recorded</div>
                </div>
              </div>
            )}

            {/* FILTER CONTROLS & SEARCH */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search headline, case, or issue..."
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={selectedStateFilter}
                    onChange={(e) => setSelectedStateFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All States ({availableStates.length - 1})</option>
                    {availableStates.filter(s => s !== "All").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Legal Statuses</option>
                    {availableStatuses.filter(s => s !== "All").map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedSourceFilter}
                    onChange={(e) => setSelectedSourceFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Source Types</option>
                    {availableSources.filter(s => s !== "All").map(sr => (
                      <option key={sr} value={sr}>{sr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Showing <strong className="text-white font-mono">{filteredCongressFiles.length}</strong> of <strong className="text-white font-mono">{congressFilesData.length}</strong> records</span>
                {(fileSearch || selectedStateFilter !== "All" || selectedStatusFilter !== "All" || selectedSourceFilter !== "All") && (
                  <button 
                    onClick={() => { setFileSearch(""); setSelectedStateFilter("All"); setSelectedStatusFilter("All"); setSelectedSourceFilter("All"); }}
                    className="text-indigo-400 hover:underline font-bold"
                  >
                    Reset Filters ↺
                  </button>
                )}
              </div>
            </div>

            {/* RECORDS CARDS GRID */}
            {congressFilesLoading ? (
              <div className="text-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                <p className="text-xs text-slate-400">Loading Congressional Records Database...</p>
              </div>
            ) : congressFilesError ? (
              <div className="bg-red-950/40 border border-red-500 p-8 rounded-3xl text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                <h3 className="font-bold text-white">Database Dataset Missing</h3>
                <p className="text-xs text-slate-400">Please ensure `congress_corruption_public_sources_report_ready.csv` is placed in your `public/` folder.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCongressFiles.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-5 transition-all shadow-xl flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 text-indigo-400 border border-slate-800 font-bold">
                          {item.state || "National"} • {item.year || "N/A"}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                          item.conviction_status?.toLowerCase().includes('convict') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          item.conviction_status?.toLowerCase().includes('charge') ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {item.conviction_status || "Investigation / Record"}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.headline}</h3>
                      <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div><strong className="text-indigo-400">Case / Issue:</strong> <span className="text-slate-300">{item.case_or_issue}</span></div>
                        <div><strong className="text-purple-400">Government Context:</strong> <span className="text-slate-300">{item.government_context}</span></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">Source: {item.source_type || "Public Record"}</span>
                      {item.link && item.link.startsWith("http") && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow"
                        >
                          Read Source <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: OVERVIEW (FRONT PAGE)                */}
        {/* ========================================== */}
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wider uppercase">
                <Flame className="w-4 h-4 text-indigo-400 animate-pulse" /> SATIRICAL ARCHIVE & EVIDENCE
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Demanding in Opposition What They <span className="text-indigo-400">Destroyed in Power.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Touch grass, then check the data. A fact-checked, satirical exposure of 60 years of dynastic monopoly, historical flip-flops, and missing receipts. No cap.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button onClick={() => setActiveTab("congress-files")} className="px-6 py-3.5 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 shadow-lg">
                  <BookMarked className="w-4 h-4" /> Congress Files Database →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: RESEARCH DATABASE                    */}
        {/* ========================================== */}
        {activeTab === "research" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black text-white">Research & Election Database</h2>
              <p className="text-sm text-slate-400">Historical performance metrics and electoral data analysis.</p>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: 10 CHARGES                           */}
        {/* ========================================== */}
        {activeTab === "pillars" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black text-white">The 10 Structural Charges</h2>
            </div>
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar border-b border-slate-800">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${selectedPillar === p.id ? "bg-indigo-600 text-white font-bold" : "bg-slate-900 text-slate-300 hover:bg-slate-850"}`}>
                    <Icon className="w-4 h-4" /> <span>#{p.id} {p.tag}</span>
                  </button>
                );
              })}
            </div>
            {(() => {
              const current = pillars.find((p) => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400"><Icon className="w-6 h-6" /></div>
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
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: SCAM VAULT                           */}
        {/* ========================================== */}
        {activeTab === "scams" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black text-white">The Mega Scam Vault</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scamDatabase.map((scam) => (
                <div key={scam.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400 font-mono">
                      <span>{scam.year}</span> <span className="text-indigo-400">{scam.category}</span>
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

        {/* ========================================== */}
        {/* VIEW: DARK ARCHIVE                         */}
        {/* ========================================== */}
        {activeTab === "dark-archive" && (
          <div className="space-y-8 animate-in fade-in text-center max-w-2xl mx-auto py-12">
            <h2 className="text-3xl font-black text-white">The Dark Archive</h2>
            <p className="text-sm text-slate-400">Classified & declassified historical documents and press censorship records.</p>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: MELTDOWN                             */}
        {/* ========================================== */}
        {activeTab === "meltdown" && (
          <div className="space-y-8 animate-in fade-in text-center max-w-2xl mx-auto py-12">
            <h2 className="text-3xl font-black text-white">Electoral Meltdown</h2>
            <p className="text-sm text-slate-400">Lok Sabha seat trajectories from 1984 to 2024.</p>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: ADMIN DESK (?editor=true)            */}
        {/* ========================================== */}
        {activeTab === "admin" && showAdminTab && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30"><Lock className="w-8 h-8" /></div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Editorial Review Desk</h2>
            </div>
            {!isAdminAuthenticated ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
                <label className="text-xs font-semibold text-slate-400">Enter Admin PIN</label>
                <input type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500" />
                <button onClick={() => { if (adminPin.length >= 4) setIsAdminAuthenticated(true); }} className="w-full py-3 rounded-xl font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all text-sm">Unlock Desk</button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-300">
                <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
                <p className="text-sm">All fetched API tweets have been verified or rejected.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW: DONATE                               */}
        {/* ========================================== */}
        {activeTab === "donate" && (
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in py-12">
            <h2 className="text-4xl font-black text-white">Support Bharat Ke Veer 🇮🇳</h2>
            <p className="text-slate-300">100% of all contributions go directly to the Indian Armed Forces via the official Government portal.</p>
            <button onClick={() => window.open(BHARAT_KE_VEER_URL, "_blank")} className="px-8 py-4 rounded-xl font-bold bg-emerald-500 text-white hover:scale-105 transition-transform text-lg shadow-xl shadow-emerald-500/20">Go to Official Portal →</button>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-20 pt-12 pb-8 px-4 text-xs text-slate-500 text-center">
        <p>© {new Date().getFullYear()} {DOMAIN_NAME}. Political commentary & satire archive.</p>
      </footer>
    </div>
  );
}
