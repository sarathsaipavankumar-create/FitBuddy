/**
 * ============================================================================
 * FitBuddy - Workout Interval Timer Controller (workout-timer.js)
 * Clean, lightweight, timestamp-accurate workout timer with:
 * 1. Timestamp delta calculation (resilient to browser tab backgrounding).
 * 2. Full state management: Start, Pause, Resume, Reset.
 * 3. Work Interval and Rest Countdown transitions.
 * 4. Skip Rest capability.
 * 5. Previous / Next exercise navigation.
 * 6. Set tracking (Set X of Y) and self-guided repetition target.
 * 7. Multi-timer collision prevention.
 * 8. Friendly celebratory completion screen.
 * 9. Movement animation rendering for current exercise.
 * ============================================================================
 */

// Global Timer State
let timerInterval = null;
let timerPhase = 'WORK';    // 'WORK' or 'REST'
let timerState = 'IDLE';    // 'IDLE', 'RUNNING', 'PAUSED', 'COMPLETED'

let remainingMs = 45 * 1000;
let initialIntervalMs = 45 * 1000;
let targetEndTime = null;

let workoutList = [];
let activeExerciseIndex = 0;
let currentSet = 1;
let totalSets = 3;
let currentRepsCount = 12;

let workoutStartTime = null;
let totalCompletedSets = 0;
let soundEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  initWorkoutSession();
  bindTimerControls();
});

/**
 * Initializes the workout list based on URL parameters or default routine
 */
function initWorkoutSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedId = urlParams.get('id');
  const requestedName = urlParams.get('exercise');

  // Build workout sequence from master EXERCISES
  if (typeof EXERCISES !== 'undefined' && EXERCISES.length > 0) {
    let primaryEx = null;
    if (requestedId) {
      primaryEx = EXERCISES.find(e => e.id === requestedId);
    } else if (requestedName) {
      primaryEx = EXERCISES.find(e => e.name.toLowerCase() === requestedName.toLowerCase());
    }

    if (primaryEx) {
      // Build a 4-5 exercise sequence starting with the chosen exercise
      const complementary = EXERCISES.filter(e => e.id !== primaryEx.id);
      workoutList = [primaryEx, complementary[0], complementary[1], complementary[2], complementary[3]];
    } else {
      // Default 5-exercise home routine featuring animated exercises
      const pushup = EXERCISES.find(e => e.id === 'push-ups') || EXERCISES[0];
      const curl = EXERCISES.find(e => e.id === 'dumbbell-curl') || EXERCISES[5];
      const squat = EXERCISES.find(e => e.id === 'bodyweight-squats') || EXERCISES[15];
      const press = EXERCISES.find(e => e.id === 'dumbbell-shoulder-press') || EXERCISES[9];
      const plank = EXERCISES.find(e => e.id === 'plank') || EXERCISES[14];
      workoutList = [pushup, curl, squat, press, plank];
    }
  } else {
    // Standalone fallback object if EXERCISES dataset not loaded
    workoutList = [{
      id: 'push-ups',
      name: 'Push-ups',
      category: 'Chest',
      requiredEquipment: 'No Equipment',
      musclesTargeted: 'Pectoralis Major, Triceps, Core',
      sets: '3 Sets',
      reps: '10 - 15 Reps',
      restDuration: '45 Seconds',
      iconType: 'chest-push'
    }];
  }

  activeExerciseIndex = 0;
  currentSet = 1;
  loadActiveExercise();
}

/**
 * Parses numeric seconds from reps or rest strings like '45 Seconds' or '10 - 15 Reps'
 * @param {string} str 
 * @param {number} fallback 
 * @returns {number}
 */
function parseDurationSeconds(str, fallback = 45) {
  if (!str) return fallback;
  const num = parseInt(str, 10);
  if (isNaN(num)) return fallback;
  // If rep count (e.g. 10 - 15 reps), set a 45 second standard work window
  if (str.toLowerCase().includes('rep')) return 45;
  return num;
}

/**
 * Loads the active exercise into the timer UI, sets, reps, and animation
 */
