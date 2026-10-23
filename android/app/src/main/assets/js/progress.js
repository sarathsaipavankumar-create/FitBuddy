/**
 * ============================================================================
 * FitBuddy - Progress & Consistency Tracker Logic (progress.js)
 * Clean, lightweight, beginner-friendly progress tracking.
 * Features:
 * 1. Log weight, date, workout name, and duration with full validation.
 * 2. Real-time statistics: Current weight, Previous weight, Weight change,
 *    Dynamic workout streak, Total workouts, and Total minutes.
 * 3. Weekly activity strip (Mon–Sun) based on actual dates.
 * 4. Chart.js integration for Weight History line chart & Weekly Workout bar chart.
 * 5. Transparent sample demo data persistence in localStorage.
 * 6. Graceful handling of invalid and duplicate date submissions.
 * 7. Friendly empty-state display when no records exist.
 * ============================================================================
 */

// Storage Key for Demo Persistence
const PROGRESS_STORAGE_KEY = 'fitbuddy_progress_history_v1';

// Global State
let progressEntries = [];
let weightChartInstance = null;
let weeklyChartInstance = null;

// Initial Transparent Sample Demo Data (Lead-up to Friday, Oct 23, 2026)
const INITIAL_DEMO_ENTRIES = [
  {
    id: 'demo-1',
    date: '2026-10-19',
    weight: 69.2,
    workoutName: 'Push-ups & Chest Focus',
    duration: 35,
    isDemo: true
  },
  {
    id: 'demo-2',
    date: '2026-10-20',
    weight: 69.0,
    workoutName: 'Bodyweight Squats & Legs',
    duration: 40,
    isDemo: true
  },
  {
    id: 'demo-3',
    date: '2026-10-21',
    weight: 68.8,
    workoutName: 'Core & Plank Circuit',
    duration: 30,
    isDemo: true
  },
  {
    id: 'demo-4',
    date: '2026-10-22',
    weight: 68.4,
    workoutName: 'Dumbbell Upper Body',
    duration: 45,
    isDemo: true
  },
  {
    id: 'demo-5',
    date: '2026-10-23',
    weight: 68.0,
    workoutName: 'Hostel Micro-Workout',
    duration: 25,
    isDemo: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initProgressTracker();
  bindFormEvents();
});

/**
 * Loads stored records or default demo entries and renders the UI
 */
function initProgressTracker() {
  loadProgressData();
  setDefaultFormDate();
  refreshProgressUI();
}

/**
 * Loads records from localStorage, or seeds with sample demo data
 */
function loadProgressData() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        progressEntries = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using session/memory fallback:', err);
  }

  // Seed with initial sample demo entries
  progressEntries = [...INITIAL_DEMO_ENTRIES];
  saveProgressData();
}

/**
 * Persists entries safely to localStorage (only fitness metrics stored)
 */
function saveProgressData() {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressEntries));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

/**
 * Sets today's date (2026-10-23) as default in the date input
 */
