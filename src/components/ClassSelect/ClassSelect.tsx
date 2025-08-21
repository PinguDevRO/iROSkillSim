import { useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { class_list, JobListModel } from '@/constants/joblist';
import { SxProps } from '@mui/material';
import { useSkill, GameClass } from '@/store/useSkill';
import { JobModel } from '@/models/get-job-skills';

const MainModalStyle: SxProps = {
    display: { xs: 'none', md: 'flex' },
    flexDirection: { xs: null, md: 'column' },
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
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

    const [hover, setHover] = useState<number | null>(null);
    const [closeButtonHover, setCloseButtonHover] = useState<boolean>(false);
    const [selectedCharacter, setSelectedCharacter] = useState<JobListModel | null>(null);

    const open = useSkill((x) => x._characterModal);
    const close = useSkill((x) => x.close_character_modal);
    const selectedGameClass = useSkill((x) => x._selectedGameClass);
    const setGameData = useSkill((x) => x.set_game_data);
    const setSelectedGameClass = useSkill((x) => x.set_selected_game_class);

    const job_data = class_list.find((x) => x.id === selectedGameClass);

    const handleOnJobSelection = () => {
        if(jobData && selectedCharacter){
            const foundJob = jobData.find((x) => x.jobId === selectedCharacter.id);
            if(foundJob){
                setGameData(foundJob);
            }
        }
        close();
    };

    const handleOnClassChange = (e: SelectChangeEvent) => {
        setSelectedGameClass(e.target.value as GameClass);
    };

    const CloseButtonBackground = (isHover: boolean): string => {
        if (isHover) return '/game_interface/bt_close2_over.png';
        return '/game_interface/bt_close2_normal.png';
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

    const get_missing_slot_count = (usedSlots: number): number => {
        return (7 - (usedSlots % 7)) % 7;
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
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="start"
                    gap={4}
                >
                    <FormControl size="small">
                        <InputLabel id="class-branch-select-label">Classes</InputLabel>
                        <Select
                            labelId="class-branch-select-label"
                            id="class-branch-select"
                            value={selectedGameClass}
                            label="Classes"
                            onChange={handleOnClassChange}
                            sx={{
                                width: 200,
                            }}
                        >
                            <MenuItem value={"1"}>1st Class</MenuItem>
                            <MenuItem value={"2"}>2nd Class</MenuItem>
                            <MenuItem value={"3"}>3rd Class</MenuItem>
                            <MenuItem value={"4"}>4th Class</MenuItem>
                            <MenuItem value={"5"}>Special Class</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography
                        variant='body2'
                        sx={{
                            color: '#433e5a',
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontFamily: 'Tahoma',
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Double click to select your class!
                    </Typography>
                </Box>
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
                        top: '3%',
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
                    gridTemplateColumns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                    alignItems="center"
                    justifyContent="center"
                >
                    {job_data && [...job_data.job_list, ...Array(get_missing_slot_count(job_data.job_list.length)).fill({ 'id': -1, name: '' })].map((val, idx) => (
                        <IconButton
                            key={`char-select-slot-${idx}`}
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
                                    null
                                )}

                            </Box>
                        </IconButton>
                    ))}
                </Box>
            </Box>
        </Modal>
    )
};

export default ClassSelect;
