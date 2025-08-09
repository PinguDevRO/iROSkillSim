import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import JobTooltip from '../JobTooltip/JobTooltip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { job_list, get_jobname_by_id } from '@/constants/joblist';
import { useSkill } from '@/store/useSkill';
import { JobModel } from '@/models/get-job-skills';

const MobileClassSelect = ({
    jobData,
} : {
    jobData: JobModel[] | undefined;
}) => {

    const selectedClass = useSkill((x) => x.gameData);
    const setSelectedJob = useSkill((x) => x.set_game_data);

    const handleChange = (e: SelectChangeEvent) => {
        const job_name = e.target.value;
        if(jobData && job_name.length > 0) {
            const selected = job_list.find((x) => x.name === job_name);
            if(selected){
                const foundJob = jobData.find((x) => x.jobId === selected.id);
                if(foundJob){
                    setSelectedJob(foundJob);
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
                m: 2,
                width: "100%",
            }}
        >
            <Typography variant="body2" fontWeight={700} component="span">
                    Class Selection
            </Typography>
            <FormControl fullWidth>
                <Select
                    id="select-job-name"
                    size="small"
                    value={selectedClass !== null ? get_jobname_by_id(selectedClass.jobId) : ''}
                    onChange={handleChange}
                    sx={{
                        background: '#FFFFFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d8d8d8',
                        },
                    }}
                >
                    <MenuItem disabled value="">
                        <em>Pick your Class</em>
                    </MenuItem>
                    {job_list.map((x) => (
                        <MenuItem
                            key={x.id}
                            value={x.name}
                        >
                            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                <JobTooltip jobId={x.id} jobName={x.name} isSelected={selectedClass !== null && x.id === selectedClass.jobId} />
                                {x.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default MobileClassSelect;
