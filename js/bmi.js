/**
 * ============================================================================
 * FitBuddy - BMI Calculation & Suggestions Engine (bmi.js)
 * Beginner-friendly vanilla JavaScript for:
 * 1. Calculating BMI = kg / (m^2) to one decimal place.
 * 2. Classifying standard WHO adult BMI ranges.
 * 3. Providing personalized, non-medical general suggestions based on
 *    the user's goals, diet, equipment, and duration.
 * 4. Interactive recalculation with input validation.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load profile data from sessionStorage (or fall back to demo defaults)
  const profile = loadProfileData();

  // 2. Render initial assessment
  renderBmiAssessment(profile);

  // 3. Setup the live recalculator form
  const recalcForm = document.getElementById('bmiRecalculateForm');
  if (recalcForm) {
    recalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLiveRecalculation(profile);
    });
  }
});

/**
 * Loads profile data saved during profile setup, or supplies standard demo values
 * @returns {object}
 */
function loadProfileData() {
  const defaultProfile = {
    name: 'Explorer',
    age: 21,
    gender: 'Male',
    height: 175,
    weight: 68,
    activityLevel: 'Sedentary',
    fitnessGoal: 'General Fitness',
    dietPreference: 'Vegetarian',
    equipment: 'No Equipment',
    workoutExperience: 'Beginner',
    workoutDuration: '30 minutes'
  };

  try {
    const rawData = sessionStorage.getItem('fitbuddy_demo_profile_data');
    if (rawData) {
      const parsed = JSON.parse(rawData);
      return { ...defaultProfile, ...parsed };
    }
  } catch (err) {
    console.warn('Could not read demo profile from sessionStorage:', err);
  }

  return defaultProfile;
}

/**
 * Calculates BMI and updates the DOM with scores, categories, and tailored suggestions
 * @param {object} profile 
 */
function renderBmiAssessment(profile) {
  const heightCm = profile.height;
  const weightKg = profile.weight;

  // Formula: BMI = weight (kg) / [height (m)]^2
  const heightM = heightCm / 100;
  const bmiValue = weightKg / (heightM * heightM);
  const formattedBmi = bmiValue.toFixed(1);

  // 1. Update Profile Metric Strip & Subtitle
  const greetingEl = document.getElementById('userGreetingSubtitle');
  if (greetingEl) {
    greetingEl.textContent = `Welcome, ${profile.name}! Here is your physical screening assessment and tailored home workout blueprint.`;
  }

  document.getElementById('displayHeight').textContent = `${heightCm}`;
  document.getElementById('displayWeight').textContent = `${weightKg}`;
  document.getElementById('displayGoal').textContent = profile.fitnessGoal;
  document.getElementById('displayDuration').textContent = profile.workoutDuration;

  // Pre-fill recalculator inputs with current values
  const recalcHeightInput = document.getElementById('recalcHeight');
  const recalcWeightInput = document.getElementById('recalcWeight');
  if (recalcHeightInput) recalcHeightInput.value = heightCm;
  if (recalcWeightInput) recalcWeightInput.value = weightKg;

  // 2. Display BMI Score & Adult Category
  const scoreDisplay = document.getElementById('bmiScoreDisplay');
  const badgeEl = document.getElementById('bmiCategoryBadge');
  const summaryEl = document.getElementById('bmiQuickSummary');

  scoreDisplay.textContent = formattedBmi;

  let categoryName = '';
  let categoryColorClass = '';
  let summaryText = '';

  if (bmiValue < 18.5) {
    categoryName = 'Underweight (&lt; 18.5)';
    badgeEl.className = 'badge badge-subtle';
    badgeEl.style.backgroundColor = '#e0f2fe';
    badgeEl.style.color = '#0369a1';
    badgeEl.style.border = '1px solid #7dd3fc';
    summaryText = `Your calculated BMI is ${formattedBmi}, placing you in the underweight screening range. Focus on nutrient-dense meals and progressive bodyweight resistance training to build lean mass.`;
  } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
    categoryName = 'Normal Weight (18.5 – 24.9)';
    badgeEl.className = 'badge badge-lime';
    badgeEl.style.backgroundColor = 'var(--primary-accent-subtle)';
    badgeEl.style.color = 'var(--forest-dark)';
    badgeEl.style.border = '1px solid rgba(185, 243, 106, 0.8)';
    summaryText = `Your calculated BMI is ${formattedBmi}, which falls within the standard normal/healthy adult range. Consistency with your ${profile.workoutDuration} home workouts will help you sustain daily energy and strength.`;
  } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
    categoryName = 'Overweight Range (25.0 – 29.9)';
    badgeEl.className = 'badge';
    badgeEl.style.backgroundColor = '#fef3c7';
    badgeEl.style.color = '#b45309';
    badgeEl.style.border = '1px solid #fde68a';
    summaryText = `Your calculated BMI is ${formattedBmi}, placing you in the overweight screening bracket. Combining regular ${profile.workoutDuration} home routines with wholesome dietary swaps can build functional endurance.`;
  } else {
    categoryName = 'Obesity Range (&ge; 30.0)';
    badgeEl.className = 'badge';
    badgeEl.style.backgroundColor = '#fee2e2';
    badgeEl.style.color = '#b91c1c';
    badgeEl.style.border = '1px solid #fca5a5';
    summaryText = `Your calculated BMI is ${formattedBmi}, placing you in the obesity screening range. We recommend starting with low-impact bodyweight mobility flows and consulting a healthcare professional for structured clinical support.`;
  }

  badgeEl.innerHTML = categoryName;
  summaryEl.textContent = summaryText;

  // 3. Render Personalized General Suggestions (Without medical claims)
  renderTailoredSuggestions(profile, bmiValue);
}

