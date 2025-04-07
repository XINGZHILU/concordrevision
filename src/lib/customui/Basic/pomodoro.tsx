'use client';


import React, { useState, useEffect, useRef } from "react";
import "./HorizontalPomodoro.css";
import "./ImprovedPomodoro.css"; // Import the improved styles

// Default values as constants
const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;
const DEFAULT_LONG_BREAK_TIME = 15 * 60;
const DEFAULT_POMODORO_COUNT = 4;

// Size modes enum
enum SizeMode {
  COLLAPSED = "collapsed",
  MEDIUM = "medium",
  FULL = "full"
}

// Format seconds into mm:ss display
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const HorizontalPomodoro: React.FC = () => {
    // Timer settings state
    const [workTime, setWorkTime] = useState<number>(DEFAULT_WORK_TIME);
    const [breakTime, setBreakTime] = useState<number>(DEFAULT_BREAK_TIME);
    const [longBreakTime, setLongBreakTime] = useState<number>(DEFAULT_LONG_BREAK_TIME);
    const [maxPomodoros, setMaxPomodoros] = useState<number>(DEFAULT_POMODORO_COUNT);
    
    // Timer functionality state
    const [timeLeft, setTimeLeft] = useState<number>(workTime);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isWorkInterval, setIsWorkInterval] = useState<boolean>(true);
    const [isLongBreak, setIsLongBreak] = useState<boolean>(false);
    const [sizeMode, setSizeMode] = useState<SizeMode>(SizeMode.MEDIUM);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [canResize, setCanResize] = useState<boolean>(true);
    
    // Session tracking state
    const [pomodoroCount, setPomodoroCount] = useState<number>(0);
    const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
    const [totalWorkTime, setTotalWorkTime] = useState<number>(0);
    
    // Task management state
    const [tasks, setTasks] = useState<Array<{id: number, text: string, completed: boolean, pomodoros: number}>>([]);
    const [newTaskText, setNewTaskText] = useState<string>("");
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [showTaskPanel, setShowTaskPanel] = useState<boolean>(false);
    
    // Position state for dragging
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const dragRef = useRef<HTMLDivElement>(null);
    
    // Audio references
    const workCompleteSound = useRef<HTMLAudioElement | null>(null);
    const breakCompleteSound = useRef<HTMLAudioElement | null>(null);
    
    // Initialize audio elements and drag functionality
    useEffect(() => {
        workCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3");
        breakCompleteSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3");
        
        // Add drag functionality
        const element = dragRef.current;
        if (!element) return;
        
        let posX = position.x;
        let posY = position.y;
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        
        const onMouseDown = (e: MouseEvent) => {
            // Don't initiate drag if clicking on buttons, inputs, etc.
            if (e.target instanceof HTMLInputElement || 
                e.target instanceof HTMLButtonElement || 
                e.target instanceof HTMLTextAreaElement) {
                return;
            }
            
            isDragging = true;
            offsetX = e.clientX - posX;
            offsetY = e.clientY - posY;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        };
        
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            posX = e.clientX - offsetX;
            posY = e.clientY - offsetY;
            
            element.style.transform = `translate(${posX}px, ${posY}px)`;
        };
        
        const onMouseUp = () => {
            if (!isDragging) return;
            
            isDragging = false;
            element.style.cursor = 'grab';
            
            setPosition({ x: posX, y: posY });
        };
        
        element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        return () => {
            if (workCompleteSound.current) workCompleteSound.current = null;
            if (breakCompleteSound.current) breakCompleteSound.current = null;
            
            element.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        
                        if (isWorkInterval) {
                            // Work session completed
                            const newPomodoroCount = pomodoroCount + 1;
                            setPomodoroCount(newPomodoroCount);
                            setCompletedPomodoros(prev => prev + 1);
                            setTotalWorkTime(prev => prev + workTime);
                            
                            // Update active task pomodoro count if applicable
                            if (activeTaskId !== null) {
                                setTasks(prevTasks => 
                                    prevTasks.map(task => 
                                        task.id === activeTaskId 
                                            ? { ...task, pomodoros: task.pomodoros + 1 }
                                            : task
                                    )
                                );
                            }
                            
                            // Should next break be a long break?
                            const shouldTakeLongBreak = newPomodoroCount % maxPomodoros === 0;
                            setIsLongBreak(shouldTakeLongBreak);
                            
                            // Play work complete sound
                            if (workCompleteSound.current) workCompleteSound.current.play();
                            
                            // Show browser notification
                            showNotification("Work session complete!", "Time for a break!");
                            
                            return shouldTakeLongBreak ? longBreakTime : breakTime;
                        } else {
                            // Break completed
                            if (breakCompleteSound.current) breakCompleteSound.current.play();
                            
                            // Show browser notification
                            showNotification("Break is over!", "Time to focus!");
                            
                            return workTime;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        
        return () => clearInterval(timer);
    }, [isRunning, isWorkInterval, workTime, breakTime, longBreakTime, pomodoroCount, maxPomodoros, activeTaskId]);

    // Update timer display when interval type changes
    useEffect(() => {
        if (isWorkInterval) {
            setTimeLeft(workTime);
            document.title = `Work - ${formatTime(workTime)}`;
        } else {
            setTimeLeft(isLongBreak ? longBreakTime : breakTime);
            document.title = `${isLongBreak ? 'Long Break' : 'Break'} - ${formatTime(isLongBreak ? longBreakTime : breakTime)}`;
        }
        
        setIsRunning(false);
        setShowPopup(true);
    }, [isWorkInterval, isLongBreak, workTime, breakTime, longBreakTime]);

    // Update document title with timer progress
    useEffect(() => {
        const intervalType = isWorkInterval ? 'Work' : (isLongBreak ? 'Long Break' : 'Break');
        const taskText = activeTaskId !== null 
            ? ` - ${tasks.find(t => t.id === activeTaskId)?.text.substring(0, 20)}${tasks.find(t => t.id === activeTaskId)?.text.length > 20 ? '...' : ''}`
            : '';
        document.title = `${intervalType} - ${formatTime(timeLeft)}${taskText}`;
        
        return () => {
            document.title = 'Pomodoro Timer';
        };
    }, [timeLeft, isWorkInterval, isLongBreak, activeTaskId, tasks]);

    // Display browser notifications if allowed
    const showNotification = (title: string, body: string) => {
        if (!("Notification" in window)) {
            console.log("Browser doesn't support notifications");
            return;
        }
        
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body });
                }
            });
        }
    };

    // Timer control handlers
    const handleStartPause = () => {
        setIsRunning(!isRunning);
        if (showPopup) setShowPopup(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(workTime);
        setIsWorkInterval(true);
        setIsLongBreak(false);
        setShowPopup(false);
    };

    const handleSkip = () => {
        setIsWorkInterval(!isWorkInterval);
    };

    const handleFullReset = () => {
        handleReset();
        setWorkTime(DEFAULT_WORK_TIME);
        setBreakTime(DEFAULT_BREAK_TIME);
        setLongBreakTime(DEFAULT_LONG_BREAK_TIME);
        setMaxPomodoros(DEFAULT_POMODORO_COUNT);
        setPomodoroCount(0);
        setCompletedPomodoros(0);
        setTotalWorkTime(0);
    };

    // Time input handlers
    const handleTimeChange = (
        e: React.ChangeEvent<HTMLInputElement>, 
        type: 'minutes' | 'seconds',
        timeType: 'work' | 'break' | 'longBreak'
    ) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) return;
        
        let currentTime: number, setterFunction: React.Dispatch<React.SetStateAction<number>>;
        
        switch (timeType) {
            case 'work':
                currentTime = workTime;
                setterFunction = setWorkTime;
                break;
            case 'break':
                currentTime = breakTime;
                setterFunction = setBreakTime;
                break;
            case 'longBreak':
                currentTime = longBreakTime;
                setterFunction = setLongBreakTime;
                break;
        }
        
        const newTime = type === 'minutes' 
            ? value * 60 + (currentTime % 60)
            : Math.floor(currentTime / 60) * 60 + value;
        
        setterFunction(newTime);
        
        // Update timeLeft if this is the current interval type
        if (
            (timeType === 'work' && isWorkInterval) || 
            (timeType === 'break' && !isWorkInterval && !isLongBreak) ||
            (timeType === 'longBreak' && !isWorkInterval && isLongBreak)
        ) {
            setTimeLeft(newTime);
        }
    };

    // Task management handlers
    const addNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        
        const newTask = {
            id: Date.now(),
            text: newTaskText.trim(),
            completed: false,
            pomodoros: 0
        };
        
        setTasks([...tasks, newTask]);
        setNewTaskText("");
        
        // If no task is active, make this one active
        if (activeTaskId === null) {
            setActiveTaskId(newTask.id);
        }
    };
    
    const toggleTaskCompletion = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };
    
    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
        if (activeTaskId === id) {
            setActiveTaskId(null);
        }
    };
    
    const setActiveTask = (id: number) => {
        setActiveTaskId(id);
    };

    // UI size mode handlers
    const cycleSize = () => {
        if (!canResize) return;
        
        // Cycle through size modes
        if (sizeMode === SizeMode.COLLAPSED) {
            setSizeMode(SizeMode.MEDIUM);
        } else if (sizeMode === SizeMode.MEDIUM) {
            setSizeMode(SizeMode.FULL);
        } else {
            setSizeMode(SizeMode.COLLAPSED);
        }
    };

    const toggleCanResize = () => {
        setCanResize(!canResize);
    };

    const toggleTaskPanel = () => {
        setShowTaskPanel(!showTaskPanel);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    // Calculate progress for progress bar
    const calculateProgress = () => {
        const totalTime = isWorkInterval ? workTime : (isLongBreak ? longBreakTime : breakTime);
        return ((totalTime - timeLeft) / totalTime) * 100;
    };
    
    // Calculate time left in current pomodoro cycle
    const pomodorosUntilLongBreak = maxPomodoros - (pomodoroCount % maxPomodoros);

    // Get size button text based on current mode
    const getSizeButtonText = () => {
        switch (sizeMode) {
            case SizeMode.COLLAPSED:
                return "+";
            case SizeMode.MEDIUM:
                return "⬚";
            case SizeMode.FULL:
                return "−";
            default:
                return "⬚";
        }
    };

    // Function to render task panel content to avoid duplication
    const renderTaskPanel = () => (
        <>
            <h3>Tasks</h3>
            
            <form onSubmit={addNewTask} className="add-task-form">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="task-input"
                />
                <button type="submit" className="add-task-button">+</button>
            </form>
            
            <div className="task-list">
                {tasks.length === 0 ? (
                    <div className="empty-tasks">No tasks yet. Add one to get started!</div>
                ) : (
                    tasks.map(task => (
                        <div 
                            key={task.id}
                            className={`task-item ${task.completed ? "completed" : ""} ${activeTaskId === task.id ? "active-task" : ""}`}
                        >
                            <div className="task-checkbox">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    id={`task-${task.id}`}
                                />
                            </div>
                            
                            <div 
                                className="task-text"
                                onClick={() => setActiveTask(task.id)}
                            >
                                {task.text}
                            </div>
                            
                            <div className="task-pomodoros">
                                {task.pomodoros > 0 && `🍅 ${task.pomodoros}`}
                            </div>
                            
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="delete-task-button"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );

    return (
        <div 
            ref={dragRef}
            className={`pomodoro ${sizeMode}`}
            style={{
                position: 'fixed',
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: 999
            }}
        >
            <div className="horizontal-layout">
                <div className="timer-section">
                    <div className="drag-handle">
                        <span className="drag-icon">⋮⋮</span>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleCanResize(); }} 
                            className={`lock-button ${!canResize ? "locked" : ""}`}
                            title={canResize ? "Lock size state" : "Unlock size state"}
                        >
                            {canResize ? "🔓" : "🔒"}
                        </button>
                        
                        {sizeMode !== SizeMode.COLLAPSED && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleTaskPanel(); }} 
                                className={`task-button ${showTaskPanel ? "active" : ""}`}
                                title="Toggle task panel"
                            >
                                📋
                            </button>
                        )}
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); cycleSize(); }} 
                            className="size-button"
                            disabled={!canResize}
                            title="Change size"
                        >
                            {getSizeButtonText()}
                        </button>
                    </div>
                    
                    {sizeMode !== SizeMode.COLLAPSED && (
                        <>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${calculateProgress()}%` }}
                                />
                            </div>
                            
                            <div className="interval-indicator">
                                <div className="interval">
                                    {isWorkInterval 
                                        ? "FOCUS TIME" 
                                        : (isLongBreak ? "LONG BREAK" : "SHORT BREAK")}
                                </div>
                                
                                {activeTaskId !== null && (
                                    <div className="active-task-display">
                                        {tasks.find(t => t.id === activeTaskId)?.text}
                                    </div>
                                )}
                            </div>
                            
                            <div className="timer">
                                {formatTime(timeLeft)}
                            </div>
                            
                            <div className="controls">
                                <button onClick={handleStartPause} className="primary-button">
                                    {isRunning ? "Pause" : "Start"}
                                </button>
                                <button onClick={handleReset} className="secondary-button">Reset</button>
                                <button onClick={handleSkip} className="secondary-button">Skip</button>
                            </div>
                        </>
                    )}
                    
                    {/* Collapsed mode only displays minimal info */}
                    {sizeMode === SizeMode.COLLAPSED && (
                        <div className="collapsed-content">
                            <div className="collapsed-timer">
                                {formatTime(timeLeft)}
                            </div>
                            <button onClick={handleStartPause} className="collapsed-button">
                                {isRunning ? "⏸" : "▶"}
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="details-section">
                    {/* Stats - visible in medium & full mode */}
                    {sizeMode !== SizeMode.COLLAPSED && (
                        <div className="stats">
                            <div className="stat-item">
                                <div className="stat-icon">✓</div>
                                <div className="stat-value">{completedPomodoros}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">⏱</div>
                                <div className="stat-value">{pomodorosUntilLongBreak}</div>
                                <div className="stat-label">Until Break</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">⌛</div>
                                <div className="stat-value">{Math.floor(totalWorkTime / 60)}</div>
                                <div className="stat-label">Minutes</div>
                            </div>
                        </div>
                    )}
                    
                    {/* Task panel for MEDIUM mode - Inside details-section */}
                    {showTaskPanel && sizeMode === SizeMode.MEDIUM && (
                        <div className="task-panel medium-tasks">
                            {renderTaskPanel()}
                        </div>
                    )}
                    
                    {/* Settings - only in full mode */}
                    {sizeMode === SizeMode.FULL && (
                        <div className="settings">
                            <h3>Timer Settings</h3>
                            <div className="settings-row">
                                <div className="time-input">
                                    <label>Work Time</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={Math.floor(workTime / 60) || ''}
                                        onChange={(e) => handleTimeChange(e, 'minutes', 'work')}
                                    />
                                    min
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={workTime % 60 || ''}
                                        onChange={(e) => handleTimeChange(e, 'seconds', 'work')}
                                    />
                                    sec
                                </div>
                                
                                <div className="time-input">
                                    <label>Break Time</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={Math.floor(breakTime / 60) || ''}
                                        onChange={(e) => handleTimeChange(e, 'minutes', 'break')}
                                    />
                                    min
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={breakTime % 60 || ''}
                                        onChange={(e) => handleTimeChange(e, 'seconds', 'break')}
                                    />
                                    sec
                                </div>
                                
                                <div className="time-input">
                                    <label>Long Break</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={Math.floor(longBreakTime / 60) || ''}
                                        onChange={(e) => handleTimeChange(e, 'minutes', 'longBreak')}
                                    />
                                    min
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={longBreakTime % 60 || ''}
                                        onChange={(e) => handleTimeChange(e, 'seconds', 'longBreak')}
                                    />
                                    sec
                                </div>
                                
                                <div className="time-input">
                                    <label>Cycle Length</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={maxPomodoros || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (!isNaN(value) && value > 0) {
                                                setMaxPomodoros(value);
                                            }
                                        }}
                                    />
                                    pomodoros
                                </div>
                            </div>
                            
                            <button onClick={handleFullReset} className="danger-button">
                                Reset All Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Task panel - Only shown outside layout for FULL mode */}
            {showTaskPanel && sizeMode === SizeMode.FULL && (
                <div className="task-panel">
                    {renderTaskPanel()}
                </div>
            )}
            
            {/* Popup notifications */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>
                            {isWorkInterval 
                                ? "Time to Focus!" 
                                : (isLongBreak ? "Take a Long Break!" : "Break Time!")}
                        </h2>
                        <p>
                            {isWorkInterval 
                                ? "Your break is over. Let's get back to focused work." 
                                : "Great job! You've earned a break."}
                        </p>
                        <div className="popup-buttons">
                            <button onClick={handleStartPause} className="primary-button">
                                Start {isWorkInterval ? "Working" : "Break"}
                            </button>
                            <button onClick={closePopup} className="secondary-button">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorizontalPomodoro;