/**
 * ============================================================================
 * FitBuddy - User Profile Management Controller (user-profile.js)
 * Clean, modular logic for viewing and editing the user profile.
 * Features:
 * 1. Loads profile from sessionStorage (or initializes standard defaults).
 * 2. Real-time dynamic BMI calculation when height or weight inputs change.
 * 3. Validation for all demographic, preference, and equipment inputs.
 * 4. Saves changes back to sessionStorage so Dashboard, Diet, and BMI stay synced.
 * 5. Transparent notice regarding frontend demo persistence.
 * ============================================================================
 */

// Default Profile Dataset
const DEFAULT_USER_PROFILE = {
  name: 'Alex Explorer',
  age: 21,
  gender: 'Male',
  height: 175,
  weight: 68.0,
  activityLevel: 'Lightly Active',
  fitnessGoal: 'General Fitness',
  equipment: 'No Equipment',
  dietPreference: 'Vegetarian',
  workoutDuration: '30 minutes'
};

let currentProfile = { ...DEFAULT_USER_PROFILE };

document.addEventListener('DOMContentLoaded', () => {
  initUserProfilePage();
  bindProfileFormEvents();
});

/**
 * Initializes the profile page, loading saved data and updating UI
 */
function initUserProfilePage() {
  loadProfileData();
  populateProfileForm();
  updateLiveBmiPreview();
  updateProfileAvatar();
}

/**
 * Reads profile data from sessionStorage
 */
function loadProfileData() {
  try {
    const raw = sessionStorage.getItem('fitbuddy_demo_profile_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      currentProfile = { ...DEFAULT_USER_PROFILE, ...parsed };
      return;
    }
  } catch (err) {
    console.warn('Could not read demo profile data:', err);
  }

  currentProfile = { ...DEFAULT_USER_PROFILE };
}

/**
 * Populates all input fields with currentProfile values
 */
function populateProfileForm() {
  setInputValue('profileName', currentProfile.name);
  setInputValue('profileAge', currentProfile.age);
  setInputValue('profileHeight', currentProfile.height);
  setInputValue('profileWeight', currentProfile.weight);
  setInputValue('profileFitnessGoal', currentProfile.fitnessGoal);
  setInputValue('profileActivityLevel', currentProfile.activityLevel);
  setInputValue('profileEquipment', currentProfile.equipment);
  setInputValue('profileDietPreference', currentProfile.dietPreference);

  // Update header text display
  const nameDisplay = document.getElementById('displayProfileName');
  if (nameDisplay) {
    nameDisplay.textContent = currentProfile.name || 'FitBuddy Member';
  }

  const metaDisplay = document.getElementById('displayProfileMeta');
  if (metaDisplay) {
    metaDisplay.textContent = `${currentProfile.fitnessGoal} • ${currentProfile.dietPreference} • ${currentProfile.equipment}`;
  }
}

/**
 * Helper to safely assign value to an input by element ID
 * @param {string} id 
 * @param {any} val 
 */
function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) {
    el.value = val;
  }
}

/**
 * Updates avatar circle with the first letter of user's name
 */
function updateProfileAvatar() {
  const avatarEl = document.getElementById('profileAvatarLetter');
  if (avatarEl) {
    const firstLetter = (currentProfile.name || 'A').trim().charAt(0).toUpperCase();
    avatarEl.textContent = firstLetter;
  }
}

/**
 * Real-time BMI calculation based on current height & weight inputs
 */
function updateLiveBmiPreview() {
  const heightInput = document.getElementById('profileHeight');
  const weightInput = document.getElementById('profileWeight');
  const bmiValEl = document.getElementById('liveBmiValue');
  const bmiBadgeEl = document.getElementById('liveBmiBadge');

  const h = heightInput ? parseFloat(heightInput.value) : currentProfile.height;
  const w = weightInput ? parseFloat(weightInput.value) : currentProfile.weight;

  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
    if (bmiValEl) bmiValEl.textContent = '—';
    if (bmiBadgeEl) {
      bmiBadgeEl.className = 'badge badge-outline';
      bmiBadgeEl.textContent = 'Enter height & weight';
    }
    return;
  }

  // BMI formula: weight (kg) / [height (m)]²
  const heightInMeters = h / 100;
  const bmi = w / (heightInMeters * heightInMeters);
  const formattedBmi = bmi.toFixed(1);

  if (bmiValEl) {
    bmiValEl.textContent = formattedBmi;
  }

  if (bmiBadgeEl) {
    if (bmi < 18.5) {
      bmiBadgeEl.className = 'badge badge-secondary';
      bmiBadgeEl.textContent = 'Underweight';
    } else if (bmi <= 24.9) {
      bmiBadgeEl.className = 'badge badge-primary';
      bmiBadgeEl.textContent = 'Normal Weight';
    } else if (bmi <= 29.9) {
      bmiBadgeEl.className = 'badge';
      bmiBadgeEl.style.backgroundColor = '#FEF3C7';
      bmiBadgeEl.style.color = '#B45309';
      bmiBadgeEl.style.border = '1px solid #FDE68A';
      bmiBadgeEl.textContent = 'Overweight';
    } else {
      bmiBadgeEl.className = 'badge';
      bmiBadgeEl.style.backgroundColor = '#FEE2E2';
      bmiBadgeEl.style.color = '#B91C1C';
      bmiBadgeEl.style.border = '1px solid #FCA5A5';
      bmiBadgeEl.textContent = 'Obesity Category';
    }
  }
}