function loadActiveExercise() {
  const activeEx = workoutList[activeExerciseIndex];
  if (!activeEx) return;

  // Exercise text headers
  const titleEl = document.getElementById('timerExerciseName');
  const metaEl = document.getElementById('timerExerciseMeta');
  const indexEl = document.getElementById('timerExerciseIndex');
  const progressBar = document.getElementById('sessionProgressBar');

  if (titleEl) titleEl.textContent = activeEx.name;
  if (metaEl) metaEl.textContent = `${activeEx.category} • ${activeEx.requiredEquipment} • ${activeEx.musclesTargeted.split(',')[0]}`;
  if (indexEl) indexEl.textContent = `Exercise ${activeExerciseIndex + 1} of ${workoutList.length}`;

  if (progressBar) {
    const pct = ((activeExerciseIndex) / workoutList.length) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Parse sets (e.g. '3 - 4 Sets' -> 3)
  totalSets = parseInt(activeEx.sets, 10) || 3;
  const workSeconds = parseDurationSeconds(activeEx.reps, 45);

  timerPhase = 'WORK';
  timerState = 'IDLE';
  remainingMs = workSeconds * 1000;
  initialIntervalMs = remainingMs;

  // Load Animation
  const animContainer = document.getElementById('timerAnimationContainer');
  if (animContainer && typeof getExerciseMovementAnimation === 'function') {
    animContainer.innerHTML = getExerciseMovementAnimation(activeEx.id);
  }

  // Set / Rep targets
  updateSetAndRepDisplay(activeEx);
  updatePhaseUI();
  updateDisplay();
  updateControlsUI();
}

/**
 * Updates Set counter and user-guided repetition targets
 * @param {object} activeEx 
 */
function updateSetAndRepDisplay(activeEx) {
  const setCounterEl = document.getElementById('timerSetCounter');
  const repTargetEl = document.getElementById('timerRepTarget');
  const repCountDisplay = document.getElementById('userRepCountDisplay');

  if (setCounterEl) {
    setCounterEl.textContent = `Set ${currentSet} of ${totalSets}`;
  }

  if (repTargetEl) {
    repTargetEl.textContent = `Target: ${activeEx.reps}`;
  }

  // Initial user logged reps
  currentRepsCount = parseInt(activeEx.reps, 10) || 12;
  if (repCountDisplay) {
    repCountDisplay.textContent = `${currentRepsCount} Reps`;
  }
}

/**
 * Updates the big countdown clock display (mm:ss) and interval progress bar
 */
function updateDisplay() {
  const clockDisplay = document.getElementById('timerClock');
  const fillBar = document.getElementById('timerIntervalFill');

  const totalSec = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;

  if (clockDisplay) {
    clockDisplay.textContent = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (fillBar && initialIntervalMs > 0) {
    const pct = Math.max(0, Math.min(100, (remainingMs / initialIntervalMs) * 100));
    fillBar.style.width = `${pct}%`;
  }
}

/**
 * Updates UI styling based on WORK vs REST phase
 */
function updatePhaseUI() {
  const phaseBadge = document.getElementById('timerPhaseBadge');
  const fillBar = document.getElementById('timerIntervalFill');

  if (!phaseBadge) return;

  if (timerPhase === 'WORK') {
    phaseBadge.className = 'timer-phase-pill timer-phase-work';
    phaseBadge.textContent = '🔥 WORK INTERVAL';
    if (fillBar) fillBar.classList.remove('rest-mode');
  } else {
    phaseBadge.className = 'timer-phase-pill timer-phase-rest';
    phaseBadge.textContent = '☕ REST INTERVAL (CATCH BREATH)';
    if (fillBar) fillBar.classList.add('rest-mode');
  }
}

/**
 * Updates button visibility and state for Start, Pause, Resume, Reset, Skip Rest
 */
function updateControlsUI() {
  const startBtn = document.getElementById('startTimerBtn');
  const pauseBtn = document.getElementById('pauseTimerBtn');
  const resumeBtn = document.getElementById('resumeTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const skipRestBtn = document.getElementById('skipRestBtn');
  const prevBtn = document.getElementById('prevExerciseBtn');
  const nextBtn = document.getElementById('nextExerciseBtn');

  if (timerState === 'RUNNING') {
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) {
      pauseBtn.style.display = 'inline-flex';
      pauseBtn.disabled = false;
    }
    if (resumeBtn) resumeBtn.style.display = 'none';
  } else if (timerState === 'PAUSED') {
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (resumeBtn) {
      resumeBtn.style.display = 'inline-flex';
      resumeBtn.disabled = false;
    }
  } else {
    // IDLE
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.disabled = false;
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (resumeBtn) resumeBtn.style.display = 'none';
  }

  // Show Skip Rest button only in REST phase
  if (skipRestBtn) {
    skipRestBtn.style.display = timerPhase === 'REST' ? 'inline-flex' : 'none';
  }

  // Navigation button state
  if (prevBtn) {
    prevBtn.disabled = activeExerciseIndex === 0;
  }
  if (nextBtn) {
    nextBtn.textContent = activeExerciseIndex >= workoutList.length - 1 ? 'Finish Routine 🏆' : 'Next Exercise ⏭️';
  }
}

/**
 * Starts or Resumes countdown using Date.now() timestamp calculation
 * to prevent drift when browser tab is inactive.
 */
function startOrResumeTimer() {
  // Clear any existing active timer to prevent multi-timer overlap
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (!workoutStartTime) {
    workoutStartTime = Date.now();
  }

  targetEndTime = Date.now() + remainingMs;
  timerState = 'RUNNING';
  updateControlsUI();

  timerInterval = setInterval(() => {
    const now = Date.now();
    remainingMs = Math.max(0, targetEndTime - now);

    updateDisplay();

    // Trigger low sound warning at last 3 seconds
    if (soundEnabled && remainingMs <= 3200 && remainingMs > 2800) {
      playTimerBeep(450, 0.08);
    }

    if (remainingMs <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleIntervalCompleted();
    }
  }, 100);
}

/**
 * Pauses the countdown and freezes exact remaining milliseconds
 */
function pauseTimer() {
  if (timerState !== 'RUNNING') return;

  clearInterval(timerInterval);
  timerInterval = null;
  timerState = 'PAUSED';

  if (targetEndTime) {
    remainingMs = Math.max(0, targetEndTime - Date.now());
  }

  updateControlsUI();
  if (soundEnabled) playTimerBeep(400, 0.1);
  if (typeof showToast === 'function') showToast('Timer paused', 'info');
}

/**
 * Resets the current interval back to initial duration
 */
function resetCurrentTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerState = 'IDLE';
  const activeEx = workoutList[activeExerciseIndex];
  if (timerPhase === 'WORK') {
    remainingMs = (activeEx ? parseDurationSeconds(activeEx.reps, 45) : 45) * 1000;
  } else {
    remainingMs = (activeEx ? parseDurationSeconds(activeEx.restDuration, 30) : 30) * 1000;
  }
  initialIntervalMs = remainingMs;

  updateDisplay();
  updateControlsUI();
  if (typeof showToast === 'function') showToast('Timer reset for this set', 'info');
}

/**
 * Handles transition when countdown reaches 0: switches between WORK and REST,
 * advances sets, or triggers workout completion.
 */
function handleIntervalCompleted() {
  if (soundEnabled) playTimerBeep(880, 0.25);

  const activeEx = workoutList[activeExerciseIndex];

  if (timerPhase === 'WORK') {
    totalCompletedSets++;

    // Check if more sets remain for this exercise
    if (currentSet < totalSets) {
      // Enter REST phase between sets
      timerPhase = 'REST';
      const restSeconds = activeEx ? parseDurationSeconds(activeEx.restDuration, 30) : 30;
      remainingMs = restSeconds * 1000;
      initialIntervalMs = remainingMs;
      updatePhaseUI();
      updateDisplay();

      if (typeof showToast === 'function') {
        showToast(`Set ${currentSet} complete! Rest for ${restSeconds}s.`, 'success');
      }
      startOrResumeTimer(); // Auto-start rest interval
    } else {
      // All sets of current exercise completed!
      if (activeExerciseIndex < workoutList.length - 1) {
        // Transition to Rest before advancing to next exercise
        timerPhase = 'REST';
        const restSeconds = 45;
        remainingMs = restSeconds * 1000;
        initialIntervalMs = remainingMs;
        updatePhaseUI();
        updateDisplay();

        if (typeof showToast === 'function') {
          showToast(`Great work! All sets done for ${activeEx.name}. Next exercise starting soon.`, 'success');
        }
        startOrResumeTimer();
      } else {
        // Entire routine completed!
        completeEntireWorkout();
      }
    }
  } else {
    // REST phase completed
    timerPhase = 'WORK';
    updatePhaseUI();

    if (currentSet < totalSets) {
      currentSet++;
      const workSeconds = activeEx ? parseDurationSeconds(activeEx.reps, 45) : 45;
      remainingMs = workSeconds * 1000;
      initialIntervalMs = remainingMs;

      updateSetAndRepDisplay(activeEx);
      updateDisplay();

      if (typeof showToast === 'function') {
        showToast(`Rest finished. Set ${currentSet} of ${totalSets} starts now!`, 'info');
      }
      startOrResumeTimer();
    } else {
      // Advance to next exercise
      activeExerciseIndex++;
      currentSet = 1;
      loadActiveExercise();

      if (typeof showToast === 'function') {
        showToast(`Starting ${workoutList[activeExerciseIndex].name}!`, 'info');
      }
      startOrResumeTimer();
    }
  }
}

/**
 * Immediately skips the rest countdown and begins the next work interval
 */
function skipRest() {
  if (timerPhase !== 'REST') return;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const activeEx = workoutList[activeExerciseIndex];
  timerPhase = 'WORK';
  updatePhaseUI();

  if (currentSet < totalSets) {
    currentSet++;
    const workSeconds = activeEx ? parseDurationSeconds(activeEx.reps, 45) : 45;
    remainingMs = workSeconds * 1000;
    initialIntervalMs = remainingMs;

    updateSetAndRepDisplay(activeEx);
    updateDisplay();
    startOrResumeTimer();

    if (typeof showToast === 'function') {
      showToast(`Rest skipped! Starting Set ${currentSet}.`, 'info');
    }
  } else if (activeExerciseIndex < workoutList.length - 1) {
    activeExerciseIndex++;
    currentSet = 1;
    loadActiveExercise();
    startOrResumeTimer();

    if (typeof showToast === 'function') {
      showToast(`Starting next exercise: ${workoutList[activeExerciseIndex].name}!`, 'info');
    }
  } else {
    completeEntireWorkout();
  }
}

/**
 * Completes current set early when user finishes target repetitions before time expires
 */
function completeSetEarly() {
  if (timerState !== 'RUNNING') return;
  if (timerPhase === 'WORK') {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    remainingMs = 0;
    handleIntervalCompleted();
  }
}

/**
 * Advances to the next exercise in the session
 */
function goToNextExercise() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (activeExerciseIndex < workoutList.length - 1) {
    activeExerciseIndex++;
    currentSet = 1;
    timerPhase = 'WORK';
    timerState = 'IDLE';
    loadActiveExercise();

    if (typeof showToast === 'function') {
      showToast(`Switched to ${workoutList[activeExerciseIndex].name}`, 'info');
    }
  } else {
    completeEntireWorkout();
  }
}

