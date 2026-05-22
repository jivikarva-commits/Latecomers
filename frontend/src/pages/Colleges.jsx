import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  ExternalLink,
  Filter,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Sparkles,
  Star,
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
    <div className="surface-gradient rounded-3xl border border-line p-4 sm:p-5" data-testid={`college-card-${institute.id || institute.name}`}>
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
  const [locationQuery, setLocationQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  useEffect(() => {
    setLocationQuery(user?.profile?.location || "");
  }, [user?.profile?.location]);

  const handleLocationSearch = async () => {
    const normalized = locationQuery.trim();
    if (!normalized) {
      setLocationMessage("Enter a location to search nearby institutes.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("");
    setLocationResults([]);
    setRecommendation(null);
    setSearchedLocation(normalized);

    try {
      const { data } = await api.post("/colleges/search", { location: normalized });
      const results = data.results || [];
      setLocationResults(results);
      if (results.length === 0) {
        setLocationMessage(data.message || "No institutes found near this location. Try a nearby major city.");
      } else {
        setLocationMessage(data.message || (data.cached ? `Showing cached results for ${data.location || normalized}.` : `Showing live results for ${data.location || normalized}.`));
      }
    } catch (e) {
      setLocationMessage(e?.response?.data?.detail || "Search temporarily unavailable. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

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
      const { data } = await api.post("/colleges/recommend", { location: searchedLocation || locationQuery, results: locationResults });
      setRecommendation(data);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Recommendations are temporarily unavailable.");
    } finally {
      setRecommendationLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto" data-testid="colleges-page">
      <div className="flex items-start justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">Colleges &amp; Institutes</h1>
          <p className="text-xs sm:text-sm text-muted2">Find nearby colleges, institutes, and coaching centers</p>
        </div>
        <button className="p-2 rounded-full bg-white border border-line text-brand">
          <Bookmark size={16} />
        </button>
      </div>

      <div className="glass-card rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Find the Right Institute for You</h2>
          <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">
            Search by city or locality to discover institutes near you.
          </p>
        </div>
        <HeroIllustration Icon={Building2} size={96} className="hidden sm:block" />
        <HeroIllustration Icon={Building2} size={64} className="sm:hidden shrink-0" />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter fetched institutes by name, course, or address..."
            data-testid="colleges-search"
            className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-3 text-sm"
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

      <div className="mt-6 glass-card rounded-3xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <LocateFixed size={16} className="text-brand" />
          <p className="font-heading font-bold text-ink">Find Institutes Near Your Location</p>
        </div>
        <p className="text-xs text-muted2 mt-1">Search with a city or locality and discover institutes from Google Places.</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="e.g. Mumbai, Pune, Delhi NCR"
            className="flex-1 bg-white border border-line rounded-xl px-4 py-2.5 text-sm"
            data-testid="location-search-input"
          />
          <button
            onClick={handleLocationSearch}
            disabled={locationLoading}
            className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
            data-testid="location-search-button"
          >
            <Search size={14} /> {locationLoading ? "Searching..." : "Search Nearby"}
          </button>
        </div>
        {locationMessage && <p className="text-xs text-muted2 mt-2">{locationMessage}</p>}

        {locationLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <span className="w-4 h-4 border-2 border-brand-200 border-t-brand rounded-full animate-spin" />
              Searching institutes near {locationQuery.trim()}...
            </div>
            <div className="h-5 w-2/3 rounded skeleton-shimmer" />
            <div className="h-16 w-full rounded skeleton-shimmer" />
            <div className="h-16 w-full rounded skeleton-shimmer" />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink">Nearby Institutes</h3>
        {locationResults.length > 0 && (
          <p className="text-xs sm:text-sm font-semibold text-brand">
            {filteredResults.length} results
          </p>
        )}
      </div>

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

        {!locationLoading && filteredResults.map((institute) => <InstituteCard key={institute.id || institute.name} institute={institute} />)}

        {!locationLoading && locationResults.length === 0 && (
          <div className="bg-white border border-line rounded-3xl p-6 text-center">
            <p className="font-semibold text-ink">{locationMessage || "Search a city, area, or locality to load nearby institutes."}</p>
          </div>
        )}

        {!locationLoading && locationResults.length > 0 && filteredResults.length === 0 && (
          <div className="bg-white border border-line rounded-3xl p-6 text-center">
            <p className="font-semibold text-ink">No institutes match this filter. Try All or another category.</p>
          </div>
        )}
      </div>

      <div className="mt-5 glass-card rounded-3xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white border border-line text-brand flex items-center justify-center shrink-0">
          <Building2 size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm sm:text-base text-ink">Not sure which college is right for you?</p>
          <p className="text-xs text-muted2 mt-0.5">Get personalized recommendations from your profile and current results.</p>
        </div>
        <button
          onClick={handleRecommendation}
          disabled={recommendationLoading || !locationResults.length}
          className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full disabled:opacity-60"
          data-testid="get-recommendations-btn"
        >
          {recommendationLoading ? "Recommending..." : "Get Recommendations"} <ArrowRight size={14} />
        </button>
      </div>

      <BackToTopButton />
    </div>
  );
}