/**
 * Builds tailored suggestions based on the user's selected parameters
 * @param {object} profile 
 * @param {number} bmiValue 
 */
function renderTailoredSuggestions(profile, bmiValue) {
  // Suggestion 1: Workout Routine
  const workoutTitleEl = document.getElementById('suggestionWorkoutTitle');
  const workoutDescEl = document.getElementById('suggestionWorkoutDesc');
  const workoutTagsEl = document.getElementById('suggestionWorkoutTags');

  let workoutTitle = `${profile.workoutDuration} ${profile.fitnessGoal} Routine`;
  let workoutDesc = '';

  if (profile.fitnessGoal === 'Muscle Gain' || profile.fitnessGoal === 'Strength') {
    workoutDesc = `Because your goal is ${profile.fitnessGoal}, focus on controlled tempo compound bodyweight movements (push-ups, air squats, doorway rows, and planks) performed with high intent. With ${profile.equipment}, aim for 3 to 4 challenging sets where the last reps feel difficult.`;
  } else if (profile.fitnessGoal === 'Weight Management') {
    workoutDesc = `To support your ${profile.fitnessGoal} target, incorporate interval-style micro-sessions (e.g. 40 seconds of movement followed by 20 seconds of rest). Circuit calisthenics like bodyweight squats, mountain climbers, and fast-paced shadow boxing provide great conditioning.`;
  } else if (profile.fitnessGoal === 'Endurance') {
    workoutDesc = `For ${profile.fitnessGoal}, train your cardiovascular work-capacity through high-rep circuits with short rest periods. Consistent 30–45 minute stamina routines will boost your lung capacity and mental resilience.`;
  } else {
    // General Fitness default
    workoutDesc = `For ${profile.fitnessGoal}, balance your week with 3 days of full-body bodyweight resistance and 2 days of posture mobility to counteract long study and desk hours.`;
  }

  workoutTitleEl.textContent = workoutTitle;
  workoutDescEl.textContent = workoutDesc;

  workoutTagsEl.innerHTML = `
    <span class="badge badge-subtle">Goal: ${profile.fitnessGoal}</span>
    <span class="badge badge-subtle">Equip: ${profile.equipment}</span>
    <span class="badge badge-subtle">Exp: ${profile.workoutExperience}</span>
    <span class="badge badge-lime">${profile.workoutDuration}</span>
  `;

  // Suggestion 2: Nutrition & Diet
  const dietTitleEl = document.getElementById('suggestionDietTitle');
  const dietDescEl = document.getElementById('suggestionDietDesc');
  const dietTagsEl = document.getElementById('suggestionDietTags');

  let dietTitle = `${profile.dietPreference} Nutrition Blueprint`;
  let dietDesc = '';

  if (profile.dietPreference === 'Vegetarian') {
    dietDesc = 'As a vegetarian, anchor your meals around affordable protein staples: roasted chana (chickpeas), lentils (dal), curd/yogurt, paneer, tofu, and peanut butter. Ensure you include complex carbohydrates like oats or brown rice for sustained study and workout stamina.';
  } else if (profile.dietPreference === 'Eggetarian') {
    dietDesc = 'As an eggetarian, eggs provide a complete, budget-friendly source of leucine and amino acids. Combining whole boiled eggs, egg-bhurji, or omelettes with dairy (paneer/curd) and legumes makes hitting daily nutrition targets easy and affordable.';
  } else {
    // Non-Vegetarian
    dietDesc = 'As a non-vegetarian, incorporate lean protein options like boiled eggs, grilled chicken breast, and fish alongside lentils, leafy greens, and whole grains. Avoid heavy fried fast food before workout sessions to maintain peak alertness.';
  }

  dietTitleEl.textContent = dietTitle;
  dietDescEl.textContent = dietDesc;

  dietTagsEl.innerHTML = `
    <span class="badge badge-subtle">Diet: ${profile.dietPreference}</span>
    <span class="badge badge-subtle">Whole Foods</span>
    <span class="badge badge-subtle">Budget Friendly</span>
  `;

  // Suggestion 3: Daily Habit & Schedule
  const habitTitleEl = document.getElementById('suggestionHabitTitle');
  const habitDescEl = document.getElementById('suggestionHabitDesc');
  const habitTagsEl = document.getElementById('suggestionHabitTags');

  let habitDesc = '';
  if (profile.activityLevel === 'Sedentary') {
    habitDesc = 'Since your daily routine is mostly seated (study sessions or desk work), set a repeating reminder to stand up and stretch your hip flexors and chest every 50 minutes. Pair this with 2.5 to 3 Litres of daily water intake.';
  } else {
    habitDesc = 'Your active lifestyle creates strong metabolic momentum. Prioritize 7 to 8 hours of quality sleep to let your central nervous system and muscles fully recover between workout days.';
  }

  habitTitleEl.textContent = `${profile.activityLevel} Habit Strategy`;
  habitDescEl.textContent = habitDesc;

  habitTagsEl.innerHTML = `
    <span class="badge badge-subtle">Activity: ${profile.activityLevel}</span>
    <span class="badge badge-subtle">Hydration 2.5L+</span>
    <span class="badge badge-subtle">Sleep 7-8h</span>
  `;
}

