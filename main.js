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

      statusEl.textContent = "Opening email app…";
      if (submitBtn) submitBtn.disabled = true;

      try {
        var subject = encodeURIComponent(CONTACT_SUBJECT);
        var body = encodeURIComponent(
          "Name: " + name + "\nEmail: " + email + "\n\n" + message
        );
        window.location.href =
          "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
        statusEl.textContent =
          "Send the message to " + CONTACT_EMAIL + " from your email app.";
        form.reset();
      } catch (err) {
        statusEl.textContent =
          "Could not open email app. Please email " + CONTACT_EMAIL + " directly.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        setTimeout(function () {
          statusEl.textContent = "";
        }, 10000);
      }
    });
  }
})();
