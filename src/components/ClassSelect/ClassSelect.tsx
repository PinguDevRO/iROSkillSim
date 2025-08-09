import { useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { job_list, get_jobname_by_id, JobListModel } from '@/constants/joblist';
import { SxProps } from '@mui/material';
import { useSkill } from '@/store/useSkill';
import { JobModel } from '@/models/get-job-skills';

const MainModalStyle: SxProps = {
    display: { xs: 'none', md: 'flex' },
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1010,
    height: 620,
    bgcolor: '#F2F2F2',
    border: '1px solid #000',
    borderRadius: 2,
    gap: 2,
    paddingX: 2,
    paddingY: 3,
};


const ClassSelect = ({
    jobData,
} : {
    jobData: JobModel[] | undefined;
}) => {

    const maxPage = 2;
    const maxChar = 15;
    const [page, setPage] = useState<number>(1);
    const [hover, setHover] = useState<number | null>(null);
    const [loadHover, setLoadHover] = useState<boolean>(false);
    const [leftArrowHover, setLeftArrowHover] = useState<boolean>(false);
    const [rightArrowHover, setRightArrowHover] = useState<boolean>(false);
    const [closeButtonHover, setCloseButtonHover] = useState<boolean>(false);
    const [selectedCharacter, setSelectedCharacter] = useState<JobListModel | null>(null);

    const open = useSkill((x) => x._characterModal);
    const close = useSkill((x) => x.close_character_modal);
    const setGameData = useSkill((x) => x.set_game_data);

    const handleOnJobSelection = () => {
        if(jobData && selectedCharacter){
            const foundJob = jobData.find((x) => x.jobId === selectedCharacter.id);
            if(foundJob){
                setGameData(foundJob);
            }
        }
        close();
    };

    const getCharacterJobName = (): string => {
        if (selectedCharacter !== null) {
            return get_jobname_by_id(selectedCharacter.id);
        }
        return 'Unknown';
    };

    const handleOnPageChange = (value: number) => {
        const newPage = page + value;
        if (newPage <= maxPage && newPage >= 1) {
            setPage(newPage);
        }
    };

    const CloseButtonBackground = (isHover: boolean): string => {
        if (isHover) return '/game_interface/bt_close2_over.png';
        return '/game_interface/bt_close2_normal.png';
    };

    const LeftArrowBackground = (isHover: boolean): string => {
        if (isHover) return '/game_interface/bt_left_over.png';
        return '/game_interface/bt_left_off.png';
    };

    const RightArrowBackground = (isHover: boolean): string => {
        if (isHover) return '/game_interface/bt_right_over.png';
        return '/game_interface/bt_right_off.png';
    };

    const LoadHoverBackground = (isHover: boolean): string => {
        if (isHover) return '/game_interface/bt_gamestart_over.png';
        return '/game_interface/bt_gamestart_off.png';
    };

    const CharacterBackground = (isSelected: boolean, isHover: boolean): string => {
        if (isSelected) return '/game_interface/img_slot_select.gif';
        if (isHover) return '/game_interface/img_slot_over.png';
        return '/game_interface/img_slot_normal.png';
    };

    const SelectBackground = (isChar: boolean, isSelected: boolean, isHover: boolean): string => {
        if (isChar) {
            return CharacterBackground(isSelected, isHover);
        }
        return '/game_interface/img_slot_lock.png';
    };

    return (
        <Modal
            open={open}
            aria-labelledby="character-modal"
            aria-describedby="character-modal-desc"
            sx={{
                display: { xs: 'none', md: 'inline' },
            }}
        >
            <Box sx={MainModalStyle}>
                <IconButton
                    sx={{
                        p: 0,
                        m: 0,
                        width: 17,
                        height: 18,
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        position: 'absolute',
                        top: '0.3%',
                        left: '96%',
                        transform: 'translateX(-50%)',
                        zIndex: 13,
                    }}
                    onMouseEnter={() => setCloseButtonHover(true)}
                    onMouseLeave={() => setCloseButtonHover(false)}
                    onClick={() => close()}
                >
                    <Image
                        src={CloseButtonBackground(closeButtonHover)}
                        alt={'Close Button'}
                        width={17}
                        height={18}
                        draggable={false}
                        loading="eager"
                    />
                </IconButton>
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                    alignItems="center"
                    justifyContent="center"
                >
                    {[...job_list, ...Array(10).fill({ 'id': -1, name: '' })].slice((page - 1) * maxChar, page * maxChar).map((val, idx) => (
                        <IconButton
                            key={`char-select-page-${page}-slot-${idx}`}
                            sx={{
                                p: 0,
                                m: 0,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                            disabled={val.id <= 0}
                            onMouseEnter={() => setHover(idx)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => val.id > 0 ? setSelectedCharacter(val) : {}}
                            onDoubleClick={() => {
                                if(val.id > 0){
                                    setSelectedCharacter(val);
                                    handleOnJobSelection();
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', width: 157, height: 195 }}>
                                <Image
                                    src={SelectBackground(val.id > 0, selectedCharacter !== null && selectedCharacter.id === val.id, idx === hover)}
                                    alt={`char select ${idx + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    draggable={false}
                                    loading="eager"
                                />
                                {val.id > 0 ? (
                                    <>
                                        <Image
                                            src={`/char/job_${val.id}.png`}
                                            alt={`char select ${idx + 1}`}
                                            unoptimized
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                                pointerEvents: 'none',
                                                transform: 'translateY(-15px)'
                                            }}
                                            draggable={false}
                                            loading="eager"
                                        />
                                        <Image
                                            src={`/job/icon_jobs_${val.id}.png`}
                                            alt={`char select ${idx + 1}`}
                                            width={25}
                                            height={25}
                                            style={{
                                                position: 'absolute',
                                                top: '8%',
                                                left: '85%',
                                                transform: 'translateX(-50%)',
                                            }}
                                            draggable={false}
                                            loading="eager"
                                        />
                                        <Typography
                                            variant='body2'
                                            sx={{
                                                width: 120,
                                                position: 'absolute',
                                                top: selectedCharacter !== null && selectedCharacter.id === val.id ? "84%" : idx === hover ? "86%" : "85%",
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                color: '#433e5a',
                                                fontSize: 11,
                                                fontWeight: 'bold',
                                                fontFamily: 'Tahoma',
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {val.name}
                                        </Typography>
                                    </>
                                ) : (
                                    <></>
                                )}

                            </Box>
                        </IconButton>
                    ))}
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box sx={{ position: 'relative', width: 173, height: 575 }}>
                        <Image
                            src={'/game_interface/img_info.png'}
                            alt={'char information'}
                            fill
                            style={{ objectFit: 'contain' }}
                            draggable={false}
                            loading="eager"
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            sx={{
                                width: "60%",
                                position: 'absolute',
                                top: '15.5%',
                                left: '65%',
                                transform: 'translateX(-50%)',
                                zIndex: 13,
                                gap: 0.335
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em',
                                    zIndex: 13,
                                }}
                            >
                                {selectedCharacter !== null ? 'iRO Wiki' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? getCharacterJobName() : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '275' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '9999999999' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '185000' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '14200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    textWrap: "nowrap",
                                    color: '#000000',
                                    fontSize: 10,
                                    fontFamily: 'Arial',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {selectedCharacter !== null ? '200' : ''}
                            </Typography>
                        </Box>
                        <IconButton
                            sx={{
                                display: selectedCharacter !== null ? 'inline' : 'none',
                                p: 0,
                                m: 0,
                                width: 165,
                                height: 110,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                                position: 'absolute',
                                top: '67%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                            }}
                            onMouseEnter={() => setLoadHover(true)}
                            onMouseLeave={() => setLoadHover(false)}
                            onClick={() => handleOnJobSelection()}
                        >
                            <Image
                                src={LoadHoverBackground(loadHover)}
                                alt={'char load'}
                                width={165}
                                height={110}
                                draggable={false}
                                loading="eager"
                            />
                            <Typography
                                variant='body2'
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    textWrap: "nowrap",
                                    color: '#F2F2F2',
                                    fontSize: 16,
                                    fontWeight: 700,
                                    fontFamily: 'Tahoma',
                                }}
                            >
                                Start Game
                            </Typography>
                        </IconButton>
                        <Typography
                            variant='body2'
                            sx={{
                                position: 'absolute',
                                top: '89%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textWrap: "nowrap",
                                color: '#000000',
                                fontSize: 12,
                                fontFamily: 'Arial',
                                zIndex: 13,
                            }}
                        >
                            Character List
                        </Typography>
                        <IconButton
                            sx={{
                                p: 0,
                                m: 0,
                                width: 21,
                                height: 28,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                                position: 'absolute',
                                top: '92.6%',
                                left: '20%',
                                transform: 'translateX(-50%)',
                                zIndex: 13,
                            }}
                            onMouseEnter={() => setLeftArrowHover(true)}
                            onMouseLeave={() => setLeftArrowHover(false)}
                            onClick={() => handleOnPageChange(-1)}
                        >
                            <Image
                                src={LeftArrowBackground(leftArrowHover)}
                                alt={'Left Arrow'}
                                width={21}
                                height={28}
                                draggable={false}
                                loading="eager"
                            />
                        </IconButton>
                        <IconButton
                            sx={{
                                p: 0,
                                m: 0,
                                width: 21,
                                height: 28,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                                position: 'absolute',
                                top: '92.6%',
                                left: '80%',
                                transform: 'translateX(-50%)',
                                zIndex: 13,
                            }}
                            onMouseEnter={() => setRightArrowHover(true)}
                            onMouseLeave={() => setRightArrowHover(false)}
                            onClick={() => handleOnPageChange(1)}
                        >
                            <Image
                                src={RightArrowBackground(rightArrowHover)}
                                alt={'Right Arrow'}
                                width={21}
                                height={28}
                                draggable={false}
                                loading="eager"
                            />
                        </IconButton>
                        <Typography
                            variant='body2'
                            sx={{
                                position: 'absolute',
                                top: '92.6%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textWrap: "nowrap",
                                color: '#F2F2F2',
                                fontSize: 20,
                                fontWeight: 700,
                                fontFamily: 'Arial',
                                zIndex: 13,
                            }}
                        >
                            {page} / {maxPage}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
};

export default ClassSelect;
