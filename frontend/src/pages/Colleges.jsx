import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Bookmark, Building2, ExternalLink, Filter,
  LocateFixed, MapPin, Navigation, Phone, Search, Sparkles, Star, GraduationCap,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import HeroIllustration from "../components/HeroIllustration";
import BackToTopButton from "../components/BackToTopButton";

const CATEGORIES = ["All", "Engineering", "Medical", "Management", "Commerce", "Law", "Coaching", "Skill"];

const CATEGORY_STYLES = {
  Engineering: "bg-brand-100 text-brand-800",
  Medical: "bg-rose-100 text-rose-700",
  Management: "bg-violet-100 text-violet-700",
  Commerce: "bg-emerald-100 text-emerald-700",
  Law: "bg-amber-100 text-amber-700",
  Coaching: "bg-orange-100 text-orange-700",
  "Skill Development": "bg-fuchsia-100 text-fuchsia-700",
  Arts: "bg-pink-100 text-pink-700",
};

const normalizeLink = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const RatingStars = ({ rating, reviewCount }) => {
  if (!rating) return null;
  const value = Number.parseFloat(rating);
  if (!Number.isFinite(value)) {
    return <span className="text-xs font-semibold text-amber-600">{rating}</span>;
  }
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={12} fill={index < filled ? "currentColor" : "none"} />
      ))}
      <span>{value.toFixed(1)}</span>
      <span className="text-muted2 font-medium">({Number(reviewCount || 0).toLocaleString()} reviews)</span>
    </span>
  );
};

