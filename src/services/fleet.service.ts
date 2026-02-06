import { BaseService } from './supabase/base.service';

export class TrucksService extends BaseService<'trucks'> {
    constructor() {
        super('trucks');
    }
}

export class DriversService extends BaseService<'drivers'> {
    constructor() {
        super('drivers');
    }
}

export const trucksService = new TrucksService();
export const driversService = new DriversService();
