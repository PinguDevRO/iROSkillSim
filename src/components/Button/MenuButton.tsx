import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSkill } from '@/store/useSkill';

const MenuButton = () => {

    const open_modal = useSkill((x) => x.open_character_modal);
    const reset_skills = useSkill((x) => x.reset_skills);
    const share_modal = useSkill((x) => x.open_share_modal);
    const instruction_modal = useSkill((x) => x.open_instruction_modal);

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="start"
            gap={2}
        >
            <Button
                variant='contained'
                onClick={() => open_modal()}
                sx={{
                    display: { xs: 'none', md: 'inline' },
                    backgroundColor: '#EAC4C4',
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
                variant='contained'
                onClick={() => reset_skills()}
                sx={{
                    backgroundColor: '#EAC4C4',
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
                    Reset Skills
                </Typography>
            </Button>
            <Button
                variant='contained'
                onClick={() => share_modal()}
                sx={{
                    backgroundColor: '#EAC4C4',
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
                    Share Build
                </Typography>
            </Button>
            <Button
                variant='contained'
                onClick={() => instruction_modal()}
                sx={{
                    backgroundColor: '#EAC4C4',
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
                    How To
                </Typography>
            </Button>
        </Box>
    )
};

export default MenuButton;
