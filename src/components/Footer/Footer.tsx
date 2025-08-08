'use client';

import Image from 'next/image'; // or your custom icon SVG
import { Box, Link, Stack } from '@mui/material';
import { CustomTypography } from "@/utils/component_utils";
import { COLORS } from '@/theme/colors';


const Footer = () => {
    return (
        <Box width={{ xs: "auto", md: "70%" }} display="flex" flexDirection="column" alignItems="center" justifyContent="center" px={4} py={1} gap={{ xs: 2, md: 0 }}>
            <CustomTypography
                color={COLORS.primary_background_text}
                variant="subtitle1"
                component="div"
                sx={{
                    fontSize: {
                        xs: '0.6rem',
                        sm: '0.8rem',
                        md: '1rem',
                    },
                    fontWeight: 'normal',
                    display: 'block',
                    lineHeight: 1.6,
                }}
            >
                <Box component="span" sx={{ display: 'inline', wordBreak: 'break-word' }}>
                    © Gravity Interactive, Inc. All Rights Reserved. Ragnarok Online is a trademark of Gravity Co., Ltd. iRO Wiki is not affiliated with neither Gravity or Warp Portal. Web application developed by PinguDev. Special thanks to all the contributors.
                </Box>
            </CustomTypography>
            <Stack
                direction="row"
                spacing={4}
                mt={0.5}
                flexWrap="wrap"
                alignItems="center"
            >
                <Link
                    href="https://irowiki.org/discord/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: {
                            xs: '0.6rem',
                            sm: '0.8rem',
                            md: '1rem',
                        },
                        color: '#3399ff',
                        textDecoration: 'none',
                        '&:hover': {
                            color: '#1a73e8',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    <Image
                        src="/discord.svg"
                        alt="Discord"
                        width={16}
                        height={16}
                    />
                    iRO Wiki - Ragnarok Online
                </Link>
            </Stack>
        </Box>
    )
};

export default Footer;
