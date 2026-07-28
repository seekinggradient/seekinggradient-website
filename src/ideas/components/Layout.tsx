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
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <a
            href="/"
            aria-label="Seeking Gradient home"
            className="brand-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-orange)] text-[color:var(--color-ink)] font-serif italic text-[17px] transition-transform hover:-translate-y-0.5 hover:rotate-[-7deg]"
          >
            sg
          </a>
          <a href="/" className="group min-w-0">
            <span className="display block truncate text-[1.35rem] sm:text-[1.65rem] group-hover:text-[color:var(--color-accent)] transition-colors">
              Seeking <span className="display-italic">Gradient</span>
            </span>
          </a>
        </div>
        <nav className="hidden items-center gap-7 text-[13px] font-medium text-[color:var(--color-ink-soft)] md:flex">
          <a href="/essays" className="link-underline pb-0.5 hover:text-[color:var(--color-ink)]">Writing</a>
          <Link to="/" className="link-underline pb-0.5 text-[color:var(--color-accent)]">Projects</Link>
          <a href="/#about" className="link-underline pb-0.5 hover:text-[color:var(--color-ink)]">About</a>
          <a href="mailto:seekinggradient@gmail.com" className="nav-email bg-[color:var(--color-yellow)] px-3 py-1.5 text-[color:var(--color-ink)] transition-transform hover:-rotate-2">Email ↗</a>
        </nav>
        <details className="site-menu relative md:hidden">
          <summary className="eyebrow border border-[color:var(--color-rule)] px-3 py-2">Menu</summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] w-48 border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] p-2 shadow-[0_20px_50px_rgb(21_23_22/0.12)]">
            <a href="/essays" className="block px-3 py-2.5 text-sm hover:bg-[color:var(--color-paper-deep)]">Writing</a>
            <Link to="/" className="block px-3 py-2.5 text-sm text-[color:var(--color-accent)] hover:bg-[color:var(--color-paper-deep)]">Projects</Link>
            <a href="/#about" className="block px-3 py-2.5 text-sm hover:bg-[color:var(--color-paper-deep)]">About</a>
            <a href="mailto:seekinggradient@gmail.com" className="block px-3 py-2.5 text-sm hover:bg-[color:var(--color-paper-deep)]">Email</a>
          </div>
        </details>
      </div>
      <div className="border-t border-[color:var(--color-ink)]/10 bg-[color:var(--color-accent)] text-white">
        <div className="mx-auto flex min-h-11 max-w-7xl items-center justify-between gap-5 px-5 py-2 sm:px-8">
          <Link to="/" className="text-xs font-semibold text-white">Projects &amp; ideas</Link>
          <nav className="flex items-center gap-5 text-[12px] sm:gap-6">
            <NavItem to="/">Repository</NavItem>
            <NavItem to="/mockups">Mockups</NavItem>
            <NavItem to="/about">About</NavItem>
          </nav>
        </div>
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
        `link-underline pb-0.5 ${isActive ? 'text-[color:var(--color-yellow)]' : 'text-white/75 hover:text-white'}`
      }
    >
      {children}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-[color:var(--color-yellow)] text-[color:var(--color-ink)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 text-sm">
        <p>
          <span className="display block text-3xl">Seeking <span className="display-italic text-[color:var(--color-accent)]">Gradient</span></span>
          <span className="mt-3 block max-w-sm leading-relaxed opacity-75">A personal site for writing, projects, and things I’m learning by building.</span>
        </p>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap gap-5">
            <a href="/" className="link-underline pb-0.5">Home</a>
            <a href="/essays" className="link-underline pb-0.5">Writing</a>
            <a href="/tracking" className="link-underline pb-0.5">Tracking</a>
            <a href="mailto:seekinggradient@gmail.com" className="link-underline pb-0.5 text-[color:var(--color-accent)]">Email</a>
          </div>
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Seeking Gradient
          </p>
        </div>
      </div>
    </footer>
  );
}
