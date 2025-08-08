import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import JobTooltip from '../JobTooltip/JobTooltip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { job_list } from '@/constants/joblist';
import { useStore } from '@/store/useStore';

const MobileClassSelect = () => {

    const selectedClass = useStore((x) => x.gameClass);
    const setSelectedJob = useStore((x) => x.set_game_class);

    const handleChange = (e: SelectChangeEvent) => {
        const job_name = e.target.value;
        if(job_name.length > 0) {
            const selected = job_list.find((x) => x.name === job_name);
            setSelectedJob(selected !== undefined ? selected : null);
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
                    value={selectedClass !== null ? selectedClass.name : ''}
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
                                <JobTooltip jobId={x.id} jobName={x.name} isSelected={selectedClass !== null && x.id === selectedClass.id} />
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
