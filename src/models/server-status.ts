import { GetServerStatusResponse } from "@/services/server-status";
import { formatDate, convertUTCtoPDT } from "@/utils/date_utils";

export interface StatusModel {
    name: string;
    ip: string;
    port: number;
    status: boolean;
};

export interface ServerCountModel {
    ip: string;
    port: number;
    count: number;
    updatedAt: string;
};

export interface ServerListStatusModel {
    chaos: StatusModel | StatusModel[];
    freya: StatusModel | StatusModel[];
    thor: StatusModel | StatusModel[];
}

export interface ServerListCountModel {
    total: number;
    chaos: ServerCountModel;
    freya: ServerCountModel;
    thor: ServerCountModel;
};

export interface ScheduledMaintenanceModel {
    start: string;
    end: string;
};

export interface GlobalStatusModel {
    name: string;
    offline: number;
    online: number;
};

export interface ServerStatusModel {
    globalStatus: GlobalStatusModel[];
    map: ServerListStatusModel;
    char: ServerListStatusModel;
    login: StatusModel;
    services: StatusModel[];
    playerCounts: ServerListCountModel;
    scheduledMaintenance: ScheduledMaintenanceModel;
    lastUpdate: string;
    lastUpdateServerTime: string;
};

const ServerStatusToModel = (data: GetServerStatusResponse): ServerStatusModel => {
    const globalStatus: GlobalStatusModel[] = [
        {
            name: "Login",
            online: data.login.status === 'online' ? 1 : 0,
            offline: data.login.status === 'offline' ? 1 : 0,
        },
        {
            name: "Char",
            online: data.char.chaos[0].status === 'online' ? 1 : 0,
            offline: data.char.chaos[0].status === 'offline' ? 1 : 0,
        },
        {
            name: "Zone",
            online: data.map.chaos.reduce((count, x) => count + (x.status === 'online' ? 1 : 0), 0),
            offline: data.map.chaos.reduce((count, x) => count + (x.status === 'offline' ? 1 : 0), 0),
        },
    ];

    const map: ServerListStatusModel = {
        chaos: data.map.chaos.map((x) => { return { 'name': x.name, 'ip': x.ip, 'port': x.port, 'status': x.status === 'offline' ? false : true } }),
        thor: data.map.thor.map((x) => { return { 'name': x.name, 'ip': x.ip, 'port': x.port, 'status': x.status === 'offline' ? false : true } }),
        freya: data.map.freya.map((x) => { return { 'name': x.name, 'ip': x.ip, 'port': x.port, 'status': x.status === 'offline' ? false : true } })
    };

    const char: ServerListStatusModel = {
        chaos: (({ name, ip, port, status }) => ({ name, ip, port, status: status !== 'offline' }))(data.char.chaos[0]),
        thor: (({ name, ip, port, status }) => ({ name, ip, port, status: status !== 'offline' }))(data.char.thor[0]),
        freya: (({ name, ip, port, status }) => ({ name, ip, port, status: status !== 'offline' }))(data.char.freya[0]),
    };

    const login: StatusModel = {
        name: data.login.name,
        ip: data.login.ip,
        port: data.login.port,
        status: data.login.status !== 'offline',
    };

    const services: StatusModel[] = data.services.HTTP.map((x) => { return { 'name': x.name, 'ip': x.ip, 'port': x.port, 'status': x.status !== 'offline' } });

    const playerCounts: ServerListCountModel = {
        total: data.player_count.chaos.count + data.player_count.freya.count + data.player_count.thor.count,
        chaos: (({ ip, port, count, updated_at }) => ({ ip, port, count, updatedAt: updated_at }))(data.player_count.chaos),
        thor: (({ ip, port, count, updated_at }) => ({ ip, port, count, updatedAt: updated_at }))(data.player_count.thor),
        freya: (({ ip, port, count, updated_at }) => ({ ip, port, count, updatedAt: updated_at }))(data.player_count.freya),
    };

    const scheduledMaintenance: ScheduledMaintenanceModel = {
        start: data.latest_scheduled_maintenance.start,
        end: data.latest_scheduled_maintenance.end,
    };

    const output: ServerStatusModel = {
        globalStatus: globalStatus,
        map: map,
        char: char,
        login: login,
        services: services,
        playerCounts: playerCounts,
        scheduledMaintenance: scheduledMaintenance,
        lastUpdate: formatDate(data.last_update),
        lastUpdateServerTime: convertUTCtoPDT(data.last_update),
    };

    return output;
}

export default ServerStatusToModel;
