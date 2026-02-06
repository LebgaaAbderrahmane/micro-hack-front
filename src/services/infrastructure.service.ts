import { BaseService } from './supabase/base.service';

export class PortsService extends BaseService<'ports'> {
    constructor() {
        super('ports');
    }
}

export class TerminalsService extends BaseService<'terminals'> {
    constructor() {
        super('terminals');
    }
}

export class GatesService extends BaseService<'gates'> {
    constructor() {
        super('gates');
    }
}

export class GateLanesService extends BaseService<'gate_lanes'> {
    constructor() {
        super('gate_lanes');
    }
}

export class GateLogsService extends BaseService<'gate_logs'> {
    constructor() {
        super('gate_logs');
    }
}

export const portsService = new PortsService();
export const terminalsService = new TerminalsService();
export const gatesService = new GatesService();
export const gateLanesService = new GateLanesService();
export const gateLogsService = new GateLogsService();
