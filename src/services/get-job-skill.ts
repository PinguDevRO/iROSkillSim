import { AxiosGet, AxiosResponse } from "./utils";

export interface GetJobSkillPositionResponse {
    skill_id: number;
    skill_position: number;
}
export interface GetJobSkillResponse {
    job_id: number;
    skill_tree: GetJobSkillPositionResponse[];
    previous_job_id: number | null;
}

const GetJobSkill = async (): Promise<GetJobSkillResponse[] |  null> => {
    const url = process.env.NEXT_PUBLIC_IROWIKI_JOB_METADATA_URL ? process.env.NEXT_PUBLIC_IROWIKI_JOB_METADATA_URL : "";
    const response: AxiosResponse<GetJobSkillResponse[] | null> = await AxiosGet(`${url}?cache_bust=${Date.now()}`);
    if(response.status === 200){
        return response.data;
    }
    return null;
};

export default GetJobSkill;
