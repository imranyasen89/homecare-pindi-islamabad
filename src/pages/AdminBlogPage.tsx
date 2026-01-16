import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminBlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <h1 className="text-xl font-bold text-foreground">Blog Manager</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage health blog content (structure ready).
          </p>
        </div>
      </div>

      <main className="container py-6 space-y-6">
        <Card className="p-5 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Create New Blog Post</h2>
          <p className="text-sm text-muted-foreground">
            Next step: connect this form to the backend so you can publish posts publicly.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled>
              Add Post (Coming soon)
            </Button>
            <Button size="sm" variant="outline" disabled>
              Edit Posts (Coming soon)
            </Button>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Published Posts</h2>
          <p className="text-sm text-muted-foreground">No posts in the backend yet.</p>
        </Card>
      </main>
    </div>
  );
}
