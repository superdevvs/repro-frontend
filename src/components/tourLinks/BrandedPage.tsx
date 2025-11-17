import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function BrandedPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("site-theme");
      return (saved as Theme) || "system";
    } catch {
      return "system";
    }
  });

  // apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    const applyDark = (isDark: boolean) => {
      if (isDark) root.classList.add("dark");
      else root.classList.remove("dark");
    };

    let mq: MediaQueryList | null = null;
    let mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

    if (theme === "dark") {
      applyDark(true);
      localStorage.setItem("site-theme", "dark");
    } else if (theme === "light") {
      applyDark(false);
      localStorage.setItem("site-theme", "light");
    } else {
      localStorage.setItem("site-theme", "system");
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyDark(mq.matches);
      mqHandler = (e: MediaQueryListEvent) => applyDark(e.matches);
      if (mq.addEventListener) mq.addEventListener("change", mqHandler);
      else mq.addListener(mqHandler);
    }

    return () => {
      if (mq && mqHandler) {
        if (mq.removeEventListener) mq.removeEventListener("change", mqHandler);
        else mq.removeListener(mqHandler);
      }
    };
  }, [theme]);

  // small helper for "theme button" classes (used for bigger buttons; icon is separate)
  const themeButtonClasses = (t: Theme) =>
    `px-3 py-1 rounded-md text-sm transition ${theme === t
      ? "bg-white/90 text-black shadow-sm dark:bg-slate-700/80 dark:text-white"
      : "bg-transparent text-white/80 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/10"
    }`;

  // other DOM concerns (menu, gallery controllers, footer year, etc.)
  useEffect(() => {
    // --- Mobile menu toggle ---
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
    const onMenuClick = () => menu?.classList.toggle("hidden");
    if (btn) btn.addEventListener("click", onMenuClick);

    // --- footer year ---
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // --- Gallery controllers (kept as-is; same behavior) ---
    (function () {
      const AUTOPLAY_INTERVAL = 3000;
      const ZOOM_STEP = 0.25;
      const ZOOM_MAX = 3;
      const ZOOM_MIN = 1;

      function createGalleryController(options: { thumbSelector: string; modalIdPrefix: string; initialSlides?: string[] | null }) {
        const { thumbSelector, modalIdPrefix, initialSlides = null } = options;
        const thumbs = Array.from(document.querySelectorAll(thumbSelector)) as HTMLImageElement[];
        const popup = document.getElementById(modalIdPrefix + "popup");
        if (!popup) return null;
        const slidesContainer = document.getElementById(modalIdPrefix + "-slides");
        const closeBtn = document.getElementById(modalIdPrefix + "closePopup") || document.getElementById(modalIdPrefix + "close");
        const prevBtn = document.getElementById(modalIdPrefix + "Prev");
        const nextBtn = document.getElementById(modalIdPrefix + "Next");
        const playPauseBtn = document.getElementById(modalIdPrefix + "PlayPause");
        const ppIcon = document.getElementById(modalIdPrefix + "PpIcon");
        const ppLabel = document.getElementById(modalIdPrefix + "PpLabel");
        const caption = document.getElementById(modalIdPrefix + "-caption");
        const counter = document.getElementById(modalIdPrefix + "-counter");
        const zoomInBtn = document.getElementById(modalIdPrefix + "ZoomIn");
        const zoomOutBtn = document.getElementById(modalIdPrefix + "ZoomOut");
        const fsBtn = document.getElementById(modalIdPrefix + "Fullscreen");

        const images = thumbs.length ? thumbs.map((t) => t.getAttribute("src") || "") : initialSlides || [];
        if (!slidesContainer) {
          console.warn("slidesContainer missing for", modalIdPrefix);
          return null;
        }

        let current = 0;
        let autoplayId: any = null;
        let isPlaying = false;
        let touchStartX = 0;
        let zoomScale = 1;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let imgOffsetX = 0;
        let imgOffsetY = 0;
        let lastTapTime = 0;
        let activeImgPointerDown = false;

        function buildSlides() {
          slidesContainer.innerHTML = "";
          images.forEach((src, i) => {
            const wrap = document.createElement("div");
            wrap.className = "slide hidden w-full flex items-center justify-center";
            wrap.setAttribute("data-index", String(i));
            const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
            if (isVideo) {
              const v = document.createElement("video");
              v.src = src;
              v.controls = true;
              v.className = "block mx-auto w-auto max-w-full max-h-[85vh] object-contain rounded-lg";
              wrap.appendChild(v);
            } else {
              const img = document.createElement("img");
              img.src = src;
              img.alt = `Slide ${i + 1}`;
              img.className = "gallery-image block mx-auto w-auto max-w-full max-h-[85vh] object-contain rounded-lg touch-none";
              img.draggable = false;
              wrap.appendChild(img);
            }
            slidesContainer.appendChild(wrap);
          });
        }

        function getActiveSlide() {
          return slidesContainer.querySelector(".slide:not(.hidden)");
        }
        function getActiveMedia() {
          const s = getActiveSlide();
          return s ? (s.querySelector("img") || s.querySelector("video")) : null;
        }

        function applyTransformToActive() {
          const media: any = getActiveMedia();
          if (!media) return;
          if (media.tagName === "IMG") {
            media.style.transform = `translate(${imgOffsetX}px, ${imgOffsetY}px) scale(${zoomScale})`;
            media.style.transition = "transform 0.05s ease-out";
            media.style.cursor = zoomScale > 1 ? "grab" : "auto";
            media.style.touchAction = zoomScale > 1 ? "none" : "pan-y";
          }
        }

        function resetZoom() {
          zoomScale = 1;
          imgOffsetX = 0;
          imgOffsetY = 0;
          const media: any = getActiveMedia();
          if (media && media.tagName === "IMG") {
            media.style.transform = "";
            media.style.cursor = "";
            media.style.transition = "";
            media.style.touchAction = "";
          }
        }

        function showSlide(index: number) {
          if (!images.length) return;
          index = ((index % images.length) + images.length) % images.length;
          current = index;
          resetZoom();
          const slides = slidesContainer.querySelectorAll(".slide");
          slides.forEach((s) => s.classList.add("hidden"));
          const active = slidesContainer.querySelector(`.slide[data-index="${index}"]`);
          if (active) active.classList.remove("hidden");
          const src = images[index];
          const fileName = src ? src.split("/").pop() : `Slide ${index + 1}`;
          if (caption) caption.textContent = fileName || "";
          if (counter) counter.textContent = `${index + 1} / ${images.length}`;
          thumbs.forEach((t) => t.classList.remove("ring-4", "ring-white", "ring-offset-2"));
          const thumb = thumbs[index];
          if (thumb) thumb.classList.add("ring-4", "ring-white", "ring-offset-2");
        }

        function openPopup(index?: number | null) {
          buildSlides();
          showSlide(index || 0);
          popup.classList.remove("hidden");
          document.documentElement.style.overflow = "hidden";
          attachImageEventListeners();
        }
        function closePopup() {
          popup.classList.add("hidden");
          stopAutoplay();
          document.documentElement.style.overflow = "";
          detachImageEventListeners();
        }

        function next() {
          showSlide(current + 1);
        }
        function prev() {
          showSlide(current - 1);
        }

        function startAutoplay() {
          if (isPlaying || images.length <= 1) return;
          isPlaying = true;
          if (ppIcon) ppIcon.textContent = "⏸";
          if (ppLabel) ppLabel.textContent = "Pause";
          autoplayId = setInterval(() => next(), AUTOPLAY_INTERVAL);
        }
        function stopAutoplay() {
          if (!isPlaying) return;
          isPlaying = false;
          if (ppIcon) ppIcon.textContent = "▶";
          if (ppLabel) ppLabel.textContent = "Play";
          clearInterval(autoplayId);
          autoplayId = null;
        }
        function toggleAutoplay() {
          if (isPlaying) stopAutoplay(); else startAutoplay();
        }
        function restartAutoplay() {
          stopAutoplay();
          startAutoplay();
        }

        const thumbClickHandlers: Array<() => void> = [];
        thumbs.forEach((t, i) => {
          const handler = () => openPopup(i);
          thumbClickHandlers.push(handler);
          t.addEventListener("click", handler);
          t.setAttribute("tabindex", "0");
          t.addEventListener("keydown", (ev) => {
            if ((ev as KeyboardEvent).key === "Enter" || (ev as KeyboardEvent).key === " ") {
              ev.preventDefault();
              (t as HTMLElement).click();
            }
          });
        });

        closeBtn?.addEventListener("click", closePopup);
        prevBtn?.addEventListener("click", () => { prev(); if (isPlaying) restartAutoplay(); });
        nextBtn?.addEventListener("click", () => { next(); if (isPlaying) restartAutoplay(); });
        playPauseBtn?.addEventListener("click", toggleAutoplay);

        zoomInBtn?.addEventListener("click", () => { zoomScale = Math.min(zoomScale + ZOOM_STEP, ZOOM_MAX); applyTransformToActive(); });
        zoomOutBtn?.addEventListener("click", () => { zoomScale = Math.max(zoomScale - ZOOM_STEP, ZOOM_MIN); if (zoomScale === 1) { imgOffsetX = 0; imgOffsetY = 0; } applyTransformToActive(); });

        fsBtn?.addEventListener("click", async () => {
          try { if (!document.fullscreenElement) await (popup as any).requestFullscreen(); else await document.exitFullscreen(); } catch (err) { console.warn(err); }
        });

        popup.addEventListener("click", (e) => { if (e.target === popup) closePopup(); });

        function keyHandler(e: KeyboardEvent) {
          if (popup.classList.contains("hidden")) return;
          if (e.key === "ArrowRight") { next(); if (isPlaying) restartAutoplay(); }
          if (e.key === "ArrowLeft") { prev(); if (isPlaying) restartAutoplay(); }
          if (e.key === "Escape") closePopup();
        }
        document.addEventListener("keydown", keyHandler);

        slidesContainer.addEventListener("touchstart", (e) => { if (zoomScale > 1) return; touchStartX = (e as TouchEvent).changedTouches[0].clientX; });
        slidesContainer.addEventListener("touchend", (e) => {
          if (zoomScale > 1) return;
          const touchEndX = (e as TouchEvent).changedTouches[0].clientX;
          const dx = touchEndX - touchStartX;
          if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); if (isPlaying) restartAutoplay(); }
        });

        function attachImageEventListeners() {
          slidesContainer.addEventListener("pointerdown", onPointerDown);
          slidesContainer.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
          slidesContainer.addEventListener("dblclick", (e) => toggleDoubleClickZoom((e as MouseEvent).clientX, (e as MouseEvent).clientY));
          slidesContainer.addEventListener("touchend", (e) => {
            const now = Date.now(); const gap = now - lastTapTime; lastTapTime = now;
            if (gap < 300 && gap > 0) { const t = (e as TouchEvent).changedTouches[0]; toggleDoubleClickZoom(t.clientX, t.clientY); }
          });
        }
        function detachImageEventListeners() {
          slidesContainer.removeEventListener("pointerdown", onPointerDown);
          slidesContainer.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
        }

        function onPointerDown(e: PointerEvent) {
          const media: any = getActiveMedia();
          if (!media || media.tagName !== "IMG") return;
          if (zoomScale <= 1) return;
          isDragging = true; activeImgPointerDown = true;
          dragStartX = (e as PointerEvent).clientX - imgOffsetX; dragStartY = (e as PointerEvent).clientY - imgOffsetY;
          try { (e.target as HTMLElement).setPointerCapture && (e.target as HTMLElement).setPointerCapture((e as any).pointerId); } catch (_) { }
          media.style.cursor = "grabbing";
        }
        function onPointerMove(e: PointerEvent) { if (!isDragging) return; imgOffsetX = (e as PointerEvent).clientX - dragStartX; imgOffsetY = (e as PointerEvent).clientY - dragStartY; applyTransformToActive(); }
        function onPointerUp(e: PointerEvent) {
          if (!activeImgPointerDown) return;
          isDragging = false; activeImgPointerDown = false;
          const media: any = getActiveMedia();
          if (media && media.tagName === "IMG") media.style.cursor = "grab";
          clampImageOffset();
        }
        function clampImageOffset() {
          const img: any = getActiveMedia();
          if (!img || img.tagName !== "IMG") return;
          const rect = img.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const scaledWidth = rect.width;
          const scaledHeight = rect.height;
          const maxX = Math.max(0, (scaledWidth - vw) / 2 + 50);
          const maxY = Math.max(0, (scaledHeight - vh) / 2 + 50);
          imgOffsetX = Math.max(-maxX, Math.min(maxX, imgOffsetX));
          imgOffsetY = Math.max(-maxY, Math.min(maxY, imgOffsetY));
          applyTransformToActive();
        }
        function toggleDoubleClickZoom(clientX: number, clientY: number) {
          const media: any = getActiveMedia();
          if (!media || media.tagName !== "IMG") return;
          const rect = media.getBoundingClientRect();
          const clickX = clientX - rect.left;
          const clickY = clientY - rect.top;
          if (zoomScale === 1) {
            zoomScale = Math.min(2, ZOOM_MAX);
            const dx = (rect.width / 2 - clickX) * (zoomScale - 1);
            const dy = (rect.height / 2 - clickY) * (zoomScale - 1);
            imgOffsetX += dx; imgOffsetY += dy;
          } else { zoomScale = 1; imgOffsetX = 0; imgOffsetY = 0; }
          applyTransformToActive(); clampImageOffset();
        }

        if (images.length) buildSlides();

        // cleanup for this controller
        return () => {
          thumbs.forEach((t, i) => {
            const handler = thumbClickHandlers[i];
            if (handler) t.removeEventListener("click", handler);
          });
          closeBtn?.removeEventListener("click", closePopup);
          prevBtn?.removeEventListener("click", () => { prev(); if (isPlaying) restartAutoplay(); });
          nextBtn?.removeEventListener("click", () => { next(); if (isPlaying) restartAutoplay(); });
          playPauseBtn?.removeEventListener("click", toggleAutoplay);
          zoomInBtn?.removeEventListener("click", () => { zoomScale = Math.min(zoomScale + ZOOM_STEP, ZOOM_MAX); applyTransformToActive(); });
          zoomOutBtn?.removeEventListener("click", () => { zoomScale = Math.max(zoomScale - ZOOM_STEP, ZOOM_MIN); if (zoomScale === 1) { imgOffsetX = 0; imgOffsetY = 0; } applyTransformToActive(); });
          fsBtn?.removeEventListener("click", async () => { });
          document.removeEventListener("keydown", keyHandler);
          detachImageEventListeners();
        };
      }

      try {
        createGalleryController({ thumbSelector: ".thumb", modalIdPrefix: "photo" });
        createGalleryController({ thumbSelector: ".video-thumb", modalIdPrefix: "video" });
        createGalleryController({ thumbSelector: ".gallery-img", modalIdPrefix: "floor" });
      } catch (err) {
        console.error("Error creating gallery controllers", err);
      }
    })();

    // cleanup for menu
    return () => {
      if (btn) btn.removeEventListener("click", onMenuClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* HERO */}
      <div className="top-0 mb-4 relative">
        <img
          src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
          alt="Banner Image"
          className="w-full h-[36vh] md:h-[44vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 z-20">
          <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 rounded-xl shadow-lg text-center max-w-3xl">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-snug">
              1702 25th Street Southeast, Washington, DC 20020
            </h2>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="bg-transparent backdrop-blur-md shadow-sm fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] z-50 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col text-sm sm:text-base font-semibold leading-tight text-gray-800 dark:text-gray-200">
                <p>1702 25th Street Southeast,</p>
                <p>Washington, DC 20020</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 font-semibold">
              <a href="#photo" className="text-gray-700 dark:text-gray-200 hover:text-primary/90">Photo</a>
              <a href="#video" className="text-gray-700 dark:text-gray-200 hover:text-primary/90">Video</a>
              <a href="#3dtour" className="text-gray-700 dark:text-gray-200 hover:text-primary/90">3D Tour</a>
              <a href="#floorplan" className="text-gray-700 dark:text-gray-200 hover:text-primary/90">Floor Plan</a>
              <a href="#map" className="text-gray-700 dark:text-gray-200 hover:text-primary/90">Location</a>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme icon (cycles system -> light -> dark) */}
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "system"))}
                title={`Theme: ${theme}`}
                aria-label={`Theme: ${theme}. Click to change.`}
                className="p-2 rounded-md bg-white/10 dark:bg-slate-800/40 hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              >
                {theme === "light" && <Sun className="h-5 w-5 text-yellow-400" />}
                {theme === "dark" && <Moon className="h-5 w-5 text-indigo-300" />}
                {theme === "system" && <Monitor className="h-5 w-5 text-slate-200" />}
              </button>

              {/* mobile select fallback */}
              <div className="sm:hidden">
                <label htmlFor="theme-select" className="sr-only">Theme</label>
                <select
                  id="theme-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="text-sm rounded-md bg-white/90 px-2 py-1"
                  aria-label="Select theme"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="md:hidden flex items-center">
                <button id="menu-btn" className="text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="menu">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="menu" className="hidden md:hidden px-4 pb-4 space-y-2 bg-transparent backdrop-blur-md">
          <a href="#photo" className="block text-gray-700 dark:text-gray-200">Photo</a>
          <a href="#video" className="block text-gray-700 dark:text-gray-200">Video</a>
          <a href="#3dtour" className="block text-gray-700 dark:text-gray-200">3D Tour</a>
          <a href="#floorplan" className="block text-gray-700 dark:text-gray-200">Floor Plan</a>
          <a href="#map" className="block text-gray-700 dark:text-gray-200">Location</a>
        </div>
      </nav>

      <div className="h-24" />

      <div className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-around text-gray-700 text-sm md:text-base mt-20">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M4 6h16a1 1 0 011 1v8H3V7a1 1 0 011-1zM21 16H3v4h18v-4z" />
          </svg>
          <span className="font-medium">3 Bedrooms</span>
        </div>

        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13h16v8H4v-8zM4 9h16V7a1 1 0 00-1-1h-5V3h-4v3H5a1 1 0 00-1 1v2z" />
          </svg>
          <span className="font-medium">2 Bathrooms</span>
        </div>

        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M12 3v18" />
          </svg>
          <span className="font-medium">1450 sq.ft</span>
        </div>
      </div>

      {/* AGENT CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                        bg-white/90 dark:bg-slate-800/60 backdrop-blur-md
                        border border-transparent dark:border-slate-700/30
                        shadow-md dark:shadow-black/30">
          <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
            <img src="/images/agent.jpg" alt="Agent" className="h-14 w-14 rounded-full object-cover border-2 border-white/80 dark:border-slate-700 shadow-md flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base leading-tight text-center sm:text-left text-black dark:text-white">
                  John Doe
                </p>
                <p className="text-xs sm:text-sm mt-1 text-center sm:text-left text-gray-700 dark:text-slate-300">📞 +1 (202) 555-1234</p>
                <p className="text-xs sm:text-sm mt-0.5 text-center sm:text-left text-gray-700 dark:text-slate-300">✉️ johndoe@example.com</p>
              </div>

              <div className="sm:hidden flex-shrink-0 mt-2 w-full">
                <a href="/client-portal" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 bg-transparent text-black dark:text-white font-semibold rounded-full shadow-sm hover:text-blue-500 dark:hover:text-blue-400 transition w-full text-center">Visit Site</a>
              </div>
            </div>
          </div>

          <div className="hidden sm:block flex-shrink-0">
            <a href="/client-portal" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-black dark:text-white font-semibold rounded-full shadow-sm hover:text-blue-500 dark:hover:text-blue-400 transition" aria-label="Visit client portal">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14L21 3" />
              </svg>
              Visit Site
            </a>
          </div>
        </div>
      </div>

      {/* PHOTOS (shortened for brevity in this component) */}
      <section id="photo" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">PHOTOS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="photos-grid">
            <img data-index={0} src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?auto=format&fit=crop&q=60&w=600" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Photo 1" />
            <img data-index={1} src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&q=80&w=2070" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Photo 2" />
            <img data-index={2} src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?auto=format&fit=crop&q=60&w=600" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Photo 3" />
            <img data-index={3} src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&q=80&w=2070" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Photo 4" />
          </div>
        </div>

        <div id="photopopup" className="fixed inset-0 z-[9999] hidden grid place-items-center bg-black/80 p-4">
          <button id="photoclosePopup" className="absolute top-4 right-4 text-white text-3xl leading-none focus:outline-none" aria-label="Close">×</button>
          <div className="w-full max-w-6xl pointer-events-auto relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
              <button id="photoPrev" className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">‹</button>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
              <button id="photoNext" className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">›</button>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-6 z-20 flex gap-3 items-center">
              <button id="photoPlayPause" className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white"><span id="photoPpIcon">▶</span><span id="photoPpLabel" className="text-sm">Play</span></button>
              <button id="photoZoomIn" className="w-9 h-9 rounded-full bg-white/10 text-white">＋</button>
              <button id="photoZoomOut" className="w-9 h-9 rounded-full bg-white/10 text-white">－</button>
              <button id="photoFullscreen" className="w-9 h-9 rounded-full bg-white/10 text-white">⛶</button>
            </div>

            <div id="photo-slides" className="bg-transparent rounded-lg overflow-hidden" />

            <div className="mt-4 flex items-center justify-end text-sm text-white/90">
              <div id="photo-counter" className="opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Video, 3D Tour, Floorplans, Map, Contact sections follow same structure */}
      <section id="video" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">VIDEOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <img data-index={0} src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Video 1" />
            <img data-index={1} src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Video 2" />
            <img data-index={2} src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Video 3" />
            <img data-index={3} src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="Video 4" />
          </div>
        </div>

        <div id="videopopup" className="fixed inset-0 z-[9999] hidden grid place-items-center bg-black/80 p-4">
          <button id="videoclosePopup" className="absolute top-4 right-4 text-white text-3xl leading-none">×</button>
          <div className="w-full max-w-6xl pointer-events-auto relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-6 z-20 flex items-center gap-2 bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <button id="videoPrev" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">‹</button>
              <button id="videoPlayPause" className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none"><span id="videoPpIcon"></span><span id="videoPpLabel" className="text-sm">Play</span></button>
              <button id="videoZoomIn" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">＋</button>
              <button id="videoZoomOut" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">－</button>
              <button id="videoFullscreen" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">⛶</button>
              <button id="videoNext" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">›</button>
            </div>

            <div id="video-slides" className="bg-transparent rounded-lg overflow-hidden"></div>
            <div className="mt-4 flex items-center justify-between text-sm text-white/90">
              <div id="video-caption" className="truncate max-w-[70%]"></div>
              <div id="video-counter" className="opacity-90"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="3dtour" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">3D TOUR</h2>
          <div className="flex justify-center">
            <img data-index={0} src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070" className="thumb w-full rounded-lg shadow-md hover:opacity-90 cursor-pointer object-cover h-48" alt="3D Tour" />
          </div>
        </div>
      </section>

      {/* FLOORPLANS (theme-aware) */}
      <section id="floorplan" className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-full max-w-6xl p-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-black dark:text-white">
              FLOOR PLANS
            </h2>

            <div id="gallery" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <img
                src="/images/floor1.JPG"
                alt="Floor 1"
                className="gallery-img w-full h-auto rounded-lg shadow-sm dark:shadow-lg hover:opacity-90 cursor-pointer object-cover border border-transparent dark:border-slate-700"
              />
              <img
                src="/images/floor1 (2).JPG"
                alt="Floor 2"
                className="gallery-img w-full h-auto rounded-lg shadow-sm dark:shadow-lg hover:opacity-90 cursor-pointer object-cover border border-transparent dark:border-slate-700"
              />
              <img
                src="/images/floor1 (3).JPG"
                alt="Floor 3"
                className="gallery-img w-full h-auto rounded-lg shadow-sm dark:shadow-lg hover:opacity-90 cursor-pointer object-cover border border-transparent dark:border-slate-700"
              />
              <img
                src="/images/floor1 (4).JPG"
                alt="Floor 4"
                className="gallery-img w-full h-auto rounded-lg shadow-sm dark:shadow-lg hover:opacity-90 cursor-pointer object-cover border border-transparent dark:border-slate-700"
              />
              <img
                src="/images/floor1 (5).JPG"
                alt="Floor 5"
                className="gallery-img w-full h-auto rounded-lg shadow-sm dark:shadow-lg hover:opacity-90 cursor-pointer object-cover border border-transparent dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        <div
          id="floorpopup"
          className="fixed inset-0 z-[9999] hidden grid place-items-center bg-black/80 p-4"
          aria-hidden="true"
        >
          <button
            id="floorclosePopup"
            className="absolute top-4 right-4 text-white text-3xl leading-none focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>

          <div className="w-full max-w-6xl pointer-events-auto relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-6 z-20 flex items-center gap-2 bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <button id="Prev" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">‹</button>
              <button id="PlayPause" className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none">
                <span id="PpIcon"></span>
                <span id="photoPpLabel" className="text-sm">Play</span>
              </button>
              <button id="ZoomIn" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">＋</button>
              <button id="ZoomOut" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">－</button>
              <button id="Fullscreen" className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">⛶</button>
              <button id="Next" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus:outline-none">›</button>
            </div>

            {/* slides area: white card in light mode, dark card in dark mode */}
            <div id="floor-slides" className="bg-white rounded-lg overflow-hidden dark:bg-slate-800" />

            <div className="mt-4 flex items-center justify-between text-sm">
              <div id="floor-caption" className="truncate max-w-[70%] text-black dark:text-gray-200" />
              <div id="floor-counter" className="opacity-90 text-white/90" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - theme compatible */}
      <footer>
        <p
          className="
      w-full py-3 text-center text-xs
      text-black dark:text-gray-300
      border-t border-black/10 dark:border-white/20
      bg-white dark:bg-slate-900
      transition-colors
    "
        >
          © <span id="year"></span> R/E Pro Photos — All rights reserved.
        </p>
      </footer>
    </div>
  );
}