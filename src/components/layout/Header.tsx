'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  
  // Don't show header on public submission pages
  if (pathname?.startsWith('/submit/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Strand Logistics
          </span>
        </Link>
        
        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>
            Dashboard
          </NavLink>
          <NavLink href="/session/new" active={pathname === '/session/new'}>
            New Session
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${active 
          ? 'bg-violet-600/20 text-violet-400' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }
      `}
    >
      {children}
    </Link>
  );
}
