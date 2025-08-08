'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import SkillsToModel, { SkillsModel } from "@/models/get-skills";
import JobSkillToModel, { JobSkillModel } from "@/models/get-job-skill";
import { useTheme, useMediaQuery } from '@mui/material';
import { useStore } from "@/store/useStore";

import GetSkills from "@/services/get-skills";
import GetJobSkill from "@/services/get-job-skill";

import MainScreen from "@/screens/MainScreen";

export interface EndpointStatus {
    loading: boolean;
    error: boolean;
};

export type EndpointName = "getJobSkill" | "getSkills";

export interface Model {
    jobSkillData: JobSkillModel[] | undefined;
    skillsData: SkillsModel[] | undefined;
    lastUpdate: Date | undefined;
};

const MainController = () => {

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    const [model, setModel] = useState<Partial<Model>>();
    const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

    const load_build = useStore((x) => x.load_skill_build);
    const close_character_modal = useStore((x) => x.close_character_modal);
    const searchParams = useSearchParams();
    const build = searchParams.get('build');

    useEffect(() => {
        loadJobSkillData();
        loadSkillsData();
    }, []);

    useEffect(() => {
        if(isXs){
            close_character_modal();
        }
    }, [isXs]);

    useEffect(() => {
        if (build !== null) {
            load_build(build, model?.jobSkillData, model?.skillsData);
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

    const loadJobSkillData = async () => {
        const statusEndpoint = buildStatusEndpoint("getJobSkill");
        try {
            statusEndpoint.loading();
            const response = await GetJobSkill();
            const jobSkillData = response !== null ? JobSkillToModel(response) : undefined;
            updateModel({ jobSkillData });
        } catch {
            statusEndpoint.error();
            updateModel({ jobSkillData: undefined });
        } finally {
            statusEndpoint.done();
        }
    };

    const loadSkillsData = async () => {
        const statusEndpoint = buildStatusEndpoint("getSkills");
        try {
            statusEndpoint.loading();
            const response = await GetSkills();
            const skillsData = response !== null ? SkillsToModel(response) : undefined;
            updateModel({ skillsData });
        } catch {
            statusEndpoint.error();
            updateModel({ skillsData: undefined });
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
