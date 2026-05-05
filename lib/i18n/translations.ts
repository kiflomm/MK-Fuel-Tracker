export type Language = "en" | "ti";

export const translations = {
  en: {
    // ── Marketing Header ──────────────────────────────────────────────────────
    nav_home: "Home",
    nav_services: "Services",
    nav_authorities: "Authorities",
    nav_login: "Login",
    brand_name: "Mekelle Fuel Tracker",

    // ── Marketing Footer ──────────────────────────────────────────────────────
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_support: "Contact Support",
    footer_copyright: "© 2026 GC Software Engineering. Mekelle Fuel Tracker",

    // ── Landing Page — Hero ───────────────────────────────────────────────────
    hero_eyebrow: "Regional Energy Oversight",
    hero_title_line1: "Modernizing Fuel",
    hero_title_line2: "Distribution for",
    hero_city: "Mekelle",
    hero_subtitle:
      "An authoritative digital framework ensuring equitable, transparent, and efficient energy resource management for the Tigray regional administration.",
    hero_cta_login: "Official Login",
    hero_cta_docs: "Documentation",
    hero_recover: "Recover Account",

    // ── Landing Page — Live Metrics Card ──────────────────────────────────────
    live_metrics: "Live Metrics",
    network_status: "Network Status",
    stations_online: "Stations Online",
    liters_distributed: "Liters Distributed",
    active_vehicles: "Active Vehicles",

    // ── Landing Page — Services Section ───────────────────────────────────────
    services_title: "Strategic Operational Verticals",
    services_subtitle:
      "Three integrated pillars designed to streamline regional energy logistics through uncompromising technology.",
    pillar1_title: "Command Center",
    pillar1_desc:
      "Centralized authority and control with real-time, data-driven oversight of regional reserves and strategic distribution channels.",
    pillar1_item1: "Reserve Analytics",
    pillar1_item2: "Crisis Management",
    pillar1_item3: "Quota Definition",
    pillar2_title: "Fuel Stations",
    pillar2_desc:
      "Optimization of retail logistics through advanced queue management and irrefutable quota verification systems.",
    pillar2_item1: "Queue Optimization",
    pillar2_item2: "Stock Verification",
    pillar2_item3: "Worker Management",
    pillar3_title: "Citizens",
    pillar3_desc:
      "Empowering the public with live availability mapping and transparent personal quota tracking for essential needs.",
    pillar3_item1: "Live Map Access",
    pillar3_item2: "Smart Quotas",
    pillar3_item3: "Transaction History",

    // ── Landing Page — Authorities Section ────────────────────────────────────
    authorities_label: "Authorized Governing Partners",
    auth1: "Regional Bureau of Energy",
    auth2: "Transport Authority",
    auth3: "Regional Security Bureau",
    auth4: "Mekelle City Admin",

    // ── App / Dashboard Layout ────────────────────────────────────────────────
    app_nav_dashboard: "Dashboard",
    app_footer_copy: "© 2026 GC Software Engineering • Mekelle Fuel Tracker",

    // ── Admin Sidebar ─────────────────────────────────────────────────────────
    admin_panel_title: "Admin Control",
    admin_panel_subtitle: "System Administration Panel",
    admin_mobile_menu: "Admin Menu",
    admin_nav_dashboard: "Dashboard",
    admin_nav_dashboard_desc: "Overview & stats",
    admin_nav_stations: "Stations",
    admin_nav_stations_desc: "Manage fuel stations",
    admin_nav_users: "Users",
    admin_nav_users_desc: "Managers & owners",
    admin_nav_vehicle_categories: "Vehicle Categories",
    admin_nav_vehicle_categories_desc: "Dynamic category list",
    admin_nav_fuel_types: "Fuel Types",
    admin_nav_fuel_types_desc: "Manage fuel options & pricing",
    admin_nav_reports: "Reports",
    admin_nav_reports_desc: "Analytics & exports",
    admin_nav_audit_logs: "Audit Logs",
    admin_nav_audit_logs_desc: "System activity trail",

    // ── Admin Dashboard Page ──────────────────────────────────────────────────
    admin_page_eyebrow: "System Command Center",
    admin_page_title: "Admin Overview",
    admin_page_welcome: "Welcome back,",
    admin_page_division: "Tigray Regional Energy Oversight Division",
    admin_status_operational: "System Operational",
    admin_status_monitored: "All Stations Monitored",
    admin_modules_label: "Control Modules",
    admin_section1_title: "Platform Management",
    admin_section1_subtitle: "Stations & Users",
    admin_section1_desc:
      "Add and manage fuel stations, assign station managers, and oversee the distribution network.",
    admin_section1_badge: "Network",
    admin_section2_title: "Pricing & Rules",
    admin_section2_subtitle: "Economics",
    admin_section2_desc:
      "Configure global fuel pricing per liter and review operational controls.",
    admin_section2_badge: "Controls",
    admin_section3_title: "Analytics",
    admin_section3_subtitle: "Reports",
    admin_section3_desc:
      "View daily distribution totals, system-wide performance metrics, and exportable operational reports.",
    admin_section3_badge: "Insights",
    admin_open_module: "Open module",
    admin_quick_access: "Quick Access",
    admin_quick_vehicles: "Vehicles & Quotas",
    admin_quick_users: "Users",
    admin_quick_stations: "Stations",

    // ── Station Manager Sidebar ───────────────────────────────────────────────
    sm_panel_title: "Station Control",
    sm_panel_subtitle: "Station Manager Panel",
    sm_mobile_menu: "Station Menu",
    sm_nav_dashboard: "Dashboard",
    sm_nav_dashboard_desc: "Overview & stats",
    sm_nav_queue: "Queue",
    sm_nav_queue_desc: "Manage fuel queue",
    sm_nav_workers: "Workers",
    sm_nav_workers_desc: "Manage station staff",
    sm_nav_reports: "Reports",
    sm_nav_reports_desc: "Analytics & exports",
  },

  ti: {
    // ── Marketing Header ──────────────────────────────────────────────────────
    nav_home: "መኸር",
    nav_services: "አገልግሎታት",
    nav_authorities: "ስልጣናት",
    nav_login: "እቶ",
    brand_name: "ናይ ምኽዳ ነዳዲ ምክትታሊ",

    // ── Marketing Footer ──────────────────────────────────────────────────────
    footer_privacy: "ፖሊሲ ምስጢርነት",
    footer_terms: "ውዕሊ አጠቃቀም",
    footer_support: "ርክብ ሓገዝ",
    footer_copyright: "© 2026 GC Software Engineering. ናይ ምኽዳ ነዳዲ ምክትታሊ",

    // ── Landing Page — Hero ───────────────────────────────────────────────────
    hero_eyebrow: "ናይ ዞባ ከርሰ-ምድሪ ቁጽጽር",
    hero_title_line1: "ምዕባለ ምክፋል",
    hero_title_line2: "ነዳዲ ንዉሽጢ",
    hero_city: "ምኽዳ",
    hero_subtitle:
      "ፍትሓዊ፣ ግልጽን ዝተዋደደን ምሕደራ ናይ ትግራይ ዞባ ምምሕዳር ናይ ኃይሊ ሃብቲ ዝርዳእ ዲጂታላዊ ሕጋዊ ቅርጺ።",
    hero_cta_login: "ወግዓዊ ምእታው",
    hero_cta_docs: "ሰነዳት",
    hero_recover: "ሕሳብ ምምላስ",

    // ── Landing Page — Live Metrics Card ──────────────────────────────────────
    live_metrics: "ቀጥታ መለክዒ",
    network_status: "ናይ ኔትዎርክ ኩነታት",
    stations_online: "ተነሳሒ መደብዓት",
    liters_distributed: "ዝተዓደለ ሊትሮ",
    active_vehicles: "ንጡፍ ተሽከርካሪ",

    // ── Landing Page — Services Section ───────────────────────────────────────
    services_title: "ስትራተጂካዊ ስራሕ መደበራት",
    services_subtitle:
      "ሰለስተ ዝተወሃሃዱ ማእከላት ናይ ዞባ ናይ ኃይሊ ሎጂስቲክስ ብዘይ ምህዝታዊ ቴክኖሎጅን ቀሊሉ ዝገብሩ።",
    pillar1_title: "ናይ ምዝዝ ማእከል",
    pillar1_desc:
      "ናይ ዞባ ክምችታት ምትሕዝቶ ዘርዕስ ቅጽበታዊ ሓሳባት ዝቐርብ ማዕከላዊ ስልጣን ቁጽጽርን።",
    pillar1_item1: "ናይ ክምችታ ትንታነ",
    pillar1_item2: "ናይ ቅልውላው ምሕደራ",
    pillar1_item3: "ናይ ሳዕቤን ፍቓድ",
    pillar2_title: "ናይ ነዳዲ ጣቢያ",
    pillar2_desc:
      "ብዕቱብ ምሕደራ ሰልፊ ተዓጋሲ ናይ ሳዕቤን ምርግጋጽ ስርዓት ናይ ቸርቸሮ ሎጂስቲክስ ምምሕያሽ።",
    pillar2_item1: "ምምሕያሽ ሰልፊ",
    pillar2_item2: "ምርግጋጽ ዕቃ",
    pillar2_item3: "ምሕደራ ሰራሕተኛ",
    pillar3_title: "ዜጋታት",
    pillar3_desc:
      "ህዝቢ ናይ ቀጥታ ዝርዝር ሃለዋት ዘርኢ ካርታን ንሃለዋቱ ዘርኢ ናይ ብሕቲ ሳዕቤን ምክትታልን ሓይሊ ይህቦ።",
    pillar3_item1: "ናይ ቀጥታ ካርታ ምርኣይ",
    pillar3_item2: "ዕሙቕ ሳዕቤን",
    pillar3_item3: "ናይ ዕድጊ ታሪኽ",

    // ── Landing Page — Authorities Section ────────────────────────────────────
    authorities_label: "ፍቒደ ናይ ምሉእ ዋኒን ኣካላት",
    auth1: "ናይ ዞባ ቤት ጽሕፈት ኃይሊ",
    auth2: "ናይ መጓዓዝያ ስልጣን",
    auth3: "ናይ ዞባ ድሕነት ቤት ጽሕፈት",
    auth4: " админ ምኽዳ ከተማ",

    // ── App / Dashboard Layout ────────────────────────────────────────────────
    app_nav_dashboard: "ዳሽቦርድ",
    app_footer_copy: "© 2026 GC Software Engineering • ናይ ምኽዳ ነዳዲ ምክትታሊ",

    // ── Admin Sidebar ─────────────────────────────────────────────────────────
    admin_panel_title: "ናይ ምምሕዳር ቁጽጽር",
    admin_panel_subtitle: "ናይ ስርዓት ምምሕዳር ፓነል",
    admin_mobile_menu: "ናይ ምምሕዳር ምናሌ",
    admin_nav_dashboard: "ዳሽቦርድ",
    admin_nav_dashboard_desc: "ጠቕላላ ዕዮ & ሓበሬታ",
    admin_nav_stations: "ጣቢያታት",
    admin_nav_stations_desc: "ናይ ነዳዲ ጣቢያታት ምምሕዳር",
    admin_nav_users: "ተጠቀምቲ",
    admin_nav_users_desc: "ዋናታትን ሓለቅቲን",
    admin_nav_vehicle_categories: "ናይ ተሽከርካሪ ዓይነታት",
    admin_nav_vehicle_categories_desc: "ናይ ዓይነት ዝርዝር",
    admin_nav_fuel_types: "ናይ ነዳዲ ዓይነታት",
    admin_nav_fuel_types_desc: "ናይ ነዳዲ አማራጺታትን ዋጋን ምምሕዳር",
    admin_nav_reports: "ጸብጻባት",
    admin_nav_reports_desc: "ትንታነን ምቕናዕን",
    admin_nav_audit_logs: "ናይ ኦዲት መዝገብ",
    admin_nav_audit_logs_desc: "ናይ ስርዓት ንጥፈት ታሪኽ",

    // ── Admin Dashboard Page ──────────────────────────────────────────────────
    admin_page_eyebrow: "ናይ ስርዓት ምዝዝ ማእከል",
    admin_page_title: "ናይ ምምሕዳር ሙሉእ ርኡይ",
    admin_page_welcome: "እንቋዕ ደሓን ተመለስካ፣",
    admin_page_division: "ናይ ትግራይ ዞባ ናይ ኃይሊ ቁጽጽር ክፍሊ",
    admin_status_operational: "ስርዓት ስራሕ ላዕሊ",
    admin_status_monitored: "ኩሎም ጣቢያታት ክትትል ይግበረሎም",
    admin_modules_label: "ናይ ቁጽጽር ሞዱላት",
    admin_section1_title: "ናይ ፕላትፎርም ምምሕዳር",
    admin_section1_subtitle: "ጣቢያታት & ተጠቀምቲ",
    admin_section1_desc:
      "ናይ ነዳዲ ጣቢያታት ምምሕዳርን ምውሳኽን፣ ናይ ጣቢያ ዋናታት ምምዳብን ናይ ምዕቃብ ኔትዎርክ ቁጽጽርን።",
    admin_section1_badge: "ኔትዎርክ",
    admin_section2_title: "ዋጋ & ሕግታት",
    admin_section2_subtitle: "ቁጠባ",
    admin_section2_desc:
      "ናይ ዓለም ናይ ነዳዲ ዋጋ ነፍሲ-ወከፍ ሊትሮ ምቕናዕን ናይ ስራሕ ቁጽጽር ምርግጋጽን።",
    admin_section2_badge: "ቁጽጽር",
    admin_section3_title: "ትንታነ",
    admin_section3_subtitle: "ጸብጻባት",
    admin_section3_desc:
      "ናይ ዕለት ምምቅቃል ጠቕላላ፣ ናይ ስርዓት-ሓፈሻ ናይ ዝሰርሐ ዑዱፍ ስራሕን ምቕናዕ ዝካኣሉ ወፍሪ ጸብጻባትን ርእይ።",
    admin_section3_badge: "ርኡይ",
    admin_open_module: "ሞዱል ክፈት",
    admin_quick_access: "ቅልጡፍ ምርኣይ",
    admin_quick_vehicles: "ተሽከርካሪ & ሳዕቤን",
    admin_quick_users: "ተጠቀምቲ",
    admin_quick_stations: "ጣቢያታት",

    // ── Station Manager Sidebar ───────────────────────────────────────────────
    sm_panel_title: "ናይ ጣቢያ ቁጽጽር",
    sm_panel_subtitle: "ናይ ጣቢያ ዋና ፓነል",
    sm_mobile_menu: "ናይ ጣቢያ ምናሌ",
    sm_nav_dashboard: "ዳሽቦርድ",
    sm_nav_dashboard_desc: "ጠቕላላ ዕዮ & ሓበሬታ",
    sm_nav_queue: "ሰልፊ",
    sm_nav_queue_desc: "ናይ ነዳዲ ሰልፊ ምምሕዳር",
    sm_nav_workers: "ሰራሕተኛ",
    sm_nav_workers_desc: "ናይ ጣቢያ ሰራሕተኛ ምምሕዳር",
    sm_nav_reports: "ጸብጻባት",
    sm_nav_reports_desc: "ትንታነን ምቕናዕን",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
