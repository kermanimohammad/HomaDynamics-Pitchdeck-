(function () {
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  var mobile = document.querySelector(".nav-mobile");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (menuBtn && mobile) {
    menuBtn.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  var CONTACT_EMAIL = "info@homadynamics.com";
  var CONTACT_SUBJECT = "HomaDynamics.com — Contact form submission";

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  if (form && statusEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      statusEl.textContent = "";

      var nameEl = form.querySelector("#name");
      var emailEl = form.querySelector("#email");
      var messageEl = form.querySelector("#message");

      var name = nameEl && nameEl.value ? nameEl.value.trim() : "";
      var email = emailEl && emailEl.value ? emailEl.value.trim() : "";
      var message = messageEl && messageEl.value ? messageEl.value.trim() : "";

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (!name) {
        statusEl.textContent = "Please enter your name.";
        if (nameEl) nameEl.focus();
        return;
      }

      if (!email || !emailOk) {
        statusEl.textContent = "Please enter a valid email address.";
        if (emailEl) emailEl.focus();
        return;
      }

      if (!message || message.length < 2) {
        statusEl.textContent = "Message must be at least 2 characters.";
        if (messageEl) messageEl.focus();
        return;
      }

      statusEl.textContent = "Sending…";
      if (submitBtn) submitBtn.disabled = true;

      var fd = new FormData();
      fd.set("name", name);
      fd.set("email", email);
      fd.set("message", message);
      fd.set("_subject", CONTACT_SUBJECT);
      fd.set("_replyto", email);
      fd.set("_cc", CONTACT_EMAIL);
      fd.set("_captcha", "false");

      fetch("https://formsubmit.co/ajax/kermani_mohammad@hotmail.com", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          var data = result.data || {};
          var sent =
            result.ok && (data.success === true || data.success === "true");
          if (sent) {
            statusEl.textContent = "Thanks — we'll get back to you within 48 hours.";
            form.reset();
          } else {
            statusEl.textContent =
              data.message ||
              data.error ||
              "Could not send. Please email " + CONTACT_EMAIL + " directly.";
          }
        })
        .catch(function () {
          statusEl.textContent =
            "Network error. Please try again or email " + CONTACT_EMAIL + " directly.";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          setTimeout(function () {
            statusEl.textContent = "";
          }, 10000);
        });
    });
  }
})();
