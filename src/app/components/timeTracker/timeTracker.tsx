"use client";
import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import styles from "./timeTracker.module.css";
import updateTime from "@/firebase/updateTime";

interface dataObject {
  id: string;
  createdAt: string;
  timeLogged: { hours: number; minutes: number; seconds: number };
  timestamp: number;
  description: string;
}

interface TimeTracker {
  rowId: number;
  data: dataObject;
  trackers: Tracker[];
}

interface Tracker {
  id: string;
  description: string;
  timeLogged: string;
  createdAt: string;
  timestamp: number;
}

const TimeTracker: React.FC<TimeTracker> = (props) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const {
    user,
    timerId,
    start,
    isTimerActive,
    setIsTimerActive,
    resume,
    stop,
    setStop,
    deleteTimer,
    stopAll,
    setStopAll,
    changeDescription,
  } = useAuthContext();

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const startStopwatch = () => {
    startTimeRef.current =
      Date.now() -
      (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;
    intervalRef.current = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      setTime(formatTime(elapsedTimeInSeconds));
    }, 1000);
  };

  const pauseStopwatch = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

  const updateTimerTime = async () => {
    const { result, error } = await updateTime(user?.uid, props.data.id, time);
    if (result) console.error(result);
    if (error) console.error(error);
  };

  useEffect(() => {
    if (timerId == props.rowId && start && !isTimerActive) {
      startStopwatch();
      setIsTimerActive(true);
    } else if (timerId == props.rowId && resume && isTimerActive) {
      props.data.timeLogged = time;
      pauseStopwatch();
      setIsTimerActive(false);
    } else if (timerId == props.rowId && stop && isTimerActive) {
      props.data.timeLogged = time;
      pauseStopwatch();
      updateTimerTime();
      setIsTimerActive(false);
      setStop(false);
    } else if (timerId == props.rowId && stopAll) {
      props.data.timeLogged = time;
      pauseStopwatch();
      updateTimerTime();
      setIsTimerActive(false);
      setStopAll(false);
    }
  }, [timerId, start, isTimerActive, resume, stop, deleteTimer, stopAll]);

  useEffect(() => {
    if (resume || deleteTimer) setTime(props.data.timeLogged);
    setTime(props.data.timeLogged);
  }, [resume, deleteTimer, changeDescription, stop]);

  return (
    <div
      className={
        timerId == props.rowId ? "font-bold text-lg" : "font-semibold text-lg"
      }
    >
      {`${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(
        2,
        "0"
      )}:${String(time.seconds).padStart(2, "0")}`}
    </div>
  );
};

export default TimeTracker;
