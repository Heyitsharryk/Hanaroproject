const FORM_ENDPOINT = "https://formspree.io/f/xnjgvrjg";

const revealElements = document.querySelectorAll(".reveal");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const ctaTriggers = document.querySelectorAll(".cta-trigger");
const betaForm = document.querySelector("#beta-form");
const formMessage = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");

let lastCtaContext = {
  location: "direct",
  name: "direct_form_access"
};

let formStarted = false;

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

function setFormMessage(message, state = "") {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;
  formMessage.dataset.state = state;
}

function toggleSubmittingState(isSubmitting) {
  if (!submitButton || !betaForm) {
    return;
  }

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "신청 정보를 보내는 중..." : "지금 무료로 베타 신청하기";
  betaForm.classList.toggle("is-submitting", isSubmitting);
}

function updateHiddenFields() {
  if (!betaForm) {
    return;
  }

  const url = new URL(window.location.href);
  const fields = {
    source_page: window.location.pathname || "/",
    source_url: window.location.href,
    referrer: document.referrer || "direct",
    submitted_at: new Date().toISOString(),
    cta_location: lastCtaContext.location,
    cta_name: lastCtaContext.name,
    utm_source: url.searchParams.get("utm_source") || "",
    utm_medium: url.searchParams.get("utm_medium") || "",
    utm_campaign: url.searchParams.get("utm_campaign") || "",
    utm_term: url.searchParams.get("utm_term") || "",
    utm_content: url.searchParams.get("utm_content") || ""
  };

  Object.entries(fields).forEach(([name, value]) => {
    const field = betaForm.querySelector(`[name="${name}"]`);
    if (field) {
      field.value = value;
    }
  });
}

function validateForm() {
  if (!betaForm) {
    return false;
  }

  const nameField = betaForm.querySelector('[name="name"]');
  const emailField = betaForm.querySelector('[name="email"]');
  const roleField = betaForm.querySelector('[name="role"]');
  const interestField = betaForm.querySelector('[name="interest"]');

  if (!nameField.value.trim() || nameField.value.trim().length < 2) {
    setFormMessage("이름은 2자 이상 입력해주세요.", "error");
    nameField.focus();
    return false;
  }

  if (!emailField.validity.valid) {
    setFormMessage("이메일 형식을 확인해주세요.", "error");
    emailField.focus();
    return false;
  }

  if (!roleField.value) {
    setFormMessage("유형을 선택해주세요.", "error");
    roleField.focus();
    return false;
  }

  if (!interestField.value) {
    setFormMessage("가장 기대되는 기능을 선택해주세요.", "error");
    interestField.focus();
    return false;
  }

  return true;
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSelector = button.getAttribute("data-scroll-target");
    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

ctaTriggers.forEach((element) => {
  element.addEventListener("click", () => {
    const ctaLocation = element.dataset.ctaLocation || "unknown";
    const ctaName = element.dataset.ctaName || element.textContent.trim();
    const ctaTarget = element.getAttribute("href") || element.dataset.scrollTarget || "";

    lastCtaContext = {
      location: ctaLocation,
      name: ctaName
    };

    updateHiddenFields();

    trackEvent("cta_click", {
      cta_name: ctaName,
      cta_target: ctaTarget,
      cta_location: ctaLocation
    });
  });
});

betaForm?.addEventListener("focusin", () => {
  if (formStarted) {
    return;
  }

  formStarted = true;
  updateHiddenFields();

  trackEvent("form_start", {
    cta_location: lastCtaContext.location,
    cta_name: lastCtaContext.name
  });
});

betaForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  updateHiddenFields();

  if (!validateForm()) {
    return;
  }

  toggleSubmittingState(true);
  setFormMessage("신청 정보를 전송하고 있습니다...", "loading");

  const formData = new FormData(betaForm);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    const role = formData.get("role");
    const interest = formData.get("interest");

    setFormMessage("신청이 완료되었습니다. 가장 먼저 베타 소식을 알려드릴게요.", "success");

    trackEvent("beta_form_submit", {
      role: role,
      interest: interest,
      cta_location: lastCtaContext.location,
      cta_name: lastCtaContext.name
    });

    trackEvent("generate_lead", {
      currency: "KRW",
      value: 1,
      role: role,
      interest: interest,
      cta_location: lastCtaContext.location
    });

    betaForm.reset();
    formStarted = false;
    lastCtaContext = {
      location: "direct",
      name: "direct_form_access"
    };
    updateHiddenFields();
  } catch (error) {
    setFormMessage("전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.", "error");

    trackEvent("beta_form_submit_error", {
      cta_location: lastCtaContext.location,
      cta_name: lastCtaContext.name
    });
  } finally {
    toggleSubmittingState(false);
  }
});

updateHiddenFields();
