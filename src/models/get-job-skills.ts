import { GetJobSkillResponse } from "@/services/get-job-skill";
import { GetSkillsResponse } from "@/services/get-skills";
import { job_list, get_jobname_by_id, get_total_skill_point_by_id, get_skill_points_by_id, get_expanded_job_id } from "@/constants/joblist";
import { get_default_skill_level } from "@/constants/skilllist";

export interface SkillStateModel {
    state: boolean;
    skillLevel: number;
    canBeLeveled: boolean;
};

export interface NeededSkillModel {
    jobId: number | null;
    skillId: number;
    skillLevel: number;
};

export interface SkillModel {
    skillId: number;
    skillCode: string;
    skillName: string;
    skillDescription: string[];
    skillType: string | null;
    skillPosition: number;
    defaultLevel: number;
    currentLevel: number;
    maxLevel: number;
    sp: number[] | null;
    ap: number[] | null;
    attackRange: number[];
    neededSkills: NeededSkillModel[];
    skillState: SkillStateModel;
};

export interface SkillTreeModel {
    jobId: number;
    jobName: string;
    skills: { [key: number]: SkillModel };
    skillPoints: number;
    usedSkillPoints: number;
};

export interface JobModel {
    jobId: number;
    skillTree: { [key: number]: SkillTreeModel };
    skillPoints: number;
    usedSkillPoints: number;
};

const getJobHierarchy = (jobData: GetJobSkillResponse[], job_id: number): number[][] => {
    const jobMap = new Map(jobData.map(job => [job.job_id, job]));
    const flatHistory: number[] = [];
    flatHistory.push(job_id);

    let current = jobMap.get(job_id);

    while (current && current.previous_job_id !== null) {
        flatHistory.push(current.previous_job_id);
        current = jobMap.get(current.previous_job_id);
    }

    const mergedHistory: number[][] = [];
    let i = 0;
    while (i < flatHistory.length) {
        if (i < flatHistory.length - 1 && flatHistory[i + 1] === 0) {
            mergedHistory.push([flatHistory[i], 0]);
            i += 2;
        } else {
            mergedHistory.push([flatHistory[i]]);
            i++;
        }
    }

    return mergedHistory;
};

const JobSkillsToModel = (jobData: GetJobSkillResponse[] | null | undefined, skillData: GetSkillsResponse[] | null | undefined): JobModel[] => {
    const output: JobModel[] = [];
    if (!jobData || !skillData) return output;

    const previousJobs: { [key: number]: number[][] } = {};

    for (const job of job_list) {
        previousJobs[job.id] = getJobHierarchy(jobData, job.id);
    }

    for (const job of job_list) {
        const jobIdList = new Map<number, number>();
        const jobAmount = previousJobs[job.id].length;

        const newJob: JobModel = {
            jobId: job.id,
            skillTree: {},
            skillPoints: get_total_skill_point_by_id(job.id),
            usedSkillPoints: 0,
        };

        for (const [index, group] of previousJobs[job.id].entries()) {
            if(!jobIdList.has(group[0])) jobIdList.set(group[0], group[0]);

            const newSkillTree: SkillTreeModel = {
                jobId: group[0],
                jobName: get_jobname_by_id(group[0]),
                skills: {},
                skillPoints: get_skill_points_by_id(job.id, jobAmount - index - 1),
                usedSkillPoints: 0,
            };

            for (const jobHierarchyId of group) {
                const foundJob = jobData.find((x) => x.job_id === jobHierarchyId);
                if (!foundJob) continue;

                for (const skill of foundJob.skill_tree) {
                    const foundSkill = skillData.find((x) => x.skill_id === skill.skill_id);
                    if (!foundSkill) continue;

                    const neededSkills: NeededSkillModel[] = foundSkill.needed_skills.map((x) => ({
                        jobId: x.job_id,
                        skillId: x.skill_id,
                        skillLevel: x.skill_level,
                    }));

                    const defaultLevel = get_default_skill_level(foundSkill.skill_id);

                    const newSkill: SkillModel = {
                        skillId: foundSkill.skill_id,
                        skillCode: foundSkill.skill_code,
                        skillName: foundSkill.skill_name,
                        skillDescription: foundSkill.skill_description,
                        skillType: foundSkill.skill_type ?? null,
                        skillPosition: skill.skill_position,
                        defaultLevel: defaultLevel ?? 0,
                        currentLevel: defaultLevel ?? 0,
                        maxLevel: foundSkill.max_level,
                        sp: foundSkill.sp ?? null,
                        ap: foundSkill.ap ?? null,
                        attackRange: foundSkill.attack_range,
                        neededSkills,
                        skillState: {
                            state: false,
                            skillLevel: 0,
                            canBeLeveled: false,
                        },
                    };

                    newSkillTree.skills[skill.skill_id] = newSkill;
                }

                const expandedJob = get_expanded_job_id(jobHierarchyId);
                if (!expandedJob) continue;

                const foundExpandedJob = jobData.find((x) => x.job_id === expandedJob);
                if (!foundExpandedJob) continue;

                for (const skill of foundExpandedJob.skill_tree) {
                    const foundSkill = skillData.find((x) => x.skill_id === skill.skill_id);
                    if (!foundSkill) continue;

                    const neededSkills: NeededSkillModel[] = foundSkill.needed_skills.map((x) => ({
                        jobId: x.job_id,
                        skillId: x.skill_id,
                        skillLevel: x.skill_level,
                    }));

                    const defaultLevel = get_default_skill_level(foundSkill.skill_id);

                    const newSkill: SkillModel = {
                        skillId: foundSkill.skill_id,
                        skillCode: foundSkill.skill_code,
                        skillName: foundSkill.skill_name,
                        skillDescription: foundSkill.skill_description,
                        skillType: foundSkill.skill_type ?? null,
                        skillPosition: skill.skill_position,
                        defaultLevel: defaultLevel ?? 0,
                        currentLevel: defaultLevel ?? 0,
                        maxLevel: foundSkill.max_level,
                        sp: foundSkill.sp ?? null,
                        ap: foundSkill.ap ?? null,
                        attackRange: foundSkill.attack_range,
                        neededSkills,
                        skillState: {
                            state: false,
                            skillLevel: 0,
                            canBeLeveled: false,
                        },
                    };

                    newSkillTree.skills[skill.skill_id] = newSkill;
                }

                newSkillTree.jobId = expandedJob;
                jobIdList.set(expandedJob, expandedJob);
            }

            newJob.skillTree[group[0]] = newSkillTree;
        }

        const allSkillIds = new Set<number>();
        for (const skillTree of Object.values(newJob.skillTree)) {
            for (const skillIdStr in skillTree.skills) {
                allSkillIds.add(Number(skillIdStr));
            }
        }

        for (const skillTree of Object.values(newJob.skillTree)) {
            for (const skill of Object.values(skillTree.skills)) {
                let filtered = skill.neededSkills.filter((req) =>
                    allSkillIds.has(req.skillId) && (req.jobId === null || jobIdList.has(req.jobId))
                );

                const hasNonNullJobMatch = filtered.some(
                    (req) => req.jobId !== null && allSkillIds.has(req.skillId)
                );

                if (hasNonNullJobMatch) {
                    filtered = filtered.filter((req) => req.jobId !== null);
                }

                skill.neededSkills = filtered;
            }
        }

        output.push(newJob);
    }

    return output;
};

export default JobSkillsToModel;
