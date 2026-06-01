export interface Item {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export type ItemInsert = Omit<Item, 'id' | 'created_at' | 'updated_at'>;
export type ItemUpdate = Partial<Omit<Item, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
