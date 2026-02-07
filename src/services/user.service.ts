import { BaseService, ServiceResponse } from './supabase/base.service';

export class UsersService extends BaseService<'users'> {
    constructor() {
        super('users');
    }

    async getWithAuth(): Promise<ServiceResponse<any[]>> {
        try {
            const { data, error, count } = await this.supabase
                .from('users')
                .select(`
                    *,
                    email,
                    organisation:organisations(*)
                `, { count: 'exact' });

            console.log(`[UsersService] Query returned ${data?.length} rows. Total count in DB (filtered by RLS): ${count}`);

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error: any) {
            console.error("UsersService.getWithAuth error:", error);
            return { data: [], error };
        }
    }
}

export class OrganisationsService extends BaseService<'organisations'> {
    constructor() {
        super('organisations');
    }
}

export class ApiClientsService extends BaseService<'api_clients'> {
    constructor() {
        super('api_clients');
    }
}

export const usersService = new UsersService();
export const organisationsService = new OrganisationsService();
export const apiClientsService = new ApiClientsService();
