import React, { useState, useEffect } from "react";
import styles from "./Pomodoro.module.css";

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const Pomodoro: React.FC = () => {
    const [workTime, setWorkTime] = useState<number>(WORK_TIME);
    const [breakTime, setBreakTime] = useState<number>(BREAK_TIME);
    const [timeLeft, setTimeLeft] = useState<number>(workTime);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isWorkInterval, setIsWorkInterval] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setIsRunning(false);
                        setIsWorkInterval(!isWorkInterval);
                        setShowPopup(true);
                        return isWorkInterval ? breakTime : workTime;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, isWorkInterval, workTime, breakTime]);

    useEffect(() => {
        setTimeLeft(isWorkInterval ? workTime : breakTime);
    }, [isWorkInterval, workTime, breakTime]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setWorkTime(WORK_TIME);
        setBreakTime(BREAK_TIME);
        setTimeLeft(WORK_TIME);
        setIsWorkInterval(true);
    };

    const handleWorkTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minutes' | 'seconds') => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) return;
        const newWorkTime = type === 'minutes'
            ? value * 60 + (workTime % 60)
            : Math.floor(workTime / 60) * 60 + value;
        setWorkTime(newWorkTime);
        if (isWorkInterval) {
            setTimeLeft(newWorkTime);
        }
    };

    const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'minutes' | 'seconds') => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) return;
        const newBreakTime = type === 'minutes'
            ? value * 60 + (breakTime % 60)
            : Math.floor(breakTime / 60) * 60 + value;
        setBreakTime(newBreakTime);
        if (!isWorkInterval) {
            setTimeLeft(newBreakTime);
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className={`${styles.pomodoro} ${isCollapsed ? styles.collapsed : ""}`}>
            <button onClick={toggleCollapse} className={styles.collapseButton}>
                {isCollapsed ? "+" : "-"}
            </button>
            {!isCollapsed && (
                <>
                    <h1>Pomodoro Timer</h1>
                    <div className={styles.timeLeft}>
                        {isWorkInterval ? "Study Time Left" : "Break Time Left"}
                    </div>
                    <div className={styles.timer}>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <div className={styles.controls}>
                        <button onClick={handleStartPause}>
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button onClick={handleReset}>Reset</button>
                    </div>
                    <div className={styles.interval}>
                        {isWorkInterval ? "Work Interval" : "Break Interval"}
                    </div>
                    <div className={styles.settings}>
                        <label className={styles.timeInput}>
                            Work Time:
                            <input
                                type="number"
                                value={Math.floor(workTime / 60) || ''}
                                onChange={(e) => handleWorkTimeChange(e, 'minutes')}
                            />
                            :
                            <input
                                type="number"
                                value={workTime % 60 || ''}
                                onChange={(e) => handleWorkTimeChange(e, 'seconds')}
                            />
                        </label>
                        <label className={styles.timeInput}>
                            Break Time:
                            <input
                                type="number"
                                value={Math.floor(breakTime / 60) || ''}
                                onChange={(e) => handleBreakTimeChange(e, 'minutes')}
                            />
                            :
                            <input
                                type="number"
                                value={breakTime % 60 || ''}
                                onChange={(e) => handleBreakTimeChange(e, 'seconds')}
                            />
                        </label>
                    </div>
                </>
            )}
            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <p>{isWorkInterval ? "Work Time!" : "Break Time!"}</p>
                        <button onClick={closePopup} className={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pomodoro;
