 import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Check,
  Copy,
  Leaf,
  Menu,
  X,
  ChevronRight,
  Command,
  Search,
  Terminal,
  Sparkles,
  Recycle,
  CheckCircle2,
  ChevronDown,
  Sliders,
  Compass,
  Sun,
  Moon,
  Upload,
  Lock
} from 'lucide-react';

// ============================================================================
// IMMUTABLE PROFILE ASSET CONFIGURATION (LOCKED — CANNOT BE CHANGED)
// ============================================================================
const LOCKED_PORTRAIT_CONFIG = Object.freeze({
  src: 'Smith sharma jpg_5.jpg',
  alt: 'Smith Sharma — Founder of YANVI and Aspiring MERN Stack Developer'
});
const PORTRAIT_STORAGE_KEY = 'smith_sharma_locked_portrait_v2';

// ============================================================================
// CUSTOM HOOK: SCROLL-TRIGGERED REVEAL ANIMATION
// ============================================================================
function useScrollReveal(options = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [options]);

  return [ref, isVisible];
}

// ============================================================================
// COMPONENT: EDITORIAL REVEAL BLOCK
// ============================================================================
function RevealBlock({ children, delay = 0, className = '' }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================================
// COMPONENT: MAGNETIC BUTTON WRAPPER
// ============================================================================
function MagneticButton({ children, className = '', onClick, href, ...props }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'transform 0.08s ease-out'
  };

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================================
// COMPONENT: LOCKED PORTRAIT RENDERER (ONE-TIME INSERT + PERMANENT LOCK)
// ============================================================================
function LockedPortraitImage({
  portraitSrc,
  onInsertPhoto,
  allowInsertButton = false,
  className = '',
  style
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImgFailed(false);
  }, [portraitSrc]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        onInsertPhoto?.(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (imgFailed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#132544] via-[#1B335C] to-[#0B1324] text-[#F8FAFC] select-none p-4 text-center ${className}`}
        style={style}
      >
        <span className="font-display font-bold text-2xl tracking-wider text-[#93C5FD]">SS</span>
        {allowInsertButton && (
          <>
            <p className="font-mono-tech text-[11px] text-[#CBD5E1] mt-2 max-w-[210px] leading-relaxed">
              Insert your photo once to lock it across your entire portfolio.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#60A5FA] hover:bg-[#93C5FD] text-[#0B1324] font-mono-tech text-[11px] font-semibold uppercase tracking-wider shadow-lg transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Insert My Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    );
  }

  return (
    <img
      src={portraitSrc}
      alt={LOCKED_PORTRAIT_CONFIG.alt}
      draggable={false}
      onError={() => setImgFailed(true)}
      onContextMenu={(e) => e.preventDefault()}
      style={style}
      className={`locked-portrait-img ${className}`}
    />
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Eye-Pleasing Navy Theme Mode: 'midnight' (Velvet Sapphire) | 'coastal' (Soft Mist Navy)
  const [navyMode, setNavyMode] = useState('midnight');
  const isLight = navyMode === 'coastal';

  // Fixed Permanent Portrait Photo State (Locked to Smith sharma jpg_5.jpg)
  const [portraitSrc, setPortraitSrc] = useState(() => {
    try {
      return localStorage.getItem(PORTRAIT_STORAGE_KEY) || LOCKED_PORTRAIT_CONFIG.src;
    } catch {
      return LOCKED_PORTRAIT_CONFIG.src;
    }
  });
  const [isPortraitLocked, setIsPortraitLocked] = useState(() => {
    try {
      return Boolean(localStorage.getItem(PORTRAIT_STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const handleInsertAndLockPhoto = (dataUrl) => {
    setPortraitSrc(dataUrl);
    setIsPortraitLocked(true);
    try {
      localStorage.setItem(PORTRAIT_STORAGE_KEY, dataUrl);
    } catch {
      // Keep in active session memory if file exceeds quota
    }
    triggerToast('Photo inserted and permanently locked across your portfolio.');
  };

  // Navigation & Scroll Telemetry State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive Command Palette (Cmd/Ctrl + K)
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const cmdInputRef = useRef(null);

  // Interactive Hero Role Switcher
  const [activeHeroRole, setActiveHeroRole] = useState(0);

  // Subtle 3D Tilt & Glare on Portrait Card
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });

  // Interactive Skills Lab Filter & Selected Skill Inspector
  const [skillFilter, setSkillFilter] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('React.js');

  // Projects Filter, Spotlight Cursor Coordinates, & Modal Mini-Demos
  const [projectFilter, setProjectFilter] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [cardSpotlights, setCardSpotlights] = useState({});
  const [consoleView, setConsoleView] = useState('roster');
  const [demoGridVisible, setDemoGridVisible] = useState(true);

  // YANVI Interactive Transformation Pipeline & Product Concept Selection
  const [yanviStage, setYanviStage] = useState(0);
  const [selectedYanviProduct, setSelectedYanviProduct] = useState(0);

  // Interactive Timeline Filter & Expanded Cards
  const [timelineFilter, setTimelineFilter] = useState('All');
  const [expandedTimelineIdx, setExpandedTimelineIdx] = useState({ 0: true, 1: true });

  // Interactive 5-Phase Roadmap Active Stepper
  const [activeRoadmapIdx, setActiveRoadmapIdx] = useState(0);

  // Contact Copy, Topic Chips & Mailto Composer State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Web / MERN Collaboration');
  const [contactForm, setContactForm] = useState({
    senderName: '',
    subject: 'Web / MERN Collaboration — Smith Sharma',
    body: ''
  });

  // Toast Notification & Ambient Grid Toggle
  const [toastMessage, setToastMessage] = useState(null);
  const [showAmbientGrid, setShowAmbientGrid] = useState(true);

  // Desktop Custom Follower Cursor Refs
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [cursorHovered, setCursorHovered] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Keyboard shortcut listener for Cmd/Ctrl + K and Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
        setActiveProjectModal(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (cmdOpen) {
      setCmdQuery('');
      setTimeout(() => cmdInputRef.current?.focus(), 40);
    }
  }, [cmdOpen]);

  // Scroll listener for reading progress bar, sticky header & active section highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0);
      setScrolled(scrollTop > 36);

      const sections = ['hero', 'about', 'skills', 'projects', 'yanvi', 'journey', 'roadmap', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveNav(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop Custom Cursor Follower
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !isFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      const interactive = e.target.closest('a, button, input, textarea, select, [data-cursor="hover"]');
      setCursorHovered(Boolean(interactive));
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 3D Portrait Tilt & Glare Handlers
  const handlePortraitMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    const yRel = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: -(yRel - 0.5) * 11,
      y: (xRel - 0.5) * 11,
      glareX: Math.round(xRel * 100),
      glareY: Math.round(yRel * 100),
      active: true
    });
  };

  const handlePortraitMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  // Copy Direct Email Handler
  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('smithsharmasubedi@gmail.com');
    setCopiedEmail(true);
    triggerToast('Email copied: smithsharmasubedi@gmail.com');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Direct Mailto Composer Launch Handler
  const handleMailtoSubmit = (e) => {
    e.preventDefault();
    const subjectEncoded = encodeURIComponent(contactForm.subject || 'Hello Smith Sharma');
    const bodyText = `Hi Smith,\n\n${contactForm.body}\n\nBest regards,\n${contactForm.senderName || 'Website Visitor'}`;
    const bodyEncoded = encodeURIComponent(bodyText);
    window.location.href = `mailto:smithsharmasubedi@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;
    triggerToast('Opening your email client to send message...');
  };

  // Spotlight mouse handler for project cards
  const handleCardMouseMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardSpotlights((prev) => ({
      ...prev,
      [id]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  };

  // ==========================================================================
  // DATA: HERO ROLE SWITCHER PERSONAS
  // ==========================================================================
  const heroRoles = [
    {
      label: 'Aspiring MERN Stack Developer',
      tag: 'ENGINEERING TRACK',
      summary:
        'Strengthening core HTML, CSS, and JavaScript foundations while building toward full-stack MongoDB, Express.js, React.js, and Node.js applications.',
      ctaLabel: 'Inspect Tech Roadmap',
      ctaHref: '#roadmap'
    },
    {
      label: 'Founder & Owner of YANVI',
      tag: 'CIRCULAR STARTUP',
      summary:
        'Leading Youth And Nurtured Voice for Innovation in Nepal — transforming discarded banana stems and agricultural waste into biodegradable everyday products.',
      ctaLabel: 'Explore YANVI Studio',
      ctaHref: '#yanvi'
    },
    {
      label: 'BIM Undergraduate (TU)',
      tag: 'MANAGEMENT & IT',
      summary:
        'Studying Bachelor of Information Management at Janapriya Multiple Campus in Pokhara, bridging software fundamentals with financial modeling and leadership.',
      ctaLabel: 'View Academic Journey',
      ctaHref: '#journey'
    }
  ];

  // ==========================================================================
  // DATA: SKILLS & TECHNOLOGIES + PRACTICAL APPLICATION DETAILS
  // ==========================================================================
  const skillDetailsMap = {
    HTML: {
      category: 'Web Development · Current Foundation',
      usage: 'Structuring semantic, accessible web documents with clean landmarks, forms, and SEO-friendly hierarchy.'
    },
    CSS: {
      category: 'Web Development · Current Foundation',
      usage: 'Crafting responsive grid/flexbox architectures, fluid typography, and smooth transitions across mobile and desktop viewports.'
    },
    JavaScript: {
      category: 'Web Development · Current Foundation',
      usage: 'Building interactive DOM behaviors, state-driven UI logic, event handling, and asynchronous client workflows.'
    },
    'Front-end development': {
      category: 'Web Development · Current Foundation',
      usage: 'Translating editorial visual concepts into responsive, user-friendly interfaces with clean component structure.'
    },
    MongoDB: {
      category: 'MERN Stack Learning Goal · Actively Learning',
      usage: 'Studying document-oriented NoSQL schema design and CRUD data persistence for modern full-stack web apps.'
    },
    'Express.js': {
      category: 'MERN Stack Learning Goal · Actively Learning',
      usage: 'Learning RESTful routing, middleware pipelines, and server-side request handling for Node.js backends.'
    },
    'React.js': {
      category: 'MERN Stack Learning Goal · Actively Learning',
      usage: 'Building modular, stateful user interfaces with hooks, reusable components, and interactive client experiences like this portfolio.'
    },
    'Node.js': {
      category: 'MERN Stack Learning Goal · Actively Learning',
      usage: 'Exploring server-side JavaScript execution, package ecosystems, and backend API integration.'
    },
    'Microsoft Word': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Authoring structured project reports, startup concept proposals for YANVI, and formal academic documentation.'
    },
    'Microsoft Excel': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Organizing budgets, treasury ledgers, and structured data analysis developed through BIM studies and Treasurer roles.'
    },
    'Microsoft PowerPoint': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Designing clear pitch decks for entrepreneurship competitions like Hult Prize and startup storytelling.'
    },
    'Social Media Management': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Planning digital storytelling, community outreach, and brand presence for youth initiatives and YANVI.'
    },
    'Basic IT Support': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Applied hands-on as an IT Assistant at Global Institute of Management and Technology for troubleshooting and workflow support.'
    },
    'Financial modeling': {
      category: 'Business & Productivity · Current Foundation',
      usage: 'Evaluating unit economics, cost structures, and sustainable revenue assumptions for YANVI and BIM coursework.'
    },
    Canva: {
      category: 'Creative Skills · Current Foundation',
      usage: 'Rapidly producing cohesive brand graphics, social announcements, and pitch visual assets.'
    },
    'Adobe Photoshop': {
      category: 'Creative Skills · Current Foundation',
      usage: 'Retouching photography, compositing product mockups, and refining visual contrast for digital media.'
    },
    'Adobe Illustrator': {
      category: 'Creative Skills · Current Foundation',
      usage: 'Designing scalable vector logos, geometric emblems, and clean brand identity marks.'
    },
    Photography: {
      category: 'Creative Skills · Current Foundation',
      usage: 'Capturing natural textures, product concepts, and authentic documentary moments across Pokhara and campus life.'
    },
    Videography: {
      category: 'Creative Skills · Current Foundation',
      usage: 'Filming and framing visual narratives that communicate ideas, community events, and sustainable innovation.'
    }
  };

  const skillGroups = [
    {
      id: 'web-current',
      filterKey: 'Current Foundation',
      title: 'Web Development',
      status: 'CURRENT FOUNDATION',
      isLearning: false,
      description:
        'Core front-end building blocks used to structure, style, and bring interactivity to modern web interfaces.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Front-end development']
    },
    {
      id: 'mern-goal',
      filterKey: 'MERN Learning Goal',
      title: 'My MERN Stack Learning Goal',
      status: 'ACTIVELY LEARNING',
      isLearning: true,
      description:
        'Dedicated full-stack engineering track I am actively studying and building toward to create scalable web apps.',
      skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js']
    },
    {
      id: 'business',
      filterKey: 'Business & Creative',
      title: 'Business & Productivity',
      status: 'CURRENT FOUNDATION',
      isLearning: false,
      description:
        'Analytical, operational, and organizational tools supporting management studies and venture planning.',
      skills: [
        'Microsoft Word',
        'Microsoft Excel',
        'Microsoft PowerPoint',
        'Social Media Management',
        'Basic IT Support',
        'Financial modeling'
      ]
    },
    {
      id: 'creative',
      filterKey: 'Business & Creative',
      title: 'Creative Skills',
      status: 'CURRENT FOUNDATION',
      isLearning: false,
      description:
        'Visual storytelling, brand design, and multimedia production capabilities for digital and venture identity.',
      skills: ['Canva', 'Adobe Photoshop', 'Adobe Illustrator', 'Photography', 'Videography']
    }
  ];

  const filteredSkillGroups =
    skillFilter === 'All'
      ? skillGroups
      : skillGroups.filter((g) => g.filterKey === skillFilter);

  // ==========================================================================
  // DATA: FEATURED PROJECTS
  // ==========================================================================
  const projectsData = [
    {
      number: '01',
      id: 'attendance-system',
      title: 'Attendance Management System',
      filterKey: 'Systems',
      category: 'Systems & Logic',
      tech: ['C Programming', 'File Handling', 'Console UI', 'Data Structures'],
      description:
        'A console-based attendance management application designed to manage student records, teacher information, subjects and attendance records.',
      overview:
        'Engineered using C programming to streamline academic record-keeping in a structured command-line environment. Built to strengthen foundational logic, memory management, and modular CRUD operations.',
      highlights: [
        'Structured storage and retrieval for student profiles and teacher assignments',
        'Subject-wise attendance logging with clean tabular console reporting',
        'Modular C functions designed for predictable input validation and maintainability'
      ],
      actionType: 'modal'
    },
    {
      number: '02',
      id: 'yanvi-venture',
      title: 'YANVI',
      filterKey: 'Sustainability',
      category: 'Sustainable Entrepreneurship',
      tech: ['Circular Economy', 'Biodegradable Materials', 'Product Concept', 'Social Enterprise'],
      description:
        'A sustainability-focused startup concept that transforms discarded banana stems and agricultural waste into eco-friendly products.',
      overview:
        'Founded in Nepal under the vision "Youth And Nurtured Voice for Innovation," YANVI addresses agricultural residue and plastic pollution by exploring natural banana-fiber extraction and handcrafted biodegradable goods.',
      highlights: [
        'Transforms discarded banana pseudo-stems into durable natural fibers and handmade paper',
        'Explores five core sustainable product lines from baskets to corporate eco-gifts',
        'Designed to create local value chains and economic opportunities for youth and women'
      ],
      actionType: 'yanvi-jump'
    },
    {
      number: '03',
      id: 'personal-portfolio',
      title: 'Personal Portfolio Website',
      filterKey: 'Web',
      category: 'Web Development',
      tech: ['React.js', 'JavaScript', 'CSS', 'Responsive UI/UX'],
      description:
        'A personal digital portfolio showcasing my professional identity, development journey, projects and entrepreneurial ambitions.',
      overview:
        'Designed and developed as an editorial digital home uniting my work as an aspiring MERN Stack developer, BIM undergraduate at Janapriya Multiple Campus, and founder of YANVI.',
      highlights: [
        'Editorial Navy Blue aesthetic with Velvet Sapphire dark mode and Coastal Mist light mode',
        'Interactive project explorer, YANVI venture showcase, and 5-phase developer roadmap',
        'Responsive mobile-first layout with accessible motion and smooth section navigation'
      ],
      actionType: 'modal'
    }
  ];

  const visibleProjects =
    projectFilter === 'All'
      ? projectsData
      : projectsData.filter((item) => item.filterKey === projectFilter);

  // ==========================================================================
  // DATA: YANVI CIRCULAR PIPELINE STAGES & BIODEGRADABLE PRODUCT LINEUP
  // ==========================================================================
  const yanviPipelineStages = [
    {
      step: 'STAGE 01',
      title: 'Post-Harvest Banana Stem Collection',
      subtitle: 'Agricultural Residue Sourcing in Nepal',
      description:
        'After banana harvesting, nutrient-rich pseudo-stems are typically discarded or burned. YANVI collects these agricultural byproducts as a zero-tree, renewable feedstock.',
      metricLabel: 'RAW INPUT',
      metricValue: '100% Discarded Banana Pseudo-Stems'
    },
    {
      step: 'STAGE 02',
      title: 'Natural Fiber Extraction & Pulping',
      subtitle: 'Clean Mechanical & Artisanal Processing',
      description:
        'Outer sheaths are stripped to extract long, high-tensile cellulosic plant fibers while residual pulp is prepared for unbleached handmade eco-paper sheets.',
      metricLabel: 'MATERIAL OUTPUT',
      metricValue: 'Biodegradable Cellulosic Fiber & Pulp'
    },
    {
      step: 'STAGE 03',
      title: 'Handcrafted Eco-Product Creation',
      subtitle: 'Community Craftsmanship & Circular Utility',
      description:
        'Skilled local youth and women artisans weave, stitch, and press the natural fibers into durable baskets, textiles, stationery, and plastic-free corporate gifts.',
      metricLabel: 'END-OF-LIFE',
      metricValue: 'Naturally Compostable & Plastic-Free'
    }
  ];

  const yanviProducts = [
    {
      code: '01',
      name: 'Banana-Fiber Baskets',
      material: 'Woven Natural Banana Stem Fiber',
      detail:
        'Handcrafted, biodegradable storage and lifestyle baskets designed as durable alternatives to synthetic plastic containers.'
    },
    {
      code: '02',
      name: 'Banana-Fiber Textiles',
      material: 'Processed Cellulosic Plant Yarn',
      detail:
        'Breathable, natural plant-based fabric concepts exploring sustainable material innovation for everyday utility.'
    },
    {
      code: '03',
      name: 'Handmade Eco-Friendly Paper',
      material: 'Unbleached Banana Agro-Pulp',
      detail:
        'Textured, tree-free artisanal paper sheets crafted from agricultural banana waste for stationery and packaging.'
    },
    {
      code: '04',
      name: 'Pencil Cases',
      material: 'Reinforced Banana Fiber Weave',
      detail:
        'Lightweight, everyday student and office organizers combining minimal functional design with natural fibers.'
    },
    {
      code: '05',
      name: 'Customized Corporate Eco-Gift Products',
      material: 'Bespoke Sustainable Craft Ensemble',
      detail:
        'Thoughtfully curated eco-conscious gift sets tailored for organizations seeking plastic-free gifting alternatives.'
    }
  ];

  // ==========================================================================
  // DATA: EXPERIENCE, LEADERSHIP & EDUCATION TIMELINE
  // ==========================================================================
  const timelineItems = [
    {
      category: 'Education',
      type: 'EDUCATION',
      title: 'Bachelor of Information Management (BIM)',
      organization: 'Janapriya Multiple Campus — Affiliated with Tribhuvan University',
      location: 'Pokhara, Nepal',
      period: 'Current Undergraduate Studies',
      details: [
        'Pursuing interdisciplinary education bridging information technology, software fundamentals, and business management.',
        'Applying classroom concepts in programming, financial modeling, and organizational strategy to real ventures.'
      ]
    },
    {
      category: 'Entrepreneurship',
      type: 'ENTREPRENEURSHIP',
      title: 'Founder & Owner — YANVI',
      organization: 'Youth And Nurtured Voice for Innovation',
      location: 'Nepal',
      period: 'Ongoing Initiative',
      details: [
        'Founded a sustainability-driven startup concept focused on converting discarded banana stems into biodegradable products.',
        'Leading brand strategy, product concept development, and sustainable entrepreneurship advocacy.'
      ]
    },
    {
      category: 'Leadership & Tech',
      type: 'GLOBAL LEADERSHIP & COMPETITIONS',
      title: 'Hult Prize, Aspire Global Community & International Youth Conference',
      organization: 'Global Youth Innovation & Leadership Forums',
      location: 'International Cohorts',
      period: 'Leadership & Advocacy',
      details: [
        'Participated in Hult Prize pitching sustainable venture concepts before evaluation panels.',
        'Active member of the Aspire Global Community, collaborating across cultures on leadership and systemic problem-solving.',
        'Engaged in International Youth Conference dialogues and community fundraising campaign initiatives.'
      ]
    },
    {
      category: 'Leadership & Tech',
      type: 'TECHNICAL EXPERIENCE',
      title: 'IT Assistant',
      organization: 'Global Institute of Management and Technology',
      location: 'Technical Operations',
      period: 'Experience',
      details: [
        'Provided frontline IT support, system troubleshooting, and digital workflow assistance for institutional operations.',
        'Supported hardware/software maintenance and everyday technical productivity.'
      ]
    },
    {
      category: 'Leadership & Tech',
      type: 'LEADERSHIP & FINANCE',
      title: 'Treasurer — Leo Club',
      organization: 'Leo Club',
      location: 'Shimla, India',
      period: 'Leadership Role',
      details: [
        'Managed club treasury records, budgeting, and transparent financial reporting for youth service initiatives.',
        'Coordinated fundraising campaigns and community engagement programs.'
      ]
    },
    {
      category: 'Education',
      type: 'EDUCATION & STUDENT LEADERSHIP',
      title: 'Grade 12 Education & Student Body Treasurer',
      organization: 'Roorkee Adventist College / School',
      location: 'Roorkee, India',
      period: 'Higher Secondary',
      details: [
        'Completed Grade 12 education while serving in student financial stewardship and event logistics coordination.',
        'Maintained structured budget tracking and audit accuracy for student-led academic and cultural activities.'
      ]
    }
  ];

  const visibleTimelineItems =
    timelineFilter === 'All'
      ? timelineItems
      : timelineItems.filter((t) => t.category === timelineFilter);

  const toggleTimelineCard = (index) => {
    setExpandedTimelineIdx((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // ==========================================================================
  // DATA: 5-PHASE FUTURE GOALS ROADMAP
  // ==========================================================================
  const roadmapPhases = [
    {
      phase: 'PHASE 01',
      title: 'FOUNDATION',
      status: 'CURRENT FOCUS',
      description: 'Strengthen HTML, CSS and JavaScript.',
      focusPoints: [
        'Semantic HTML5 architecture',
        'Modern responsive CSS layouts',
        'Core JavaScript logic & DOM mastery'
      ]
    },
    {
      phase: 'PHASE 02',
      title: 'FRONTEND DEVELOPMENT',
      status: 'IN PROGRESS',
      description: 'Master React.js and modern frontend development.',
      focusPoints: [
        'Component-driven UI engineering',
        'State management & custom hooks',
        'Accessible motion & clean UX systems'
      ]
    },
    {
      phase: 'PHASE 03',
      title: 'BACKEND DEVELOPMENT',
      status: 'UPCOMING MILESTONE',
      description: 'Learn Node.js, Express.js, MongoDB and API development.',
      focusPoints: [
        'RESTful API design with Node & Express',
        'Database modeling in MongoDB',
        'Authentication & server security'
      ]
    },
    {
      phase: 'PHASE 04',
      title: 'FULL STACK DEVELOPMENT',
      status: 'TARGET ARCHITECTURE',
      description: 'Build complete MERN Stack applications.',
      focusPoints: [
        'End-to-end scalable web platforms',
        'Cloud deployment & performance tuning',
        'Real-world problem-solving products'
      ]
    },
    {
      phase: 'PHASE 05',
      title: 'ENTREPRENEURSHIP',
      status: 'LONG-TERM VISION',
      description: 'Expand YANVI and build sustainable business opportunities.',
      focusPoints: [
        'Scale eco-friendly banana-fiber production',
        'Create local livelihoods for youth & women',
        'Bridge technology with green enterprise'
      ]
    }
  ];

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'yanvi', label: 'YANVI' },
    { id: 'journey', label: 'Journey' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      handle: 'Smith Sharma',
      href: 'https://www.linkedin.com/in/smith-sharma-8432a8358?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      icon: Linkedin
    },
    {
      name: 'GitHub',
      handle: 'smithsharma123/smith123',
      href: 'https://github.com/smithsharma123/smith123',
      icon: Github
    },
    {
      name: 'Instagram',
      handle: '@smith_sharma_02',
      href: 'https://www.instagram.com/smith_sharma_02/',
      icon: Instagram
    },
    {
      name: 'Facebook',
      handle: 'smith.sharma.568632',
      href: 'https://www.facebook.com/smith.sharma.568632/',
      icon: Facebook
    }
  ];

  const commandActions = [
    ...navItems.map((nav) => ({
      id: `nav-${nav.id}`,
      group: 'Navigation',
      label: `Jump to ${nav.label}`,
      hint: `#${nav.id}`,
      run: () => {
        document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' });
      }
    })),
    {
      id: 'toggle-theme',
      group: 'Appearance',
      label: isLight ? 'Switch to Velvet Sapphire Dark Theme' : 'Switch to Soft Mist Daylight Theme',
      hint: 'Navy Palette',
      run: () => setNavyMode(isLight ? 'midnight' : 'coastal')
    },
    {
      id: 'proj-c',
      group: 'Interactive Demos',
      label: 'Open Attendance Management System (C Console Demo)',
      hint: 'Project 01',
      run: () => setActiveProjectModal(projectsData[0])
    },
    {
      id: 'proj-portfolio',
      group: 'Interactive Demos',
      label: 'Inspect Personal Portfolio Architecture',
      hint: 'Project 03',
      run: () => setActiveProjectModal(projectsData[2])
    },
    ...socialLinks.map((s) => ({
      id: `social-${s.name.toLowerCase()}`,
      group: 'Social Media',
      label: `Open ${s.name} (${s.handle})`,
      hint: 'External',
      run: () => window.open(s.href, '_blank', 'noopener,noreferrer')
    })),
    {
      id: 'copy-email',
      group: 'Quick Actions',
      label: 'Copy Email Address (smithsharmasubedi@gmail.com)',
      hint: 'Clipboard',
      run: () => handleCopyEmail()
    },
    {
      id: 'toggle-grid',
      group: 'Preferences',
      label: showAmbientGrid ? 'Hide Architectural Background Grid' : 'Show Architectural Background Grid',
      hint: 'Visual',
      run: () => {
        setShowAmbientGrid((v) => !v);
        triggerToast(showAmbientGrid ? 'Background grid hidden.' : 'Background grid enabled.');
      }
    }
  ];

  const filteredCommands = commandActions.filter(
    (item) =>
      item.label.toLowerCase().includes(cmdQuery.toLowerCase()) ||
      item.group.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  const contactTopics = [
    {
      label: 'Web / MERN Collaboration',
      subject: 'Web / MERN Collaboration — Smith Sharma',
      starter:
        'Hi Smith, I came across your portfolio and would love to discuss a web development collaboration or project opportunity.'
    },
    {
      label: 'YANVI Partnership',
      subject: 'YANVI Sustainable Startup Inquiry',
      starter:
        'Hi Smith, I am interested in learning more about YANVI and exploring eco-friendly banana-fiber product collaborations.'
    },
    {
      label: 'Youth Leadership / Event',
      subject: 'Youth Leadership & Speaking Connection',
      starter:
        'Hi Smith, we would love to connect with you regarding an upcoming youth leadership or entrepreneurship initiative.'
    },
    {
      label: 'General Hello',
      subject: 'Hello Smith Sharma!',
      starter: 'Hi Smith, enjoyed exploring your portfolio from Pokhara! Wanted to reach out and connect.'
    }
  ];

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.label);
    setContactForm((prev) => ({
      ...prev,
      subject: topic.subject,
      body: prev.body.trim() === '' ? topic.starter : prev.body
    }));
  };

  // ==========================================================================
  // EYE-PLEASING NAVY BLUE DESIGN TOKENS (SOOTHING CONTRAST & SOFT DEPTH)
  // ==========================================================================
  const bgPage = isLight ? 'bg-[#F3F6FA] text-[#102138]' : 'bg-[#0B1324] text-[#F1F5F9]';
  const bgCard = isLight
    ? 'bg-white/95 border-[#D5E0EE] shadow-[0_14px_34px_-12px_rgba(16,33,56,0.08)]'
    : 'bg-[#111C33] border-[#213559] shadow-[0_18px_42px_-14px_rgba(4,9,20,0.65)]';
  const bgCardInner = isLight
    ? 'bg-[#F3F6FA] border-[#D5E0EE]'
    : 'bg-[#0B1324] border-[#213559]';
  const textPrimary = isLight ? 'text-[#102138]' : 'text-[#F8FAFC]';
  const textMuted = isLight ? 'text-[#4B617E]' : 'text-[#9FB2CE]';
  const accentText = isLight ? 'text-[#1E4E8C]' : 'text-[#7DD3FC]';
  const accentBg = isLight
    ? 'bg-[#163660] text-white hover:bg-[#1E487E] shadow-[0_10px_24px_-8px_rgba(22,54,96,0.45)]'
    : 'bg-[#60A5FA] text-[#08101E] hover:bg-[#93C5FD] shadow-[0_10px_26px_-8px_rgba(96,165,250,0.45)]';
  const accentBadge = isLight
    ? 'bg-[#E6EEF9] text-[#163660] border-[#C2D4EC]'
    : 'bg-[#17294A] text-[#93C5FD] border-[#60A5FA]/30';
  const borderSubtle = isLight ? 'border-[#D5E0EE]' : 'border-[#213559]';

  return (
    <div
      className={`min-h-screen ${bgPage} selection:bg-[#60A5FA] selection:text-[#08101E] overflow-x-hidden relative transition-colors duration-300`}
    >
      {/* Editorial Typography & Custom Keyframe Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

        html {
          scroll-behavior: smooth;
          font-family: 'Manrope', sans-serif;
        }

        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }

        .font-serif-editorial {
          font-family: 'Instrument Serif', serif;
        }

        .font-mono-tech {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marqueeScroll 32s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1.5deg); }
        }

        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        @keyframes heroReveal {
          0% {
            opacity: 0;
            transform: translateY(28px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-stagger-1 { animation: heroReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both; }
        .hero-stagger-2 { animation: heroReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both; }
        .hero-stagger-3 { animation: heroReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .hero-stagger-4 { animation: heroReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both; }

        .editorial-card-hover {
          transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.38s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.3s ease;
        }
        .editorial-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(125, 211, 252, 0.55);
          box-shadow: 0 26px 55px -16px rgba(6, 13, 28, 0.78), 0 0 32px -10px rgba(96, 165, 250, 0.25);
        }

        .portrait-shadow-aura {
          box-shadow:
            0 28px 65px -15px rgba(4, 10, 24, 0.85),
            0 12px 30px -10px rgba(30, 78, 140, 0.45),
            0 0 0 1px rgba(147, 197, 253, 0.22);
          transition: box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
        }
        .group:hover .portrait-shadow-aura {
          box-shadow:
            0 36px 80px -14px rgba(4, 10, 24, 0.92),
            0 18px 44px -8px rgba(96, 165, 250, 0.35),
            0 0 0 1px rgba(147, 197, 253, 0.55);
        }

        .skill-chip-kinetic {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.2s ease,
                      border-color 0.2s ease,
                      color 0.2s ease,
                      box-shadow 0.25s ease;
        }
        .skill-chip-kinetic:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 10px 20px -8px rgba(56, 189, 248, 0.35);
        }

        .editorial-link-underline {
          position: relative;
        }
        .editorial-link-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 100%;
          height: 1.5px;
          background-color: #38BDF8;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .editorial-link-underline:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .locked-portrait-img {
          -webkit-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .animate-marquee,
          .animate-float-slow,
          .hero-stagger-1,
          .hero-stagger-2,
          .hero-stagger-3,
          .hero-stagger-4 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Custom Desktop Follower Cursor */}
      <div
        ref={cursorDotRef}
        className="hidden lg:block fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#38BDF8] pointer-events-none z-[100] transition-opacity duration-200"
      />
      <div
        ref={cursorRingRef}
        className={`hidden lg:block fixed top-0 left-0 rounded-full border pointer-events-none z-[99] transition-all duration-200 ${
          cursorHovered
            ? 'w-12 h-12 -ml-6 -mt-6 border-[#38BDF8] bg-[#38BDF8]/15'
            : isLight
            ? 'w-8 h-8 -ml-4 -mt-4 border-[#0F294A]/35'
            : 'w-8 h-8 -ml-4 -mt-4 border-[#F1F5F9]/35'
        }`}
      />

      {/* Top Navy-to-Sky Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#0F294A] via-[#38BDF8] to-[#7DD3FC] transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Desktop Section Telemetry Dock */}
      <aside
        aria-label="Quick Section Telemetry"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-2.5"
      >
        {['hero', 'about', 'skills', 'projects', 'yanvi', 'journey', 'roadmap', 'contact'].map((secId) => {
          const isCurrent = activeNav === secId;
          return (
            <a
              key={secId}
              href={`#${secId}`}
              aria-label={`Scroll to ${secId}`}
              className="group flex items-center gap-2.5 py-1"
            >
              <span
                className={`font-mono-tech text-[10px] uppercase tracking-widest transition-all ${
                  isCurrent
                    ? `opacity-100 ${accentText} translate-x-0`
                    : `opacity-0 group-hover:opacity-100 ${textMuted} translate-x-1 group-hover:translate-x-0`
                }`}
              >
                {secId}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-6 h-1.5 bg-[#38BDF8]'
                    : isLight
                    ? 'w-2 h-1.5 bg-[#0F294A]/25 group-hover:bg-[#0F294A]/60'
                    : 'w-2 h-1.5 bg-[#F1F5F9]/25 group-hover:bg-[#F1F5F9]/60'
                }`}
              />
            </a>
          );
        })}
      </aside>

      {/* Status Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl ${bgCard} border border-[#38BDF8]/50 ${textPrimary} shadow-2xl text-xs font-mono-tech`}
        >
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle 64px Architectural Navy Grid Overlay */}
      {showAmbientGrid && (
        <div
          className="fixed inset-0 pointer-events-none -z-10 opacity-[0.04]"
          style={{
            backgroundImage: isLight
              ? 'linear-gradient(to right, #0F294A 1px, transparent 1px), linear-gradient(to bottom, #0F294A 1px, transparent 1px)'
              : 'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />
      )}

      {/* ====================================================================
          1. STICKY BACKDROP-BLUR HEADER
      ==================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? isLight
              ? 'bg-[#F3F6FA]/90 backdrop-blur-xl border-b border-[#D5E0EE] py-3.5'
              : 'bg-[#0B1324]/88 backdrop-blur-xl border-b border-[#213559] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Editorial Monogram with Locked Photo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <LockedPortraitImage
              portraitSrc={portraitSrc}
              className="w-9 h-9 rounded-lg object-cover object-top border border-[#60A5FA]/60 shadow-md"
            />
            <div className="flex flex-col">
              <span className={`font-display font-bold text-sm tracking-wide ${textPrimary}`}>
                SMITH SHARMA
              </span>
              <span className={`font-mono-tech text-[10px] tracking-widest ${textMuted} uppercase`}>
                POKHARA · NEPAL
              </span>
            </div>
          </a>

          {/* Desktop Section Navigation */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`editorial-link-underline font-mono-tech text-xs uppercase tracking-wider transition-colors ${
                  activeNav === item.id ? accentText : `${textMuted} hover:${textPrimary}`
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Theme Toggle, Command Palette Trigger & CTA */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setNavyMode(isLight ? 'midnight' : 'coastal')}
              aria-label="Toggle Midnight Navy or Coastal Navy theme"
              title={isLight ? 'Switch to Midnight Navy Dark' : 'Switch to Coastal Navy Light'}
              className={`p-2 rounded-full ${bgCard} border ${borderSubtle} hover:border-[#38BDF8] ${textPrimary} transition-colors`}
            >
              {isLight ? <Moon className="w-4 h-4 text-[#0F294A]" /> : <Sun className="w-4 h-4 text-[#38BDF8]" />}
            </button>

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open quick command palette"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${bgCard} border ${borderSubtle} hover:border-[#38BDF8] ${textMuted} font-mono-tech text-[11px] transition-colors`}
            >
              <Command className={`w-3.5 h-3.5 ${accentText}`} />
              <span className="hidden lg:inline">Quick Jump</span>
              <kbd className={`px-1.5 py-0.5 rounded ${bgCardInner} border ${borderSubtle} text-[10px]`}>
                ⌘K
              </kbd>
            </button>

            <MagneticButton
              href="#contact"
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full ${accentBg} font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors`}
            >
              <span>Let&apos;s Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`md:hidden p-2.5 rounded-lg border ${borderSubtle} ${textPrimary}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden ${
              isLight ? 'bg-[#F4F7FB]/98' : 'bg-[#080E1A]/98'
            } backdrop-blur-2xl border-b ${borderSubtle} px-6 pt-4 pb-8 space-y-4`}
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2 border-b ${borderSubtle} font-display text-lg font-medium ${textPrimary}`}
                >
                  <span>{item.label}</span>
                  <span className={`font-mono-tech text-xs ${textMuted}`}>0{idx + 1}</span>
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl ${accentBg} font-mono-tech text-xs font-semibold uppercase tracking-wider`}
            >
              <span>Let&apos;s Connect</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </header>

      {/* ====================================================================
          2. CINEMATIC ASYMMETRICAL HERO SECTION
      ==================================================================== */}
      <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        {/* Ambient Royal Navy & Sky Blue Radial Glows */}
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-[#1D4ED8]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#38BDF8]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Top Metadata Strip */}
          <div className={`hero-stagger-1 flex flex-wrap items-center justify-between gap-3 pb-8 mb-8 border-b ${borderSubtle}`}>
            <div className={`inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest ${accentText} uppercase`}>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>DEVELOPER IN PROGRESS · ENTREPRENEUR</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 font-mono-tech text-xs tracking-widest ${textMuted} uppercase`}>
              <MapPin className={`w-3.5 h-3.5 ${accentText}`} />
              <span>POKHARA, NEPAL</span>
            </div>
          </div>

          {/* Asymmetrical Main Hero Grid */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Typography Column */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className={`hero-stagger-2 font-display font-bold tracking-tight leading-[0.95] text-5xl sm:text-7xl xl:text-[5.4rem] ${textPrimary}`}>
                <span className="block">BUILDING</span>
                <span className={`block font-serif-editorial italic font-normal ${accentText} text-6xl sm:text-8xl xl:text-[6.2rem] my-1`}>
                  DIGITAL
                </span>
                <span className="block">POSSIBILITIES.</span>
              </h1>

              <div className="hero-stagger-3 space-y-3 max-w-xl pt-1">
                <p className={`font-display text-xl sm:text-2xl font-semibold ${textPrimary}`}>
                  Hello, I&apos;m Smith Sharma.
                </p>
                <p className={`text-base sm:text-lg ${textMuted} leading-relaxed font-light`}>
                  An aspiring MERN Stack Developer, entrepreneur and founder of YANVI. Exploring the intersection of technology, creativity and sustainable innovation.
                </p>
              </div>

              {/* Interactive Focus Lens Switcher */}
              <div className={`hero-stagger-3 p-4 sm:p-5 rounded-2xl ${bgCard} border max-w-xl space-y-3`}>
                <div className="flex flex-wrap items-center gap-2">
                  {heroRoles.map((role, idx) => (
                    <button
                      key={role.label}
                      type="button"
                      onClick={() => setActiveHeroRole(idx)}
                      className={`px-3 py-1.5 rounded-full font-mono-tech text-[11px] transition-all ${
                        activeHeroRole === idx
                          ? accentBg + ' font-semibold'
                          : `${bgCardInner} ${textMuted} border ${borderSubtle} hover:${textPrimary}`
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className={`text-xs sm:text-sm ${textPrimary} opacity-90 leading-relaxed`}>
                    {heroRoles[activeHeroRole].summary}
                  </p>
                  <a
                    href={heroRoles[activeHeroRole].ctaHref}
                    className={`inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-wider ${accentText} hover:underline shrink-0`}
                  >
                    <span>{heroRoles[activeHeroRole].ctaLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Magnetic Primary & Secondary CTAs */}
              <div className="hero-stagger-4 flex flex-wrap items-center gap-4 pt-1">
                <MagneticButton
                  href="#about"
                  className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-full ${accentBg} font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors`}
                >
                  <span>Explore My Journey</span>
                  <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </MagneticButton>

                <MagneticButton
                  href="#contact"
                  className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border ${borderSubtle} hover:border-[#60A5FA] ${textPrimary} hover:text-[#60A5FA] font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors`}
                >
                  <span>Let&apos;s Connect</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>
              </div>
            </div>

            {/* Right Interactive 3D Tilt Portrait Card with Deep Soft Shadow & One-Time Photo Insert */}
            <div className="lg:col-span-5 hero-stagger-3">
              <div
                onMouseMove={handlePortraitMouseMove}
                onMouseLeave={handlePortraitMouseLeave}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: tilt.active
                    ? 'transform 0.12s ease-out'
                    : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="group relative max-w-md mx-auto select-none"
              >
                {/* Soft Eye-Pleasing Ambient Navy Halo Behind Portrait */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-[#1E4E8C]/40 via-[#60A5FA]/20 to-[#93C5FD]/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />

                <div className="absolute -inset-3 rounded-3xl border border-[#60A5FA]/35 translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 group-hover:border-[#93C5FD]/75 transition-all duration-500 pointer-events-none" />

                <div className={`portrait-shadow-aura relative rounded-3xl overflow-hidden ${bgCard} border group-hover:border-[#60A5FA]/70`}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#162C50] via-[#111C33] to-[#0B1324]">
                    <LockedPortraitImage
                      portraitSrc={portraitSrc}
                      onInsertPhoto={handleInsertAndLockPhoto}
                      allowInsertButton={!isPortraitLocked}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />

                    {/* Dynamic Cursor-Tracking Specular Glare Overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                      style={{
                        opacity: tilt.active ? 0.32 : 0,
                        background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(147, 197, 253, 0.38), transparent 60%)`
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1324] via-[#0B1324]/70 to-transparent pointer-events-none" />

                    <div className="absolute bottom-3.5 left-4 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1324]/85 backdrop-blur-md border border-[#60A5FA]/45 font-mono-tech text-[10px] text-[#93C5FD] uppercase tracking-wider shadow-lg">
                        <Lock className="w-2.5 h-2.5 text-[#60A5FA]" />
                        <span>Pokhara · Founder &amp; Builder</span>
                      </span>
                    </div>
                  </div>

                  {/* Editorial Caption Card */}
                  <div className={`px-5 py-4 ${bgCard} border-t ${borderSubtle} flex items-center justify-between gap-2`}>
                    <div>
                      <p className={`font-display font-bold text-sm ${textPrimary} group-hover:text-[#60A5FA] transition-colors`}>
                        Smith Sharma
                      </p>
                      <p className={`font-mono-tech text-[11px] ${textMuted}`}>
                        BIM Student · Founder of YANVI
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md border ${accentBadge} font-mono-tech text-[10px] uppercase`}>
                      TU · Nepal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`mt-14 pt-6 border-t ${borderSubtle} flex items-center justify-between text-xs font-mono-tech ${textMuted}`}>
            <a href="#about" className={`inline-flex items-center gap-2 hover:${accentText} transition-colors`}>
              <span className={`w-5 h-8 rounded-full border ${borderSubtle} flex items-start justify-center p-1`}>
                <span className="w-1 h-2 rounded-full bg-[#38BDF8] animate-bounce" />
              </span>
              <span>SCROLL TO EXPLORE</span>
            </a>
            <span className="hidden sm:inline">01 / NAVY PORTFOLIO EDITION</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          INFINITE SEAMLESS HORIZONTAL MARQUEE STRIP
      ==================================================================== */}
      <div className={`border-y ${borderSubtle} ${isLight ? 'bg-[#E9EFF8]' : 'bg-[#0C1526]'} py-4 overflow-hidden select-none`}>
        <div className="animate-marquee flex items-center gap-8">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 shrink-0">
              <span className={`font-display font-bold text-sm sm:text-base tracking-wider uppercase ${textPrimary}`}>
                ASPIRING MERN STACK DEVELOPER
              </span>
              <span className={accentText}>✦</span>
              <span className={`font-serif-editorial italic text-xl sm:text-2xl ${accentText}`}>
                Founder of YANVI
              </span>
              <span className={accentText}>✦</span>
              <span className={`font-mono-tech text-xs sm:text-sm tracking-widest uppercase ${textMuted}`}>
                POKHARA, NEPAL
              </span>
              <span className={accentText}>✦</span>
              <span className={`font-display font-bold text-sm sm:text-base tracking-wider uppercase ${textPrimary}`}>
                SUSTAINABLE INNOVATION
              </span>
              <span className={accentText}>✦</span>
              <span className={`font-serif-editorial italic text-xl sm:text-2xl ${accentText}`}>
                Builder of Possibilities
              </span>
              <span className={accentText}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          3. ABOUT ME SECTION (01 // ABOUT ME)
      ==================================================================== */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock>
            <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-4`}>
              <span>01 // ABOUT ME</span>
              <span className="h-px w-12 bg-[#38BDF8]/40" />
            </div>

            <h2 className={`font-display font-bold text-3xl sm:text-5xl lg:text-6xl ${textPrimary} tracking-tight leading-[1.08] max-w-4xl`}>
              <span className={`font-serif-editorial italic font-normal ${accentText}`}>Curiosity</span> drives me.{' '}
              <span className={`font-serif-editorial italic font-normal ${accentText}`}>Purpose</span> moves me.
            </h2>
          </RevealBlock>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mt-12 items-start">
            <RevealBlock delay={100} className={`lg:col-span-7 space-y-5 text-base sm:text-lg ${textMuted} leading-relaxed`}>
              <p className={`${textPrimary} font-medium`}>
                I am Smith Sharma, a Bachelor of Information Management (BIM) student at Janapriya Multiple Campus, affiliated with Tribhuvan University, based in Pokhara, Nepal.
              </p>
              <p>
                My academic path sits right at the crossroads of information technology and organizational management. Alongside strengthening my foundations in web development and working step-by-step toward becoming a full-stack MERN developer, I am deeply engaged in business strategy, financial modeling, and sustainable entrepreneurship.
              </p>
              <p>
                As the founder and owner of <span className={`${textPrimary} font-semibold`}>YANVI</span>, I explore how discarded banana stems and agricultural residue can be reimagined into practical, biodegradable products. Whether writing structured code, organizing youth leadership initiatives, or developing circular product concepts, I approach challenges with curiosity, discipline, and collaborative energy.
              </p>
            </RevealBlock>

            <RevealBlock delay={200} className="lg:col-span-5 space-y-4">
              {/* Fixed Editorial Portrait Spotlight Card */}
              <div
                onContextMenu={(e) => e.preventDefault()}
                className={`group p-4 rounded-2xl ${bgCard} border hover:border-[#60A5FA]/60 transition-colors flex items-center gap-4 select-none`}
              >
                <LockedPortraitImage
                  portraitSrc={portraitSrc}
                  className="w-20 h-24 rounded-xl object-cover object-top border border-[#60A5FA]/50 shadow-[0_10px_25px_-6px_rgba(4,10,24,0.65)] shrink-0"
                />
                <div className="space-y-1">
                  <span className={`font-mono-tech text-[10px] uppercase tracking-widest ${accentText} block`}>
                    PROFILE IDENTITY
                  </span>
                  <p className={`font-display font-bold text-base ${textPrimary}`}>
                    Smith Sharma
                  </p>
                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Aspiring MERN Stack Developer &amp; Founder of YANVI · Pokhara, Nepal
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${bgCard} border`}>
                <span className={`font-mono-tech text-[11px] uppercase tracking-widest ${accentText} block mb-4`}>
                  AREAS OF FOCUS &amp; AMBITION
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {[
                    { label: 'Web & MERN Stack Development', tag: 'Engineering' },
                    { label: 'Business Management & Financial Innovation', tag: 'Strategy' },
                    { label: 'Sustainable Entrepreneurship (YANVI)', tag: 'Impact' },
                    { label: 'Creative Problem-Solving & Leadership', tag: 'Execution' }
                  ].map((focus, i) => (
                    <div
                      key={i}
                      className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl ${bgCardInner} border hover:border-[#38BDF8]/60 hover:translate-x-1.5 transition-all duration-300 cursor-default`}
                    >
                      <span className={`text-sm font-medium ${textPrimary} group-hover:text-[#38BDF8] transition-colors`}>
                        {focus.label}
                      </span>
                      <span className={`font-mono-tech text-[10px] px-2.5 py-0.5 rounded border ${accentBadge} shrink-0`}>
                        {focus.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${isLight ? 'bg-[#E2ECFA] border-[#B6CCF0]' : 'bg-[#13294B]/50 border-[#38BDF8]/30'} border`}>
                <p className={`font-mono-tech text-[11px] uppercase tracking-widest ${accentText} mb-1`}>
                  ACADEMIC AFFILIATION
                </p>
                <p className={`font-display font-bold text-base ${textPrimary}`}>
                  Janapriya Multiple Campus
                </p>
                <p className={`text-xs ${textMuted} mt-0.5`}>
                  Tribhuvan University · Bachelor of Information Management (BIM)
                </p>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SKILLS & TECHNOLOGIES SECTION (02 // CAPABILITIES & LEARNING TRACK)
      ==================================================================== */}
      <section id="skills" className={`py-24 md:py-32 border-t ${borderSubtle} ${isLight ? 'bg-[#ECF2FA]' : 'bg-[#0B1324]'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-3`}>
                <span>02 // CAPABILITIES &amp; LEARNING TRACK</span>
                <span className="h-px w-12 bg-[#38BDF8]/40" />
              </div>
              <h2 className={`font-display font-bold text-3xl sm:text-5xl ${textPrimary} tracking-tight`}>
                Skills &amp; <span className={`font-serif-editorial italic font-normal ${accentText}`}>Technologies.</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Current Foundation', 'MERN Learning Goal', 'Business & Creative'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSkillFilter(tab)}
                  className={`px-3.5 py-2 rounded-full font-mono-tech text-[11px] uppercase tracking-wider transition-all ${
                    skillFilter === tab
                      ? accentBg + ' font-semibold'
                      : `${bgCard} border ${borderSubtle} ${textMuted} hover:${textPrimary}`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </RevealBlock>

          {/* Interactive Live Skill Application Inspector Bar */}
          <RevealBlock className="mb-8">
            <div className={`p-5 sm:p-6 rounded-2xl ${bgCard} border border-[#38BDF8]/40 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${accentText}`} />
                  <span className={`font-mono-tech text-[11px] uppercase tracking-widest ${accentText}`}>
                    SKILL INSPECTOR · CLICK OR HOVER ANY SKILL CHIP BELOW
                  </span>
                </div>
                <p className={`font-display font-bold text-lg sm:text-xl ${textPrimary}`}>
                  {selectedSkill}{' '}
                  <span className={`font-mono-tech text-xs font-normal ${textMuted}`}>
                    — {skillDetailsMap[selectedSkill]?.category}
                  </span>
                </p>
                <p className={`text-xs sm:text-sm ${textMuted} max-w-3xl leading-relaxed`}>
                  {skillDetailsMap[selectedSkill]?.usage}
                </p>
              </div>
              <span className={`font-mono-tech text-[11px] px-3 py-1.5 rounded-lg border ${accentBadge} shrink-0 self-start md:self-center`}>
                Interactive Context
              </span>
            </div>
          </RevealBlock>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredSkillGroups.map((group, idx) => (
              <RevealBlock key={group.id} delay={idx * 90}>
                <div
                  className={`editorial-card-hover h-full p-7 rounded-3xl border ${
                    group.isLearning
                      ? isLight
                        ? 'bg-gradient-to-br from-[#DCE8FA] via-white to-[#F4F7FB] border-[#1D4ED8]/40'
                        : 'bg-gradient-to-br from-[#13294B]/70 via-[#0E1729] to-[#080E1A] border-[#38BDF8]/45'
                      : bgCard
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span
                      className={`font-mono-tech text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                        group.isLearning ? accentBg : `border ${accentBadge}`
                      }`}
                    >
                      {group.status}
                    </span>
                    <span className={`font-mono-tech text-xs ${textMuted}`}>0{idx + 1}</span>
                  </div>

                  <h3 className={`font-display font-bold text-xl sm:text-2xl ${textPrimary} mb-2`}>
                    {group.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${textMuted} mb-6 leading-relaxed`}>
                    {group.description}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {group.skills.map((skill) => {
                      const isActiveSkill = selectedSkill === skill;
                      return (
                        <button
                          key={skill}
                          type="button"
                          onMouseEnter={() => setSelectedSkill(skill)}
                          onClick={() => setSelectedSkill(skill)}
                          className={`skill-chip-kinetic px-3.5 py-2 rounded-xl text-xs font-medium border ${
                            isActiveSkill
                              ? `${accentBg} border-transparent font-semibold scale-[1.04]`
                              : `${bgCardInner} border ${borderSubtle} ${textPrimary} hover:border-[#38BDF8]/60`
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. FEATURED PROJECTS SECTION (03 // SELECTED WORK)
      ==================================================================== */}
      <section id="projects" className={`py-24 md:py-32 border-t ${borderSubtle}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-3`}>
                <span>03 // SELECTED WORK</span>
                <span className="h-px w-12 bg-[#38BDF8]/40" />
              </div>
              <h2 className={`font-display font-bold text-3xl sm:text-5xl ${textPrimary} tracking-tight`}>
                Featured <span className={`font-serif-editorial italic font-normal ${accentText}`}>Projects.</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Systems', 'Sustainability', 'Web'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setProjectFilter(cat)}
                  className={`px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                    projectFilter === cat
                      ? accentBg + ' font-semibold'
                      : `${bgCard} border ${borderSubtle} ${textMuted} hover:${textPrimary}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealBlock>

          <div className="grid lg:grid-cols-3 gap-7">
            {visibleProjects.map((project, idx) => {
              const spot = cardSpotlights[project.id] || { x: 150, y: 150 };
              const isCardHovered = hoveredCardId === project.id;
              return (
                <RevealBlock key={project.id} delay={idx * 100}>
                  <article
                    onMouseMove={(e) => handleCardMouseMove(e, project.id)}
                    onMouseEnter={() => setHoveredCardId(project.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className={`editorial-card-hover group relative h-full rounded-3xl ${bgCard} border p-7 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Cursor-Following Radial Spotlight Glow */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
                      style={{
                        opacity: isCardHovered ? 1 : 0,
                        background: `radial-gradient(380px circle at ${spot.x}px ${spot.y}px, rgba(56, 189, 248, 0.16), transparent 65%)`
                      }}
                    />

                    {/* Kinetic Hover Corner Crosshairs */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <div className="relative z-10">
                      <div className={`flex items-center justify-between pb-5 mb-5 border-b ${borderSubtle}`}>
                        <span className={`font-mono-tech text-xs ${accentText} font-semibold`}>
                          PROJECT {project.number}
                        </span>
                        <span className={`font-mono-tech text-[11px] uppercase tracking-wider ${textMuted}`}>
                          {project.category}
                        </span>
                      </div>

                      <h3 className={`font-display font-bold text-2xl ${textPrimary} group-hover:text-[#38BDF8] group-hover:translate-x-1 transition-all duration-300 mb-3`}>
                        {project.title}
                      </h3>

                      <p className={`text-sm ${textMuted} leading-relaxed mb-6`}>
                        {project.description}
                      </p>
                    </div>

                    <div className="relative z-10">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className={`font-mono-tech text-[11px] px-2.5 py-1 rounded-md ${bgCardInner} border ${borderSubtle} ${textPrimary}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {project.actionType === 'yanvi-jump' ? (
                        <a
                          href="#yanvi"
                          className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#0F294A] hover:bg-[#163A66] border border-[#38BDF8]/40 text-[#38BDF8] font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          <span>Explore YANVI Venture</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConsoleView('roster');
                            setActiveProjectModal(project);
                          }}
                          className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-xl ${bgCardInner} hover:bg-[#38BDF8] border ${borderSubtle} hover:border-[#38BDF8] ${textPrimary} hover:text-[#080E1A] font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors`}
                        >
                          <span>
                            {project.id === 'attendance-system'
                              ? 'Launch Interactive Console Brief'
                              : 'Inspect Project Brief'}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </article>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. YANVI — SIGNATURE STARTUP SPOTLIGHT (04 // VENTURE SPOTLIGHT)
      ==================================================================== */}
      <section
        id="yanvi"
        className="py-24 md:py-32 relative overflow-hidden border-y border-[#38BDF8]/30 bg-gradient-to-b from-[#0A192F] via-[#0F294A] to-[#080E1A] text-[#F1F5F9]"
      >
        <svg
          aria-hidden="true"
          className="animate-float-slow absolute -right-24 top-12 w-[480px] h-[480px] text-[#38BDF8]/[0.08] pointer-events-none"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M40 360C90 220 210 110 360 40C310 180 190 290 40 360Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M90 380C140 250 240 150 380 90"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <RevealBlock>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080E1A]/60 border border-[#38BDF8]/40 font-mono-tech text-xs text-[#38BDF8] uppercase tracking-widest mb-6">
              <Leaf className="w-3.5 h-3.5" />
              <span>04 // VENTURE SPOTLIGHT · FOUNDED IN NEPAL</span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#F1F5F9]/15">
              <div className="lg:col-span-7">
                <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#F1F5F9] leading-none">
                  YANVI
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm uppercase tracking-[0.2em] text-[#38BDF8] mt-3">
                  Youth And Nurtured Voice for Innovation
                </p>
              </div>
              <div className="lg:col-span-5">
                <p className="font-serif-editorial italic text-2xl sm:text-4xl text-[#F1F5F9] leading-snug">
                  &ldquo;From Banana Waste to Sustainable Future.&rdquo;
                </p>
              </div>
            </div>
          </RevealBlock>

          <div className="grid lg:grid-cols-12 gap-8 mt-12">
            <RevealBlock delay={80} className="lg:col-span-7 space-y-6">
              <div className="p-7 sm:p-8 rounded-3xl bg-[#080E1A]/75 backdrop-blur-md border border-[#38BDF8]/20">
                <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38BDF8] block mb-2">
                  BUSINESS CONCEPT
                </span>
                <h3 className="font-display font-bold text-2xl text-[#F1F5F9] mb-3">
                  Transforming Agricultural Waste into Biodegradable Value
                </h3>
                <p className="text-sm sm:text-base text-[#F1F5F9]/85 leading-relaxed">
                  YANVI is a sustainability-focused startup based in Nepal that explores transforming discarded banana stems and agricultural waste into biodegradable and eco-friendly products. Rather than letting post-harvest banana trunks rot or burn as agricultural waste, YANVI reimagines them as renewable raw material for everyday essentials.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-[#080E1A]/75 border border-[#38BDF8]/20">
                  <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38BDF8] block mb-2">
                    OUR VISION
                  </span>
                  <p className="text-sm text-[#F1F5F9]/90 leading-relaxed">
                    To create a recognized sustainable brand that connects environmental responsibility, innovation and entrepreneurship.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#080E1A]/75 border border-[#38BDF8]/20">
                  <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38BDF8] block mb-2">
                    OUR MISSION
                  </span>
                  <p className="text-sm text-[#F1F5F9]/90 leading-relaxed">
                    To convert agricultural waste into valuable products while exploring opportunities for local communities.
                  </p>
                </div>
              </div>
            </RevealBlock>

            <RevealBlock delay={160} className="lg:col-span-5 space-y-6">
              <div className="p-7 rounded-3xl bg-[#080E1A]/75 border border-[#38BDF8]/20">
                <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38BDF8] block mb-4">
                  CHALLENGES WE AIM TO ADDRESS
                </span>
                <ul className="space-y-2.5">
                  {[
                    'Agricultural waste from discarded banana stems',
                    'Single-use plastic pollution',
                    'Limited utilization of local natural resources',
                    'Youth unemployment',
                    'Limited economic opportunities for women'
                  ].map((problem, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-xs sm:text-sm text-[#F1F5F9]/90 p-2.5 rounded-xl bg-[#13294B]/60 border border-[#38BDF8]/15"
                    >
                      <span className="font-mono-tech text-[10px] text-[#38BDF8]">0{idx + 1}</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sky Blue Founder's Note Card */}
              <div
                onContextMenu={(e) => e.preventDefault()}
                className="p-6 rounded-2xl bg-[#60A5FA] text-[#08101E] shadow-[0_18px_38px_-12px_rgba(96,165,250,0.45)] select-none"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <LockedPortraitImage
                    portraitSrc={portraitSrc}
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#08101E] shadow-md shrink-0"
                  />
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-widest block">
                      FOUNDER&apos;S NOTE · SMITH SHARMA
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#08101E]/80 block">
                      Founder &amp; Owner, YANVI
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  &ldquo;YANVI began with a simple question in Nepal: why should valuable natural fibers go to waste while communities need sustainable livelihoods? Combining thoughtful design with circular thinking is how we build lasting impact.&rdquo;
                </p>
              </div>
            </RevealBlock>
          </div>

          {/* Interactive Banana Stem -> Eco Product Circular Transformation Pipeline */}
          <RevealBlock delay={180} className="mt-14">
            <div className="p-7 sm:p-8 rounded-3xl bg-[#080E1A]/85 border border-[#38BDF8]/30">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Recycle className="w-5 h-5 text-[#38BDF8]" />
                  <div>
                    <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38BDF8] block">
                      INTERACTIVE CIRCULAR ECONOMY STUDIO
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F1F5F9]">
                      Banana Stem &rarr; Eco-Product Pipeline
                    </h3>
                  </div>
                </div>
                <span className="font-mono-tech text-xs text-[#94A8C7]">
                  Click each stage to trace material flow
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {yanviPipelineStages.map((st, idx) => {
                  const active = yanviStage === idx;
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setYanviStage(idx)}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        active
                          ? 'bg-[#13294B] border-[#38BDF8] text-[#F1F5F9] shadow-lg'
                          : 'bg-[#0E1729] border-[#1E3354] text-[#94A8C7] hover:border-[#38BDF8]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-tech text-[11px] font-bold text-[#38BDF8]">
                          {st.step}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            active ? 'bg-[#38BDF8]' : 'bg-[#F1F5F9]/20'
                          }`}
                        />
                      </div>
                      <p className="font-display font-bold text-base text-[#F1F5F9]">{st.title}</p>
                      <p className="font-mono-tech text-[11px] text-[#38BDF8]/85 mt-1">
                        {st.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1729] border border-[#1E3354] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm text-[#F1F5F9]/90 leading-relaxed max-w-2xl">
                  {yanviPipelineStages[yanviStage].description}
                </p>
                <div className="px-4 py-3 rounded-xl bg-[#080E1A] border border-[#38BDF8]/30 shrink-0">
                  <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#94A8C7] block">
                    {yanviPipelineStages[yanviStage].metricLabel}
                  </span>
                  <span className="font-display font-bold text-sm text-[#38BDF8]">
                    {yanviPipelineStages[yanviStage].metricValue}
                  </span>
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* Interactive 5-Card Biodegradable Product Lineup Selector */}
          <RevealBlock delay={200} className="mt-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#38BDF8]">
                  SUSTAINABLE PRODUCT CONCEPTS
                </span>
                <h3 className="font-display font-bold text-2xl text-[#F1F5F9] mt-1">
                  Biodegradable Product Lineup
                </h3>
              </div>
              <span className="font-mono-tech text-xs text-[#F1F5F9]/75">
                Material: {yanviProducts[selectedYanviProduct].material}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {yanviProducts.map((prod, index) => {
                const isSelected = selectedYanviProduct === index;
                return (
                  <button
                    key={prod.code}
                    type="button"
                    onMouseEnter={() => setSelectedYanviProduct(index)}
                    onClick={() => setSelectedYanviProduct(index)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#080E1A] border-[#38BDF8] shadow-xl -translate-y-1.5 scale-[1.02]'
                        : 'bg-[#080E1A]/85 text-[#F1F5F9] border-[#1E3354] hover:border-[#38BDF8]/60 hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      <span
                        className={`font-mono-tech text-[11px] font-bold block mb-3 ${
                          isSelected ? 'text-[#080E1A]/80' : 'text-[#38BDF8]'
                        }`}
                      >
                        CONCEPT {prod.code}
                      </span>
                      <h4 className="font-display font-bold text-base leading-snug mb-2">
                        {prod.name}
                      </h4>
                    </div>
                    <p
                      className={`text-xs leading-relaxed mt-2 ${
                        isSelected ? 'text-[#080E1A]/85' : 'text-[#94A8C7]'
                      }`}
                    >
                      {prod.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ====================================================================
          7. EXPERIENCE, LEADERSHIP & EDUCATION TIMELINE (05 // EXPERIENCE & EDUCATION)
      ==================================================================== */}
      <section id="journey" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-3`}>
                <span>05 // EXPERIENCE &amp; EDUCATION</span>
                <span className="h-px w-12 bg-[#38BDF8]/40" />
              </div>
              <h2 className={`font-display font-bold text-3xl sm:text-5xl ${textPrimary} tracking-tight`}>
                Leadership &amp; <span className={`font-serif-editorial italic font-normal ${accentText}`}>Journey.</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Education', 'Entrepreneurship', 'Leadership & Tech'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTimelineFilter(cat)}
                  className={`px-3.5 py-2 rounded-full font-mono-tech text-[11px] uppercase tracking-wider transition-all ${
                    timelineFilter === cat
                      ? accentBg + ' font-semibold'
                      : `${bgCard} border ${borderSubtle} ${textMuted} hover:${textPrimary}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealBlock>

          <div className={`relative pl-6 sm:pl-10 border-l ${borderSubtle} space-y-6`}>
            {visibleTimelineItems.map((item, idx) => {
              const isExpanded = expandedTimelineIdx[idx] !== false;
              return (
                <RevealBlock key={`${item.title}-${idx}`} delay={idx * 60}>
                  <div className="relative group">
                    <span
                      className={`absolute -left-[31px] sm:-left-[47px] top-6 w-3.5 h-3.5 rounded-full ${
                        isLight ? 'bg-[#F4F7FB]' : 'bg-[#080E1A]'
                      } border-2 border-[#38BDF8] group-hover:bg-[#38BDF8] transition-colors`}
                    />

                    <div className={`p-6 sm:p-7 rounded-2xl ${bgCard} border hover:border-[#38BDF8]/60 transition-colors`}>
                      <button
                        type="button"
                        onClick={() => toggleTimelineCard(idx)}
                        aria-expanded={isExpanded}
                        className="w-full text-left flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`font-mono-tech text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border ${accentBadge}`}>
                              {item.type}
                            </span>
                            <span className={`font-mono-tech text-xs ${textMuted}`}>
                              {item.location} · {item.period}
                            </span>
                          </div>

                          <h3 className={`font-display font-bold text-lg sm:text-xl ${textPrimary} mt-1`}>
                            {item.title}
                          </h3>
                          <p className={`text-xs sm:text-sm font-medium ${accentText}`}>
                            {item.organization}
                          </p>
                        </div>

                        <span className={`p-2 rounded-lg ${bgCardInner} border ${borderSubtle} ${textMuted} shrink-0`}>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      </button>

                      {isExpanded && (
                        <ul className={`space-y-1.5 text-xs sm:text-sm ${textMuted} mt-4 pt-4 border-t ${borderSubtle}`}>
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2.5">
                              <span className={`${accentText} mt-1`}>•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. 5-PHASE FUTURE GOALS ROADMAP (06 // GROWTH TRAJECTORY)
      ==================================================================== */}
      <section id="roadmap" className={`py-24 md:py-32 border-t ${borderSubtle} ${isLight ? 'bg-[#ECF2FA]' : 'bg-[#0B1324]'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock className="max-w-3xl mb-12">
            <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-3`}>
              <span>06 // GROWTH TRAJECTORY</span>
              <span className="h-px w-12 bg-[#38BDF8]/40" />
            </div>
            <h2 className={`font-display font-bold text-3xl sm:text-5xl ${textPrimary} tracking-tight`}>
              Still Learning.{' '}
              <span className={`font-serif-editorial italic font-normal ${accentText}`}>
                Always Building.
              </span>
            </h2>
            <p className={`text-sm sm:text-base ${textMuted} mt-3 leading-relaxed`}>
              Click or hover any phase card below to inspect my structured five-phase roadmap from core web foundations to full-stack MERN engineering and sustainable venture scaling.
            </p>
          </RevealBlock>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {roadmapPhases.map((step, idx) => {
              const isSelectedPhase = activeRoadmapIdx === idx;
              return (
                <RevealBlock key={step.phase} delay={idx * 85}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveRoadmapIdx(idx)}
                    onClick={() => setActiveRoadmapIdx(idx)}
                    className={`w-full text-left h-full p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 group ${
                      isSelectedPhase
                        ? isLight
                          ? 'bg-gradient-to-b from-[#DCE8FA] to-white border-[#1D4ED8] shadow-xl -translate-y-1.5'
                          : 'bg-gradient-to-b from-[#13294B] to-[#0E1729] border-[#38BDF8] shadow-xl -translate-y-1.5'
                        : `${bgCard} hover:border-[#38BDF8]/50 hover:-translate-y-1`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`font-mono-tech text-xs font-bold ${accentText}`}>
                          {step.phase}
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            isSelectedPhase ? 'bg-[#38BDF8]' : 'bg-[#1E3354] group-hover:bg-[#38BDF8]'
                          }`}
                        />
                      </div>

                      <span className={`font-mono-tech text-[10px] uppercase tracking-widest ${textMuted} block mb-1`}>
                        {step.status}
                      </span>

                      <h3 className={`font-display font-bold text-lg ${textPrimary} mb-2`}>
                        {step.title}
                      </h3>

                      <p className={`text-xs ${textPrimary} opacity-90 font-medium mb-4 leading-relaxed`}>
                        {step.description}
                      </p>
                    </div>

                    <ul className={`pt-4 border-t ${borderSubtle} space-y-1.5`}>
                      {step.focusPoints.map((pt, pIdx) => (
                        <li key={pIdx} className={`text-[11px] ${textMuted} flex items-start gap-1.5`}>
                          <span className={accentText}>›</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                </RevealBlock>
              );
            })}
          </div>

          <RevealBlock delay={150} className="mt-8">
            <div className={`p-6 rounded-2xl ${bgCard} border flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <div className="flex items-start gap-3.5">
                <Compass className={`w-5 h-5 ${accentText} shrink-0 mt-0.5`} />
                <div>
                  <span className={`font-mono-tech text-[11px] uppercase tracking-widest ${accentText}`}>
                    SELECTED MILESTONE · {roadmapPhases[activeRoadmapIdx].phase} ({roadmapPhases[activeRoadmapIdx].status})
                  </span>
                  <p className={`font-display font-bold text-lg ${textPrimary} mt-0.5`}>
                    {roadmapPhases[activeRoadmapIdx].title}: {roadmapPhases[activeRoadmapIdx].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveRoadmapIdx((prev) => (prev === 0 ? roadmapPhases.length - 1 : prev - 1))
                  }
                  className={`px-3.5 py-2 rounded-xl ${bgCardInner} border ${borderSubtle} hover:border-[#38BDF8] font-mono-tech text-xs ${textPrimary}`}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoadmapIdx((prev) => (prev + 1) % roadmapPhases.length)}
                  className={`px-3.5 py-2 rounded-xl ${accentBg} font-mono-tech text-xs font-semibold`}
                >
                  Next Phase
                </button>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ====================================================================
          9. CLOSING CONTACT SECTION (07 // INITIATE CONVERSATION)
      ==================================================================== */}
      <section id="contact" className={`py-24 md:py-32 border-t ${borderSubtle} relative overflow-hidden`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-[#1D4ED8]/20 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock>
            <div className={`flex items-center gap-3 font-mono-tech text-xs tracking-widest ${accentText} uppercase mb-4`}>
              <span>07 // INITIATE CONVERSATION</span>
              <span className="h-px w-12 bg-[#38BDF8]/40" />
            </div>

            <h2 className={`font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight ${textPrimary} leading-[1.02] max-w-4xl`}>
              LET&apos;S MAKE IT{' '}
              <span className={`font-serif-editorial italic font-normal ${accentText}`}>
                HAPPEN.
              </span>
            </h2>
          </RevealBlock>

          <div className="grid lg:grid-cols-12 gap-10 mt-12 items-start">
            {/* Direct Contact & All 4 Connected Social Media Profiles */}
            <RevealBlock delay={100} className="lg:col-span-5 space-y-5">
              <div
                onContextMenu={(e) => e.preventDefault()}
                className={`flex items-center gap-4 p-4 rounded-2xl ${bgCard} border select-none`}
              >
                <LockedPortraitImage
                  portraitSrc={portraitSrc}
                  className="w-16 h-16 rounded-2xl object-cover object-top border border-[#60A5FA]/50 shadow-[0_10px_24px_-6px_rgba(4,10,24,0.65)] shrink-0"
                />
                <div>
                  <p className={`font-display font-bold text-base ${textPrimary}`}>Smith Sharma</p>
                  <p className={`font-mono-tech text-[11px] ${accentText}`}>
                    Pokhara, Nepal · Open to Collaborations
                  </p>
                </div>
              </div>

              <p className={`text-sm sm:text-base ${textMuted} leading-relaxed`}>
                Whether you want to collaborate on web development projects, discuss YANVI and sustainable innovation, or connect around entrepreneurship and youth leadership, reach out directly.
              </p>

              <div className={`p-6 rounded-2xl ${bgCard} border space-y-4`}>
                <div>
                  <span className={`font-mono-tech text-[10px] uppercase tracking-widest ${textMuted} block mb-1`}>
                    DIRECT EMAIL
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href="mailto:smithsharmasubedi@gmail.com"
                      className={`font-display font-semibold text-sm sm:text-base ${textPrimary} hover:text-[#38BDF8] break-all transition-colors`}
                    >
                      smithsharmasubedi@gmail.com
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className={`p-2 rounded-lg ${bgCardInner} border ${borderSubtle} hover:border-[#38BDF8] ${textPrimary} shrink-0 transition-colors`}
                    >
                      {copiedEmail ? <Check className={`w-4 h-4 ${accentText}`} /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className={`pt-3 border-t ${borderSubtle}`}>
                  <span className={`font-mono-tech text-[10px] uppercase tracking-widest ${textMuted} block mb-1`}>
                    BASE LOCATION
                  </span>
                  <p className={`text-sm ${textPrimary} flex items-center gap-2`}>
                    <MapPin className={`w-4 h-4 ${accentText}`} />
                    <span>Pokhara, Nepal</span>
                  </p>
                </div>
              </div>

              {/* Connected Social Media Grid: LinkedIn, GitHub, Instagram, Facebook */}
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  const IconComp = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex items-center justify-between p-4 rounded-2xl ${bgCard} border hover:border-[#38BDF8] ${textPrimary} transition-all hover:-translate-y-0.5`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp className={`w-4 h-4 ${accentText} shrink-0`} />
                        <div className="truncate">
                          <span className="font-mono-tech text-xs font-semibold block leading-tight">
                            {social.name}
                          </span>
                          <span className={`font-mono-tech text-[10px] ${textMuted} block truncate`}>
                            {social.handle}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className={`w-4 h-4 ${textMuted} group-hover:text-[#38BDF8] shrink-0`} />
                    </a>
                  );
                })}
              </div>
            </RevealBlock>

            {/* Direct Email Composer */}
            <RevealBlock delay={180} className="lg:col-span-7">
              <form
                onSubmit={handleMailtoSubmit}
                className={`p-7 sm:p-8 rounded-3xl ${bgCard} border space-y-5`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-2 border-b ${borderSubtle} pb-4`}>
                  <span className={`font-mono-tech text-xs uppercase tracking-widest ${accentText}`}>
                    DIRECT EMAIL COMPOSER
                  </span>
                  <span className={`font-mono-tech text-[11px] ${textMuted}`}>
                    Opens your default mail app
                  </span>
                </div>

                <div>
                  <span className={`block font-mono-tech text-[11px] uppercase ${textMuted} mb-2`}>
                    Quick Topic Preset
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {contactTopics.map((topic) => (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className={`px-3 py-1.5 rounded-full font-mono-tech text-[11px] transition-all ${
                          selectedTopic === topic.label
                            ? accentBg + ' font-semibold'
                            : `${bgCardInner} border ${borderSubtle} ${textMuted} hover:${textPrimary}`
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="senderName" className={`block font-mono-tech text-[11px] uppercase ${textMuted} mb-2`}>
                      Your Name
                    </label>
                    <input
                      id="senderName"
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-xl ${bgCardInner} border ${borderSubtle} focus:border-[#38BDF8] focus:outline-none text-sm ${textPrimary}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="mailSubject" className={`block font-mono-tech text-[11px] uppercase ${textMuted} mb-2`}>
                      Subject
                    </label>
                    <input
                      id="mailSubject"
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl ${bgCardInner} border ${borderSubtle} focus:border-[#38BDF8] focus:outline-none text-sm ${textPrimary}`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mailBody" className={`block font-mono-tech text-[11px] uppercase ${textMuted} mb-2`}>
                    Message
                  </label>
                  <textarea
                    id="mailBody"
                    rows={4}
                    required
                    value={contactForm.body}
                    onChange={(e) => setContactForm({ ...contactForm, body: e.target.value })}
                    placeholder="Write your message for Smith Sharma..."
                    className={`w-full px-4 py-3 rounded-xl ${bgCardInner} border ${borderSubtle} focus:border-[#38BDF8] focus:outline-none text-sm ${textPrimary}`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 px-6 rounded-xl ${accentBg} font-mono-tech text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Compose Email to Smith Sharma</span>
                </button>
              </form>
            </RevealBlock>
          </div>
        </div>
      </section>

      <footer className={`border-t ${borderSubtle} ${isLight ? 'bg-[#E9EFF8]' : 'bg-[#070D19]'} py-12`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-4 select-none"
          >
            <LockedPortraitImage
              portraitSrc={portraitSrc}
              className="w-12 h-12 rounded-xl object-cover object-top border border-[#60A5FA]/50 shadow-[0_8px_20px_-4px_rgba(4,10,24,0.65)] shrink-0"
            />
            <div>
              <p className={`font-display font-bold text-base ${textPrimary}`}>
                Smith Sharma — A Developer in Progress. An Entrepreneur by Vision. A Builder of Possibilities.
              </p>
              <p className={`font-mono-tech text-xs ${textMuted} mt-1`}>
                Pokhara, Nepal · BIM at Janapriya Multiple Campus (Tribhuvan University) · Founder of YANVI
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((s) => {
              const IconComp = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className={`p-2.5 rounded-full ${bgCard} border ${borderSubtle} hover:border-[#38BDF8] ${textPrimary} transition-colors`}
                >
                  <IconComp className="w-4 h-4" />
                </a>
              );
            })}

            <a
              href="#hero"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderSubtle} hover:border-[#38BDF8] font-mono-tech text-xs ${textPrimary} transition-colors`}
            >
              <span>BACK TO TOP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          COMMAND PALETTE MODAL (Cmd/Ctrl + K)
      ==================================================================== */}
      {cmdOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Command Palette"
          onClick={() => setCmdOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-3xl ${bgCard} border border-[#38BDF8]/40 shadow-2xl overflow-hidden`}
          >
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${borderSubtle}`}>
              <Search className={`w-4 h-4 ${accentText}`} />
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Type a section, project demo, or social link..."
                className={`w-full bg-transparent text-sm ${textPrimary} focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className={`px-2 py-1 rounded ${bgCardInner} font-mono-tech text-[10px] ${textMuted}`}
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2.5 space-y-1">
              {filteredCommands.length === 0 ? (
                <p className={`py-8 text-center text-xs font-mono-tech ${textMuted}`}>
                  No matching commands found.
                </p>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => {
                      setCmdOpen(false);
                      cmd.run();
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-[#13294B]/50 text-left transition-colors group"
                  >
                    <div>
                      <span className={`font-mono-tech text-[10px] uppercase tracking-widest ${accentText} block`}>
                        {cmd.group}
                      </span>
                      <span className={`text-sm font-medium ${textPrimary} group-hover:text-[#38BDF8]`}>
                        {cmd.label}
                      </span>
                    </div>
                    <span className={`font-mono-tech text-[11px] ${textMuted} shrink-0`}>
                      {cmd.hint}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PROJECT BRIEF MODAL INSPECTOR WITH INTERACTIVE MINI-DEMOS
      ==================================================================== */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          onClick={() => setActiveProjectModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${bgCard} border p-7 sm:p-8 shadow-2xl relative`}
          >
            <button
              type="button"
              onClick={() => setActiveProjectModal(null)}
              aria-label="Close modal"
              className={`absolute top-6 right-6 p-2 rounded-full ${bgCardInner} border ${borderSubtle} ${textMuted} hover:${textPrimary}`}
            >
              <X className="w-4 h-4" />
            </button>

            <span className={`font-mono-tech text-xs ${accentText} uppercase tracking-widest`}>
              PROJECT {activeProjectModal.number} · {activeProjectModal.category}
            </span>
            <h3 id="modal-project-title" className={`font-display font-bold text-2xl sm:text-3xl ${textPrimary} mt-1`}>
              {activeProjectModal.title}
            </h3>

            <p className={`text-sm ${textMuted} mt-4 leading-relaxed`}>
              {activeProjectModal.overview}
            </p>

            {/* Interactive Simulated C Console Preview for Attendance Management System */}
            {activeProjectModal.id === 'attendance-system' && (
              <div className="mt-6 rounded-2xl bg-[#050912] border border-[#38BDF8]/40 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#080E1A] border-b border-[#1E3354] flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-mono-tech text-[11px] text-[#38BDF8]">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>SIMULATED C CONSOLE WORKFLOW</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'roster', label: '[1] Student & Subject Roster' },
                      { id: 'mark', label: '[2] Mark Attendance' },
                      { id: 'summary', label: '[3] Attendance Summary' }
                    ].map((cmd) => (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={() => setConsoleView(cmd.id)}
                        className={`px-2.5 py-1 rounded font-mono-tech text-[10px] transition-colors ${
                          consoleView === cmd.id
                            ? 'bg-[#38BDF8] text-[#080E1A] font-bold'
                            : 'bg-[#0E1729] text-[#94A8C7] hover:text-[#F1F5F9]'
                        }`}
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>

                <pre className="p-4 font-mono-tech text-xs text-[#F1F5F9]/90 overflow-x-auto leading-relaxed">
                  {consoleView === 'roster' &&
                    `=========================================================\n` +
                    `   ATTENDANCE MANAGEMENT SYSTEM (C CLI) :: MODULE 01\n` +
                    `=========================================================\n` +
                    `ROLL_NO  | STUDENT_NAME        | SUBJECT        | TEACHER\n` +
                    `---------+---------------------+----------------+----------------\n` +
                    `BIM-101  | Aarav Gurung        | C Programming  | Prof. R. Adhikari\n` +
                    `BIM-102  | Srijana Thapa       | C Programming  | Prof. R. Adhikari\n` +
                    `BIM-103  | Nischal Poudel      | Web Tech I     | Prof. M. Karki\n` +
                    `---------------------------------------------------------\n` +
                    `[STATUS] Loaded 3 active student records from records.dat`}
                  {consoleView === 'mark' &&
                    `=========================================================\n` +
                    `   ATTENDANCE ENTRY MODE :: SUBJECT: C PROGRAMMING\n` +
                    `=========================================================\n` +
                    `> Enter Status (P = Present, A = Absent):\n` +
                    `  [BIM-101] Aarav Gurung   --> [P] Recorded\n` +
                    `  [BIM-102] Srijana Thapa  --> [P] Recorded\n` +
                    `  [BIM-103] Nischal Poudel --> [A] Recorded\n` +
                    `---------------------------------------------------------\n` +
                    `[SAVED] Attendance batch committed to file storage.`}
                  {consoleView === 'summary' &&
                    `=========================================================\n` +
                    `   SUBJECT-WISE ATTENDANCE REPORT :: BIM SEMESTER\n` +
                    `=========================================================\n` +
                    `ROLL_NO  | PRESENT | TOTAL_CLASSES | ATTENDANCE_RATE\n` +
                    `---------+---------+---------------+-----------------\n` +
                    `BIM-101  |   18    |      20       | 90.0% [ELIGIBLE]\n` +
                    `BIM-102  |   19    |      20       | 95.0% [ELIGIBLE]\n` +
                    `BIM-103  |   15    |      20       | 75.0% [ELIGIBLE]\n` +
                    `=========================================================`}
                </pre>
              </div>
            )}

            {/* Interactive UI Design System Inspector for Personal Portfolio */}
            {activeProjectModal.id === 'personal-portfolio' && (
              <div className={`mt-6 p-4 rounded-2xl ${bgCardInner} border border-[#38BDF8]/40 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-2 font-mono-tech text-[11px] ${accentText}`}>
                    <Sliders className="w-3.5 h-3.5" />
                    <span>LIVE NAVY DESIGN TOKEN INSPECTOR</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoGridVisible((v) => !v);
                      setShowAmbientGrid((v) => !v);
                    }}
                    className={`px-3 py-1 rounded-lg border ${accentBadge} font-mono-tech text-[10px] uppercase`}
                  >
                    {demoGridVisible ? 'Toggle Background Grid: ON' : 'Toggle Background Grid: OFF'}
                  </button>
                </div>
                <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono-tech ${textPrimary}`}>
                  <div className={`p-2.5 rounded-xl ${bgCard} border ${borderSubtle}`}>
                    <span className="block w-4 h-4 rounded bg-[#080E1A] border border-[#38BDF8]/40 mb-1" />
                    #080E1A Midnight
                  </div>
                  <div className={`p-2.5 rounded-xl ${bgCard} border ${borderSubtle}`}>
                    <span className="block w-4 h-4 rounded bg-[#0F294A] mb-1" />
                    #0F294A Royal Navy
                  </div>
                  <div className={`p-2.5 rounded-xl ${bgCard} border ${borderSubtle}`}>
                    <span className="block w-4 h-4 rounded bg-[#38BDF8] mb-1" />
                    #38BDF8 Sky Accent
                  </div>
                  <div className={`p-2.5 rounded-xl ${bgCard} border ${borderSubtle}`}>
                    <span className="block w-4 h-4 rounded bg-[#F4F7FB] border border-[#0F294A]/30 mb-1" />
                    #F4F7FB Coastal Light
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-6 pt-5 border-t ${borderSubtle}`}>
              <span className={`font-mono-tech text-[11px] uppercase tracking-widest ${accentText} block mb-3`}>
                KEY ARCHITECTURAL NOTES
              </span>
              <ul className={`space-y-2 text-xs sm:text-sm ${textPrimary}`}>
                {activeProjectModal.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${accentText} shrink-0 mt-0.5`} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {activeProjectModal.tech.map((t) => (
                <span
                  key={t}
                  className={`font-mono-tech text-[11px] px-3 py-1 rounded-md ${bgCardInner} border ${borderSubtle} ${textPrimary}`}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className={`px-5 py-2.5 rounded-xl ${accentBg} font-mono-tech text-xs font-bold uppercase tracking-wider`}
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}