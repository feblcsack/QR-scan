import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ItemDetailClient from './client';

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!item) notFound();

  return <ItemDetailClient item={item} />;
}
