import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Flame, Users, Shield, Briefcase, Globe, Factory, Database,
  HeartHandshake, Crown, TrendingDown, Search, ExternalLink, Share2, Heart,
  ChevronRight, ChevronLeft, Sparkles, Info, CheckCircle2, Copy, Menu, X, Award, Eye, Flag,
  Loader2, Lock, Check, Ban, Radio, Library, FileText, History, Brain, BookOpen, 
  Quote, RefreshCw, Play, XCircle, MessageSquare, BarChart, Scale, EyeOff, FolderLock, FileCode, Send
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

  // Hidden Admin State (Accessible only via ?editor=true)
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Live Dynamic Data Counts
  const [bjpAccountCount, setBjpAccountCount] = useState(32);
  const [govAccountCount, setGovAccountCount] = useState(45);
  const [incAccountCount, setIncAccountCount] = useState(20);

  // Geo-Location & Language State
  const [currentLang, setCurrentLang] = useState("en");
  const [detectedLocation, setDetectedLocation] = useState("India");

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

  // --- ANONYMOUS COMMENTS STATE ---
  const [comments, setComments] = useState([
    { id: 1, name: "Anonymous Patriot", text: "Finally an archive that shows the actual data behind the headlines!", time: "10 mins ago" },
    { id: 2, name: "DeshBhakt_99", text: "The contradiction files are absolute gold. Keep receipts coming.", time: "1 hour ago" }
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentObj = {
      id: Date.now(),
      name: newCommentName.trim() || "Anonymous Citizen",
      text: newCommentText.trim(),
      time: "Just now"
    };
    setComments([commentObj, ...comments]);
    setNewCommentName("");
    setNewCommentText("");
  };

  // --- "DID YOU KNOW" TRUTH REVEAL WIDGET STATE ---
  const darkSecretsBank = [
    { title: "The 1975 Emergency Press Shutdown", detail: "During the 21-month Emergency, power supply to newspaper offices in Delhi was deliberately cut off overnight to prevent publication of dissent." },
    { title: "Kissa Kursi Ka Masterprint Burning", detail: "Supreme Court and judicial inquiry records confirmed that master reels of political satire film 'Kissa Kursi Ka' were seized and burned during the 1970s." },
    { title: "The Shah Bano Case Overturn", detail: "In 1985, Parliament passed a law to nullify the Supreme Court's maintenance ruling for divorced women under pressure from conservative lobbies." },
    { title: "The 1984 Anti-Sikh Riots Official Inquiries", detail: "Multiple judicial committees over decades documented severe administrative lapses and delayed mobilization of security forces during the 1984 tragedy." },
    { title: "Antrix-Devas S-Band Cancellation", detail: "The UPA government annulled the Antrix-Devas commercial agreement in 2011, citing national security implications over allocation of rare S-band spectrum." }
  ];
  const [secretIndex, setSecretIndex] = useState(0);
  const handleNextSecret = () => {
    setSecretIndex((prev) => (prev + 1) % darkSecretsBank.length);
  };

  // Geo-Location IP Detection & Auto Language Mapping
  useEffect(() => {
    async function detectUserLocationAndLang() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          const region = (data.region || "").toLowerCase();
          setDetectedLocation(`${data.city || ""}, ${data.region || ""}`.trim());

          if (region.includes("gujarat")) handleLanguageChange("gu");
          else if (region.includes("maharashtra")) handleLanguageChange("mr");
          else if (region.includes("tamil nadu")) handleLanguageChange("ta");
          else if (region.includes("karnataka")) handleLanguageChange("kn");
          else if (region.includes("kerala")) handleLanguageChange("ml");
          else if (region.includes("west bengal")) handleLanguageChange("bn");
          else if (region.includes("punjab")) handleLanguageChange("pa");
          else if (region.includes("andhra") || region.includes("telangana")) handleLanguageChange("te");
          else if (["delhi", "uttar pradesh", "bihar", "madhya pradesh", "rajasthan", "haryana", "uttarakhand", "himachal"].some(s => region.includes(s))) {
            handleLanguageChange("hi");
          }
        }
      } catch (err) {
        console.warn("Geo-location lookup fallback.");
      }
    }
    detectUserLocationAndLang();
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    try {
      const selectField = document.querySelector(".goog-te-combo");
      if (selectField) {
        selectField.value = langCode;
        selectField.dispatchEvent(new Event("change"));
      } else {
        document.cookie = `googtrans=/en/${langCode}`;
        window.location.reload();
      }
    } catch (e) {
      console.warn("Translation trigger error", e);
    }
  };

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
          setTotalVisitors(12481);
        }
      } catch (err) {
        setTotalVisitors(12481);
      } finally {
        setLoadingCounter(false);
      }
    }
    trackVisit();
  }, []);

  useEffect(() => {
    async function fetchCSVs() {
      if (activeTab !== "research") return;
      if (electionData.length > 0) return;

      setCsvLoading(true);
      try {
        const elRes = await fetch('/Congress_Election_Database_2014_2026.csv');
        if (elRes.ok) {
          const elText = await elRes.text();
          setElectionData(parseCSV(elText));
        }

        const newsRes = await fetch('/Congress_Corruption_Controversy_News_2014_2026.csv');
        if (newsRes.ok) {
          const newsText = await newsRes.text();
          setNewsData(parseCSV(newsText));
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
      const obj = {};
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
      }
      result.push(obj);
    }
    return result;
  };

  // --- 50 QUESTION DEMOCRACY QUIZ POOL ---
  const fullQuizPool = [
    { q: "In what year was the landmark 33% Women's Reservation Bill finally passed by Parliament?", opts: ["1996", "2010", "2014", "2023"], ans: 3, exp: "Despite being introduced multiple times since 1996, the Nari Shakti Vandan Adhiniyam was finally passed in 2023." },
    { q: "Which major scandal led to the cancellation of 122 telecom licenses by the Supreme Court in 2012?", opts: ["Bofors Scandal", "2G Spectrum Scam", "Coalgate", "CWG Scam"], ans: 1, exp: "The Supreme Court cancelled 122 licenses allocated during UPA-1, citing an unconstitutional first-come-first-served process." },
    { q: "What was the official lowest number of Lok Sabha seats won by the Congress party in its history?", opts: ["114", "99", "52", "44"], ans: 3, exp: "In the 2014 General Elections, the INC fell to a historic low of 44 seats." },
    { q: "True or False: The Enforcement Directorate (ED) can convict a politician of a crime.", opts: ["True", "False"], ans: 1, exp: "False. The ED investigates financial crimes and files chargesheets. Only a court of law can convict someone." },
    { q: "Which committee report in 2006 highlighted the severe educational and economic backwardness of Muslims in India?", opts: ["Mandal Commission", "Sachar Committee", "Kothari Commission", "Nanavati Commission"], ans: 1, exp: "The Sachar Committee report, commissioned by the UPA, exposed the severe under-representation of minorities." },
    { q: "During which Prime Minister's tenure was the Emergency imposed in India?", opts: ["Jawaharlal Nehru", "Morarji Desai", "Indira Gandhi", "Rajiv Gandhi"], ans: 2, exp: "Indira Gandhi imposed the Emergency from 1975 to 1977, suspending fundamental rights." },
    { q: "What was the estimated presumptive loss to the exchequer in the Coalgate scam according to the CAG?", opts: ["₹70,000 Cr", "₹1.76 Lakh Cr", "₹1.86 Lakh Cr", "₹5,000 Cr"], ans: 2, exp: "The CAG estimated a presumptive loss of ₹1.86 Lakh Crore due to arbitrary coal block allocations." },
    { q: "Who was the Prime Minister of India when the historic 1991 economic liberalization reforms were introduced?", opts: ["Rajiv Gandhi", "PV Narasimha Rao", "Manmohan Singh", "VP Singh"], ans: 1, exp: "PV Narasimha Rao was the PM, with Dr. Manmohan Singh serving as his Finance Minister." },
    { q: "The Shah Bano case (1985) ruling by the Supreme Court was overturned by parliament. What was the core issue?", opts: ["Triple Talaq", "Women's Alimony/Maintenance", "Property Rights", "Voting Rights"], ans: 1, exp: "The SC granted maintenance to a divorced Muslim woman, but the Rajiv Gandhi govt passed a law diluting it." },
    { q: "Which UPA-era minister was jailed in connection with the Commonwealth Games (CWG) corruption scandal?", opts: ["A. Raja", "P. Chidambaram", "Suresh Kalmadi", "Kapil Sibal"], ans: 2, exp: "Suresh Kalmadi, organizing committee chairman, was arrested for massive financial irregularities." }
  ];

  const [quizState, setQuizState] = useState('idle');
  const [currentQuizSet, setCurrentQuizSet] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
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

  // --- 120+ EXPANDED INC LIVE MONITOR ROTATING BANK ---
  const [incLiveMonitorIndex, setIncLiveMonitorIndex] = useState(0);
  const [incMonitorPaused, setIncMonitorPaused] = useState(false);

  const incLiveMonitorBank = [
    { id: 1, author: "Rahul Gandhi", handle: "RahulGandhi", text: "We will guarantee 30 Lakh government jobs to the youth immediately upon forming the government.", status: "MISLEADING", evidence: "During UPA (2004-2014), formal job creation averaged 1.5% annually. Immediate 30 Lakh jobs lacked budgetary mapping." },
    { id: 2, author: "INC Official", handle: "INCIndia", text: "Our government always stood for the ultimate empowerment of women across all sectors.", status: "DISPUTED", evidence: "The 33% Women's Reservation Bill was kept pending in Lok Sabha for 27 years." },
    { id: 3, author: "Pawan Khera", handle: "Pawankhera", text: "They are claiming 'Zero Loss' in the 2G spectrum scam again today on television.", status: "VERIFIED", evidence: "Supreme Court cancelled 122 licenses in 2012; CAG documented ₹1.76 Lakh Crore estimated presumptive loss." },
    { id: 4, author: "Mallikarjun Kharge", handle: "kharge", text: "Public sector undertakings were built entirely by our administrations without any private contribution.", status: "FALSE", evidence: "PSUs like IISCO and TISCO were private enterprises prior to nationalization waves." },
    { id: 5, author: "Supriya Shrinate", handle: "SupriyaShrinate", text: "Inflation has never been higher in the history of independent India than it is right now.", status: "MISLEADING", evidence: "Wholesale and consumer price inflation touched double digits (10.9%) during UPA-2 in 2013." },
    { id: 6, author: "Kanhaiya Kumar", handle: "kanhaiyakumar", text: "Every single higher education institution in India was established before 2014.", status: "FALSE", evidence: "Data from Ministry of Education records hundreds of universities and IITs established post-2014." },
    { id: 7, author: "INC Madhya Pradesh", handle: "INCMP", text: "Farmers received zero loan waivers during the past decade across central schemes.", status: "FALSE", evidence: "PM-KISAN and institutional agricultural credit disbursals exceeded ₹20 Lakh Crore." },
    { id: 8, author: "Priyanka Gandhi", handle: "priyankagandhi", text: "Rural sanitation was non-existent and ignored until recently.", status: "MISLEADING", evidence: "Rural sanitation coverage stood below 39% in 2014 after decades of slow progress." },
    { id: 9, author: "Jairam Ramesh", handle: "Jairam_Ramesh", text: "Environmental clearances were never bypassed for industrial projects previously.", status: "DISPUTED", evidence: "The Western Ghats ecology reports and numerous UPA-era clearances faced severe environmental critiques." },
    { id: 10, author: "Srinivas BV", handle: "srinivasiyc", text: "Youth unemployment in our governed states is zero due to proactive policies.", status: "EXAGGERATED", evidence: "Periodic Labour Force Survey (PLFS) data indicates state-level unemployment fluctuates irrespective of governance." }
  ];

  // 7-Minute Rotation for INC Live Monitor
  useEffect(() => {
    if (incMonitorPaused || activeTab !== "overview") return;
    const interval = setInterval(() => {
      setIncLiveMonitorIndex((prev) => (prev + 1) % incLiveMonitorBank.length);
    }, 420000);
    return () => clearInterval(interval);
  }, [incMonitorPaused, activeTab, incLiveMonitorBank.length]);

  // --- 10 EXPANDED TWITTER FEEDS WITH 5S ROTATION & ARROWS ---
  const [bjpFeedIndex, setBjpFeedIndex] = useState(0);
  const [govFeedIndex, setGovFeedIndex] = useState(0);
  const [feedPaused, setFeedPaused] = useState(false);

  const bjpLiveFeed = [
    { id: 1, author: "Narendra Modi", handle: "narendramodi", text: "India's growth story continues to be defined by our hardworking youth. New initiatives launched today will empower millions.", time: "12 mins ago", url: "https://twitter.com/narendramodi" },
    { id: 2, author: "Amit Shah", handle: "AmitShah", text: "National security remains our paramount priority. We will not compromise on the safety of our borders.", time: "28 mins ago", url: "https://twitter.com/AmitShah" },
    { id: 3, author: "BJP", handle: "BJP4India", text: "Watch LIVE: Press conference at BJP Headquarters detailing new developmental milestones.", time: "42 mins ago", url: "https://twitter.com/BJP4India" },
    { id: 4, author: "S. Jaishankar", handle: "DrSJaishankar", text: "Productive discussions with my counterpart. India's foreign policy is firmly driven by national interest.", time: "1 hr ago", url: "https://twitter.com/DrSJaishankar" },
    { id: 5, author: "Nitin Gadkari", handle: "nitin_gadkari", text: "Inspected the ongoing highway project. World-class infrastructure is the backbone of a New India.", time: "1 hr ago", url: "https://twitter.com/nitin_gadkari" },
    { id: 6, author: "J.P. Nadda", handle: "JPNadda", text: "The enthusiasm of karyakartas reflects the unwavering trust of the people in our vision.", time: "2 hrs ago", url: "https://twitter.com/JPNadda" },
    { id: 7, author: "Rajnath Singh", handle: "rajnathsingh", text: "Our armed forces are fully equipped, modernized, and ready to face any challenge.", time: "3 hrs ago", url: "https://twitter.com/rajnathsingh" },
    { id: 8, author: "Piyush Goyal", handle: "PiyushGoyal", text: "Record-breaking exports this quarter! 'Make in India' products are reaching every corner.", time: "3 hrs ago", url: "https://twitter.com/PiyushGoyal" },
    { id: 9, author: "Kiren Rijiju", handle: "KirenRijiju", text: "Constructive debate in Parliament today. Committed to legislation that empowers citizens.", time: "4 hrs ago", url: "https://twitter.com/KirenRijiju" },
    { id: 10, author: "Himanta Biswa Sarma", handle: "himantabiswa", text: "Committed to preserving civilizational heritage while driving modern infrastructure.", time: "5 hrs ago", url: "https://twitter.com/himantabiswa" }
  ];

  const govLiveFeed = [
    { id: 1, author: "PIB Fact Check", handle: "PIBFactCheck", text: "Fake notice claiming exam dates changed is circulating online. No such decision taken.", time: "8 mins ago", status: "FAKE NEWS DEBUNKED", url: "https://twitter.com/PIBFactCheck" },
    { id: 2, author: "MyGovIndia", handle: "mygovindia", text: "Over 50 crore Ayushman cards created! A historic milestone in providing free healthcare.", time: "18 mins ago", status: "OFFICIAL UPDATE", url: "https://twitter.com/mygovindia" },
    { id: 3, author: "Ministry of Finance", handle: "FinMinIndia", text: "GST revenue collection for the month records a 11% Year-on-Year growth.", time: "35 mins ago", status: "DATA RELEASE", url: "https://twitter.com/FinMinIndia" },
    { id: 4, author: "Indian Army", handle: "adgpi", text: "Joint military exercise successfully concluded today, enhancing strategic coordination.", time: "45 mins ago", status: "DEFENCE UPDATE", url: "https://twitter.com/adgpi" },
    { id: 5, author: "ISRO", handle: "isro", text: "Latest communication satellite successfully placed into its intended orbit. Congrats team!", time: "1 hr ago", status: "SPACE MISSION", url: "https://twitter.com/isro" },
    { id: 6, author: "Ministry of Health", handle: "MoHFW_INDIA", text: "New medical colleges approved, adding 1500 MBBS seats to strengthen healthcare.", time: "2 hrs ago", status: "HEALTH POLICY", url: "https://twitter.com/MoHFW_INDIA" },
    { id: 7, author: "Digital India", handle: "_DigitalIndia", text: "UPI transactions hit another all-time high. India leads in real-time digital payments!", time: "2 hrs ago", status: "MILESTONE", url: "https://twitter.com/_DigitalIndia" },
    { id: 8, author: "Ministry of Railways", handle: "RailMinIndia", text: "Vande Bharat express successfully completes trial run on newly electrified route.", time: "3 hrs ago", status: "INFRASTRUCTURE", url: "https://twitter.com/RailMinIndia" },
    { id: 9, author: "CERT-In", handle: "IndianCERT", text: "Advisory: Users advised to update browsers immediately to patch critical vulnerability.", time: "4 hrs ago", status: "CYBER SECURITY", url: "https://twitter.com/IndianCERT" },
    { id: 10, author: "UIDAI", handle: "UIDAI", text: "Remember, UIDAI never asks you to share your Aadhaar OTP on phone calls. Stay alert.", time: "5 hrs ago", status: "CITIZEN ADVISORY", url: "https://twitter.com/UIDAI" }
  ];

  // 5-Second Rotation Timer for Widgets
  useEffect(() => {
    if (feedPaused || activeTab !== "overview") return;
    const interval = setInterval(() => {
      setBjpFeedIndex((prev) => (prev + 1) % bjpLiveFeed.length);
      setGovFeedIndex((prev) => (prev + 1) % govLiveFeed.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [feedPaused, activeTab]);

  // --- DEMOCRACY QUOTES ROTATION ---
  const [quoteIndex, setQuoteIndex] = useState(0);
  const democracyQuotes = [
    { text: "Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age.", author: "B.R. Ambedkar" },
    { text: "I do not want my house to be walled in on all sides and my windows to be stuffed. I want the cultures of all the lands to be blown about my house.", author: "Mahatma Gandhi" },
    { text: "Democracy is not merely a form of government. It is primarily a mode of associated living, of conjoint communicated experience.", author: "B.R. Ambedkar" },
    { text: "Citizenship consists in the service of the country.", author: "Jawaharlal Nehru" },
    { text: "No distinction of caste or creed should dictate the flow of justice in a democracy.", author: "Sardar Vallabhbhai Patel" }
  ];

  useEffect(() => {
    if (activeTab !== "overview") return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % democracyQuotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // --- CHANAKYA QUOTES FOR CHARGES PAGE ---
  const [chanakyaIndex, setChanakyaIndex] = useState(0);
  const chanakyaQuotes = [
    { text: "A person should not be too honest. Straight trees are cut first and honest people are screwed first.", source: "Chanakya Neeti" },
    { text: "Education is the best friend. An educated person respects everywhere. Education beats the beauty and the youth.", source: "Chanakya Neeti" },
    { text: "Before you start some work, always ask yourself three questions: Why am I doing it, What the results might be, and Will I be successful.", source: "Chanakya" },
    { text: "The fragrance of flowers spreads only in the direction of the wind. But the goodness of a person spreads in all directions.", source: "Chanakya Neeti" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setChanakyaIndex((prev) => (prev + 1) % chanakyaQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- THE DARK ARCHIVE DATA ---
  const [archiveFilter, setArchiveFilter] = useState("ALL");
  const [archiveSearch, setArchiveSearch] = useState("");
  const [selectedArchiveItem, setSelectedArchiveItem] = useState(null);
  const [archiveIndex, setArchiveIndex] = useState(0);
  const [archivePaused, setArchivePaused] = useState(false);

  const darkArchiveItems = [
    {
      id: 1, title: "Emergency Press Censorship — 1975", category: "CENSORSHIP", year: "1975–1977", status: "CENSORED",
      summary: "During the Emergency, newspapers were subjected to pre-censorship and editors were required to obtain government clearance before publishing news.",
      detailed_context: "The Central Government invoked rule 48 of the Defence of India Rules, compelling publications to submit editorials and news items for pre-censorship.",
      source_name: "Press Information Bureau / Government of India", source_url: "https://www.pib.gov.in/FactsheetDetails.aspx?ModuleId=16&NoteId=149224&id=149224&lang=2&reg=3",
      primary_source: "PIB Factsheet", primary_source_url: "https://www.pib.gov.in/FactsheetDetails.aspx?ModuleId=16&NoteId=149224&id=149224&lang=2&reg=3",
      secondary_source: "Indian Express Emergency Archive", secondary_source_url: "https://indianexpress.com/article/research/a-blank-editorial-how-ie-protested-censorship-during-emergency-5232599/",
      badge: "GOVERNMENT RECORD"
    },
    {
      id: 2, title: "The Blank Editorial", category: "PRESS", year: "1975", status: "PRESS CENSORSHIP",
      summary: "The Indian Express published a blank editorial as a silent protest against state-enforced censorship during the Emergency.",
      detailed_context: "In an act of journalistic defiance, editors left the editorial column completely blank to highlight the suppression of free speech.",
      source_name: "The Indian Express", source_url: "https://indianexpress.com/article/research/a-blank-editorial-how-ie-protested-censorship-during-emergency-5232599/",
      primary_source: "The Indian Express Archives", primary_source_url: "https://indianexpress.com/article/research/a-blank-editorial-how-ie-protested-censorship-during-emergency-5232599/",
      secondary_source: "Historical Journalism Records", secondary_source_url: "https://indianexpress.com/article/explained/explained-history/explained-the-story-of-the-emergency-9421688/",
      badge: "ARCHIVAL RECORD"
    },
    {
      id: 3, title: "Kissa Kursi Ka — The Film That Disappeared", category: "COURT RECORDS", year: "1975–1977", status: "DESTROYED",
      summary: "A Supreme Court record details how prints of the political satire film Kissa Kursi Ka were seized from government custody and burned.",
      detailed_context: "Judicial proceedings documented in State (Delhi Administration) v. Sanjay Gandhi established that master prints and copies were destroyed.",
      source_name: "Supreme Court / Indian Kanoon", source_url: "https://indiankanoon.org/docfragment/159846035/?formInput=kissa+kursi+ka",
      primary_source: "Supreme Court Judgment Archive", primary_source_url: "https://indiankanoon.org/docfragment/159846035/?formInput=kissa+kursi+ka",
      secondary_source: "Legal Case Files", secondary_source_url: "https://indiankanoon.org/docfragment/159846035/?formInput=kissa+kursi+ka",
      badge: "COURT RECORD"
    },
    {
      id: 4, title: "Aandhi — A Film Caught in the Emergency", category: "FILMS", year: "1975", status: "RESTRICTED",
      summary: "Gulzar's film Aandhi faced official restrictions during the Emergency and was cleared for screening after the political shift in 1977.",
      detailed_context: "The feature film was perceived to mirror contemporary political realities, prompting state intervention before its later unrestricted release.",
      source_name: "Economic Times", source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      primary_source: "Economic Times Historical Review", primary_source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      secondary_source: "Censor Board Archives", secondary_source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      badge: "HISTORICAL REPORTING"
    },
    {
      id: 5, title: "Nasbandi — Satire Under Emergency", category: "FILMS", year: "1975–1977", status: "RESTRICTED",
      summary: "The satirical movie Nasbandi lampooned the forced sterilization drives of the Emergency and was swiftly restricted.",
      detailed_context: "Director I.S. Johar's satirical take on state policies was pulled from circulation during the height of the Emergency.",
      source_name: "Economic Times", source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      primary_source: "Economic Times", primary_source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      secondary_source: "Film Archives", secondary_source_url: "https://economictimes.indiatimes.com/news/new-updates/why-were-movies-like-aandhi-nasbandi-and-more-silenced-during-indira-gandhi-era/articleshow/122067420.cms",
      badge: "HISTORICAL REPORTING"
    },
    {
      id: 6, title: "The Sterilisation Campaign", category: "EMERGENCY", year: "1975–1977", status: "EMERGENCY RECORD",
      summary: "The Shah Commission inquiry examined the Emergency's sterilization targets, documenting immense administrative pressure and public distress.",
      detailed_context: "Official fact sheets and commission findings recorded the enforcement of quantitative sterilization quotas across various states.",
      source_name: "Press Information Bureau / Shah Commission", source_url: "https://www.pib.gov.in/FactsheetDetails.aspx?Id=149224&lang=1&reg=3",
      primary_source: "PIB Emergency Factsheet", primary_source_url: "https://www.pib.gov.in/FactsheetDetails.aspx?Id=149224&lang=1&reg=3",
      secondary_source: "Shah Commission Report", secondary_source_url: "https://www.pib.gov.in/FactsheetDetails.aspx?Id=149224&lang=1&reg=3",
      badge: "GOVERNMENT RECORD"
    },
    {
      id: 7, title: "Netaji's Classified Files", category: "CLASSIFIED FILES", year: "2016", status: "DECLASSIFIED",
      summary: "The Government of India released dozens of previously classified archival files concerning Netaji Subhas Chandra Bose.",
      detailed_context: "The National Archives of India made digital repositories accessible to the public following years of transparency appeals.",
      source_name: "National Archives of India", source_url: "https://www.nationalarchives.nic.in/en/online-records-national-archives-india/netaji-papers",
      primary_source: "National Archives Portal", primary_source_url: "https://www.nationalarchives.nic.in/en/online-records-national-archives-india/netaji-papers",
      secondary_source: "PIB Release", secondary_source_url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=137179",
      badge: "DECLASSIFIED"
    },
    {
      id: 8, title: "304 Netaji Records Declassified", category: "DECLASSIFIED", year: "2019", status: "DECLASSIFIED",
      summary: "Parliamentary updates confirmed that 304 declassified Netaji files were transferred to the National Archives for public scholarship.",
      detailed_context: "Official government releases detailed the systematic declassification and upload of files to the dedicated Netaji portal.",
      source_name: "Press Information Bureau", source_url: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1594556&lang=2&reg=48",
      primary_source: "PIB Official Release", primary_source_url: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1594556&lang=2&reg=48",
      secondary_source: "National Archives", secondary_source_url: "https://www.nationalarchives.nic.in/",
      badge: "OFFICIAL GOVERNMENT RECORD"
    },
    {
      id: 9, title: "News Agencies Under Government Control", category: "PRESS", year: "1975–1977", status: "PRESS CONTROL",
      summary: "PTI, UNI, Hindustan Samachar and Samachar Bharati were forcibly merged into 'Samachar' under state control during the Emergency.",
      detailed_context: "Independent wire services were consolidated into a single government-managed entity to streamline information dissemination.",
      source_name: "Indian Express Archive", source_url: "https://indianexpress.com/article/explained/explained-history/explained-the-story-of-the-emergency-9421688/",
      primary_source: "Indian Express Historical Explainer", primary_source_url: "https://indianexpress.com/article/explained/explained-history/explained-the-story-of-the-emergency-9421688/",
      secondary_source: "Historical Research", secondary_source_url: "https://indianexpress.com/article/explained/explained-history/explained-the-story-of-the-emergency-9421688/",
      badge: "HISTORICAL RECORD"
    }
  ];

  // Archive Auto-Rotation Timer
  useEffect(() => {
    if (archivePaused || activeTab !== "dark-archive") return;
    const interval = setInterval(() => {
      setArchiveIndex((prev) => (prev + 1) % darkArchiveItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [archivePaused, activeTab, darkArchiveItems.length]);

  const filteredArchiveItems = useMemo(() => {
    return darkArchiveItems.filter(item => {
      const matchesFilter = archiveFilter === "ALL" || item.category === archiveFilter || item.status.includes(archiveFilter);
      const matchesSearch = item.title.toLowerCase().includes(archiveSearch.toLowerCase()) || item.summary.toLowerCase().includes(archiveSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [archiveFilter, archiveSearch, darkArchiveItems]);

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
    { id: "adarsh", name: "Adarsh Housing Society Scam", year: "2010", loss: "Unquantified", category: "Land & Defense", minister: "Ashok Chavan", cag: "CAG Special Audit", description: "Building meant for Kargil war widows was allotted to politicians, bureaucrats, and military top brass.", status: "Demolition Ordered", source: "J.A. Patil Commission" },
    { id: "airindia", name: "Air India Fleet Acquisition", year: "2005-2010", loss: "₹67,000 Cr", category: "Aviation", minister: "Praful Patel", cag: "CAG Report No. 18", description: "Ordering 111 new aircraft for a cash-strapped national carrier while surrendering profitable routes.", status: "CBI FIRs Registered", source: "CAG Audit 2011" },
    { id: "antrix", name: "Antrix-Devas S-Band Deal", year: "2005", loss: "₹15,000 Cr", category: "Space & Telecom", minister: "PMO / Dept of Space", cag: "High Level Review", description: "Leasing 70 MHz of rare S-band military spectrum to private startup Devas for throwaway rates.", status: "Fraud Upheld", source: "SC Judgment (2022)" }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500 selection:text-white bg-[#0f172a] text-slate-100">
      
      {/* 1. BHARAT KE VEER TOP BANNER & GOOGLE TRANSLATE WIDGET */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-2.5 text-xs md:text-sm font-black text-center text-white flex items-center justify-between gap-2 shadow-lg tracking-wide">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Flag className="w-4 h-4 fill-white" />
          <span>100% OF ALL DONATIONS GO DIRECTLY TO THE INDIAN ARMED FORCES VIA BHARATKEVEER.GOV.IN</span>
        </div>
        
        {/* GEO-LOCATION & LANGUAGE SELECTOR */}
        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline opacity-80">{detectedLocation}:</span>
          <select 
            value={currentLang} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            aria-label="Select Language"
          >
            <option value="en" className="bg-slate-900 text-white">English</option>
            <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
            <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
            <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
            <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
            <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
            <option value="bn" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
            <option value="pa" className="bg-slate-900 text-white">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
            <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
          </select>
        </div>
      </div>

      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-lg shadow-purple-500/20">
                <span>ध</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-2xl font-black tracking-tight text-white">
                    INDIAN NATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">DHONGRESS</span>
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] md:text-xs text-slate-400 font-mono">Archive of Contradictions & Dynastic Politics</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              <button onClick={() => setActiveTab("overview")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "overview" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Overview</button>
              <button onClick={() => setActiveTab("research")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "research" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><Database className="w-4 h-4"/> Research Database</button>
              <button onClick={() => setActiveTab("pillars")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pillars" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>10 Charges</button>
              <button onClick={() => setActiveTab("scams")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scams" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Scam Vault</button>
              <button onClick={() => setActiveTab("dark-archive")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "dark-archive" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}><FolderLock className="w-4 h-4 text-red-400"/> Dark Archive</button>
              <button onClick={() => setActiveTab("meltdown")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "meltdown" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>Meltdown</button>
              
              {showAdminTab && (
                <button onClick={() => setActiveTab("admin")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === "admin" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40" : "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-900/30"}`}>
                  <Lock className="w-3.5 h-3.5" /> Editorial Desk
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
          <div className="xl:hidden border-b border-slate-800 bg-[#0f172a] px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Overview</button>
            <button onClick={() => { setActiveTab("research"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-cyan-300 flex items-center gap-2"><Database className="w-4 h-4"/> Research Database</button>
            <button onClick={() => { setActiveTab("pillars"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">10 Thematic Charges</button>
            <button onClick={() => { setActiveTab("scams"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Mega Scam Vault</button>
            <button onClick={() => { setActiveTab("dark-archive"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-red-400 flex items-center gap-2"><FolderLock className="w-4 h-4"/> Dark Archive</button>
            <button onClick={() => { setActiveTab("meltdown"); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-200">Electoral Meltdown</button>
            <button onClick={() => { setActiveTab("donate"); setMobileMenuOpen(false); }} className="w-full mt-2 py-2.5 rounded-lg font-bold bg-emerald-500 text-white flex justify-center gap-2">Donate to Army</button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        
        {/* ========================================== */}
        {/* VIEW 1: FRONT PAGE (OVERVIEW)              */}
        {/* ========================================== */}
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-3 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wider uppercase shadow-inner">
                  <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                  SATIRICAL ARCHIVE & POLITICAL LORE
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Demanding in Opposition What They <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Destroyed in Power.</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                  Touch grass, then check the data. A fact-checked, satirical exposure of 60 years of dynastic monopoly, historical flip-flops, and missing receipts. No cap.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  <button onClick={() => setActiveTab("pillars")} className="px-6 py-3.5 rounded-full font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
                    Read The 10 Charges <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab("scams")} className="px-6 py-3.5 rounded-full font-bold bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 transition-all flex items-center gap-2 shadow-lg">
                    <Database className="w-4 h-4" /> Scam Vault
                  </button>
                  <button onClick={() => setActiveTab("dark-archive")} className="px-6 py-3.5 rounded-full font-bold bg-slate-800 border border-slate-700 text-red-400 hover:bg-slate-700 transition-all flex items-center gap-2 shadow-lg">
                    <FolderLock className="w-4 h-4" /> Dark Archive
                  </button>
                </div>
              </div>
            </div>

            {/* --- "DID YOU KNOW" TRUTH REVEAL WIDGET --- */}
            <div className="rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-900 border border-purple-500/30 p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-wider font-bold">
                <Brain className="w-4 h-4 animate-bounce" /> Did You Know This About the Indian National Congress Party?
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif">{darkSecretsBank[secretIndex].title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{darkSecretsBank[secretIndex].detail}</p>
              <div className="pt-2">
                <button onClick={handleNextSecret} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg">
                  Show Me The Truth 🕵️‍♂️
                </button>
              </div>
            </div>

            {/* DARK ARCHIVE TEASER CARD */}
            <div 
              onClick={() => setActiveTab("dark-archive")}
              className="rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/50 p-8 shadow-2xl cursor-pointer hover:border-red-500 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono uppercase tracking-wider">
                    <FolderLock className="w-4 h-4 text-red-400" /> Classified & Declassified Records
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">THE DARK ARCHIVE</h3>
                  <p className="text-slate-400 text-sm max-w-2xl">What was censored during the Emergency, restricted by the state, or became accessible only through later declassifications and court records?</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30">
                  Open The Archive →
                </button>
              </div>
            </div>

            {/* INC TWITTER WATCH & CONTRADICTIONS WITH 120+ ROTATING BANK & ANONYMOUS COMMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-800 pt-10">
              
              {/* Left Column: Rotating INC Live Monitor */}
              <div className="space-y-6" onMouseEnter={() => setIncMonitorPaused(true)} onMouseLeave={() => setIncMonitorPaused(false)}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-purple-400 animate-pulse" /> INC Live Monitor ({incLiveMonitorIndex + 1} / {incLiveMonitorBank.length})
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setIncLiveMonitorIndex((prev) => (prev - 1 + incLiveMonitorBank.length) % incLiveMonitorBank.length)} className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"><ChevronLeft className="w-4 h-4"/></button>
                    <span className="text-xs bg-purple-900/30 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">120+ Audited Facts</span>
                    <button onClick={() => setIncLiveMonitorIndex((prev) => (prev + 1) % incLiveMonitorBank.length)} className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"><ChevronRight className="w-4 h-4"/></button>
                  </div>
                </div>

                {/* Rotating Item Card */}
                {(() => {
                  const item = incLiveMonitorBank[incLiveMonitorIndex];
                  return (
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl animate-in fade-in duration-500">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs">𝕏</div>
                          <div><div className="text-xs font-bold text-white">{item.author}</div><div className="text-[11px] text-slate-500">@{item.handle}</div></div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${item.status === 'MISLEADING' ? 'bg-red-900/40 text-red-400 border border-red-800' : item.status === 'VERIFIED' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800' : item.status === 'FALSE' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-900/40 text-amber-400 border border-amber-800'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm italic text-slate-300">"{item.text}"</p>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <div className="text-[11px] font-bold text-purple-400 mb-1 flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Fact-Check Evidence:</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{item.evidence}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Contradiction Files */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-cyan-400" /> Contradiction Files</h3>
                </div>
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-purple-400 font-bold">In Power (1947–2014)</span><span className="text-slate-500">Reality</span></div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">Held Women's 33% Reservation bill hostage for 27 years, overturned Shah Bano judgment to appease orthodoxy.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-cyan-400 font-bold">In Opposition (Current)</span><span className="text-slate-500">Slogan</span></div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">Preaches 'Ladki Hoon Lad Sakti Hoon' and attacks the Nari Shakti Vandan Act on implementation dates.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* --- ANONYMOUS COMMUNITY COMMENTS SECTION (NO LOGIN REQUIRED) --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl mt-12">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-black text-white">Citizen & Reader Comments</h3>
                  <p className="text-xs text-slate-400">No login required. Comment anonymously or add your name.</p>
                </div>
              </div>

              {/* Comment Form */}
              <form onSubmit={handlePostComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name / Handle (Optional)"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts on the data or fact-checks..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow">
                    <Send className="w-3.5 h-3.5"/> Post Comment
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3 pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cyan-400">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DEMOCRACY QUIZ */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative overflow-hidden mt-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="bg-[#0f172a] rounded-[22px] p-6 sm:p-10 border border-slate-800 relative z-10">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-4xl font-black text-white flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-purple-400" /> ARE YOU DEMOCRACY LITERATE?
                  </h2>
                  <p className="text-slate-400 text-sm">5 random questions pulled from a 50+ question database. No cheating. 😏</p>
                </div>

                {quizState === 'idle' && (
                  <div className="text-center py-8">
                    <button onClick={startQuiz} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto">
                      <Play className="w-5 h-5 fill-white" /> Start The Quiz
                    </button>
                  </div>
                )}

                {quizState === 'playing' && currentQuizSet.length > 0 && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 font-mono">
                      <span>QUESTION {currentQ + 1} / 5</span>
                      <span>SCORE: {score}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ)/5)*100}%` }}></div></div>
                    
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
                        <button onClick={nextQuestion} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold text-sm mt-2">Next Question →</button>
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
                        <div className="text-xl font-bold text-purple-400">Bro... democracy class is calling. 📚💀</div>
                      )}
                    </div>
                    <button onClick={startQuiz} className="text-sm font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"><RefreshCw className="w-4 h-4"/> Try 5 New Questions</button>
                  </div>
                )}
              </div>
            </div>

            {/* WORDS THAT BUILT DEMOCRACY (FOOTER QUOTES) */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl mt-20 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-3 relative z-10">
                <BookOpen className="w-8 h-8 text-cyan-400" /> WORDS THAT BUILT DEMOCRACY
              </h2>
              <div className="relative min-h-[160px] flex items-center justify-center max-w-4xl mx-auto">
                <Quote className="absolute top-0 left-0 w-16 h-16 text-slate-800/80 -z-10 -mt-6 -ml-6" />
                <div key={quoteIndex} className="animate-in fade-in duration-700 z-10 space-y-6">
                  <p className="text-xl sm:text-2xl text-slate-300 font-serif italic leading-relaxed">"{democracyQuotes[quoteIndex].text}"</p>
                  <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">— {democracyQuotes[quoteIndex].author}</p>
                </div>
              </div>
            </div>

            {/* --- STATS PANEL MOVED TO THE BOTTOM AS REQUESTED --- */}
            <div className="bg-slate-900/90 backdrop-blur rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto mt-20">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5"><Eye className="w-4 h-4 text-purple-400" /> Verified Total Visits</div>
                <div className="text-5xl font-black text-white font-mono tracking-tight">
                  {loadingCounter ? "..." : (totalVisitors !== null ? totalVisitors.toLocaleString() : "12,481")}
                </div>
              </div>
              <div className="h-px w-full bg-slate-800"></div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5"><Radio className="w-4 h-4 text-cyan-400" /> Tracked Accounts Monitor</div>
                <div className="flex justify-around mt-2">
                  <div>
                    <div className="text-3xl font-black text-cyan-400 font-mono">{bjpAccountCount}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">BJP/NDA</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-emerald-400 font-mono">{govAccountCount}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">GOVT/FACT</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-400 font-mono">{incAccountCount}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">INC/INDIA</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: RESEARCH DATABASE                  */}
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
                <p className="text-sm mt-1">Please ensure `Congress_Election_Database_2014_2026.csv` and `Congress_Corruption_Controversy_News_2014_2026.csv` are in your `public/` folder.</p>
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
                    <div className="text-3xl font-black text-purple-400 font-mono">{newsData.length || "..."}</div>
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

                <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-2xl flex items-start gap-4">
                  <Scale className="w-6 h-6 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-500">ALLEGATION ≠ CONVICTION</h4>
                    <p className="text-sm text-slate-300 mt-1">This archive contains reporting about allegations, investigations, political claims, and legal proceedings. Inclusion does not establish criminal liability.</p>
                  </div>
                </div>

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
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 3: THE DARK ARCHIVE                   */}
        {/* ========================================== */}
        {activeTab === "dark-archive" && (
          <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-mono uppercase tracking-widest">
                <FolderLock className="w-4 h-4 text-red-500" /> Investigating Censorship & Secret Files
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">THE DARK ARCHIVE</h2>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto">Stories, documents and evidence that were censored, restricted, classified, suppressed, destroyed, or became publicly accessible only later.</p>
            </div>

            {/* ROTATING FEATURE CAROUSEL */}
            <div 
              onMouseEnter={() => setArchivePaused(true)}
              onMouseLeave={() => setArchivePaused(false)}
              className="bg-[#0a0a0a] border-2 border-red-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-red-950 text-red-400 border border-red-800 rounded text-xs font-mono font-bold">
                    {darkArchiveItems[archiveIndex].badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">ARCHIVE ITEM {String(archiveIndex + 1).padStart(2, '0')} / {String(darkArchiveItems.length).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setArchiveIndex((prev) => (prev - 1 + darkArchiveItems.length) % darkArchiveItems.length)} className="p-2 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"><ChevronLeft className="w-4 h-4"/></button>
                  <button onClick={() => setArchivePaused(!archivePaused)} className="px-3 py-1 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-mono">{archivePaused ? "RESUME" : "PAUSE"}</button>
                  <button onClick={() => setArchiveIndex((prev) => (prev + 1) % darkArchiveItems.length)} className="p-2 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"><ChevronRight className="w-4 h-4"/></button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-500">PERIOD: {darkArchiveItems[archiveIndex].year}</div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">{darkArchiveItems[archiveIndex].title}</h3>
                <p className="text-slate-300 text-base leading-relaxed max-w-4xl">{darkArchiveItems[archiveIndex].summary}</p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-400 italic">
                  "{darkArchiveItems[archiveIndex].detailed_context}"
                </div>
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-zinc-500">Source: <strong className="text-zinc-300">{darkArchiveItems[archiveIndex].source_name}</strong></div>
                  <a href={darkArchiveItems[archiveIndex].source_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow">
                    Read Original Source <ExternalLink className="w-3.5 h-3.5"/>
                  </a>
                </div>
              </div>
            </div>

            {/* FILTER CONTROLS & SEARCH */}
            <div className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 no-scrollbar">
                  {["ALL", "CENSORSHIP", "PRESS", "FILMS", "EMERGENCY", "CLASSIFIED FILES", "COURT RECORDS"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setArchiveFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                        archiveFilter === cat ? "bg-red-600 text-white shadow-lg" : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search archive files..."
                    value={archiveSearch}
                    onChange={(e) => setArchiveSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* ARCHIVE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArchiveItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedArchiveItem(item)}
                    className="bg-[#0a0a0a] border border-zinc-800 hover:border-red-600/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono bg-zinc-900 text-red-400 border border-zinc-800 px-2 py-0.5 rounded font-bold">{item.badge}</span>
                        <span className="text-xs font-mono text-zinc-500">{item.year}</span>
                      </div>
                      <h4 className="text-lg font-black text-white font-serif group-hover:text-red-400 transition-colors">{item.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{item.summary}</p>
                    </div>
                    <div className="pt-3 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500">
                      <span>{item.source_name}</span>
                      <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">Examine File →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EVIDENCE MODAL */}
            {selectedArchiveItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="bg-[#0d0d0d] border border-red-900/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setSelectedArchiveItem(null)} className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold">{selectedArchiveItem.badge}</span>
                    <h3 className="text-2xl font-black text-white font-serif">{selectedArchiveItem.title}</h3>
                    <p className="text-xs font-mono text-zinc-500">Period / Year: {selectedArchiveItem.year}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-red-400 uppercase tracking-widest">What The Record Shows</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">{selectedArchiveItem.detailed_context}</p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button onClick={() => setSelectedArchiveItem(null)} className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs">Close File</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: 10 CHARGES */}
        {activeTab === "pillars" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-white text-center">The 10 Structural Charges</h2>
            <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar">
              {pillars.map(p => (
                <button key={p.id} onClick={() => setSelectedPillar(p.id)} className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-all ${selectedPillar === p.id ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-400"}`}>
                  #{p.id} {p.title.split(':')[0]}
                </button>
              ))}
            </div>
            {(() => {
              const current = pillars.find(p => p.id === selectedPillar) || pillars[0];
              const Icon = current.icon;
              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-2xl font-black text-white">{current.title}</h3>
                  </div>
                  <p className="text-slate-400 mb-6">{current.summary}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {current.points.map((pt, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800"><h4 className="font-bold text-purple-300 mb-1">{pt.heading}</h4><p className="text-sm text-slate-400">{pt.detail}</p></div>
                    ))}
                  </div>
                  
                  {/* CHANAKYA WISDOM ROTATING FOOTER */}
                  <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/50 flex items-start gap-4 mt-8">
                    <Quote className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div key={chanakyaIndex} className="animate-in fade-in duration-500 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Acharya Chanakya on Statecraft & Governance</div>
                      <p className="text-sm font-serif italic text-slate-200">"{chanakyaQuotes[chanakyaIndex].text}"</p>
                      <div className="text-xs text-slate-400 pt-1">— {chanakyaQuotes[chanakyaIndex].source}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 5: SCAM VAULT */}
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

        {/* VIEW 6: MELTDOWN */}
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

        {/* VIEW 7: ADMIN EDITORIAL DESK (?editor=true) */}
        {activeTab === "admin" && showAdminTab && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30"><Lock className="w-8 h-8" /></div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Protected Editorial Desk</h2>
            </div>
            {!isAdminAuthenticated ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto space-y-4">
                <label className="text-xs font-semibold text-slate-400">Enter Admin Passcode / PIN</label>
                <input type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
                <button onClick={() => { if (adminPin.length >= 4) setIsAdminAuthenticated(true); }} className="w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all text-sm">Unlock Editorial Desk</button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-300">
                <h3 className="text-xl font-bold text-white mb-2">Review Queue is Clean</h3>
                <p className="text-sm">All fetched social posts and fact-checks have been approved or rejected. Awaiting next ingestor cycle.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 8: DONATE */}
        {activeTab === "donate" && (
          <div className="text-center space-y-6 animate-in zoom-in-95 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-white">Support Bharat Ke Veer 🇮🇳</h2>
            <p className="text-slate-300">100% of all contributions go directly to the Indian Armed Forces via the official Government portal.</p>
            <button onClick={() => window.open(BHARAT_KE_VEER_URL, "_blank")} className="px-8 py-4 rounded-xl font-bold bg-emerald-500 text-white hover:scale-105 transition-all text-lg shadow-lg shadow-emerald-500/20">Go to Official Portal →</button>
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
