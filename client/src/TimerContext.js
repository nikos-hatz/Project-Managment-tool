import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [taskId, setTaskId] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        let id;
        if (isRunning) {
            id = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
            setIntervalId(id);
        }
        return () => clearInterval(id);
    }, [isRunning]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    const startTimer = (id) => {
        if (!isRunning) {
            setTaskId(id);
            console.log(taskId)
            setIsRunning(true);
        }
    };


    const pauseTimer = () => {
        if (isRunning) {
            clearInterval(intervalId);
            setIsRunning(false);
        }
    };

    const stopTimer = async () => {
        console.log(taskId)
        if (taskId) {
            try {
                const taskRef = doc(db, "tasks", taskId);
                await updateDoc(taskRef, {
                    totalTimeSpentInSeconds: increment(elapsedTime),
                });
                console.log(`Time logged: ${elapsedTime} seconds`);
            } catch (error) {
                console.error("Error saving time:", error);
            }
        }
        setTaskId(null);
        setElapsedTime(0);
    };

    return (
        <TimerContext.Provider value={{ isRunning, elapsedTime, formatTime, startTimer, pauseTimer, stopTimer, taskId }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
