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

  // Unique lists for filters
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

  return (
    <div className="min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950 bg-[#0A0F1D] text-slate-100">
      
      {/* 1. BHARAT KE VEER TOP BANNER & LANGUAGE SELECTOR */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-2.5 text-xs md:text-sm font-bold text-center text-white flex items-center justify-between gap-2 shadow-lg">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Flag className="w-4 h-4 fill-white" />
          <span>100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES VIA BHARATKEVEER.GOV.IN</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          <span>{detectedLocation}</span>
        </div>
      </div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0A0F1D]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300/30">
                <span>ढ</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black tracking-tight text-white whitespace-nowrap">
                  INDIAN NATIONAL <span className="text-amber-400 font-black">DHONGRESS</span>
                </span>
                <p className="text-[11px] text-slate-400 font-mono whitespace-nowrap">Archive of Contradictions & Dynastic Politics</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Overview</button>
              <button onClick={() => setActiveTab("congress-files")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "congress-files" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><BookMarked className="w-4 h-4 text-amber-400"/> Congress Files</button>
              <button onClick={() => setActiveTab("research")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "research" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><Database className="w-4 h-4"/> Research DB</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("dark-archive")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "dark-archive" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><FolderLock className="w-4 h-4 text-red-400"/> Dark Archive</button>
              
              {showAdminTab && (
                <button onClick={() => setActiveTab("admin")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "admin" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40" : "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-900/30"}`}>
                  <Lock className="w-3.5 h-3.5" /> Editorial Desk
                </button>
              )}

              <button onClick={() => setActiveTab("donate")} className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg hover:scale-105 transition-all flex items-center gap-1.5">
                <Flag className="w-4 h-4 fill-slate-950" /> Army Support
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        
        {/* ========================================== */}
        {/* VIEW: CONGRESS FILES (NEW DATABASE SECTION) */}
        {/* ========================================== */}
        {activeTab === "congress-files" && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-wider font-bold">
                <BookMarked className="w-4 h-4 text-amber-400" /> Public Records & Investigations Archive
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Congress Corruption & Controversy Database</h2>
              <p className="text-sm text-slate-400">Comprehensive dataset compiled from publicly reported controversies, audits, investigations, and court judgments (2014–2026).</p>
            </div>

            {/* LEGAL DISCLAIMER */}
            <div className="bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-2xl flex items-start gap-4 shadow-xl">
              <Scale className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-amber-400 uppercase tracking-wide text-xs">Legal Status & Transparency Notice</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This database compiles publicly available reports, court records, investigations, audits and media reports. Inclusion of a person, organization or case does not by itself establish criminal guilt. Legal status is shown according to the available source record. Allegation ≠ Conviction.
                </p>
              </div>
            </div>

            {/* STATISTICS DASHBOARD */}
            {!congressFilesLoading && !congressFilesError && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-amber-400 font-mono">{congressFilesData.length}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Total Records</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-cyan-400 font-mono">{availableStates.length - 1}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">States Covered</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
                  <div className="text-4xl font-black text-purple-400 font-mono">
                    {congressFilesData.filter(i => i.source_type && i.source_type.toLowerCase().includes('court')).length}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Court Records</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-center shadow-lg">
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
                
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search headline, case, or issue..."
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* State Filter */}
                <div>
                  <select
                    value={selectedStateFilter}
                    onChange={(e) => setSelectedStateFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All States ({availableStates.length - 1})</option>
                    {availableStates.filter(s => s !== "All").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Legal Statuses</option>
                    {availableStatuses.filter(s => s !== "All").map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Source Type Filter */}
                <div>
                  <select
                    value={selectedSourceFilter}
                    onChange={(e) => setSelectedSourceFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Source Types</option>
                    {availableSources.filter(s => s !== "All").map(sr => (
                      <option key={sr} value={sr}>{sr}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Active Filter Summary & Reset */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Showing <strong className="text-white font-mono">{filteredCongressFiles.length}</strong> of <strong className="text-white font-mono">{congressFilesData.length}</strong> records</span>
                {(fileSearch || selectedStateFilter !== "All" || selectedStatusFilter !== "All" || selectedSourceFilter !== "All") && (
                  <button 
                    onClick={() => { setFileSearch(""); setSelectedStateFilter("All"); setSelectedStatusFilter("All"); setSelectedSourceFilter("All"); }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Reset Filters ↺
                  </button>
                )}
              </div>
            </div>

            {/* RECORDS CARDS GRID */}
            {congressFilesLoading ? (
              <div className="text-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
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
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-5 transition-all shadow-xl flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 text-amber-400 border border-slate-800 font-bold">
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

                      {/* Headline */}
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.headline}</h3>
                      
                      {/* Issue & Government Context */}
                      <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div><strong className="text-amber-400">Case / Issue:</strong> <span className="text-slate-300">{item.case_or_issue}</span></div>
                        <div><strong className="text-purple-400">Government Context:</strong> <span className="text-slate-300">{item.government_context}</span></div>
                      </div>

                    </div>

                    {/* Footer / Source Button */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">Source: {item.source_type || "Public Record"}</span>
                      {item.link && item.link.startsWith("http") && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow"
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" /> SATIRICAL ARCHIVE & EVIDENCE
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Demanding in Opposition What They <span className="text-amber-400">Destroyed in Power.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Touch grass, then check the data. A fact-checked, satirical exposure of 60 years of dynastic monopoly, historical flip-flops, and missing receipts. No cap.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button onClick={() => setActiveTab("congress-files")} className="px-6 py-3.5 rounded-2xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg">
                  <BookMarked className="w-4 h-4" /> Explore Congress Files Database →
                </button>
              </div>
            </div>
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
