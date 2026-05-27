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
  Engineering: "bg-blue-100 text-blue-700",
  Medical: "bg-rose-100 text-rose-700",
  Management: "bg-violet-100 text-violet-700",
  Commerce: "bg-emerald-100 text-emerald-700",
  Law: "bg-amber-100 text-amber-700",
  Coaching: "bg-orange-100 text-orange-700",
  "Skill Development": "bg-cyan-100 text-cyan-700",
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

  useEffect(() => {
    const storedCourse = localStorage.getItem("active_institute_course") || localStorage.getItem("last_roadmap_career_title") || "";
    if (storedCourse && !courseQuery) setCourseQuery(storedCourse);
    if (user?.profile?.location && !locationQuery) setLocationQuery(user.profile.location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profile?.location]);

  useEffect(() => {
    const handler = (event) => {
      const nextCourse = event.detail?.course || localStorage.getItem("active_institute_course") || "";
      if (nextCourse) setCourseQuery(nextCourse);
    };
    window.addEventListener("latecomers:institute-course-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("latecomers:institute-course-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const requestLocationAccess = useCallback(async () => {
    if (detectingLocation) return;
    if (!navigator.geolocation) {
      setLocationMessage("Location access is not supported. Please enter your city manually.");
      return;
    }
    if (!window.isSecureContext) {
      setLocationMessage("Browser location works only on HTTPS or localhost. Please enter your city manually.");
      return;
    }
    try {
      if (navigator.permissions?.query) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
          setLocationMessage("Location permission is blocked in browser settings. Allow it for this site or enter your city manually.");
          return;
        }
      }
    } catch {
      // Some browsers do not support querying geolocation permission; request normally.
    }
    setDetectingLocation(true);
    setLocationMessage("Please allow location access to find institutes near you, or enter your city manually.");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data } = await api.post("/colleges/reverse-geocode", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (data.location) {
            setLocationQuery(data.location);
            setLocationMessage(`Detected your location: ${data.location}`);
          } else {
            setLocationMessage(data.message || "Please enter your city manually.");
          }
        } catch (error) {
          setLocationMessage(error?.response?.data?.detail || "Could not detect your city. Please enter it manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        setLocationMessage("Location permission was denied or dismissed. Please enter your city manually.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [detectingLocation]);

  useEffect(() => {
    if (locationPromptedRef.current) return;
    locationPromptedRef.current = true;
    requestLocationAccess();
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
    if (autoSearchKeyRef.current === key || locationResults.length > 0) return;
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
        <div className="flex items-center gap-2 mb-3">
          <LocateFixed size={16} className="text-brand" />
          <p className="font-heading font-bold text-ink text-sm sm:text-base">Search Institutes</p>
        </div>
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
            <Search size={14} /> {locationLoading ? "Searching..." : detectingLocation ? "Detecting..." : "Search"}
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
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <span className="w-4 h-4 border-2 border-brand-200 border-t-brand rounded-full animate-spin" />
              Searching institutes{courseQuery.trim() ? ` for ${courseQuery.trim()}` : ""} near {locationQuery.trim()}...
            </div>
            <div className="h-5 w-2/3 rounded skeleton-shimmer" />
            <div className="h-16 w-full rounded skeleton-shimmer" />
            <div className="h-16 w-full rounded skeleton-shimmer" />
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
