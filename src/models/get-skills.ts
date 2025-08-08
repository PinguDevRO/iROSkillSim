import { GetSkillsResponse } from "@/services/get-skills";
import { get_default_skill_level } from "@/constants/skilllist";

export interface hoverModel {
    state: boolean;
    skillLevel: number;
}

export interface NeededSkillModel {
    jobId: number | null;
    skillId: number;
    skillLevel: number;
};

export interface SkillsModel {
    skillId: number;
    skillCode: string;
    skillName: string;
    skillDescription: string[];
    defaultLevel: number;
    currentLevel: number;
    maxLevel: number;
    sp: number[];
    attackRange: number[];
    neededSkills: NeededSkillModel[];
    isHovered: hoverModel;
    canBeLeveled: boolean;
};

const SkillsToModel = (data: GetSkillsResponse[] | null | undefined): SkillsModel[] => {
    const output: SkillsModel[] = [];
    if (data !== undefined && data !== null) {
        for (const val of data) {
            const neededSkill: NeededSkillModel[] = [];
            for (const x of val.needed_skills) {
                neededSkill.push({
                    jobId: x.job_id,
                    skillId: x.skill_id,
                    skillLevel: x.skill_level,
                });
            }

            const defaultLevel = get_default_skill_level(val.skill_id);
            output.push({
                skillId: val.skill_id,
                skillCode: val.skill_code,
                skillName: val.skill_name,
                skillDescription: val.skill_description,
                defaultLevel: defaultLevel !== null ? defaultLevel : 0,
                currentLevel: defaultLevel !== null ? defaultLevel : 0,
                maxLevel: val.max_level,
                sp: val.sp,
                attackRange: val.attack_range,
                neededSkills: neededSkill,
                isHovered: {
                    state: false,
                    skillLevel: 0,
                },
                canBeLeveled: false,
            });
        }
    }

    return output;
};

export default SkillsToModel;
