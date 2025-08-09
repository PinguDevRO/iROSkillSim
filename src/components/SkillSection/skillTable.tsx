import { MouseEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Skill from "./skill";
import { SkillModel } from "@/models/get-job-skills";
import { useSkill } from "@/store/useSkill";


const SkillTable = ({
    jobId,
}: {
    jobId: number;
}) => {
    const gameData = useSkill((x) => x.gameData);
    const skillMap = new Map<number, SkillModel>();
    const jobSkillTree = gameData?.skillTree[jobId];
    if(jobSkillTree !== undefined){
        Object.values(jobSkillTree.skills).forEach(skill => skillMap.set(skill.skillPosition, skill));
    }

    const levelUpSkill = useSkill((x) => x.level_up_skill);
    const levelDownSkill = useSkill((x) => x.level_down_skill);

    const handleOnLevelUpSkill = (event: MouseEvent<HTMLButtonElement>, jobId: number, skill: SkillModel) => {
        if(event.ctrlKey && event.button === 0){
            levelUpSkill(jobId, skill.skillId, skill.maxLevel);
        }
        else {
            levelUpSkill(jobId, skill.skillId);
        }
    };

    const handleOnLevelDownSkill = (event: MouseEvent<HTMLButtonElement>, jobId: number, skill: SkillModel) => {
        if(event.ctrlKey && event.button === 0){
            levelDownSkill(jobId, skill.skillId, skill.defaultLevel);
        }
        else {
            levelDownSkill(jobId, skill.skillId);
        }
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(6, 1fr)"
            columnGap={3}
        >
            {Array.from({ length: 7 * 6 }).map((_, index) => {
                const skill = skillMap.get(index);
                return (
                    <Box
                        key={index}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        width={70}
                        height={70}
                    >
                        {skill ? (
                            <>
                                <Typography
                                    color="#828282"
                                    fontSize={12}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: 85,
                                    }}
                                >
                                    {skill.skillName}
                                </Typography>
                                <Skill jobId={jobId} skill={skill} />
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={0.5}
                                >
                                    <IconButton
                                        sx={{
                                            display: skill.defaultLevel > 0 ? 'none' : 'inline',
                                            p: 0,
                                            m: 0,
                                            width: 11,
                                            height: 11,
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        onClick={(e) => handleOnLevelDownSkill(e, jobId, skill)}
                                        onContextMenu={handleContextMenu}
                                    >
                                        <Image
                                            src={'/game_interface/arw_left.png'}
                                            alt={'Arrow Left'}
                                            width={11}
                                            height={11}
                                            draggable={false}
                                            loading="eager"
                                        />
                                    </IconButton>
                                    <Typography
                                        sx={{
                                            color: "#464746",
                                            fontSize: 12,
                                            fontFamily: 'Arial',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {skill.defaultLevel > 0 ? `${skill.maxLevel}` : `${skill.currentLevel} / ${skill.maxLevel}`}
                                    </Typography>
                                    <IconButton
                                        sx={{
                                            display: skill.defaultLevel > 0 ? 'none' : 'inline',
                                            p: 0,
                                            m: 0,
                                            width: 11,
                                            height: 11,
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        onClick={(e) => handleOnLevelUpSkill(e, jobId, skill)}
                                        onContextMenu={handleContextMenu}
                                    >
                                        <Image
                                            src={'/game_interface/arw_right.png'}
                                            alt={'Arrow Right'}
                                            width={11}
                                            height={11}
                                            draggable={false}
                                            loading="eager"
                                        />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <Box
                                key={index}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: 1,
                                    width: 30,
                                    height: 30,
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default SkillTable;