function setDefaultFormDate() {
  const dateInput = document.getElementById('logDate');
  if (dateInput) {
    // Current local reference date: 2026-10-23
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Binds form submission and button listeners
 */
function bindFormEvents() {
  const form = document.getElementById('progressLogForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const workoutSelect = document.getElementById('logWorkoutName');
  if (workoutSelect) {
    workoutSelect.addEventListener('change', function() {
      const customRow = document.getElementById('customWorkoutRow');
      if (customRow) {
        customRow.style.display = this.value === 'Custom' ? 'block' : 'none';
        if (this.value === 'Custom') {
          const customInput = document.getElementById('logCustomWorkout');
          if (customInput) customInput.focus();
        }
      }
    });
  }

  const clearDemoBtn = document.getElementById('clearDemoDataBtn');
  if (clearDemoBtn) {
    clearDemoBtn.addEventListener('click', () => {
      // Retain only genuine user entries
      const userOnly = progressEntries.filter(e => !e.isDemo);
      progressEntries = userOnly;
      saveProgressData();
      refreshProgressUI();
      if (typeof showToast === 'function') {
        showToast('Sample demo data cleared. Showing your real logs.', 'info');
      }
    });
  }

  const resetSampleBtn = document.getElementById('resetSampleDataBtn');
  if (resetSampleBtn) {
    resetSampleBtn.addEventListener('click', () => {
      progressEntries = [...INITIAL_DEMO_ENTRIES];
      saveProgressData();
      refreshProgressUI();
      if (typeof showToast === 'function') {
        showToast('Sample history restored for preview.', 'success');
      }
    });
  }

  const emptyLoadDemoBtn = document.getElementById('emptyLoadDemoBtn');
  if (emptyLoadDemoBtn) {
    emptyLoadDemoBtn.addEventListener('click', () => {
      progressEntries = [...INITIAL_DEMO_ENTRIES];
      saveProgressData();
      refreshProgressUI();
      if (typeof showToast === 'function') {
        showToast('Sample data loaded for chart demonstration.', 'success');
      }
    });
  }
}

/**
 * Handles form validation and submission
 * @param {Event} e 
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const dateInput = document.getElementById('logDate');
  const weightInput = document.getElementById('logWeight');
  const workoutSelect = document.getElementById('logWorkoutName');
  const customWorkoutInput = document.getElementById('logCustomWorkout');
  const durationInput = document.getElementById('logDuration');

  const dateVal = dateInput ? dateInput.value.trim() : '';
  const weightVal = weightInput && weightInput.value ? parseFloat(weightInput.value) : null;
  const durationVal = durationInput && durationInput.value ? parseInt(durationInput.value, 10) : null;

  // Determine workout name (preset or custom)
  let workoutName = workoutSelect ? workoutSelect.value : '';
  if (workoutName === 'Custom' && customWorkoutInput && customWorkoutInput.value.trim()) {
    workoutName = customWorkoutInput.value.trim();
  } else if (!workoutName && customWorkoutInput && customWorkoutInput.value.trim()) {
    workoutName = customWorkoutInput.value.trim();
  }

  // --- VALIDATION RULES ---
  // 1. Date Validation
  if (!dateVal) {
    if (typeof showToast === 'function') showToast('Please select a valid date.', 'warning');
    if (dateInput) dateInput.focus();
    return;
  }

  // 2. Weight Validation (Optional if only logging workout, but if entered must be 20 - 300 kg)
  if (weightVal !== null) {
    if (isNaN(weightVal) || weightVal < 20 || weightVal > 300) {
      if (typeof showToast === 'function') showToast('Please enter a realistic body weight between 20 kg and 300 kg.', 'warning');
      if (weightInput) weightInput.focus();
      return;
    }
  }

  // 3. Workout Duration Validation
  if (durationVal !== null) {
    if (isNaN(durationVal) || durationVal < 1 || durationVal > 300) {
      if (typeof showToast === 'function') showToast('Please enter a valid workout duration between 1 and 300 minutes.', 'warning');
      if (durationInput) durationInput.focus();
      return;
    }
  }

  // Ensure at least one metric (Weight or Workout) is entered
  if (weightVal === null && !workoutName && durationVal === null) {
    if (typeof showToast === 'function') showToast('Please enter either a body weight or workout details.', 'warning');
    return;
  }

  const finalWorkout = workoutName || 'General Conditioning';
  const finalDuration = durationVal !== null ? durationVal : 30;

  // Check for duplicate date entry to handle gracefully
  const existingIndex = progressEntries.findIndex(e => e.date === dateVal);

  if (existingIndex !== -1) {
    // Update existing entry on the same date gracefully
    const existing = progressEntries[existingIndex];
    existing.weight = weightVal !== null ? weightVal : existing.weight;
    existing.workoutName = finalWorkout;
    existing.duration = finalDuration;
    existing.isDemo = false; // Promoted to real user log

    if (typeof showToast === 'function') {
      showToast(`Updated existing progress entry for ${formatDisplayDate(dateVal)}.`, 'success');
    }
  } else {
    // Create new entry
    const newEntry = {
      id: 'entry-' + Date.now(),
      date: dateVal,
      weight: weightVal,
      workoutName: finalWorkout,
      duration: finalDuration,
      isDemo: false
    };

    progressEntries.push(newEntry);

    if (typeof showToast === 'function') {
      showToast(`Progress logged successfully for ${formatDisplayDate(dateVal)}!`, 'success');
    }
  }

  // Sort entries ascending by date
  progressEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Save & Refresh
  saveProgressData();
  refreshProgressUI();

  // Reset weight/duration inputs for next entry, keeping date current
  if (weightInput) weightInput.value = '';
  if (durationInput) durationInput.value = '';
}

/**
 * Refreshes all UI cards, metrics, tables, and Chart.js instances
 */
function refreshProgressUI() {
  updateDemoBanner();
  updateTopMetrics();
  updateWeeklyActivityStrip();
  updateHistoryTables();
  updateCharts();
}

/**
 * Shows/hides demo notice banner based on whether sample data is active
 */
function updateDemoBanner() {
  const demoBanner = document.getElementById('demoDataNoticeBanner');
  const hasDemo = progressEntries.some(e => e.isDemo);

  if (demoBanner) {
    demoBanner.style.display = hasDemo ? 'flex' : 'none';
  }
}

/**
 * Calculates and updates the 4 top metrics:
 * 1. Current Weight
 * 2. Previous Weight & Delta
 * 3. Dynamic Workout Streak
 * 4. Total Workouts
 */
function updateTopMetrics() {
  const currentWeightEl = document.getElementById('metricCurrentWeight');
  const prevWeightEl = document.getElementById('metricPrevWeight');
  const streakEl = document.getElementById('metricStreak');
  const totalWorkoutsEl = document.getElementById('metricTotalWorkouts');

  // Filter entries with valid weights
  const weightEntries = progressEntries.filter(e => typeof e.weight === 'number' && e.weight > 0);

  if (weightEntries.length === 0) {
    if (currentWeightEl) currentWeightEl.textContent = '—';
    if (prevWeightEl) prevWeightEl.innerHTML = '<span style="color: var(--text-dim);">No weight logs</span>';
  } else if (weightEntries.length === 1) {
    const cur = weightEntries[0].weight;
    if (currentWeightEl) currentWeightEl.textContent = `${cur.toFixed(1)} kg`;
    if (prevWeightEl) prevWeightEl.innerHTML = '<span class="badge badge-outline">Baseline Established</span>';
  } else {
    // 2 or more weight entries
    const cur = weightEntries[weightEntries.length - 1].weight;
    const prev = weightEntries[weightEntries.length - 2].weight;
    const delta = cur - prev;

    if (currentWeightEl) currentWeightEl.textContent = `${cur.toFixed(1)} kg`;

    let deltaHtml = '';
    if (delta > 0) {
      deltaHtml = `<span style="color: #0369A1; font-weight: 700;">+${delta.toFixed(1)} kg</span> vs previous (${prev.toFixed(1)} kg)`;
    } else if (delta < 0) {
      deltaHtml = `<span style="color: #15803D; font-weight: 700;">${delta.toFixed(1)} kg</span> vs previous (${prev.toFixed(1)} kg)`;
    } else {
      deltaHtml = `<span style="color: var(--text-dim); font-weight: 700;">0.0 kg</span> (steady vs ${prev.toFixed(1)} kg)`;
    }

    if (prevWeightEl) prevWeightEl.innerHTML = deltaHtml;
  }

  // Calculate Streak from actual available history
  const streak = calculateDynamicStreak(progressEntries);
  if (streakEl) {
    streakEl.textContent = `${streak} ${streak === 1 ? 'Day' : 'Days'}`;
  }

  // Total Completed Workouts
  const workoutCount = progressEntries.filter(e => e.workoutName && e.duration > 0).length;
  if (totalWorkoutsEl) {
    totalWorkoutsEl.textContent = `${workoutCount} ${workoutCount === 1 ? 'Session' : 'Sessions'}`;
  }
}

/**
 * Calculates the current active workout streak by checking consecutive calendar days
 * backwards from Today or Yesterday.
 * Fully transparent algorithm:
 * 1. Collect all distinct dates that have a completed workout.
 * 2. Check if Today (2026-10-23) or Yesterday has a workout.
 * 3. Count backward consecutive calendar days without gaps.
 * @param {Array} entries 
 * @returns {number} streak count
 */
function calculateDynamicStreak(entries) {
  if (!entries || entries.length === 0) return 0;

  // Filter entries with recorded workouts and collect unique YYYY-MM-DD
  const workoutDates = new Set();
  entries.forEach(e => {
    if ((e.workoutName || e.duration > 0) && e.date) {
      workoutDates.add(e.date);
    }
  });

  if (workoutDates.size === 0) return 0;

  // Use current local reference date (today = 2026-10-23)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDateIso(today);

  // Check yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateIso(yesterday);

  let checkDate = null;

  // If today has a workout, streak starts today
  if (workoutDates.has(todayStr)) {
    checkDate = new Date(today);
  } else if (workoutDates.has(yesterdayStr)) {
    // If today is not logged yet, but yesterday was, streak is still alive!
    checkDate = new Date(yesterday);
  } else {
    // Neither today nor yesterday was logged; active streak broken
    return 0;
  }

  let streak = 0;

  // Walk backwards day-by-day
  while (true) {
    const dStr = formatDateIso(checkDate);
    if (workoutDates.has(dStr)) {
      streak++;
      // Move 1 day earlier
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Formats a Date object to YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
function formatDateIso(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Updates the 7-day Monday–Sunday visual activity strip
 */
function updateWeeklyActivityStrip() {
  const strip = document.getElementById('progressWeeklyStrip');
  if (!strip) return;

  strip.innerHTML = '';

  // Calculate current week's Monday to Sunday
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
  // Calculate distance to current week's Monday (in ISO week, Monday = 1)
  const distanceToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const daysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const dateStr = formatDateIso(currentDay);

    // Sum minutes logged on this day
    const entriesOnDay = progressEntries.filter(e => e.date === dateStr);
    const dayMins = entriesOnDay.reduce((acc, cur) => acc + (cur.duration || 0), 0);
    const isActive = dayMins > 0;

    const cell = document.createElement('div');
    cell.className = 'weekly-day-cell';
    cell.innerHTML = `
      <div class="weekly-day-circle ${isActive ? 'active' : ''}" title="${dateStr}: ${dayMins} mins">
        ${isActive ? '✓' : '—'}
      </div>
      <div class="weekly-day-name">${daysLabel[i]}</div>
      <div class="weekly-day-mins">${isActive ? `${dayMins}m` : '0m'}</div>
    `;

    strip.appendChild(cell);
  }
}

/**
 * Updates both the Weight History Table and Workout Log Table, or renders empty states
 */
function updateHistoryTables() {
  const tableBody = document.getElementById('progressTableBody');
  const emptyStateCard = document.getElementById('progressEmptyState');
  const historyContent = document.getElementById('progressHistoryContent');

  if (progressEntries.length === 0) {
    if (emptyStateCard) emptyStateCard.style.display = 'block';
    if (historyContent) historyContent.style.display = 'none';
    return;
  }

  if (emptyStateCard) emptyStateCard.style.display = 'none';
  if (historyContent) historyContent.style.display = 'block';

  if (!tableBody) return;
  tableBody.innerHTML = '';

  // Render in reverse chronological order (newest first)
  const sortedDesc = [...progressEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedDesc.forEach(entry => {
    const tr = document.createElement('tr');

    const weightDisplay = entry.weight ? `${entry.weight.toFixed(1)} kg` : '<span style="color: var(--text-dim);">—</span>';
    const workoutDisplay = entry.workoutName || '<span style="color: var(--text-dim);">No workout</span>';
    const durationDisplay = entry.duration ? `${entry.duration} mins` : '<span style="color: var(--text-dim);">—</span>';
    const tagDisplay = entry.isDemo
      ? `<span class="badge-demo">Demo Data</span>`
      : `<span class="badge-user">User Log</span>`;

    tr.innerHTML = `
      <td style="font-weight: 600;">${formatDisplayDate(entry.date)}</td>
      <td>${weightDisplay}</td>
      <td><strong>${workoutDisplay}</strong></td>
      <td>${durationDisplay}</td>
      <td>${tagDisplay}</td>
      <td>
        <button type="button" class="btn btn-ghost btn-sm" onclick="deleteProgressEntry('${entry.id}')" title="Delete entry" style="padding: 2px 8px; color: #ef4444;" aria-label="Delete entry">
          ✕
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

/**
 * Deletes a single entry by ID
 * @param {string} id 
 */
function deleteProgressEntry(id) {
  progressEntries = progressEntries.filter(e => e.id !== id);
  saveProgressData();
  refreshProgressUI();
  if (typeof showToast === 'function') {
    showToast('Entry removed from progress log.', 'info');
  }
}

/**
 * Initializes or updates Chart.js charts:
 * 1. Weight History Line Chart
 * 2. Weekly Workout Bar Chart
 */
function updateCharts() {
  if (typeof Chart === 'undefined') {
    console.info('Chart.js CDN not available; charts will render when connected.');
    return;
  }

  renderWeightLineChart();
  renderWeeklyBarChart();
}

/**
 * Renders the Weight History Line Chart using Chart.js
 */
function renderWeightLineChart() {
  const canvas = document.getElementById('weightHistoryChart');
  if (!canvas) return;

  const weightData = progressEntries
    .filter(e => typeof e.weight === 'number' && e.weight > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (weightData.length === 0) {
    if (weightChartInstance) {
      weightChartInstance.destroy();
      weightChartInstance = null;
    }
    return;
  }

  const labels = weightData.map(e => formatDisplayShort(e.date));
  const weights = weightData.map(e => e.weight);

  try {
    if (weightChartInstance) {
      weightChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    weightChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weight (kg)',
          data: weights,
          borderColor: '#17251F',
          backgroundColor: 'rgba(185, 243, 106, 0.25)',
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#B9F36A',
          pointBorderColor: '#17251F',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#17251F',
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: (context) => `${context.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#7B8A83',
              font: { family: 'Inter', size: 11, weight: '600' }
            }
          },
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(23, 37, 31, 0.05)' },
            ticks: {
              color: '#7B8A83',
              font: { family: 'Inter', size: 11 },
              callback: (val) => `${val}kg`
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn('Error rendering Weight Line Chart:', err);
  }
}

/**
 * Renders the Weekly Workout Activity Bar Chart using Chart.js
 */
function renderWeeklyBarChart() {
  const canvas = document.getElementById('weeklyWorkoutChart');
  if (!canvas) return;

  const daysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate current week's Monday
  const today = new Date();
  const dayOfWeek = today.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const weeklyMinutes = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dateStr = formatDateIso(cur);

    const sum = progressEntries
      .filter(e => e.date === dateStr)
      .reduce((acc, e) => acc + (e.duration || 0), 0);

    weeklyMinutes.push(sum);
  }

  const lime = '#B9F36A';
  const forest = '#17251F';
  const muted = '#E4E8E2';

  const barColors = weeklyMinutes.map((mins, idx) => {
    if (mins === 0) return muted;
    if (idx === 4) return forest; // Friday
    return lime;
  });

  try {
    if (weeklyChartInstance) {
      weeklyChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    weeklyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: daysLabel,
        datasets: [{
          label: 'Workout Minutes',
          data: weeklyMinutes,
          backgroundColor: barColors,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#17251F',
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: (context) => `${context.parsed.y} mins active`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#7B8A83',
              font: { family: 'Inter', size: 11, weight: '600' }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(23, 37, 31, 0.05)' },
            ticks: {
              color: '#7B8A83',
              font: { family: 'Inter', size: 11 },
              callback: (val) => `${val}m`
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn('Error rendering Weekly Bar Chart:', err);
  }
}

/**
 * Formats YYYY-MM-DD into human-readable e.g. "23 Oct 2026"
 * @param {string} isoStr 
 * @returns {string}
 */
function formatDisplayDate(isoStr) {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const year = parts[0];

  return `${day} ${months[monthIdx] || parts[1]} ${year}`;
}

/**
 * Formats YYYY-MM-DD into short e.g. "23 Oct"
 * @param {string} isoStr 
 * @returns {string}
 */
function formatDisplayShort(isoStr) {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  return `${day} ${months[monthIdx] || parts[1]}`;
}

// Global exposure for debugging or test scripts
window.deleteProgressEntry = deleteProgressEntry;
window.initProgressTracker = initProgressTracker;
window.calculateDynamicStreak = calculateDynamicStreak;
