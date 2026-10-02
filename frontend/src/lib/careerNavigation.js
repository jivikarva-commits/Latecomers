import { api } from "./api";

// Resolving a title hits the API before navigating, so impatient double-clicks
// used to fire two lookups and two navigations. Ignore clicks while one is in flight.
let inFlight = false;

export async function openCareerReportByTitle(title, navigate) {
  const cleanTitle = String(title || "").trim();
  if (!cleanTitle || inFlight) return;
  inFlight = true;
  document.body.style.cursor = "progress";
  try {
    const { data } = await api.post("/careers/generate", { title: cleanTitle });
    if (data?.slug) {
      navigate(`/careers/${data.slug}`);
      return;
    }
  } catch (_) {
    // Fall back to public search if this title is not in the approved catalog.
  } finally {
    inFlight = false;
    document.body.style.cursor = "";
  }
  navigate(`/careers-explore?search=${encodeURIComponent(cleanTitle)}`);
}
