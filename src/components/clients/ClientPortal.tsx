import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ShootApi = {
  id: number|string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  client?: { id: number|string; name?: string };
  files?: Array<{
    id: number|string;
    filename?: string;
    stored_filename?: string;
    path?: string;
    dropbox_path?: string;
    file_type?: string;
    workflow_stage?: string;
  }>;
  scheduled_date?: string;
};

type PortfolioItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: "luxury" | "commercial" | "residential" | "drone";
  photos?: number | string;
  badge?: string;
};

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "portfolio", label: "Portfolio" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const FEATURED: Array<Omit<PortfolioItem, "photos" | "badge" | "category" | "id"> & { location: string }> = [
  {
    title: "Modern Luxury Estate",
    subtitle: "Beverly Hills, CA",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop&auto=format&q=80",
    location: "Beverly Hills, CA",
  },
  {
    title: "Downtown Office Complex",
    subtitle: "Los Angeles, CA",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&auto=format&q=80",
    location: "Los Angeles, CA",
  },
  {
    title: "Contemporary Family Home",
    subtitle: "Santa Monica, CA",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format&q=80",
    location: "Santa Monica, CA",
  },
  {
    title: "Waterfront Estate",
    subtitle: "Malibu, CA",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format&q=80",
    location: "Malibu, CA",
  },
  {
    title: "Charming Suburban Home",
    subtitle: "Pasadena, CA",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format&q=80",
    location: "Pasadena, CA",
  },
  {
    title: "Sky-High Penthouse",
    subtitle: "West Hollywood, CA",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format&q=80",
    location: "West Hollywood, CA",
  },
];

const PORTFOLIO: PortfolioItem[] = [
  {
    id: "lux-1",
    title: "Modern Luxury Estate",
    subtitle: "Beverly Hills, CA • $8.5M",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&auto=format&q=80",
    category: "luxury",
    photos: 25,
    badge: "Luxury",
  },
  {
    id: "com-1",
    title: "Downtown Office Complex",
    subtitle: "Los Angeles, CA • Commercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&auto=format&q=80",
    category: "commercial",
    photos: 40,
    badge: "Commercial",
  },
  {
    id: "res-1",
    title: "Contemporary Family Home",
    subtitle: "Santa Monica, CA • $2.1M",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format&q=80",
    category: "residential",
    photos: 18,
    badge: "Residential",
  },
  {
    id: "drn-1",
    title: "Waterfront Estate",
    subtitle: "Malibu, CA • $12.8M",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&auto=format&q=80",
    category: "drone",
    photos: "Aerial Views",
    badge: "Drone",
  },
  {
    id: "res-2",
    title: "Charming Suburban Home",
    subtitle: "Pasadena, CA • $1.2M",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop&auto=format&q=80",
    category: "residential",
    photos: 15,
    badge: "Residential",
  },
  {
    id: "lux-2",
    title: "Sky-High Penthouse",
    subtitle: "West Hollywood, CA • $15.2M",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&auto=format&q=80",
    category: "luxury",
    photos: 30,
    badge: "Luxury",
  },
];

function buildFileUrl(u?: string | null): string | null {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const clean = u.replace(/^\/+/, '');
  const rel = clean.startsWith('storage/') ? clean : `storage/${clean}`;
  return `${base}/${rel}`;
}

const yearNow = new Date().getFullYear();

