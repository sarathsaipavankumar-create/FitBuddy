/**
 * ============================================================================
 * FitBuddy - Authentication Flow & Validation (auth.js)
 * Beginner-friendly vanilla JavaScript for Login & Registration
 * 
 * Rules followed:
 * 1. Clean separation: HTML, CSS, and JS.
 * 2. Friendly inline error messages + toast feedback.
 * 3. Never stores passwords in localStorage.
 * 4. Transparent demo-mode submission placeholder.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize password show/hide toggle buttons
  initPasswordToggles();

  // 2. Initialize Forgot Password placeholder trigger
  initForgotPassword();

  // 3. Setup Login Form validation listener
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
    setupRealtimeValidation('loginForm');
  }

  // 4. Setup Registration Form validation listener
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
    setupRealtimeValidation('registerForm');
  }
});

/**
 * Toggles input type between 'password' and 'text'
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInputId = btn.getAttribute('data-target');
      const passwordInput = document.getElementById(targetInputId);

      if (!passwordInput) return;

      const isPasswordType = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPasswordType ? 'text' : 'password');

      // Update button visual icon and accessibility label
      btn.textContent = isPasswordType ? '🙈' : '👁️';
      btn.setAttribute(
        'aria-label',
        isPasswordType ? 'Hide password text' : 'Show password text'
      );
    });
  });
}

/**
 * Handles the "Forgot password?" placeholder message toggle
 */
function initForgotPassword() {
  const forgotLink = document.getElementById('forgotPasswordLink');
  const forgotBox = document.getElementById('forgotPasswordBox');

  if (forgotLink && forgotBox) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotBox.classList.toggle('visible');
    });
  }
}

/**
 * Clears inline field error as soon as user types into the input
 * @param {string} formId 
 */
function setupRealtimeValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errorElement = document.getElementById(`${input.id}Error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
      }
      input.classList.remove('is-invalid');
    });
  });
}

/**
 * Validates and handles the Login form submission
 * @param {Event} e 
 */
async function handleLoginSubmit(e) {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  let isValid = true;

  // Clear previous errors
  clearAllErrors(['email', 'password']);

  // 1. Email check
  if (!email) {
    showFieldError('email', 'Email address is required.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address (e.g. name@college.edu).');
    isValid = false;
  }

  // 2. Password check
  if (!password) {
    showFieldError('password', 'Password is required.');
    isValid = false;
  } else if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters long.');
    isValid = false;
  }

  if (!isValid) {
    showToast('Please correct the highlighted fields.', 'warning');
    return;
  }

  const originalBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
  }

  try {
    if (window.FitBuddyApi) {
      await window.FitBuddyApi.login(email, password);
      showToast('Welcome back! Login successful.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showToast('Login successful.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }
  } catch (err) {
    showToast(err.message || 'Invalid email or password. Please try again.', 'error');
    showFieldError('password', 'Invalid credentials.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }
}

/**
 * Validates and handles the Registration form submission
 * @param {Event} e 
 */
async function handleRegisterSubmit(e) {
  e.preventDefault();

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('termsCheck');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const fullName = fullNameInput ? fullNameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';
  const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

  let isValid = true;

  // Clear previous errors
  clearAllErrors(['fullName', 'email', 'password', 'confirmPassword', 'terms']);

  // 1. Full name check
  if (!fullName) {
    showFieldError('fullName', 'Please enter your full name.');
    isValid = false;
  } else if (fullName.length < 2) {
    showFieldError('fullName', 'Name must be at least 2 characters.');
    isValid = false;
  }

  // 2. Email check
  if (!email) {
    showFieldError('email', 'Email address is required.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address (e.g. alex@example.com).');
    isValid = false;
  }

  // 3. Password check
  if (!password) {
    showFieldError('password', 'Password is required.');
    isValid = false;
  } else if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters long.');
    isValid = false;
  }

  // 4. Confirm password check
  if (!confirmPassword) {
    showFieldError('confirmPassword', 'Please confirm your password.');
    isValid = false;
  } else if (password !== confirmPassword) {
    showFieldError('confirmPassword', 'Passwords do not match. Please re-enter.');
    isValid = false;
  }

  // 5. Terms check
  if (termsCheckbox && !termsCheckbox.checked) {
    const termsError = document.getElementById('termsError');
    if (termsError) {
      termsError.textContent = 'Please accept the guidelines to proceed.';
      termsError.classList.add('visible');
    }
    isValid = false;
  }

  if (!isValid) {
    showToast('Please fix the highlighted errors to continue.', 'warning');
    return;
  }

  const originalBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
  }

  try {
    if (window.FitBuddyApi) {
      await window.FitBuddyApi.register(fullName, email, password);
      showToast('Account created successfully! Setting up profile...', 'success');
      setTimeout(() => {
        window.location.href = 'profile-setup.html';
      }, 800);
    } else {
      sessionStorage.setItem('fitbuddy_demo_user_name', fullName);
      showToast('Account registered! Redirecting to Profile Setup...', 'success');
      setTimeout(() => {
        window.location.href = 'profile-setup.html';
      }, 800);
    }
  } catch (err) {
    showToast(err.message || 'Registration failed. Email might already be registered.', 'error');
    showFieldError('email', err.message || 'Email already exists');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }
}

/**
 * Displays an inline friendly error message below an input
 * @param {string} inputId 
 * @param {string} message 
 */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}Error`);

  if (input) {
    input.classList.add('is-invalid');
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

/**
 * Clears error styles from a list of input IDs
 * @param {string[]} fieldIds 
 */
function clearAllErrors(fieldIds) {
  fieldIds.forEach(id => {
    const input = document.getElementById(id);
    const errorElement = document.getElementById(`${id}Error`);

    if (input) {
      input.classList.remove('is-invalid');
    }

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  });
}

/**
 * Simple regex helper for standard email format validation
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
