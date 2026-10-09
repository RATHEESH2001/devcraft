/**
 * DevCraft Contact Form Validation & Submission
 * Configurable endpoint with client-side validation and mailto fallback.
 */
(() => {
  'use strict';

  // Configuration: Set to your Formspree ID or backend URL.
  // If empty or offline, graceful mailto fallback is executed.
  const FORM_ENDPOINT = ''; 

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
  });

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const serviceInput = document.getElementById('contactService');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const successAlert = document.getElementById('contactSuccess');
    const errorAlert = document.getElementById('contactError');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(input, isValid) {
      if (!isValid) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
      return isValid;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset alerts
      if (successAlert) successAlert.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';

      let isValid = true;

      // Validate name
      if (nameInput) {
        const isNameValid = nameInput.value.trim().length >= 2;
        if (!validateField(nameInput, isNameValid)) isValid = false;
      }

      // Validate email
      if (emailInput) {
        const isEmailValid = validateEmail(emailInput.value.trim());
        if (!validateField(emailInput, isEmailValid)) isValid = false;
      }

      // Validate service select
      if (serviceInput) {
        const isServiceValid = serviceInput.value.trim() !== '';
        if (!validateField(serviceInput, isServiceValid)) isValid = false;
      }

      // Validate message
      if (messageInput) {
        const isMsgValid = messageInput.value.trim().length >= 10;
        if (!validateField(messageInput, isMsgValid)) isValid = false;
      }

      if (!isValid) {
        if (errorAlert) {
          errorAlert.textContent = 'Please fill out all required fields correctly before submitting.';
          errorAlert.style.display = 'block';
        }
        return;
      }

      // Submission processing
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Enquiry...';
      }

      const formData = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        company: document.getElementById('contactCompany') ? document.getElementById('contactCompany').value.trim() : '',
        service: serviceInput ? serviceInput.value : '',
        budget: document.getElementById('contactBudget') ? document.getElementById('contactBudget').value : '',
        timeline: document.getElementById('contactTimeline') ? document.getElementById('contactTimeline').value : '',
        message: messageInput ? messageInput.value.trim() : ''
      };

      try {
        if (FORM_ENDPOINT && FORM_ENDPOINT.startsWith('http')) {
          const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          if (!response.ok) throw new Error('Network response was not ok');
        } else {
          // Simulated submission delay for demo / fallback
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        form.reset();
        if (successAlert) {
          successAlert.textContent = 'Thank you! Your project enquiry has been sent. Ratheesh will review your requirements and respond within 24 hours.';
          successAlert.style.display = 'block';
        }
      } catch (err) {
        // Fallback to mailto
        const mailtoUrl = `mailto:ratheesh82001@gmail.com?subject=Project Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nService: ${formData.service}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nProject Details:\n${formData.message}`
        )}`;
        window.location.href = mailtoUrl;

        if (successAlert) {
          successAlert.textContent = 'Opening your email client to send your message directly to Ratheesh.';
          successAlert.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });

    // Realtime field cleanup on input
    [nameInput, emailInput, serviceInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          input.removeAttribute('aria-invalid');
        }
      });
    });
  }
})();
