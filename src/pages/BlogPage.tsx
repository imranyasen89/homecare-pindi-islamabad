import { Card } from "@/components/ui/card";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
};

const posts: BlogPost[] = [
  {
    id: "home-injection-safety",
    title: "Home Injection Safety: What Patients Should Know",
    excerpt:
      "A quick checklist for safe injections at home, including hygiene, sharps disposal, and warning signs to watch for.",
    publishedAt: "2026-01-16",
    category: "Patient Safety",
  },
  {
    id: "iv-drip-aftercare",
    title: "IV Drip Aftercare: Hydration & Monitoring",
    excerpt:
      "Practical aftercare tips for IV therapy—when to rest, how to keep the site clean, and when to contact support.",
    publishedAt: "2026-01-16",
    category: "Aftercare",
  },
  {
    id: "wound-dressing-basics",
    title: "Wound Dressing Basics (At Home)",
    excerpt:
      "Learn the essentials of wound dressing at home: cleanliness, dressing changes, and red flags that need medical attention.",
    publishedAt: "2026-01-16",
    category: "Nursing Care",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Health Blog</h1>
          <p className="text-sm text-muted-foreground">
            Practical home-care guidance from our team—simple, safe, and easy to follow.
          </p>
        </header>

        <main className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{post.category}</span>
                <time className="text-xs text-muted-foreground" dateTime={post.publishedAt}>
                  {post.publishedAt}
                </time>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}
