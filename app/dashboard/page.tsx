import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Item } from '@/types';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    'Pengguna';

  return (
    <DashboardClient
      items={(items as Item[]) || []}
      userEmail={user.email || ''}
      displayName={displayName}
    />
  );
}
