import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import SkillTable from './skillTable';
import MobileSkillTable from './MobileSkillTable';
import MobileClassSelect from '../ClassSelect/MobileClassSelect';
import { JobSkillModel, JobSkillPositionModel } from '@/models/get-job-skill';
import { SkillsModel } from '@/models/get-skills';
import { get_jobname_by_id, get_skill_points_by_id, getJobSkillChain, getSkills } from '@/constants/joblist';
import { useStore } from '@/store/useStore';


const SkillSection = ({
    jobSkill,
    skills,
}: {
    jobSkill: JobSkillModel[] | undefined;
    skills: SkillsModel[] | undefined;
}) => {

    const selectedJob = useStore((x) => x.gameClass);
    const gameSkillChain = useStore((x) => x.gameSkillChain);
    const gameSkills = useStore((x) => x.gameSkills);
    const setGameSkillChain = useStore((x) => x.set_game_skill_chain);
    const setSkills = useStore((x) => x.set_game_skills);

    useEffect(() => {
        if (selectedJob !== null) {
            const skillChain = getJobSkillChain(selectedJob.id, jobSkill);
            const skillList = getSkills(skillChain, skills);
            setGameSkillChain(skillChain);
            setSkills(skillList);
        }

    }, [selectedJob]);

    const get_used_points = (skillTree: JobSkillPositionModel[]): number => {
        let points = 0;
        if (gameSkills !== null) {
            for (const skill of skillTree) {
                const idx = gameSkills.findIndex((x) => x.skillId === skill.skillId);
                if (idx >= 0 && gameSkills[idx].defaultLevel === 0) {
                    points += gameSkills[idx].currentLevel;
                }
            }
        }

        return points;
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            flex={1}
        >
            <MobileClassSelect />
            {gameSkillChain !== null && selectedJob !== null ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        justifyItems: "center",
                        width: "100%",
                        gap: { xs: 2, md: 1 },
                    }}
                >
                    {gameSkillChain.map((x, idx) => (
                        <Paper
                            key={`skill-box-${idx}`}
                            elevation={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                width: '100%',
                                height: '100%',
                                padding: 2,
                                borderRadius: 2,
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flex: 1,
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    fontSize={22}
                                    fontWeight={700}
                                >
                                    {get_jobname_by_id(x.jobId)}
                                </Typography>
                                <Typography
                                    fontSize={16}
                                    fontWeight={700}
                                    sx={{
                                        color: get_used_points(x.skillTree) > get_skill_points_by_id(selectedJob.id, idx) ? 'red' : 'inherit',
                                    }}
                                >
                                    ({get_used_points(x.skillTree)}/{get_skill_points_by_id(selectedJob.id, idx)})
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'inline' },
                                }}
                            >
                                <SkillTable
                                    key={`skill-table-${idx}`}
                                    jobId={x.jobId}
                                    skillTreeData={x.skillTree}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: { xs: 'inline', md: 'none' },
                                }}
                            >
                                <MobileSkillTable
                                    key={`mobile-skill-table-${idx}`}
                                    jobId={x.jobId}
                                    skillTreeData={x.skillTree}
                                />
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        width: "100%",
                        gap: { xs: 2, md: 1 },
                        flex: 1,
                    }}
                >
                    <Paper
                        key={`empty-box-`}
                        elevation={3}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            padding: 2,
                            borderRadius: 2,
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            fontSize={16}
                            fontWeight={700}
                        >
                            Please select a class
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default SkillSection;
