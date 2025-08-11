import { useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import StorageIcon from '@mui/icons-material/Storage';
import CalculateIcon from '@mui/icons-material/Calculate';
import PersonIcon from '@mui/icons-material/Person';
import PollIcon from '@mui/icons-material/Poll';
import ArticleIcon from '@mui/icons-material/Article';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { COLORS } from '@/theme/colors';

const menuItems = [
    {
        name: "Game Info",
        elements: [
            {
                name: "Classes",
                url: "https://irowiki.org/wiki/Classes",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "Skills",
                url: "https://irowiki.org/wiki/Skills",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "Monster",
                url: "https://irowiki.org/wiki/Monster",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "Leveling Spots",
                url: "https://irowiki.org/wiki/Leveling_Spots",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
        ]
    },
    {
        name: "iRO Wiki",
        elements: [
            {
                name: "Main Page",
                url: "https://irowiki.org/wiki/Main_Page",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "Guide: Beginner Tips",
                url: "https://irowiki.org/wiki/Guide:Beginner_Tips",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "Clients and Patches",
                url: "https://irowiki.org/wiki/Clients_and_Patches",
                icon: <ArticleIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "iRO Wiki Discord",
                url: "https://irowiki.org/discord",
                icon: <Image src='/discord.svg' width={22} height={22} draggable={false} alt='' />,
            },
        ]
    },
    {
        name: "Tools",
        elements: [
            {
                name: "iRO Wiki Database",
                url: "https://db.irowiki.org/db/",
                icon: <StorageIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "iRO Wiki Calculator",
                url: "https://calc.irowiki.org/",
                icon: <CalculateIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "iRO Wiki Character Sprite Simulator",
                url: "https://costume.irowiki.org/",
                icon: <PersonIcon sx={{ color: COLORS.third_background }} />,
            },
            {
                name: "iRO Wiki Skill Simulator",
                url: "https://skills.irowiki.org/",
                icon: <PollIcon sx={{ color: COLORS.third_background }} />,
            },
        ]
    },
];

const MenuList = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setOpenIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenIndex(null);
    };
    const handleOnURLOpen = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        handleClose();
    };

    return (
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
            {menuItems.map((x, index) => (
                <Box
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        id={`menu-dropdown-${index}`}
                        aria-controls={openIndex === index ? `menu-dropdown-data-${index}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={openIndex === index ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={(e) => handleClick(e, index)}
                        endIcon={openIndex === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        sx={{
                            fontWeight: 700,
                            fontSize: 14,
                            '&:hover': {
                                backgroundColor: COLORS.second_background,
                            },
                        }}
                    >
                        {x.name}
                    </Button>

                    <Menu
                        id={`menu-dropdown-${index}`}
                        elevation={0}
                        slotProps={{
                            list: {
                                'aria-labelledby': `menu-dropdown-data-${index}`,
                            },
                        }}
                        anchorEl={anchorEl}
                        open={openIndex === index}
                        onClose={handleClose}
                    >
                        {x.elements.map((y, indexy) => (
                            <MenuItem
                                key={`menu-dropdown-${index}-item-${indexy}`}
                                onClick={() => handleOnURLOpen(y.url)}
                                disableRipple
                                sx={{
                                    gap: 1
                                }}
                            >
                                {y.icon}
                                {y.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            ))}
        </Box>
    );
};

export default MenuList;
