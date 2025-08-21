import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import JobTooltip from '../JobTooltip/JobTooltip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { class_list, get_jobname_by_id } from '@/constants/joblist';
import { useSkill } from '@/store/useSkill';
import { JobModel } from '@/models/get-job-skills';

const MobileClassSelect = ({
    jobData,
}: {
    jobData: JobModel[] | undefined;
}) => {

    const selectedJob = useSkill((x) => x.gameData);
    const setSelectedJob = useSkill((x) => x.set_game_data);

    const handleChange = (e: SelectChangeEvent) => {
        const job_name = e.target.value;
        console.log(jobData);
        if (jobData && job_name.length > 0) {
            for (const classList of class_list) {
                const selected = classList.job_list.find((x) => x.name === job_name);
                if (selected) {
                    const foundJob = jobData.find((x) => x.jobId === selected.id);
                    if (foundJob) {
                        setSelectedJob(foundJob);
                    }
                }
            }
        }
    };

    return (
        <Box
            sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                px: 4,
                py: 2,
                width: "100%",
            }}
        >
            <Typography variant="body2" fontWeight={700} component="span">
                Class Selection
            </Typography>
            <FormControl fullWidth size="small">
                <Select
                    id="select-job-name"
                    size="small"
                    value={selectedJob !== null ? get_jobname_by_id(selectedJob.jobId) : ''}
                    onChange={handleChange}
                    sx={{
                        background: '#FFFFFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d8d8d8',
                        },
                    }}
                >
                    <MenuItem disabled value={undefined}>
                        <em>First Class</em>
                    </MenuItem>
                    {class_list[0].job_list.map((y) => (
                        <MenuItem key={y.id} value={y.name}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip
                                    jobId={y.id}
                                    jobName={y.name}
                                    isSelected={selectedJob?.jobId === y.id}
                                />
                                {y.name}
                            </Box>
                        </MenuItem>
                    ))}
                    <MenuItem disabled value={undefined}>
                        <em>Second Class</em>
                    </MenuItem>
                    {class_list[1].job_list.map((y) => (
                        <MenuItem key={y.id} value={y.name}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip
                                    jobId={y.id}
                                    jobName={y.name}
                                    isSelected={selectedJob?.jobId === y.id}
                                />
                                {y.name}
                            </Box>
                        </MenuItem>
                    ))}
                    <MenuItem disabled value={undefined}>
                        <em>Third Class</em>
                    </MenuItem>
                    {class_list[2].job_list.map((y) => (
                        <MenuItem key={y.id} value={y.name}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip
                                    jobId={y.id}
                                    jobName={y.name}
                                    isSelected={selectedJob?.jobId === y.id}
                                />
                                {y.name}
                            </Box>
                        </MenuItem>
                    ))}
                    <MenuItem disabled value={undefined}>
                        <em>Fourth Class</em>
                    </MenuItem>
                    {class_list[3].job_list.map((y) => (
                        <MenuItem key={y.id} value={y.name}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip
                                    jobId={y.id}
                                    jobName={y.name}
                                    isSelected={selectedJob?.jobId === y.id}
                                />
                                {y.name}
                            </Box>
                        </MenuItem>
                    ))}
                    <MenuItem disabled value={undefined}>
                        <em>Special Class</em>
                    </MenuItem>
                    {class_list[4].job_list.map((y) => (
                        <MenuItem key={y.id} value={y.name}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip
                                    jobId={y.id}
                                    jobName={y.name}
                                    isSelected={selectedJob?.jobId === y.id}
                                />
                                {y.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default MobileClassSelect;
