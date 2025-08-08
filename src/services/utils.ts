import { stringify } from "qs";
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";

export interface AxiosResponse<T> {
    data: T;
    status: number;
};

export interface AxiosBlobResponse {
    blob: Blob;
};

export const saveOnSessionStorage = (key: string, value: unknown) => {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const deleteFromSessionStorage = (key: string) => {
    sessionStorage.removeItem(key);
};

export const getOnSessionStorage = (key: string) => {
    return JSON.parse(sessionStorage.getItem(key) as string) || null;
};

export const AxiosGet = async <T = unknown>(
    url: string,
    params: Record<string, unknown> = {}
): Promise<AxiosResponse<T>> => {
    const options = (): AxiosRequestConfig => {
        return {
            responseType: "json",
            headers: getHeaders(),
            params: stringify(params),
            validateStatus: () => true,
            timeout: 60000
        };
    };

    return await axios
    .get(url, options())
    .then((response) => {
        return {
            status: response.status,
            data: response.data,
        };
    })
    .catch((err) => {
        return {
            status: err.status,
            data: err.data,
        };
    });
};

export const AxiosPost = async <T = unknown>(
    url: string,
    body: Record<string, unknown> = {}
): Promise<AxiosResponse<T>> => {
    const options = (): AxiosRequestConfig => {
        return {
            headers: getHeaders(),
            validateStatus: () => true,
            timeout: 60000
        };
    };

    return await axios
    .post(url, body, options())
    .then((response) => {
        return {
            status: response.status,
            data: response.data,
        };
    })
    .catch((err) => {
        return {
            status: err.status,
            data: err.data,
        };
    });
};

export const AxiosImage = async (
    url: string,
    body: Record<string, unknown> = {}
): Promise<string | null> => {
    const options = (): AxiosRequestConfig => {
        return {
            headers: {
                "Content-Type": "application/vnd.api+json",
            },
            validateStatus: () => true,
            timeout: 60000,
            responseType: "blob",
        };
    };
    return await axios
    .post(url, body, options())
    .then((response) => {
        return response.data;
    })
    .then((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        return objectURL;
    })
    .catch(() => {
        return null;
    });
};

const getHeaders = (): Partial<RawAxiosRequestHeaders> => {
    return {
        "Content-Type": "application/json",
    }
};
