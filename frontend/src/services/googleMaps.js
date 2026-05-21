import { api } from "../lib/api";

export const hasGoogleMapsFeatureFlag = () => Boolean(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

export async function findNearbyColleges(location, radiusKm = 15) {
  const { data } = await api.get(
    `/colleges/location-search?location=${encodeURIComponent(location)}&radius_km=${radiusKm}`
  );
  return data;
}

export async function getAiCollegeSuggestion(location, results) {
  const { data } = await api.post("/ai/colleges/suggest", { location, results });
  return data?.suggestion || "";
}
