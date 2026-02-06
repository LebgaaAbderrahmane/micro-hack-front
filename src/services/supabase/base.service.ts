import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database.types';
import { PostgrestError } from '@supabase/supabase-js';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

export interface ServiceResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export class BaseService<T extends TableName> {
  protected supabase = createClient();
  
  constructor(protected table: T) {}

  async getAll(): Promise<ServiceResponse<Row<T>[]>> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*');
    return { data: data as Row<T>[], error };
  }

  async getById(id: string): Promise<ServiceResponse<Row<T>>> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Row<T>, error };
  }

  async create(payload: Insert<T>): Promise<ServiceResponse<Row<T>>> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload as any) // Type assertion needed due to complexity of Supabase types
      .select()
      .single();
    return { data: data as Row<T>, error };
  }

  async update(id: string, payload: Update<T>): Promise<ServiceResponse<Row<T>>> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(payload as any)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Row<T>, error };
  }

  async delete(id: string): Promise<ServiceResponse<null>> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    return { data: null, error };
  }
}
