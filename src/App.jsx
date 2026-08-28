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
  Filter,
  ExternalLink,
  Share2,
  Heart,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  DollarSign,
  PieChart,
  Activity,
  Menu,
  X,
  Award,
  BookOpen,
  Send,
  Eye,
  Flag
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPillar, setSelectedPillar] = useState(1);
  const [scamSearch, setScamSearch] = useState("");
  const [scamCategory, setScamCategory] = useState("All");
  const [selectedScam, setSelectedScam] = useState(null);
  const [liveVisitors, setLiveVisitors] = useState(1428940);
  const [dailyVisits, setDailyVisits] = useState(48219);
  const [pledgeAmount, setPledgeAmount] = useState(500);
  const [customPledge, setCustomPledge] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMsg, setDonorMsg] = useState("");
  const [pledgesList, setPledgesList] = useState([
    { name: "Rahul S.", amount: 1000, msg: "Proud to support Bharat Ke Veer instead of political funds! Jai Hind 🇮🇳", time: "2 mins ago" },
    { name: "Ananya M.", amount: 500, msg: "All contributions directly to our martyrs & soldiers.", time: "14 mins ago" },
    { name: "Vikas P.", amount: 2100, msg: "True patriotism is supporting the Indian Army. Donated on official portal!", time: "1 hour ago" },
    { name: "Siddharth D.", amount: 250, msg: "Salute to the Bravehearts of Bharat!", time: "3 hours ago" }
  ]);
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const BHARAT_KE_VEER_URL = "https://bharatkeveer.gov.in/donorLogin";

  // Live Counter Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => prev + Math.floor(Math.random() * 5) + 1);
      setDailyVisits((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
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
        {
          heading: "The 60-Year Jobless Paradigm",
          detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5% despite high global boom cycles."
        },
        {
          heading: "Paper Leaks & State Recruitment Freezes",
          detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states (Rajasthan REET paper leaks 2021-2023) directly affected 26+ lakh young aspirants."
        },
        {
          heading: "IIT/IIM/AIIMS Infrastructure Sloth",
          detail: "Between 1960 and 2004, higher education creation remained constrained to elite urban centers, keeping gross enrolment ratios under 11% for 5 decades."
        }
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
        {
          heading: "The 33% Reservation 27-Year Stalling",
          detail: "Despite holding full majority multiple times (1984, 1991, 2004, 2009), the Nari Shakti Vandan (33% quota) was allowed to lapse in the Lok Sabha without floor consensus."
        },
        {
          heading: "The Shah Bano Regression (1985)",
          detail: "Overturned the landmark Supreme Court judgment granting basic maintenance to an indigent Muslim woman, capitulating to conservative patriarchy."
        },
        {
          heading: "Safety & Sanitation Deficit",
          detail: "For 67 years post-independence, millions of women lacked access to basic household sanitation (over 50% open defecation rate until 2014) and clean cooking fuel (Ujjwala equivalent absent)."
        }
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
        {
          heading: "Sachar Committee Self-Indictment",
          detail: "Commissioned by the UPA itself, the report found that 55 years of rule kept Indian Muslims with only 2.5% representation in IAS/IPS and severe literacy gaps in Congress-run states."
        },
        {
          heading: "The Waqf Board Disproportionate Powers",
          detail: "Enacted legislations granting unchecked statutory jurisdiction to Waqf boards, enabling state-level dispute accumulation while poor minorities remained without basic amenities."
        },
        {
          heading: "Zero Reformist Backbone",
          detail: "Consistently opposed modernization of madrasa education and personal law reforms for gender equity to preserve orthodox vote brokers."
        }
      ],
      quote: '"First claim on nation\'s resources" — Political speeches delivered while ground development indices remained neglected.'
    },
    {
      id: 4,
      title: "Job Creation: The Red Tape Economy",
      tag: "Economic Chokehold",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-600",
      summary: "How the License-Permit-Quota Raj suffocated youth enterprise, forcing generations into government clerk queues.",
      points: [
        {
          heading: "The 3.5% 'Hindu Rate of Growth' Stagnation",
          detail: "Socialist centralization between 1950 and 1990 artificially choked private business, forcing entrepreneurs to wait 3 years just to acquire a telephone connection or scooter license."
        },
        {
          heading: "Twin Balance Sheet Crisis Legacy",
          detail: "Unregulated 'phone banking' loan disbursals between 2008 and 2013 led to banking NPAs ballooning past ₹10.36 Lakh Crores by 2015, crippling fresh private capex."
        },
        {
          heading: "Anti-Startup Mindset",
          detail: "Angel tax burdens, high corporate tax rates (35%+), and complex labor inspector systems forced skilled Indian graduates into mass brain drain."
        }
      ],
      quote: '"We will redistribute private wealth" — Modern promises echoing the discredited 1970s confiscatory economics.'
    },
    {
      id: 5,
      title: "Foreign Investment: Policy Paralysis & Retrospective Tax",
      tag: "FDI Sabotage",
      icon: Globe,
      color: "from-blue-500 to-cyan-600",
      summary: "How retrospective taxation and ministerial vetoes scared away billions of global dollars in the UPA-2 era.",
      points: [
        {
          heading: "The 2012 Retrospective Tax Disaster",
          detail: "Amending tax laws retroactively against Vodafone and Cairn Energy single-handedly destroyed India's reputation for contract enforcement, causing FDI to crash by 21% in 2012-13."
        },
        {
          heading: "Ease of Doing Business: Ranked 142nd",
          detail: "In 2014, India was ranked 142 out of 189 nations in the World Bank Ease of Doing Business index—behind countries with severe instability."
        },
        {
          heading: "Fragile Five Economy (2013)",
          detail: "Morgan Stanley classified India among the world's most vulnerable economies (Fragile Five) due to soaring CAD (4.8% of GDP) and double-digit inflation (10.9%)."
        }
      ],
      quote: 'From "Fragile Five" in 2013 to top destination: Remembering the era of multi-ministerial paralysis.'
    },
    {
      id: 6,
      title: "Make in India: Import Reliance vs Industrialization",
      tag: "Manufacturing Failure",
      icon: Factory,
      color: "from-amber-600 to-yellow-600",
      summary: "Leaving India as an import-dependent economy for defense, mobile electronics, and solar power equipment.",
      points: [
        {
          heading: "100% Defense Import Vulnerability",
          detail: "Defense modernization was frozen for years (Scorpene leaks, AgustaWestland delays) leaving the Indian Air Force and Army reliant on 70%+ imported arms."
        },
        {
          heading: "Only 2 Mobile Manufacturing Factories in 2014",
          detail: "While Asian peers industrialized in the 1990s, India had only 2 mobile phone manufacturing units in 2014 compared to 200+ today."
        },
        {
          heading: "Textile & Electronics Loss to Vietnam & Bangladesh",
          detail: "Lack of infrastructure, power shortages, and inverted duty structures caused India to lose export manufacturing markets in textiles and toys."
        }
      ],
      quote: 'Mocking "Make in India" while maintaining 40 years of 15% stagnant manufacturing GDP contribution.'
    },
    {
      id: 7,
      title: "Scams of INC: The Golden Decade of Plunder",
      tag: "Corruption Dossier",
      icon: Database,
      color: "from-red-600 to-rose-700",
      summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.",
      points: [
        {
          heading: "Over ₹12 Lakh Crore Cumulative Alleged Scams",
          detail: "CAG audits between 2009 and 2014 revealed unprecedented irregularities across natural resources (spectrum, coal, land, defense equipment)."
        },
        {
          heading: "The National Herald Asset Grab",
          detail: "Transfer of ₹5,000 Crore public asset company (AJL) to Young Indian Ltd (76% owned by Gandhi family) for a nominal ₹50 Lakh loan write-off."
        },
        {
          heading: "Adarsh Society & Defense Housing Violations",
          detail: "High-rise luxury apartments in Mumbai meant for Kargil war widows allocated to politicians and senior bureaucrats."
        }
      ],
      quote: '"Zero Loss Theory" — When ministers claimed on national TV that unpriced resource auctions lost zero rupees.'
    },
    {
      id: 8,
      title: "Sanskar & Decorum: Defamation & Insults to Elders",
      tag: "Political Decorum",
      icon: Flame,
      color: "from-orange-500 to-red-600",
      summary: "A catalog of derogatory epithets against constitutional posts, veterans, and political opponents.",
      points: [
        {
          heading: "Insults to Constitutional Positions",
          detail: "Repeated derogatory remarks against the President of India (referring to the first tribal woman President as 'Rashtrapatni'), Prime Minister, and Election Commissioners."
        },
        {
          heading: "Tearing the Cabinet Ordinance on TV (2013)",
          detail: "Publicly humiliating his own Congress Prime Minister Dr. Manmohan Singh by tearing the government ordinance into pieces in a live press conference."
        },
        {
          heading: "Name Shaming & Derogatory Language",
          detail: "Using derogatory terms like 'Chaiwala', 'Maut Ka Saudagar', 'Neech', and abusive slogans against sitting democratic leaders."
        }
      ],
      quote: 'Lecturing on "Mohabbat Ki Dukan" while running systematic vitriol campaigns.'
    },
    {
      id: 9,
      title: "One Family, One Party: Sidelining Genuine Merit",
      tag: "Dynasty Over Democracy",
      icon: Crown,
      color: "from-yellow-500 to-amber-700",
      summary: "How internal party democracy was decimated and iconic non-dynasty leaders were humiliated.",
      points: [
        {
          heading: "The Humiliation of PV Narasimha Rao",
          detail: "The former PM who unlocked 1991 reforms was denied entry of his mortal remains into the AICC headquarters and denied a memorial in Delhi."
        },
        {
          heading: "Sitaram Kesri Locked in Toilet",
          detail: "In 1998, the sitting elected Congress President was reportedly locked in a room at AICC headquarters to facilitate Sonia Gandhi's swift coronation."
        },
        {
          heading: "The Mass Exodus of Competent Leaders",
          detail: "Over 40 prominent senior leaders (Pranab Mukherjee sidelined earlier, Himanta Biswa Sarma, Jyotiraditya Scindia, Jitin Prasada, Ghulam Nabi Azad) left citing dynastic sycophancy."
        }
      ],
      quote: '"The party is the family, and the family is the nation" — The core operating doctrine since 1969.'
    },
    {
      id: 10,
      title: "Historical Electoral Meltdown: World Record Decline",
      tag: "Democracy's Verdict",
      icon: TrendingDown,
      color: "from-slate-600 to-gray-800",
      summary: "How India's oldest party went from 414 seats (1984) to historic lows of 44 (2014) and 52 (2019).",
      points: [
        {
          heading: "The 44-Seat Nadir (2014)",
          detail: "Could not even secure the statutory 10% of seats (55 seats) required to claim the formal Leader of Opposition status in Lok Sabha."
        },
        {
          heading: "Wiped Out in Entire States",
          detail: "Consecutive zero seats in major states like Delhi, Andhra Pradesh, and double-digit vote share loss in Uttar Pradesh (under 3% vote share)."
        },
        {
          heading: "Sub-20% Strike Rate in Direct Fights",
          detail: "In head-to-head national contests against national alternatives, the strike rate remained under 15% across three general elections."
        }
      ],
      quote: 'Declaring victory at 99 seats after failing to cross the halfway mark for three consecutive general elections.'
    }
  ];

  // Comprehensive Scam Vault Database
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
    },
    {
      id: "bofors",
      name: "Bofors Howitzer Kickbacks",
      year: "1987",
      loss: "₹64 Cr (1987 value)",
      lossNum: 6400,
      category: "Defense",
      minister: "Rajiv Gandhi Administration",
      cag: "Swedish National Audit Bureau 1987",
      description: "Allegations of $9.9 million in secret kickbacks to middlemen (Ottavio Quattrocchi) for purchasing 410 field howitzer guns.",
      status: "Quattrocchi bank accounts defrozen in London (2006) during UPA rule; remains the benchmark defense kickback scandal.",
      source: "Dagens Eko Swedish Radio Exposé 1987"
    },
    {
      id: "agusta",
      name: "AgustaWestland VVIP Chopper Deal",
      year: "2013",
      loss: "₹3,600 Cr",
      lossNum: 3600,
      category: "Defense",
      minister: "A.K. Antony / UPA-2",
      cag: "CAG Report on VVIP Fleet Modernization",
      description: "Service ceiling flight altitude lowered from 6,000m to 4,500m to specifically qualify AW101 helicopters in exchange for kickbacks to middlemen.",
      status: "Christian Michel extradited from UAE in 2018; case under active CBI & ED special court trials.",
      source: "Milan Court of Appeals Judgment (Italy) 2016"
    },
    {
      id: "nh",
      name: "National Herald Property Grab",
      year: "2012",
      loss: "₹5,000 Cr Assets",
      lossNum: 5000,
      category: "Land & Real Estate",
      minister: "Sonia Gandhi / Rahul Gandhi",
      cag: "PMLA Proceedings & Income Tax Orders",
      description: "Young Indian Ltd (family-owned 76% entity) acquired ₹5,000 Crore prime real estate of Associated Journals Ltd for just ₹50 Lakhs.",
      status: "Sonia & Rahul Gandhi out on ₹50,000 bail; ED attached ₹751 Cr assets in Nov 2023.",
      source: "Delhi High Court (2015) & Supreme Court of India"
    },
    {
      id: "adarsh",
      name: "Adarsh Housing Society Scam",
      year: "2010",
      loss: "₹2,000 Cr",
      lossNum: 2000,
      category: "Land & Defense",
      minister: "Ashok Chavan (Ex-CM Maharashtra)",
      cag: "CAG Special Audit (Defense Land)",
      description: "A 31-storey building in Mumbai's prime Colaba zone meant for Kargil war widows allotted to politicians, bureaucrats, and military top brass.",
      status: "Chief Minister resigned; environment clearances revoked; building ordered demolished by Bombay High Court.",
      source: "Justice J.A. Patil Commission of Inquiry Report"
    },
    {
      id: "airindia",
      name: "Air India Fleet & Route Surrender",
      year: "2005-2010",
      loss: "₹67,000 Cr",
      lossNum: 67000,
      category: "Aviation",
      minister: "Praful Patel / UPA",
      cag: "CAG Report No. 18 of 2011-12",
      description: "Ordering 111 new aircraft worth ₹67,000 Cr for a cash-strapped national carrier while systematically surrendering profitable Gulf routes to private airlines.",
      status: "CBI registered multiple FIRs on fleet acquisition and bilateral seat-sharing manipulations.",
      source: "CAG Civil Aviation Audit 2011"
    },
    {
      id: "antrix",
      name: "Antrix-Devas S-Band Spectrum Deal",
      year: "2005",
      loss: "₹15,000 Cr",
      lossNum: 15000,
      category: "Space & Telecom",
      minister: "PMO / Dept of Space (UPA)",
      cag: "High Level Review Team 2011",
      description: "Leasing 70 MHz of rare S-band military spectrum to private startup Devas Multimedia for nominal ₹1,000 Cr without cabinet approval.",
      status: "Cabinet cancelled deal in 2011; NCLAT and Supreme Court upheld liquidation of Devas on grounds of fraud (2022).",
      source: "Supreme Court Judgment Devas Multimedia (2022)"
    }
  ];

  // Filtered Scams
  const filteredScams = useMemo(() => {
    return scamDatabase.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(scamSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(scamSearch.toLowerCase()) ||
        s.minister.toLowerCase().includes(scamSearch.toLowerCase());
      const matchesCategory = scamCategory === "All" || s.category === scamCategory;
      return matchesSearch && matchesCategory;
    });
  }, [scamSearch, scamCategory]);

  // Total estimated loss
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

    // Open Official Bharat Ke Veer Portal in new tab
    setTimeout(() => {
      window.open(BHARAT_KE_VEER_URL, "_blank");
    }, 600);

    setTimeout(() => setShowPledgeSuccess(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-center text-white flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 animate-spin text-yellow-200" />
        <span>SATIRICAL ARCHIVE & HISTORICAL AUDIT: Documenting Promises vs Ground Reality (1947–2024)</span>
        <span className="hidden sm:inline bg-black/30 px-2 py-0.5 rounded text-xs font-mono">Domain: allindiadhongressparty.com</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-300/30">
                <span>ध</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                    ALL INDIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">DHONGRESS</span> PARTY
                  </span>
                  <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Satire & Audit
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Archive of Contradictions, Scams & Dynastic Politics</p>
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
                Overview
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
                onClick={() => setActiveTab("meltdown")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "meltdown" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Electoral Meltdown
              </button>
              <button
                onClick={() => setActiveTab("donate")}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4 fill-slate-950" /> Donate to Indian Army (Bharat Ke Veer)
              </button>
            </nav>

            {/* Mobile menu trigger */}
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Overview
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
              onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Electoral Meltdown
            </button>
            <button
              onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }}
              className="w-full mt-2 text-center py-2.5 rounded-lg font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4 fill-slate-950" /> Donate to Indian Army (Bharat Ke Veer)
            </button>
          </div>
        )}
      </header>

      {/* Real-time Dynamic Metrics Ticker Bar */}
      <section className="bg-slate-900 border-b border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white">Live Total Reach:</span>
              <span className="font-mono font-bold text-amber-400 text-base tracking-wider">
                {liveVisitors.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 border-l border-slate-700 pl-4 hidden sm:flex">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Daily Citizen Visits:</span>
              <span className="font-mono font-bold text-cyan-300">{dailyVisits.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 border-l border-slate-700 pl-4 hidden lg:flex">
              <Database className="w-4 h-4 text-rose-400" />
              <span>CAG & Court Documented Plunder:</span>
              <span className="font-mono font-bold text-rose-400">₹{totalScamLossEstimate.toLocaleString()} Cr+</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">Updated Daily</span>
            <button
              onClick={() => copyToClipboard(window.location.href || "https://allindiadhongressparty.com")}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedText || "Share Link"}
            </button>
          </div>
        </div>
      </section>

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* VIEW 1: OVERVIEW HERO */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  THE DEFINITIVE CHRONICLE OF HYPOCRISY & GOVERNANCE FAILS
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Demanding in Opposition What They{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                    Destroyed in Power.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Welcome to <strong>allindiadhongressparty.com</strong>. A fact-checked, satirical and empirical exposure of 60 years of dynastic monopoly, ₹12+ Lakh Crore scam history, anti-women legislations, and economic stagnation.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab("pillars")}
                    className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Explore The 10 Charges <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("scams")}
                    className="px-6 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-red-400" /> Search Scam Dossier
                  </button>
                  <button
                    onClick={() => setActiveTab("donate")}
                    className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4 fill-slate-950" /> Donate to Armed Forces
                  </button>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
                <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">60+ Years</div>
                  <div className="text-xs text-slate-400 mt-1">Direct Power Monopolized</div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl md:text-3xl font-black text-rose-500 font-mono">₹12 Lakh Cr</div>
                  <div className="text-xs text-slate-400 mt-1">CAG Audited Irregularities</div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">44 Seats</div>
                  <div className="text-xs text-slate-400 mt-1">Historic 2014 Lok Sabha Crash</div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">1 Family</div>
                  <div className="text-xs text-slate-400 mt-1">6 Generations of Control</div>
                </div>
              </div>
            </div>

            {/* Quick Teaser Grid for 10 Pillars */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">The 10 Thematic Pillars of Deception</h2>
                  <p className="text-sm text-slate-400">Click on any section to examine documented data, quotes, and audit references.</p>
                </div>
                <button
                  onClick={() => setActiveTab("pillars")}
                  className="text-xs md:text-sm text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View All 10 In-Depth <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pillars.slice(0, 6).map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.id}
                      onClick={() => {
                        setSelectedPillar(pillar.id);
                        setActiveTab("pillars");
                      }}
                      className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-amber-500/50 hover:bg-slate-850 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          Charge #{pillar.id}
                        </span>
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${pillar.color} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {pillar.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>Read Full Audit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Satire vs Fact Comparison Feature */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Classic "Dhongress" Contradiction Cards</h3>
                  <p className="text-xs text-slate-400">Comparing What Was Done During 60 Years in Power vs What Is Demanded in Opposition</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wide bg-red-950/50 px-2 py-0.5 rounded">In Power (1947–2014)</span>
                    <span className="text-xs text-slate-500 font-mono">The Reality</span>
                  </div>
                  <p className="text-sm text-slate-300 italic">
                    "Held Women's 33% Reservation bill hostage for 27 years, overturned Shah Bano judgment to appease orthodoxy, and kept open defecation above 50%."
                  </p>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400" /> Source: Parliamentary Records & Census 2011
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide bg-amber-950/50 px-2 py-0.5 rounded">In Opposition (Current)</span>
                    <span className="text-xs text-slate-500 font-mono">The Slogan</span>
                  </div>
                  <p className="text-sm text-slate-300 italic">
                    "Preaches 'Ladki Hoon Lad Sakti Hoon', promises ₹1 Lakh cash transfers in one click without budgetary allocation, and attacks Nari Shakti Vandan Act on implementation dates."
                  </p>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Manifesto & Rally Speeches
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: THE 10 THEMATIC PILLARS */}
        {activeTab === "pillars" && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
                Exhaustive Section-by-Section Audit
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The 10 Structural Charges</h2>
              <p className="text-sm text-slate-400">
                Detailed breakdowns analyzing the performance of India's oldest political dynasty across societal groups and national governance metrics.
              </p>
            </div>

            {/* Horizontal Pillar Selector Tabs */}
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

            {/* Selected Pillar Content Card */}
            {(() => {
              const current = pillars.find((p) => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                  {/* Card Header */}
                  <div className={`p-6 sm:p-8 bg-gradient-to-r ${current.color} text-white relative`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1 rounded-full text-xs font-mono">
                          <span>CHARGE PILLAR #{current.id} OF 10</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{current.title}</h3>
                        <p className="text-sm text-white/90 max-w-2xl">{current.summary}</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-inner">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" /> Empirical Evidence & Historical Timeline
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {current.points.map((point, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <h5 className="font-bold text-slate-100 text-sm">{point.heading}</h5>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{point.detail}</p>
                        </div>
                      ))}
                    </div>

                    {/* Satirical Highlight Banner */}
                    <div className="rounded-2xl bg-slate-950/80 border-l-4 border-amber-500 p-5 flex items-start gap-4">
                      <Flame className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Satirical Reality Check</span>
                        <p className="text-sm font-medium text-slate-200 italic">{current.quote}</p>
                      </div>
                    </div>

                    {/* Quick navigation to next/prev */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        disabled={selectedPillar === 1}
                        onClick={() => setSelectedPillar((prev) => Math.max(1, prev - 1))}
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-all text-slate-300"
                      >
                        ← Previous Charge
                      </button>
                      <button
                        disabled={selectedPillar === 10}
                        onClick={() => setSelectedPillar((prev) => Math.min(10, prev + 1))}
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-30 transition-all font-bold"
                      >
                        Next Charge →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 3: MEGA SCAM VAULT (SEARCHABLE & FILTERABLE) */}
        {activeTab === "scams" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full">
                Interactive CAG & Court Dossier
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Mega Scam Vault</h2>
              <p className="text-sm text-slate-400">
                Detailed catalogue of major financial irregularities during Congress administrations with documented losses, CAG report numbers, and judicial outcomes.
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search scam, minister, sector or keywords..."
                  value={scamSearch}
                  onChange={(e) => setScamSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex overflow-x-auto w-full md:w-auto gap-2 no-scrollbar">
                {["All", "Telecom & Tech", "Natural Resources", "Defense", "Land & Real Estate", "Sports & Infrastructure", "Aviation"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setScamCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      scamCategory === cat
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scam Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScams.map((scam) => (
                <div
                  key={scam.id}
                  onClick={() => setSelectedScam(scam)}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 p-6 flex flex-col justify-between space-y-4 hover:bg-slate-850 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Year: {scam.year}
                      </span>
                      <span className="text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
                        {scam.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                      {scam.name}
                    </h3>

                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Estimated Loss / Scale:</span>
                      <span className="text-base font-black font-mono text-rose-400">{scam.loss}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {scam.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[180px]">{scam.cag}</span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Case Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for detailed scam view */}
            {selectedScam && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setSelectedScam(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-800 px-2.5 py-1 rounded">
                      {selectedScam.category} | Year {selectedScam.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedScam.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Estimated Amount / Loss</div>
                      <div className="text-xl font-black font-mono text-rose-400">{selectedScam.loss}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Department / Minister</div>
                      <div className="text-sm font-bold text-slate-200 truncate">{selectedScam.minister}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Modus Operandi</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {selectedScam.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Judicial & Audit Status</h4>
                    <div className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl leading-relaxed">
                      {selectedScam.status}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Source Reference: <strong className="text-slate-200">{selectedScam.source}</strong></span>
                    <button
                      onClick={() => copyToClipboard(`${selectedScam.name} (${selectedScam.loss}) - ${selectedScam.source}`)}
                      className="flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Reference
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ELECTORAL MELTDOWN & DYNASTY MATRIX */}
        {activeTab === "meltdown" && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
                Historical Performance Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Long Electoral Meltdown</h2>
              <p className="text-sm text-slate-400">
                From 414 Lok Sabha seats in 1984 to sub-100 tallies for three consecutive general elections.
              </p>
            </div>

            {/* Lok Sabha Performance Timeline */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" /> Lok Sabha Seats Over Time (1984–2024)
              </h3>

              <div className="space-y-4">
                {[
                  { year: "1984", seats: 414, max: 543, percent: "76.2%", note: "Post-Indira sympathy wave" },
                  { year: "1991", seats: 232, max: 543, percent: "42.7%", note: "Minority government era" },
                  { year: "1999", seats: 114, max: 543, percent: "21.0%", note: "First full non-Congress term" },
                  { year: "2004", seats: 145, max: 543, percent: "26.7%", note: "UPA-1 coalition formation" },
                  { year: "2009", seats: 206, max: 543, percent: "37.9%", note: "UPA-2 peak before massive scam disclosures" },
                  { year: "2014", seats: 44, max: 543, percent: "8.1%", note: "Historic all-time democratic low" },
                  { year: "2019", seats: 52, max: 543, percent: "9.5%", note: "Failed to attain formal Leader of Opposition status" },
                  { year: "2024", seats: 99, max: 543, percent: "18.2%", note: "Celebrated sub-100 finish as monumental triumph" }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white text-sm">{row.year} Election</span>
                      <span className="text-amber-400 font-bold">{row.seats} Seats ({row.percent})</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800 relative">
                      <div
                        className={`h-full rounded-full ${
                          row.seats <= 52 ? "bg-red-500" : row.seats < 150 ? "bg-orange-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${(row.seats / 543) * 100}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{row.note}</span>
                      <span>543 total seats</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynasty vs Party Merit Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">The High Command Hierarchy</h4>
                    <p className="text-xs text-slate-400">One Family's Unbroken Command</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">1947–1964:</span> Jawaharlal Nehru (17 consecutive years as PM)
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">1966–1984:</span> Indira Gandhi (Emergency imposed, internal party split)
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">1984–1989:</span> Rajiv Gandhi (Direct succession without prior ministerial office)
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">1998–2017:</span> Sonia Gandhi (Longest serving Congress President: 19 years)
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">2017–Present:</span> Rahul & Priyanka Gandhi (De-facto veto over all policy)
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Non-Dynasty Leaders Sidelined</h4>
                    <p className="text-xs text-slate-400">The Fate of Merit-Based Leaders</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-red-400 font-bold">PV Narasimha Rao:</span> Father of 1991 economic reforms; body denied entry into AICC office post-death.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-red-400 font-bold">Sitaram Kesri:</span> Elected Dalit/OBC President; locked inside room to force resignation in 1998.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-red-400 font-bold">Pranab Mukherjee:</span> Passed over for PM post in 2004 despite supreme seniority and experience.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-red-400 font-bold">Himanta Biswa Sarma:</span> Ignored by high command while serving as primary state strategist; forced to exit.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: BHARAT KE VEER - INDIAN ARMED FORCES DONATION PORTAL */}
        {activeTab === "donate" && (
          <div className="space-y-10 max-w-5xl mx-auto">
            {/* National Tribute Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <Flag className="w-3.5 h-3.5 fill-emerald-300" />
                100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Support Our Bravehearts: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300">Bharat Ke Veer</span> 🇮🇳
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
                This platform does <strong className="text-white">NOT</strong> accept political or personal donations. Instead, we appeal to every nationalist citizen to channel their support directly to the families of our fallen heroes and CAPF martyrs through the Government of India's official <strong className="text-amber-300">Bharat Ke Veer</strong> portal.
              </p>
              
              <div className="pt-2">
                <a
                  href={BHARAT_KE_VEER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 text-base shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
                >
                  <ExternalLink className="w-5 h-5 text-slate-950" /> Go Directly to BharatKeVeer.gov.in
                </a>
              </div>
            </div>

            {/* Success Toast */}
            {showPledgeSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Pledge Recorded! Opening Bharat Ke Veer Official Portal...</h4>
                  <p className="text-xs text-emerald-400/90">Thank you for standing with the families of our Bravehearts. Jai Hind 🇮🇳</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Pledge Form & Redirect Trigger (Left) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Flag className="w-5 h-5 text-emerald-400 fill-emerald-400" /> Select Your Donation Pledge
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choosing an amount below records your pledge on our citizen wall and transfers you directly to the Ministry of Home Affairs' secure Bharat Ke Veer gateway.
                  </p>
                </div>

                {/* Preset Tier Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[250, 500, 1100, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setPledgeAmount(amt);
                        setCustomPledge("");
                      }}
                      className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition-all ${
                        pledgeAmount === amt && !customPledge
                          ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/20"
                          : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Or Custom Pledge Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={customPledge}
                      onChange={(e) => {
                        setCustomPledge(e.target.value);
                        setPledgeAmount(0);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Donor Details Form */}
                <form onSubmit={handlePledgeAndRedirect} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Your Name / Citizen Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. Desh Premi / Proud Indian"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Message for Indian Soldiers & Veterans</label>
                    <textarea
                      rows={3}
                      placeholder="Write your gratitude message to the Indian Armed Forces..."
                      value={donorMsg}
                      onChange={(e) => setDonorMsg(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Official Government Assurance Box */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-emerald-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <Shield className="w-4 h-4" /> Official Govt Portal: bharatkeveer.gov.in
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        Direct Deposit
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      All donations are directly credited to the next of kin of Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, Assam Rifles, NSG) and Armed Forces personnel. Eligible for 80G Tax Exemption.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-slate-950 text-base shadow-xl shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-5 h-5 fill-slate-950" /> Pledge ₹{(customPledge || pledgeAmount || 0).toLocaleString()} & Donate on Bharat Ke Veer →
                  </button>
                </form>
              </div>

              {/* Verified Trust Badges & Supporter Ledger (Right) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Transparency Commitment Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" /> Why Bharat Ke Veer?
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>0% Intermediary Cuts:</strong> Managed under the aegis of the Ministry of Home Affairs (Govt of India).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Direct Bank Transfer:</strong> Funds go straight into the bank accounts of the martyr's family.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>100% Tax Deductible:</strong> Receives formal government certificate under Section 80G of the IT Act.</span>
                    </li>
                  </ul>
                </div>

                {/* Citizen Army Supporter Wall */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" /> Patriotic Citizen Wall
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">Army Supporters</span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {pledgesList.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{item.name}</span>
                          <span className="font-mono font-bold text-emerald-400">Pledged ₹{item.amount}</span>
                        </div>
                        <p className="text-xs text-slate-400 italic">"{item.msg}"</p>
                        <div className="text-[10px] text-slate-500 text-right">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Interactive Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 pt-12 pb-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  ध
                </div>
                <span className="font-black text-white text-base">ALL INDIA DHONGRESS PARTY</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                A public-interest political satire, empirical audit, and accountability portal dedicated to archiving governance contradictions, historical facts, and institutional decay.
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold">
                🇮🇳 All community contributions are directed to the Indian Armed Forces via bharatkeveer.gov.in
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-xs">Core Chapters</h5>
              <ul className="space-y-1.5">
                <li><button onClick={() => { setSelectedPillar(1); setActiveTab("pillars"); }} className="hover:text-amber-400">Youth Unemployment Reality</button></li>
                <li><button onClick={() => { setSelectedPillar(2); setActiveTab("pillars"); }} className="hover:text-amber-400">Mahila Empowerment Hypocrisy</button></li>
                <li><button onClick={() => { setSelectedPillar(3); setActiveTab("pillars"); }} className="hover:text-amber-400">Minority Sachar Report Data</button></li>
                <li><button onClick={() => { setSelectedPillar(7); setActiveTab("pillars"); }} className="hover:text-amber-400">Mega Corruption Timeline</button></li>
                <li><button onClick={() => { setSelectedPillar(9); setActiveTab("pillars"); }} className="hover:text-amber-400">Dynasty & Merit Sidelining</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-xs">Citizen Tools</h5>
              <ul className="space-y-1.5">
                <li><button onClick={() => setActiveTab("scams")} className="hover:text-amber-400">Search 2G, Coal & CWG Files</button></li>
                <li><button onClick={() => setActiveTab("meltdown")} className="hover:text-amber-400">414 to 44 Seats Chart</button></li>
                <li>
                  <a
                    href={BHARAT_KE_VEER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 flex items-center gap-1"
                  >
                    Donate to Indian Army <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li><button onClick={() => copyToClipboard(window.location.href)} className="hover:text-amber-400">Share on WhatsApp / X</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} allindiadhongressparty.com. Political commentary & educational critique under fair use.</p>
            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>Support Portal: bharatkeveer.gov.in (Ministry of Home Affairs, GoI)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
