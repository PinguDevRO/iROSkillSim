"use client";

import { useEffect, useState } from "react";
import ServerStatusToModel, { ServerStatusModel } from "@/models/server-status";

import GetServerStatus from "@/services/server-status";

import AppBarMenu from "@/components/AppBarMenu/AppBarMenu";

export interface EndpointStatus {
    loading: boolean;
    error: boolean;
};

export type EndpointName = "getServerStatus" | "";

export interface Model {
    serverStatusData: ServerStatusModel | undefined;
    lastUpdate: Date | undefined;
};

const AppBarMenuController = () => {

    const [model, setModel] = useState<Partial<Model>>();
    const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

    useEffect(() => {
        refreshAllData();
        const interval = setInterval(() => {
            refreshAllData();
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const refreshAllData = async () => {
        await loadServerStatus();
    };

    const updateModel = (partialModel: | Partial<Model> | ((model: Partial<Model> | undefined) => Partial<Model>)) => {
        setModel((prev) => {
            const newModel = typeof partialModel === "function" ? partialModel(prev) : partialModel;
            return {
                ...prev,
                lastUpdate: new Date(),
                ...newModel,
            };
        });
    };

    const setEndpointStatus = (
        endpoint: EndpointName,
        status: Partial<EndpointStatus>
    ) => {
        setEndpoints((prev) => ({
            ...prev,
            [endpoint]: { ...prev?.[endpoint], ...status },
        }));
    };

    const buildStatusEndpoint = (name: EndpointName) => ({
        loading() {
            setEndpointStatus(name, {
                loading: true,
                error: false,
            });
        },
        error() {
            setEndpointStatus(name, {
                loading: false,
                error: true,
            });
        },
        done() {
            setEndpointStatus(name, { loading: false });
        },
    });

    const loadServerStatus = async () => {
        const statusEndpoint = buildStatusEndpoint("getServerStatus");
        try {
            statusEndpoint.loading();
            const response = await GetServerStatus();
            const serverStatusData = response !== null ? ServerStatusToModel(response) : undefined;
            updateModel({ serverStatusData });
        } catch {
            statusEndpoint.error();
            updateModel({ serverStatusData: undefined });
        } finally {
            statusEndpoint.done();
        }
    };

    return (
        <AppBarMenu
            model={model}
            endpoints={endpoints}
        />
    )
}

export default AppBarMenuController;
