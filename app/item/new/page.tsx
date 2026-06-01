'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { QrCode, ArrowLeft, Package, FileText, CheckCircle, Download } from 'lucide-react';

export default function NewItemPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; qrDataUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const id = uuidv4();

      const { error: insertError } = await supabase.from('items').insert({
        id,
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
      });

      if (insertError) throw insertError;

      // Generate QR on client side using canvas
      const appUrl = window.location.origin;
      const scanUrl = `${appUrl}/scan/${id}`;

      // Dynamic import to avoid SSR issues
      const QRCode = (await import('qrcode')).default;
      const qrDataUrl = await QRCode.toDataURL(scanUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });

      setResult({ id, qrDataUrl });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `qrtrack-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = result.qrDataUrl;
    link.click();
  };

  if (result) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Link href="/dashboard">
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <ArrowLeft size={16} />
              </button>
            </Link>
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: 'var(--text)',
              }}
            >
              QR Code Siap!
            </span>
          </div>

          {/* Success card */}
          <div className="card animate-fade-up" style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <CheckCircle size={20} color="var(--success)" />
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--success)',
                }}
              >
                Barang berhasil ditambahkan
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              {name}
            </h2>
            {description && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                {description}
              </p>
            )}

            {/* QR Code */}
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 16,
                display: 'inline-block',
                margin: '8px auto 20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qrDataUrl}
                alt={`QR Code untuk ${name}`}
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </div>

            {/* ID */}
            <div
              style={{
                background: 'var(--bg)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 20,
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'var(--text-muted)',
                wordBreak: 'break-all',
              }}
            >
              ID: {result.id}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-primary" onClick={handleDownload}>
                <Download size={18} />
                Download QR Code
              </button>
              <Link href={`/item/${result.id}`} style={{ width: '100%' }}>
                <button className="btn-ghost">Lihat Detail Barang</button>
              </Link>
              <Link href="/dashboard" style={{ width: '100%' }}>
                <button className="btn-ghost">Kembali ke Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Link href="/dashboard">
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <ArrowLeft size={16} />
            </button>
          </Link>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 17,
              color: 'var(--text)',
            }}
          >
            Tambah Barang
          </span>
        </div>

        {/* Form */}
        <div className="card animate-fade-up" style={{ padding: '28px 24px' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            Isi data barang. QR Code akan otomatis di-generate setelah disimpan.
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                color: '#fca5a5',
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label">Nama Barang *</label>
              <div style={{ position: 'relative' }}>
                <Package
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="misal: Helm Full Face Merah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Deskripsi</label>
              <div style={{ position: 'relative' }}>
                <FileText
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: 16,
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <textarea
                  className="input"
                  style={{
                    paddingLeft: 42,
                    minHeight: 100,
                    resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                  placeholder="Kontak pemilik, ciri-ciri khusus, dll (opsional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                {description.length}/500
              </div>
            </div>

            {/* Preview hint */}
            <div
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <QrCode size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: 'var(--accent-light)', lineHeight: 1.4 }}>
                QR Code akan otomatis dibuat. Scan-nya bisa dilihat siapapun tanpa perlu login.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !name.trim()}
              style={{ marginTop: 4 }}
            >
              <QrCode size={18} />
              {loading ? 'Membuat QR...' : 'Simpan & Generate QR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
