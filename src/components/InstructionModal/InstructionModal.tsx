import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { SxProps } from '@mui/material';
import { useSkill } from '@/store/useSkill';

const MainModalStyle: SxProps = {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%' , md: 600 },
    height: 300,
    bgcolor: '#F2F2F2',
    border: '1px solid #000',
    borderRadius: 2,
    gap: 2,
    paddingX: 2,
    paddingY: 3,
};

const InstructionModal = () => {

    const open = useSkill((x) => x._instructionModal);
    const close = useSkill((x) => x.close_instruction_modal);

    return (
        <Modal
            open={open}
            aria-labelledby="share-modal"
            aria-describedby="share-modal-desc"
            onClose={close}
        >
            <Box sx={MainModalStyle}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                    p={4}
                    gap={3}
                    flex={1}
                >
                    <Typography
                        variant="body2"
                        component="span"
                        fontWeight={700}
                        fontSize={16}
                    >
                        How to
                    </Typography>
                    <Typography
                        variant="body2"
                        component="span"
                        fontWeight={700}
                        fontSize={12}
                    >
                        RO Mode: Similar to the in-game skill tree, you must put a sufficient numbers of skills into a prior job before proceeding to the next.
                    </Typography>
                    <Typography
                        variant="body2"
                        component="span"
                        fontWeight={700}
                        fontSize={12}
                    >
                        Free Mode: Apply skill points in any order without restrictions.
                    </Typography>
                    <Typography
                        variant="body2"
                        component="span"
                        fontWeight={700}
                        fontSize={12}
                    >
                        (Desktop) CTRL + Left Click on an arrow to fully level or delevel a skill. Prerequisites will also be applied.
                        <br></br>
                        (Mobile) Keep pressed the arrow for a few seconds to fully level or delevel a skill. Prerequisites will also be applied.
                    </Typography>
                    <Button
                        variant='outlined'
                        onClick={() => close()}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
};

export default InstructionModal;
