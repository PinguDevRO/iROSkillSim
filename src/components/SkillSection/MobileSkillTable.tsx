import { useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Skill from "./skill";
import { SkillModel } from "@/models/get-job-skills";
import { useSkill } from "@/store/useSkill";


const MobileSkillTable = ({
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

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const didLongPressRef = useRef(false);

    const levelUpSkill = useSkill((x) => x.level_up_skill);
    const levelDownSkill = useSkill((x) => x.level_down_skill);

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

    const handleTouchEndDown = (jobId: number, skillId: number, newLevel: number) => {
        clearPressTimer();
        if (didLongPressRef.current) {
            levelDownSkill(jobId, skillId, newLevel);
        }
    };

    const handleTouchEndUp = (jobId: number, skillId: number, newLevel: number) => {
        clearPressTimer();
        if (didLongPressRef.current) {
            levelUpSkill(jobId, skillId, newLevel);
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
                        {skill ? (
                            <>
                                <Skill jobId={jobId} skill={skill} />
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
                                        {skill.skillName}
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
                                                onClick={() => levelDownSkill(jobId, skill.skillId)}
                                                onTouchStart={startPressTimer}
                                                onTouchEnd={() => handleTouchEndDown(jobId, skill.skillId, skill.defaultLevel)}
                                                onContextMenu={handleContextMenu}
                                                disabled={!skill.skillState.canBeLeveled}
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
                                                {skill.defaultLevel > 0 ? `Lv: ${skill.maxLevel}` : `Lv: ${skill.currentLevel} / ${skill.maxLevel}`}
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
                                                onClick={() => levelUpSkill(jobId, skill.skillId)}
                                                onTouchStart={startPressTimer}
                                                onTouchEnd={() => handleTouchEndUp(jobId, skill.skillId, skill.maxLevel)}
                                                onContextMenu={handleContextMenu}
                                                disabled={!skill.skillState.canBeLeveled}
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
                                                {skill.sp && skill.sp.length > 0 && skill.defaultLevel === 0 && skill.currentLevel === 0 ? 'Lv Up' : skill.ap && skill.sp && skill.sp.length > 0 && skill.defaultLevel === 0 && skill.sp[skill.currentLevel - 1] > 0 ? `Sp: ${skill.ap[skill.currentLevel - 1]}, Ap: ${skill.sp[skill.currentLevel - 1]}` : skill.sp && skill.sp.length > 0 && skill.defaultLevel === 0 && skill.sp[skill.currentLevel - 1] > 0 ? `Sp: ${skill.sp[skill.currentLevel - 1]}` : skill.sp && skill.sp.length > 0 && skill.defaultLevel > 0 && skill.sp[0] > 0 ? `Sp: ${skill.sp[0]}` : 'Passive'}
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
