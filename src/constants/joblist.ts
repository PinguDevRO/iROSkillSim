import { GameClass } from "@/store/useSkill";

export interface ClassListModel {
    id: GameClass;
    name: string;
    job_list: JobListModel[];
};

export interface JobListModel {
    id: number;
    name: string;
    skill_points: number[];
};

export interface JobSkillPointModel {
    woe: number;
    first_class: number;
    second_class: number;
    third_class: number;
    fourth_class: number;
    first_class_expanded_1: number;
    first_class_expanded_2: number;
    second_class_expanded_1: number;
    second_class_expanded_2: number;
    third_class_expanded_1: number;
    third_class_expanded_2: number;
    fourth_class_expanded_2: number;
    first_super_novice: number;
    second_super_novice: number;
    summoner: number;
};

export const job_skill_point: JobSkillPointModel = {
    woe: 49,
    first_class: 49,
    second_class: 69,
    third_class: 69,
    fourth_class: 54,
    first_class_expanded_1: 69,
    first_class_expanded_2: 49,
    second_class_expanded_1: 69,
    second_class_expanded_2: 49,
    third_class_expanded_1: 54,
    third_class_expanded_2: 69,
    fourth_class_expanded_2: 54,
    first_super_novice: 98,
    second_super_novice: 69,
    summoner: 59,
};

export const job_expanded_relation: { [key: number]: number } = {
    7: 4008,
    8: 4009,
    9: 4010,
    10: 4011,
    11: 4012,
    12: 4013,
    14: 4015,
    15: 4016,
    16: 4017,
    17: 4018,
    18: 4019,
    19: 4020,
    20: 4021,
};

export const job_names: { [key: number]: string } = {
    0: "Novice",
    1: "Swordman",
    2: "Magician",
    3: "Archer",
    4: "Acolyte",
    5: "Merchant",
    6: "Thief",
    7: "Knight",
    8: "Priest",
    9: "Wizard",
    10: "Blacksmith",
    11: "Hunter",
    12: "Assassin",
    14: "Crusader",
    15: "Monk",
    16: "Sage",
    17: "Rogue",
    18: "Biochemist",
    19: "Bard",
    20: "Dancer",
    23: "Super Novice",
    24: "Gunslinger",
    25: "Ninja",
    4008: "Lord Knight",
    4009: "High Priest",
    4010: "High Wizard",
    4011: "Whitesmith",
    4012: "Sniper",
    4013: "Assassin Cross",
    4015: "Paladin",
    4016: "Champion",
    4017: "Professor",
    4018: "Stalker",
    4019: "Creator",
    4020: "Minstrel",
    4021: "Gypsy",
    4046: "TaeKwon Kid",
    4047: "TaeKwon Master",
    4049: "Soul Linker",
    4054: "Rune Knight",
    4055: "Warlock",
    4056: "Ranger",
    4057: "Arch Bishop",
    4058: "Mechanic",
    4059: "Guillotine Cross",
    4066: "Royal Guard",
    4067: "Sorcerer",
    4068: "Maestro",
    4069: "Wanderer",
    4070: "Sura",
    4071: "Geneticist",
    4072: "Shadow Chaser",
    4190: "Super Novice Ex",
    4211: "Kagerou",
    4212: "Oboro",
    4215: "Rebellion",
    4218: "Summoner",
    4239: "Star Emperor",
    4240: "Soul Reaper",
    4252: "Dragon Knight",
    4253: "Meister",
    4254: "Shadow Cross",
    4255: "Arch Mage",
    4256: "Cardinal",
    4257: "Wind Hawk",
    4258: "Imperial Guard",
    4259: "Biolo",
    4260: "Abyss Chaser",
    4261: "Elemental Master",
    4262: "Inquisitor",
    4263: "Troubadour",
    4264: "Trouvere",
    4302: "Sky Emperor",
    4303: "Soul Ascetic",
    4304: "Shinkiro",
    4305: "Shiranui",
    4306: "Night Watch",
    4307: "Hyper Novice",
    4308: "Spirit Handler",
    10000: "WoE",
};