/**
 * Binds submit and live input listeners
 */
function bindProfileFormEvents() {
  const form = document.getElementById('userProfileForm');
  if (form) {
    form.addEventListener('submit', handleProfileSave);
  }

  const heightInput = document.getElementById('profileHeight');
  const weightInput = document.getElementById('profileWeight');

  if (heightInput) {
    heightInput.addEventListener('input', updateLiveBmiPreview);
  }
  if (weightInput) {
    weightInput.addEventListener('input', updateLiveBmiPreview);
  }

  const resetBtn = document.getElementById('resetProfileBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentProfile = { ...DEFAULT_USER_PROFILE };
      populateProfileForm();
      updateLiveBmiPreview();
      updateProfileAvatar();
      if (typeof showToast === 'function') {
        showToast('Profile form reset to default values.', 'info');
      }
    });
  }
}

/**
 * Validates inputs and saves updated profile
 * @param {Event} e 
 */
function handleProfileSave(e) {
  e.preventDefault();

  const nameVal = document.getElementById('profileName').value.trim();
  const ageVal = parseInt(document.getElementById('profileAge').value, 10);
  const heightVal = parseFloat(document.getElementById('profileHeight').value);
  const weightVal = parseFloat(document.getElementById('profileWeight').value);
  const goalVal = document.getElementById('profileFitnessGoal').value;
  const activityVal = document.getElementById('profileActivityLevel').value;
  const equipVal = document.getElementById('profileEquipment').value;
  const dietVal = document.getElementById('profileDietPreference').value;

  // --- VALIDATION RULES ---
  if (!nameVal || nameVal.length < 2) {
    if (typeof showToast === 'function') showToast('Please enter your full name (at least 2 characters).', 'warning');
    document.getElementById('profileName').focus();
    return;
  }

  if (isNaN(ageVal) || ageVal < 10 || ageVal > 120) {
    if (typeof showToast === 'function') showToast('Please enter a valid age between 10 and 120.', 'warning');
    document.getElementById('profileAge').focus();
    return;
  }

  if (isNaN(heightVal) || heightVal < 50 || heightVal > 250) {
    if (typeof showToast === 'function') showToast('Please enter a valid height between 50 cm and 250 cm.', 'warning');
    document.getElementById('profileHeight').focus();
    return;
  }

  if (isNaN(weightVal) || weightVal < 20 || weightVal > 300) {
    if (typeof showToast === 'function') showToast('Please enter a valid body weight between 20 kg and 300 kg.', 'warning');
    document.getElementById('profileWeight').focus();
    return;
  }

  // Update profile state
  currentProfile.name = nameVal;
  currentProfile.age = ageVal;
  currentProfile.height = heightVal;
  currentProfile.weight = weightVal;
  currentProfile.fitnessGoal = goalVal;
  currentProfile.activityLevel = activityVal;
  currentProfile.equipment = equipVal;
  currentProfile.dietPreference = dietVal;
  currentProfile.updatedAt = new Date().toISOString();

  // Persist to sessionStorage (only client demographic attributes stored)
  try {
    sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(currentProfile));
  } catch (err) {
    console.warn('Could not save profile to sessionStorage:', err);
  }

  // Update displays
  populateProfileForm();
  updateLiveBmiPreview();
  updateProfileAvatar();

  if (typeof showToast === 'function') {
    showToast('Profile updated! Live BMI and recommendations synced.', 'success');
  }
}

// Global exposure
window.updateLiveBmiPreview = updateLiveBmiPreview;
window.handleProfileSave = handleProfileSave;
