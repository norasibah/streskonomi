// Streskonomi Assessment v3
// Client-side only version - no Google Sheets connection

document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const calculateButton = document.getElementById("calculate-button");
  const resetButton = document.getElementById("reset-button");
  const resultsSection = document.getElementById("results");
  const alertModal = document.getElementById("alert-modal");
  const modalClose = document.getElementById("modal-close");
  const progressLabel = document.getElementById("progress-label");
  const progressFill = document.getElementById("progress-fill");

  // Factor cards
  const factorCards = document.querySelectorAll(".factor-card");
  const factorOrder = [
    "kewangan",
    "pendapatan",
    "simpanan",
    "hutang",
    "tekanan_sosial",
    "reaksi_emosi",
  ];
  let currentFactorIndex = 0;

  // Factor question counts
  const factorQuestionCounts = {
    kewangan: 5,
    pendapatan: 5,
    simpanan: 4,
    hutang: 4,
    tekanan_sosial: 4,
    reaksi_emosi: 5,
  };

  // Initialize: show first factor
  showFactor(0);

  // Next button click
  nextButton.addEventListener("click", function () {
    const currentFactor = factorOrder[currentFactorIndex];

    // Validate current factor
    if (!validateFactor(currentFactor)) {
      showModal(
        "Sila jawab semua soalan dalam bahagian ini sebelum meneruskan."
      );
      return;
    }

    if (currentFactorIndex < factorOrder.length - 1) {
      currentFactorIndex++;
      showFactor(currentFactorIndex);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Previous button click
  prevButton.addEventListener("click", function () {
    if (currentFactorIndex > 0) {
      currentFactorIndex--;
      showFactor(currentFactorIndex);
    } else {
      // Go back to intro page
      window.location.href = "index.html";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Calculate button click
  calculateButton.addEventListener("click", function () {
    const currentFactor = factorOrder[currentFactorIndex];

    // Validate last factor
    if (!validateFactor(currentFactor)) {
      showModal(
        "Sila jawab semua soalan dalam bahagian ini sebelum meneruskan."
      );
      return;
    }

    calculateAndShowResults();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Reset button click
  resetButton.addEventListener("click", function () {
    restartAssessment();
  });

  // Modal close button
  modalClose.addEventListener("click", function () {
    alertModal.classList.add("hidden");
  });

  // Show specific factor
  function showFactor(index) {
    const factorName = factorOrder[index];

    // Hide all factor cards
    factorCards.forEach((card) => {
      card.classList.add("hidden");
    });

    // Show current factor card
    const currentCard = document.querySelector(`[data-factor="${factorName}"]`);
    if (currentCard) {
      currentCard.classList.remove("hidden");
    }

    // Update navigation buttons
    prevButton.style.display = "inline-flex";

    if (index === factorOrder.length - 1) {
      // Last factor - show calculate button
      nextButton.style.display = "none";
      calculateButton.style.display = "inline-flex";
    } else {
      nextButton.style.display = "inline-flex";
      calculateButton.style.display = "none";
    }

    // Hide results
    resultsSection.classList.add("hidden");

    // Update progress
    updateProgress(index + 1, factorOrder.length);
  }

  // Validate factor questions
  function validateFactor(factorName) {
    const questionCount = factorQuestionCounts[factorName];
    let allAnswered = true;

    for (let i = 1; i <= questionCount; i++) {
      const radios = document.querySelectorAll(
        `input[name="${factorName}-q${i}"]`
      );
      const isAnswered = Array.from(radios).some((r) => r.checked);
      if (!isAnswered) {
        allAnswered = false;
      }
    }

    return allAnswered;
  }

  // Update progress bar
  function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    progressFill.style.width = percentage + "%";
    progressLabel.textContent = `Bahagian ${current} daripada ${total}`;
  }

  // Show modal
  function showModal(message) {
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    alertModal.classList.remove("hidden");
  }

  // Calculate and show results
  function calculateAndShowResults() {
    const results = {};
    let totalScore = 0;
    let totalQuestions = 0;

    // Calculate score for each factor
    factorOrder.forEach((factorName) => {
      const questionCount = factorQuestionCounts[factorName];
      let factorScore = 0;

      for (let i = 1; i <= questionCount; i++) {
        const radios = document.querySelectorAll(
          `input[name="${factorName}-q${i}"]`
        );
        radios.forEach((radio) => {
          if (radio.checked) {
            factorScore += parseInt(radio.value);
          }
        });
      }

      const avgScore = factorScore / questionCount;
      results[factorName] = {
        total: factorScore,
        average: avgScore,
        level: getStressLevel(avgScore),
      };

      totalScore += factorScore;
      totalQuestions += questionCount;
    });

    // Calculate overall average
    const overallAverage = totalScore / totalQuestions;
    const overallLevel = getStressLevel(overallAverage);

    // Display results
    displayResults(results, overallAverage, overallLevel);
  }

  // Get stress level based on average score
  function getStressLevel(avg) {
    if (avg <= 1.5)
      return {
        level: "Sangat Rendah",
        class: "level-very-low",
        color: "#10b981",
      };
    if (avg <= 2.5)
      return { level: "Rendah", class: "level-low", color: "#22c55e" };
    if (avg <= 3.5)
      return { level: "Sederhana", class: "level-medium", color: "#eab308" };
    if (avg <= 4.5)
      return { level: "Tinggi", class: "level-high", color: "#f97316" };
    return {
      level: "Sangat Tinggi",
      class: "level-very-high",
      color: "#ef4444",
    };
  }

  // Display results
  function displayResults(results, overallAverage, overallLevel) {
    // Hide all factor cards
    factorCards.forEach((card) => {
      card.classList.add("hidden");
    });

    // Hide navigation buttons
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    calculateButton.style.display = "none";

    // Update each result card
    for (const [factorName, data] of Object.entries(results)) {
      const resultCard = document.querySelector(
        `[data-result="${factorName}"]`
      );
      if (resultCard) {
        resultCard.querySelector(".factor-mean").textContent =
          data.average.toFixed(2);
        resultCard.querySelector(".factor-level").textContent =
          data.level.level;
        resultCard.style.borderLeftColor = data.level.color;
      }
    }

    // Update overall score
    const overallScoreEl = document.getElementById("overall-score");
    const overallLevelEl = document.getElementById("overall-level");
    const overallRecoEl = document.getElementById("overall-recommendation");

    overallScoreEl.textContent = overallAverage.toFixed(2);
    overallScoreEl.style.backgroundColor = overallLevel.color;
    overallLevelEl.textContent = `Tahap Stres Ekonomi: ${overallLevel.level}`;

    // Set overall recommendation
    const recommendations = {
      "Sangat Rendah":
        "Tahniah! Anda menguruskan tekanan ekonomi dengan sangat baik. Teruskan amalan kewangan yang sihat.",
      Rendah:
        "Anda menguruskan kewangan dengan baik. Teruskan usaha dan pertimbangkan untuk meningkatkan simpanan.",
      Sederhana:
        "Anda mungkin mengalami tekanan kewangan yang sederhana. Pertimbangkan untuk menyemak bajet dan mencari cara mengurangkan perbelanjaan.",
      Tinggi:
        "Tahap stres ekonomi anda memerlukan perhatian. Sila dapatkan nasihat kewangan dan pertimbangkan untuk berjumpa kaunselor.",
      "Sangat Tinggi":
        "Tahap stres ekonomi anda kritikal. Sila dapatkan bantuan profesional segera - kaunselor kewangan atau kesihatan mental.",
    };
    overallRecoEl.textContent = recommendations[overallLevel.level];

    // Show results section
    resultsSection.classList.remove("hidden");

    // Update progress to complete
    updateProgress(factorOrder.length, factorOrder.length);
  }

  // Restart assessment
  function restartAssessment() {
    // Redirect to intro page
    window.location.href = "index.html";
  }
});
