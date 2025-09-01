import { GetServerStatusResponse } from "@/services/server-status";
import { formatDate, convertUTCtoPDT } from "@/utils/date_utils";


export interface PlayerCountModel {
    id: number;
    name: string;
    count: number;
    createdAt: string;
    updatedAt: string;
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
    playerCounts: PlayerCountModel[];
    totalPlayerCount: number;
    scheduledMaintenance: ScheduledMaintenanceModel;
    lastUpdate: string;
    lastUpdateServerTime: string;
};

const ServerStatusToModel = (data: GetServerStatusResponse): ServerStatusModel => {
    const globalStatus: GlobalStatusModel[] = [
        {
            name: "Login",
            online: data.login.reduce((count, x) => count + (x.status ? 1 : 0), 0),
            offline: data.login.reduce((count, x) => count + (x.status ? 0 : 1), 0),
        },
        {
            name: "Char",
            online: data.char.reduce((count, x) => count + (x.status ? 1 : 0), 0),
            offline: data.char.reduce((count, x) => count + (x.status ? 0 : 1), 0),
        },
        {
            name: "Zone",
            online: data.map.reduce((count, x) => count + (x.status ? 1 : 0), 0),
            offline: data.map.reduce((count, x) => count + (x.status ? 0 : 1), 0),
        },
    ];

    const playerCounts: PlayerCountModel[] = [];
    let totalPlayerCount = 0;

    for(const serv of data.player_count){
        totalPlayerCount += serv.count;
        playerCounts.push({
            id: serv.id,
            name: serv.name,
            count: serv.count,
            createdAt: serv.created_at,
            updatedAt: serv.updated_at,
        });
    }

    const scheduledMaintenance: ScheduledMaintenanceModel = {
        start: data.latest_scheduled_maintenance.start,
        end: data.latest_scheduled_maintenance.end,
    };

    const output: ServerStatusModel = {
        globalStatus: globalStatus,
        playerCounts: playerCounts,
        totalPlayerCount: totalPlayerCount,
        scheduledMaintenance: scheduledMaintenance,
        lastUpdate: formatDate(data.last_update),
        lastUpdateServerTime: convertUTCtoPDT(data.last_update),
    };

    return output;
}

export default ServerStatusToModel;