/**
 * Returns to the previous exercise in the session
 */
function goToPreviousExercise() {
  if (activeExerciseIndex > 0) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    activeExerciseIndex--;
    currentSet = 1;
    timerPhase = 'WORK';
    timerState = 'IDLE';
    loadActiveExercise();

    if (typeof showToast === 'function') {
      showToast(`Returned to ${workoutList[activeExerciseIndex].name}`, 'info');
    }
  }
}

/**
 * Displays the celebratory completion card and updates sessionStorage stats
 */
function completeEntireWorkout() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerState = 'COMPLETED';

  // Sound fanfare
  if (soundEnabled) {
    playTimerBeep(523, 0.15);
    setTimeout(() => playTimerBeep(659, 0.15), 150);
    setTimeout(() => playTimerBeep(784, 0.3), 300);
  }

  // Update session streak in sessionStorage
  try {
    const prevCount = parseInt(sessionStorage.getItem('fitbuddy_completed_workouts') || '4', 10);
    sessionStorage.setItem('fitbuddy_completed_workouts', String(prevCount + 1));
  } catch (err) {
    console.warn('Could not update workout count:', err);
  }

  // Hide Main Timer card, reveal Completion Card
  const mainCard = document.getElementById('timerMainCard');
  const compCard = document.getElementById('timerCompletionCard');

  if (mainCard) mainCard.style.display = 'none';
  if (compCard) compCard.style.display = 'block';

  // Populate completion summary metrics
  const elapsedMinutes = workoutStartTime ? Math.max(1, Math.round((Date.now() - workoutStartTime) / 60000)) : 15;
  const compExercises = document.getElementById('compTotalExercises');
  const compSets = document.getElementById('compTotalSets');
  const compTime = document.getElementById('compTotalTime');

  if (compExercises) compExercises.textContent = `${workoutList.length} / ${workoutList.length}`;
  if (compSets) compSets.textContent = `${totalCompletedSets || (workoutList.length * 3)} Sets`;
  if (compTime) compTime.textContent = `${elapsedMinutes} Mins`;

  // Log to Spring Boot backend & MySQL database
  if (window.FitBuddyApi && window.FitBuddyApi.isLoggedIn()) {
    const routineName = (workoutList.length > 0 && workoutList[0].name) ? (workoutList[0].name + ' Routine') : 'Home Workout Session';
    window.FitBuddyApi.logWorkout({
      workoutName: routineName,
      durationMinutes: elapsedMinutes,
      exercisesCompleted: workoutList.length,
      setsCompleted: totalCompletedSets || (workoutList.length * 3),
      caloriesBurned: Math.round(elapsedMinutes * 7.5),
      notes: 'Completed via FitBuddy Workout Timer'
    }).then(() => {
      console.log('Workout logged successfully to server database');
    }).catch(err => {
      console.warn('Backend workout log deferred:', err);
    });
  }

  if (typeof showToast === 'function') {
    showToast('Congratulations! Full routine completed and recorded.', 'success', 5000);
  }
}

