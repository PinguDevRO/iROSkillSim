import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuButton from '../Button/MenuButton';
import { useSkill } from '@/store/useSkill';


const SkillHeader = () => {

    const showSkillDescription = useSkill((x) => x._showSkillDescription);
    const roMode = useSkill((x) => x._roMode);
    const selectedJob = useSkill((x) => x.gameData);
    const setShowSkilLDescription = useSkill((x) => x.update_showSkillDescription);
    const setRoMode = useSkill((x) => x.update_ro_mode);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: "center",
                justifyContent: { xs: 'space-evenly', md: 'space-between' },
                flex: 1,
                gap: { xs: 1, md: 2 },
            }}
        >
            <MenuButton />
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    fontSize={16}
                    fontWeight={700}
                >
                    Free Mode
                </Typography>
                <Switch checked={roMode} onChange={(e) => setRoMode(e.target.checked)} />
                <Typography
                    fontSize={16}
                    fontWeight={700}
                >
                    RO Mode
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Switch checked={showSkillDescription} onChange={(e) => setShowSkilLDescription(e.target.checked)} />
                <Typography
                    fontSize={16}
                    fontWeight={700}
                >
                    View Skill Info
                </Typography>
            </Stack>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="end"
                gap={2}
            >
                <Typography
                    fontSize={16}
                    fontWeight={700}
                >
                    Total Used Skill Points
                </Typography>
                <Typography
                    fontSize={16}
                    fontWeight={700}
                    sx={{
                        color: selectedJob !== null && selectedJob.usedSkillPoints > selectedJob.skillPoints ? 'red' : 'inherit',
                    }}
                >
                    {selectedJob !== null ? `(${selectedJob.usedSkillPoints}/${selectedJob.skillPoints})` : '(0/0)'}
                </Typography>
            </Box>
        </Box>
    );
};

export default SkillHeader;
