import { AxiosGet, AxiosResponse } from "./utils";

export interface GetNeededSkillsResponse {
    job_id: number | null;
    skill_id: number;
    skill_level: number;
};

export interface GetSkillsResponse {
    skill_id: number;
    skill_code: string;
    skill_name: string;
    skill_description: string[];
    max_level: number;
    sp: number[];
    attack_range: number[];
    needed_skills: GetNeededSkillsResponse[];
};

const GetSkills = async (): Promise<GetSkillsResponse[] |  null> => {
    const url = process.env.NEXT_PUBLIC_IROWIKI_SKILL_METADATA_URL ? process.env.NEXT_PUBLIC_IROWIKI_SKILL_METADATA_URL : "";
    const response: AxiosResponse<GetSkillsResponse[] | null> = await AxiosGet(url);
    if(response.status === 200){
        return response.data;
    }
    return null;
};

export default GetSkills;