export const class_list: ClassListModel[] = [
    {
        id: "1" as GameClass,
        name: "First Class",
        job_list: [
            {
                id: 1,
                name: "Swordman",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 2,
                name: "Magician",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 3,
                name: "Archer",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 4,
                name: "Acolyte",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 5,
                name: "Merchant",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 6,
                name: "Thief",
                skill_points: [
                    job_skill_point.first_class,
                ],
            },
            {
                id: 23,
                name: "Super Novice",
                skill_points: [
                    job_skill_point.first_super_novice,
                ],
            },
            {
                id: 24,
                name: "Gunslinger",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                ],
            },
            {
                id: 25,
                name: "Ninja",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                ],
            },
            {
                id: 4046,
                name: "TaeKwon Kid",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                ],
            },
            {
                id: 4218,
                name: "Summoner",
                skill_points: [
                    job_skill_point.summoner,
                ],
            },
        ],
    },
    {
        id: "2" as GameClass,
        name: "Second Class",
        job_list: [
            {
                id: 7,
                name: "Lord Knight",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 8,
                name: "High Priest",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 9,
                name: "High Wizard",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 10,
                name: "Whitesmith",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 11,
                name: "Sniper",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 12,
                name: "Assassin Cross",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 14,
                name: "Paladin",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 15,
                name: "Champion",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 16,
                name: "Professor",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 17,
                name: "Stalker",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 18,
                name: "Creator",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 19,
                name: "Minstrel",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 20,
                name: "Gypsy",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                ],
            },
            {
                id: 4047,
                name: "TaeKwon Master",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                ],
            },
            {
                id: 4049,
                name: "Soul Linker",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                ],
            },
        ],
    },
    {
        id: "3" as GameClass,
        name: "Third Class",
        job_list: [
            {
                id: 4054,
                name: "Rune Knight",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4055,
                name: "Warlock",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4056,
                name: "Ranger",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4057,
                name: "Arch Bishop",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4058,
                name: "Mechanic",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4059,
                name: "Guillotine Cross",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4066,
                name: "Royal Guard",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4067,
                name: "Sorcerer",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4068,
                name: "Maestro",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4069,
                name: "Wanderer",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4070,
                name: "Sura",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4071,
                name: "Geneticist",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4072,
                name: "Shadow Chaser",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                ],
            },
            {
                id: 4239,
                name: "Star Emperor",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                    job_skill_point.third_class_expanded_2,
                ],
            },
            {
                id: 4240,
                name: "Soul Reaper",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                    job_skill_point.third_class_expanded_2,
                ],
            },
            {
                id: 4190,
                name: "Super Novice Ex",
                skill_points: [
                    job_skill_point.first_super_novice,
                    job_skill_point.second_super_novice,
                ],
            },
            {
                id: 4211,
                name: "Kagerou",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                ],
            },
            {
                id: 4212,
                name: "Oboro",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                ],
            },
            {
                id: 4215,
                name: "Rebellion",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                ],
            },
        ],
    },
    {
        id: "4" as GameClass,
        name: "Fourth Class",
        job_list: [
            {
                id: 4252,
                name: "Dragon Knight",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4258,
                name: "Imperial Guard",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4255,
                name: "Arch Mage",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4261,
                name: "Elemental Master",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4257,
                name: "Wind Hawk",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4263,
                name: "Troubadour",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4264,
                name: "Trouvere",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4256,
                name: "Cardinal",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4262,
                name: "Inquisitor",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4253,
                name: "Meister",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4259,
                name: "Biolo",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4254,
                name: "Shadow Cross",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4260,
                name: "Abyss Chaser",
                skill_points: [
                    job_skill_point.first_class,
                    job_skill_point.second_class,
                    job_skill_point.third_class,
                    job_skill_point.fourth_class,
                ],
            },
            {
                id: 4302,
                name: "Sky Emperor",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                    job_skill_point.third_class_expanded_2,
                    job_skill_point.fourth_class_expanded_2,
                ],
            },
            {
                id: 4303,
                name: "Soul Ascetic",
                skill_points: [
                    job_skill_point.first_class_expanded_2,
                    job_skill_point.second_class_expanded_2,
                    job_skill_point.third_class_expanded_2,
                    job_skill_point.fourth_class_expanded_2,
                ],
            },
            {
                id: 4304,
                name: "Shinkiro",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                    job_skill_point.third_class_expanded_1,
                ],
            },
            {
                id: 4305,
                name: "Shiranui",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                    job_skill_point.third_class_expanded_1,
                ],
            },
            {
                id: 4306,
                name: "Night Watch",
                skill_points: [
                    job_skill_point.first_class_expanded_1,
                    job_skill_point.second_class_expanded_1,
                    job_skill_point.third_class_expanded_1,
                ],
            },
            {
                id: 4307,
                name: "Hyper Novice",
                skill_points: [
                    job_skill_point.first_super_novice,
                    job_skill_point.second_super_novice,
                    job_skill_point.fourth_class_expanded_2,
                ],
            },
            {
                id: 4308,
                name: "Spirit Handler",
                skill_points: [
                    job_skill_point.summoner,
                    job_skill_point.fourth_class_expanded_2,
                ],
            },
        ],
    },
    {
        id: "5" as GameClass,
        name: "Special Class",
        job_list: [
            {
                id: 10000,
                name: "WoE",
                skill_points: [
                    job_skill_point.woe,
                ],
            },
        ],
    },
];

export const get_jobname_by_id = (id: number): string => {
    const expanded_job_id = get_expanded_job_id(id);
    const use_id = expanded_job_id === null ? id : expanded_job_id;
    for (const [strKey, value] of Object.entries(job_names)) {
        const key = Number(strKey);
        if (use_id === key) {
            return value;
        }
    };

    return 'Unknown';
};

export const get_total_skill_point_by_id = (id: number): number => {
    for(const classList of class_list){
        const foundJob = classList.job_list.find((x) => x.id === id);
        if (foundJob) {
            return foundJob.skill_points.reduce((acc, curr) => acc + curr, 0);
        }
    }
    return -1;
}

export const get_skill_points_by_id = (id: number, index?: number): number => {
    if (index !== undefined) {
        for(const classList of class_list){
            for (const job of classList.job_list) {
                if (job.id === id && job.skill_points.length > index) {
                    return job.skill_points[index];
                }
            }
        }
        return -1;
    }
    else {
        let total_points = 0;
        for(const classList of class_list){
            const job = classList.job_list.find((x) => x.id === id);
            if (job !== undefined) {
                for (const val of job.skill_points) {
                    total_points += val;
                }
                return total_points;
            }
            return total_points;
        }
        return -1;
    }
};

export const get_expanded_job_id = (id: number): number | null => {
    for (const [strKey, value] of Object.entries(job_expanded_relation)) {
        const key = Number(strKey);
        if (id === key) {
            return value;
        }
    };

    return null;
};
