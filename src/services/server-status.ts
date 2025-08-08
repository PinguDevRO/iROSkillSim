import { AxiosGet, AxiosResponse } from "./utils";

export interface GetServerStatusResponse {
    map: ServerListResponse;
    char: ServerListResponse;
    login: StatusResponse;
    player_count: ServerListCountResponse;
    services: ServicesListResponse;
    iro_patch_status: PatchStatusResponse;
    wiki_patch_status: PatchStatusResponse;
    latest_patch_notes: PatchNotesResponse[];
    latest_news: NewsResponse[];
    latest_events: PatchNotesResponse[];
    latest_updates: PatchNotesResponse[];
    latest_scheduled_maintenance: ScheduledMaintenanceResponse;
    latest_calculator_update: CalculatorUpdateResponse;
    last_update: string;
};

export interface StatusResponse {
    name: string;
    ip: string;
    port: number;
    status: string;
    map_list?: string[];
};

export interface PlayerCountResponse {
    ip: string;
    port: number;
    count: number;
    updated_at: string;
};

export interface ServerListResponse {
    chaos: StatusResponse[];
    freya: StatusResponse[];
    thor: StatusResponse[];
};

export interface ServerListCountResponse {
    chaos: PlayerCountResponse;
    freya: PlayerCountResponse;
    thor: PlayerCountResponse;
};

export interface ServicesListResponse {
    HTTP: StatusResponse[];
};

export interface PatchStatusResponse {
    last_patch_update: string;
    current_patch_hash: number;
};

export interface PatchNotesResponse {
    title: string;
    hits: string;
    url: string;
    date: string;
};

export interface NewsResponse {
    title: string;
    url: string;
    date: string;
    start_time: string;
    end_time: string;
};

export interface ScheduledMaintenanceResponse {
    start: string;
    end: string;
};

export interface CalculatorUpdateResponse {
    etag: string;
    date: string;
};

const GetServerStatus = async (): Promise<GetServerStatusResponse |  null> => {
    const url = process.env.NEXT_PUBLIC_IROWIKI_SERVER_STATUS_URL ? process.env.NEXT_PUBLIC_IROWIKI_SERVER_STATUS_URL : "";
    const response: AxiosResponse<GetServerStatusResponse | null> = await AxiosGet(url);
    if(response.status === 200){
        return response.data;
    }
    return null;
};

export default GetServerStatus;
