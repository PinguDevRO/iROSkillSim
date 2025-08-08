import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { job_list, JobListModel, getJobSkillChain, getSkills } from '@/constants/joblist';
import { JobSkillModel } from '@/models/get-job-skill';
import { SkillsModel } from '@/models/get-skills';
import { enqueueSnackbar } from 'notistack';


interface ShareModel {
    job_id: number;
    skills: { [key: number]: number }[];
};

const validateUsedPoint = (isRoMode: boolean, gameClass: JobListModel | null, skillChain: JobSkillModel[] | null, skills: SkillsModel[] | null): SkillsModel[] | null => {
    if (!isRoMode || !gameClass || !skillChain || !skills) return skills;

    const skillMap = new Map<number, SkillsModel>();
    for (const skill of skills) {
        skillMap.set(skill.skillId, skill);
    }

    const pointsPerJob: number[] = [];

    skillChain.forEach((job) => {
        let totalPoints = 0;

        for (const skill of job.skillTree) {
            const skillData = skillMap.get(skill.skillId);
            if (!skillData) continue;

            if (skillData.defaultLevel === 0) {
                totalPoints += skillData.currentLevel;
            }
        }
        pointsPerJob.push(totalPoints);
    });

    const requiredPoints = gameClass.skill_points;

    if (pointsPerJob.length !== requiredPoints.length) {
        return skills;
    }

    let resetFrom = 0;
    for (let i = 0; i < gameClass.skill_points.length; i++) {
        if (pointsPerJob[i] < requiredPoints[i]) {
            resetFrom = i;
            break;
        }
    }

    for (const sc of skillChain.slice(resetFrom)) {
        for (const sk of sc.skillTree) {
            const skillData = skillMap.get(sk.skillId);
            if (skillData && skillData.defaultLevel === 0) {
                const to_enable = { ...skillData };
                to_enable.canBeLeveled = true;
                skillMap.set(sk.skillId, to_enable);
            }
        }
    }

    for (const sc of skillChain.slice(resetFrom + 1, skillChain.length)) {
        for (const sk of sc.skillTree) {
            const skillData = skillMap.get(sk.skillId);
            if (skillData && skillData.defaultLevel === 0) {
                const to_reset = { ...skillData };
                to_reset.currentLevel = 0;
                to_reset.canBeLeveled = false;
                skillMap.set(sk.skillId, to_reset);
            }
        }
    }

    const skillArray: SkillsModel[] = Array.from(skillMap.values());

    return skillArray;
};

const validateSkills = (isRoMode: boolean, gameClass: JobListModel | null, jobList: number[], skills: SkillsModel[], skillId?: number, newLevel?: number): SkillsModel[] => {
    const skillMap = new Map<number, SkillsModel>();
    const dependencyMap = new Map<number, number[]>();

    for (const skill of skills) {
        skillMap.set(skill.skillId, { ...skill });
    }

    for (const skill of skills) {
        for (const req of skill.neededSkills) {
            if (!dependencyMap.has(req.skillId)) {
                dependencyMap.set(req.skillId, []);
            }
            dependencyMap.get(req.skillId)!.push(skill.skillId);
        }
    }

    const enforceRequirements = (skill: SkillsModel, visited = new Set<number>()) => {
        if (visited.has(skill.skillId)) return;
        visited.add(skill.skillId);

        for (const req of skill.neededSkills) {
            const required = skillMap.get(req.skillId);
            if (!required) continue;
            if (req.jobId !== null && !jobList.some((x) => x === req.jobId)) continue;

            if (required.currentLevel < req.skillLevel) {
                required.currentLevel = req.skillLevel;
                enforceRequirements(required, visited);
            }
        }
    };

    const invalidateDependents = (skillId: number, visited = new Set<number>()) => {
        if (visited.has(skillId)) return;
        visited.add(skillId);

        const dependents = dependencyMap.get(skillId) ?? [];
        for (const depId of dependents) {
            const dependent = skillMap.get(depId);
            if (!dependent || dependent.currentLevel === 0) continue;

            const stillValid = dependent.neededSkills.every(req => {
                if(req.jobId !== null && !jobList.some((x) => x === req.jobId)){
                    return true;
                }

                const reqSkill = skillMap.get(req.skillId);
                return reqSkill && reqSkill.currentLevel >= req.skillLevel;
            });

            if (!stillValid) {
                dependent.currentLevel = 0;
                invalidateDependents(dependent.skillId, visited);
            }
        }
    };

    if (skillId !== undefined && newLevel !== undefined) {
        const changedSkill = skillMap.get(skillId);
        if (!changedSkill) return skills;

        changedSkill.currentLevel = newLevel;

        enforceRequirements(changedSkill);
        invalidateDependents(skillId);
    }
    else {
        for (const skill of skillMap.values()) {
            enforceRequirements(skill);
        }

        for (const skill of skillMap.values()) {
            invalidateDependents(skill.skillId);
        }
    }

    if (isRoMode && gameClass !== null) {
        const totalPoints = gameClass.skill_points.reduce((acc, curr) => acc + curr, 0);
        const currentPoints = skillMap.values().reduce((acc, curr) => { return curr.defaultLevel === 0 ? acc + curr.currentLevel : acc; }, 0);

        if (currentPoints > totalPoints) {
            return skills;
        }
    }

    return Array.from(skillMap.values());
};

