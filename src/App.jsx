import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  Mail,
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
// SELF-CONTAINED BRAND SVG ICONS (COMPATIBLE WITH ALL LUCIDE-REACT VERSIONS)
// ============================================================================
const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ============================================================================
// IMMUTABLE PROFILE ASSET CONFIGURATION (FIXED FOREVER ONCE SET)
// ============================================================================
const LOCKED_PORTRAIT_CONFIG = Object.freeze({
  src: '/smiithsharma.jpeg',
  alt: 'Smith Sharma — Founder of YANVI and Aspiring MERN Stack Developer',
  focalPosition: '38% 18%'
});
const PORTRAIT_STORAGE_KEY = 'smith_sharma_permanent_portrait_v3';

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
// COMPONENT: LOCKED PORTRAIT RENDERER (ONE-TIME UPLOAD -> PERMANENT LOCK)
// ============================================================================
function LockedPortraitImage({
  portraitSrc,
  onUploadAndLock,
  showUploadOverlay = false,
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
        onUploadAndLock?.(ev.target.result);
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
        {showUploadOverlay && (
          <>
            <p className="font-mono-tech text-[11px] text-[#CBD5E1] mt-2 max-w-[220px] leading-relaxed">
              Upload your photo once. It will automatically fix and lock forever across your site.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3.5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#60A5FA] hover:bg-[#93C5FD] text-[#08101E] font-mono-tech text-[11px] font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload &amp; Lock Photo</span>
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
    <div className="relative w-full h-full">
      <img
        src={portraitSrc}
        alt={LOCKED_PORTRAIT_CONFIG.alt}
        draggable={false}
        onError={() => setImgFailed(true)}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          objectPosition: LOCKED_PORTRAIT_CONFIG.focalPosition,
          ...style
        }}
        className={`locked-portrait-img ${className}`}
      />
      {showUploadOverlay && (
        <div className="absolute top-3.5 right-3.5 z-30">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1324]/85 hover:bg-[#60A5FA] backdrop-blur-md border border-[#60A5FA]/50 text-[#93C5FD] hover:text-[#08101E] font-mono-tech text-[10px] font-semibold uppercase tracking-wider shadow-lg transition-all"
          >
            <Upload className="w-3 h-3" />
            <span>Upload &amp; Fix Forever</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Eye-Pleasing Navy Theme Mode: 'midnight' (Velvet Sapphire) | 'coastal' (Soft Mist Navy)
  const [navyMode, setNavyMode] = useState('midnight');
  const isLight = navyMode === 'coastal';

  // Permanent Locked Portrait Photo State (Once uploaded, locked forever)
  const [portraitSrc, setPortraitSrc] = useState(LOCKED_PORTRAIT_CONFIG.src);
  const [isPortraitFixedForever, setIsPortraitFixedForever] = useState(true);

  const handleUploadAndFixForever = (dataUrl) => {
    setPortraitSrc(LOCKED_PORTRAIT_CONFIG.src);
    setIsPortraitFixedForever(true);
    triggerToast('Smith Sharma photo is fixed as the permanent profile portrait.');
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
    setTimeout(() => setToastMessage(null), 3500);
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
      icon: LinkedinIcon
    },
    {
      name: 'GitHub',
      handle: 'smithsharma123/smith123',
      href: 'https://github.com/smithsharma123/smith123',
      icon: GithubIcon
    },
    {
      name: 'Instagram',
      handle: '@smith_sharma_02',
      href: 'https://www.instagram.com/smith_sharma_02/',
      icon: InstagramIcon
    },
    {
      name: 'Facebook',
      handle: 'smith.sharma.568632',
      href: 'https://www.facebook.com/smith.sharma.568632/',
      icon: FacebookIcon
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
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#60A5FA]/60 shadow-md shrink-0">
              <LockedPortraitImage
                portraitSrc={portraitSrc}
                className="w-full h-full object-cover"
              />
            </div>
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
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 3D Portrait Card Column */}
            <div className="lg:col-span-5">
              <div
                onMouseMove={handlePortraitMouseMove}
                onMouseLeave={handlePortraitMouseLeave}
                className="group relative w-full h-96 sm:h-[450px] rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* 3D Tilt & Glare Effect Layers */}
                <div
                  className="absolute inset-0 rounded-3xl transition-transform duration-500"
                  style={{
                    transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg) translateZ(0px)`
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1324] to-[#1B335C] opacity-80" />
                  <div className="w-full h-full bg-gradient-to-t from-[#38BDF8]/20 to-transparent" />
                  <div className="w-full h-full bg-gradient-to-l from-[#38BDF8]/20 to-transparent" />
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 rounded-3xl border border-[#60A5FA]/30" />
                  <div className="absolute top-4 left-4 w-full h-full rounded-3xl bg-[#0B1324] opacity-90" />
                  <div className="relative w-full h-full rounded-3xl overflow-hidden">
                    <LockedPortraitImage
                      portraitSrc={portraitSrc}
                      showUploadOverlay={false}
                      onUploadAndLock={handleUploadAndFixForever}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Interactive Info Reveal on Hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <p className={`text-xs font-mono-tech tracking-widest ${textMuted} uppercase`}>
                      {isPortraitFixedForever ? 'PERMANENTLY LOCKED PORTRAIT' : 'UPLOADED PORTRAIT'}
                    </p>
                    <p className={`mt-1 text-lg sm:text-xl font-display ${textPrimary}`}>
                      Smith Sharma
                    </p>
                    <p className={`text-xs font-mono-tech ${textMuted} leading-tight`}>
                      Founder of YANVI · Aspiring MERN Stack Developer
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveProjectModal(projectsData[2])}
                    className={`mt-4 px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                      isLight
                        ? 'bg-[#60A5FA] text-[#08101E] shadow-md hover:bg-[#93C5FD]'
                        : 'bg-[#38BDF8] text-[#0B1324] shadow-md hover:bg-[#60A5FA]'
                    }`}
                  >
                    View Full Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
3. EDITORIAL ABOUT SECTION
      ==================================================================== */}
      <section id="about" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              About
            </h2>
          </RevealBlock>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Editorial Bio & Mission */}
            <div className="space-y-6">
              <RevealBlock delay={200}>
                <p className={`text-lg sm:text-xl ${textMuted} leading-relaxed`}>
                  I am an aspiring MERN Stack Developer and entrepreneur from Pokhara, Nepal. Currently pursuing a Bachelor of Information Management (BIM) at Tribhuvan University, I am passionate about bridging technology and sustainable innovation.
                </p>
              </RevealBlock>

              <RevealBlock delay={300}>
                <p className={`text-lg sm:text-xl ${textMuted} leading-relaxed`}>
                  As the founder of YANVI, I lead the vision of transforming discarded banana stems into biodegradable products, addressing environmental challenges while creating economic opportunities for youth and women in my community.
                </p>
              </RevealBlock>

              <RevealBlock delay={400}>
                <p className={`text-lg sm:text-xl ${textMuted} leading-relaxed`}>
                  My journey is driven by a deep commitment to learning, creativity, and the pursuit of impactful solutions. I believe in the power of technology to reshape industries and improve lives, and I am excited to contribute my skills and passion to meaningful projects.
                </p>
              </RevealBlock>
            </div>

            {/* Right: Portrait & Contact CTA */}
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <LockedPortraitImage
                  portraitSrc={portraitSrc}
                  showUploadOverlay={false}
                  onUploadAndLock={handleUploadAndFixForever}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-6 bg-[#0B1324] bg-opacity-90 rounded-3xl border border-[#213559] shadow-md">
                <RevealBlock delay={200}>
                  <h3 className={`text-xl sm:text-2xl font-display ${textPrimary}`}>
                    Let&apos;s Connect
                  </h3>
                </RevealBlock>


                <RevealBlock delay={300}>
                  <p className={`text-sm sm:text-base ${textMuted} leading-relaxed`}>
                    I am always open to discussing new projects, creative ideas, or opportunities for collaboration. Let’s connect and explore how we can work together to make a positive impact.
                  </p>
                </RevealBlock>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                  <a
                    href="mailto:smithsharmasubedi@gmail.com"
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                      isLight
                        ? 'bg-[#60A5FA] text-[#08101E] shadow-md hover:bg-[#93C5FD]'
                        : 'bg-[#38BDF8] text-[#0B1324] shadow-md hover:bg-[#60A5FA]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Me</span>
                  </a>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                      isLight
                        ? 'bg-[#0B1324] text-[#93C5FD] hover:bg-[#60A5FA]'
                        : 'bg-[#60A5FA] text-[#08101E] hover:bg-[#93C5FD]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Lock Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
4. SKILLS LAB SECTION
      ==================================================================== */}
      <section id="skills" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              Skills &amp; Technologies
            </h2>
          </RevealBlock>

          {/* Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'MERN Stack', 'Web Development', 'Business & Creative'].map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSkillFilter(group)}
                  className={`px-4 py-2 rounded-full font-mono-tech text-xs transition-all ${
                    skillFilter === group
                      ? `${accentBg} font-semibold`
                      : `${bgCardInner} ${textMuted} border ${borderSubtle} hover:${textPrimary}`
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSkillGroups.map((group) => (
              <div
                key={group.id}
                className={`p-4 rounded-2xl border ${bgCard} transition-all group`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display text-lg sm:text-xl ${textPrimary}`}>
                      {group.title}
                    </h3>
                    <span className={`font-mono-tech text-xs ${textMuted} uppercase`}>
                      {group.status}
                    </span>
                  </div>
                  <p className={`text-sm ${textMuted} leading-relaxed`}>
                    {group.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => {
                      const { category, usage } = skillDetailsMap[skill];
                      return (
                        <div
                          key={skill}
                          className={`relative flex-1 min-w-[120px] p-3 rounded-lg border transition-all group cursor-pointer ${bgCardInner} border-[#60A5FA]/10`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setCardSpotlights((prev) => ({
                              ...prev,
                              [skill]: {
                                x: rect.left + rect.width / 2,
                                y: rect.top + rect.height / 2
                              }
                            }));
                          }}
                          onMouseLeave={() => {
                            setCardSpotlights((prev) => ({
                              ...prev,
                              [skill]: undefined
                            }));
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <span className={`block text-sm font-semibold ${textPrimary}`}>
                              {skill}
                            </span>
                            <span className={`block text-xs ${textMuted}`}>
                              {category}
                            </span>
                          </div>

                          {/* Spotlight Effect */}
                          {cardSpotlights[skill] && (
                            <div
                              className="absolute inset-0 rounded-lg pointer-events-none"
                              style={{
                                background:
                                  'radial-gradient(circle at ' +
                                  `${cardSpotlights[skill].x}px ${cardSpotlights[skill].y}px, rgba(56, 189, 248, 0.15), transparent 60%)`
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
5. FEATURED PROJECTS SECTION
      ==================================================================== */}
      <section id="projects" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              Featured Projects
            </h2>
          </RevealBlock>

          {/* Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Web', 'Systems', 'Sustainability'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setProjectFilter(filter)}
                  className={`px-4 py-2 rounded-full font-mono-tech text-xs transition-all ${
                    projectFilter === filter
                      ? `${accentBg} font-semibold`
                      : `${bgCardInner} ${textMuted} border ${borderSubtle} hover:${textPrimary}`
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className={`p-6 rounded-2xl border ${bgCard} transition-all group`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display text-lg sm:text-xl ${textPrimary}`}>
                      {project.title}
                    </h3>
                    <span className={`font-mono-tech text-xs ${textMuted} uppercase`}>
                      {project.number}
                    </span>
                  </div>
                  <p className={`text-sm ${textMuted} leading-relaxed`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-mono-tech transition-all ${
                          isLight
                            ? 'bg-[#E1F5FE] text-[#0D47A1]'
                            : 'bg-[#0B1324] text-[#38BDF8]'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveProjectModal(project)}
                      className={`px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                        isLight
                          ? 'bg-[#0B1324] text-[#93C5FD] hover:bg-[#60A5FA]'
                          : 'bg-[#60A5FA] text-[#08101E] hover:bg-[#93C5FD]'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono-tech text-[11px] uppercase tracking-wider transition-all ${
                        isLight
                          ? 'bg-[#E1F5FE] text-[#0D47A1] hover:bg-[#D1E8FF]'
                          : 'bg-[#0B1324] text-[#38BDF8] hover:bg-[#60A5FA]'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Open Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
6. YANVI SUSTAINABILITY VENTURE SECTION
      ==================================================================== */}
      <section id="yanvi" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              YANVI: Sustainable Venture
            </h2>
          </RevealBlock>

          <div className="space-y-8">
            {/* Overview */}
            <div className={`p-6 rounded-2xl border ${bgCard} transition-all`}>
              <RevealBlock delay={200}>
                <h3 className={`font-display text-xl sm:text-2xl ${textPrimary}`}>
                  Transforming Waste into Wealth
                </h3>
              </RevealBlock>
              <RevealBlock delay={300}>
                <p className={`mt-2 text-sm ${textMuted} leading-relaxed`}>
                  YANVI addresses the dual challenges of agricultural waste and plastic pollution by innovatively transforming discarded banana stems into a range of biodegradable products. Our mission is to pioneer sustainable solutions that empower local communities and protect the environment.
                </p>
              </RevealBlock>

              <div className="mt-4">
                <a
                  href="#yanvi-pipeline"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                    isLight
                      ? 'bg-[#60A5FA] text-[#08101E] shadow-md hover:bg-[#93C5FD]'
                      : 'bg-[#38BDF8] text-[#0B1324] shadow-md hover:bg-[#60A5FA]'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Explore the Circular Pipeline</span>
                </a>
              </div>
            </div>

            {/* Product Lineup */}
            <div className={`p-6 rounded-2xl border ${bgCard} transition-all`}>
              <RevealBlock delay={200}>
                <h3 className={`font-display text-xl sm:text-2xl ${textPrimary}`}>
                  Eco-Friendly Product Lineup
                </h3>
              </RevealBlock>
              <RevealBlock delay={300}>
                <p className={`mt-2 text-sm ${textMuted} leading-relaxed`}>
                  Our initial product lineup includes durable banana-fiber baskets, versatile textiles, artisanal paper, and customized corporate eco-gift products. Each item is thoughtfully designed to be both functional and sustainable, showcasing the potential of circular economy principles.
                </p>
              </RevealBlock>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {yanviProducts.map((product) => (
                  <div
                    key={product.code}
                    className={`p-4 rounded-lg border ${bgCardInner} transition-all group`}
                  >
                    <h4 className={`font-display text-md ${textPrimary}`}>
                      {product.name}
                    </h4>
                    <p className={`mt-1 text-xs ${textMuted} leading-tight`}>
                      {product.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
7. JOURNEY TIMELINE SECTION
      ==================================================================== */}
      <section id="journey" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              My Journey
            </h2>
          </RevealBlock>

          {/* Timeline Cards */}
          <div className="space-y-8">
            {visibleTimelineItems.map((item, idx) => (
              <div
                key={item.title}
                className={`p-6 rounded-2xl border ${bgCard} transition-all group`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display text-lg sm:text-xl ${textPrimary}`}>
                      {item.title}
                    </h3>
                    <span className={`font-mono-tech text-xs ${textMuted} uppercase`}>
                      {item.type}
                    </span>
                  </div>
                  <p className={`text-sm ${textMuted} leading-relaxed`}>
                    {item.details.join(' ')}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.details.map((detail, index) => (
                      <span
                        key={index}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-mono-tech transition-all ${
                          isLight
                            ? 'bg-[#E1F5FE] text-[#0D47A1]'
                            : 'bg-[#0B1324] text-[#38BDF8]'
                        }`}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
8. ROADMAP SECTION
      ==================================================================== */}
      <section id="roadmap" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              5-Phase Roadmap
            </h2>
          </RevealBlock>

          {/* Roadmap Steps */}
          <div className="space-y-8">
            {roadmapPhases.map((phase, idx) => (
              <div
                key={phase.title}
                className={`p-6 rounded-2xl border ${bgCard} transition-all group`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display text-lg sm:text-xl ${textPrimary}`}>
                      {phase.title}
                    </h3>
                    <span className={`font-mono-tech text-xs ${textMuted} uppercase`}>
                      {phase.status}
                    </span>
                  </div>
                  <p className={`text-sm ${textMuted} leading-relaxed`}>
                    {phase.description}
                  </p>

                  <ul className="list-disc list-inside space-y-1">
                    {phase.focusPoints.map((point, index) => (
                      <li key={index} className={`text-sm ${textMuted}`}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
9. CONTACT SECTION
      ==================================================================== */}
      <section id="contact" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <RevealBlock delay={100} className="mb-12">
            <h2 className={`font-display text-4xl sm:text-5xl font-bold leading-tight ${textPrimary}`}>
              Get in Touch
            </h2>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <RevealBlock delay={200}>
                <p className={`text-lg sm:text-xl ${textMuted} leading-relaxed`}>
                  I am currently open to new opportunities and collaborations. Feel free to reach out to me through any of the platforms below:
                </p>
              </RevealBlock>

              <RevealBlock delay={300}>
                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:smithsharmasubedi@gmail.com"
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      isLight
                        ? 'bg-[#E1F5FE] border-[#0D47A1] text-[#0D47A1]'
                        : 'bg-[#0B1324] border-[#38BDF8] text-[#38BDF8]'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-mono-tech text-sm">smithsharmasubedi@gmail.com</span>
                  </a>

                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                          isLight
                            ? 'bg-[#E1F5FE] text-[#0D47A1] hover:bg-[#D1E8FF]'
                            : 'bg-[#0B1324] text-[#38BDF8] hover:bg-[#60A5FA]'
                        }`}
                      >
                        {React.createElement(link.icon, { className: 'w-4 h-4' })}
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-[#0B1324] bg-opacity-90 p-6 rounded-2xl border border-[#213559] shadow-md">
              <RevealBlock delay={200}>
                <h3 className={`text-xl sm:text-2xl font-display ${textPrimary}`}>
                  Send Me a Message
                </h3>
              </RevealBlock>

              <RevealBlock delay={300}>
                <form onSubmit={handleMailtoSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="senderName"
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Your Name"
                      className={`p-3 rounded-lg border transition-all focus:ring-2 focus:ring-[#38BDF8] focus:outline-none ${
                        isLight
                          ? 'bg-white text-[#0D47A1] border-[#D5E0EE]'
                          : 'bg-[#0B1324] text-[#F8FAFC] border-[#213559]'
                      }`}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      className={`p-3 rounded-lg border transition-all focus:ring-2 focus:ring-[#38BDF8] focus:outline-none ${
                        isLight
                          ? 'bg-white text-[#0D47A1] border-[#D5E0EE]'
                          : 'bg-[#0B1324] text-[#F8FAFC] border-[#213559]'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Subject"
                      className={`p-3 rounded-lg border transition-all focus:ring-2 focus:ring-[#38BDF8] focus:outline-none ${
                        isLight
                          ? 'bg-white text-[#0D47A1] border-[#D5E0EE]'
                          : 'bg-[#0B1324] text-[#F8FAFC] border-[#213559]'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="body"
                      value={contactForm.body}
                      onChange={(e) => setContactForm({ ...contactForm, body: e.target.value })}
                      placeholder="Your Message"
                      rows="4"
                      className={`p-3 rounded-lg border transition-all focus:ring-2 focus:ring-[#38BDF8] focus:outline-none ${
                        isLight
                          ? 'bg-white text-[#0D47A1] border-[#D5E0EE]'
                          : 'bg-[#0B1324] text-[#F8FAFC] border-[#213559]'
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full px-4 py-2 rounded-full font-mono-tech text-xs uppercase tracking-wider transition-all ${
                      isLight
                        ? 'bg-[#60A5FA] text-[#08101E] shadow-md hover:bg-[#93C5FD]'
                        : 'bg-[#38BDF8] text-[#0B1324] shadow-md hover:bg-[#60A5FA]'
                    }`}
                  >
                    Send Message
                  </button>
                </form>
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Copyright Notice */}
      <footer className={`py-8 ${bgCard} border-t ${borderSubtle}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <p className={`text-xs ${textMuted}`}>
            &copy; 2023 Smith Sharma. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
