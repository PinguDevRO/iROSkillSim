'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import JobSkillsToModel, { JobModel } from "@/models/get-job-skills";
import { useTheme, useMediaQuery } from '@mui/material';
import { useSkill } from "@/store/useSkill";

import GetSkills from "@/services/get-skills";
import GetJobSkill from "@/services/get-job-skill";

import MainScreen from "@/screens/MainScreen";

export interface EndpointStatus {
    loading: boolean;
    error: boolean;
};

export type EndpointName = "any" | "getJobSkills";

export interface Model {
    jobSkillsData: JobModel[] | undefined;
    lastUpdate: Date | undefined;
};

const MainController = () => {

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    const [model, setModel] = useState<Partial<Model>>();
    const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

    const load_build = useSkill((x) => x.load_skill_build);
    const close_character_modal = useSkill((x) => x.close_character_modal);
    const searchParams = useSearchParams();
    const build = searchParams.get('build');

    useEffect(() => {
        loadJobSkillsData();
    }, []);

    useEffect(() => {
        if(isXs){
            close_character_modal();
        }
    }, [isXs]);

    useEffect(() => {
        if (build !== null) {
            load_build(build, model?.jobSkillsData);
        }
    }, [build, model]);

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

    const loadJobSkillsData = async () => {
        const statusEndpoint = buildStatusEndpoint("getJobSkills");
        try {
            statusEndpoint.loading();
            const jobSkillResponse = await GetJobSkill();
            const skillResponse = await GetSkills();
            const jobSkillsData = JobSkillsToModel(jobSkillResponse, skillResponse);
            updateModel({ jobSkillsData });
        } catch {
            statusEndpoint.error();
            updateModel({ jobSkillsData: undefined });
        } finally {
            statusEndpoint.done();
        }
    };

    return (
        <MainScreen
            model={model}
            endpoints={endpoints}
        />
    );

};

export default MainController;
