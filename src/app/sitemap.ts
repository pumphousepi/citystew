// Static sitemap for key marketing pages
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export default async function sitemap() {
  const pages = [
    "",                 // home
    "events",
    "categories",
    "top-sellers",
    "family-events",
    "help-center",
    "contact",
    "privacy",
    "terms",
    "advertise",
  ];

  const now = new Date().toISOString();

  return pages.map((p) => ({
    url: `${SITE_URL}/${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1.0 : 0.7,
  }));
}
