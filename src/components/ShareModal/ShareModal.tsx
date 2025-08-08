import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { enqueueSnackbar } from 'notistack';
import { SxProps } from '@mui/material';
import { useStore } from '@/store/useStore';

const MainModalStyle: SxProps = {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%' , md: 600 },
    height: 200,
    bgcolor: '#F2F2F2',
    border: '1px solid #000',
    borderRadius: 2,
    gap: 2,
    paddingX: 2,
    paddingY: 3,
};

const ShareModal = () => {

    const [origin, setOrigin] = useState<string>('');
    const open = useStore((x) => x._shareModal);
    const close = useStore((x) => x.close_share_modal);
    const skillBuild = useStore((x) => x._shareLink);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const handleOnCopy = async () => {
        if (skillBuild !== null && origin.length > 0) {
            await navigator.clipboard.writeText(`${origin}/?build=${skillBuild}`);
            enqueueSnackbar("Link copied into the Clipboard!", { variant: "success" });
        }
    };

    return (
        <Modal
            open={open}
            aria-labelledby="share-modal"
            aria-describedby="share-modal-desc"
        >
            <Box sx={MainModalStyle}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
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
                        Share your build
                    </Typography>
                    <TextField
                        fullWidth
                        type='text'
                        value={skillBuild !== null && origin.length > 0 ? `${origin}/?build=${skillBuild}` : ''}
                        slotProps={{
                            input: {
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }
                        }}
                        onClick={handleOnCopy}
                    />
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

export default ShareModal;
