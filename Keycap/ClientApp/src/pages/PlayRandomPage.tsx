import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Notification } from "rsuite";

import { AnimatedText } from "../components/AnimatedText";

export const PlayRandomPage: React.SFC = () => {
    const location = useLocation();
    const [gameId, setGameId] = useState<string>(
        location.pathname
            .replace("/play", "")
            .replace("/play/", "")
    );

    useEffect(() => {
        const getRandomId = async () => {
            try {
                const res = await fetch("/api/games/random", {
                    method: "GET",
                    mode: "same-origin",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                try {
                    const body = await res.json();
                    setGameId(body.gameID);
                } catch {
                    Notification["error"]({
                        title: "Error",
                        placement: "bottomStart",
                        description: "no game has been found."
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

        gameId === "" && getRandomId();
	}, [gameId]);

    return (
        <>
            <div style={{ marginTop: "50px" }}>
                <AnimatedText text="play game." />
            </div>

            {gameId !== "" && <Redirect to={`/play/${gameId}`} />}
        </>
	);
};