const InstituteCard = ({ institute }) => {
  const courses = institute.courses || institute.coursesOffered || [];
  const categoryClass = CATEGORY_STYLES[institute.category] || "bg-slate-100 text-slate-700";
  const initials = (institute.name || "Institute")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="surface-gradient rounded-3xl border border-line p-4 sm:p-5" data-testid={`institute-card-${institute.id || institute.name}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl cc-logo-gradient text-white flex items-center justify-center font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-heading font-bold text-sm sm:text-base text-ink">{institute.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${categoryClass}`}>
              {institute.category}
            </span>
            {institute.businessStatus && (
              <span className="px-2 py-0.5 rounded-full bg-white border border-line text-[10px] font-semibold text-muted2">
                {institute.businessStatus.replaceAll("_", " ")}
              </span>
            )}
          </div>

          {institute.address && (
            <p className="text-xs text-muted2 inline-flex items-start gap-1 mt-1 leading-relaxed">
              <MapPin size={12} className="mt-0.5 shrink-0" /> {institute.address}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            {institute.phone && (
              <a href={`tel:${institute.phone}`} className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand">
                <Phone size={12} /> {institute.phone}
              </a>
            )}
            {institute.website && (
              <a href={normalizeLink(institute.website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand">
                Website <ExternalLink size={12} />
              </a>
            )}
            <RatingStars rating={institute.rating} reviewCount={institute.reviewCount} />
          </div>

          {courses.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {courses.slice(0, 8).map((course) => (
                <span key={course} className="px-2 py-0.5 rounded-full bg-white border border-line text-[11px] font-semibold text-muted2">
                  {course}
                </span>
              ))}
            </div>
          )}

          {institute.googleMapsLink && (
            <a
              href={normalizeLink(institute.googleMapsLink)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-full"
            >
              <Navigation size={13} /> View on Google Maps
            </a>
          )}
        </div>
        <Bookmark size={18} className="text-muted2 shrink-0" />
      </div>
    </div>
  );
};

export default function Colleges() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [courseQuery, setCourseQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");
  const [searchedCourse, setSearchedCourse] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const autoSearchKeyRef = useRef("");
  const locationPromptedRef = useRef(false);
  const locationRetryRef = useRef(false);

  useEffect(() => {
    const storedCourse = localStorage.getItem("last_roadmap_career_title") || localStorage.getItem("active_institute_course") || "";
    if (storedCourse && !courseQuery) setCourseQuery(storedCourse);
    if (user?.profile?.location && !locationQuery) setLocationQuery(user.profile.location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profile?.location]);

  useEffect(() => {
    const handler = (event) => {
      const nextCourse = event.detail?.course || localStorage.getItem("last_roadmap_career_title") || localStorage.getItem("active_institute_course") || "";
      if (nextCourse) setCourseQuery(nextCourse);
    };
    window.addEventListener("latecomers:institute-course-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("latecomers:institute-course-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Free client-side reverse geocode fallback (no API key needed).
  // Used if backend /colleges/reverse-geocode returns empty or fails.
  const fallbackReverseGeocode = async (lat, lng) => {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const city = data.city || data.locality || data.localityInfo?.administrative?.[3]?.name;
      const state = data.principalSubdivision;
      const parts = [city, state].filter(Boolean);
      return parts.length ? parts.join(", ") : null;
    } catch (err) {
      console.warn("[Geo] BigDataCloud fallback failed:", err);
      return null;
    }
  };

  const requestLocationAccess = useCallback(async () => {
    if (detectingLocation) return;
    if (!navigator.geolocation) {
      setLocationMessage("Location access is not supported. Please enter your city manually.");
      toast.error("Browser doesn't support geolocation");
      return;
    }
    if (!window.isSecureContext) {
      setLocationMessage("Browser location works only on HTTPS or localhost. Please enter your city manually.");
      toast.error("HTTPS required for location detection");
      return;
    }
    try {
      if (navigator.permissions?.query) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        console.log("[Geo] Permission state:", permission.state);
        if (permission.state === "denied") {
          setLocationMessage("Location permission is blocked in browser settings. Allow it for this site or enter your city manually.");
          toast.error("Location blocked in browser settings. Click the 🔒/ⓘ icon next to URL to allow.");
          return;
        }
      }
    } catch (e) {
      console.warn("[Geo] permission query unsupported:", e);
    }
    setDetectingLocation(true);
    locationRetryRef.current = false;
    setLocationMessage("Asking your browser for location access…");
    console.log("[Geo] Requesting current position…");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        console.log("[Geo] Got coords:", lat, lng);
        setLocationMessage(`Got your coords (${lat.toFixed(3)}, ${lng.toFixed(3)}) — resolving city…`);

        // 1) Try backend (uses Google Maps API on EC2)
        let city = null;
        try {
          const { data } = await api.post("/colleges/reverse-geocode", { lat, lng });
          console.log("[Geo] Backend response:", data);
          if (data?.location) city = data.location;
        } catch (error) {
          console.warn("[Geo] Backend reverse-geocode failed:", error?.response?.status, error?.response?.data || error?.message);
        }

        // 2) Fallback: free client-side reverse geocoding
        if (!city) {
          console.log("[Geo] Trying BigDataCloud fallback…");
          city = await fallbackReverseGeocode(lat, lng);
          if (city) console.log("[Geo] Fallback resolved city:", city);
        }

        // 3) Last resort — show coords as the location string (still searchable)
        if (!city) {
          city = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          console.warn("[Geo] Both services failed — using raw coords");
        }

        setLocationQuery(city);
        setLocationMessage(`📍 Detected: ${city}`);
        toast.success(`Location detected: ${city}`);
        setDetectingLocation(false);
      },
      (err) => {
        console.error("[Geo] getCurrentPosition error:", err.code, err.message);
        if (err.code !== 1 && !locationRetryRef.current) {
          locationRetryRef.current = true;
          setLocationMessage("Location was slow. Retrying with GPS...");
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude: lat, longitude: lng } = position.coords;
              let city = null;
              try {
                const { data } = await api.post("/colleges/reverse-geocode", { lat, lng });
                if (data?.location) city = data.location;
              } catch (_) {
                city = await fallbackReverseGeocode(lat, lng);
              }
              if (!city) city = await fallbackReverseGeocode(lat, lng);
              if (!city) city = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
              setLocationQuery(city);
              setLocationMessage(`Detected: ${city}`);
              toast.success(`Location detected: ${city}`);
              setDetectingLocation(false);
            },
            (retryErr) => {
              console.error("[Geo] retry getCurrentPosition error:", retryErr.code, retryErr.message);
              setDetectingLocation(false);
              const messages = {
                1: "Permission denied. Allow location for latecomers.in in browser site settings, or type your city manually.",
                2: "Position unavailable. Check your device GPS or type your city manually.",
                3: "Location request timed out. Try again or type your city manually.",
              };
              const msg = messages[retryErr.code] || `Location error (${retryErr.code}): ${retryErr.message}`;
              setLocationMessage(msg);
              toast.error(msg);
            },
            { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
          );
          return;
        }
        setDetectingLocation(false);
        const messages = {
          1: "Permission denied. Click the 🔒 icon next to URL to allow location, or type your city manually.",
          2: "Position unavailable. Check your device GPS or type your city manually.",
          3: "Location request timed out. Try again or type your city manually.",
        };
        const msg = messages[err.code] || `Location error (${err.code}): ${err.message}`;
        setLocationMessage(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10 * 60 * 1000 }
    );
  }, [detectingLocation]);

  // Auto-detect on mount, but only if no location is already filled (from profile or storage)
  useEffect(() => {
    if (locationPromptedRef.current) return;
    if (locationQuery.trim()) return; // Already have a location
    locationPromptedRef.current = true;
    requestLocationAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestLocationAccess]);

  const handleSearch = async () => {
    const normalizedLocation = locationQuery.trim();
    const normalizedCourse = courseQuery.trim();

    if (!normalizedLocation) {
      setLocationMessage("Enter a location to search nearby institutes.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("");
    setLocationResults([]);
    setRecommendation(null);
    setSearchedLocation(normalizedLocation);
    setSearchedCourse(normalizedCourse);

    try {
      const { data } = await api.post("/colleges/search", {
        location: normalizedLocation,
        course: normalizedCourse || undefined,
      });
      const results = data.results || [];
      setLocationResults(results);
      if (results.length === 0) {
        setLocationMessage(data.message || `No institutes found${normalizedCourse ? ` for ${normalizedCourse}` : ""} near ${normalizedLocation}. Try a nearby major city.`);
      } else {
        const courseLabel = normalizedCourse ? ` for "${normalizedCourse}"` : "";
        setLocationMessage(
          data.cached
            ? `Showing cached results${courseLabel} in ${data.location || normalizedLocation}.`
            : `Found ${results.length} institutes${courseLabel} near ${data.location || normalizedLocation}.`
        );
      }
    } catch (e) {
      setLocationMessage(e?.response?.data?.detail || "Search temporarily unavailable. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    const normalizedLocation = locationQuery.trim();
    const normalizedCourse = courseQuery.trim();
    if (!normalizedLocation || !normalizedCourse || locationLoading) return;
    const key = `${normalizedCourse}|${normalizedLocation}`;
    // Re-search if course OR location changed, even if old results exist
    if (autoSearchKeyRef.current === key) return;
    autoSearchKeyRef.current = key;
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseQuery, locationQuery]);

  const filteredResults = useMemo(() => {
    const query = q.trim().toLowerCase();
    return locationResults.filter((item) => {
      const categoryMatches =
        cat === "All" ||
        item.category === cat ||
        (cat === "Skill" && item.category === "Skill Development");
      if (!categoryMatches) return false;
      if (!query) return true;
      const haystack = [item.name, item.address, item.category, ...((item.courses || item.coursesOffered) || [])].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [cat, locationResults, q]);

  const handleRecommendation = async () => {
    if (!locationResults.length) {
      toast.error("Search a location first.");
      return;
    }
    setRecommendationLoading(true);
    try {
      const { data } = await api.post("/colleges/recommend", {
        location: searchedLocation || locationQuery,
        results: locationResults,
      });
      setRecommendation(data);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Recommendations are temporarily unavailable.");
    } finally {
      setRecommendationLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto" data-testid="institutes-page">
      <div className="flex items-start justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">Institutes &amp; Colleges</h1>
          <p className="text-xs sm:text-sm text-muted2">Find nearby institutes, colleges, and coaching centers</p>
        </div>
        <button className="p-2 rounded-full bg-white border border-line text-brand">
          <Bookmark size={16} />
        </button>
      </div>

      <div className="glass-card rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Find the Right Institute for You</h2>
          <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">
            Search by course and city to discover the best institutes near you.
          </p>
        </div>
        <HeroIllustration Icon={Building2} size={96} className="hidden sm:block" />
        <HeroIllustration Icon={Building2} size={64} className="sm:hidden shrink-0" />
      </div>

      {/* Search section — Course + Location + Button */}
      <div className="mt-5 glass-card rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <LocateFixed size={16} className="text-brand" />
            <p className="font-heading font-bold text-ink text-sm sm:text-base">Search Institutes</p>
          </div>
          <button
            type="button"
            onClick={requestLocationAccess}
            disabled={detectingLocation}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand/30 text-brand text-[11px] sm:text-xs font-bold px-3 py-1.5 hover:bg-brand-100 disabled:opacity-60 transition"
            data-testid="detect-location-cta"
          >
            <Navigation size={12} className={detectingLocation ? "animate-pulse" : ""} />
            {detectingLocation ? "Detecting your city…" : locationQuery ? "Re-detect location" : "Use my current location"}
          </button>
        </div>
        {courseQuery.trim() && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-2.5 py-1">
            <GraduationCap size={11} />
            <span>Course auto-filled: {courseQuery.trim()}</span>
            <button onClick={() => setCourseQuery("")} className="ml-1 text-emerald-600 hover:text-emerald-800" aria-label="Clear course">×</button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
          <div className="relative">
            <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2" />
            <input
              value={courseQuery}
              onChange={(e) => setCourseQuery(e.target.value)}
              placeholder="Course — e.g. Engineering, MBA, MBBS"
              className="w-full bg-white border border-line rounded-xl pl-10 pr-12 py-2.5 text-sm"
              data-testid="course-search-input"
            />
          </div>
          <div className="relative">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2" />
            <input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location — e.g. Mumbai, Pune, Delhi"
              className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm"
              data-testid="location-search-input"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              type="button"
              onClick={requestLocationAccess}
              disabled={detectingLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center disabled:opacity-50"
              title="Use current location"
              data-testid="use-current-location-button"
            >
              <LocateFixed size={14} className={detectingLocation ? "animate-pulse" : ""} />
            </button>
          </div>
          <button
            onClick={handleSearch}
            disabled={locationLoading}
            className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60 shrink-0"
            data-testid="search-institutes-button"
          >
            {locationLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Searching
              </>
            ) : (
              <>
                <Search size={14} /> {detectingLocation ? "Detecting..." : "Search"}
              </>
            )}
          </button>
        </div>
        {locationMessage && <p className="text-xs text-muted2 mt-2">{locationMessage}</p>}
        {searchedCourse && locationResults.length > 0 && (
          <p className="text-xs mt-1">
            <span className="text-muted2">Showing results for</span>{" "}
            <span className="font-semibold text-brand">{searchedCourse}</span>
            <span className="text-muted2"> in </span>
            <span className="font-semibold text-brand">{searchedLocation}</span>
          </p>
        )}

        {locationLoading && (
          <div className="mt-4 rounded-2xl border border-brand/15 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <span className="h-4 w-4 rounded-full border-2 border-brand-200 border-t-brand animate-spin" />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm sm:text-base font-bold text-ink">Finding nearby institutes</p>
                <p className="mt-0.5 text-xs sm:text-sm text-muted2 leading-relaxed">
                  {courseQuery.trim() || "Selected course"} near {locationQuery.trim() || "your city"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-line bg-[#FAFAFE] p-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl skeleton-shimmer" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3.5 w-2/3 rounded skeleton-shimmer" />
                    <div className="mt-2 h-3 w-full rounded skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter bar — only show after results */}
      {locationResults.length > 0 && (
        <>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by name, course, or address..."
                data-testid="institutes-filter"
                className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full bg-white border border-line text-xs sm:text-sm font-semibold text-brand">
              <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setCat(category)}
                data-testid={`cat-${category.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border ${
                  cat === category ? "bg-brand text-white border-brand shadow-brand" : "bg-white border-line text-ink"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Results header */}
      <div className="mt-5 flex items-center justify-between">
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
          {locationResults.length > 0 ? "Nearby Institutes" : "Search to Find Institutes"}
        </h3>
        {locationResults.length > 0 && (
          <p className="text-xs sm:text-sm font-semibold text-brand">{filteredResults.length} results</p>
        )}
      </div>

      {/* Results list */}
      <div className="mt-3 space-y-3">
        {!locationLoading && recommendation && (
          <div className="ai-suggestions-box">
            <div className="ai-badge"><Sparkles size={12} /> AI Recommended for You</div>
            <p>{recommendation.summary}</p>
            <div className="mt-3 space-y-2">
              {(recommendation.recommendations || []).map((item) => (
                <div key={item.name} className="bg-white/80 border border-line rounded-2xl p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-bold text-sm text-ink">{item.name}</p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">{item.fit} Fit</span>
                  </div>
                  <p className="text-xs text-muted2 mt-1">{item.reason}</p>
                  {item.nextStep && <p className="text-xs font-semibold text-brand mt-1">Next: {item.nextStep}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!locationLoading && filteredResults.map((institute) => (
          <InstituteCard key={institute.id || institute.name} institute={institute} />
        ))}

        {!locationLoading && locationResults.length === 0 && (
          <div className="bg-white border border-line rounded-3xl p-6 text-center">
            <Building2 size={32} className="mx-auto text-muted2 mb-2" />
            <p className="font-semibold text-ink">{locationMessage || "Search a course and city to find nearby institutes."}</p>
            <p className="text-xs text-muted2 mt-1">Try: "Engineering" in "Mumbai" or "MBA" in "Delhi"</p>
          </div>
        )}

        {!locationLoading && locationResults.length > 0 && filteredResults.length === 0 && (
          <div className="bg-white border border-line rounded-3xl p-6 text-center">
            <p className="font-semibold text-ink">No institutes match this filter. Try "All" or another category.</p>
          </div>
        )}
      </div>

      {/* Recommendation CTA */}
      <div className="mt-5 glass-card rounded-3xl p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-line text-brand flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm sm:text-base text-ink">Not sure which institute is right?</p>
            <p className="text-xs text-muted2 mt-0.5">Get AI-powered recommendations based on your profile and search results.</p>
          </div>
        </div>
        <button
          onClick={handleRecommendation}
          disabled={recommendationLoading || !locationResults.length}
          className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full disabled:opacity-60"
          data-testid="get-recommendations-btn"
        >
          {recommendationLoading ? "Recommending..." : "Get Recommendations"} <ArrowRight size={14} />
        </button>
      </div>

      <BackToTopButton />
    </div>
  );
}
