import { useReducer } from "react";

import { useInterval } from "./useInterval";

interface OwnState {
    time: number,
    isRunning: boolean;
}

type ActionTypes = "START_TIMER" | "STOP_TIMER" | "INCREMENT_TIMER";

const reducer: React.Reducer<OwnState, ActionTypes> = (prevState, action) => {
    switch (action) {
        case "START_TIMER":
            return { ...prevState, time: 0.0, isRunning: true };
        case "STOP_TIMER":
            return { ...prevState, isRunning: false };
        case "INCREMENT_TIMER":
            return { ...prevState, time: prevState.time + 0.1 };
        default:
            throw new Error();
    }
};

export const useCountupTimer = (): [number, boolean, () => void, () => void] => {
    const [state, dispatch] = useReducer(reducer, {
        time: 0.0,
        isRunning: false
    });

    useInterval(() => {
        dispatch("INCREMENT_TIMER");
    }, state.isRunning ? 100 : null);

    const startTimer = () => {
        dispatch("START_TIMER");
    };

    const stopTimer = () => {
        dispatch("STOP_TIMER");
    };

    return [state.time, state.isRunning, startTimer, stopTimer];
};
