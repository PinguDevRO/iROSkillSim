import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import SkillTable from './skillTable';
import MobileSkillTable from './MobileSkillTable';
import MobileClassSelect from '../ClassSelect/MobileClassSelect';
import { useTheme, useMediaQuery } from "@mui/material";
import { JobModel, SkillTreeModel } from '@/models/get-job-skills';
import { useSkill, getOverusedSkillData, OverusedModel } from '@/store/useSkill';


const SkillSection = ({
    jobData,
}: {
    jobData: JobModel[] | undefined;
}) => {
    const theme = useTheme();
    const isMDScreen = useMediaQuery(theme.breakpoints.up("md"));

    const selectedJob = useSkill((x) => x.gameData);
    const overusedData = getOverusedSkillData(selectedJob);

    const paddedSkills = (skillTree: { [key: number]: SkillTreeModel }): SkillTreeModel[] => {
        const skills: SkillTreeModel[] = Object.values(skillTree);
        const renderCount = skills.length <= 2 ? 2 : 4;
        return [...skills, ...Array(renderCount - skills.length).fill({ 'jobId': -1, 'jobName': 'N/A', 'skillPoints': 0, 'skills': {}, 'usedSkillPoints': 0 })];
    };

    const getOverusedData = (jobId: number): OverusedModel | null => {
        if (!overusedData) return null;

        const idx = overusedData.findIndex((x) => x.job_id === jobId);
        if (idx >= 0) {
            return overusedData[idx];
        }

        return null;
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
            <MobileClassSelect jobData={jobData} />
            {selectedJob !== null && selectedJob.skillTree ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        justifyItems: "center",
                        width: "100%",
                        gap: { xs: 2, md: 1 },
                    }}
                >
                    {paddedSkills(selectedJob.skillTree).map((x, idx) => {
                        const overusedJobData = getOverusedData(x.jobId);
                        return isMDScreen ? (
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
                                        sx={{
                                            display: x.jobId >= 0 ? 'inline' : 'none',
                                        }}
                                    >
                                        {x.jobName}
                                    </Typography>
                                    <Typography
                                        fontSize={16}
                                        fontWeight={700}
                                        sx={{
                                            display: x.jobId >= 0 ? 'flex' : 'none',
                                            color: x.usedSkillPoints > x.skillPoints ? 'red' : 'inherit',
                                        }}
                                    >
                                        ({x.usedSkillPoints}/{x.skillPoints}{x.usedSkillPoints > x.skillPoints ? <Typography fontSize={16} fontWeight={700} sx={{ color: 'red' }}>&nbsp;+{x.usedSkillPoints - x.skillPoints}</Typography> : null}{overusedJobData && overusedJobData.overused > 0 ? <Typography fontSize={16} fontWeight={700} sx={{ color: 'red' }}>&nbsp;-{overusedJobData.overused}</Typography> : null})
                                    </Typography>
                                </Box>
                                <SkillTable
                                    key={`skill-table-${idx}`}
                                    jobId={x.jobId}
                                />
                            </Paper>
                        ) : x.jobId >= 0 ? (
                            <Paper
                                key={`skill-box-mobile-${idx}`}
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
                                        {x.jobName}
                                    </Typography>
                                    <Typography
                                        fontSize={16}
                                        fontWeight={700}
                                        sx={{
                                            display: x.jobId >= 0 ? 'flex' : 'none',
                                            color: x.usedSkillPoints > x.skillPoints ? 'red' : 'inherit',
                                        }}
                                    >
                                        ({x.usedSkillPoints}/{x.skillPoints}{x.usedSkillPoints > x.skillPoints ? <Typography fontSize={16} fontWeight={700} sx={{ color: 'red' }}>&nbsp;+{x.usedSkillPoints - x.skillPoints}</Typography> : null}{overusedJobData && overusedJobData.overused > 0 ? <Typography fontSize={16} fontWeight={700} sx={{ color: 'red' }}>&nbsp;-{overusedJobData.overused}</Typography> : null})
                                    </Typography>
                                </Box>
                                <MobileSkillTable
                                    key={`mobile-skill-table-${idx}`}
                                    jobId={x.jobId}
                                />
                            </Paper>
                        ) : (
                            null
                        )
                    })}
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
