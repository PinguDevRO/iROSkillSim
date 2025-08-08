import { useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Skill from "./skill";
import { JobSkillPositionModel } from "@/models/get-job-skill";
import { ap_skills } from "@/constants/skilllist";
import { useStore } from '@/store/useStore';


const MobileSkillTable = ({
    jobId,
    skillTreeData,
}: {
    jobId: number;
    skillTreeData: JobSkillPositionModel[];
}) => {
    const gameSkills = useStore((x) => x.gameSkills);
    const skillMap = new Map<number, JobSkillPositionModel>();
    skillTreeData.forEach(skill => skillMap.set(skill.skillPosition, skill));

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const didLongPressRef = useRef(false);

    const levelUpSkill = useStore((x) => x.level_up_skill);
    const levelDownSkill = useStore((x) => x.level_down_skill);

    const handleLongPress = () => {
        didLongPressRef.current = true;
    };

    const startPressTimer = (e: TouchEvent) => {
        e.preventDefault();
        didLongPressRef.current = false;
        timerRef.current = setTimeout(handleLongPress, 800);
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    const clearPressTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleTouchEndDown = (skillId: number, newLevel: number) => {
        clearPressTimer();
        if (didLongPressRef.current) {
            levelDownSkill(skillId, newLevel);
        }
    };

    const handleTouchEndUp = (skillId: number, newLevel: number) => {
        clearPressTimer();
        if (didLongPressRef.current) {
            levelUpSkill(skillId, newLevel);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={4}
        >
            {Array.from(skillMap.values()).map((skill, index) => {
                const currentSkill = gameSkills?.find((x) => x.skillId === skill.skillId);
                return (
                    <Box
                        key={index}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="start"
                        p={0}
                        m={0}
                        gap={3}
                        width="100%"
                        height={40}
                    >
                        {currentSkill ? (
                            <>
                                <Skill jobId={jobId} skillId={skill.skillId} skillName={currentSkill.skillName} skillDescription={currentSkill.skillDescription} hoverData={currentSkill.isHovered} canBeLeveled={currentSkill.canBeLeveled} />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                    justifyContent="start"
                                    width="75%"
                                >
                                    <Typography
                                        color="#828282"
                                        fontSize={12}
                                    >
                                        {currentSkill.skillName}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        width="100%"
                                    >
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
                                                onClick={() => levelDownSkill(currentSkill.skillId)}
                                                onTouchStart={startPressTimer}
                                                onTouchEnd={() => handleTouchEndDown(currentSkill.skillId, currentSkill.defaultLevel)}
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
                                                {currentSkill.defaultLevel > 0 ? `Lv: ${currentSkill.maxLevel}` : `Lv: ${currentSkill.currentLevel} / ${currentSkill.maxLevel}`}
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
                                                onClick={() => levelUpSkill(currentSkill.skillId)}
                                                onTouchStart={startPressTimer}
                                                onTouchEnd={() => handleTouchEndUp(currentSkill.skillId, currentSkill.maxLevel)}
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
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Typography
                                                sx={{
                                                    color: "#464746",
                                                    fontSize: 12,
                                                    fontFamily: 'Arial',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {currentSkill.sp.length > 0 && currentSkill.defaultLevel === 0 && currentSkill.currentLevel === 0 ? 'Lv Up' : currentSkill.sp.length > 0 && currentSkill.defaultLevel === 0 && currentSkill.sp[currentSkill.currentLevel - 1] > 0 && ap_skills.includes(currentSkill.skillId) ? `AP: ${currentSkill.sp[currentSkill.currentLevel - 1]}` : currentSkill.sp.length > 0 && currentSkill.defaultLevel === 0 && currentSkill.sp[currentSkill.currentLevel - 1] > 0 && !ap_skills.includes(currentSkill.skillId) ? `Sp: ${currentSkill.sp[currentSkill.currentLevel - 1]}` : currentSkill.sp.length > 0 && currentSkill.defaultLevel > 0 && currentSkill.sp[0] > 0 ? `Sp: ${currentSkill.sp[0]}` : 'Passive'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <></>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default MobileSkillTable;
