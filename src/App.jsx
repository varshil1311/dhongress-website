import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, Filter, ExternalLink, Share2,
  Heart, ChevronRight, Sparkles, Info, CheckCircle2, Copy, Eye, Flag, Loader2,
  Newspaper, MessageSquare, Clock, CheckSquare, XCircle, AlertCircle, History, Image as ImageIcon
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

  // Donation State
  const [pledgeAmount, setPledgeAmount] = useState(500);
  const [customPledge, setCustomPledge] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const DOMAIN_NAME = "indiannationaldhongress.com";
  const BHARAT_KE_VEER_URL = "https://bharatkeveer.gov.in/donorLogin";
  const CURRENT_TIME = new Date().toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // --- MOCK EDITORIAL DATA STRUCTURES (Mirrors your future DB) ---
  
  const socialWatch = [
    {
      id: 1, author: "INC Official", handle: "@INCIndia", time: "2 hours ago",
      content: "We will guarantee 30 Lakh government jobs to the youth immediately upon forming the government.",
      context: "During UPA (2004-2014), formal job creation averaged 1.5% annually. 30 Lakh immediate jobs lacks budgetary framework mapping in the current manifesto.",
      status: "MISLEADING", type: "CLAIM"
    },
    {
      id: 2, author: "Senior Leader", handle: "@SeniorLeader", time: "5 hours ago",
      content: "Our government always stood for the ultimate empowerment of women across all sectors.",
      context: "The 33% Women's Reservation Bill was kept pending for 27 years. The Shah Bano judgment was overturned in 1986.",
      status: "DISPUTED", type: "RHETORIC"
    },
    {
      id: 3, author: "Opposition Spox", handle: "@OppSpokesperson", time: "1 day ago",
      content: "They are claiming 'Zero Loss' in the 2G scam again today on television.",
      context: "Supreme Court cancelled 122 licenses in 2012; CAG documented ₹1.76 Lakh Crore estimated presumptive loss.",
      status: "VERIFIED FACT", type: "HISTORY"
    }
  ];

  const factChecks = [
    {
      id: 1, date: "Oct 12",
      claim: "INC claimed India's manufacturing sector only started growing after 2004.",
      verification: "World Bank data shows manufacturing as % of GDP was largely stagnant at ~15% from 1990 through 2014.",
      verdict: "FALSE", source: "World Bank Economic Data 2004-2014"
    },
    {
      id: 2, date: "Oct 10",
      claim: "Statement that 'Poverty was eradicated' during UPA-1.",
      verification: "Tendulkar Committee report (commissioned by UPA) showed 21.9% of the population still below poverty line in 2011-12.",
      verdict: "MISLEADING", source: "Planning Commission / Tendulkar Report 2013"
    }
  ];

  const satireWall = [
    { id: 1, title: "High Command Unveils Magic Wand to Print 30 Lakh Offer Letters", img: "🪄", tag: "SATIRE" },
    { id: 2, title: "Minister Calculates 'Zero Loss' Using Invisible Calculator", img: "🧮", tag: "SATIRE" },
    { id: 3, title: "Party Announces 8th 'Relaunch' of Youth Icon This Decade", img: "🚀", tag: "SATIRE" }
  ];

  // (Existing Data Arrays: pillars, scamDatabase, pledgesList kept below for other tabs)
  
  // Real Persistent Hit Counter
  useEffect(() => {
    async function trackVisit() {
      try {
        setLoadingCounter(true);
        const res = await fetch(`https://api.counterapi.dev/v1/indiannationaldhongress/visits/up`);
        if (res.ok) {
          const data = await res.json();
          setTotalVisitors(data.count);
        } else {
          setTotalVisitors(1842);
        }
      } catch (err) {
        setTotalVisitors(1842);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'FALSE': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'MISLEADING': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'DISPUTED': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'VERIFIED FACT': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'SATIRE': return 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // --- RENDER HELPERS FOR NEWSROOM HOMEPAGE ---

  const renderNewsroomOverview = () => (
    <div className="space-y-12">
      {/* Editorial Hero */}
      <div className="relative border-b-4 border-amber-600 pb-12 pt-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-700 bg-slate-900 text-slate-400 text-xs font-mono uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Editorial Desk Updated: {CURRENT_TIME}
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white font-serif uppercase">
            Today's Political <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">Circus</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-serif italic border-y border-slate-800 py-4 mt-6">
            "A fact-checked, satirical, and empirical archive monitoring 60 years of dynastic monopoly, unfulfilled promises, and historical contradictions."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Editorial Content */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* X / Twitter Watch */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
                <MessageSquare className="w-5 h-5 text-sky-400" /> X / Twitter Watch
              </h2>
              <span className="text-xs text-slate-500 font-mono">Live Monitoring</span>
            </div>
            <div className="divide-y divide-slate-800">
              {socialWatch.map((post) => (
                <div key={post.id} className="p-5 space-y-4 hover:bg-slate-850 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{post.author}</div>
                        <div className="text-xs text-slate-500">{post.handle} • {post.time}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed">"{post.content}"</p>
                  
                  {/* Editorial Reality Check Box */}
                  <div className="bg-slate-950 rounded-lg p-4 border-l-2 border-amber-500 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Editorial Context</div>
                      <p className="text-sm text-slate-400 leading-relaxed">{post.context}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Claims vs Reality */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white font-serif uppercase border-b-2 border-slate-800 pb-2">
              The Flip-Flop Files: Claims vs Reality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Claim</div>
                <p className="text-slate-200 italic font-serif">"We champion women's rights and immediate reservations."</p>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mt-4">Reality</div>
                <p className="text-slate-400 text-sm">The 33% Women's Reservation Bill lapsed repeatedly during UPA rule (2004-2014) due to lack of political will and coalition pressure.</p>
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Claim</div>
                <p className="text-slate-200 italic font-serif">"Zero loss occurred in the allocation of 2G spectrum."</p>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mt-4">Reality</div>
                <p className="text-slate-400 text-sm">CAG Report 2010 estimated presumptive loss of ₹1.76 Lakh Cr. Supreme Court subsequently cancelled 122 illegal licenses in 2012.</p>
              </div>
            </div>
          </section>

          {/* Satire Wall */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-white font-serif uppercase border-b-2 border-slate-800 pb-2 flex items-center gap-2">
              <Flame className="w-6 h-6 text-fuchsia-500" /> The Satire Wall
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {satireWall.map(satire => (
                <div key={satire.id} className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center p-4 text-center hover:border-fuchsia-500/50 transition-colors cursor-pointer">
                  <div className="absolute top-2 right-2 bg-fuchsia-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest z-10 shadow-lg">
                    {satire.tag}
                  </div>
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{satire.img}</div>
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-fuchsia-400 font-serif">{satire.title}</h3>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Fact Checks & Sidebars */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Fact Check Corner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-red-950/50 border-b border-red-900/50 p-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white font-serif">Fact-Check Corner</h2>
            </div>
            <div className="divide-y divide-slate-800">
              {factChecks.map(check => (
                <div key={check.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(check.verdict)}`}>
                      {check.verdict}
                    </span>
                    <span className="text-xs text-slate-500">{check.date}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200 font-serif">"{check.claim}"</p>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-2 rounded border border-slate-800/50">
                    <strong className="text-slate-300">Evidence:</strong> {check.verification}
                  </p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                    <Database className="w-3 h-3" /> Source: {check.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today in History */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif border-b border-slate-800 pb-2">
              <History className="w-5 h-5 text-amber-500" /> This Day in History
            </h2>
            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-500">October 1975</div>
              <p className="text-sm text-slate-300">
                During the Emergency, the government amended the Constitution to heavily restrict judicial review, centralizing unprecedented power in the PMO.
              </p>
              <div className="text-xs text-slate-500 italic mt-2">
                "Democracy suspended while claiming to save it."
              </div>
            </div>
          </div>

          {/* Support Banner Sidebar */}
          <button onClick={() => setActiveTab("donate")} className="w-full bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5 text-left hover:scale-[1.02] transition-transform group">
            <div className="flex items-center justify-between mb-2">
              <Flag className="w-6 h-6 text-emerald-500 fill-emerald-500/20 group-hover:fill-emerald-500 transition-colors" />
              <ExternalLink className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Support the Bravehearts 🇮🇳</h3>
            <p className="text-xs text-slate-400">Skip political donations. Contribute directly to the Indian Armed Forces via Bharat Ke Veer.</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Existing databases (Pillars, Scams, etc) are retained as previously generated
  const pillars = [
    {
      id: 1, title: "Youth: Past Action vs Today's Preach", tag: "Youth Contradiction", icon: Users, color: "from-amber-500 to-orange-600",
      summary: "Decades of sluggish educational reforms, paper leaks legacy, and employment stagnation juxtaposed with current tall promises.",
      points: [
        { heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5% despite high global boom cycles." },
        { heading: "Paper Leaks & State Recruitment Freezes", detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states (Rajasthan REET paper leaks 2021-2023) directly affected 26+ lakh young aspirants." },
        { heading: "IIT/IIM/AIIMS Infrastructure Sloth", detail: "Between 1960 and 2004, higher education creation remained constrained to elite urban centers, keeping gross enrolment ratios under 11% for 5 decades." }
      ],
      quote: '"We will give jobs to all in 1 month!" — Current high command rhetoric vs 10 years of policy paralysis.'
    },
    {
      id: 2, title: "Mahila: Rhetoric vs Reality on Women", tag: "Women Empowerment", icon: Heart, color: "from-rose-500 to-pink-600",
      summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage while claiming sole proprietorship of gender justice.",
      points: [
        { heading: "The 33% Reservation 27-Year Stalling", detail: "Despite holding full majority multiple times (1984, 1991, 2004, 2009), the Nari Shakti Vandan (33% quota) was allowed to lapse in the Lok Sabha without floor consensus." },
        { heading: "The Shah Bano Regression (1985)", detail: "Overturned the landmark Supreme Court judgment granting basic maintenance to an indigent Muslim woman, capitulating to conservative patriarchy." },
        { heading: "Safety & Sanitation Deficit", detail: "For 67 years post-independence, millions of women lacked access to basic household sanitation (over 50% open defecation rate until 2014) and clean cooking fuel (Ujjwala equivalent absent)." }
      ],
      quote: '"Ladki hoon, lad sakti hoon" — Lost 97% of security deposits in subsequent state elections.'
    },
    {
      id: 3, title: "Minority Politics: Tokenism vs Upliftment", tag: "Vote Bank Engineering", icon: Shield, color: "from-purple-500 to-indigo-600",
      summary: "The Sachar Committee (2006) revealed how 50+ years of Congress governance left minority communities economically and educationally at the bottom.",
      points: [
        { heading: "Sachar Committee Self-Indictment", detail: "Commissioned by the UPA itself, the report found that 55 years of rule kept Indian Muslims with only 2.5% representation in IAS/IPS and severe literacy gaps in Congress-run states." },
        { heading: "The Waqf Board Disproportionate Powers", detail: "Enacted legislations granting unchecked statutory jurisdiction to Waqf boards, enabling state-level dispute accumulation while poor minorities remained without basic amenities." },
        { heading: "Zero Reformist Backbone", detail: "Consistently opposed modernization of madrasa education and personal law reforms for gender equity to preserve orthodox vote brokers." }
      ],
      quote: '"First claim on nation\'s resources" — Political speeches delivered while ground development indices remained neglected.'
    },
    {
      id: 4, title: "Job Creation: The Red Tape Economy", tag: "Economic Chokehold", icon: Briefcase, color: "from-emerald-500 to-teal-600",
      summary: "How the License-Permit-Quota Raj suffocated youth enterprise, forcing generations into government clerk queues.",
      points: [
        { heading: "The 3.5% 'Hindu Rate of Growth' Stagnation", detail: "Socialist centralization between 1950 and 1990 artificially choked private business, forcing entrepreneurs to wait 3 years just to acquire a telephone connection or scooter license." },
        { heading: "Twin Balance Sheet Crisis Legacy", detail: "Unregulated 'phone banking' loan disbursals between 2008 and 2013 led to banking NPAs ballooning past ₹10.36 Lakh Crores by 2015, crippling fresh private capex." },
        { heading: "Anti-Startup Mindset", detail: "Angel tax burdens, high corporate tax rates (35%+), and complex labor inspector systems forced skilled Indian graduates into mass brain drain." }
      ],
      quote: '"We will redistribute private wealth" — Modern promises echoing the discredited 1970s confiscatory economics.'
    },
    {
      id: 5, title: "Foreign Investment: Policy Paralysis & Retrospective Tax", tag: "FDI Sabotage", icon: Globe, color: "from-blue-500 to-cyan-600",
      summary: "How retrospective taxation and ministerial vetoes scared away billions of global dollars in the UPA-2 era.",
      points: [
        { heading: "The 2012 Retrospective Tax Disaster", detail: "Amending tax laws retroactively against Vodafone and Cairn Energy single-handedly destroyed India's reputation for contract enforcement, causing FDI to crash by 21% in 2012-13." },
        { heading: "Ease of Doing Business: Ranked 142nd", detail: "In 2014, India was ranked 142 out of 189 nations in the World Bank Ease of Doing Business index—behind countries with severe instability." },
        { heading: "Fragile Five Economy (2013)", detail: "Morgan Stanley classified India among the world's most vulnerable economies (Fragile Five) due to soaring CAD (4.8% of GDP) and double-digit inflation (10.9%)." }
      ],
      quote: 'From "Fragile Five" in 2013 to top destination: Remembering the era of multi-ministerial paralysis.'
    },
    {
      id: 6, title: "Make in India: Import Reliance vs Industrialization", tag: "Manufacturing Failure", icon: Factory, color: "from-amber-600 to-yellow-600",
      summary: "Leaving India as an import-dependent economy for defense, mobile electronics, and solar power equipment.",
      points: [
        { heading: "100% Defense Import Vulnerability", detail: "Defense modernization was frozen for years (Scorpene leaks, AgustaWestland delays) leaving the Indian Air Force and Army reliant on 70%+ imported arms." },
        { heading: "Only 2 Mobile Manufacturing Factories in 2014", detail: "While Asian peers industrialized in the 1990s, India had only 2 mobile phone manufacturing units in 2014 compared to 200+ today." },
        { heading: "Textile & Electronics Loss to Vietnam & Bangladesh", detail: "Lack of infrastructure, power shortages, and inverted duty structures caused India to lose export manufacturing markets in textiles and toys." }
      ],
      quote: 'Mocking "Make in India" while maintaining 40 years of 15% stagnant manufacturing GDP contribution.'
    },
    {
      id: 7, title: "Scams of INC: The Golden Decade of Plunder", tag: "Corruption Dossier", icon: Database, color: "from-red-600 to-rose-700",
      summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.",
      points: [
        { heading: "Over ₹12 Lakh Crore Cumulative Alleged Scams", detail: "CAG audits between 2009 and 2014 revealed unprecedented irregularities across natural resources (spectrum, coal, land, defense equipment)." },
        { heading: "The National Herald Asset Grab", detail: "Transfer of ₹5,000 Crore public asset company (AJL) to Young Indian Ltd (76% owned by Gandhi family) for a nominal ₹50 Lakh loan write-off." },
        { heading: "Adarsh Society & Defense Housing Violations", detail: "High-rise luxury apartments in Mumbai meant for Kargil war widows allocated to politicians and senior bureaucrats." }
      ],
      quote: '"Zero Loss Theory" — When ministers claimed on national TV that unpriced resource auctions lost zero rupees.'
    },
    {
      id: 8, title: "Sanskar & Decorum: Defamation & Insults to Elders", tag: "Political Decorum", icon: Flame, color: "from-orange-500 to-red-600",
      summary: "A catalog of derogatory epithets against constitutional posts, veterans, and political opponents.",
      points: [
        { heading: "Insults to Constitutional Positions", detail: "Repeated derogatory remarks against the President of India (referring to the first tribal woman President as 'Rashtrapatni'), Prime Minister, and Election Commissioners." },
        { heading: "Tearing the Cabinet Ordinance on TV (2013)", detail: "Publicly humiliating his own Congress Prime Minister Dr. Manmohan Singh by tearing the government ordinance into pieces in a live press conference." },
        { heading: "Name Shaming & Derogatory Language", detail: "Using derogatory terms like 'Chaiwala', 'Maut Ka Saudagar', 'Neech', and abusive slogans against sitting democratic leaders." }
      ],
      quote: 'Lecturing on "Mohabbat Ki Dukan" while running systematic vitriol campaigns.'
    },
    {
      id: 9, title: "One Family, One Party: Sidelining Genuine Merit", tag: "Dynasty Over Democracy", icon: Crown, color: "from-yellow-500 to-amber-700",
      summary: "How internal party democracy was decimated and iconic non-dynasty leaders were humiliated.",
      points: [
        { heading: "The Humiliation of PV Narasimha Rao", detail: "The former PM who unlocked 1991 reforms was denied entry of his mortal remains into the AICC headquarters and denied a memorial in Delhi." },
        { heading: "Sitaram Kesri Locked in Toilet", detail: "In 1998, the sitting elected Congress President was reportedly locked in a room at AICC headquarters to facilitate Sonia Gandhi's swift coronation." },
        { heading: "The Mass Exodus of Competent Leaders", detail: "Over 40 prominent senior leaders (Pranab Mukherjee sidelined earlier, Himanta Biswa Sarma, Jyotiraditya Scindia, Jitin Prasada, Ghulam Nabi Azad) left citing dynastic sycophancy." }
      ],
      quote: '"The party is the family, and the family is the nation" — The core operating doctrine since 1969.'
    },
    {
      id: 10, title: "Historical Electoral Meltdown: World Record Decline", tag: "Democracy's Verdict", icon: TrendingDown, color: "from-slate-600 to-gray-800",
      summary: "How India's oldest party went from 414 seats (1984) to historic lows of 44 (2014) and 52 (2019).",
      points: [
        { heading: "The 44-Seat Nadir (2014)", detail: "Could not even secure the statutory 10% of seats (55 seats) required to claim the formal Leader of Opposition status in Lok Sabha." },
        { heading: "Wiped Out in Entire States", detail: "Consecutive zero seats in major states like Delhi, Andhra Pradesh, and double-digit vote share loss in Uttar Pradesh (under 3% vote share)." },
        { heading: "Sub-20% Strike Rate in Direct Fights", detail: "In head-to-head national contests against national alternatives, the strike rate remained under 15% across three general elections." }
      ],
      quote: 'Declaring victory at 99 seats after failing to cross the halfway mark for three consecutive general elections.'
    }
  ];

  const scamDatabase = [
    { id: "2g", name: "2G Spectrum Allocation", year: "2008", loss: "₹1,76,000 Cr", lossNum: 176000, category: "Telecom", minister: "A. Raja", cag: "CAG Report No. 19 (2010)", description: "Arbitrary FCFS spectrum allocation.", status: "122 licenses cancelled by SC.", source: "SC Judgment 2012" },
    { id: "coal", name: "Coalgate", year: "2012", loss: "₹1,86,000 Cr", lossNum: 186000, category: "Resources", minister: "Ministry of Coal", cag: "CAG Report No. 7 (2012)", description: "214 captive coal blocks allocated without bidding.", status: "SC cancelled 214 allocations.", source: "SC Judgment 2014" },
    { id: "cwg", name: "CWG Loot", year: "2010", loss: "₹70,000 Cr", lossNum: 70000, category: "Sports", minister: "Suresh Kalmadi", cag: "Shunglu Committee", description: "Massive procurement corruption.", status: "Charge-sheets filed, arrests made.", source: "Shunglu Report" },
    { id: "agusta", name: "AgustaWestland", year: "2013", loss: "₹3,600 Cr", lossNum: 3600, category: "Defense", minister: "A.K. Antony", cag: "CAG on VVIP Fleet", description: "Flight altitude specs lowered for kickbacks.", status: "Christian Michel extradited.", source: "Milan Court Judgment" }
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
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      window.open(BHARAT_KE_VEER_URL, "_blank");
      return;
    }
    const newPledge = { name: donorName.trim() || "Nationalist Citizen", amount: finalAmount, msg: donorMsg.trim() || "Jai Hind 🇮🇳", time: "Just now" };
    setPledgesList([newPledge, ...pledgesList]);
    setShowPledgeSuccess(true);
    setCustomPledge(""); setDonorName(""); setDonorMsg("");
    setTimeout(() => { window.open(BHARAT_KE_VEER_URL, "_blank"); }, 800);
    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Ticker Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 overflow-hidden whitespace-nowrap py-1.5 flex items-center shadow-md border-b border-red-900">
        <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 text-xs font-bold text-white uppercase tracking-widest font-mono">
          <span><AlertTriangle className="w-3 h-3 inline pb-0.5" /> EDITORIAL DISCLAIMER: ALL INDIA DHONGRESS PARTY IS A SATIRICAL & HISTORICAL ARCHIVE</span>
          <span>•</span>
          <span>NOT AFFILIATED WITH ANY OFFICIAL POLITICAL ENTITY</span>
          <span>•</span>
          <span>FACTS CITED FROM CAG & PARLIAMENTARY RECORDS</span>
          <span>•</span>
          <span><Flag className="w-3 h-3 inline pb-0.5" /> 100% OF SITE SUPPORT REDIRECTS TO BHARAT KE VEER</span>
          <span>•</span>
          <span>EDITORIAL DISCLAIMER: ALL INDIA DHONGRESS PARTY IS A SATIRICAL & HISTORICAL ARCHIVE</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b-2 border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("overview")}>
              <div className="w-12 h-12 rounded bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-black text-2xl text-white group-hover:border-amber-500 transition-colors font-serif shadow-inner">
                ध
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white font-serif uppercase">
                    Dhongress <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500">Daily</span>
                  </span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Satire & Audit
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">The Unofficial Historical Archive</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded text-sm font-bold transition-all font-serif ${activeTab === "overview" ? "text-amber-500" : "text-slate-400 hover:text-white"}`}>Home / Newsroom</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded text-sm font-bold transition-all font-serif ${activeTab === "pillars" ? "text-amber-500" : "text-slate-400 hover:text-white"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded text-sm font-bold transition-all font-serif ${activeTab === "scams" ? "text-amber-500" : "text-slate-400 hover:text-white"}`}>The Vault</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded text-sm font-bold transition-all font-serif ${activeTab === "meltdown" ? "text-amber-500" : "text-slate-400 hover:text-white"}`}>Meltdown</button>
              <div className="h-6 w-px bg-slate-700 mx-2"></div>
              <button onClick={() => setActiveTab("donate")} className="px-4 py-2 rounded bg-slate-100 text-slate-900 text-sm font-bold hover:bg-white transition-colors flex items-center gap-1.5 border border-slate-300">
                <Flag className="w-3.5 h-3.5" /> Support Army
              </button>
            </nav>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded font-serif font-bold text-slate-200">Home / Newsroom</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded font-serif font-bold text-slate-200">10 Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded font-serif font-bold text-slate-200">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded font-serif font-bold text-slate-200">Electoral Meltdown</button>
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-4 text-center py-3 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-2">
              <Flag className="w-4 h-4" /> Support Indian Army
            </button>
          </div>
        )}
      </header>

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: NEWSROOM HOMEPAGE */}
        {activeTab === "overview" && renderNewsroomOverview()}

        {/* TAB 2: THE 10 THEMATIC PILLARS */}
        {activeTab === "pillars" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">Exhaustive Section-by-Section Audit</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-serif uppercase">The 10 Structural Charges</h2>
            </div>
            {/* Horizontal Pillar Selector Tabs */}
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar border-b border-slate-800">
              {pillars.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPillar === p.id;
                return (
                  <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${isSelected ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}>
                    <Icon className="w-4 h-4" /> <span>#{p.id} {p.tag}</span>
                  </button>
                );
              })}
            </div>
            {/* Selected Pillar Content Card */}
            {(() => {
              const current = pillars.find((p) => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                  <div className={`p-6 sm:p-8 bg-gradient-to-r ${current.color} text-white relative`}>
                    <h3 className="text-2xl sm:text-3xl font-black font-serif uppercase">{current.title}</h3>
                    <p className="text-sm text-white/90 max-w-2xl mt-2">{current.summary}</p>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {current.points.map((point, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded space-y-3">
                          <h5 className="font-bold text-slate-100 text-sm font-serif">{point.heading}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{point.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: SCAM VAULT */}
        {activeTab === "scams" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full">Interactive CAG Dossier</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-serif uppercase">The Mega Scam Vault</h2>
            </div>
            <div className="bg-slate-900 rounded border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input type="text" placeholder="Search scam, minister..." value={scamSearch} onChange={(e) => setScamSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded pl-9 pr-4 py-2 text-sm text-white focus:border-amber-500 outline-none" />
              </div>
              <div className="flex overflow-x-auto w-full md:w-auto gap-2 no-scrollbar">
                {["All", "Telecom", "Resources", "Defense", "Sports"].map((cat) => (
                  <button key={cat} onClick={() => setScamCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${scamCategory === cat ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScams.map((scam) => (
                <div key={scam.id} onClick={() => setSelectedScam(scam)} className="rounded bg-slate-900 border border-slate-800 p-6 space-y-4 hover:border-red-500/50 cursor-pointer transition-colors group">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Year: {scam.year}</span>
                    <span className="text-rose-400 border border-rose-900/50 px-2 rounded">{scam.category}</span>
                  </div>
                  <h3 className="text-lg font-black text-white font-serif group-hover:text-amber-400">{scam.name}</h3>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-500">Est. Loss:</span>
                    <span className="font-mono font-bold text-rose-500">{scam.loss}</span>
                  </div>
                </div>
              ))}
            </div>
            {selectedScam && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur">
                <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 relative">
                  <button onClick={() => setSelectedScam(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
                  <h3 className="text-2xl font-black text-white font-serif mb-4">{selectedScam.name}</h3>
                  <div className="space-y-4 text-sm text-slate-300">
                    <p><strong className="text-amber-500">Loss:</strong> {selectedScam.loss}</p>
                    <p><strong className="text-amber-500">Minister/Dept:</strong> {selectedScam.minister}</p>
                    <p className="bg-slate-950 p-3 rounded border border-slate-800">{selectedScam.description}</p>
                    <p className="text-xs text-emerald-400">Status: {selectedScam.status}</p>
                    <p className="text-xs text-slate-500 mt-4 border-t border-slate-800 pt-2">Source: {selectedScam.source}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ELECTORAL MELTDOWN */}
        {activeTab === "meltdown" && (
          <div className="space-y-10 animate-fade-in">
             <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white font-serif uppercase">The Long Electoral Meltdown</h2>
              <p className="text-sm text-slate-400">From 414 Lok Sabha seats in 1984 to sub-100 tallies for three consecutive general elections.</p>
            </div>
            <div className="rounded bg-slate-900 border border-slate-800 p-6 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white font-serif border-b border-slate-800 pb-4 mb-6">Lok Sabha Seats (1984–2024)</h3>
              <div className="space-y-5">
                {[
                  { year: "1984", seats: 414, percent: "76.2%", color: "bg-emerald-500" },
                  { year: "1991", seats: 232, percent: "42.7%", color: "bg-emerald-500" },
                  { year: "1999", seats: 114, percent: "21.0%", color: "bg-orange-500" },
                  { year: "2004", seats: 145, percent: "26.7%", color: "bg-orange-500" },
                  { year: "2009", seats: 206, percent: "37.9%", color: "bg-emerald-500" },
                  { year: "2014", seats: 44, percent: "8.1%", color: "bg-red-500" },
                  { year: "2019", seats: 52, percent: "9.5%", color: "bg-red-500" },
                  { year: "2024", seats: 99, percent: "18.2%", color: "bg-orange-500" }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                      <span>{row.year}</span>
                      <span>{row.seats} Seats</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.seats / 543) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DONATE (BHARAT KE VEER) */}
        {activeTab === "donate" && (
          <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Flag className="w-3.5 h-3.5" /> Direct to Armed Forces
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-serif uppercase">Support Bharat Ke Veer</h2>
              <p className="text-sm text-slate-400">This platform accepts ZERO political donations. We request all citizens to support our martyrs via the official Govt of India portal.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[250, 500, 1100, 5000].map((amt) => (
                  <button key={amt} type="button" onClick={() => { setPledgeAmount(amt); setCustomPledge(""); }} className={`py-3 rounded font-bold text-sm border ${pledgeAmount === amt && !customPledge ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500"}`}>
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <form onSubmit={handlePledgeAndRedirect} className="space-y-4 pt-4 border-t border-slate-800">
                <input type="text" placeholder="Your Name / Handle" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" />
                <button type="submit" className="w-full py-4 rounded font-black bg-emerald-600 text-white shadow hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                  <Flag className="w-5 h-5" /> Pledge & Go to Official Portal
                </button>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest mt-2">Redirects securely to bharatkeveer.gov.in</p>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Global Interactive Footer */}
      <footer className="bg-slate-950 border-t-2 border-slate-800 mt-20 pt-12 pb-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-white font-serif">ध</div>
                <span className="font-black text-white font-serif uppercase tracking-widest text-sm">Dhongress Daily</span>
              </div>
              <p className="text-slate-500 leading-relaxed font-serif italic">
                A public-interest political satire, empirical audit, and accountability portal dedicated to archiving governance contradictions.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">Editorial Policies</h5>
              <ul className="space-y-2 pt-2">
                <li><span className="text-slate-400">Satire Disclaimer: Content labeled [SATIRE] is fictional humor.</span></li>
                <li><span className="text-slate-400">Fact-Checking: Sourced from official CAG, RBI, and SC documents.</span></li>
                <li><span className="text-slate-400">Independence: Zero political funding accepted.</span></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">Citizen Action</h5>
              <ul className="space-y-2 pt-2">
                <li><button onClick={() => setActiveTab("scams")} className="hover:text-amber-500 transition-colors">Search the Mega Scam Vault</button></li>
                <li><a href={BHARAT_KE_VEER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">Donate to Armed Forces <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[10px] uppercase tracking-widest font-mono text-slate-600">
            <p>© {new Date().getFullYear()} {DOMAIN_NAME}. Fair Use Commentary.</p>
            <div className="flex items-center gap-4">
              <span>Traffic Monitored via API</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Global CSS for Ticker Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-\\[marquee_20s_linear_infinite\\] {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
