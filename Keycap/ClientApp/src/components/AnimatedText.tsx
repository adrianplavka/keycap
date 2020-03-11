import React from "react";
import { Frame } from "framer";

interface OwnProps {
    text: string;
}

export const AnimatedText: React.FC<OwnProps> = (props: OwnProps) => {
    const string = Array.from(props.text);

    // Add staggering effect to the children of the container
    const containerVariants = {
        before: {},
        after: { transition: { staggerChildren: 0.02 } },
    }

    // Variants for animating each letter
    const letterVariants = {
        before: {
            opacity: 0,
            y: 0,
            transition: {
                type: "spring",
                damping: 16,
                stiffness: 200,
            },
        },
        after: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 16,
                stiffness: 200,
            },
        },
    }

    return (
        <Frame
            center={"y"}
            height={26}
            width={"100%"}
            background={""}
            style={{
                top: 0,
                position: "relative",
                fontFamily: "Montserrat, Work Sans, sans-serif",
                fontWeight: "bold",
                letterSpacing: "-0.04em",
                fontSize: 26,
                color: "#FFF",
                display: "flex", // Set the display value to flex
                transform: "",
            }}
            variants={containerVariants}
            initial={"before"}
            animate={"after"}
        >
            {string.map((letter, index) => (
                <Frame
                    key={index}
                    width={"auto"} // Set the width to the width of the letter
                    height={26} // Set the height to the height of the text
                    background={""}
                    style={{ position: "relative", transform: "", }} // Position elements
                    variants={letterVariants}
                >
                    {letter === " " ? "\u00A0" : letter}
                </Frame>
            ))}
        </Frame>
    );
}