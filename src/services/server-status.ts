import { AxiosGet, AxiosResponse } from "./utils";

export interface GetServerStatusResponse {
    map: StatusResponse[];
    char: StatusResponse[];
    login: StatusResponse[];
    player_count: PlayerCountResponse[];
    services: StatusResponse[];
    iro_patch_status: PatchStatusResponse;
    wiki_patch_status: PatchStatusResponse;
    latest_patch_notes: PageResponse[];
    latest_news: PageResponse[];
    latest_events: PageResponse[];
    latest_updates: PageResponse[];
    latest_scheduled_maintenance: ScheduledMaintenanceResponse;
    latest_calculator_update: CalculatorUpdateResponse;
    last_update: string;
};

export interface StatusResponse {
    id: number;
    name: string;
    type: string;
    ip: string;
    port: number;
    status: boolean;
    created_at: string;
    updated_at: string;
};

export interface PlayerCountResponse {
    id: number;
    name: string;
    count: number;
    created_at: string;
    updated_at: string;
};

export interface PatchStatusResponse {
    id: number;
    patch_provider: string;
    patch_hash: number;
    patch_message: string | null;
    created_at: string;
    updated_at: string;
};

export interface PageResponse {
    id: number;
    page_type: string;
    page_title: string;
    page_url: string;
    page_date: string;
    created_at: string;
    updated_at: string;
};

export interface ScheduledMaintenanceResponse {
    start: string;
    end: string;
};

export interface CalculatorUpdateResponse {
    id: number;
    etag: string;
    update_message: string;
    created_at: string;
    updated_at: string;
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
