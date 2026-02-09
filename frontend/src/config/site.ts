export const siteConfig = {
  name: "EpsteinRAG",
  description:
    "AI-powered search engine for the Jeffrey Epstein case files released by the U.S. Department of Justice. Search 44,886+ documents with natural language.",
  url: "https://epsteinrag.app",
  api: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
};
