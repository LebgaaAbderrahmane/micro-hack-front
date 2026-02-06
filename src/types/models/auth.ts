import { Database } from '../database.types';

export type User = Database['public']['Tables']['users']['Row'];
export type Organisation = Database['public']['Tables']['organisations']['Row'];
export type ApiClient = Database['public']['Tables']['api_clients']['Row'];

export type UserRole = Database['public']['Enums']['user_role_enum'];
export type OrganisationType = Database['public']['Enums']['organisation_type_enum'];
