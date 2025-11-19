import './globals.css';
import Link from 'next/link';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Trending X News',
  description: 'The latest viral trends from X',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <nav style={{
          borderBottom: '1px solid var(--card-border)',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 100
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TrendingX
            </Link>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/archive" className="nav-link">Archive</Link>
              <Link href="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>Admin</Link>
            </div>
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
