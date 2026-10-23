/**
 * ============================================================================
 * FitBuddy - Shared Application Utilities (app.js)
 * Clean, modular, vanilla JavaScript helpers
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update current year dynamically in footers
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear;
  });
});

/**
 * Display a modern, non-blocking toast notification to the user
 * @param {string} message - Notification text to display
 * @param {'info' | 'success' | 'warning' | 'error'} type - Style category
 * @param {number} duration - Milliseconds before auto-dismissal (default 3500ms)
 */
function showToast(message, type = 'info', duration = 3500) {
  // Check if toast container exists, if not create one
  let toastContainer = document.getElementById('fitbuddy-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'fitbuddy-toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '24px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fitbuddy-toast toast-${type}`;
  toast.style.pointerEvents = 'auto';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '12px';
  toast.style.fontFamily = "'Inter', system-ui, sans-serif";
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 10px 30px rgba(23, 37, 31, 0.12)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(10px)';

  // Style according to toast type in light/forest theme
  let icon = '⚡';
  if (type === 'success') {
    icon = '✅';
    toast.style.backgroundColor = '#FFFFFF';
    toast.style.color = '#17251F';
    toast.style.border = '1px solid #B9F36A';
    toast.style.borderLeft = '4px solid #B9F36A';
  } else if (type === 'warning') {
    icon = '⚠️';
    toast.style.backgroundColor = '#FFFFFF';
    toast.style.color = '#17251F';
    toast.style.border = '1px solid #F59E0B';
    toast.style.borderLeft = '4px solid #F59E0B';
  } else if (type === 'error') {
    icon = '❌';
    toast.style.backgroundColor = '#FFFFFF';
    toast.style.color = '#17251F';
    toast.style.border = '1px solid #EF4444';
    toast.style.borderLeft = '4px solid #EF4444';
  } else {
    // Default info
    icon = 'ℹ️';
    toast.style.backgroundColor = '#FFFFFF';
    toast.style.color = '#17251F';
    toast.style.border = '1px solid #E4E8E2';
    toast.style.borderLeft = '4px solid #17251F';
  }

  toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}
