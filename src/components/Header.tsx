import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartPulse, Settings } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground leading-tight">HomeCare</h1>
            <p className="text-xs text-muted-foreground">Medical Services</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Patient View</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
