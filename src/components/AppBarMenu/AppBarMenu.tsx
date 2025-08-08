'use client';

import {
  EndpointName,
  EndpointStatus,
  Model
} from '@/controllers/appBarMenu';
import { GlobalStatusModel, ScheduledMaintenanceModel } from '@/models/server-status';
import Image from "next/image";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import CircleIcon from '@mui/icons-material/Circle';
import WarningIcon from '@mui/icons-material/Warning';
import { CustomTypography } from "@/utils/component_utils";
import { red, orange, green, yellow } from '@mui/material/colors';
import { COLORS } from '@/theme/colors';
import { compareDateNow, isoStringToFormat } from '@/utils/date_utils';


const GetStatusColor = (item: GlobalStatusModel) => {
  if (item.online === 0 && item.offline > 0) {
    return red[500];
  }
  else if (item.online > 0 && item.offline === 0) {
    return green[500];
  }
  else {
    return orange[500];
  }
};

const ServerStatus = ({
  model,
  endpoints
}: {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
}) => {

  const isMaintenance = (global: GlobalStatusModel[], maintenance: ScheduledMaintenanceModel): boolean => {
    const isOffline = global.some((x) => x.offline > 0);
    if (isOffline && compareDateNow(maintenance.start, 'greater') && compareDateNow(maintenance.end, 'less')) {
      return true;
    }
    return false;
  };

  return (
    <Box
      width={{ xs: '100%', md: '20%' }}
      height="100%"
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="end"
      gap={2}
      paddingBottom={{ xs: 2, md: 0 }}
    >
      <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2} paddingX={4}>
        {endpoints !== undefined && endpoints.getServerStatus !== undefined && endpoints.getServerStatus.loading ? (
          <Skeleton width="100%" animation="wave" />
        ) : (
          model !== undefined && model.serverStatusData !== undefined && model.serverStatusData.globalStatus.map((x, idx) => (
            <Box key={'global-status-' + idx} display="flex" flexDirection="row" alignItems="center" gap={0.5}>
              <CircleIcon sx={{ color: GetStatusColor(x) }} />
              {x.name === 'Zone' ? (
                <CustomTypography
                  color={COLORS.third_background_text}
                  variant="caption"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 700,
                  }}
                >
                  {x.name} ({x.online}/{x.online + x.offline})
                </CustomTypography>
              ) : (
                <CustomTypography
                  color={COLORS.third_background_text}
                  variant="caption"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 700,
                  }}
                >
                  {x.name}
                </CustomTypography>
              )}
            </Box>
          ))
        )}
      </Box>
      <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2} paddingX={4}>
        {endpoints !== undefined && endpoints.getServerStatus !== undefined && endpoints.getServerStatus.loading ? (
          <>
            <Box key={'total-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <Skeleton width="100%" animation="wave" />
            </Box>
            <Box key={'chaos-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <Skeleton width="100%" animation="wave" />
            </Box>
            <Box key={'thor-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <Skeleton width="100%" animation="wave" />
            </Box>
            <Box key={'freya-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <Skeleton width="100%" animation="wave" />
            </Box>
          </>
        ) : model !== undefined && model.serverStatusData !== undefined && !isMaintenance(model.serverStatusData.globalStatus, model.serverStatusData.scheduledMaintenance) ? (
          <>
            <Box key={'total-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <CustomTypography
                color={COLORS.internal_link_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Online Players
              </CustomTypography>
              <CustomTypography
                color={COLORS.third_background_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                {model.serverStatusData.playerCounts.total}
              </CustomTypography>
            </Box>
            <Box key={'chaos-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <CustomTypography
                color={COLORS.internal_link_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Chaos
              </CustomTypography>
              <CustomTypography
                color={COLORS.third_background_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                {model.serverStatusData.playerCounts.chaos.count}
              </CustomTypography>
            </Box>
            <Box key={'thor-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <CustomTypography
                color={COLORS.internal_link_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Thor
              </CustomTypography>
              <CustomTypography
                color={COLORS.third_background_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                {model.serverStatusData.playerCounts.thor.count}
              </CustomTypography>
            </Box>
            <Box key={'freya-players-value'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5}>
              <CustomTypography
                color={COLORS.internal_link_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Freya
              </CustomTypography>
              <CustomTypography
                color={COLORS.third_background_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                {model.serverStatusData.playerCounts.freya.count}
              </CustomTypography>
            </Box>
          </>
        ) : model !== undefined && model.serverStatusData !== undefined && isMaintenance(model.serverStatusData.globalStatus, model.serverStatusData.scheduledMaintenance) ? (
          <>
            <WarningIcon sx={{ color: yellow[500] }} />
            <Box key={'under-maintenance'} flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <CustomTypography
                color={COLORS.internal_link_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Server Maintenance
              </CustomTypography>
              <CustomTypography
                color={COLORS.third_background_text}
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                }}
              >
                Until {isoStringToFormat(model.serverStatusData.scheduledMaintenance.end, 'YYYY/MM/DD HH:mm')} Hrs.
              </CustomTypography>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
};


const AppBarMenu = ({
  model,
  endpoints
}: {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
}) => {
  return (
    <AppBar
      sx={{
        position: {
          'xs': "static",
          'md': "sticky",
        },
        mb: '1rem',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            width="100%"
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            gap={2}
            paddingTop={{ xs: 2, md: 0 }}
            position="relative"
          >
            <Box
              width={{ xs: '100%', md: '33%' }}
              position="relative"
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              alignItems="center"
              justifyContent={{
                xs: 'center',
                md: 'flex-start',
              }}
              gap={2}
            >
              <Image
                src="/logo.png"
                alt="iRO Market Logo"
                width={68}
                height={50}
                draggable={false}
              />
              <CustomTypography
                color="#F2F2F2"
                variant="body2"
                component="span"
                fontWeight={700}
                letterSpacing="0.05em"
                sx={{
                  fontSize: {
                    'xs': 24,
                    'md': 20,
                  }
                }}
              >
                Skill Simulator
              </CustomTypography>
            </Box>
            <ServerStatus model={model} endpoints={endpoints} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppBarMenu;
