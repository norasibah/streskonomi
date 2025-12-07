document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const calculateButton = document.getElementById("calculate-button");
  const resetButton = document.getElementById("reset-button");
  const resultsSection = document.getElementById("results");
  const alertModal = document.getElementById("alert-modal");
  const modalClose = document.getElementById("modal-close");
  const progressLabel = document.getElementById("progress-label");
  const progressFill = document.getElementById("progress-fill");

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

  const factorQuestionCounts = {
    kewangan: 5,
    pendapatan: 5,
    simpanan: 4,
    hutang: 4,
    tekanan_sosial: 4,
    reaksi_emosi: 5,
  };

  showFactor(0);

  nextButton.addEventListener("click", function () {
    const currentFactor = factorOrder[currentFactorIndex];
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

  prevButton.addEventListener("click", function () {
    if (currentFactorIndex > 0) {
      currentFactorIndex--;
      showFactor(currentFactorIndex);
    } else {
      window.location.href = "index.html";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  calculateButton.addEventListener("click", function () {
    const currentFactor = factorOrder[currentFactorIndex];
    if (!validateFactor(currentFactor)) {
      showModal(
        "Sila jawab semua soalan dalam bahagian ini sebelum meneruskan."
      );
      return;
    }
    calculateAndShowResults();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  resetButton.addEventListener("click", function () {
    restartAssessment();
  });

  modalClose.addEventListener("click", function () {
    alertModal.classList.add("hidden");
  });

  function showFactor(index) {
    const factorName = factorOrder[index];
    factorCards.forEach((card) => {
      card.classList.add("hidden");
    });
    const currentCard = document.querySelector(`[data-factor="${factorName}"]`);
    if (currentCard) currentCard.classList.remove("hidden");

    prevButton.style.display = "inline-flex";
    if (index === factorOrder.length - 1) {
      nextButton.style.display = "none";
      calculateButton.style.display = "inline-flex";
    } else {
      nextButton.style.display = "inline-flex";
      calculateButton.style.display = "none";
    }

    resultsSection.classList.add("hidden");
    updateProgress(index + 1, factorOrder.length);
  }

  function validateFactor(factorName) {
    const questionCount = factorQuestionCounts[factorName];
    for (let i = 1; i <= questionCount; i++) {
      const radios = document.querySelectorAll(
        `input[name="${factorName}-q${i}"]`
      );
      const answered = Array.from(radios).some((r) => r.checked);
      if (!answered) return false;
    }
    return true;
  }

  function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    progressFill.style.width = percentage + "%";
    progressLabel.textContent = `Bahagian ${current} daripada ${total}`;
  }

  function showModal(message) {
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    alertModal.classList.remove("hidden");
  }

  function calculateAndShowResults() {
    const results = {};
    let totalScore = 0;
    let totalQuestions = 0;

    factorOrder.forEach((factorName) => {
      const questionCount = factorQuestionCounts[factorName];
      let factorScore = 0;
      for (let i = 1; i <= questionCount; i++) {
        const radios = document.querySelectorAll(
          `input[name="${factorName}-q${i}"]`
        );
        radios.forEach((radio) => {
          if (radio.checked) factorScore += parseInt(radio.value, 10);
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

    const overallAverage = totalScore / totalQuestions;
    const overallLevel = getStressLevel(overallAverage);
    displayResults(results, overallAverage, overallLevel);
  }

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

  function displayResults(results, overallAverage, overallLevel) {
    factorCards.forEach((card) => card.classList.add("hidden"));
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    calculateButton.style.display = "none";

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

    document.getElementById("overall-score").textContent =
      overallAverage.toFixed(2);
    document.getElementById("overall-score").style.backgroundColor =
      overallLevel.color;
    document.getElementById(
      "overall-level"
    ).textContent = `Tahap Stres Ekonomi: ${overallLevel.level}`;

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
    document.getElementById("overall-recommendation").textContent =
      recommendations[overallLevel.level];

    resultsSection.classList.remove("hidden");
    updateProgress(factorOrder.length, factorOrder.length);
  }

  function restartAssessment() {
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach((radio) => {
      radio.checked = false;
    });

    document.querySelectorAll(".result-card").forEach((card) => {
      card.querySelector(".factor-mean").textContent = "--";
      card.querySelector(".factor-level").textContent = "--";
      card.style.borderLeftColor = "";
    });

    document.getElementById("overall-score").textContent = "--";
    document.getElementById("overall-score").style.backgroundColor = "";
    document.getElementById("overall-level").textContent = "Skor belum dikira.";
    document.getElementById("overall-recommendation").textContent =
      "Lengkapkan soal selidik untuk melihat cadangan.";

    resultsSection.classList.add("hidden");
    window.location.href = "index.html";
  }
});
