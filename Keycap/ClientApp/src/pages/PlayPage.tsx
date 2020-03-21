import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Divider, InputGroup, Input, Notification, Progress, Tag } from "rsuite";

import { AnimatedText } from "../components/AnimatedText";
import { useCountupTimer } from "../hooks/useCountupTimer";
import { equalCharactersLength } from "../utils";

interface GameDetails {
    gameID: string;
    title: string;
    label: 0 | 1 | 2; // Easy, medium, hard
    text: string;
    createdAt: Date;
}

interface GameAvgStatsDetails {
    avgKeyHits: number;
    avgKeyMisses: number;
    avgAccuracy: number;
    avgWPM: number;
    avgTime: number;
}

const createTag = (label: 0 | 1 | 2 | undefined) => {
    switch (label) {
        case 0:
            return <Tag color="green" style={{ marginRight: "10px" }}>easy</Tag>;
        case 1:
            return <Tag color="blue" style={{ marginRight: "10px" }}>medium</Tag>;
        case 2:
            return <Tag color="red" style={{ marginRight: "10px" }}>hard</Tag>;
        default:
            return <span />;
    }
};

const createAvgScreen = (details: GameAvgStatsDetails) => {
    return (
        <>
            <Divider />
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ color: "#72b972" }}>{details.avgTime.toFixed(1)}</h2>
                    <p>Average time</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: "#ec5a5af2" }}>{details.avgKeyMisses.toFixed(1)}</h2>
                    <p>Average key misses</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "20px" }}>
                    <Progress.Circle
                        strokeColor="#ffc107"
                        percent={Number(details.avgAccuracy.toFixed(1))}
                        style={{ width: "100px" }}
                    />
                    <p style={{ marginTop: "10px" }}>Average accuracy</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: "#ffc107" }}>
                        {details.avgWPM} WPM
                    </h2>
                    <p>Average words per minute</p>
                </div>
            </div>
        </>
    );
}

