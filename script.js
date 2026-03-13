const revealElements = document.querySelectorAll(".reveal");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const betaForm = document.querySelector("#beta-form");
const formMessage = document.querySelector("#form-message");

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

betaForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(betaForm);
  const name = formData.get("name");
  const role = formData.get("role");
  const interest = formData.get("interest");

  const roleLabelMap = {
    student: "학생",
    teacher: "교사",
    parent: "학부모"
  };

  const interestLabelMap = {
    video: "짧은 영상 학습",
    quiz: "영상 기반 퀴즈",
    simulation: "모의투자 체험"
  };

  formMessage.textContent =
    `${name}님, 베타 신청이 접수되었습니다. ` +
    `${roleLabelMap[role]} 유형으로 등록되었고 ` +
    `가장 기대하는 기능은 ${interestLabelMap[interest]}입니다.`;

  betaForm.reset();
});
