import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSkill } from '@/store/useSkill';

const MenuButton = () => {

    const open_modal = useSkill((x) => x.open_character_modal);
    const share_modal = useSkill((x) => x.open_share_modal);
    const reset_skills = useSkill((x) => x.reset_skills);

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="start"
            gap={2}
        >
            <Button
                variant='outlined'
                onClick={() => open_modal()}
                sx={{
                    display: { xs: 'none', md: 'inline' },
                }}
            >
                <Typography
                    variant='body2'
                    sx={{
                        color: '#433e5a',
                        fontSize: 11,
                        fontWeight: 'bold',
                        fontFamily: 'Tahoma',
                    }}
                >
                    Select Class
                </Typography>
            </Button>
            <Button
                variant='outlined'
                onClick={() => share_modal()}
            >
                <Typography
                    variant='body2'
                    sx={{
                        color: '#433e5a',
                        fontSize: 11,
                        fontWeight: 'bold',
                        fontFamily: 'Tahoma',
                    }}
                >
                    Share Build
                </Typography>
            </Button>
            <Button
                variant='outlined'
                onClick={() => reset_skills()}
            >
                <Typography
                    variant='body2'
                    sx={{
                        color: '#433e5a',
                        fontSize: 11,
                        fontWeight: 'bold',
                        fontFamily: 'Tahoma',
                    }}
                >
                    Reset Skills
                </Typography>
            </Button>
        </Box>
    )
};

export default MenuButton;
