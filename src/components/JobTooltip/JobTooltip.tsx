import Image from 'next/image';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { COLORS } from '@/theme/colors';


const JobTooltip = ({
    jobId,
    jobName,
    isSelected,
}: {
    jobId: number;
    jobName: string;
    isSelected: boolean;
}) => {
    return (
        <Tooltip
            followCursor
            slotProps={{
                tooltip: {
                    sx: {
                        color: COLORS.primary_background_text,
                        backgroundColor: COLORS.primary_background,
                        borderRadius: 2,
                    },
                },
            }}
            title={jobName}
        >
            <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width={32}
                height={32}
                sx={{
                    backgroundColor: isSelected ? '#fff495' : 'inherit',
                    border: "1px solid #b8c4dc !important",
                    borderRadius: 1,
                    '&:hover': {
                        border: "1px solid #fff495 !important",
                    },
                }}
            >
                <Image
                    src={`/job/icon_jobs_${jobId}.png`}
                    alt={jobName}
                    width={25}
                    height={25}
                    draggable={false}
                    loading="lazy"
                />
            </Box>
        </Tooltip>
    )
};

export default JobTooltip;