const setHoverRecursive = (skillId: number, isHover: boolean, jobList: number[], gameSkills: SkillsModel[], visited = new Set<number>(), neededLevel?: number): void => {
    if (visited.has(skillId)) return;
    visited.add(skillId);

    const match = gameSkills.find((s) => s.skillId === skillId);
    if (!match) return;

    match.isHovered = {
        state: isHover,
        skillLevel: neededLevel !== undefined && isHover? neededLevel: 0,
    };

    for (const dep of match.neededSkills || []) {
        if(dep.jobId !== null && !jobList.some((x) => x === dep.jobId)){
            continue;
        }
        setHoverRecursive(dep.skillId, isHover, jobList, gameSkills, visited, dep.skillLevel);
    }
};

export type State = {
    _roMode: boolean;
    _showSkillDescription: boolean;
    _characterModal: boolean;
    _shareModal: boolean;
    _shareLink: string | null;
    gameClass: JobListModel | null;
    gameSkillChain: JobSkillModel[] | null;
    gameSkills: SkillsModel[] | null;

    startup_check: () => void;
    set_game_class: (gameClass: JobListModel | null) => void;
    set_game_skill_chain: (gameSkillChain: JobSkillModel[] | null) => void;
    set_game_skills: (gameSkills: SkillsModel[] | null) => void;
    level_up_skill: (skillId: number, maxLevel?: number) => void;
    level_down_skill: (skillId: number, maxLevel?: number) => void;
    hover_skill_dependency: (skillId: number, isHover: boolean) => void;
    update_showSkillDescription: (_showSkillDescription: boolean) => void;
    update_ro_mode: (_roMode: boolean) => void;
    open_character_modal: () => void;
    close_character_modal: () => void;
    open_share_modal: () => void;
    close_share_modal: () => void;
    load_skill_build: (build: string, jobSkillData: JobSkillModel[] | undefined, skillsData: SkillsModel[] | undefined) => void;
    share_skill_build: () => void;
    reset_skills: () => void;
};

export const initialState = {
    _roMode: true,
    _showSkillDescription: false,
    _characterModal: true,
    _shareModal: false,
    _shareLink: null,
    gameClass: null,
    gameSkillChain: null,
    gameSkills: null,
};