/**
 * Handles instant recalculation when user modifies height or weight on bmi.html
 * @param {object} profile 
 */
function handleLiveRecalculation(profile) {
  const heightInput = document.getElementById('recalcHeight');
  const weightInput = document.getElementById('recalcWeight');

  const newHeight = heightInput ? parseFloat(heightInput.value) : NaN;
  const newWeight = weightInput ? parseFloat(weightInput.value) : NaN;

  if (isNaN(newHeight) || newHeight < 50 || newHeight > 250) {
    showToast('Please enter a realistic height between 50 cm and 250 cm.', 'warning');
    if (heightInput) heightInput.focus();
    return;
  }

  if (isNaN(newWeight) || newWeight < 20 || newWeight > 300) {
    showToast('Please enter a realistic weight between 20 kg and 300 kg.', 'warning');
    if (weightInput) weightInput.focus();
    return;
  }

  // Update profile in memory
  profile.height = newHeight;
  profile.weight = newWeight;

  // Persist updated values in demo sessionStorage
  try {
    sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(profile));
  } catch (err) {
    console.warn('Could not update demo profile in sessionStorage:', err);
  }

  // Re-render UI
  renderBmiAssessment(profile);

  showToast('BMI assessment recalculated live!', 'success', 2500);

  // Smooth scroll up to scorecard
  const scoreCard = document.querySelector('.bmi-result-card');
  if (scoreCard) {
    scoreCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
