import { api } from "./api";

export async function openCareerReportByTitle(title, navigate) {
  const cleanTitle = String(title || "").trim();
  if (!cleanTitle) return;
  try {
    const { data } = await api.post("/careers/generate", { title: cleanTitle });
    if (data?.slug) {
      navigate(`/careers/${data.slug}`);
      return;
    }
  } catch (_) {
    // Fall back to public search if this title is not in the approved catalog.
  }
  navigate(`/careers-explore?search=${encodeURIComponent(cleanTitle)}`);
}
