/**
 * ============================================================================
 * FitBuddy - Profile Setup Logic (profile.js)
 * Handles client-side validation for all 11 user profile fields,
 * checks realistic input boundaries, stores demo profile data in sessionStorage,
 * and navigates to the BMI Result page.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pre-fill full name if available from registration step
  prefillRegisteredName();

  // 2. Setup real-time error clearance
  setupRealtimeProfileValidation();

  // 3. Handle Profile Setup form submission
  const profileForm = document.getElementById('profileSetupForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }
});

/**
 * Checks if a name was stored in sessionStorage during registration
 * and pre-fills it into the name input.
 */
async function prefillRegisteredName() {
  const nameInput = document.getElementById('name');
  if (!nameInput) return;

  if (window.FitBuddyApi && window.FitBuddyApi.isLoggedIn()) {
    try {
      const user = window.FitBuddyApi.getCurrentUser();
      if (user && user.fullName) {
        nameInput.value = user.fullName;
        return;
      }
    } catch (e) {}
  }

  try {
    const savedName = sessionStorage.getItem('fitbuddy_demo_user_name');
    if (savedName && savedName.trim() !== '') {
      nameInput.value = savedName.trim();
    }
  } catch (err) {
    console.warn('Could not read demo name from sessionStorage:', err);
  }
}

/**
 * Clears red border and inline error message as soon as user types or changes value
 */
function setupRealtimeProfileValidation() {
  const form = document.getElementById('profileSetupForm');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input, .form-select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearFieldError(input.id);
    });
    input.addEventListener('change', () => {
      clearFieldError(input.id);
    });
  });
}

/**
 * Validates the profile form fields and navigates to bmi.html
 * @param {Event} e 
 */
async function handleProfileSubmit(e) {
  e.preventDefault();

  // Extract Form Input Values
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const activityLevelSelect = document.getElementById('activityLevel');
  const workoutExperienceSelect = document.getElementById('workoutExperience');
  const workoutDurationSelect = document.getElementById('workoutDuration');

  // Radio button groups
  const genderRadio = document.querySelector('input[name="gender"]:checked');
  const fitnessGoalRadio = document.querySelector('input[name="fitnessGoal"]:checked');
  const dietPreferenceRadio = document.querySelector('input[name="dietPreference"]:checked');
  const equipmentRadio = document.querySelector('input[name="equipment"]:checked');

  // Parse values
  const name = nameInput ? nameInput.value.trim() : '';
  const age = ageInput ? parseInt(ageInput.value, 10) : NaN;
  const height = heightInput ? parseFloat(heightInput.value) : NaN;
  const weight = weightInput ? parseFloat(weightInput.value) : NaN;
  const activityLevel = activityLevelSelect ? activityLevelSelect.value : '';
  const workoutExperience = workoutExperienceSelect ? workoutExperienceSelect.value : 'Beginner';
  const workoutDuration = workoutDurationSelect ? workoutDurationSelect.value : '30 minutes';

  const gender = genderRadio ? genderRadio.value : 'Prefer not to say';
  const fitnessGoal = fitnessGoalRadio ? fitnessGoalRadio.value : 'General Fitness';
  const dietPreference = dietPreferenceRadio ? dietPreferenceRadio.value : 'Vegetarian';
  const equipment = equipmentRadio ? equipmentRadio.value : 'No Equipment';

  let isValid = true;

  // 1. Validate Name
  if (!name || name.length < 2) {
    showProfileError('name', 'Please enter your full name (at least 2 characters).');
    isValid = false;
  }

  // 2. Validate Age (positive number between 12 and 100)
  if (isNaN(age) || age < 12 || age > 100) {
    showProfileError('age', 'Please enter a valid age between 12 and 100 years.');
    isValid = false;
  }

  // 3. Validate Height in cm (positive number between 50 and 250 cm)
  if (isNaN(height) || height < 50 || height > 250) {
    showProfileError('height', 'Please enter a realistic height between 50 cm and 250 cm.');
    isValid = false;
  }

  // 4. Validate Weight in kg (positive number between 20 and 300 kg)
  if (isNaN(weight) || weight < 20 || weight > 300) {
    showProfileError('weight', 'Please enter a realistic weight between 20 kg and 300 kg.');
    isValid = false;
  }

  // 5. Validate Activity Level
  if (!activityLevel) {
    showProfileError('activityLevel', 'Please select your daily activity level.');
    isValid = false;
  }

  if (!isValid) {
    showToast('Please correct the highlighted profile fields.', 'warning');
    return;
  }

  // Construct complete demographic and preference object
  const profileData = {
    name: name,
    age: age,
    gender: gender,
    height: height,
    weight: weight,
    activityLevel: activityLevel,
    fitnessGoal: fitnessGoal,
    dietPreference: dietPreference,
    equipment: equipment,
    workoutExperience: workoutExperience,
    workoutDuration: workoutDuration,
    updatedAt: new Date().toISOString()
  };

  // Cache in storage
  try {
    sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(profileData));
    localStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(profileData));
  } catch (err) {
    console.warn('Could not save profile data to storage:', err);
  }

  // Save to Spring Boot & MySQL backend
  if (window.FitBuddyApi && window.FitBuddyApi.isLoggedIn()) {
    try {
      await window.FitBuddyApi.updateProfile({
        age,
        gender,
        height,
        weight,
        activityLevel,
        fitnessGoal,
        equipment,
        dietPreference,
        workoutExperience,
        workoutDuration
      });
      await window.FitBuddyApi.logBmi({ height, weight });
    } catch (err) {
      console.warn('Backend profile update deferred:', err);
    }
  }

  // Display friendly feedback
  showToast(
    'Profile saved! Calculating your baseline BMI and personalizing suggestions...',
    'success',
    3500
  );

  // Smooth redirection to BMI Result Page
  setTimeout(() => {
    window.location.href = 'bmi.html';
  }, 1000);
}

/**
 * Helper to display inline error message below field
 */
function showProfileError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}Error`);

  if (input) {
    input.classList.add('is-invalid');
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

/**
 * Helper to clear inline error styling
 */
function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}Error`);

  if (input) {
    input.classList.remove('is-invalid');
  }

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}
