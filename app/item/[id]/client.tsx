'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Item } from '@/types';
import {
  ArrowLeft,
  QrCode,
  Package,
  Calendar,
  Download,
  Trash2,
  Share2,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface Props {
  item: Item;
}

export default function ItemDetailClient({ item }: Props) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || '');
  const [saving, setSaving] = useState(false);

  const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${item.id}`;

  useEffect(() => {
    const generate = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = `${window.location.origin}/scan/${item.id}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: { dark: '#0f172a', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(dataUrl);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [item.id]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrtrack-${item.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: item.name, url: scanUrl });
    } else {
      handleCopy();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus barang ini?')) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('items').delete().eq('id', item.id);
    router.push('/dashboard');
    router.refresh();
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('items')
      .update({ name: name.trim(), description: description.trim() || null })
      .eq('id', item.id);
    setSaving(false);
    setEditMode(false);
    router.refresh();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              Detail Barang
            </span>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--danger)',
              opacity: deleting ? 0.5 : 1,
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Item info card */}
        <div className="card animate-fade-up" style={{ padding: '24px', marginBottom: 16 }}>
          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Nama Barang</label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <textarea
                  className="input"
                  style={{ minHeight: 80, resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditMode(false);
                    setName(item.name);
                    setDescription(item.description || '');
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--accent-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Package size={22} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h1
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: 4,
                    }}
                  >
                    {name}
                  </h1>
                  {description && (
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  padding: '10px 0',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <Calendar size={12} />
                Ditambahkan {formatDate(item.created_at)}
              </div>

              <button
                onClick={() => setEditMode(true)}
                style={{
                  marginTop: 12,
                  background: 'none',
                  border: '1px solid var(--border-light)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 500,
                }}
              >
                Edit Info
              </button>
            </>
          )}
        </div>

        {/* QR Code card */}
        <div
          className="card animate-fade-up stagger-1"
          style={{ padding: '24px', marginBottom: 16, textAlign: 'center' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              justifyContent: 'center',
            }}
          >
            <QrCode size={16} color="var(--accent)" />
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              QR Code Barang
            </span>
          </div>

          {loading ? (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 12,
                background: 'var(--bg)',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: 13,
              }}
            >
              Generating QR...
            </div>
          ) : (
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 16,
                display: 'inline-block',
                margin: '0 auto 20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={`QR Code for ${item.name}`}
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </div>
          )}

          {/* Scan URL */}
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 12,
              color: 'var(--text-muted)',
              wordBreak: 'break-all',
              textAlign: 'left',
            }}
          >
            {scanUrl}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" onClick={handleDownload} disabled={!qrDataUrl}>
              <Download size={18} />
              Download QR Code
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-ghost"
                onClick={handleCopy}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {copied ? <CheckCircle size={16} color="var(--success)" /> : <Copy size={16} />}
                {copied ? 'Disalin!' : 'Salin Link'}
              </button>
              <button
                className="btn-ghost"
                onClick={handleShare}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Share2 size={16} />
                Bagikan
              </button>
            </div>
          </div>
        </div>

        {/* ID info */}
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
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>ID: </span>
          {item.id}
        </div>
      </div>
    </div>
  );
}