/**
 * Binds DOM event listeners for buttons and user controls
 */
function bindTimerControls() {
  const startBtn = document.getElementById('startTimerBtn');
  const pauseBtn = document.getElementById('pauseTimerBtn');
  const resumeBtn = document.getElementById('resumeTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const skipRestBtn = document.getElementById('skipRestBtn');
  const completeEarlyBtn = document.getElementById('completeSetEarlyBtn');
  const prevBtn = document.getElementById('prevExerciseBtn');
  const nextBtn = document.getElementById('nextExerciseBtn');
  const soundBtn = document.getElementById('soundToggleBtn');
  const restartWorkoutBtn = document.getElementById('restartWorkoutBtn');

  // Rep counter adjustment buttons
  const repMinusBtn = document.getElementById('repMinusBtn');
  const repPlusBtn = document.getElementById('repPlusBtn');
  const repDisplay = document.getElementById('userRepCountDisplay');

  if (startBtn) startBtn.addEventListener('click', startOrResumeTimer);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
  if (resumeBtn) resumeBtn.addEventListener('click', startOrResumeTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetCurrentTimer);
  if (skipRestBtn) skipRestBtn.addEventListener('click', skipRest);
  if (completeEarlyBtn) completeEarlyBtn.addEventListener('click', completeSetEarly);

  if (prevBtn) prevBtn.addEventListener('click', goToPreviousExercise);
  if (nextBtn) nextBtn.addEventListener('click', goToNextExercise);

  if (repMinusBtn && repDisplay) {
    repMinusBtn.addEventListener('click', () => {
      if (currentRepsCount > 1) {
        currentRepsCount--;
        repDisplay.textContent = `${currentRepsCount} Reps`;
      }
    });
  }

  if (repPlusBtn && repDisplay) {
    repPlusBtn.addEventListener('click', () => {
      currentRepsCount++;
      repDisplay.textContent = `${currentRepsCount} Reps`;
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
      soundBtn.classList.toggle('btn-outline', !soundEnabled);
      soundBtn.classList.toggle('btn-ghost', soundEnabled);
      if (soundEnabled) playTimerBeep(600, 0.1);
    });
  }

  if (restartWorkoutBtn) {
    restartWorkoutBtn.addEventListener('click', () => {
      const mainCard = document.getElementById('timerMainCard');
      const compCard = document.getElementById('timerCompletionCard');
      if (compCard) compCard.style.display = 'none';
      if (mainCard) mainCard.style.display = 'block';

      activeExerciseIndex = 0;
      currentSet = 1;
      totalCompletedSets = 0;
      workoutStartTime = null;
      loadActiveExercise();
    });
  }
}

/**
 * Synthesizes a subtle, pleasant beep tone using Web Audio API
 * @param {number} freq Frequency in Hz
 * @param {number} duration Duration in seconds
 */
function playTimerBeep(freq = 600, duration = 0.15) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio autoplay or permissions policy may prevent sound; safe fallback
  }
}

// Global exposure for debugging or quick testing
window.startOrResumeTimer = startOrResumeTimer;
window.pauseTimer = pauseTimer;
window.resetCurrentTimer = resetCurrentTimer;
window.skipRest = skipRest;
window.goToNextExercise = goToNextExercise;
window.goToPreviousExercise = goToPreviousExercise;
window.completeEntireWorkout = completeEntireWorkout;
window.playTimerBeep = playTimerBeep;