export const PlayPage: React.SFC = () => {
    const location = useLocation();

    let [time, isTimerRunning, startTimer, stopTimer] = useCountupTimer();
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [isGameFinished, setGameFinished] = useState(false);
    const [equalTextLength, setEqualTextLength] = useState(0);
    const [keyHits, setKeyHits] = useState(0);
    const [keyMisses, setKeyMisses] = useState(0);
    const [totalKeyHits, setTotalKeyHits] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [avgStats, setAvgStats] = useState<React.ReactNode>(<span />);

    const gameId = location.pathname.replace("/play/", "");

    const resetGame = () => {
        setGameFinished(false);
        setEqualTextLength(0);
        setKeyHits(0);
        setKeyMisses(0);
        setTotalKeyHits(0);
        setWpm(0);
        stopTimer();
    };

    useEffect(() => {
        if (isTimerRunning) {
            setWpm(gameDetails?.text.substr(0, equalTextLength).split(" ").length ?? 0 / (time / 60));
        }
    }, [time]);

    const onChangeInput = (value: string, event: any) => {
        if (!isTimerRunning) {
            startTimer();
        }

        if (value === gameDetails?.text) {
            stopTimer();
            setGameFinished(true);
        }

        const newEqualTextLength = equalCharactersLength(gameDetails?.text ?? "", value);

        if (newEqualTextLength > equalTextLength) {
            // Key hit.
            setEqualTextLength(newEqualTextLength);
            setKeyHits(keyHits + 1);
        } else if (newEqualTextLength === equalTextLength) {
            // Key miss.
            setKeyMisses(keyMisses + 1);
        } else if (newEqualTextLength === 0) {
            resetGame();
            return;
        } else {
            // Backspace.
            setEqualTextLength(newEqualTextLength);
        }

        setTotalKeyHits(totalKeyHits + 1);
    };

    useEffect(() => {
        const getGameDetails = async () => {
            try {
                const res = await fetch(`/api/games/${gameId}`, {
                    method: "GET",
                    mode: "same-origin",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                try {
                    const body = await res.json();
                    setGameDetails({
                        ...body,
                        createdAt: new Date(body.createdAt),
                    });
                } catch {
                    Notification["error"]({
                        title: "Error",
                        placement: "bottomStart",
                        description: "game has not been found."
                    })
                }
            } catch {
                Notification["error"]({
                    title: "Error",
                    placement: "bottomStart",
                    description: "an error has occured while sending your request."
                });
            }
        };

        getGameDetails();
    }, [gameId]);

    useEffect(() => {
        const postGameStats = async () => {
            if (isGameFinished) {
                try {
                    await fetch(`/api/games/${gameId}/stats`, {
                        method: "POST",
                        mode: "same-origin",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            Time: Number(time.toFixed(1)),
                            KeyHits: keyHits,
                            KeyMisses: keyMisses,
                            Accuracy: Number(((keyHits / (totalKeyHits === 0 ? 1 : totalKeyHits)) * 100).toFixed(0)),
                            WPM: wpm,
                        })
                    });
                } catch {
                    Notification["error"]({
                        title: "Error",
                        placement: "bottomStart",
                        description: "an error has occured while sending your request."
                    });
                }

                try {
                    const res = await fetch(`/api/games/${gameId}/stats/avg`, {
                        method: "GET",
                        mode: "same-origin",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    try {
                        const body = await res.json() as GameAvgStatsDetails;
                        setAvgStats(createAvgScreen(body));
                    } catch {
                        Notification["error"]({
                            title: "Error",
                            placement: "bottomStart",
                            description: "game has not been found."
                        })
                    }
                } catch {
                    Notification["error"]({
                        title: "Error",
                        placement: "bottomStart",
                        description: "an error has occured while sending your request."
                    });
                }
            }
        }

        postGameStats();
    }, [isGameFinished]);

    return (
        <>
            <div style={{ marginTop: "50px" }}>
                <AnimatedText text={gameDetails?.title ?? ""} />
            </div>

            {createTag(gameDetails?.label)}
            {gameDetails?.createdAt.toLocaleString() ?? ""}

            <br />

            <Progress.Line
                strokeColor="#ffc107"
                percent={Number(((equalTextLength / (gameDetails?.text.length ?? 0)) * 100).toFixed(0))}
                status={isGameFinished ? "success" : "active"}
                style={{ marginLeft: "-10px", width: "500px" }}
            />

            <h4 style={{
                width: "500px",
                marginTop: "30px",
                userSelect: "none",
                whiteSpace: "pre-line"
            }}>
                <span style={{ border: "1px solid #72b972", borderRadius: "2px", color: "#72b972" }}>
                    {gameDetails?.text.substr(0, equalTextLength).replace(/\n/g, "⏎\n") ?? ""}
                </span>
                <span style={{ color: "grey" }}>
                    {gameDetails?.text.substr(equalTextLength, gameDetails?.text.length).replace(/\n/g, "⏎\n") ?? ""}
                </span>
            </h4>

            <InputGroup style={{ marginTop: "20px" }}>
                <Input
                    componentClass="textarea"
                    placeholder="start the game by typing here"
                    onChange={onChangeInput}
                    disabled={isGameFinished}
                />
            </InputGroup>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "30px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ color: isGameFinished ? "#72b972" : "grey" }}>{time.toFixed(1)}</h2>
                    <p>Time</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: "#72b972" }}>{keyHits}</h2>
                    <p>Key hits</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: "#ec5a5af2" }}>{keyMisses}</h2>
                    <p>Key misses</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "20px" }}>
                    <Progress.Circle
                        strokeColor="#ffc107"
                        percent={Number(((keyHits / (totalKeyHits === 0 ? 1 : totalKeyHits)) * 100).toFixed(0))}
                        style={{ width: "100px" }}
                    />
                    <p style={{ marginTop: "10px" }}>Accuracy</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                    <h2 style={{ color: "#ffc107" }}>
                        {wpm} WPM
                    </h2>
                    <p>Words per minute</p>
                </div>
            </div>

            {avgStats}
        </>
    );
};