document.addEventListener("DOMContentLoaded", () => {
  const siteTitle = document.getElementById("siteTitle");
  const form = document.getElementById("messageForm");
  const toInput = document.getElementById("toInput");
  const textarea = document.getElementById("messageInput");
  const scene = document.getElementById("scene");
  const finalTitle = document.getElementById("finalTitle");
  const nameBackdrop = document.getElementById("nameBackdrop");
  const envelope = document.getElementById("envelope");

  let hasFadedTitle = false;
  let isAnimating = false;

  function updateTitleFade() {
    const totalChars = (toInput.value || "").length + (textarea.value || "").length;
    if (!hasFadedTitle && totalChars >= 10) {
      siteTitle.classList.add("faded");
      hasFadedTitle = true;
    }
  }

  // Auto-resize textarea like simple chat input
  function autoResize() {
    textarea.style.height = "auto";
    const maxHeight = window.innerHeight * 0.55;
    const newHeight = Math.min(maxHeight, textarea.scrollHeight);
    textarea.style.height = newHeight + "px";
  }

  textarea.addEventListener("input", () => {
    autoResize();
    updateTitleFade();
    if (finalTitle.classList.contains("visible")) {
      finalTitle.classList.remove("visible");
    }
  });

  toInput.addEventListener("input", () => {
    updateTitleFade();
    if (finalTitle.classList.contains("visible")) {
      finalTitle.classList.remove("visible");
    }
  });

  // Enter in "Who is this going to?" moves focus to message field and shows name backdrop
  toInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const name = toInput.value.trim();
      if (name) {
        nameBackdrop.textContent = name;
        nameBackdrop.classList.add("visible");
      } else {
        nameBackdrop.textContent = "";
        nameBackdrop.classList.remove("visible");
      }
      textarea.focus();
      autoResize();
    }
  });

  window.addEventListener("resize", autoResize);
  autoResize();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isAnimating) return;

    const name = toInput.value.trim();
    const text = textarea.value.trim();
    if (!name && !text) return;

    isAnimating = true;

    // Lock in the name backdrop even if user didn't press Enter
    if (name && !nameBackdrop.textContent) {
      nameBackdrop.textContent = name;
      nameBackdrop.classList.add("visible");
    }

    // Hide form fields
    form.classList.add("hidden");

    // Trigger darkening + parallax animation
    scene.classList.add("animating");
    scene.classList.add("to-night");

    // Launch envelope
    envelope.classList.remove("animate"); // reset if needed
    void envelope.offsetWidth; // force reflow
    envelope.classList.add("animate");

    // Clear the inputs for next round
    toInput.value = "";
    textarea.value = "";
    hasFadedTitle = false;

    // After main animation (~7s), show final title and restore form
    setTimeout(() => {
      finalTitle.classList.add("visible");
      scene.classList.remove("animating");
      form.classList.remove("hidden");
      envelope.classList.remove("animate");
      isAnimating = false;
    }, 7200);
  });
});
