import Link from 'next/link';
import { QrCode, Shield, Zap, Globe } from 'lucide-react';
import GradientBlinds from './components/GradientBlinds';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--bg, #09090b)', // Default ke zinc-950 ala shadcn
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Component Wrapper */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0,
          opacity: 0.4, // Dibikin agak transparan biar teks shadcn tetep kontras dan kebaca
          pointerEvents: 'none' 
        }}
      >
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={20}
          noise={0.5}
          blindCount={16}
          blindMinWidth={60}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
          color1="#FF9FFC"
          color2="#5227FF"
        />
      </div>

      {/* Content Container (Dinaikin z-index-nya biar di atas background) */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Nav */}
        <nav
          style={{
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border, #27272a)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--text, #fafafa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={16} style={{ color: 'var(--bg, #09090b)' }} />
            </div>
            <span
              style={{
                fontFamily: 'sans-serif',
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '-0.025em',
                color: 'var(--text, #fafafa)',
              }}
            >
              Siecan
            </span>
          </div>
          <Link href="/auth/login">
            <button 
              style={{ 
                background: 'transparent',
                border: '1px solid var(--border, #27272a)',
                color: 'var(--text, #fafafa)',
                padding: '6px 16px', 
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Masuk
            </button>
          </Link>
        </nav>

        {/* Hero Section */}
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
            gap: 28,
          }}
        >
          {/* Badge ala shadcn */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--border, #27272a)',
              border: '1px solid var(--border, #3f3f46)',
              borderRadius: 100,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-muted, #a1a1aa)',
            }}
          >
            <Zap size={12} />
            100% Gratis karena bayar server pake doa
          </div>

          {/* Title */}
          <h1
            className="animate-fade-up stagger-1"
            style={{
              fontFamily: 'sans-serif',
              fontSize: 'clamp(32px, 7vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.05em',
              color: 'var(--text, #fafafa)',
              maxWidth: 650,
            }}
          >
            Lacak Barang Sebelum 
            <br />
            <span style={{ color: 'var(--text-muted, #a1a1aa)' }}>Diakuin Milik Tetangga</span>
          </h1>

          {/* Description */}
          <p
            className="animate-fade-up stagger-2"
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: 'var(--text-muted, #a1a1aa)',
              maxWidth: 480,
            }}
          >
            Anunya tolong di-<i>scan</i>
          </p>

          {/* CTA Buttons - Shadcn Style */}
          <div
  className="animate-fade-up stagger-3"
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 280,
  }}
>
            <Link href="/auth/signup" style={{ width: '100%' }}>
              <button 
                style={{
                  width: '100%',
                  background: 'var(--text, #fafafa)',
                  color: 'var(--bg, #09090b)',
                  border: 'none',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <QrCode size={16} />
                Daftar dulu!
              </button>
            </Link>
            
            <Link href="/auth/login" style={{ width: '100%' }}>
              <button 
                style={{
                  width: '100%',
                  background: 'black',
                  color: 'var(--text, #fafafa)',
                  border: '1px solid var(--border, #27272a)',
                  padding: '5px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Masuk
              </button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div
            className="animate-fade-up stagger-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            {[
              { icon: <Shield size={14} />, text: 'Type Safe' },
              { icon: <Zap size={14} />, text: 'Fast QR' },
              { icon: <Globe size={14} />, text: 'Scan dari mana aja' },
            ].map((f) => (
              <div
                key={f.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: '1px solid var(--border, #27272a)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 13,
                  color: 'var(--text-muted, #a1a1aa)',
                }}
              >
                <span style={{ color: 'var(--text, #fafafa)' }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '24px',
            textAlign: 'center',
            borderTop: '1px solid var(--border, #27272a)',
            color: 'var(--text-muted, #71717a)',
            fontSize: 12,
            backdropFilter: 'blur(8px)',
          }}
        >
          Siecan · Dibuat Sambil Nahan Nangis Modalin Server · Gratis Selamanya
        </footer>
      </div>
    </main>
  );
}