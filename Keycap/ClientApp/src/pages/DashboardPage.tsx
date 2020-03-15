import React, { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "rsuite";

import { AnimatedText } from "../components/AnimatedText";
import { useInterval } from "../hooks/useInterval";
import { getRandomArbitrary } from "../utils";

export const DashboardPage = () => {
    let [percentage, setPercentage] = useState(0);
    let [time, setTime] = useState(0);

    useInterval(() => {
        const acc = getRandomArbitrary(0, 5);

        acc + percentage >= 100
            ? setPercentage(100)
            : setPercentage(Math.floor(acc + percentage));
    }, percentage === 100 ? null : 100)

    useInterval(() => {
        setTime(time + 0.1);
    }, percentage === 100 ? null : 100)

    return (
        <>
            <div style={{ marginTop: "50px" }}>
                <AnimatedText text="find out your precision with keyboard." />
                <br />
                <motion.div initial="hidden" animate="visible" transition={{ delay: 0.8 }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <p>a skill-based typing game, that will test your accuracy & speed.</p>
                    <p>enjoy a game of <b>randomly selected, user created texts</b>, or <b>create & share</b> your texts to others.</p>
                </motion.div>
            </div>

            <motion.div style={{ marginTop: "50px" }}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
                <h5>shows useful stats.</h5>
                <br />

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Progress.Circle
                            strokeColor="#ffc107"
                            percent={73}
                            style={{ width: "100px" }}
                        />
                        <p style={{ marginTop: "10px" }}>Accuracy</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                        <h2 style={{ color: "#ec5a5af2" }}>4</h2>
                        <p>Key misses</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                        <h2 style={{ color: "#72b972" }}>193</h2>
                        <p>Key hits</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                        <h2 style={{ color: "#ffc107" }}>45 WPM</h2>
                        <p>Words per minute</p>
                    </div>
                </div>
            </motion.div>

            <motion.div style={{ marginTop: "50px" }}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
                <h5>tracks your progress.</h5>
                <br />

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: percentage === 100 ? "#72b972" : "grey" }}>{time.toFixed(1)}</h2>
                    <p>Time</p>
                </div>
                <Progress.Line
                    strokeColor="#ffc107"
                    percent={percentage}
                    status={percentage !== 100 ? "active" : "success"}
                    style={{ width: "500px" }}
                />
            </motion.div>
        </>
    );
};