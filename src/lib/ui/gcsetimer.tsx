import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./Timer2.module.css";

const Timer2 = () => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const targetDate = new Date("2025-06-20T17:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            setDays(d);
            setHours(h);
            setMinutes(m);
            setSeconds(s);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>GCSE countdown</title>
            </Head>
            <div className={styles.timer}>
                <h1 className={styles.title}>Days till Summer Holidays!</h1>
                <div className={styles.time}>
                    <div className={styles.timeSegment}>
                        <span className={styles.number}>{days}</span>
                        <span className={styles.label}>Days</span>
                    </div>
                    <div className={styles.timeSegment}>
                        <span className={styles.number}>{hours}</span>
                        <span className={styles.label}>Hours</span>
                    </div>
                    <div className={styles.timeSegment}>
                        <span className={styles.number}>{minutes}</span>
                        <span className={styles.label}>Minutes</span>
                    </div>
                    <div className={styles.timeSegment}>
                        <span className={styles.number}>{seconds}</span>
                        <span className={styles.label}>Seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timer2;