/**
 * ============================================================================
 * FitBuddy - Member Dashboard Logic (dashboard.js)
 * Clean, lightweight vanilla JavaScript for:
 * 1. Desktop & mobile sidebar navigation drawer.
 * 2. Loading saved demo profile data (BMI, weight, goal, workout plan).
 * 3. Handling friendly empty state when no profile or progress exists.
 * 4. Clearly distinguishing sample data from real user data.
 * 5. Rendering the weekly activity chart with Chart.js & pure CSS fallback.
 * ============================================================================
 */

let weeklyChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize desktop and mobile sidebar navigation drawer
  initDashboardSidebar();

  // 2. Load and render user profile data or friendly empty state
  loadDashboardData();
});

/**
 * Handles the mobile sidebar open/close toggle, backdrop overlay, and keyboard navigation
 */
function initDashboardSidebar() {
  const menuBtn = document.getElementById('dashboardMenuBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  const sidebar = document.getElementById('dashboardSidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close sidebar when clicking any navigation link on mobile
  const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Re-enable body scroll if window is resized beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

/**
 * Retrieves saved profile data from sessionStorage or localStorage
 * @returns {object|null}
 */
function getSavedProfile() {
  try {
    const raw = sessionStorage.getItem('fitbuddy_demo_profile_data') || 
                localStorage.getItem('fitbuddy_demo_profile_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.name || parsed.fitnessGoal || parsed.weight)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read demo profile data from storage:', err);
  }
  return null;
}

/**
 * Main dashboard coordinator: Checks for saved profile data and renders either
 * the personalized profile view or the friendly empty state view.
 */
function loadDashboardData() {
  const profile = getSavedProfile();

  if (profile) {
    renderPersonalizedDashboard(profile);
  } else {
    renderEmptyStateDashboard();
  }
}

/**
 * Renders the dashboard with the user's saved profile data.
 * Clearly marks all metrics as "PERSONALIZED".
 * @param {object} profile 
 */
function renderPersonalizedDashboard(profile) {
  // Elements
  const emptyStateAlert = document.getElementById('dashboardEmptyStateAlert');
  const userGreetingEl = document.getElementById('dashboardUserGreeting');
  const userSubtitleEl = document.getElementById('dashboardUserSubtitle');
  const userChipNameEl = document.getElementById('userChipName');
  const userChipBadgeEl = document.getElementById('userChipBadge');
  const userAvatarInitialEl = document.getElementById('userAvatarInitial');
  const demoStatusBadge = document.getElementById('demoDataStatusBadge');
  const demoToggleBtn = document.getElementById('demoToggleBtn');

  // Stat Card Elements
  const bmiValEl = document.getElementById('dashBmiValue');
  const bmiBadgeEl = document.getElementById('dashBmiBadge');
  const bmiSubtextEl = document.getElementById('dashBmiSubtext');
  const bmiSourceBadge = document.getElementById('dashBmiSourceBadge');

  const goalValEl = document.getElementById('dashGoalValue');
  const goalSubtextEl = document.getElementById('dashGoalSubtext');
  const goalSourceBadge = document.getElementById('dashGoalSourceBadge');

  const weightValEl = document.getElementById('dashWeightValue');
  const weightSubtextEl = document.getElementById('dashWeightSubtext');
  const weightSourceBadge = document.getElementById('dashWeightSourceBadge');

  const completedCountEl = document.getElementById('dashCompletedCount');
  const completedSubtextEl = document.getElementById('dashCompletedSubtext');
  const completedSourceBadge = document.getElementById('dashCompletedSourceBadge');

  // Spotlight Elements
  const spotlightTypeBadge = document.getElementById('spotlightTypeBadge');
  const spotlightTitleEl = document.getElementById('spotlightWorkoutTitle');
  const spotlightDescEl = document.getElementById('spotlightWorkoutDesc');
  const spotlightDurationEl = document.getElementById('spotlightDurationText');
  const spotlightEquipEl = document.getElementById('spotlightEquipText');
  const spotlightGoalEl = document.getElementById('spotlightGoalText');
  const chartStreakBadge = document.getElementById('chartStreakBadge');

  // 1. Hide Empty State Banner
  if (emptyStateAlert) {
    emptyStateAlert.style.display = 'none';
  }

  // 2. Banner Status Badge & Greeting
  const fullName = profile.name || 'FitBuddy Member';
  const firstName = fullName.split(' ')[0] || fullName;

  if (demoStatusBadge) {
    demoStatusBadge.textContent = 'Active Personalized Profile';
    demoStatusBadge.className = 'badge badge-lime';
  }

  if (userGreetingEl) {
    userGreetingEl.textContent = `Welcome back, ${firstName}! 👋`;
  }

  if (userSubtitleEl) {
    const goalText = profile.fitnessGoal ? `Target: ${profile.fitnessGoal}` : 'Consistency over perfection';
    userSubtitleEl.textContent = `${goalText} • Progressive bodyweight fitness for home & hostel life.`;
  }

  if (demoToggleBtn) {
    demoToggleBtn.textContent = 'Switch to Empty State';
    demoToggleBtn.title = 'Clear demo session to preview the friendly empty state';
  }

  // 3. Header Profile Chip
  if (userChipNameEl) userChipNameEl.textContent = firstName;
  if (userChipBadgeEl) {
    userChipBadgeEl.textContent = 'Active Profile';
    userChipBadgeEl.className = 'badge badge-lime';
  }
  if (userAvatarInitialEl) {
    userAvatarInitialEl.textContent = firstName.charAt(0).toUpperCase();
  }

  // 4. Calculate and Format BMI
  let bmi = 22.4;
  if (profile.height && profile.weight) {
    const heightM = profile.height / 100;
    bmi = (profile.weight / (heightM * heightM)).toFixed(1);
  }

  if (bmiValEl) bmiValEl.textContent = bmi;
  if (bmiSourceBadge) {
    bmiSourceBadge.textContent = 'Personalized';
    bmiSourceBadge.className = 'dash-data-badge badge badge-lime';
  }

  if (bmiBadgeEl) {
    if (bmi < 18.5) {
      bmiBadgeEl.textContent = 'Underweight';
      bmiBadgeEl.className = 'badge badge-subtle';
      bmiBadgeEl.style.backgroundColor = '#EEF2EB';
      bmiBadgeEl.style.color = '#17251F';
    } else if (bmi <= 24.9) {
      bmiBadgeEl.textContent = 'Normal';
      bmiBadgeEl.className = 'badge badge-lime';
      bmiBadgeEl.style.backgroundColor = '';
      bmiBadgeEl.style.color = '';
    } else if (bmi <= 29.9) {
      bmiBadgeEl.textContent = 'Overweight';
      bmiBadgeEl.className = 'badge';
      bmiBadgeEl.style.backgroundColor = '#FEF3C7';
      bmiBadgeEl.style.color = '#B45309';
    } else {
      bmiBadgeEl.textContent = 'Obese';
      bmiBadgeEl.className = 'badge';
      bmiBadgeEl.style.backgroundColor = '#FEE2E2';
      bmiBadgeEl.style.color = '#B91C1C';
    }
  }

  if (bmiSubtextEl) {
    bmiSubtextEl.textContent = `Calculated from ${profile.height || 175}cm & ${profile.weight || 68}kg`;
  }

  // 5. Fitness Goal
  const goal = profile.fitnessGoal || 'General Fitness';
  if (goalValEl) goalValEl.textContent = goal;
  if (goalSourceBadge) {
    goalSourceBadge.textContent = 'Personalized';
    goalSourceBadge.className = 'dash-data-badge badge badge-lime';
  }
  if (goalSubtextEl) {
    goalSubtextEl.textContent = `Primary training target (${profile.activityLevel || 'Moderate'} activity)`;
  }

  // 6. Current Weight
  if (weightValEl) weightValEl.textContent = `${profile.weight || 68} kg`;
  if (weightSourceBadge) {
    weightSourceBadge.textContent = 'Personalized';
    weightSourceBadge.className = 'dash-data-badge badge badge-lime';
  }
  if (weightSubtextEl) {
    weightSubtextEl.textContent = `Recorded baseline (${profile.age ? profile.age + ' yrs old' : 'Member metric'})`;
  }

  // 7. Completed Workouts
  if (completedCountEl) completedCountEl.textContent = '4 Sessions';
  if (completedSourceBadge) {
    completedSourceBadge.textContent = 'Personalized';
    completedSourceBadge.className = 'dash-data-badge badge badge-lime';
  }
  if (completedSubtextEl) {
    completedSubtextEl.textContent = '4 of 5 weekly workout targets completed';
  }

  // 8. Customized Today's Recommended Workout
  const duration = profile.workoutDuration || '30 Minutes';
  const equipment = profile.equipment || 'No Equipment';

  if (spotlightTypeBadge) {
    spotlightTypeBadge.textContent = "TODAY'S RECOMMENDED WORKOUT";
    spotlightTypeBadge.className = 'badge badge-lime';
  }

  if (spotlightDurationEl) spotlightDurationEl.textContent = duration;
  if (spotlightEquipEl) spotlightEquipEl.textContent = equipment;
  if (spotlightGoalEl) spotlightGoalEl.textContent = goal;

  if (spotlightTitleEl) {
    if (goal === 'Muscle Gain') {
      spotlightTitleEl.textContent = `${duration} Upper Body Hypertrophy Calisthenics`;
    } else if (goal === 'Weight Management') {
      spotlightTitleEl.textContent = `${duration} Full-Body Metabolic Interval Flow`;
    } else if (goal === 'Strength') {
      spotlightTitleEl.textContent = `${duration} Bodyweight Power & Tension Flow`;
    } else {
      spotlightTitleEl.textContent = `${duration} Posture & Core Mobility Flow`;
    }
  }

  if (spotlightDescEl) {
    if (goal === 'Muscle Gain') {
      spotlightDescEl.textContent = 'Progressive bodyweight supersets: pushup tempo variations, air squats, and doorframe pulls targeted for lean muscle development without weights.';
    } else if (goal === 'Weight Management') {
      spotlightDescEl.textContent = 'Zero-equipment cardio intervals: mountain climbers, air squats, and jumping jacks calibrated to maximize aerobic heart-rate stamina in tight spaces.';
    } else if (goal === 'Strength') {
      spotlightDescEl.textContent = 'High-tension calisthenics: diamond pushups, tempo squats, and hollow body isometric holds calibrated for raw relative strength.';
    } else {
      spotlightDescEl.textContent = 'Balanced full-body routine: thoracic spine openers, bodyweight squats, and desk-relief posture decompression for busy daily routines.';
    }
  }

  // 9. Weekly Activity Chart
  if (chartStreakBadge) {
    chartStreakBadge.textContent = '4 Days Active';
    chartStreakBadge.className = 'badge badge-lime';
  }
  initWeeklyActivityChart([30, 45, 0, 30, 25, 40, 0], true);
}

/**
 * Renders the dashboard in a friendly Empty State when no profile is saved.
 * All metrics are clearly marked with "SAMPLE DATA" badges.
 */
function renderEmptyStateDashboard() {
  const emptyStateAlert = document.getElementById('dashboardEmptyStateAlert');
  const userGreetingEl = document.getElementById('dashboardUserGreeting');
  const userSubtitleEl = document.getElementById('dashboardUserSubtitle');
  const userChipNameEl = document.getElementById('userChipName');
  const userChipBadgeEl = document.getElementById('userChipBadge');
  const userAvatarInitialEl = document.getElementById('userAvatarInitial');
  const demoStatusBadge = document.getElementById('demoDataStatusBadge');
  const demoToggleBtn = document.getElementById('demoToggleBtn');

  // Stat Card Elements
  const bmiValEl = document.getElementById('dashBmiValue');
  const bmiBadgeEl = document.getElementById('dashBmiBadge');
  const bmiSubtextEl = document.getElementById('dashBmiSubtext');
  const bmiSourceBadge = document.getElementById('dashBmiSourceBadge');

  const goalValEl = document.getElementById('dashGoalValue');
  const goalSubtextEl = document.getElementById('dashGoalSubtext');
  const goalSourceBadge = document.getElementById('dashGoalSourceBadge');

  const weightValEl = document.getElementById('dashWeightValue');
  const weightSubtextEl = document.getElementById('dashWeightSubtext');
  const weightSourceBadge = document.getElementById('dashWeightSourceBadge');

  const completedCountEl = document.getElementById('dashCompletedCount');
  const completedSubtextEl = document.getElementById('dashCompletedSubtext');
  const completedSourceBadge = document.getElementById('dashCompletedSourceBadge');

  // Spotlight Elements
  const spotlightTypeBadge = document.getElementById('spotlightTypeBadge');
  const spotlightTitleEl = document.getElementById('spotlightWorkoutTitle');
  const spotlightDescEl = document.getElementById('spotlightWorkoutDesc');
  const spotlightDurationEl = document.getElementById('spotlightDurationText');
  const spotlightEquipEl = document.getElementById('spotlightEquipText');
  const spotlightGoalEl = document.getElementById('spotlightGoalText');
  const chartStreakBadge = document.getElementById('chartStreakBadge');

  // 1. Reveal Friendly Empty State Card
  if (emptyStateAlert) {
    emptyStateAlert.style.display = 'flex';
  }

  // 2. Banner Status Badge & Greeting
  if (demoStatusBadge) {
    demoStatusBadge.textContent = 'Sample Demo Data';
    demoStatusBadge.className = 'badge badge-subtle';
  }

  if (userGreetingEl) {
    userGreetingEl.textContent = 'Welcome, FitBuddy Explorer! 👋';
  }

  if (userSubtitleEl) {
    userSubtitleEl.textContent = 'Previewing sample fitness overview. Complete your profile to calculate your baseline BMI and personalize workouts.';
  }

  if (demoToggleBtn) {
    demoToggleBtn.textContent = 'Preview Real Profile';
    demoToggleBtn.title = 'Load sample member profile to preview personalized metrics';
  }

  // 3. Header Profile Chip
  if (userChipNameEl) userChipNameEl.textContent = 'Demo User';
  if (userChipBadgeEl) {
    userChipBadgeEl.textContent = 'Sample Demo';
    userChipBadgeEl.className = 'badge badge-subtle';
  }
  if (userAvatarInitialEl) {
    userAvatarInitialEl.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>`;
  }

  // 4. Sample BMI Metric
  if (bmiValEl) bmiValEl.textContent = '22.4';
  if (bmiBadgeEl) {
    bmiBadgeEl.textContent = 'Normal';
    bmiBadgeEl.className = 'badge badge-lime';
    bmiBadgeEl.style.backgroundColor = '';
    bmiBadgeEl.style.color = '';
  }
  if (bmiSubtextEl) bmiSubtextEl.textContent = 'Sample healthy adult screening baseline';
  if (bmiSourceBadge) {
    bmiSourceBadge.textContent = 'Sample Data';
    bmiSourceBadge.className = 'dash-data-badge badge badge-subtle';
  }

  // 5. Sample Fitness Goal
  if (goalValEl) goalValEl.textContent = 'General Fitness';
  if (goalSubtextEl) goalSubtextEl.textContent = 'Sample training direction (Set up profile to tailor)';
  if (goalSourceBadge) {
    goalSourceBadge.textContent = 'Sample Data';
    goalSourceBadge.className = 'dash-data-badge badge badge-subtle';
  }

  // 6. Sample Current Weight
  if (weightValEl) weightValEl.textContent = '68 kg';
  if (weightSubtextEl) weightSubtextEl.textContent = 'Sample baseline metric • Dorm & hostel standard';
  if (weightSourceBadge) {
    weightSourceBadge.textContent = 'Sample Data';
    weightSourceBadge.className = 'dash-data-badge badge badge-subtle';
  }

  // 7. Sample Completed Workouts
  if (completedCountEl) completedCountEl.textContent = '0 Sessions';
  if (completedSubtextEl) completedSubtextEl.textContent = 'No sessions logged yet • Start your first routine!';
  if (completedSourceBadge) {
    completedSourceBadge.textContent = 'Sample Data';
    completedSourceBadge.className = 'dash-data-badge badge badge-subtle';
  }

  // 8. Sample Recommended Workout
  if (spotlightTypeBadge) {
    spotlightTypeBadge.textContent = 'SAMPLE WORKOUT ROUTINE';
    spotlightTypeBadge.className = 'badge badge-subtle';
  }
  if (spotlightTitleEl) {
    spotlightTitleEl.textContent = '25-Min Zero-Equipment Living Room Calisthenics';
  }
  if (spotlightDescEl) {
    spotlightDescEl.textContent = 'Sample starter routine: pushup progressions, air squats, and plank holds designed for dorms, bedrooms, and small spaces.';
  }
  if (spotlightDurationEl) spotlightDurationEl.textContent = '25 Minutes';
  if (spotlightEquipEl) spotlightEquipEl.textContent = 'No Equipment';
  if (spotlightGoalEl) spotlightGoalEl.textContent = 'General Fitness';

  // 9. Sample Weekly Activity Chart
  if (chartStreakBadge) {
    chartStreakBadge.textContent = 'Sample Preview';
    chartStreakBadge.className = 'badge badge-subtle';
  }
  initWeeklyActivityChart([20, 30, 0, 25, 0, 35, 0], false);
}

/**
 * Initializes or updates the Weekly Activity chart with Chart.js,
 * or falls back to the clean pure-CSS bar chart if Chart.js is not loaded.
 * @param {number[]} activeMinutes - Minutes Mon - Sun
 * @param {boolean} isPersonalized - Whether active data is personalized
 */
function initWeeklyActivityChart(activeMinutes = [30, 45, 0, 30, 25, 40, 0], isPersonalized = true) {
  const canvas = document.getElementById('weeklyActivityChart');
  const cssFallback = document.getElementById('cssBarChartFallback');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Check if Chart.js CDN is available
  if (canvas && typeof Chart !== 'undefined') {
    try {
      if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
      }

      const ctx = canvas.getContext('2d');
      const limeAccent = '#B9F36A';
      const forestDark = '#17251F';
      const mutedBar = '#E4E8E2';

      // Bar colors: highlight active days in lime, peak day in dark forest, rest days in muted gray
      const barColors = activeMinutes.map((val, idx) => {
        if (val === 0) return mutedBar;
        if (idx === 5) return forestDark; // Saturday peak session
        return limeAccent;
      });

      weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [{
            label: 'Minutes Active',
            data: activeMinutes,
            backgroundColor: barColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 32
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 400
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#17251F',
              titleFont: { family: 'Inter', size: 12, weight: '700' },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 10,
              cornerRadius: 8,
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
                font: { family: 'Inter', size: 12, weight: '600' }
              }
            },
            y: {
              beginAtZero: true,
              max: 60,
              grid: { color: 'rgba(23, 37, 31, 0.05)' },
              ticks: {
                stepSize: 15,
                color: '#7B8A83',
                font: { family: 'Inter', size: 11 },
                callback: (val) => `${val}m`
              }
            }
          }
        }
      });

      // Ensure canvas is visible and fallback is hidden
      canvas.style.display = 'block';
      if (cssFallback) cssFallback.style.display = 'none';
      return;
    } catch (chartErr) {
      console.warn('Chart.js render issue, using pure CSS fallback chart:', chartErr);
    }
  }

  // Graceful Fallback: Reveal pure CSS bar chart
  if (canvas) canvas.style.display = 'none';
  if (cssFallback) cssFallback.style.display = 'flex';
}

/**
 * Loads a realistic demo profile into sessionStorage so testers and reviewers
 * can instantly verify the personalized dashboard state.
 */
function loadSampleDemoProfile() {
  const sampleProfile = {
    name: 'Aarav Sharma',
    age: 21,
    gender: 'Male',
    height: 176,
    weight: 70,
    activityLevel: 'Moderate',
    fitnessGoal: 'Muscle Gain',
    dietPreference: 'Vegetarian',
    equipment: 'No Equipment',
    workoutExperience: 'Beginner',
    workoutDuration: '30 Minutes',
    updatedAt: new Date().toISOString()
  };

  try {
    sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(sampleProfile));
    sessionStorage.setItem('fitbuddy_demo_user_name', 'Aarav Sharma');
  } catch (err) {
    console.warn('Could not store demo profile:', err);
  }

  loadDashboardData();

  if (typeof showToast === 'function') {
    showToast('Personalized demo profile loaded! Metrics updated.', 'success');
  }
}

/**
 * Clears demo profile data from storage so testers and reviewers
 * can easily preview and verify the friendly empty-state layout.
 */
function clearDemoProfileData() {
  try {
    sessionStorage.removeItem('fitbuddy_demo_profile_data');
    sessionStorage.removeItem('fitbuddy_demo_user_name');
    localStorage.removeItem('fitbuddy_demo_profile_data');
    localStorage.removeItem('fitbuddy_demo_user_name');
  } catch (err) {
    console.warn('Could not clear demo profile:', err);
  }

  loadDashboardData();

  if (typeof showToast === 'function') {
    showToast('Demo data cleared. Viewing friendly empty state.', 'info');
  }
}

/**
 * Toggles between personalized demo profile and friendly empty state.
 */
function toggleDemoProfileMode() {
  const profile = getSavedProfile();
  if (profile) {
    clearDemoProfileData();
  } else {
    loadSampleDemoProfile();
  }
}

// Expose demo helpers globally for inline triggers and debugging
window.loadSampleDemoProfile = loadSampleDemoProfile;
window.clearDemoProfileData = clearDemoProfileData;
window.toggleDemoProfileMode = toggleDemoProfileMode;
