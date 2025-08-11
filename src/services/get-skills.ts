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
    skill_type: string | null;
    max_level: number;
    sp: number[] | null;
    ap: number[] | null;
    attack_range: number[];
    needed_skills: GetNeededSkillsResponse[];
};

const GetSkills = async (): Promise<GetSkillsResponse[] |  null> => {
    const url = process.env.NEXT_PUBLIC_IROWIKI_SKILL_METADATA_URL ? process.env.NEXT_PUBLIC_IROWIKI_SKILL_METADATA_URL : "";
    const response: AxiosResponse<GetSkillsResponse[] | null> = await AxiosGet(`${url}?cache_bust=${Date.now()}`);
    console.log(response.data);
    if(response.status === 200){
        return response.data;
    }
    return null;
};

export default GetSkills;
