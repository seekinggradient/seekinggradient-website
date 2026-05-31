import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[color:var(--color-rule)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex items-baseline justify-between gap-6">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="display text-2xl sm:text-3xl group-hover:text-[color:var(--color-accent)] transition-colors">
            Seeking <span className="display-italic">Gradient</span>
          </span>
          <span className="hidden sm:inline text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            Ideas Notebook
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <NavItem to="/">Index</NavItem>
          <NavItem to="/mockups">Mockups</NavItem>
          <NavItem to="/about">About</NavItem>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `link-underline pb-0.5 ${isActive ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]'}`
      }
    >
      {children}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-rule)] mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-[color:var(--color-ink-mute)]">
        <p>
          <span className="display-italic font-serif">Seeking Gradient</span> ·
          a working notebook, not a manifesto.
        </p>
        <p>
          <span className="font-mono text-xs">{`// `}</span>
          {new Date().getFullYear()} · Built with care.
        </p>
      </div>
    </footer>
  );
}
