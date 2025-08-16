import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobModel, SkillModel, SkillTreeModel } from '@/models/get-job-skills';
import { enqueueSnackbar } from 'notistack';


interface ShareModel {
    job_id: number;
    ro_mode: boolean;
    skills: { [key: number]: number };
};

const encodeSharedURL = (model: ShareModel): string => {
    const bits: number[] = [];

    const pushBits = (value: number, length: number) => {
        for (let i = length - 1; i >= 0; i--) {
            bits.push((value >> i) & 1);
        }
    };

    pushBits(model.job_id, 14);

    pushBits(model.ro_mode ? 1 : 0, 1);

    for (const [keyStr, level] of Object.entries(model.skills)) {
        const key = parseInt(keyStr, 10);
        pushBits(key, 14);
        pushBits(level, 7);
    }

    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            if (i + j < bits.length) {
                byte = (byte << 1) | bits[i + j];
            } else {
                byte <<= 1;
            }
        }
        bytes.push(byte);
    }

    const binary = String.fromCharCode(...bytes);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decodeSharedURL = (encoded: string): ShareModel => {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    const bytes = binary.split('').map(c => c.charCodeAt(0));

    const bits: number[] = [];
    for (const byte of bytes) {
        for (let i = 7; i >= 0; i--) {
            bits.push((byte >> i) & 1);
        }
    }

    const readBits = (len: number) => {
        let val = 0;
        for (let i = 0; i < len; i++) {
            val = (val << 1) | bits.shift()!;
        }
        return val;
    };

    const job_id = readBits(14);
    const ro_mode = !!readBits(1);

    const skills: Record<number, number> = {};
    while (bits.length >= 21) {
        const key = readBits(14);
        const level = readBits(7);
        skills[key] = level;
    }

    return { job_id, ro_mode, skills };
};

const updateUsedSkillPoints = (gameData: JobModel): void => {
    gameData.usedSkillPoints = 0;
    for (const skillTree of Object.values(gameData.skillTree)) {
        skillTree.usedSkillPoints = 0;
        for (const skill of Object.values(skillTree.skills)) {
            if (skill.defaultLevel === 0) {
                skillTree.usedSkillPoints += skill.currentLevel;
            }
        }
        gameData.usedSkillPoints += skillTree.usedSkillPoints;
    }
};

const validateUsedPoint = (isRoMode: boolean, gameData: JobModel | null): JobModel | null => {
    if (!gameData) return gameData;
    updateUsedSkillPoints(gameData);

    const skillTrees = Object.values(gameData.skillTree);

    if (skillTrees.length === 0) return gameData;

    if (isRoMode) {
        let resetFrom = -1;
        let totalSkillPointAcc = 0;
        let usedSkillPointAcc = 0;
        for (let i = 0; i < skillTrees.length; i++) {
            totalSkillPointAcc += skillTrees[i].skillPoints;
            usedSkillPointAcc += skillTrees[i].usedSkillPoints;
            if (usedSkillPointAcc < totalSkillPointAcc) {
                resetFrom = i;
                break;
            }
        }
        if (resetFrom >= 0) {
            for (const skillTree of skillTrees.slice(resetFrom)) {
                for (const skill of Object.values(skillTree.skills)) {
                    if (skill.defaultLevel === 0 || skill.defaultLevel > 0) {
                        skill.skillState = { ...skill.skillState, canBeLeveled: true };
                    }
                }
            }

            if (resetFrom < (skillTrees.length - 1)) {
                for (const skillTree of skillTrees.slice(resetFrom + 1)) {
                    for (const skill of Object.values(skillTree.skills)) {
                        if (skill.defaultLevel === 0) {
                            skill.currentLevel = 0;
                            skill.skillState = { ...skill.skillState, canBeLeveled: false };
                        }
                    }
                }
            }
        }
    }
    else {
        for (const skillTree of skillTrees) {
            for (const skill of Object.values(skillTree.skills)) {
                if (skill.defaultLevel === 0 || skill.defaultLevel > 0) {
                    skill.skillState = { ...skill.skillState, canBeLeveled: true };
                }
            }
        }
    }

    updateUsedSkillPoints(gameData);
    return {
        ...gameData,
        skillTree: skillTrees.reduce<{ [key: number]: SkillTreeModel }>((acc, tree) => {
            acc[tree.jobId] = tree;
            return acc;
        }, {}),
    };
};

