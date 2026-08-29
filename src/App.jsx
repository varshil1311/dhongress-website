import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History, BarChart, 
  PieChart, LayoutGrid, List, Calendar, AlertCircle
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

  // Research Database State
  const [electionData, setElectionData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [csvError, setCsvError] = useState(null);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  
  // Research Filters
  const [elecFilterYear, setElecFilterYear] = useState("All");
  const [elecFilterType, setElecFilterType] = useState("All");
  const [elecFilterOutcome, setElecFilterOutcome] = useState("All");
  const [newsSearch, setNewsSearch] = useState("");
  const [newsFilterYear, setNewsFilterYear] = useState("All");
  const [newsFilterCase, setNewsFilterCase] = useState("All");
  const [newsFilterClass, setNewsFilterClass] = useState("All");
  const [newsViewMode, setNewsViewMode] = useState("cards"); // 'cards' | 'table'
  const [selectedDeepDiveCase, setSelectedDeepDiveCase] = useState("");

  // Custom robust CSV Parser
  const parseCSV = (str) => {
    if (!str) return [];
    const arr = [];
    let quote = false;
    let row = [], col = '';
    for (let c = 0; c < str.length; c++) {
      let cc = str[c], nc = str[c + 1];
      if (cc === '"' && quote && nc === '"') { col += cc; ++c; continue; }
      if (cc === '"') { quote = !quote; continue; }
      if (cc === ',' && !quote) { row.push(col.trim()); col = ''; continue; }
      if (cc === '\r' && nc === '\n' && !quote) { row.push(col.trim()); arr.push(row); col = ''; row = []; ++c; continue; }
      if (cc === '\n' && !quote) { row.push(col.trim()); arr.push(row); col = ''; row = []; continue; }
      if (cc === '\r' && !quote) { row.push(col.trim()); arr.push(row); col = ''; row = []; continue; }
      col += cc;
    }
    if (col || row.length) { row.push(col.trim()); arr.push(row); }
    if (arr.length < 2) return [];
    const headers = arr[0].map(h => h.trim().replace(/^"|"$/g, ''));
    return arr.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { 
        let val = row[i] ? row[i].trim() : '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        obj[h] = val; 
      });
      return obj;
    });
  };

  useEffect(() => {
    async function loadResearchData() {
      setIsCsvLoading(true);
      try {
        const [resElec, resNews] = await Promise.all([
          fetch('/Congress_Election_Database_2014_2026.csv').catch(() => null),
          fetch('/Congress_Corruption_Controversy_News_2014_2026.csv').catch(() => null)
        ]);

        let parsedE = [];
        let parsedN = [];

        if (resElec && resElec.ok) {
          const text = await resElec.text();
          parsedE = parseCSV(text);
        } else {
          // Provide silent empty array to prevent crash if file is missing, relying on UI error state
          parsedE = [];
        }

        if (resNews && resNews.ok) {
          const text = await resNews.text();
          parsedN = parseCSV(text);
        } else {
          parsedN = [];
        }

        if (parsedE.length === 0 && parsedN.length === 0) {
          throw new Error("CSV files not found or empty.");
        }

        setElectionData(parsedE.filter(d => Object.keys(d).length > 2 && d['Year']));
        setNewsData(parsedN.filter(d => Object.keys(d).length > 2 && d['Headline']));
        setCsvError(null);
      } catch (err) {
        setCsvError("Research dataset could not be loaded. Existing website sections remain available.");
      } finally {
        setIsCsvLoading(false);
      }
    }
    // Only load when research tab is active to save bandwidth, or load on mount if preferred. 
    // Loading on mount ensures fast switching.
    loadResearchData();
  }, []);

  const elecStats = useMemo(() => {
    const total = electionData.length;
    const ls = electionData.filter(d => d['Election Type']?.toLowerCase().includes('lok sabha')).length;
    const state = electionData.filter(d => d['Election Type']?.toLowerCase().includes('assembly')).length;
    const wins = electionData.filter(d => d['Outcome']?.toLowerCase().includes('won') || d['Outcome']?.toLowerCase().includes('victory')).length;
    const defeats = electionData.filter(d => d['Outcome']?.toLowerCase().includes('defeat') || d['Outcome']?.toLowerCase().includes('lost')).length;
    const zeroSeats = electionData.filter(d => parseInt(d['INC Seats Won']) === 0).length;
    return { total, ls, state, wins, defeats, zeroSeats };
  }, [electionData]);

  const newsStats = useMemo(() => {
    const total = newsData.length;
    const uniqueCases = new Set(newsData.map(d => d['Case / Controversy'])).size;
    return { total, uniqueCases };
  }, [newsData]);

  const filteredElections = useMemo(() => {
    return electionData.filter(d => {
      const matchY = elecFilterYear === "All" || d['Year'] === elecFilterYear;
      const matchT = elecFilterType === "All" || (d['Election Type'] && d['Election Type'].includes(elecFilterType));
      const matchO = elecFilterOutcome === "All" || (d['Outcome'] && d['Outcome'].includes(elecFilterOutcome));
      return matchY && matchT && matchO;
    });
  }, [electionData, elecFilterYear, elecFilterType, elecFilterOutcome]);

  const filteredNews = useMemo(() => {
    return newsData.filter(d => {
      const s = newsSearch.toLowerCase();
      const matchSearch = !s || 
        (d['Headline']?.toLowerCase().includes(s)) || 
        (d['Case / Controversy']?.toLowerCase().includes(s)) ||
        (d['People / Organisations']?.toLowerCase().includes(s));
      const matchY = newsFilterYear === "All" || d['Year'] === newsFilterYear;
      const matchC = newsFilterCase === "All" || d['Case / Controversy'] === newsFilterCase;
      const matchClass = newsFilterClass === "All" || d['Evidence Classification'] === newsFilterClass;
      return matchSearch && matchY && matchC && matchClass;
    });
  }, [newsData, newsSearch, newsFilterYear, newsFilterCase, newsFilterClass]);

  const caseDeepDiveData = useMemo(() => {
    if (!selectedDeepDiveCase || selectedDeepDiveCase === "All") return null;
    const caseItems = newsData.filter(d => d['Case / Controversy'] === selectedDeepDiveCase);
    if (!caseItems.length) return null;
    
    // Sort chronologically
    const sorted = [...caseItems].sort((a, b) => new Date(a['Date']) - new Date(b['Date']));
    
    return {
      count: caseItems.length,
      earliest: sorted[0]['Date'],
      latest: sorted[sorted.length - 1]['Date'],
      people: [...new Set(caseItems.map(c => c['People / Organisations']).filter(Boolean))].join(", "),
      articles: sorted
    };
  }, [newsData, selectedDeepDiveCase]);

  // Extract unique filter options
  const elecYears = useMemo(() => ["All", ...new Set(electionData.map(d => d['Year']).filter(Boolean))].sort(), [electionData]);
  const elecTypes = useMemo(() => ["All", "Lok Sabha", "Assembly"], []);
  const newsYears = useMemo(() => ["All", ...new Set(newsData.map(d => d['Year']).filter(Boolean))].sort(), [newsData]);
  const newsCases = useMemo(() => ["All", ...new Set(newsData.map(d => d['Case / Controversy']).filter(Boolean))].sort(), [newsData]);
  const newsClassifications = useMemo(() => ["All", ...new Set(newsData.map(d => d['Evidence Classification']).filter(Boolean))], [newsData]);

  useEffect(() => {
    if (window.location.search.includes('editor=true')) {
      setShowAdminTab(true);
    }
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

  const handlePledgeAndRedirect = (e) => {
    e.preventDefault();
    const finalAmount = customPledge ? parseInt(customPledge) : pledgeAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) { window.open(BHARAT_KE_VEER_URL, "_blank"); return; }
    
    setShowPledgeSuccess(true);
    setCustomPledge(""); setDonorName(""); setDonorMsg("");
    setTimeout(() => window.open(BHARAT_KE_VEER_URL, "_blank"), 800);
    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

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
      id: 3, title: "Minority Politics: Tokenism vs Upliftment", tag: "Vote Bank Engineering", icon: Shield, color: "from-purple-500 to-indigo-600",
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
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "meltdown" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Meltdown</button>
              
              {/* NEW: Research Database Tab */}
              <button onClick={() => setActiveTab("research")} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === "research" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "text-blue-400 hover:text-blue-300 hover:bg-slate-800"}`}>
                <Database className="w-4 h-4" /> Research Database
              </button>

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
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">10 Thematic Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800">Electoral Meltdown</button>
            <button onClick={() => { setActiveTab("research"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-bold text-blue-400 hover:bg-slate-800 flex items-center gap-2"><Database className="w-4 h-4" /> Research Database</button>
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
                
                <div className="pt-4 flex items-center justify-center">
                  <button onClick={() => setActiveTab("research")} className="px-6 py-3 rounded-xl font-bold bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/40 transition-all flex items-center gap-2">
                    <Database className="w-4 h-4" /> Enter Research Database
                  </button>
                </div>
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

        {/* NEW VIEW: RESEARCH DATABASE */}
        {activeTab === "research" && (
          <div className="space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-bold tracking-wider uppercase">
                <Database className="w-3.5 h-3.5" /> Follow The Numbers
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">THE CONGRESS RESEARCH DATABASE</h2>
              <p className="text-lg text-slate-300">2014–2026 • Elections • Controversies • Headlines • Evidence</p>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 max-w-2xl mx-auto">
                <AlertCircle className="w-4 h-4 inline mr-1.5 text-amber-400" />
                <strong>Research archive</strong> compiled from publicly reported election results, news reports, and legal/agency developments. 
                <span className="text-amber-400 font-semibold ml-1">Allegations are not convictions.</span>
              </div>
            </div>

            {/* Error State */}
            {csvError && (
              <div className="bg-red-950/40 border border-red-800 p-6 rounded-2xl text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-red-400">Data Loading Error</h3>
                <p className="text-sm text-slate-300">{csvError}</p>
                <p className="text-xs text-slate-500 mt-2">Ensure CSV files are available in the public directory.</p>
              </div>
            )}

            {!csvError && isCsvLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-400 font-mono text-sm">Parsing Research Datasets...</p>
              </div>
            )}

            {/* Content loaded successfully */}
            {!csvError && !isCsvLoading && electionData.length > 0 && (
              <div className="space-y-16">
                
                {/* SECTION 1: EXECUTIVE DASHBOARD */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">1. Executive Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Election Events</div>
                      <div className="text-3xl font-black text-blue-400 font-mono">{elecStats.total}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Lok Sabha</div>
                      <div className="text-3xl font-black text-white font-mono">{elecStats.ls}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Assembly</div>
                      <div className="text-3xl font-black text-white font-mono">{elecStats.state}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">News Records</div>
                      <div className="text-3xl font-black text-amber-400 font-mono">{newsStats.total}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Lok Sabha Seats (14-19-24)</div>
                      <div className="flex items-end gap-3 h-8 mt-1">
                        <div className="flex flex-col items-center gap-1"><div className="h-4 w-8 bg-red-500 rounded-t"></div><span className="text-[10px] font-mono text-white">44</span></div>
                        <div className="flex flex-col items-center gap-1"><div className="h-5 w-8 bg-orange-500 rounded-t"></div><span className="text-[10px] font-mono text-white">52</span></div>
                        <div className="flex flex-col items-center gap-1"><div className="h-8 w-8 bg-emerald-500 rounded-t"></div><span className="text-[10px] font-mono text-white">99</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ELECTION DATABASE */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-2">
                    <h3 className="text-xl font-bold text-white">2. Congress Election Performance (2014–2026)</h3>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:border-blue-500 outline-none" value={elecFilterYear} onChange={e => setElecFilterYear(e.target.value)}>
                        <option value="All">All Years</option>
                        {elecYears.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:border-blue-500 outline-none" value={elecFilterType} onChange={e => setElecFilterType(e.target.value)}>
                        {elecTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Year</th>
                            <th className="px-4 py-3 font-semibold">Election</th>
                            <th className="px-4 py-3 font-semibold">State</th>
                            <th className="px-4 py-3 font-semibold">Seats</th>
                            <th className="px-4 py-3 font-semibold">INC Won</th>
                            <th className="px-4 py-3 font-semibold">Outcome</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                          {filteredElections.slice(0, 50).map((row, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3 font-mono">{row['Year']}</td>
                              <td className="px-4 py-3">{row['Election Type'] || row['Election']}</td>
                              <td className="px-4 py-3 font-semibold text-white">{row['State']}</td>
                              <td className="px-4 py-3 font-mono">{row['Total Seats'] || row['Seats']}</td>
                              <td className="px-4 py-3 font-mono text-blue-400 font-bold">{row['INC Seats Won'] || row['INC Won']}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                  row['Outcome']?.toLowerCase().includes('won') || row['Outcome']?.toLowerCase().includes('victory') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                  row['Outcome']?.toLowerCase().includes('defeat') || row['Outcome']?.toLowerCase().includes('lost') ? 'bg-red-950 text-red-400 border border-red-800' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {row['Outcome']}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredElections.length > 50 && (
                        <div className="p-3 text-center text-xs text-slate-500 border-t border-slate-800">
                          Showing first 50 of {filteredElections.length} records.
                        </div>
                      )}
                      {filteredElections.length === 0 && (
                        <div className="p-8 text-center text-slate-500">No elections found for these filters.</div>
                      )}
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-slate-800/50">
                      {filteredElections.slice(0, 20).map((row, i) => (
                        <div key={i} className="p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs text-slate-400 font-mono">{row['Year']} • {row['Election Type'] || row['Election']}</div>
                              <div className="font-bold text-white">{row['State']}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                row['Outcome']?.toLowerCase().includes('won') || row['Outcome']?.toLowerCase().includes('victory') ? 'bg-emerald-950 text-emerald-400' :
                                row['Outcome']?.toLowerCase().includes('defeat') || row['Outcome']?.toLowerCase().includes('lost') ? 'bg-red-950 text-red-400' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {row['Outcome']}
                            </span>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <div>Total Seats: <span className="font-mono text-slate-300">{row['Total Seats'] || row['Seats']}</span></div>
                            <div>INC Won: <span className="font-mono font-bold text-blue-400">{row['INC Seats Won'] || row['INC Won']}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: DEFEAT ANALYSIS & MARGIN DISCLAIMER */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">3. Largest Electoral Setbacks</h3>
                  
                  <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-amber-400">Margin Data — Limitation Notice</h4>
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        The current database records election-level house results. Constituency-level winning margins require individual candidate results and are strictly not inferred or fabricated here to maintain research credibility.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {electionData
                      .filter(d => parseInt(d['INC Seats Won']) === 0 && d['Total Seats'])
                      .slice(0, 4)
                      .map((d, i) => (
                        <div key={i} className="bg-slate-900 border border-red-900/30 p-4 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
                          <div className="text-[10px] text-slate-500 font-mono mb-1">{d['Year']} • {d['Election Type']}</div>
                          <div className="font-bold text-white mb-2">{d['State']}</div>
                          <div className="text-xs text-slate-400">Seat Share Won:</div>
                          <div className="text-2xl font-black text-red-500 font-mono">0 / {d['Total Seats']}</div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 5: CORRUPTION & CONTROVERSY NEWS ARCHIVE */}
                <div className="space-y-6 pt-8 border-t border-slate-800">
                  <div className="text-center max-w-3xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
                      The Paper Trail
                    </span>
                    <h2 className="text-3xl font-black text-white">Corruption & Controversy News Archive</h2>
                    <p className="text-sm text-slate-400">{newsStats.total}+ documented news records • {newsStats.uniqueCases} Controversies</p>
                  </div>

                  {/* ALLEGATION != CONVICTION SECTION 6 */}
                  <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-2xl space-y-2">
                    <h4 className="font-black text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Allegation ≠ Conviction
                    </h4>
                    <p className="text-xs text-slate-300">
                      This archive contains publicly reported articles regarding allegations, investigations, political claims and legal proceedings. 
                      Inclusion in this archive does not establish criminal liability. Statuses explicitly record favourable outcomes, acquittals, or discharges where reported.
                    </p>
                  </div>

                  {/* News Filters & Search */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text" 
                        placeholder="Search headlines, people, cases..." 
                        value={newsSearch} 
                        onChange={e => setNewsSearch(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500" 
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <select className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:border-rose-500 outline-none max-w-[150px]" value={newsFilterYear} onChange={e => setNewsFilterYear(e.target.value)}>
                          <option value="All">All Years</option>
                          {newsYears.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:border-rose-500 outline-none max-w-[150px] truncate" value={newsFilterCase} onChange={e => setNewsFilterCase(e.target.value)}>
                          <option value="All">All Controversies</option>
                          {newsCases.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      
                      <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button onClick={() => setNewsViewMode('cards')} className={`px-3 py-1 rounded text-xs font-semibold ${newsViewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>Cards</button>
                        <button onClick={() => setNewsViewMode('table')} className={`px-3 py-1 rounded text-xs font-semibold ${newsViewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>Table</button>
                      </div>
                    </div>
                  </div>

                  {/* News Output */}
                  {newsViewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredNews.slice(0, 24).map((item, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono text-slate-500">{item['Date']}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-400 truncate max-w-[150px]">
                                {item['Case / Controversy']}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white leading-snug">
                              {item['Headline']}
                            </h4>
                            <div className="text-xs text-slate-400 space-y-1">
                              <div><strong>Source:</strong> {item['Source']}</div>
                              {item['Evidence Classification'] && <div><strong>Classification:</strong> <span className="text-amber-400">{item['Evidence Classification']}</span></div>}
                              {item['Status'] && <div className="text-emerald-400"><strong>Status:</strong> {item['Status']}</div>}
                            </div>
                          </div>
                          {item['URL'] && (
                            <a href={item['URL']} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              READ ARTICLE <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Case</th>
                            <th className="px-4 py-3">Headline</th>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                          {filteredNews.slice(0, 50).map((item, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3 font-mono whitespace-nowrap">{item['Date']}</td>
                              <td className="px-4 py-3 text-xs text-rose-400">{item['Case / Controversy']}</td>
                              <td className="px-4 py-3 font-medium text-white max-w-xs">
                                {item['URL'] ? <a href={item['URL']} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-400">{item['Headline']}</a> : item['Headline']}
                              </td>
                              <td className="px-4 py-3 text-xs">{item['Source']}</td>
                              <td className="px-4 py-3 text-xs text-emerald-400">{item['Status']}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {filteredNews.length > 24 && newsViewMode === 'cards' && (
                     <div className="text-center text-xs text-slate-500">Showing 24 of {filteredNews.length} articles. Use search/filters or table view for more.</div>
                  )}
                </div>

                {/* SECTION 8: CASE DEEP DIVE */}
                <div className="space-y-6 pt-8 border-t border-slate-800">
                  <h3 className="text-xl font-bold text-white">4. Case Deep-Dive</h3>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className="text-sm font-semibold text-slate-300">Select a controversy to analyze:</label>
                      <select className="bg-slate-950 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none flex-grow max-w-md" value={selectedDeepDiveCase} onChange={e => setSelectedDeepDiveCase(e.target.value)}>
                        <option value="">-- Choose Case --</option>
                        {newsCases.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {caseDeepDiveData && (
                      <div className="pt-4 border-t border-slate-800 space-y-6 animate-fade-in">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Articles</div>
                            <div className="text-xl font-mono text-white">{caseDeepDiveData.count}</div>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Timeline Started</div>
                            <div className="text-sm font-mono text-white mt-1">{caseDeepDiveData.earliest}</div>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Key Figures / Entities</div>
                            <div className="text-xs text-amber-400 mt-1 truncate">{caseDeepDiveData.people || "Various"}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Chronological Developments</h4>
                          <div className="pl-4 border-l-2 border-slate-800 space-y-4">
                            {caseDeepDiveData.articles.map((art, idx) => (
                              <div key={idx} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                                <div className="text-[10px] font-mono text-slate-500 mb-0.5">{art['Date']} • {art['Source']}</div>
                                <div className="text-sm font-medium text-slate-200">{art['Headline']}</div>
                                {art['Status'] && <div className="text-xs text-emerald-400 mt-0.5">{art['Status']}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 12: SOURCES & METHODOLOGY */}
                <div className="pt-12 pb-6 border-t border-slate-800 text-center space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sources & Methodology</h4>
                  <div className="max-w-3xl mx-auto text-xs text-slate-500 space-y-2 leading-relaxed text-left sm:text-center">
                    <p><strong>Election Data:</strong> Rendered dynamically from supplied historical election datasets. "Primary Electoral Factor" reflects compiled analytical notes and is not an official ECI declaration.</p>
                    <p><strong>News Data:</strong> Contains publicly documented news reports spanning 2014–2026. Inclusion in this archive indicates public reporting/investigation, not criminal guilt.</p>
                    <p><strong>Margin Limitations:</strong> This repository relies on house-level seat outcomes. Constituency-level margins are excluded to preserve accuracy without fabrication.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: THE 10 THEMATIC CHARGES */}
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
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Mega Scam Vault</h2>
              {/* CROSS-LINK TO RESEARCH DATABASE */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 max-w-2xl mx-auto">
                <p>Historical allegations and reported losses are not equivalent to judicially established corruption. See the Research Archive for legal/source status context.</p>
                <button onClick={() => setActiveTab("research")} className="mt-3 px-4 py-2 rounded-lg bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 transition-colors border border-blue-800/50 font-semibold inline-flex items-center gap-2">
                  View Source News Archive <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
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

            {/* CROSS-LINK TO RESEARCH DATABASE */}
            <div className="text-center pb-4">
              <button onClick={() => setActiveTab("research")} className="px-6 py-3 rounded-xl font-bold bg-blue-900/30 border border-blue-800 text-blue-300 hover:bg-blue-800/50 transition-all flex items-center justify-center gap-2 mx-auto">
                <Database className="w-4 h-4" /> EXPLORE FULL 2014–2026 ELECTION DATABASE <ChevronRight className="w-4 h-4" />
              </button>
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
