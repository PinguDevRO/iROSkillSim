import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ColoredText from './ColoredText';
import { SkillModel } from '@/models/get-job-skills';
import { styled } from '@mui/material/styles';
import { useSkill } from '@/store/useSkill';

const StyledIconButton = styled(IconButton)({
    position: 'relative',
    width: 32,
    height: 32,
    padding: 0,
    '&:hover .image-overlay': {
        opacity: 1,
    },
});

const Overlay = styled('div', {
    shouldForwardProp: (prop) => prop !== 'show',
})<{ show: boolean }>(({ show }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(254,198,207,0.6)',
    border: '1px solid #feb5c7',
    borderRadius: 3,
    opacity: show ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease-in-out',
}));

const Skill = ({
    jobId,
    skill,
}: {
    jobId: number;
    skill: SkillModel;
}) => {

    const hoverSkill = useSkill((x) => x.hover_skill_dependency);
    const showSkillDescription = useSkill((x) => x._showSkillDescription);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="25%"
        >
            <Tooltip
                disableInteractive
                disableFocusListener={!showSkillDescription}
                disableHoverListener={!showSkillDescription}
                disableTouchListener={!showSkillDescription}
                slotProps={{
                    tooltip: {
                        sx: {
                            color: '#010101',
                            backgroundColor: '#fffefe',
                            border: '1px solid #c7c6c7',
                            borderRadius: 2,
                            p: 1,
                            maxWidth: 290,
                            whiteSpace: 'pre-wrap',
                        },
                    },
                    popper: {
                        disablePortal: true,
                        modifiers: [
                            {
                                name: 'flip',
                                enabled: true,
                                options: {
                                    altBoundary: true,
                                    rootBoundary: 'document',
                                    padding: 8,
                                },
                            },
                            {
                                name: 'preventOverflow',
                                enabled: true,
                                options: {
                                    altAxis: true,
                                    altBoundary: true,
                                    tether: true,
                                    rootBoundary: 'document',
                                    padding: 8,
                                },
                            },
                        ],
                    }
                }}
                title={
                    <Box display="flex" flexDirection="column" alignItems="start" justifyContent="start">
                        <ColoredText jobId={jobId} lines={skill.skillDescription} />
                    </Box>
                }
            >
                <StyledIconButton
                    disableRipple
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onMouseEnter={() => hoverSkill(skill.skillId, true)}
                    onMouseLeave={() => hoverSkill(skill.skillId, false)}
                >
                    <Image
                        src={`https://db.irowiki.org/image/skill/${skill.skillId}.png`}
                        alt={skill.skillName}
                        width={28}
                        height={28}
                        draggable={false}
                        loading="eager"
                        style={{ filter: skill.skillState.canBeLeveled ? 'none' : 'grayscale(100%)' }}
                    />
                    {skill.skillState.state && skill.skillState.skillLevel > 0 ? (
                        <Typography
                            position='absolute'
                            top='55%'
                            left='100%'
                            fontSize={12}
                            fontWeight={700}
                            sx={{
                                color: 'white',
                                textShadow: `
                                    -1px -1px 0 black,
                                    1px -1px 0 black,
                                    -1px  1px 0 black,
                                    1px  1px 0 black
                                    `,
                            }}
                        >
                            {skill.skillState.skillLevel}
                        </Typography>
                    ) : (
                        <></>
                    )}
                    <Overlay show={skill.skillState.state} />
                </StyledIconButton>
            </Tooltip>
        </Box>
    );
};

export default Skill;
