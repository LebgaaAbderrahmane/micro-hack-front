import { BaseService, ServiceResponse } from './supabase/base.service';

export class UsersService extends BaseService<'users'> {
    constructor() {
        super('users');
    }

    async getWithAuth(): Promise<ServiceResponse<any[]>> {
        return this.getAll();
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
