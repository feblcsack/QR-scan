import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Package, Calendar, User, QrCode, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function ScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch item (public - no user check, RLS allows SELECT for all)
  const { data: item } = await supabase
    .from('items')
    .select('id, name, description, created_at, user_id')
    .eq('id', id)
    .single();

  if (!item) notFound();

  // Optionally get owner display name
  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', item.user_id)
    .single();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const ownerName = ownerProfile?.display_name || ownerProfile?.email?.split('@')[0] || 'Pengguna';

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 40,
        }}
      >
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
            fontSize: 17,
            color: 'var(--text)',
          }}
        >
          QRTrack
        </span>
      </div>

      {/* Main card */}
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Scan badge */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 100,
            padding: '8px 16px',
            marginBottom: 16,
            width: 'fit-content',
            margin: '0 auto 16px',
          }}
        >
          <ShieldCheck size={14} color="var(--success)" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--success)',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            QR Code Terverifikasi
          </span>
        </div>

        {/* Item card */}
        <div
          className="card animate-fade-up stagger-1"
          style={{ padding: '28px 24px', marginBottom: 16 }}
        >
          {/* Item icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'var(--accent-glow)',
              border: '1px solid rgba(108,99,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Package size={28} color="var(--accent)" />
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'Syne, sans-serif',
              marginBottom: 6,
            }}
          >
            Nama Barang
          </div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {item.name}
          </h1>

          {item.description && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'Syne, sans-serif',
                  marginBottom: 6,
                }}
              >
                Deskripsi
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--text)',
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {item.description}
              </p>
            </>
          )}

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Pemilik:{' '}
                <strong style={{ color: 'var(--text)' }}>{ownerName}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Didaftarkan: <strong style={{ color: 'var(--text)' }}>{formatDate(item.created_at)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ID */}
        <div
          className="animate-fade-up stagger-2"
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            marginBottom: 24,
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>ID: </span>
          {item.id}
        </div>

        {/* Footer CTA */}
        <div
          className="animate-fade-up stagger-3"
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Punya barang yang mau dilacak?
          </p>
          <Link href="/">
            <button className="btn-ghost" style={{ maxWidth: 280, margin: '0 auto' }}>
              Daftar QRTrack Gratis
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
