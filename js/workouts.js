/**
 * ============================================================================
 * FitBuddy - Workouts Catalogue Controller (workouts.js)
 * Manages category filtering, personalized equipment and goal matching,
 * real-time search, and dynamic exercise card rendering.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initWorkoutCatalogue();
});

// Active filter state
const currentFilters = {
  category: 'All',
  bodyPart: 'All',
  equipment: 'All',
  experience: 'All',
  goal: 'All',
  duration: 'All',
  searchQuery: ''
};

/**
 * Initializes the catalogue page, loads demo profile defaults,
 * renders category tabs, and triggers initial exercise card rendering.
 */
function initWorkoutCatalogue() {
  loadProfilePreferences();
  renderCategoryPills();
  initFilterControls();
  renderExercises();
  loadExercises();
}

/**
 * Loads exercises from Spring Boot REST API (http://localhost:8080/api/exercises)
 */
async function loadExercises() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/exercises"
    );

    if (!response.ok) {
      throw new Error("Unable to load exercises");
    }

    const exercises = await response.json();

    console.log(exercises);
    if (Array.isArray(exercises) && exercises.length > 0) {
      window.EXERCISES = exercises;
      renderExercises();
    }
    return exercises;
  } catch (error) {
    console.error(error);
    // If no fallback data is present, notify the user
    if (typeof EXERCISES === 'undefined' || !EXERCISES || EXERCISES.length === 0) {
      alert("Exercises could not be loaded. Please try again.");
    }
    return null;
  }
}
window.loadExercises = loadExercises;

/**
 * Loads preferences from saved demo profile to pre-personalize filters
 */
function loadProfilePreferences() {
  try {
    const raw = sessionStorage.getItem('fitbuddy_demo_profile_data') || 
                localStorage.getItem('fitbuddy_demo_profile_data');
    if (raw) {
      const profile = JSON.parse(raw);
      
      // Auto-configure equipment: if user has "No Equipment", respect strictly!
      if (profile.equipment) {
        currentFilters.equipment = profile.equipment;
      }
      if (profile.fitnessGoal) {
        currentFilters.goal = profile.fitnessGoal;
      }
      if (profile.workoutExperience) {
        currentFilters.experience = profile.workoutExperience;
      }
      if (profile.workoutDuration) {
        // e.g. "30 Mins" -> match "30"
        const durNum = parseInt(profile.workoutDuration, 10);
        if ([15, 30, 45, 60].includes(durNum)) {
          currentFilters.duration = String(durNum);
        }
      }

      updateSyncProfileBadge(profile);
    }
  } catch (err) {
    console.warn('Could not read profile preferences:', err);
  }
}

/**
 * Updates the visual banner indicating personalized profile sync
 */
function updateSyncProfileBadge(profile) {
  const syncBanner = document.getElementById('profileSyncBanner');
  const syncText = document.getElementById('profileSyncText');
  if (syncBanner && syncText && profile && profile.name) {
    syncBanner.style.display = 'flex';
    syncText.innerHTML = `Personalized for <strong>${profile.name}</strong> • Equipment: <strong>${profile.equipment || 'No Equipment'}</strong> • Goal: <strong>${profile.fitnessGoal || 'General Fitness'}</strong>`;
  }
}

/**
 * Renders the horizontal interactive category pills
 */
function renderCategoryPills() {
  const container = document.getElementById('categoryPillNav');
  if (!container || typeof EXERCISE_CATEGORIES === 'undefined') return;

  container.innerHTML = '';

  EXERCISE_CATEGORIES.forEach(category => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `category-pill ${currentFilters.category === category ? 'active' : ''}`;
    pill.textContent = category;
    pill.setAttribute('aria-pressed', currentFilters.category === category ? 'true' : 'false');

    pill.addEventListener('click', () => {
      currentFilters.category = category;
      // Update active pill UI
      container.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');

      // Also sync body part select if matching category
      const bodyPartSelect = document.getElementById('filterBodyPart');
      if (bodyPartSelect && TARGET_BODY_PARTS.includes(category)) {
        bodyPartSelect.value = category;
        currentFilters.bodyPart = category;
      } else if (bodyPartSelect && category === 'All') {
        bodyPartSelect.value = 'All';
        currentFilters.bodyPart = 'All';
      }

      renderExercises();
    });

    container.appendChild(pill);
  });
}

/**
 * Binds change events for search input, select dropdowns, and reset buttons
 */
