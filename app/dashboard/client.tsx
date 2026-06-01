'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Item } from '@/types';
import {
  QrCode,
  Plus,
  Package,
  LogOut,
  Trash2,
  Eye,
  Calendar,
  Search,
  Box,
} from 'lucide-react';

interface Props {
  items: Item[];
  userEmail: string;
  displayName: string;
}

export default function DashboardClient({ items: initialItems, userEmail, displayName }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus barang ini? QR Code-nya tidak akan bisa diakses lagi.')) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('items').delete().eq('id', id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* Header */}
      <header
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: '1px solid var(--border-light)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 500,
            }}
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px' }}>
        {/* Greeting */}
        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            Halo, {displayName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {items.length === 0
              ? 'Belum ada barang. Tambah sekarang!'
              : `${items.length} barang terdaftar`}
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="animate-fade-up stagger-1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            className="card"
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={20} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1,
                }}
              >
                {items.length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Total Barang
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(34,197,94,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={20} color="var(--success)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1,
                }}
              >
                {items.length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                QR Aktif
              </div>
            </div>
          </div>
        </div>

        {/* Search + Add */}
        <div
          className="animate-fade-up stagger-2"
          style={{ display: 'flex', gap: 12, marginBottom: 20 }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <Search
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
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href="/item/new">
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '0 16px', height: 48 }}
            >
              <Plus size={18} />
              <span style={{ display: 'none' }}>Tambah</span>
            </button>
          </Link>
        </div>

        {/* Add button full width on mobile */}
        <Link href="/item/new" className="animate-fade-up stagger-2">
          <button className="btn-primary" style={{ marginBottom: 20 }}>
            <Plus size={18} />
            Tambah Barang Baru
          </button>
        </Link>

        {/* Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div
              className="card animate-fade-up stagger-3"
              style={{ padding: '48px 24px', textAlign: 'center' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: 'var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Box size={28} color="var(--accent)" />
              </div>
              <h3
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 8,
                }}
              >
                {search ? 'Tidak ditemukan' : 'Belum ada barang'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {search
                  ? 'Coba kata kunci lain'
                  : 'Klik "Tambah Barang" untuk mulai melacak asetmu'}
              </p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div
                key={item.id}
                className={`card animate-fade-up`}
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  animationDelay: `${i * 0.05}s`,
                  opacity: 0,
                  transition: 'background 0.2s',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--accent-glow)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Package size={20} color="var(--accent)" />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: 'var(--text)',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </div>
                  {item.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 4,
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Calendar size={10} />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link href={`/item/${item.id}`}>
                    <button
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'var(--accent-glow)',
                        border: '1px solid rgba(108,99,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--accent)',
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
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
                      opacity: deletingId === item.id ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
