import { MouseEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Skill from "./skill";
import { JobSkillPositionModel } from "@/models/get-job-skill";
import { useStore } from '@/store/useStore';
import { SkillsModel } from "@/models/get-skills";


const SkillTable = ({
    jobId,
    skillTreeData,
}: {
    jobId: number;
    skillTreeData: JobSkillPositionModel[];
}) => {
    const gameSkills = useStore((x) => x.gameSkills);
    const skillMap = new Map<number, JobSkillPositionModel>();
    skillTreeData.forEach(skill => skillMap.set(skill.skillPosition, skill));

    const levelUpSkill = useStore((x) => x.level_up_skill);
    const levelDownSkill = useStore((x) => x.level_down_skill);

    const handleOnLevelUpSkill = (event: MouseEvent<HTMLButtonElement>, skill: SkillsModel) => {
        if(event.ctrlKey && event.button === 0){
            levelUpSkill(skill.skillId, skill.maxLevel);
        }
        else {
            levelUpSkill(skill.skillId);
        }
    };

    const handleOnLevelDownSkill = (event: MouseEvent<HTMLButtonElement>, skill: SkillsModel) => {
        if(event.ctrlKey && event.button === 0){
            levelDownSkill(skill.skillId, skill.defaultLevel);
        }
        else {
            levelDownSkill(skill.skillId);
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
                const currentSkill = gameSkills?.find((x) => x.skillId === skill?.skillId);
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
                        {skill && currentSkill ? (
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
                                    {currentSkill.skillName}
                                </Typography>
                                <Skill jobId={jobId} skillId={skill.skillId} skillName={currentSkill.skillName} skillDescription={currentSkill.skillDescription} hoverData={currentSkill.isHovered} canBeLeveled={currentSkill.canBeLeveled} />
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={0.5}
                                >
                                    <IconButton
                                        sx={{
                                            display: currentSkill.defaultLevel > 0 ? 'none' : 'inline',
                                            p: 0,
                                            m: 0,
                                            width: 11,
                                            height: 11,
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        onClick={(e) => handleOnLevelDownSkill(e, currentSkill)}
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
                                        {currentSkill.defaultLevel > 0 ? `${currentSkill.maxLevel}` : `${currentSkill.currentLevel} / ${currentSkill.maxLevel}`}
                                    </Typography>
                                    <IconButton
                                        sx={{
                                            display: currentSkill.defaultLevel > 0 ? 'none' : 'inline',
                                            p: 0,
                                            m: 0,
                                            width: 11,
                                            height: 11,
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        onClick={(e) => handleOnLevelUpSkill(e, currentSkill)}
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