function initFilterControls() {
  const searchInput = document.getElementById('filterSearchInput');
  const bodyPartSelect = document.getElementById('filterBodyPart');
  const equipmentSelect = document.getElementById('filterEquipment');
  const experienceSelect = document.getElementById('filterExperience');
  const goalSelect = document.getElementById('filterGoal');
  const durationSelect = document.getElementById('filterDuration');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const reSyncProfileBtn = document.getElementById('reSyncProfileBtn');

  // Set initial control values if preloaded from profile
  if (equipmentSelect && currentFilters.equipment !== 'All') {
    equipmentSelect.value = currentFilters.equipment;
  }
  if (goalSelect && currentFilters.goal !== 'All') {
    goalSelect.value = currentFilters.goal;
  }
  if (experienceSelect && currentFilters.experience !== 'All') {
    experienceSelect.value = currentFilters.experience;
  }
  if (durationSelect && currentFilters.duration !== 'All') {
    durationSelect.value = currentFilters.duration;
  }

  // Search input with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.searchQuery = e.target.value.trim().toLowerCase();
        renderExercises();
      }, 200);
    });
  }

  // Select dropdowns
  if (bodyPartSelect) {
    bodyPartSelect.addEventListener('change', (e) => {
      currentFilters.bodyPart = e.target.value;
      // Sync category pills if category exists
      if (EXERCISE_CATEGORIES.includes(e.target.value)) {
        currentFilters.category = e.target.value;
        syncCategoryPillsUi();
      }
      renderExercises();
    });
  }

  if (equipmentSelect) {
    equipmentSelect.addEventListener('change', (e) => {
      currentFilters.equipment = e.target.value;
      renderExercises();
    });
  }

  if (experienceSelect) {
    experienceSelect.addEventListener('change', (e) => {
      currentFilters.experience = e.target.value;
      renderExercises();
    });
  }

  if (goalSelect) {
    goalSelect.addEventListener('change', (e) => {
      currentFilters.goal = e.target.value;
      renderExercises();
    });
  }

  if (durationSelect) {
    durationSelect.addEventListener('change', (e) => {
      currentFilters.duration = e.target.value;
      renderExercises();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }

  if (reSyncProfileBtn) {
    reSyncProfileBtn.addEventListener('click', () => {
      loadProfilePreferences();
      // Sync UI selects
      if (equipmentSelect) equipmentSelect.value = currentFilters.equipment;
      if (goalSelect) goalSelect.value = currentFilters.goal;
      if (experienceSelect) experienceSelect.value = currentFilters.experience;
      if (durationSelect) durationSelect.value = currentFilters.duration;
      renderExercises();
      if (typeof showToast === 'function') {
        showToast('Filters synchronized with your profile setup!', 'success');
      }
    });
  }
}

/**
 * Synchronizes the category pill button styling with currentFilters.category
 */
function syncCategoryPillsUi() {
  const container = document.getElementById('categoryPillNav');
  if (!container) return;
  container.querySelectorAll('.category-pill').forEach(btn => {
    if (btn.textContent === currentFilters.category) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

/**
 * Resets all filters back to default 'All' state
 */
function resetAllFilters() {
  currentFilters.category = 'All';
  currentFilters.bodyPart = 'All';
  currentFilters.equipment = 'All';
  currentFilters.experience = 'All';
  currentFilters.goal = 'All';
  currentFilters.duration = 'All';
  currentFilters.searchQuery = '';

  const searchInput = document.getElementById('filterSearchInput');
  const bodyPartSelect = document.getElementById('filterBodyPart');
  const equipmentSelect = document.getElementById('filterEquipment');
  const experienceSelect = document.getElementById('filterExperience');
  const goalSelect = document.getElementById('filterGoal');
  const durationSelect = document.getElementById('filterDuration');

  if (searchInput) searchInput.value = '';
  if (bodyPartSelect) bodyPartSelect.value = 'All';
  if (equipmentSelect) equipmentSelect.value = 'All';
  if (experienceSelect) experienceSelect.value = 'All';
  if (goalSelect) goalSelect.value = 'All';
  if (durationSelect) durationSelect.value = 'All';

  syncCategoryPillsUi();
  renderExercises();

  if (typeof showToast === 'function') {
    showToast('All filters have been reset.', 'info');
  }
}

/**
 * Filters the master EXERCISES array according to active filter specifications
 * @returns {Array} Filtered array of exercises
 */
function getFilteredExercises() {
  if (typeof EXERCISES === 'undefined') return [];

  return EXERCISES.filter(exercise => {
    // 1. Category Filter
    if (currentFilters.category !== 'All' && exercise.category !== currentFilters.category) {
      return false;
    }

    // 2. Body Part Filter
    if (currentFilters.bodyPart !== 'All' && exercise.targetBodyPart !== currentFilters.bodyPart) {
      return false;
    }

    // 3. Equipment Filter (CRITICAL REQUIREMENT: Do not recommend equipment-dependent exercises when user lacks equipment)
    if (currentFilters.equipment === 'No Equipment') {
      if (exercise.requiredEquipment !== 'No Equipment') {
        return false;
      }
    } else if (currentFilters.equipment === 'Dumbbells') {
      // User has dumbbells, so dumbbell exercises or bodyweight exercises are compatible
      if (exercise.requiredEquipment !== 'Dumbbells' && exercise.requiredEquipment !== 'No Equipment') {
        return false;
      }
    }

    // 4. Experience Level Filter
    if (currentFilters.experience !== 'All') {
      if (currentFilters.experience === 'Beginner' && exercise.difficulty === 'Advanced') {
        return false;
      }
      if (currentFilters.experience === 'Advanced' && exercise.difficulty === 'Beginner') {
        // Advanced users can do all, but we prioritize matching
      }
    }

    // 5. Fitness Goal Filter
    if (currentFilters.goal !== 'All' && exercise.fitnessGoals) {
      if (!exercise.fitnessGoals.includes(currentFilters.goal)) {
        return false;
      }
    }

    // 6. Duration Filter (15, 30, 45, 60 minutes)
    if (currentFilters.duration !== 'All' && exercise.durations) {
      const targetMin = parseInt(currentFilters.duration, 10);
      if (!exercise.durations.includes(targetMin)) {
        return false;
      }
    }

    // 7. Search Query Filter
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery;
      const matchName = exercise.name.toLowerCase().includes(q);
      const matchCategory = exercise.category.toLowerCase().includes(q);
      const matchBodyPart = exercise.targetBodyPart.toLowerCase().includes(q);
      const matchMuscles = exercise.musclesTargeted.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchBodyPart && !matchMuscles) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Renders the filtered exercise cards into the DOM
 */
function renderExercises() {
  const gridContainer = document.getElementById('exerciseGridContainer');
  const emptyStateAlert = document.getElementById('catalogueEmptyState');
  const exerciseCountBadge = document.getElementById('exerciseCountBadge');

  if (!gridContainer) return;

  const filtered = getFilteredExercises();

  // Update counter badge
  if (exerciseCountBadge) {
    exerciseCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Exercise' : 'Exercises'}`;
  }

  // Handle empty state
  if (filtered.length === 0) {
    gridContainer.innerHTML = '';
    if (emptyStateAlert) emptyStateAlert.style.display = 'block';
    return;
  }

  if (emptyStateAlert) emptyStateAlert.style.display = 'none';

  gridContainer.innerHTML = '';

  filtered.forEach(exercise => {
    const card = document.createElement('article');
    card.className = 'exercise-card';
    card.id = `exercise-${exercise.id}`;

    // Equipment Badge class
    const equipBadgeClass = exercise.requiredEquipment === 'No Equipment' 
      ? 'badge-equipment no-equip' 
      : 'badge-equipment dumbbells';

    // Difficulty Badge class
    const diffClass = `badge-difficulty ${exercise.difficulty.toLowerCase()}`;

    // SVG Visual illustration (Animated for key exercises, static for others)
    const svgIllustration = typeof getExerciseMovementAnimation === 'function' 
      ? getExerciseMovementAnimation(exercise.id)
      : (typeof getExerciseSvgIllustration === 'function' ? getExerciseSvgIllustration(exercise.iconType) : '⚡');

    card.innerHTML = `
      <div class="exercise-visual" aria-hidden="true">
        ${svgIllustration}
      </div>

      <div class="exercise-body">
        <div class="exercise-meta-tags">
          <span class="badge badge-lime">${exercise.category}</span>
          <span class="${equipBadgeClass}">${exercise.requiredEquipment}</span>
          <span class="${diffClass}">${exercise.difficulty}</span>
        </div>

        <h3 style="font-size: 1.22rem; margin: var(--space-2xs) 0 4px 0; color: var(--text-main); font-family: var(--font-headings); font-weight: 700;">
          ${exercise.name}
        </h3>

        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: var(--space-md); flex-grow: 1;">
          <strong>Target:</strong> ${exercise.musclesTargeted}
        </p>

        <!-- Routine Quick Specs -->
        <div class="exercise-specs">
          <div class="exercise-spec-item">
            <span>Sets</span>
            <strong>${exercise.sets}</strong>
          </div>
          <div class="exercise-spec-item">
            <span>Reps / Time</span>
            <strong>${exercise.reps}</strong>
          </div>
          <div class="exercise-spec-item">
            <span>Rest</span>
            <strong>${exercise.restDuration}</strong>
          </div>
        </div>

        <!-- Action Links -->
        <div class="flex-between" style="gap: var(--space-xs); margin-top: var(--space-xs); flex-wrap: wrap;">
          <a href="exercise-details.html?id=${exercise.id}" class="btn btn-outline btn-sm" style="flex: 1; text-align: center;">
            View Details →
          </a>
          <a href="workout-timer.html?id=${encodeURIComponent(exercise.id)}&exercise=${encodeURIComponent(exercise.name)}&reps=${encodeURIComponent(exercise.reps)}&sets=${encodeURIComponent(exercise.sets)}&rest=${encodeURIComponent(exercise.restDuration)}" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">
            Start ⏱️
          </a>
        </div>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}
