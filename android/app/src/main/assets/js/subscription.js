/**
 * ============================================================================
 * FitBuddy - Subscription Plans Controller (subscription.js)
 * Clean, transparent membership tier management:
 * 1. Tracks active plan tier in demo session storage.
 * 2. Provides interactive plan selection with clear demo-state labels.
 * 3. Highlights current active plan and feature comparisons.
 * ============================================================================
 */

const PLAN_STORAGE_KEY = 'fitbuddy_membership_plan';

document.addEventListener('DOMContentLoaded', () => {
  initSubscriptionPage();
  bindSubscriptionButtons();
});

/**
 * Initializes active plan from sessionStorage
 */
function initSubscriptionPage() {
  let activePlan = 'Free Starter';
  try {
    const saved = sessionStorage.getItem(PLAN_STORAGE_KEY);
    if (saved) activePlan = saved;
  } catch (err) {
    console.warn('Could not read membership plan:', err);
  }

  updateActivePlanUI(activePlan);
}

/**
 * Binds click listeners to plan selection buttons
 */
function bindSubscriptionButtons() {
  const planButtons = document.querySelectorAll('.sub-select-btn');
  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      if (!planName) return;

      try {
        sessionStorage.setItem(PLAN_STORAGE_KEY, planName);
      } catch (err) {
        console.warn('Could not save membership plan:', err);
      }

      updateActivePlanUI(planName);

      if (typeof showToast === 'function') {
        showToast(`Selected "${planName}" in demo mode! (Frontend Prototype: No charges processed).`, 'success', 4000);
      }
    });
  });
}

/**
 * Updates button labels and active card styling based on active plan
 * @param {string} activePlan 
 */
function updateActivePlanUI(activePlan) {
  const planCards = document.querySelectorAll('.sub-plan-card');
  planCards.forEach(card => {
    const planName = card.getAttribute('data-plan-name');
    const isCurrent = planName === activePlan;
    const btn = card.querySelector('.sub-select-btn');

    if (btn) {
      if (isCurrent) {
        btn.textContent = '✓ Your Active Plan';
        btn.className = 'btn btn-primary btn-full sub-select-btn';
        btn.disabled = true;
      } else {
        btn.textContent = `Switch to ${planName}`;
        btn.className = 'btn btn-outline btn-full sub-select-btn';
        btn.disabled = false;
      }
    }

    const currentBadge = card.querySelector('.active-plan-indicator');
    if (currentBadge) {
      currentBadge.style.display = isCurrent ? 'inline-flex' : 'none';
    }
  });

  const headerNotice = document.getElementById('currentMembershipStatus');
  if (headerNotice) {
    headerNotice.textContent = `Current Plan: ${activePlan}`;
  }
}

// Global exposure
window.updateActivePlanUI = updateActivePlanUI;
