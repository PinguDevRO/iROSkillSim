'use client';

import {
    EndpointName,
    EndpointStatus,
    Model
} from '@/controllers/main';
import { SnackbarProvider } from 'notistack'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Loading from '@/components/Loading/Loading';
import ClassSelect from '@/components/ClassSelect/ClassSelect';
import ShareModal from '@/components/ShareModal/ShareModal';
import SkillHeader from '@/components/SkillSection/SkillHeader';
import SkillSection from '@/components/SkillSection/SkillSection';
import { COLORS } from "@/theme/colors";

const MainScreen = ({
    model,
    endpoints,
}: {
    model: Partial<Model> | undefined;
    endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
}) => {

    const handleLoading = () => {
        for (const key in endpoints) {
            if (endpoints[key as EndpointName]?.loading) {
                return true;
            }
        }
        return false;
    };

    return (
        <SnackbarProvider
            autoHideDuration={5000}
            maxSnack={3}
            dense
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <ClassSelect />
            <ShareModal />
            <Box
                sx={{
                    display: 'grid',
                    gap: { xs: 0, md: 2 },
                    padding: 2,
                    alignItems: 'stretch',
                    width: { xs: '100%', md: 'auto' },
                    height: '100%',
                    boxSizing: 'border-box',
                    borderRadius: {
                        'xs': 0,
                        'md': 2,
                    },
                    background: COLORS.third_background,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        width: '100wv',
                        height: '100%',
                        padding: 2,
                        borderRadius: 2,
                        justifyContent: 'center',
                    }}
                >
                    <SkillHeader />
                </Paper>
                {handleLoading() ? (
                    <Loading />
                ) : (
                    <SkillSection jobSkill={model?.jobSkillData} skills={model?.skillsData} />
                )}
            </Box>
        </SnackbarProvider>
    )
};

export default MainScreen;
