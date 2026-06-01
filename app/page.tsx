import Link from 'next/link';
import { QrCode, Shield, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCode size={18} color="white" />
          </div>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--text)',
            }}
          >
            QRTrack
          </span>
        </div>
        <Link href="/auth/login">
          <button className="btn-ghost" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>
            Masuk
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px',
          textAlign: 'center',
          gap: 24,
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--accent-glow)',
            border: '1px solid var(--accent)',
            borderRadius: 100,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--accent-light)',
            fontFamily: 'Syne, sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <Zap size={12} />
          100% Gratis · Open Source
        </div>

        {/* Title */}
        <h1
          className="animate-fade-up stagger-1"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 8vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--text)',
            maxWidth: 600,
            opacity: 0,
          }}
        >
          Lacak Barangmu
          <br />
          <span style={{ color: 'var(--accent)' }}>Pakai QR Code</span>
        </h1>

        <p
          className="animate-fade-up stagger-2"
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            maxWidth: 460,
            opacity: 0,
          }}
        >
          Daftar gratis, catat barangmu, dan generate QR Code instan.
          Tempel di helm, koper, atau laptop — siapapun bisa scan untuk tahu info pemiliknya.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up stagger-3"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
            maxWidth: 320,
            opacity: 0,
          }}
        >
          <Link href="/auth/signup" style={{ width: '100%' }}>
            <button className="btn-primary">
              <QrCode size={18} />
              Mulai Gratis Sekarang
            </button>
          </Link>
          <Link href="/auth/login" style={{ width: '100%' }}>
            <button className="btn-ghost">
              Sudah punya akun? Masuk
            </button>
          </Link>
        </div>

        {/* Feature pills */}
        <div
          className="animate-fade-up stagger-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginTop: 16,
            opacity: 0,
          }}
        >
          {[
            { icon: <Shield size={14} />, text: 'Data Aman dengan RLS' },
            { icon: <Zap size={14} />, text: 'QR Instan' },
            { icon: <Globe size={14} />, text: 'Scan Tanpa Login' },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                padding: '8px 14px',
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        QRTrack · Dibuat dengan ❤️ · Gratis Selamanya
      </footer>
    </main>
  );
}
