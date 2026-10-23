/**
 * ============================================================================
 * FitBuddy - Settings & Preferences Controller (settings.js)
 * Clean, lightweight preferences management:
 * 1. Measurement units: Metric (kg/cm) vs Imperial (lb/ft).
 * 2. Notification preference toggles.
 * 3. Accessibility: Reduced-motion mode toggle.
 * 4. Sign-out action with transparent frontend demo session reset.
 * 5. Security: Only user display preferences stored in browser.
 * ============================================================================
 */

// Storage Keys
const SETTINGS_UNITS_KEY = 'fitbuddy_units_pref';
const SETTINGS_NOTIFS_KEY = 'fitbuddy_notification_prefs';
const SETTINGS_MOTION_KEY = 'fitbuddy_reduced_motion';

document.addEventListener('DOMContentLoaded', () => {
  initSettings();
  bindSettingsEvents();
});

/**
 * Initializes settings inputs from localStorage
 */
function initSettings() {
  loadUnitsPreference();
  loadNotificationPreferences();
  loadReducedMotionPreference();
}

/**
 * Loads Units preference (metric vs imperial)
 */
function loadUnitsPreference() {
  try {
    const savedUnits = localStorage.getItem(SETTINGS_UNITS_KEY) || 'metric';
    const radio = document.querySelector(`input[name="unitsPreference"][value="${savedUnits}"]`);
    if (radio) {
      radio.checked = true;
    }
    updateUnitBadges(savedUnits);
  } catch (err) {
    console.warn('Could not read units preference:', err);
  }
}

/**
 * Updates UI badges showing active unit system
 * @param {string} unit 
 */
function updateUnitBadges(unit) {
  const badge = document.getElementById('activeUnitsBadge');
  if (badge) {
    badge.textContent = unit === 'imperial' ? 'Imperial (lb / ft)' : 'Metric (kg / cm)';
  }
}

/**
 * Loads notification checkbox states
 */
function loadNotificationPreferences() {
  const defaultNotifs = {
    dailyWorkout: true,
    timerBeeps: true,
    weeklyStreak: true,
    hydration: false
  };

  try {
    const raw = localStorage.getItem(SETTINGS_NOTIFS_KEY);
    const notifs = raw ? { ...defaultNotifs, ...JSON.parse(raw) } : defaultNotifs;

    setCheckboxState('notifDailyWorkout', notifs.dailyWorkout);
    setCheckboxState('notifTimerBeeps', notifs.timerBeeps);
    setCheckboxState('notifWeeklyStreak', notifs.weeklyStreak);
    setCheckboxState('notifHydration', notifs.hydration);
  } catch (err) {
    console.warn('Could not read notification preferences:', err);
  }
}

/**
 * Helper to set checkbox state
 * @param {string} id 
 * @param {boolean} checked 
 */
function setCheckboxState(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = Boolean(checked);
}

/**
 * Loads and applies reduced motion accessibility setting
 */
function loadReducedMotionPreference() {
  try {
    const isReduced = localStorage.getItem(SETTINGS_MOTION_KEY) === 'true';
    const toggle = document.getElementById('prefReducedMotion');
    if (toggle) {
      toggle.checked = isReduced;
    }
    applyReducedMotion(isReduced);
  } catch (err) {
    console.warn('Could not read reduced motion preference:', err);
  }
}

/**
 * Toggles the reduce-motion class on the body
 * @param {boolean} isReduced 
 */
function applyReducedMotion(isReduced) {
  if (isReduced) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
}

/**
 * Binds DOM event listeners
 */
function bindSettingsEvents() {
  // 1. Units radio change
  const unitRadios = document.querySelectorAll('input[name="unitsPreference"]');
  unitRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = radio.value;
      try {
        localStorage.setItem(SETTINGS_UNITS_KEY, selected);
      } catch (err) {
        console.warn('Could not save units preference:', err);
      }
      updateUnitBadges(selected);
      if (typeof showToast === 'function') {
        showToast(`Units updated to: ${selected === 'imperial' ? 'Imperial (lb/ft)' : 'Metric (kg/cm)'}`, 'info');
      }
    });
  });

  // 2. Reduced motion toggle
  const motionToggle = document.getElementById('prefReducedMotion');
  if (motionToggle) {
    motionToggle.addEventListener('change', () => {
      const isChecked = motionToggle.checked;
      try {
        localStorage.setItem(SETTINGS_MOTION_KEY, String(isChecked));
      } catch (err) {
        console.warn('Could not save reduced motion preference:', err);
      }
      applyReducedMotion(isChecked);
      if (typeof showToast === 'function') {
        showToast(isChecked ? 'Reduced motion enabled (animations disabled).' : 'Motion animations enabled.', 'info');
      }
    });
  }

  // 3. Save all settings form
  const settingsForm = document.getElementById('settingsPreferencesForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect notification states
      const notifs = {
        dailyWorkout: document.getElementById('notifDailyWorkout')?.checked ?? true,
        timerBeeps: document.getElementById('notifTimerBeeps')?.checked ?? true,
        weeklyStreak: document.getElementById('notifWeeklyStreak')?.checked ?? true,
        hydration: document.getElementById('notifHydration')?.checked ?? false
      };

      try {
        localStorage.setItem(SETTINGS_NOTIFS_KEY, JSON.stringify(notifs));
      } catch (err) {
        console.warn('Could not save notification preferences:', err);
      }

      if (typeof showToast === 'function') {
        showToast('All preferences saved successfully!', 'success');
      }
    });
  }

  // 4. Sign-Out Button
  const signoutBtn = document.getElementById('signoutSessionBtn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', handleSignout);
  }
}

/**
 * Handles frontend demo session sign-out
 * Clears demo state and displays security explanation
 */
function handleSignout() {
  const confirmed = window.confirm(
    'Are you sure you want to sign out of this FitBuddy demo session?\n\n' +
    'Note: This is a frontend demo session reset. In a production environment, ' +
    'this call securely invalidates server-side session tokens and HTTP-only cookies via Spring Boot.'
  );

  if (!confirmed) return;

  // Clear demo session storage keys
  try {
    sessionStorage.removeItem('fitbuddy_demo_profile_data');
    sessionStorage.removeItem('fitbuddy_completed_workouts');
    sessionStorage.removeItem('fitbuddy_demo_user_name');
  } catch (err) {
    console.warn('Could not clear sessionStorage on sign-out:', err);
  }

  if (typeof showToast === 'function') {
    showToast('Signed out of demo session. Redirecting to home...', 'info', 3000);
  }

  // Redirect to home page
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1200);
}

// Global exposure
window.handleSignout = handleSignout;
