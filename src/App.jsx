import { useEffect, useRef, useState } from "react";

export default function App() {
  const [breakLen, setBreakLen] = useState(5);
  const [sessionLen, setSessionLen] = useState(25);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [mode, setMode] = useState("Session");

  const intervalRef = useRef(null);
  const beepRef = useRef(null);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);

    setBreakLen(5);
    setSessionLen(25);
    setTimeLeft(25 * 60);
    setMode("Session");
    setIsRunning(false);

    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          beepRef.current.play();

          if (mode === "Session") {
            setMode("Break");
            return breakLen * 60;
          } else {
            setMode("Session");
            return sessionLen * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, breakLen, sessionLen]);

  const changeBreak = (val) => {
    setBreakLen((prev) => {
      let next = prev + val;
      if (next < 1 || next > 60) return prev;
      return next;
    });
  };

  const changeSession = (val) => {
    setSessionLen((prev) => {
      let next = prev + val;
      if (next < 1 || next > 60) return prev;

      if (!isRunning && mode === "Session") {
        setTimeLeft(next * 60);
      }

      return next;
    });
  };

  return (
    <div className="app">
      <h1>25 + 5 Clock</h1>

      <div className="controls">

        {/* BREAK */}
        <div className="box">
          <h2 id="break-label">Break Length</h2>

          <button id="break-decrement" onClick={() => changeBreak(-1)}>-</button>
          <span id="break-length">{breakLen}</span>
          <button id="break-increment" onClick={() => changeBreak(1)}>+</button>
        </div>

        {/* SESSION */}
        <div className="box">
          <h2 id="session-label">Session Length</h2>

          <button id="session-decrement" onClick={() => changeSession(-1)}>-</button>
          <span id="session-length">{sessionLen}</span>
          <button id="session-increment" onClick={() => changeSession(1)}>+</button>
        </div>
      </div>

      {/* TIMER */}
      <div className="timer">
        <h2 id="timer-label">{mode}</h2>
        <h1 id="time-left">{formatTime(timeLeft)}</h1>
      </div>

      {/* CONTROLS */}
      <div className="buttons">
        <button id="start_stop" onClick={handleStartStop}>
          Start / Stop
        </button>

        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* AUDIO */}
      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
    </div>
  );
}