const validateSkills = (isRoMode: boolean, gameData: JobModel | null, skillId?: number, newLevel?: number): JobModel | null => {
    if (!gameData) return null;

    const skillMap = new Map<number, SkillModel>();
    const dependencyMap = new Map<number, number[]>();

    for (const st of Object.values(gameData.skillTree)) {
        for (const skill of Object.values(st.skills)) {
            skillMap.set(skill.skillId, { ...skill });
        }
    }

    for (const skill of skillMap.values()) {
        for (const req of skill.neededSkills) {
            if (!dependencyMap.has(req.skillId)) {
                dependencyMap.set(req.skillId, []);
            }
            dependencyMap.get(req.skillId)!.push(skill.skillId);
        }
    }

    const enforceRequirements = (skill: SkillModel, visited = new Set<number>()) => {
        if (visited.has(skill.skillId)) return;
        if (skill.currentLevel === 0 || skill.defaultLevel > 0) return;
        visited.add(skill.skillId);


        for (const req of skill.neededSkills) {
            const required = skillMap.get(req.skillId);
            if (!required) continue;

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
            if (!dependent || dependent.currentLevel === 0 || dependent.defaultLevel > 0) continue;

            const stillValid = dependent.neededSkills.every(req => {
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
        if (!changedSkill) return gameData;

        changedSkill.currentLevel = newLevel;

        enforceRequirements(changedSkill);
        invalidateDependents(skillId);
    } else {
        for (const skill of skillMap.values()) {
            enforceRequirements(skill);
        }
        for (const skill of skillMap.values()) {
            invalidateDependents(skill.skillId);
        }
    }

    const updatedSkillTree: { [jobId: number]: SkillTreeModel } = {};

    for (const [jobIdStr, skillTree] of Object.entries(gameData.skillTree)) {
        const jobId = Number(jobIdStr);
        const updatedSkills: { [skillId: number]: SkillModel } = {};

        for (const skillIdStr of Object.keys(skillTree.skills)) {
            const skillId = Number(skillIdStr);
            const updatedSkill = skillMap.get(skillId);
            if (updatedSkill) {
                updatedSkills[skillId] = updatedSkill;
            }
        }

        updatedSkillTree[jobId] = {
            ...skillTree,
            skills: updatedSkills,
        };
    }

    const defaultGameData = { ...gameData };
    const updatedGameData = { ...gameData, skillTree: updatedSkillTree };

    updateUsedSkillPoints(updatedGameData);
    if (isRoMode) {
        if (updatedGameData.usedSkillPoints > updatedGameData.skillPoints) {
            updateUsedSkillPoints(defaultGameData);
            return defaultGameData;
        }
    }

    return updatedGameData;
};

const setHoverRecursive = (skillId: number, isHover: boolean, gameData: JobModel, visited = new Set<number>(), neededLevel?: number): void => {
    let match: SkillModel | undefined;

    for (const skillTree of Object.values(gameData.skillTree)) {
        const skill = skillTree.skills[skillId];
        if (skill) {
            match = skill;
            break;
        }
    }

    if (!match) return;

    const currentLevel = match.skillState?.skillLevel ?? 0;
    const newLevel = neededLevel ?? 0;

    if (visited.has(skillId)) {
        if (isHover && newLevel > currentLevel) {
            match.skillState = {
                ...match.skillState,
                state: isHover,
                skillLevel: newLevel,
            };
        }
        return;
    }

    visited.add(skillId);

    match.skillState = {
        ...match.skillState,
        state: isHover,
        skillLevel: isHover ? Math.max(currentLevel, newLevel) : 0,
    };

    const jobIds = Object.keys(gameData.skillTree).map(Number);

    for (const dep of match.neededSkills || []) {
        if (dep.jobId !== null && !jobIds.includes(dep.jobId)) {
            continue;
        }
        setHoverRecursive(dep.skillId, isHover, gameData, visited, dep.skillLevel);
    }
};

export type State = {
    _roMode: boolean;
    _showSkillDescription: boolean;
    _characterModal: boolean;
    _shareModal: boolean;
    _shareLink: string | null;
    gameData: JobModel | null;

    set_game_data: (gameData: JobModel | null) => void;
    level_up_skill: (jobId: number, skillId: number, maxLevel?: number) => void;
    level_down_skill: (jobId: number, skillId: number, maxLevel?: number) => void;
    hover_skill_dependency: (skillId: number, isHover: boolean) => void;
    update_showSkillDescription: (_showSkillDescription: boolean) => void;
    set_ro_mode: (_roMode: boolean) => void;
    update_ro_mode: (_roMode: boolean) => void;
    open_character_modal: () => void;
    close_character_modal: () => void;
    open_share_modal: () => void;
    close_share_modal: () => void;
    load_skill_build: (build: string, jobData: JobModel[] | undefined) => void;
    share_skill_build: () => void;
    reset_skills: () => void;
};

export const initialState = {
    _roMode: false,
    _showSkillDescription: false,
    _characterModal: true,
    _shareModal: false,
    _shareLink: null,
    gameData: null,
};

export const useSkill = create<State>()(
    persist(
        (set, get) => ({
            ...initialState,

            set_game_data: (gameData: JobModel | null) => {
                const isRoMode = get()._roMode;
                const finalGameData = validateUsedPoint(isRoMode, gameData);
                set({ gameData: finalGameData });
            },
            level_up_skill: (jobId: number, skillId: number, maxLevel?: number) => {
                const gameData = get().gameData;
                const isRoMode = get()._roMode;

                if (gameData === null) return;

                const jobSkillTree = gameData.skillTree[jobId];
                if (jobSkillTree !== undefined) {
                    const skill = jobSkillTree.skills[skillId];
                    if (skill !== undefined) {
                        if (skill.currentLevel < skill.maxLevel) {
                            const updatedLevel = maxLevel !== undefined && maxLevel === skill.maxLevel ? maxLevel : skill.currentLevel + 1;
                            const updatedGameData = validateSkills(isRoMode, gameData, skillId, updatedLevel);
                            const finalGameData = validateUsedPoint(isRoMode, updatedGameData);
                            set({ gameData: finalGameData });
                        }
                    }
                }
            },
            level_down_skill: (jobId: number, skillId: number, minLevel?: number) => {
                const gameData = get().gameData;
                const isRoMode = get()._roMode;

                if (gameData === null) return;

                const jobSkillTree = gameData.skillTree[jobId];
                if (jobSkillTree !== undefined) {
                    const skill = jobSkillTree.skills[skillId];
                    if (skill !== undefined) {
                        if (skill.currentLevel > 0) {
                            const updatedLevel = minLevel !== undefined && minLevel === skill.defaultLevel ? minLevel : skill.currentLevel - 1;
                            const updatedGameData = validateSkills(isRoMode, gameData, skillId, updatedLevel);
                            const finalGameData = validateUsedPoint(isRoMode, updatedGameData);
                            set({ gameData: finalGameData });
                        }
                    }
                }
            },
            hover_skill_dependency: (skillId: number, isHover: boolean) => {
                const gameData = get().gameData;
                if (gameData === null) return;

                setHoverRecursive(skillId, isHover, gameData);
                set({ gameData: { ...gameData } });
            },
            update_showSkillDescription: (_showSkillDescription: boolean) => {
                set({ _showSkillDescription });
            },
            set_ro_mode: (_roMode: boolean) => {
                set({ _roMode });
            },
            update_ro_mode: (_roMode: boolean) => {
                if (_roMode) {
                    const gameData = get().gameData;
                    const finalGameData = validateUsedPoint(_roMode, gameData);
                    set({ gameData: finalGameData });
                }
                if (!_roMode) {
                    const gameData = get().gameData;
                    if (gameData !== null) {
                        const newGameData = { ...gameData };
                        for (const skillTree of Object.values(gameData.skillTree)) {
                            for (const skill of Object.values(skillTree.skills)) {
                                skill.skillState.canBeLeveled = true;
                            }
                        }
                        set({ gameData: newGameData });
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
            load_skill_build: (build: string, jobData: JobModel[] | undefined) => {
                try {
                    const loadedObject: ShareModel = decodeSharedURL(build);
                    set({ _characterModal: false });
                    const gameData = jobData?.find((x) => x.jobId === loadedObject.job_id);
                    const isRoMode = loadedObject.ro_mode;
                    get().set_ro_mode(isRoMode);

                    if (gameData) {
                        for (const skillTree of Object.values(gameData.skillTree)) {
                            for (const [skillId, skillLevel] of Object.entries(loadedObject.skills)) {
                                const numSkillId = Number(skillId);
                                const foundSkill = skillTree.skills[numSkillId];
                                if (foundSkill) {
                                    if (skillLevel > foundSkill.maxLevel || skillLevel < foundSkill.defaultLevel) {
                                        enqueueSnackbar("The shared URL is incorrect!", { variant: "error" });
                                        return;
                                    }
                                }
                            }
                        }

                        for (const skillTree of Object.values(gameData.skillTree)) {
                            for (const [skillId, skillLevel] of Object.entries(loadedObject.skills)) {
                                const numSkillId = Number(skillId);
                                const foundSkill = skillTree.skills[numSkillId];
                                if (foundSkill) {
                                    foundSkill.currentLevel = skillLevel;
                                }
                            }
                        }

                        const validatedGameData = validateSkills(isRoMode, gameData);
                        get().set_game_data(validatedGameData);
                        enqueueSnackbar("Build loaded correctly!", { variant: "success" });
                        return;
                    }

                    enqueueSnackbar("The shared URL is invalid!", { variant: "warning" });
                    return;
                } catch {
                    enqueueSnackbar("The shared URL is incorrect!", { variant: "error" });
                    return;
                }
            },
            share_skill_build: () => {
                const gameData = get().gameData;
                const isRoMode = get()._roMode;
                if (gameData !== null) {
                    const skillList: { [key: number]: number } = {};
                    for (const skillTree of Object.values(gameData.skillTree)) {
                        for (const skill of Object.values(skillTree.skills)) {
                            if (skill.currentLevel > 0 && skill.defaultLevel === 0) {
                                skillList[skill.skillId] = skill.currentLevel;
                            }
                        }
                    }
                    const output: ShareModel = {
                        job_id: gameData.jobId,
                        ro_mode: isRoMode,
                        skills: skillList,
                    };

                    const shareURL = encodeSharedURL(output);

                    set({ _shareLink: shareURL });
                    return;
                }
                set({ _shareLink: null });
                return;
            },
            reset_skills: () => {
                const gameData = get().gameData;
                const isRoMode = get()._roMode;
                if (!gameData) return;

                const newGameData = { ...gameData };
                newGameData.usedSkillPoints = 0;
                for (const skillTree of Object.values(gameData.skillTree)) {
                    for (const skill of Object.values(skillTree.skills)) {
                        if (skill.defaultLevel === 0) {
                            skill.currentLevel = 0;
                        }
                    }
                }

                const updatedGameData = validateUsedPoint(isRoMode, newGameData);
                set({ gameData: updatedGameData });
            },
        }),
        {
            name: 'skill-storage',
        }
    )
);
