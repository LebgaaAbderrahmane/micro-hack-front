import { BaseService } from './supabase/base.service';

export class BookingsService extends BaseService<'bookings'> {
    constructor() {
        super('bookings');
    }
}

export class ContainersService extends BaseService<'containers'> {
    constructor() {
        super('containers');
    }
}

export class ActiveSlotsService extends BaseService<'active_slots'> {
    constructor() {
        super('active_slots');
    }
}

export class SlotTemplatesService extends BaseService<'slot_templates'> {
    constructor() {
        super('slot_templates');
    }
}

export class SlotOverridesService extends BaseService<'slot_overrides'> {
    constructor() {
        super('slot_overrides');
    }
}

export class QrTokensService extends BaseService<'qr_tokens'> {
    constructor() {
        super('qr_tokens');
    }
}

export const bookingsService = new BookingsService();
export const containersService = new ContainersService();
export const activeSlotsService = new ActiveSlotsService();
export const slotTemplatesService = new SlotTemplatesService();
export const slotOverridesService = new SlotOverridesService();
export const qrTokensService = new QrTokensService();
