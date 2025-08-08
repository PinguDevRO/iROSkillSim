import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuButton from '../Button/MenuButton';
import { get_skill_points_by_id } from '@/constants/joblist';
import { useStore } from '@/store/useStore';


const SkillHeader = () => {

    const showSkillDescription = useStore((x) => x._showSkillDescription);
    const roMode = useStore((x) => x._roMode);
    const selectedJob = useStore((x) => x.gameClass);
    const gameSkills = useStore((x) => x.gameSkills);
    const setShowSkilLDescription = useStore((x) => x.update_showSkillDescription);
    const setRoMode = useStore((x) => x.update_ro_mode);

    const get_total_used_points = (): number => {
        let points = 0;
        if (gameSkills !== null) {
            for (const skill of gameSkills) {
                if (skill.defaultLevel === 0) {
                    points += skill.currentLevel;
                }
            }
        }

        return points;
    };

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
                        color: selectedJob !== null && get_total_used_points() > get_skill_points_by_id(selectedJob.id) ? 'red' : 'inherit',
                    }}
                >
                    {selectedJob !== null ? `(${get_total_used_points()}/${get_skill_points_by_id(selectedJob.id)})` : '(0/0)'}
                </Typography>
            </Box>
        </Box>
    );
};

export default SkillHeader;
