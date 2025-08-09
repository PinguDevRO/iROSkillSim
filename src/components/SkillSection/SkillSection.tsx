import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import SkillTable from './skillTable';
import MobileSkillTable from './MobileSkillTable';
import MobileClassSelect from '../ClassSelect/MobileClassSelect';
import { JobModel } from '@/models/get-job-skills';
import { useSkill } from '@/store/useSkill';


const SkillSection = ({
    jobData,
} : {
    jobData: JobModel[] | undefined;
}) => {

    const selectedJob = useSkill((x) => x.gameData);

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
                    {Object.values(selectedJob.skillTree).map((x, idx) => (
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
                                    {x.jobName}
                                </Typography>
                                <Typography
                                    fontSize={16}
                                    fontWeight={700}
                                    sx={{
                                        color: x.usedSkillPoints > x.skillPoints ? 'red' : 'inherit',
                                    }}
                                >
                                    ({x.usedSkillPoints}/{x.skillPoints})
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