export function ClientPortal() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<"all" | PortfolioItem["category"]>("all");
  const [clientName, setClientName] = useState<string>("");
  const [clientInfo, setClientInfo] = useState<{ email?: string; company_name?: string; avatar?: string } | null>(null);
  const [dynamicPortfolio, setDynamicPortfolio] = useState<PortfolioItem[] | null>(null);

  // Load client shoots as dynamic portfolio (public shareable link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('clientId');
    if (!clientId) return;

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/clients/${clientId}/profile`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const data = await res.json();
        const c = data.client || {};
        if (c.name) setClientName(c.name);
        setClientInfo({ email: c.email, company_name: c.company_name, avatar: c.avatar });
        const items: PortfolioItem[] = (data.shoots || []).map((s: any, i: number) => ({
          id: String(s.id),
          title: s.address || 'Property',
          subtitle: [s.city, s.state].filter(Boolean).join(', '),
          image: s.preview_image || PORTFOLIO[i % PORTFOLIO.length].image,
          category: 'residential',
          photos: s.files_count || undefined,
          badge: 'Project',
        }));
        if (items.length) setDynamicPortfolio(items);
      } catch {}
    })();
  }, []);

  // Refs for sections (for smooth scroll)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const target = sectionRefs.current[id] || document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredPortfolio = useMemo(() => {
    const base = dynamicPortfolio || PORTFOLIO;
    if (filter === "all") return base;
    return base.filter((it) => it.category === filter);
  }, [filter, dynamicPortfolio]);

  return (
    <>
      {/* Local styles ported from your <style> block */}
      <style>{`
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        .card-shadow { box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06); }
        .portfolio-image { transition: transform 0.3s ease; }
        .portfolio-image:hover { transform: scale(1.02); }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        @keyframes fade-in { 0%{opacity:0; transform: translateY(20px);} 100%{opacity:1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .pill-button { background:#f1f5f9; border:1px solid #e2e8f0; transition: all 0.2s ease; }
        .pill-button:hover { background:#e2e8f0; border-color:#cbd5e1; }
        .pill-button.active { background:#3b82f6; color:white; border-color:#3b82f6; }
        @keyframes scroll { 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }
        .animate-scroll { animation: scroll 30s linear infinite; }
        .carousel-container { overflow: hidden; }
        .carousel-track:hover .animate-scroll { animation-play-state: paused; }
      `}</style>

      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full border-b border-gray-200 z-50 ${scrolled ? "bg-white" : "bg-white/90"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-camera text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">{clientName || 'Client'}</span>
            </div>
            <div className="hidden md:flex space-x-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="md:hidden">
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="text-gray-600 hover:text-primary"
              >
                <i className="fas fa-bars text-lg" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" ref={setSectionRef("home")} className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-primary mb-6">
              <i className="fas fa-camera mr-2" />
              Professional Real Estate Photography
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2">
              <span className="text-primary">{clientName || 'Client'}</span>
            </h1>
            {clientInfo && (
              <div className="text-gray-600 mb-6">
                {clientInfo.company_name && (
                  <div className="text-base">{clientInfo.company_name}</div>
                )}
                {clientInfo.email && (
                  <div className="text-sm">{clientInfo.email}</div>
                )}
              </div>
            )}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Capturing architectural beauty and creating stunning visual narratives that sell properties faster
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className="text-gray-700 font-medium">500+ Properties Shot</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className="text-gray-700 font-medium">8+ Years Experience</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className="text-gray-700 font-medium">24hr Delivery</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => scrollToSection("portfolio")}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center"
              >
                <i className="fas fa-images mr-2" />
                View Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center"
              >
                <i className="fas fa-calendar mr-2" />
                Book a Shoot
              </button>
            </div>

            {/* Featured Carousel */}
            <div className="relative overflow-hidden">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Featured Work</h2>
                <p className="text-gray-600">A glimpse of our recent photography projects</p>
              </div>

              <div className="carousel-container relative">
                <div className="carousel-track flex">
                  {/* Two sets for seamless loop */}
                  {[...FEATURED, ...FEATURED].map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="flex-shrink-0 mr-6 animate-scroll">
                      <div className="bg-white rounded-xl overflow-hidden card-shadow hover-lift">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-80 h-60 object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient edges */}
              <div className="pointer-events-none absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" ref={setSectionRef("portfolio")} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-images text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Portfolio Overview</h2>
              </div>

              {/* (Optional) Filter control — uncomment if you want visible filter */}
              {/* <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Filter by:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
                >
                  <option value="all">All Projects</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="luxury">Luxury</option>
                  <option value="drone">Drone</option>
                </select>
              </div> */}
            </div>
            <p className="text-gray-600 max-w-2xl">
              A showcase of recent projects and completed shoots across various property types
            </p>
          </div>

          <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className={`portfolio-item ${item.category}`} data-category={item.category}>
                <div className="bg-white rounded-2xl overflow-hidden card-shadow hover-lift">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover portfolio-image"
                      loading="lazy"
                    />
                    {item.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.subtitle}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {typeof item.photos === "number" ? `${item.photos} Photos` : item.photos}
                      </span>
                      {/* <span className="text-primary font-medium">3D Tour Available</span> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200">
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={setSectionRef("services")} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Services</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive photography and videography services tailored for real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-home",
                title: "Residential Photography",
                bullets: [
                  "Interior & Exterior Shots",
                  "HDR Photography",
                  "Twilight Photography",
                  "Detail & Lifestyle Shots",
                ],
              },
              {
                icon: "fa-building",
                title: "Commercial Properties",
                bullets: ["Office Buildings", "Retail Spaces", "Industrial Properties", "Architectural Photography"],
              },
              {
                icon: "fa-crown",
                title: "Luxury Estates",
                bullets: ["High-End Residential", "Luxury Amenities", "Lifestyle Photography", "Premium Editing"],
              },
              {
                icon: "fa-helicopter",
                title: "Drone Photography",
                bullets: ["Aerial Property Views", "Neighborhood Context", "4K Video Footage", "FAA Certified Pilot"],
              },
              {
                icon: "fa-vr-cardboard",
                title: "3D Virtual Tours",
                bullets: ["Matterport Technology", "Interactive Floor Plans", "Virtual Reality Ready", "Dollhouse View"],
              },
              {
                icon: "fa-video",
                title: "Video Production",
                bullets: ["Property Walk-throughs", "Cinematic Tours", "Agent Testimonials", "Social Media Content"],
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-xl hover-lift">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${card.icon} text-2xl text-white`} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{card.title}</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex items-center">
                      <i className="fas fa-check text-gold mr-3" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section id="equipment" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-tools text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Professional Equipment</h2>
            </div>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              State-of-the-art photography and videography equipment for exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                iconWrap: "from-blue-500 to-blue-600",
                icon: "fa-camera",
                title: "Cameras",
                rows: [
                  ["Canon EOS R5", "45MP"],
                  ["Sony A7R IV", "61MP"],
                  ["Nikon D850", "45MP"],
                  ["DJI Mavic 3 Pro", "4K"],
                ],
                hover: "group-hover:bg-blue-50",
              },
              {
                iconWrap: "from-purple-500 to-purple-600",
                icon: "fa-eye",
                title: "Lenses",
                rows: [
                  ["Canon 16-35mm", "f/2.8L"],
                  ["Sigma 14-24mm", "f/2.8"],
                  ["Canon 24-70mm", "f/2.8L"],
                  ["Tilt-Shift", "Special"],
                ],
                hover: "group-hover:bg-purple-50",
              },
              {
                iconWrap: "from-yellow-500 to-orange-500",
                icon: "fa-lightbulb",
                title: "Lighting",
                rows: [
                  ["Profoto B10X Plus", "250W"],
                  ["Godox AD600 Pro", "600W"],
                  ["LED Light Panels", "RGB"],
                  ["Reflectors", "5-in-1"],
                ],
                hover: "group-hover:bg-yellow-50",
              },
              {
                iconWrap: "from-green-500 to-green-600",
                icon: "fa-desktop",
                title: "Software",
                rows: [
                  ["Adobe Lightroom", "CC"],
                  ["Adobe Photoshop", "CC"],
                  ["Final Cut Pro", "Pro"],
                  ["Matterport", "3D"],
                ],
                hover: "group-hover:bg-green-50",
              },
            ].map((card, idx) => (
              <div key={idx} className="group">
                <div className="bg-white rounded-2xl p-6 card-shadow hover-lift transition-all duration-300 group-hover:shadow-xl">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.iconWrap} rounded-xl flex items-center justify-center mr-4`}>
                      <i className={`fas ${card.icon} text-white text-lg`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {card.rows.map(([name, tag], i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${card.hover} transition-colors duration-200`}
                      >
                        <span className="text-sm font-medium text-gray-700">{name}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={setSectionRef("about")} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-user text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">About Me</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate photographer dedicated to capturing the essence of properties through innovative visual storytelling
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left column */}
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face&auto=format&q=80"
                  alt="Alex Carter"
                  className="w-full h-80 object-cover rounded-2xl border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold">8+ Years</div>
                    <div className="text-xs opacity-90">Experience</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "fa-home", num: "500+", label: "Properties Shot" },
                  { icon: "fa-star", num: "98%", label: "Client Satisfaction" },
                  { icon: "fa-clock", num: "24h", label: "Turnaround Time" },
                  { icon: "fa-building", num: "25+", label: "Top Agencies" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 card-shadow hover-lift text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <i className={`fas ${s.icon} text-primary`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{s.num}</div>
                    <div className="text-sm text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Journey */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <i className="fas fa-award text-primary mr-3" />
                  Professional Journey
                </h4>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
                  <div className="space-y-6">
                    {[
                      { icon: "fa-camera", title: "Started Photography Career", year: "2016", note: "Real estate specialization" },
                      { icon: "fa-helicopter", title: "FAA Drone Certification", year: "2018", note: "Part 107 Certified Pilot" },
                      { icon: "fa-vr-cardboard", title: "3D Virtual Tours", year: "2020", note: "Matterport technology" },
                      { icon: "fa-trophy", title: "500+ Properties", year: "2024", note: "Milestone achievement" },
                      { icon: "fa-rocket", title: "AR/VR Property Showcases", year: "2025", note: "Future expansion" },
                    ].map((t, i) => (
                      <div key={i} className="flex items-start relative">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 relative z-10">
                          <i className={`fas ${t.icon} text-white text-xs`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h5 className="font-semibold text-gray-900 text-sm">{t.title}</h5>
                            <span className="ml-2 text-xs text-primary font-medium">{t.year}</span>
                          </div>
                          <p className="text-xs text-gray-600">{t.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Helping Real Estate Agencies Sell Faster Through Stunning Visuals
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    With 8+ years of experience in real estate photography, I help agencies and homeowners showcase
                    properties through cinematic visuals, drone perspectives, and 3D tours that make listings stand out
                    and sell faster.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-primary">
                    <p className="text-gray-700 mb-2">
                      <strong>What I deliver:</strong>
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• High-impact photography that captures property essence</li>
                      <li>• FAA-certified drone aerial perspectives</li>
                      <li>• Interactive 3D virtual tours with Matterport technology</li>
                      <li>• 24-hour turnaround for urgent listings</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 italic">
                    Outside of photography, I love exploring architecture and design trends, which inspire my shoots and
                    help me understand what makes properties truly shine.
                  </p>
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <i className="fas fa-address-card text-primary mr-3" />
                  Contact Information
                </h4>
                <div className="space-y-4">
                  {[
                    { icon: "fa-map-marker-alt", label: "Location", value: "Downtown Los Angeles, CA" },
                    { icon: "fa-phone", label: "Phone", value: "(555) 123-4567" },
                    { icon: "fa-envelope", label: "Email", value: "alex@realestatephotos.com" },
                    { icon: "fa-globe", label: "Website", value: "www.alexcarterphotography.com" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center p-3 bg-white rounded-lg hover-lift">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <i className={`fas ${c.icon} text-primary`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{c.label}</div>
                        <div className="text-xs text-gray-600">{c.value}</div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-3">Follow My Work</div>
                    <div className="flex space-x-3">
                      {["instagram", "linkedin", "behance", "facebook"].map((n) => (
                        <a
                          key={n}
                          href="#"
                          className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200"
                          aria-label={n}
                        >
                          <i className={`fab fa-${n} text-primary`} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Experience & Achievements</h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              ["500+", "Properties Photographed"],
              ["8", "Years Experience"],
              ["150+", "Real Estate Agents"],
              ["98%", "Client Satisfaction"],
            ].map(([num, label], i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{num}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-accent rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-primary text-center mb-8">Certifications & Recognition</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                ["fa-certificate", "FAA Part 107 Certified", "Licensed Drone Pilot"],
                ["fa-award", "Matterport Certified", "3D Virtual Tour Specialist"],
                ["fa-trophy", "PFRE Certified", "Professional Real Estate Photography"],
              ].map(([icon, title, sub], i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <i className={`fas ${icon} text-3xl text-gold mb-4`} />
                  <h4 className="font-semibold text-primary mb-2">{title}</h4>
                  <p className="text-sm text-gray-600">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        ref={setSectionRef("contact")}
        className="py-20 bg-gradient-to-br from-primary to-secondary text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Book Your Shoot</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to showcase your property with stunning photography? Let's discuss your project
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
              <div className="space-y-6 mb-8">
                {[
                  ["fa-phone", "Phone", "(555) 123-4567"],
                  ["fa-envelope", "Email", "alex@realestatephotos.com"],
                  ["fa-map-marker-alt", "Location", "Downtown Los Angeles, CA"],
                  ["fa-clock", "Response Time", "Within 2 hours"],
                ].map(([icon, label, val], i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4">
                      <i className={`fas ${icon} text-primary`} />
                    </div>
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-gray-300">{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4">Booking Process</h4>
                {["Initial consultation & quote", "Schedule photo shoot", "Professional photography session", "Delivery within 24 hours"].map(
                  (step, i) => (
                    <div key={i} className="flex items-center mb-3 last:mb-0">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-3 text-primary font-bold text-sm">
                        {i + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Contact Form (non-functional demo) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! We'll get back to you shortly.");
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Property Type</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-gold">
                    <option value="">Select Property Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="luxury">Luxury Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Services Needed</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {["Photography", "Drone Photography", "3D Virtual Tour", "Video Production"].map((label, i) => (
                      <label key={i} className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded text-gold focus:ring-gold" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-yellow-600 text-primary font-bold py-4 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Send Message & Get Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-camera text-2xl text-gold mr-3" />
                <span className="text-2xl font-bold">Alex Carter</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional real estate photography services in Los Angeles and surrounding areas.
              </p>
              <div className="flex space-x-4">
                {["instagram", "facebook", "linkedin"].map((n) => (
                  <a key={n} href="#" className="text-gray-400 hover:text-gold transition duration-300" aria-label={n}>
                    <i className={`fab fa-${n} text-xl`} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                {["Residential Photography", "Commercial Photography", "Drone Photography", "3D Virtual Tours"].map(
                  (label, i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-gold transition duration-300">
                        {label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {[
                  { id: "about", label: "About" },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "contact", label: "Contact" },
                ].map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => scrollToSection(l.id)}
                      className="hover:text-gold transition duration-300"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                {/* <li><a href="#" className="hover:text-gold transition duration-300">Pricing</a></li> */}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2 text-gold" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-gold" />
                  alex@realestatephotos.com
                </li>
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-gold" />
                  Los Angeles, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {yearNow} Alex Carter Photography. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ClientPortal;
