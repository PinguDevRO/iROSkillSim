import { GetJobSkillResponse } from "@/services/get-job-skill";

export interface JobSkillPositionModel {
    skillId: number;
    skillPosition: number;
};

export interface JobSkillModel {
    jobId: number;
    skillTree: JobSkillPositionModel[];
    previousJobId: number | null;
};

const JobSkillToModel = (data: GetJobSkillResponse[] | null | undefined): JobSkillModel[] => {
    const output: JobSkillModel[] = [];
    if (data !== undefined && data !== null) {
        for (const val of data) {
            const skillPosition: JobSkillPositionModel[] = [];
            for (const x of val.skill_tree) {
                skillPosition.push({
                    skillId: x.skill_id,
                    skillPosition: x.skill_position,
                });
            }

            output.push({
                jobId: val.job_id,
                skillTree: skillPosition,
                previousJobId: val.previous_job_id,
            });
        }
    }

    return output;
};

export default JobSkillToModel;
