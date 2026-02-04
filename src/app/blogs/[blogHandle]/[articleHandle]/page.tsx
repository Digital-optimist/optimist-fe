import { getArticleByHandle, getArticles } from "@/lib/shopify";
import { notFound } from "next/navigation";
import BlogDetailPageClient from "./BlogDetailPageClient";

// =============================================================================
// Blog Detail Page - Static Export
// =============================================================================

// Generate static params for all articles at build time
export async function generateStaticParams() {
  try {
    // Fetch all articles to generate static paths
    const { articles } = await getArticles(100); // Fetch up to 100 articles

    return articles.map((article) => ({
      blogHandle: article.blog?.handle || "news",
      articleHandle: article.handle,
    }));
  } catch (error) {
    console.error("Error generating static params for blog articles:", error);
    return [];
  }
}

interface BlogDetailPageProps {
  params: Promise<{
    blogHandle: string;
    articleHandle: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { blogHandle, articleHandle } = await params;

  // Fetch article data at build time
  const article = await getArticleByHandle(blogHandle, articleHandle);

  // Show 404 if article not found
  if (!article) {
    notFound();
  }

  return <BlogDetailPageClient article={article} />;
}
