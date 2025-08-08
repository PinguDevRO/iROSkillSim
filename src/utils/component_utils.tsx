import { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { styled } from '@mui/material/styles';

interface CustomTypographyProps {
    children: ReactNode | ReactNode[];
    sx?: SxProps<Theme>;
    [key: string]: unknown;
}

export const ImgWrapper = styled('div')(() => ({
    position: 'relative',
    width: 24,
    height: 24,
    minWidth: 24,
    flexShrink: 0,
}));

export const CustomTypography: FC<CustomTypographyProps> = ({ children, sx = [], ...props }) => {
    const fixedStyles: SxProps<Theme> = {
        textShadow: "0px 0px 1px #000000",
    };

    return (
        <Typography
            {...props}
            sx={[fixedStyles, ...(Array.isArray(sx) ? sx : [sx])]}
        >
            {children}
        </Typography>
    )
};
