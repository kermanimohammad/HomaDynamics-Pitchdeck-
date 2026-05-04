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

  var CONTACT_EMAIL = "kermani_mohammad@hotmail.com";
  var CONTACT_FORM_ACTION = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  if (form && statusEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      statusEl.textContent = "Sending…";
      if (submitBtn) submitBtn.disabled = true;

      var fd = new FormData(form);
      fd.set("_subject", "HomaDynamics — Website contact");
      fd.set("_replyto", form.querySelector("#email").value);
      fd.set("_captcha", "false");

      fetch(CONTACT_FORM_ACTION, {
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
          if (result.ok) {
            statusEl.textContent = "Thanks — we'll get back to you within 48 hours.";
            form.reset();
          } else {
            var msg =
              (result.data && (result.data.message || result.data.error)) ||
              "Could not send. Please try again or email " + CONTACT_EMAIL + " directly.";
            statusEl.textContent = msg;
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
