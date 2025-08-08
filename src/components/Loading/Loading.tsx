import styled from "styled-components";
import Image from "next/image";
import { CSSProperties } from "@mui/material";
import { COLORS } from "@/theme/colors";

const MainScreen = styled.div`
    display: flex;
    flexDirection: column;
    justifyContent: center;
    alignItems: center;
    width: 100%;
    height: 100%;
    position: relative;
    zIndex: 9999;
    background: rgba(0, 0, 0, 0.2);
`;

const Spinner = styled.div`
    margin: auto;
    border: 5px solid ${COLORS.third_background_text};
    border-radius: 50%;
    border-top: 5px solid ${COLORS.second_background};
    width: 150px;
    height: 150px;
    background: ${COLORS.third_background};
    animation: spinner 2s linear infinite;
    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ImageProperties: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const Loading = () => {
    return (
        <MainScreen>
            <Spinner />
            <Image
                className="dark"
                src={"/loading_logo.png"}
                alt=""
                width={120}
                height={71}
                draggable={false}
                style={ImageProperties}
            />
        </MainScreen>
    )
};

export default Loading;
