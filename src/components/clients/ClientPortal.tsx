import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// replace your current lucide-react import with this
import {
  Camera,
  Image,
  Menu,
  Phone,
  Mail,
  MapPin,
  Home,
  Building,
  Clock,
  CheckCircle,
  Award,
  Globe,
  Feather,
  Calendar,
  Star,
} from "lucide-react";


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

const FEATURED: Array<
  Omit<PortfolioItem, "photos" | "badge" | "category" | "id"> & { location: string }
> = [
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

const yearNow = new Date().getFullYear();

export function ClientPortal() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<"all" | PortfolioItem["category"]>("all");

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
    if (filter === "all") return PORTFOLIO;
    return PORTFOLIO.filter((it) => it.category === filter);
  }, [filter]);

  return (
    <>
      {/* Local styles (minimal) */}
      <style>{`
        .hover-lift { transition: all 0.28s cubic-bezier(.2,.9,.2,1); }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(2,6,23,0.12), 0 6px 12px rgba(2,6,23,0.06); }
        .card-shadow { box-shadow: 0 1px 2px rgba(2,6,23,0.06); }
        .portfolio-image { transition: transform 0.32s ease; }
        .portfolio-image:hover { transform: scale(1.03); }
        @keyframes fade-in { 0%{opacity:0; transform: translateY(18px);} 100%{opacity:1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.56s ease-out; }
        .animate-scroll { animation: scroll 30s linear infinite; }
        @keyframes scroll { 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }
      `}</style>

      {/* NAV */}
      <nav
        className={`fixed top-0 w-full z-50 border-b transition-colors ${
          scrolled
            ? "bg-white/95 border-gray-200 dark:bg-slate-900/95 dark:border-slate-800"
            : "bg-white/90 border-transparent dark:bg-slate-900/90"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 text-white">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-slate-100">Alex Carter</span>
            </div>

            <div className="hidden md:flex space-x-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="md:hidden">
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="text-gray-600 dark:text-slate-300 hover:text-primary"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
            <div className="px-4 py-2 space-y-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition duration-200"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" ref={setSectionRef("home")} className="min-h-screen bg-white dark:bg-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-primary dark:bg-slate-700/40 dark:text-primary/80 mb-6">
              <Image className="h-4 w-4 mr-2" />
              Professional Real Estate Photography
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-primary">Alex Carter</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Capturing architectural beauty and creating stunning visual narratives that sell properties faster
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                <span className="text-gray-700 dark:text-slate-200 font-medium">500+ Properties Shot</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                <span className="text-gray-700 dark:text-slate-200 font-medium">8+ Years Experience</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                <span className="text-gray-700 dark:text-slate-200 font-medium">24hr Delivery</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => scrollToSection("portfolio")}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center"
              >
                <Image className="h-4 w-4 mr-2" />
                View Portfolio
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="border border-gray-300 text-gray-700 dark:text-slate-200 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-200 flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book a Shoot
              </button>
            </div>

            {/* Featured Carousel */}
            <div className="relative overflow-hidden">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Featured Work</h2>
                <p className="text-gray-600 dark:text-slate-300">A glimpse of our recent photography projects</p>
              </div>

              <div className="carousel-container relative">
                <div className="carousel-track flex">
                  {[...FEATURED, ...FEATURED].map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="flex-shrink-0 mr-6 animate-scroll">
                      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden card-shadow hover-lift">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-80 h-60 object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-300">{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient edges */}
              <div className="pointer-events-none absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent dark:from-slate-900 z-10" />
              <div className="pointer-events-none absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent dark:from-slate-900 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" ref={setSectionRef("portfolio")} className="py-20 bg-gray-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h2>
              </div>

              {/* Filters (optional) */}
              <div className="flex items-center space-x-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200"
                >
                  <option value="all">All Projects</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="luxury">Luxury</option>
                  <option value="drone">Drone</option>
                </select>
              </div>
            </div>
            <p className="text-gray-600 dark:text-slate-300 max-w-2xl">
              A showcase of recent projects and completed shoots across various property types
            </p>
          </div>

          <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className={`portfolio-item ${item.category}`} data-category={item.category}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden card-shadow hover-lift">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover portfolio-image"
                      loading="lazy"
                    />
                    {item.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-slate-100">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">{item.subtitle}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-slate-400">
                        {typeof item.photos === "number" ? `${item.photos} Photos` : item.photos}
                      </span>
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
      <section id="services" ref={setSectionRef("services")} className="py-20 bg-gray-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Services</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive photography and videography services tailored for real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="text-white" />,
                title: "Residential Photography",
                bullets: [
                  "Interior & Exterior Shots",
                  "HDR Photography",
                  "Twilight Photography",
                  "Detail & Lifestyle Shots",
                ],
              },
              {
                icon: <Building className="text-white" />,
                title: "Commercial Properties",
                bullets: ["Office Buildings", "Retail Spaces", "Industrial Properties", "Architectural Photography"],
              },
              {
                icon: <Award className="text-white" />,
                title: "Luxury Estates",
                bullets: ["High-End Residential", "Luxury Amenities", "Lifestyle Photography", "Premium Editing"],
              },
              {
  icon: <Globe className="text-white" />,
  title: "Drone Photography",
  bullets: ["Aerial Property Views", "Neighborhood Context", "4K Video Footage", "FAA Certified Pilot"],
},

              {
                icon: <Feather className="text-white" />,
                title: "3D Virtual Tours",
                bullets: ["Matterport Technology", "Interactive Floor Plans", "Virtual Reality Ready", "Dollhouse View"],
              },
              {
                icon: <Camera className="text-white" />,
                title: "Video Production",
                bullets: ["Property Walk-throughs", "Cinematic Tours", "Agent Testimonials", "Social Media Content"],
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-8 hover-lift card-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{card.title}</h3>
                </div>
                <ul className="space-y-3 text-gray-700 dark:text-slate-300">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-gold mr-3" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* (remaining sections identical styling, icons replaced) */}

      {/* ABOUT */}
      <section id="about" ref={setSectionRef("about")} className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h2>
            <p className="text-gray-600 dark:text-slate-300">Passionate photographer dedicated to capturing properties through visual storytelling</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face&auto=format&q=80"
                  alt="Alex Carter"
                  className="w-full h-80 object-cover rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl group-hover:shadow-3xl transition-all duration-300"
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
                  { icon: <Home className="text-primary" />, num: "500+", label: "Properties Shot" },
                  { icon: <Star className="text-primary" />, num: "98%", label: "Client Satisfaction" },
                  { icon: <Clock className="text-primary" />, num: "24h", label: "Turnaround Time" },
                  { icon: <Building className="text-primary" />, num: "25+", label: "Top Agencies" },
                ].map((s: any, i: number) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 card-shadow hover-lift text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      {s.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{s.num}</div>
                    <div className="text-sm text-gray-600 dark:text-slate-300">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Helping Real Estate Agencies Sell Faster</h3>
              <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-primary">
                <p className="text-gray-700 dark:text-slate-200 mb-2"><strong>What I deliver:</strong></p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-300">
                  <li>• High-impact photography that captures property essence</li>
                  <li>• FAA-certified drone aerial perspectives</li>
                  <li>• Interactive 3D virtual tours with Matterport technology</li>
                  <li>• 24-hour turnaround for urgent listings</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>
                <div className="space-y-4">
                  {[
                    { Icon: MapPin, label: "Location", value: "Downtown Los Angeles, CA" },
                    { Icon: Phone, label: "Phone", value: "(555) 123-4567" },
                    { Icon: Mail, label: "Email", value: "alex@realestatephotos.com" },
                    { Icon: Globe, label: "Website", value: "www.alexcarterphotography.com" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-lg hover-lift">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <c.Icon className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{c.label}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-300">{c.value}</div>
                      </div>
                    </div>
                  ))}

                  {/* <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Follow My Work</div>
                    <div className="flex space-x-3">
                      <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200" aria-label="instagram">
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200" aria-label="linkedin">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200" aria-label="behance">
                        <Feather className="h-4 w-4" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200" aria-label="facebook">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={setSectionRef("contact")} className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Book Your Shoot</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6" />
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">Ready to showcase your property with stunning photography? Let's discuss your project</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
              <div className="space-y-6 mb-8">
                {[
                  { Icon: Phone, label: "Phone", value: "(555) 123-4567" },
                  { Icon: Mail, label: "Email", value: "alex@realestatephotos.com" },
                  { Icon: MapPin, label: "Location", value: "Downtown Los Angeles, CA" },
                  { Icon: Clock, label: "Response Time", value: "Within 2 hours" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4">
                      <c.Icon className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{c.label}</div>
                      <div className="text-gray-300">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4">Booking Process</h4>
                {[ "Initial consultation & quote", "Schedule photo shoot", "Professional photography session", "Delivery within 24 hours" ].map((step, i) => (
                  <div key={i} className="flex items-center mb-3 last:mb-0">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-3 text-primary font-bold text-sm">{i+1}</div>
                    <span>{step}</span>
                  </div>
                ))}
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
                <Camera className="text-gold h-6 w-6 mr-3" />
                <span className="text-2xl font-bold">Alex Carter</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional real estate photography services in Los Angeles and surrounding areas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gold transition duration-300" aria-label="instagram">
                  {/* <Instagram /> */}
                </a>
                <a href="#" className="text-gray-400 hover:text-gold transition duration-300" aria-label="facebook">
                  {/* <Facebook /> */}
                </a>
                <a href="#" className="text-gray-400 hover:text-gold transition duration-300" aria-label="linkedin">
                  {/* <Linkedin /> */}
                </a>
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
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="mr-2 text-gold" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 text-gold" />
                  alex@realestatephotos.com
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2 text-gold" />
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
}

export default ClientPortal;
