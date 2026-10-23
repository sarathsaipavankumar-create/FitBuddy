/**
 * ============================================================================
 * FitBuddy - Exercise Details Controller (exercise-details.js)
 * Reads exercise slug from URL parameters, looks up specifications in
 * exercise-data.js, and renders the comprehensive visual guide and form cues.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initExerciseDetails();
});

function initExerciseDetails() {
  if (typeof EXERCISES === 'undefined') {
    console.error('EXERCISES dataset is not loaded.');
    return;
  }

  // Parse query parameter: ?id=push-ups
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('id') || 'push-ups';

  // Find matching exercise or fallback to first
  const exercise = EXERCISES.find(ex => ex.id === exerciseId) || EXERCISES[0];

  renderExercisePage(exercise);
  renderRelatedExercises(exercise);
}

/**
 * Populates all DOM elements with the selected exercise details
 * @param {object} ex 
 */
function renderExercisePage(ex) {
  // Update document title
  document.title = `${ex.name} — FitBuddy Exercise Guide`;

  // Breadcrumbs
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const breadcrumbName = document.getElementById('breadcrumbName');
  if (breadcrumbCategory) breadcrumbCategory.textContent = ex.category;
  if (breadcrumbName) breadcrumbName.textContent = ex.name;

  // Title and category badge
  const titleEl = document.getElementById('exerciseTitle');
  const categoryBadge = document.getElementById('exerciseCategoryBadge');
  const equipBadge = document.getElementById('exerciseEquipBadge');
  const diffBadge = document.getElementById('exerciseDiffBadge');

  if (titleEl) titleEl.textContent = ex.name;
  if (categoryBadge) categoryBadge.textContent = ex.category;

  if (equipBadge) {
    equipBadge.textContent = ex.requiredEquipment;
    equipBadge.className = ex.requiredEquipment === 'No Equipment' 
      ? 'badge-equipment no-equip' 
      : 'badge-equipment dumbbells';
  }

  if (diffBadge) {
    diffBadge.textContent = ex.difficulty;
    diffBadge.className = `badge-difficulty ${ex.difficulty.toLowerCase()}`;
  }

  // Visual SVG Diagram with Movement Animation for key exercises
  const visualContainer = document.getElementById('exerciseSvgContainer');
  if (visualContainer && typeof getExerciseMovementAnimation === 'function') {
    visualContainer.innerHTML = getExerciseMovementAnimation(ex.id);
  } else if (visualContainer && typeof getExerciseSvgIllustration === 'function') {
    visualContainer.innerHTML = getExerciseSvgIllustration(ex.iconType);
  }

  // Quick Specs
  const specSets = document.getElementById('specSets');
  const specReps = document.getElementById('specReps');
  const specRest = document.getElementById('specRest');
  const specBodyPart = document.getElementById('specBodyPart');
  const specEquip = document.getElementById('specEquip');
  const specDiff = document.getElementById('specDiff');

  if (specSets) specSets.textContent = ex.sets;
  if (specReps) specReps.textContent = ex.reps;
  if (specRest) specRest.textContent = ex.restDuration;
  if (specBodyPart) specBodyPart.textContent = ex.targetBodyPart;
  if (specEquip) specEquip.textContent = ex.requiredEquipment;
  if (specDiff) specDiff.textContent = ex.difficulty;

  // Targeted Muscles
  const musclesEl = document.getElementById('exerciseMuscles');
  if (musclesEl) musclesEl.textContent = ex.musclesTargeted;

  // Step-by-Step Instructions
  const instructionList = document.getElementById('instructionList');
  if (instructionList && ex.instructions) {
    instructionList.innerHTML = '';
    ex.instructions.forEach((step, index) => {
      const stepItem = document.createElement('div');
      stepItem.className = 'instruction-step-item';
      stepItem.innerHTML = `
        <div class="step-num-badge">${index + 1}</div>
        <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main); padding-top: 2px;">
          ${step}
        </div>
      `;
      instructionList.appendChild(stepItem);
    });
  }

  // Form & Safety Tips
  const formTipsList = document.getElementById('formTipsList');
  if (formTipsList && ex.formTips) {
    formTipsList.innerHTML = '';
    ex.formTips.forEach(tip => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span style="color: #15803D; font-weight: 800; font-size: 1.1rem; line-height: 1;">✓</span>
        <span>${tip}</span>
      `;
      formTipsList.appendChild(li);
    });
  }

  // Beginner Variation
  const beginnerVarText = document.getElementById('beginnerVariationText');
  if (beginnerVarText) {
    beginnerVarText.textContent = ex.beginnerVariation || 'Perform with lighter resistance or reduced range of motion.';
  }

  // START EXERCISE Timer Button
  const startTimerBtn = document.getElementById('startExerciseTimerBtn');
  if (startTimerBtn) {
    const timerUrl = `workout-timer.html?id=${encodeURIComponent(ex.id)}&exercise=${encodeURIComponent(ex.name)}&reps=${encodeURIComponent(ex.reps)}&sets=${encodeURIComponent(ex.sets)}&rest=${encodeURIComponent(ex.restDuration)}`;
    startTimerBtn.href = timerUrl;
  }
}

/**
 * Renders 2-3 related exercises from the same category or target area
 * @param {object} currentEx 
 */
function renderRelatedExercises(currentEx) {
  const container = document.getElementById('relatedExercisesContainer');
  if (!container || typeof EXERCISES === 'undefined') return;

  // Find exercises in the same category or body part, excluding the current one
  const related = EXERCISES
    .filter(ex => ex.id !== currentEx.id && (ex.category === currentEx.category || ex.targetBodyPart === currentEx.targetBodyPart))
    .slice(0, 3);

  if (related.length === 0) {
    // Fallback: pick any other 3 exercises
    const others = EXERCISES.filter(ex => ex.id !== currentEx.id).slice(0, 3);
    related.push(...others);
  }

  container.innerHTML = '';

  related.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';

    const equipBadgeClass = ex.requiredEquipment === 'No Equipment' 
      ? 'badge-equipment no-equip' 
      : 'badge-equipment dumbbells';

    card.innerHTML = `
      <div class="flex-between" style="margin-bottom: var(--space-xs);">
        <span class="badge badge-lime" style="font-size: 0.72rem;">${ex.category}</span>
        <span class="${equipBadgeClass}">${ex.requiredEquipment}</span>
      </div>
      <h4 style="font-size: 1.1rem; margin: 4px 0 var(--space-2xs) 0; color: var(--text-main);">
        ${ex.name}
      </h4>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--space-md); flex-grow: 1;">
        ${ex.sets} • ${ex.reps}
      </p>
      <a href="exercise-details.html?id=${ex.id}" class="btn btn-outline btn-sm btn-full" style="text-align: center;">
        View Exercise →
      </a>
    `;

    container.appendChild(card);
  });
}
