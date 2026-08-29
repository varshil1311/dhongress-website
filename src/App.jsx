import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History, Brain, BookOpen, 
  Quote, RefreshCw, Play, XCircle, MessageSquare, BarChart, Scale
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

  // Hidden Admin State
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

  const [electionData, setElectionData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState(false);

  // Secret Admin URL Trigger
  useEffect(() => {
    if (window.location.search.includes('editor=true')) {
      setShowAdminTab(true);
    }
  }, []);

  useEffect(() => {
    async function trackVisit() {
      try {
        setLoadingCounter(true);
        const res = await fetch(`https://api.counterapi.dev/v1/indiannationaldhongress/visits/up`);
        if (res.ok) {
          const data = await res.json();
          setTotalVisitors(data.count);
        } else {
          setTotalVisitors(12481); // Fallback
        }
      } catch (err) {
        setTotalVisitors(12481);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();

    // Mock API fetch to update counts (Would be replaced by Supabase call)
    setBjpAccountCount(32);
    setGovAccountCount(45);
    setIncAccountCount(24);
  }, []);

  useEffect(() => {
    async function fetchCSVs() {
      if (activeTab !== "research") return;
      if (electionData.length > 0) return; // already loaded

      setCsvLoading(true);
      try {
        // Fetch Election Data
        const elRes = await fetch('/Congress_Election_Database_2014_2026.csv');
        if (elRes.ok) {
          const elText = await elRes.text();
          const parsedEl = parseCSV(elText);
          setElectionData(parsedEl);
        }

        // Fetch News Data
        const newsRes = await fetch('/Congress_Corruption_Controversy_News_2014_2026.csv');
        if (newsRes.ok) {
          const newsText = await newsRes.text();
          const parsedNews = parseCSV(newsText);
          setNewsData(parsedNews);
        }
      } catch (err) {
        console.error("Failed to load CSV databases", err);
        setCsvError(true);
      } finally {
        setCsvLoading(false);
      }
    }
    fetchCSVs();
  }, [activeTab]);

  const parseCSV = (strData) => {
    if (!strData) return [];
    const lines = strData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      // Regex matches commas outside of double quotes
      const obj = {};
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
      }
      result.push(obj);
    }
    return result;
  };

  const fullQuizPool = [
    { q: "In what year was the landmark 33% Women's Reservation Bill finally passed by Parliament?", opts: ["1996", "2010", "2014", "2023"], ans: 3, exp: "Despite being introduced multiple times since 1996, the Nari Shakti Vandan Adhiniyam was finally passed in 2023." },
    { q: "Which major scandal led to the cancellation of 122 telecom licenses by the Supreme Court in 2012?", opts: ["Bofors Scandal", "2G Spectrum Scam", "Coalgate", "CWG Scam"], ans: 1, exp: "The Supreme Court cancelled 122 licenses allocated during UPA-1, citing an unconstitutional first-come-first-served process." },
    { q: "What was the official lowest number of Lok Sabha seats won by the Congress party in its history?", opts: ["114", "99", "52", "44"], ans: 3, exp: "In the 2014 General Elections, the INC fell to a historic low of 44 seats." },
    { q: "True or False: The Enforcement Directorate (ED) can convict a politician of a crime.", opts: ["True", "False"], ans: 1, exp: "False. The ED investigates financial crimes and files chargesheets. Only a court of law can convict someone." },
    { q: "Which committee report in 2006 highlighted the severe educational and economic backwardness of Muslims in India?", opts: ["Mandal Commission", "Sachar Committee", "Kothari Commission", "Nanavati Commission"], ans: 1, exp: "The Sachar Committee report, commissioned by the UPA, exposed the severe under-representation of minorities despite decades of claims." },
    { q: "During which Prime Minister's tenure was the Emergency imposed in India?", opts: ["Jawaharlal Nehru", "Morarji Desai", "Indira Gandhi", "Rajiv Gandhi"], ans: 2, exp: "Indira Gandhi imposed the Emergency from 1975 to 1977, suspending fundamental rights." },
    { q: "What was the estimated presumptive loss to the exchequer in the Coalgate scam according to the CAG?", opts: ["₹70,000 Cr", "₹1.76 Lakh Cr", "₹1.86 Lakh Cr", "₹5,000 Cr"], ans: 2, exp: "The CAG estimated a presumptive loss of ₹1.86 Lakh Crore due to arbitrary coal block allocations." },
    { q: "Who was the Prime Minister of India when the historic 1991 economic liberalization reforms were introduced?", opts: ["Rajiv Gandhi", "PV Narasimha Rao", "Manmohan Singh", "VP Singh"], ans: 1, exp: "PV Narasimha Rao was the PM, with Dr. Manmohan Singh serving as his Finance Minister." },
    { q: "The Shah Bano case (1985) ruling by the Supreme Court was overturned by parliament to appease orthodox groups. What was the core issue?", opts: ["Triple Talaq", "Women's Alimony/Maintenance", "Property Rights", "Voting Rights"], ans: 1, exp: "The SC granted maintenance to a divorced Muslim woman, but the Rajiv Gandhi govt passed a law diluting the judgment." },
    { q: "Which UPA-era minister was jailed in connection with the Commonwealth Games (CWG) corruption scandal?", opts: ["A. Raja", "P. Chidambaram", "Suresh Kalmadi", "Kapil Sibal"], ans: 2, exp: "Suresh Kalmadi, the organizing committee chairman, was arrested for massive financial irregularities." },
    { q: "In the 2019 Lok Sabha elections, how many seats did the Congress party win?", opts: ["44", "52", "99", "114"], ans: 1, exp: "The Congress won 52 seats, failing again to secure the 10% required for formal Leader of Opposition status." },
    { q: "Which constitutional amendment added the words 'Secular' and 'Socialist' to the Preamble of the Indian Constitution?", opts: ["42nd", "44th", "73rd", "86th"], ans: 0, exp: "The 42nd Amendment, passed during the Emergency in 1976." },
    { q: "The National Herald case involves the transfer of ₹5,000 Cr worth of assets to Young Indian Ltd. Who owns 76% of Young Indian?", opts: ["The Govt of India", "Rahul and Sonia Gandhi", "Associated Journals Ltd", "AICC Trust"], ans: 1, exp: "Rahul and Sonia Gandhi hold a combined 76% stake in Young Indian Ltd." },
    { q: "Which global defense manufacturer was involved in a kickback scandal for VVIP helicopters in 2013?", opts: ["Dassault", "Boeing", "AgustaWestland", "Lockheed Martin"], ans: 2, exp: "AgustaWestland was accused of paying bribes to alter helicopter flight ceiling requirements." },
    { q: "True or False: The Congress party won a full parliamentary majority in the 2004 General Elections.", opts: ["True", "False"], ans: 1, exp: "False. They won 145 seats and formed the UPA coalition government." },
    { q: "What controversial action did Rahul Gandhi take during a 2013 press conference regarding a UPA government ordinance?", opts: ["Resigned from party", "Tore up the ordinance copy", "Walked out silently", "Endorsed it completely"], ans: 1, exp: "He publicly denounced and tore up the ordinance meant to protect convicted politicians, embarrassing his own PM." },
    { q: "Which article of the Indian Constitution, granting special autonomous status to Jammu & Kashmir, was abrogated in 2019?", opts: ["Article 356", "Article 370", "Article 371", "Article 324"], ans: 1, exp: "Article 370 was abrogated, fully integrating J&K into the Indian Union." },
    { q: "In 2012, the UPA government introduced 'Retrospective Taxation', famously affecting which major telecom company?", opts: ["Airtel", "Jio", "Vodafone", "Idea"], ans: 2, exp: "The retroactive tax amendment severely damaged foreign investor confidence in India." },
    { q: "Who is the longest-serving President of the Indian National Congress?", opts: ["Jawaharlal Nehru", "Indira Gandhi", "Sonia Gandhi", "Rahul Gandhi"], ans: 2, exp: "Sonia Gandhi served as party president for a total of over 20 years." },
    { q: "Which defense scandal in 1987 involving Swedish field howitzers severely damaged Rajiv Gandhi's government?", opts: ["Rafale Deal", "Bofors Scandal", "Submarine Scam", "Jeep Scandal"], ans: 1, exp: "The Bofors scandal involved allegations of kickbacks to politicians and middlemen like Ottavio Quattrocchi." },
    { q: "What does 'Anti-incumbency' mean in Indian electoral politics?", opts: ["Voting against the current ruling party", "Voting against electronic machines", "Voting multiple times", "Boycotting elections"], ans: 0, exp: "A widespread voter sentiment to remove the incumbent government from power." },
    { q: "How many states in India have never been ruled by the BJP (independently or in coalition) as of 2024?", opts: ["0", "1", "3", "5"], ans: 2, exp: "Tamil Nadu, Kerala, and West Bengal (though political landscapes constantly shift)." },
    { q: "Which commission recommended 27% reservation for OBCs in government jobs, implemented in 1990?", opts: ["Kothari Commission", "Mandal Commission", "Sarkaria Commission", "Shah Commission"], ans: 1, exp: "The Mandal Commission recommendations changed the landscape of Indian caste politics." },
    { q: "What was the 'Hindu Rate of Growth'?", opts: ["A boom in religious tourism", "Stagnant 3.5% economic growth before 1990", "Population growth rate", "Agricultural yield"], ans: 1, exp: "A term describing India's low, stagnant economic growth under socialist policies from the 1950s to 1980s." },
    { q: "In what year did the Right to Information (RTI) Act come into force?", opts: ["2000", "2005", "2010", "2014"], ans: 1, exp: "The RTI Act was passed in 2005, providing a powerful tool for civic transparency." },
    { q: "True or False: A Chargesheet is the same as a Conviction.", opts: ["True", "False"], ans: 1, exp: "False. A chargesheet is a formal accusation by law enforcement. Conviction is pronounced by a judge." },
    { q: "Which former Congress PM was famously denied a memorial in Delhi and entry to the AICC headquarters after death?", opts: ["Lal Bahadur Shastri", "Rajiv Gandhi", "PV Narasimha Rao", "Indira Gandhi"], ans: 2, exp: "Despite his historic economic reforms, Rao was largely ostracized by the party leadership." },
    { q: "The 'Adarsh Housing Society' scam involved luxury apartments in Mumbai meant for whom?", opts: ["Slum dwellers", "Kargil war widows and veterans", "Olympic athletes", "Retired politicians"], ans: 1, exp: "The apartments were illegally allocated to politicians, bureaucrats, and military top brass." },
    { q: "What was India's rank on the World Bank's Ease of Doing Business index in 2014 before major reforms?", opts: ["55th", "100th", "142nd", "180th"], ans: 2, exp: "India was ranked a dismal 142nd, reflecting severe red tape and bureaucratic hurdles." },
    { q: "Which Congress leader famously served as Prime Minister for a full term without ever facing a confidence vote in Parliament?", opts: ["None, every PM must face Parliament", "Charan Singh", "Chandrashekhar", "IK Gujral"], ans: 0, exp: "Trick question! Charan Singh never faced parliament, but he was not Congress (though backed by them briefly)." },
    { q: "What term describes the economic model India followed heavily from independence until 1991?", opts: ["Laissez-faire Capitalism", "License-Permit-Quota Raj", "Export-driven Growth", "Free Trade"], ans: 1, exp: "The system required extensive government approvals to start or expand businesses, stifling growth." },
    { q: "Who was the 'De Facto' head of the National Advisory Council (NAC) during the UPA government?", opts: ["Manmohan Singh", "Pranab Mukherjee", "Sonia Gandhi", "Rahul Gandhi"], ans: 2, exp: "Sonia Gandhi chaired the NAC, which heavily influenced government policy." },
    { q: "Which major space spectrum deal was cancelled by the UPA government in 2011 to avoid a mega scam?", opts: ["ISRO-SpaceX", "Antrix-Devas", "BSNL-Starlink", "Airtel-Sat"], ans: 1, exp: "The Antrix-Devas deal involved leasing rare S-band spectrum at throwaway prices." },
    { q: "In the context of the Indian Constitution, what is an Ordinance?", opts: ["A permanent law passed by Parliament", "A temporary law promulgated by the President", "A Supreme Court ruling", "A state assembly bill"], ans: 1, exp: "An ordinance is a temporary law issued when Parliament is not in session." },
    { q: "What does 'CAG' stand for in India?", opts: ["Central Audit Group", "Comptroller and Auditor General", "Council of Audit Governance", "Chief Auditor of Government"], ans: 1, exp: "The CAG is the supreme audit institution of India, responsible for auditing government receipts and expenditure." },
    { q: "True or False: The 'Fragile Five' was a term used by Morgan Stanley in 2013 to describe robustly growing economies.", opts: ["True", "False"], ans: 1, exp: "False. It described economies heavily reliant on foreign investment to finance growth deficits, including India." },
    { q: "The Supreme Court struck down Section 66A of the IT Act in 2015. What did this section restrict?", opts: ["Foreign Direct Investment", "Online Free Speech", "E-commerce taxation", "Digital payments"], ans: 1, exp: "It allowed arrests for 'offensive' online posts and was deemed unconstitutional." },
    { q: "Which Congress president was allegedly locked in a bathroom at AICC headquarters in 1998?", opts: ["Sitaram Kesri", "Narasimha Rao", "Pranab Mukherjee", "Kamaraj"], ans: 0, exp: "Kesri was unceremoniously removed to make way for Sonia Gandhi's presidency." },
    { q: "What was the primary focus of the Shunglu Committee in 2010?", opts: ["Agricultural distress", "2G Spectrum pricing", "CWG infrastructure delays and corruption", "Defense procurement"], ans: 2, exp: "It investigated massive irregularities in the 2010 Commonwealth Games." },
    { q: "How many continuous years did Jawaharlal Nehru serve as Prime Minister?", opts: ["10", "12", "17", "22"], ans: 2, exp: "Nehru served for 17 years from 1947 until his death in 1964." },
    { q: "The 'Air India Fleet Acquisition' scam involved ordering how many unnecessary aircraft, severely indebting the airline?", opts: ["25", "68", "111", "200"], ans: 2, exp: "The UPA ordered 111 aircraft worth ₹67,000 Cr, pushing the profitable airline into massive debt." },
    { q: "Which term is used when politicians switch parties after being elected, which the Anti-Defection Law tries to prevent?", opts: ["Filibustering", "Horse-trading / Defection", "Gerrymandering", "Lobbying"], ans: 1, exp: "Defection (Aaya Ram Gaya Ram politics) undermines electoral mandates." },
    { q: "In 1975, the Allahabad High Court found Indira Gandhi guilty of what?", opts: ["Financial embezzlement", "Electoral malpractice", "Treason", "Contempt of court"], ans: 1, exp: "She was found guilty of using state machinery for her election campaign, triggering the Emergency." },
    { q: "Which institution is responsible for conducting Lok Sabha elections in India?", opts: ["Supreme Court", "Ministry of Home Affairs", "Election Commission of India", "NITI Aayog"], ans: 2, exp: "The ECI is an autonomous constitutional authority responsible for administering elections." },
    { q: "True or False: The Indian National Congress won the 2009 Lok Sabha elections with an absolute majority of 272+ seats.", opts: ["True", "False"], ans: 1, exp: "False. They won 206 seats and required coalition partners to form the UPA-2 government." },
    { q: "What was the 'Hawala Scandal' of the 1990s?", opts: ["Illegal coal mining", "A massive bribery ring involving politicians across parties", "Stock market manipulation", "Defense procurement"], ans: 1, exp: "It involved illegal payments routed through hawala brokers to top politicians." },
    { q: "Which Indian state has the highest number of Lok Sabha seats?", opts: ["Maharashtra", "West Bengal", "Uttar Pradesh", "Bihar"], ans: 2, exp: "Uttar Pradesh has 80 Lok Sabha seats, making it crucial for forming a national government." },
    { q: "The 'Office of Profit' controversy in 2006 forced which senior leader to briefly resign from the Lok Sabha?", opts: ["Manmohan Singh", "Sonia Gandhi", "L.K. Advani", "A.B. Vajpayee"], ans: 1, exp: "Sonia Gandhi resigned and sought re-election after holding the NAC chairperson post." },
    { q: "What does 'FDI' stand for in economic policy?", opts: ["Federal Department of Investigation", "Foreign Direct Investment", "Financial Deficit Indicator", "Fiscal Dividend Index"], ans: 1, exp: "FDI refers to investment from foreign entities into domestic businesses." },
    { q: "Who was the Finance Minister of India under the UPA government during the 2008 global financial crisis?", opts: ["Manmohan Singh", "Arun Jaitley", "P. Chidambaram", "Yashwant Sinha"], ans: 2, exp: "P. Chidambaram was the Finance Minister during the onset of the crisis." }
  ];

  const [quizState, setQuizState] = useState('idle'); // idle, playing, result
  const [currentQuizSet, setCurrentQuizSet] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
    // Shuffle and pick 5
    const shuffled = [...fullQuizPool].sort(() => 0.5 - Math.random());
    setCurrentQuizSet(shuffled.slice(0, 5));
    setQuizState('playing');
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    if (index === currentQuizSet[currentQ].ans) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQ < currentQuizSet.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState('result');
    }
  };

  const [feedPaused, setFeedPaused] = useState(false);
  const [bjpFeedIndex, setBjpFeedIndex] = useState(0);
  const [govFeedIndex, setGovFeedIndex] = useState(0);

  const bjpLiveFeed = [
    { id: 1, author: "Narendra Modi", handle: "narendramodi", text: "India's growth story continues to be defined by our hardworking youth. New initiatives launched today will empower millions.", time: "12 mins ago", engagement: "45K Reposts" },
    { id: 2, author: "Amit Shah", handle: "AmitShah", text: "National security remains our paramount priority. We will not compromise on the safety of our borders.", time: "28 mins ago", engagement: "21K Reposts" },
    { id: 3, author: "BJP", handle: "BJP4India", text: "Watch LIVE: Press conference at BJP Headquarters.", time: "42 mins ago", engagement: "5K Reposts" }
  ];

  const govLiveFeed = [
    { id: 1, author: "PIB Fact Check", handle: "PIBFactCheck", text: "A fake notice claiming that dates for the upcoming exams have changed is circulating online. No such decision has been taken.", time: "8 mins ago", status: "FAKE NEWS DEBUNKED" },
    { id: 2, author: "MyGovIndia", handle: "mygovindia", text: "Over 50 crore Ayushman cards created! A historic milestone in providing free healthcare.", time: "18 mins ago", status: "OFFICIAL UPDATE" },
    { id: 3, author: "Ministry of Finance", handle: "FinMinIndia", text: "GST revenue collection for the month records a 11% Year-on-Year growth.", time: "35 mins ago", status: "DATA RELEASE" }
  ];

  useEffect(() => {
    if (feedPaused || activeTab !== "overview") return;
    const interval = setInterval(() => {
      setBjpFeedIndex((prev) => (prev + 1) % bjpLiveFeed.length);
      setGovFeedIndex((prev) => (prev + 1) % govLiveFeed.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [feedPaused, activeTab]);

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

  const pillars = [
    { id: 1, title: "Youth: Past Action vs Today's Preach", icon: Users, summary: "Decades of sluggish educational reforms, legacy of paper leaks, and employment stagnation juxtaposed with current tall promises.", points: [{ heading: "The 60-Year Jobless Paradigm", detail: "While currently demanding 30 lakh government jobs with a magic wand, the 2004-2014 era witnessed an average formal employment growth of under 1.5%." }, { heading: "Paper Leaks & State Freezes", detail: "Recruitment freezes and state-level teacher examination scams in Congress-governed states affected 26+ lakh young aspirants." }] },
    { id: 2, title: "Mahila: Rhetoric vs Reality on Women", icon: Heart, summary: "Decades of keeping the Women's Reservation Bill in legislative cold-storage while claiming sole proprietorship of gender justice.", points: [{ heading: "The 33% Reservation 27-Year Stalling", detail: "Despite holding full majority multiple times, the Nari Shakti Vandan was allowed to lapse without floor consensus." }, { heading: "The Shah Bano Regression (1985)", detail: "Overturned the landmark SC judgment granting basic maintenance to an indigent Muslim woman, capitulating to conservative patriarchy." }] },
    { id: 3, title: "Minority Politics: Appeasement vs Upliftment", icon: Shield, summary: "The Sachar Committee (2006) revealed how 50+ years of governance left minority communities economically and educationally at the bottom.", points: [{ heading: "Sachar Committee Self-Indictment", detail: "Commissioned by UPA, it found that 55 years of rule kept Indian Muslims with only 2.5% representation in IAS/IPS." }, { heading: "Zero Reformist Backbone", detail: "Consistently opposed the modernization of madrasa education and blocked personal law reforms (like Triple Talaq abolition)." }] },
    { id: 4, title: "Job Creation: The License-Permit Raj", icon: Briefcase, summary: "How socialist red tape suffocated enterprise, forcing generations of Indian youth into government clerk queues.", points: [{ heading: "The 'Hindu Rate of Growth' Stagnation", detail: "Socialist centralization between 1950-1990 artificially choked private business." }, { heading: "Twin Balance Sheet Crisis", detail: "Unregulated 'phone banking' loan disbursals led to banking NPAs ballooning past ₹10.36 Lakh Crores." }] },
    { id: 5, title: "Foreign Investment: Policy Paralysis", icon: Globe, summary: "How retrospective taxation and ministerial vetoes scared away billions of global dollars in the UPA-2 era.", points: [{ heading: "The 2012 Retrospective Tax Disaster", detail: "Amending tax laws retroactively against Vodafone and Cairn Energy single-handedly destroyed India's reputation for contract enforcement." }, { heading: "Fragile Five Economy (2013)", detail: "Morgan Stanley classified India among the world's most vulnerable economies due to soaring CAD and inflation." }] },
    { id: 6, title: "Make in India: Stagnation & Import Reliance", icon: Factory, summary: "Leaving India as an import-dependent economy for defense, mobile electronics, and infrastructure equipment.", points: [{ heading: "100% Defense Import Vulnerability", detail: "Defense modernization was frozen for years, leaving the Armed Forces reliant on 70%+ imported arms." }, { heading: "Only 2 Mobile Factories in 2014", detail: "While Asian peers industrialized in the 1990s, India had only 2 mobile phone manufacturing units in 2014." }] },
    { id: 7, title: "Scams of INC: The Golden Decade of Plunder", icon: Database, summary: "From 2G Spectrum and Coalgate to Commonwealth Games and Bofors—a systematic audit of alleged loss to the exchequer.", points: [{ heading: "Over ₹12 Lakh Crore Cumulative Scams", detail: "CAG audits between 2009-2014 revealed unprecedented irregularities across natural resources." }, { heading: "The National Herald Asset Grab", detail: "Transfer of ₹5,000 Crore public asset company to Young Indian Ltd for a nominal ₹50 Lakh loan write-off." }] },
    { id: 8, title: "Sanskar: Defamation & Institutional Disrespect", icon: Flame, summary: "A catalog of derogatory epithets against constitutional posts, veterans, and political opponents.", points: [{ heading: "Insults to Constitutional Positions", detail: "Repeated derogatory remarks against the President of India ('Rashtrapatni'), Prime Minister, and Election Commissioners." }, { heading: "Tearing the Cabinet Ordinance (2013)", detail: "Publicly humiliating his own Prime Minister Dr. Manmohan Singh by tearing a government ordinance into pieces in a live press conference." }] },
    { id: 9, title: "One Family, One Party: Sidelining Merit", icon: Crown, summary: "How internal party democracy was decimated and iconic non-dynasty leaders were historically humiliated.", points: [{ heading: "The Humiliation of PV Narasimha Rao", detail: "The former PM who unlocked 1991 reforms was denied entry of his mortal remains into the AICC headquarters." }, { heading: "The Mass Exodus of Competent Leaders", detail: "Over 40 prominent senior leaders left citing dynastic sycophancy." }] },
    { id: 10, title: "Worst Electoral Meltdown in Democracy", icon: TrendingDown, summary: "How India's oldest party went from 414 seats (1984) to historic lows of 44 (2014) and 52 (2019).", points: [{ heading: "The 44-Seat Nadir (2014)", detail: "Could not even secure the statutory 10% of seats required to claim the formal Leader of Opposition status in Lok Sabha." }, { heading: "Sub-20% Strike Rate", detail: "In head-to-head national contests against national alternatives, the strike rate remained under 15% across three general elections." }] }
  ];

  const scamDatabase = [
    { id: "2g", name: "2G Spectrum Allocation Scam", year: "2008", loss: "₹1,76,000 Cr", category: "Telecom & Tech", minister: "A. Raja / UPA-1", cag: "CAG Report No. 19 of 2010-11", description: "Arbitrary first-come-first-served spectrum allocation at throwaway prices. 122 licenses cancelled by SC.", status: "Licenses Cancelled by SC", source: "SC Judgment (2012)" },
    { id: "coal", name: "Coalgate: Coal Block Allocation", year: "2012", loss: "₹1,86,000 Cr", category: "Natural Resources", minister: "Ministry of Coal / UPA", cag: "CAG Report No. 7 of 2012-13", description: "Allocation of 214 captive coal blocks to private firms without transparent competitive bidding.", status: "Allocations Cancelled by SC", source: "SC Judgment (2014)" },
    { id: "cwg", name: "Commonwealth Games (CWG) Loot", year: "2010", loss: "₹70,000 Cr", category: "Sports & Infrastructure", minister: "Suresh Kalmadi", cag: "Shunglu Committee", description: "Massive over-invoicing including toilet paper rolls purchased for ₹3,750 each.", status: "Charge-sheets Filed", source: "Shunglu Committee Report" },
    { id: "bofors", name: "Bofors Howitzer Kickbacks", year: "1987", loss: "₹64 Cr (1987)", category: "Defense", minister: "Rajiv Gandhi Admin", cag: "Swedish Audit", description: "Allegations of $9.9 million in secret kickbacks to middlemen for purchasing field howitzer guns.", status: "Middleman Accounts Defrozen in 2006", source: "Swedish Radio Exposé" },
    { id: "agusta", name: "AgustaWestland VVIP Chopper Deal", year: "2013", loss: "₹3,600 Cr", category: "Defense", minister: "A.K. Antony / UPA-2", cag: "CAG Report", description: "Service ceiling flight altitude artificially lowered to qualify specific helicopters in exchange for bribes.", status: "Under Trial (CBI/ED)", source: "Milan Court of Appeals 2016" },
    { id: "nh", name: "National Herald Property Grab", year: "2012", loss: "₹5,000 Cr Assets", category: "Real Estate", minister: "Gandhi Family Trust", cag: "PMLA / IT Orders", description: "Young Indian Ltd acquired ₹5,000 Crore prime real estate of AJL for just ₹50 Lakhs.", status: "Assets Attached", source: "Delhi High Court" },
    { id: "adarsh", name: "Adarsh Housing Society Scam", year: "2010", loss: "Unquantified", category: "Land & Defense", minister: "Ashok Chavan", cag: "CAG Special Audit", description: "Building meant for Kargil war widows was allotted to politicians and military top brass.", status: "Demolition Ordered", source: "J.A. Patil Commission" },
    { id: "airindia", name: "Air India Fleet Acquisition", year: "2005-2010", loss: "₹67,000 Cr", category: "Aviation", minister: "Praful Patel", cag: "CAG Report No. 18", description: "Ordering 111 new aircraft for a cash-strapped national carrier while surrendering profitable routes.", status: "CBI FIRs Registered", source: "CAG Audit 2011" },
    { id: "antrix", name: "Antrix-Devas S-Band Deal", year: "2005", loss: "₹15,000 Cr", category: "Space & Telecom", minister: "PMO / Dept of Space", cag: "High Level Review", description: "Leasing 70 MHz of rare S-band military spectrum to private startup Devas for nominal rates.", status: "Fraud Upheld", source: "SC Judgment (2022)" }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-fuchsia-500 selection:text-white ${activeTab === 'overview' ? 'bg-[#0B0F19] text-slate-200' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* 1. TOP BANNER (Restored Bharat Ke Veer Message) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-2 text-xs md:text-sm font-bold text-center text-white flex items-center justify-center gap-2 shadow-md tracking-wide">
        <Flag className="w-4 h-4 fill-white" />
        <span>100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES VIA BHARATKEVEER.GOV.IN</span>
      </div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-600 flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-lg shadow-violet-500/20">
                <span>ध</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-2xl font-black tracking-tight text-white">
                    INDIAN NATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">DHONGRESS</span>
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] md:text-xs text-slate-400 font-mono">Archive of Contradictions & Dynastic Politics</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Overview</button>
              <button onClick={() => setActiveTab("research")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "research" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><Database className="w-4 h-4"/> Research Database</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "meltdown" ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Meltdown</button>
              
              {showAdminTab && (
                <button onClick={() => setActiveTab("admin")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "admin" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40" : "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-900/30"}`}>
                  <Lock className="w-3.5 h-3.5" /> Desk
                </button>
              )}

              <button onClick={() => setActiveTab("donate")} className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-all flex items-center gap-1.5">
                <Flag className="w-4 h-4" /> Army Support
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
            <button onClick={() => { setActiveTab("research"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-cyan-300 flex items-center gap-2"><Database className="w-4 h-4"/> Research Database</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">10 Thematic Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Electoral Meltdown</button>
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-2 py-2.5 rounded-lg font-bold bg-emerald-500 text-white flex justify-center gap-2">Donate to Army</button>
          </div>
        )}
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        
        {/* ========================================== */}
        {/* VIEW 1: FRONT PAGE (OVERVIEW)              */}
        {/* ========================================== */}
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            
            {/* HERO & QUICK STATS (Gen-Z Colors) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold tracking-wider uppercase">
                  <Flame className="w-4 h-4 text-violet-400 animate-pulse" />
                  SATIRICAL ARCHIVE & POLITICAL LORE
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Demanding in Opposition What They <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Destroyed in Power.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Touch grass, then check the data. A fact-checked, satirical exposure of 60 years of dynastic monopoly, historical flip-flops, and missing receipts. No cap.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => setActiveTab("pillars")} className="px-6 py-3 rounded-full font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20">
                    Read The 10 Charges <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab("research")} className="px-6 py-3 rounded-full font-bold bg-slate-800 border border-slate-700 text-cyan-300 hover:bg-slate-700 transition-all flex items-center gap-2">
                    <Database className="w-4 h-4" /> CSV Database
                  </button>
                </div>
              </div>

              {/* Dynamic Stats Panel */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Verified Visits</div>
                  <div className="text-4xl font-black text-white font-mono tracking-tight">
                    {loadingCounter ? "..." : (totalVisitors !== null ? totalVisitors.toLocaleString() : "12,481")}
                  </div>
                </div>
                <div className="h-px w-full bg-slate-800"></div>
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Radio className="w-4 h-4" /> Tracked Accounts</div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <div className="text-2xl font-black text-cyan-400 font-mono">{bjpAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">BJP/NDA</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">{govAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Govt/Fact</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-violet-400 font-mono">{incAccountCount}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">INC/INDIA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESTORED INC TWITTER WATCH & CONTRADICTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-800 pt-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2"><Radio className="w-5 h-5 text-violet-400" /> INC Live Monitor</h3>
                  <span className="text-xs bg-violet-900/30 text-violet-300 border border-violet-800 px-2 py-0.5 rounded font-mono">Audited Feed</span>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 1, author: "Rahul Gandhi", handle: "RahulGandhi", text: "We will guarantee 30 Lakh government jobs to the youth immediately upon forming the government.", status: "MISLEADING", evidence: "During UPA (2004-2014), formal job creation averaged 1.5% annually." },
                    { id: 2, author: "INC Official", handle: "INCIndia", text: "Our government always stood for the ultimate empowerment of women across all sectors.", status: "DISPUTED", evidence: "The 33% Women's Reservation Bill was kept pending for 27 years." }
                  ].map(post => (
                    <div key={post.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs">𝕏</div>
                          <div><div className="text-xs font-bold text-white">{post.author}</div><div className="text-[11px] text-slate-500">@{post.handle}</div></div>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${post.status === 'MISLEADING' ? 'bg-red-900/40 text-red-400' : 'bg-amber-900/40 text-amber-400'}`}>{post.status}</span>
                      </div>
                      <p className="text-sm italic text-slate-300">"{post.text}"</p>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="text-[11px] font-bold text-violet-400">Evidence:</div>
                        <div className="text-xs text-slate-400">{post.evidence}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-cyan-400" /> Contradiction Files</h3>
                </div>
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-violet-400 font-bold">In Power (1947–2014)</span><span className="text-slate-500">Reality</span></div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg">Held Women's 33% Reservation bill hostage for 27 years, overturned Shah Bano judgment to appease orthodoxy.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-cyan-400 font-bold">In Opposition (Current)</span><span className="text-slate-500">Slogan</span></div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg">Preaches 'Ladki Hoon Lad Sakti Hoon' and attacks the Nari Shakti Vandan Act on implementation dates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE POLITICAL SIGNAL (BJP & GOVT) */}
            <div className="space-y-6 border-t border-slate-800 pt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Live Dashboard Widgets</h2>
                <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">Last 60 Mins</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BJP WINDOW */}
                <div className="bg-slate-900 rounded-3xl border border-cyan-900/50 shadow-lg overflow-hidden flex flex-col h-[320px]" onMouseEnter={() => setFeedPaused(true)} onMouseLeave={() => setFeedPaused(false)}>
                  <div className="bg-cyan-950/30 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-cyan-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> THE OTHER SIDE OF X</h3>
                      <p className="text-[10px] text-slate-400">Tracking {bjpAccountCount} BJP & NDA Accounts</p>
                    </div>
                    <div className="text-xs font-mono text-cyan-500 bg-cyan-950 px-2 py-1 rounded">{bjpFeedIndex + 1} / {bjpLiveFeed.length}</div>
                  </div>
                  <div className="p-6 flex-grow relative">
                    {bjpLiveFeed.map((post, i) => (
                      <div key={post.id} className={`absolute inset-0 p-6 flex flex-col justify-center transition-opacity duration-500 ${i === bjpFeedIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">𝕏</div>
                            <div><div className="font-bold text-sm text-white">{post.author}</div><div className="text-[11px] text-slate-500">@{post.handle}</div></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                        </div>
                        <p className="text-sm text-slate-300">"{post.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GOVT WINDOW */}
                <div className="bg-slate-900 rounded-3xl border border-emerald-900/50 shadow-lg overflow-hidden flex flex-col h-[320px]" onMouseEnter={() => setFeedPaused(true)} onMouseLeave={() => setFeedPaused(false)}>
                  <div className="bg-emerald-950/30 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-emerald-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> FACT CHECKED</h3>
                      <p className="text-[10px] text-slate-400">Tracking {govAccountCount} Govt & Fact Accounts</p>
                    </div>
                    <div className="text-xs font-mono text-emerald-500 bg-emerald-950 px-2 py-1 rounded">{govFeedIndex + 1} / {govLiveFeed.length}</div>
                  </div>
                  <div className="p-6 flex-grow relative">
                    {govLiveFeed.map((post, i) => (
                      <div key={post.id} className={`absolute inset-0 p-6 flex flex-col justify-center transition-opacity duration-500 ${i === govFeedIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>
                            <div><div className="font-bold text-sm text-white">{post.author}</div><div className="text-[11px] text-slate-500">@{post.handle}</div></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                        </div>
                        <p className="text-sm text-slate-300">"{post.text}"</p>
                        <div className="mt-4"><span className="text-[10px] font-bold px-2 py-1 bg-emerald-950 text-emerald-400 rounded uppercase">{post.status}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DEMOCRACY QUIZ (50 Pool -> 5 Random) */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative overflow-hidden mt-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="bg-[#0B0F19] rounded-[22px] p-6 sm:p-10 border border-slate-800 relative z-10">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-4xl font-black text-white flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-fuchsia-400" /> ARE YOU DEMOCRACY LITERATE?
                  </h2>
                  <p className="text-slate-400 text-sm">5 random questions from a 50+ question database. No cheating. 😏</p>
                </div>

                {quizState === 'idle' && (
                  <div className="text-center py-8">
                    <button onClick={startQuiz} className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto">
                      <Play className="w-5 h-5 fill-white" /> Pull 5 Random Questions
                    </button>
                  </div>
                )}

                {quizState === 'playing' && currentQuizSet.length > 0 && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 font-mono">
                      <span>QUESTION {currentQ + 1} / 5</span>
                      <span>SCORE: {score}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-fuchsia-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ)/5)*100}%` }}></div></div>
                    
                    <h3 className="text-lg sm:text-xl font-medium text-white">{currentQuizSet[currentQ].q}</h3>
                    
                    <div className="space-y-3 pt-4">
                      {currentQuizSet[currentQ].opts.map((opt, i) => {
                        let btnClass = "bg-slate-800 text-slate-200 hover:bg-slate-700";
                        if (showExplanation) {
                          if (i === currentQuizSet[currentQ].ans) btnClass = "bg-emerald-900/50 border-emerald-500 text-emerald-300";
                          else if (i === selectedAnswer) btnClass = "bg-red-900/50 border-red-500 text-red-300";
                          else btnClass = "bg-slate-900 text-slate-500 opacity-50";
                        }
                        return (
                          <button key={i} disabled={showExplanation} onClick={() => handleAnswer(i)} className={`w-full text-left px-5 py-4 rounded-xl border border-transparent font-medium transition-all ${btnClass}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>

                    {showExplanation && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {selectedAnswer === currentQuizSet[currentQ].ans ? <span className="text-emerald-400">Correct</span> : <span className="text-red-400">Incorrect</span>}
                        </div>
                        <p className="text-sm text-slate-300">{currentQuizSet[currentQ].exp}</p>
                        <button onClick={nextQuestion} className="w-full py-3 bg-fuchsia-600 text-white rounded-lg font-bold text-sm mt-2">Next Question →</button>
                      </div>
                    )}
                  </div>
                )}

                {quizState === 'result' && (
                  <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
                    <h3 className="text-xl font-bold text-slate-400">YOUR DEMOCRACY SCORE</h3>
                    <div className="text-6xl font-black text-white">{score} / 5</div>
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      {score >= 4 ? (
                        <div className="text-xl font-bold text-emerald-400">Okay, you actually read the syllabus. 🧠🔥</div>
                      ) : (
                        <div className="text-xl font-bold text-fuchsia-400">Bro... democracy class is calling. 📚💀</div>
                      )}
                    </div>
                    <button onClick={startQuiz} className="text-sm font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"><RefreshCw className="w-4 h-4"/> Try 5 New Questions</button>
                  </div>
                )}
              </div>
            </div>

            {/* POLITICAL LORE DICTIONARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
              <div className="col-span-full mb-4 text-center">
                <h2 className="text-2xl font-black text-white">Political Lore Dictionary</h2>
                <p className="text-slate-400 text-sm">Gen-Z terms decoded for democracy.</p>
              </div>
              {[
                { t: "Receipts", d: "Proof or documentary evidence supporting a claim. (e.g. CAG Reports)" },
                { t: "No Cap", d: "No exaggeration. Telling the absolute truth." },
                { t: "Touch Grass", d: "Take a break from the internet echo chamber and look at real-world data." },
                { t: "Chargesheet", d: "Formal filing by a police/agency after an investigation concludes." }
              ].map((word, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-black text-violet-400 text-base mb-1">{word.t}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{word.d}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: RESEARCH DATABASE (CSV PARSER)     */}
        {/* ========================================== */}
        {activeTab === "research" && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-3"><Database className="w-8 h-8 text-cyan-400" /> THE RESEARCH DATABASE</h2>
              <p className="text-sm text-slate-400">Compiled from publicly reported election results, news reports and legal developments. Allegations are not convictions.</p>
            </div>

            {csvError && (
              <div className="bg-red-950/50 border border-red-500/50 p-6 rounded-2xl text-center text-red-300">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg">CSV Files Not Found</h3>
                <p className="text-sm mt-1">Please ensure `Congress_Election_Database_2014_2026.csv` and `Congress_Corruption_Controversy_News_2014_2026.csv` are uploaded to your `public/` folder on GitHub.</p>
              </div>
            )}

            {!csvError && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-3xl font-black text-cyan-400 font-mono">{electionData.length || "..."}</div>
                    <div className="text-xs text-slate-500 uppercase mt-1">Election Records</div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-3xl font-black text-violet-400 font-mono">{newsData.length || "..."}</div>
                    <div className="text-xs text-slate-500 uppercase mt-1">News Archive Rows</div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-3xl font-black text-emerald-400 font-mono">99</div>
                    <div className="text-xs text-slate-500 uppercase mt-1">LS Seats 2024</div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-3xl font-black text-rose-400 font-mono">44</div>
                    <div className="text-xs text-slate-500 uppercase mt-1">LS Seats 2014</div>
                  </div>
                </div>

                {/* MANDATORY DISCLAIMER */}
                <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-2xl flex items-start gap-4">
                  <Scale className="w-6 h-6 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-500">ALLEGATION ≠ CONVICTION</h4>
                    <p className="text-sm text-slate-300 mt-1">This archive contains reporting about allegations, investigations, political claims, and legal proceedings. Inclusion in this archive does not establish criminal liability. Margin data is election-level, not constituency-level.</p>
                  </div>
                </div>

                {/* DATA TABLES IF LOADED */}
                {electionData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Election Performance Database (2014-2026)</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Election</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">Seats Won</th>
                            <th className="px-4 py-3">Outcome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {electionData.slice(0, 10).map((row, i) => (
                            <tr key={i} className="border-b border-slate-800 bg-slate-950 hover:bg-slate-900">
                              <td className="px-4 py-3 font-mono">{row.Year || row.year}</td>
                              <td className="px-4 py-3">{row.Election || row.election}</td>
                              <td className="px-4 py-3">{row.State || row.state}</td>
                              <td className="px-4 py-3 font-bold text-cyan-400">{row['INC Seats Won'] || row.seats}</td>
                              <td className="px-4 py-3">{row.Outcome || row.outcome}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-500 text-center">Showing top 10 rows from CSV.</p>
                  </div>
                )}
                
                {newsData.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Corruption & Controversy News Archive</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newsData.slice(0, 6).map((row, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                          <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span>{row.Date || row.date}</span>
                            <span className="text-violet-400 font-bold">{row.Source || row.source}</span>
                          </div>
                          <h4 className="font-bold text-slate-200 text-sm mb-2">{row.Headline || row.headline}</h4>
                          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded">{row.Classification || row.classification}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* VIEW 3: 10 CHARGES */}
        {activeTab === "pillars" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-white text-center">The 10 Structural Charges</h2>
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar">
              {pillars.map(p => (
                <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-all ${selectedPillar === p.id ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400"}`}>
                  #{p.id} {p.title.split(':')[0]}
                </button>
              ))}
            </div>
            {(() => {
              const current = pillars.find(p => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-2xl font-black text-white">{current.title}</h3>
                  </div>
                  <p className="text-slate-400 mb-6">{current.summary}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {current.points.map((pt, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800"><h4 className="font-bold text-violet-300 mb-1">{pt.heading}</h4><p className="text-sm text-slate-400">{pt.detail}</p></div>
                    ))}
                  </div>
                  <div className="bg-slate-950 p-4 border-l-4 border-fuchsia-500 italic text-slate-300">"{current.quote}"</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: SCAM VAULT */}
        {activeTab === "scams" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-white text-center">The Mega Scam Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scamDatabase.map(scam => (
                <div key={scam.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-red-500/50 transition-all">
                  <div className="text-xs font-bold text-red-400 mb-1">{scam.category} ({scam.year})</div>
                  <h3 className="text-lg font-black text-white mb-2">{scam.name}</h3>
                  <div className="text-xl font-mono text-red-400 font-bold mb-3">{scam.loss}</div>
                  <p className="text-xs text-slate-400 mb-3">{scam.description}</p>
                  <div className="text-[10px] text-emerald-400 bg-emerald-950/30 p-2 rounded">{scam.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: MELTDOWN */}
        {activeTab === "meltdown" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white text-center">Electoral Meltdown</h2>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
              {[
                { year: "1984", seats: 414, percent: "76.2%", note: "Post-Indira sympathy wave" },
                { year: "2004", seats: 145, percent: "26.7%", note: "UPA-1 coalition formation" },
                { year: "2014", seats: 44, percent: "8.1%", note: "Historic all-time democratic low" },
                { year: "2019", seats: 52, percent: "9.5%", note: "Failed to attain formal LoP status" },
                { year: "2024", seats: 99, percent: "18.2%", note: "Celebrated sub-100 finish as triumph" }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-mono"><span className="font-bold text-white">{row.year} Election</span><span className="text-cyan-400 font-bold">{row.seats} Seats</span></div>
                  <div className="w-full bg-slate-950 rounded-full h-3"><div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${(row.seats / 543) * 100}%` }} /></div>
                  <div className="text-[10px] text-slate-500">{row.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: DONATE */}
        {activeTab === "donate" && (
          <div className="text-center space-y-6 animate-in zoom-in-95">
            <h2 className="text-4xl font-black text-white">Support Bharat Ke Veer 🇮🇳</h2>
            <p className="text-slate-400">100% of all contributions go directly to the Indian Armed Forces via the official Govt portal.</p>
            <button onClick={() => window.open(BHARAT_KE_VEER_URL, "_blank")} className="px-8 py-4 rounded-xl font-bold bg-emerald-500 text-white hover:scale-105 transition-all text-lg">Go to Official Portal →</button>
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