export const useStore = create<State>()(
    persist(
        (set, get) => ({
            ...initialState,

            startup_check: () => {
                const roMode = get()._roMode;
                if (roMode) {
                    const gameClass = get().gameClass;
                    const gameSkillChain = get().gameSkillChain;
                    const gameSkills = get().gameSkills;
                    const finalSkills = validateUsedPoint(roMode, gameClass, gameSkillChain, gameSkills);
                    set({ gameSkills: finalSkills });
                }
                if (!roMode) {
                    const gameSkills = get().gameSkills;
                    if(gameSkills !== null) {
                        const newSkills = [...gameSkills];
                        for(const skill of newSkills){
                            skill.canBeLeveled = true;
                        }
                        set({ gameSkills: newSkills });
                    }
                }
            },
            set_game_class: (gameClass: JobListModel | null) => {
                set({ gameClass });
            },
            set_game_skill_chain: (gameSkillChain: JobSkillModel[] | null) => {
                set({ gameSkillChain });
            },
            set_game_skills: (gameSkills: SkillsModel[] | null) => {
                const roMode = get()._roMode;
                if (roMode) {
                    const gameClass = get().gameClass;
                    const gameSkillChain = get().gameSkillChain;
                    const finalSkills = validateUsedPoint(roMode, gameClass, gameSkillChain, gameSkills);
                    set({ gameSkills: finalSkills });
                }
                if (!roMode) {
                    if(gameSkills !== null) {
                        const newSkills = [...gameSkills];
                        for(const skill of newSkills){
                            skill.canBeLeveled = true;
                        }
                        set({ gameSkills: newSkills });
                    }
                    else {
                        set({ gameSkills });
                    }
                }
            },
            level_up_skill: (skillId: number, maxLevel?: number) => {
                const gameClass = get().gameClass;
                const gameSkillChain = get().gameSkillChain;
                const gameSkills = get().gameSkills;
                const isRoMode = get()._roMode;

                if (gameSkills === null) return;

                const jobList = gameSkillChain !== null ? gameSkillChain.map((x) => x.jobId) : [];
                const idx = gameSkills.findIndex((x) => x.skillId === skillId);
                if (idx >= 0) {
                    const newGameSkills = [...gameSkills];
                    if (newGameSkills[idx].currentLevel < newGameSkills[idx].maxLevel) {
                        const updatedLevel = maxLevel !== undefined && maxLevel === newGameSkills[idx].maxLevel ? maxLevel : newGameSkills[idx].currentLevel + 1;
                        const updatedSkills = validateSkills(isRoMode, gameClass, jobList, newGameSkills, skillId, updatedLevel);
                        const finalSkills = validateUsedPoint(isRoMode, gameClass, gameSkillChain, updatedSkills);
                        set({ gameSkills: finalSkills });
                    }
                }
            },
            level_down_skill: (skillId: number, minLevel?: number) => {
                const gameClass = get().gameClass;
                const gameSkillChain = get().gameSkillChain;
                const gameSkills = get().gameSkills;
                const isRoMode = get()._roMode;

                if (gameSkills === null) return;

                const jobList = gameSkillChain !== null ? gameSkillChain.map((x) => x.jobId) : [];
                const idx = gameSkills.findIndex((x) => x.skillId === skillId);
                if (idx >= 0) {
                    const newGameSkills = [...gameSkills];
                    if (newGameSkills[idx].currentLevel > 0) {
                        const updatedLevel = minLevel !== undefined && newGameSkills[idx].defaultLevel === minLevel ? minLevel : newGameSkills[idx].currentLevel - 1;
                        const updatedSkills = validateSkills(isRoMode, gameClass, jobList, newGameSkills, skillId, updatedLevel);
                        const finalSkills = validateUsedPoint(isRoMode, gameClass, gameSkillChain, updatedSkills);
                        set({ gameSkills: finalSkills });
                    }
                }
            },
            hover_skill_dependency: (skillId: number, isHover: boolean) => {
                const gameSkillChain = get().gameSkillChain;
                const gameSkills = get().gameSkills;
                if (gameSkills === null) return;

                const jobList = gameSkillChain !== null ? gameSkillChain.map((x) => x.jobId) : [];
                setHoverRecursive(skillId, isHover, jobList, gameSkills);
                set({ gameSkills: [...gameSkills] });
            },
            update_showSkillDescription: (_showSkillDescription: boolean) => {
                set({ _showSkillDescription });
            },
            update_ro_mode: (_roMode: boolean) => {
                if (_roMode) {
                    const gameClass = get().gameClass;
                    const gameSkillChain = get().gameSkillChain;
                    const gameSkills = get().gameSkills;
                    const finalSkills = validateUsedPoint(_roMode, gameClass, gameSkillChain, gameSkills);
                    set({ gameSkills: finalSkills });
                }
                if (!_roMode) {
                    const gameSkills = get().gameSkills;
                    if(gameSkills !== null) {
                        const newSkills = [...gameSkills];
                        for(const skill of newSkills){
                            skill.canBeLeveled = true;
                        }
                        set({ gameSkills: newSkills });
                    }
                }
                set({ _roMode });
            },
            open_character_modal: () => {
                set({ _characterModal: true });
            },
            close_character_modal: () => {
                set({ _characterModal: false });
            },
            open_share_modal: () => {
                get().share_skill_build();
                set({ _shareModal: true });
            },
            close_share_modal: () => {
                set({ _shareLink: null });
                set({ _shareModal: false });
            },
            load_skill_build: (build: string, jobSkillData: JobSkillModel[] | undefined, skillsData: SkillsModel[] | undefined) => {
                try {
                    const jsonStr = atob(build);
                    const obj = JSON.parse(jsonStr);
                    if (
                        typeof obj === 'object' &&
                        obj !== null &&
                        typeof obj.job_id === 'number' &&
                        Array.isArray(obj.skills) &&
                        obj.skills.every((skill: { [s: string]: unknown; } | ArrayLike<unknown> | null) =>
                            typeof skill === 'object' &&
                            skill !== null &&
                            Object.entries(skill).every(
                                ([k, v]) => !isNaN(Number(k)) && typeof v === 'number'
                            )
                        ) &&
                        jobSkillData !== undefined &&
                        skillsData !== undefined
                    ) {
                        set({ _characterModal: false });
                        const loadedObject = obj as ShareModel;
                        const classSelect = job_list.find((x) => x.id === loadedObject.job_id);
                        const skillChain = getJobSkillChain(loadedObject.job_id, jobSkillData);
                        const skillList = getSkills(skillChain, skillsData);
                        get().set_game_class(classSelect !== undefined ? classSelect : null);
                        get().set_game_skill_chain(skillChain);

                        const gameClass = get().gameClass;
                        const isRoMode = get()._roMode;

                        if (skillList !== null) {
                            const jobList = skillChain !== null ? skillChain.map((x) => x.jobId) : [];
                            for (const skillMap of loadedObject.skills) {
                                for (const [strKey, value] of Object.entries(skillMap)) {
                                    const key = Number(strKey);
                                    const idx = skillList.findIndex((x) => x.skillId === key);
                                    if (idx >= 0) {
                                        skillList[idx].currentLevel = value;
                                    }
                                }
                            }
                            const validatedSkills = validateSkills(isRoMode, gameClass, jobList, skillList);
                            get().set_game_skills(validatedSkills);
                            enqueueSnackbar("Build loaded correctly!", { variant: "success" });
                            return;
                        }

                        get().set_game_skills(skillList);
                        enqueueSnackbar("Build loaded with errors!", { variant: "warning" });
                        return;
                    }
                } catch {
                    enqueueSnackbar("The shared URL is incorrect!", { variant: "error" });
                    return;
                }
            },
            share_skill_build: () => {
                const gameClass = get().gameClass;
                const gameSkills = get().gameSkills;
                if (gameClass !== null && gameSkills !== null) {
                    const skillList: { [key: number]: number }[] = [];
                    for (const sk of gameSkills) {
                        if (sk.currentLevel > 0) {
                            skillList.push({ [sk.skillId]: sk.currentLevel });
                        }
                    }
                    const output: ShareModel = {
                        job_id: gameClass.id,
                        skills: skillList,
                    }

                    const jsonString = JSON.stringify(output);
                    const base64String = btoa(jsonString);

                    set({ _shareLink: base64String });
                    return;
                }
                set({ _shareLink: null });
                return;
            },
            reset_skills: () => {
                const gameSkills = get().gameSkills;
                if(!gameSkills) return;

                const newSkills = [...gameSkills];
                for(const skill of newSkills){
                    if(skill.defaultLevel === 0){
                        skill.currentLevel = 0;
                    }
                }

                set({ gameSkills: newSkills });
            },
        }),
        {
            name: 'skill-storage',
        }
    )
);
