document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("streskonomi-form");
  const calculateButton = document.getElementById("calculate-button");
  const resetButton = document.getElementById("reset-button");
  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const introCard = document.getElementById("intro-card");

  const resultsSection = document.getElementById("results");
  const overallScoreEl = document.getElementById("overall-score");
  const overallLevelEl = document.getElementById("overall-level");
  const overallRecommendationEl = document.getElementById(
    "overall-recommendation"
  );

  const modal = document.getElementById("alert-modal");
  const modalMessage = document.getElementById("modal-message");
  const modalCloseButton = document.getElementById("modal-close");

  // Factor card navigation
  const factorCardsEl = Array.from(
    document.querySelectorAll(".factor-card[data-factor]")
  );
  const factorKeys = [
    "kewangan",
    "pendapatan",
    "simpanan",
    "hutang",
    "tekanan_sosial",
    "reaksi_emosi",
  ];
  let currentStep = 0;
  const totalSteps = factorKeys.length;

  const factorCards = Array.from(
    document.querySelectorAll(".result-card[data-result]")
  ).reduce((acc, card) => {
    const key = card.getAttribute("data-result");
    acc[key] = {
      mean: card.querySelector(".factor-mean"),
      level: card.querySelector(".factor-level"),
      recos: card.querySelector(".factor-recos"),
    };
    return acc;
  }, {});

  const LEVEL_THRESHOLDS = {
    "Sangat Rendah": 1.5,
    Rendah: 2.5,
    Sederhana: 3.5,
    Tinggi: 4.5,
    "Sangat Tinggi": 5,
  };

  const FACTORS = {
    kewangan: {
      label: "Kewangan",
      questions: [
        "kewangan-q1",
        "kewangan-q2",
        "kewangan-q3",
        "kewangan-q4",
        "kewangan-q5",
      ],
    },
    pendapatan: {
      label: "Pendapatan & Pekerjaan",
      questions: [
        "pendapatan-q1",
        "pendapatan-q2",
        "pendapatan-q3",
        "pendapatan-q4",
        "pendapatan-q5",
      ],
    },
    simpanan: {
      label: "Simpanan & Masa Depan",
      questions: ["simpanan-q1", "simpanan-q2", "simpanan-q3", "simpanan-q4"],
    },
    hutang: {
      label: "Hutang & Komitmen",
      questions: ["hutang-q1", "hutang-q2", "hutang-q3", "hutang-q4"],
    },
    tekanan_sosial: {
      label: "Tekanan Sosial",
      questions: [
        "tekanan_sosial-q1",
        "tekanan_sosial-q2",
        "tekanan_sosial-q3",
        "tekanan_sosial-q4",
      ],
    },
    reaksi_emosi: {
      label: "Reaksi Emosi",
      questions: [
        "reaksi_emosi-q1",
        "reaksi_emosi-q2",
        "reaksi_emosi-q3",
        "reaksi_emosi-q4",
        "reaksi_emosi-q5",
      ],
    },
  };

  const FACTOR_RECOMMENDATIONS = {
    kewangan: {
      "Sangat Rendah": [
        "Teruskan rutin bajet anda dan rekodkan aliran tunai mingguan.",
        "Kekalkan dana kecemasan sekurang-kurangnya tiga bulan perbelanjaan.",
      ],
      Rendah: [
        "Semak semula keutamaan perbelanjaan agar masih selari dengan matlamat.",
        "Perkenalkan had perbelanjaan fleksibel pada kategori gaya hidup.",
      ],
      Sederhana: [
        "Wujudkan belanjawan mikro untuk kos berubah seperti makanan dan pengangkutan.",
        "Kenal pasti bil yang boleh dirunding atau dialihkan kepada pakej lebih murah.",
      ],
      Tinggi: [
        "Automatikkan pembayaran bil penting untuk elak penalti dan caj lewat.",
        "Gunakan aplikasi pengesanan perbelanjaan harian bagi melihat kebocoran tunai.",
      ],
      "Sangat Tinggi": [
        "Berunding dengan kaunselor kewangan atau AKPK untuk pelan pemulihan kos hidup.",
        "Pertimbangkan sumber pendapatan sampingan jangka pendek bagi menampung kos asas.",
      ],
    },
    pendapatan: {
      "Sangat Rendah": [
        "Teruskan pembangunan kemahiran profesional yang menyokong gaji semasa.",
        "Kekalkan rangkaian kerjaya aktif melalui komuniti atau mentor.",
      ],
      Rendah: [
        "Kemas kini CV dan profil profesional anda untuk peluang baharu.",
        "Tetapkan sasaran peningkatan pendapatan tahunan dan pantau kemajuan.",
      ],
      Sederhana: [
        "Lakukan semakan pasaran gaji untuk memahami jurang imbuhan semasa.",
        "Rancang sijil mikro/kursus pendek yang meningkatkan kebolehpasaran.",
      ],
      Tinggi: [
        "Sediakan pelan kontinjensi kerjaya termasuk sumber pendapatan alternatif.",
        "Bincang dengan majikan mengenai laluan kenaikan gaji atau fleksibiliti kerja.",
      ],
      "Sangat Tinggi": [
        "Pertimbangkan konsultasi kerjaya profesional bagi menilai semula hala tuju pekerjaan.",
        "Jika perlu, rangka bajet survival berasaskan pendapatan minimum sementara mencari kerja.",
      ],
    },
    simpanan: {
      "Sangat Rendah": [
        "Teruskan komitmen simpanan automatik dan semak pulangan pelaburan.",
        "Pastikan dana pendidikan/persaraan diimbangi antara risiko dan masa.",
      ],
      Rendah: [
        "Tambah peratus simpanan tetap apabila menerima kenaikan pendapatan.",
        "Tetapkan sasaran simpanan tematik seperti pendidikan, kecemasan dan persaraan.",
      ],
      Sederhana: [
        "Gunakan kaedah 50/30/20 atau variasinya untuk memaksa simpanan konsisten.",
        "Nilai semula tabiat perbelanjaan yang menghalang pertumbuhan dana masa depan.",
      ],
      Tinggi: [
        "Mulakan tabung kecemasan mikro (RM1k-RM3k) sebelum simpanan besar.",
        "Pertimbangkan akaun pelaburan patuh syariah kos rendah untuk disiplin simpanan.",
      ],
      "Sangat Tinggi": [
        "Dapatkan nasihat perancang kewangan bertauliah untuk pelan persaraan menyeluruh.",
        "Rangka strategi hutang-kepada-simpanan seperti snowball untuk menambah baki tunai.",
      ],
    },
    hutang: {
      "Sangat Rendah": [
        "Teruskan pembayaran melebihi minima bagi mempercepat penutupan pinjaman.",
        "Audit hutang setiap tiga bulan untuk memastikan nisbah kekal sihat.",
      ],
      Rendah: [
        "Gunakan kaedah avalanche/snowball untuk mempercepat pelunasan hutang kecil.",
        "Semak semula polisi insurans kredit bagi melindungi pinjaman utama.",
      ],
      Sederhana: [
        "Gabungkan hutang faedah tinggi kepada kadar rata jika kosnya lebih rendah.",
        "Elakkan hutang baru sehingga komitmen sedia ada stabil di bawah 40% pendapatan.",
      ],
      Tinggi: [
        "Hubungi pemiutang bagi merundingkan jadual bayaran lebih fleksibel.",
        "Jejaki penggunaan kad kredit secara harian untuk mengekang caj faedah berganda.",
      ],
      "Sangat Tinggi": [
        "Segera hubungi AKPK atau penasihat kewangan untuk pelan pengurusan hutang formal.",
        "Jual aset tidak kritikal bagi menurunkan baki hutang jangka pendek.",
      ],
    },
    tekanan_sosial: {
      "Sangat Rendah": [
        "Kekalkan perspektif sihat terhadap gaya hidup orang lain melalui jurnal syukur.",
        "Teruskan perbualan terbuka dengan keluarga tentang had kewangan.",
      ],
      Rendah: [
        "Tetapkan garis panduan hadiah/derma agar tidak menjejaskan bajet utama.",
        "Kurangkan pendedahan kandungan yang mencetus perbandingan tidak sihat.",
      ],
      Sederhana: [
        "Bincangkan tanggungjawab kewangan keluarga secara terancang bukannya ad-hoc.",
        "Rancang aktiviti sosial kos rendah bagi mengganti acara mahal.",
      ],
      Tinggi: [
        "Bina skrip komunikasi untuk menolak permintaan kewangan tanpa rasa bersalah.",
        "Libatkan ahli keluarga lain supaya tanggungan tidak hanya pada anda.",
      ],
      "Sangat Tinggi": [
        "Pertimbangkan sesi kaunseling keluarga bagi menetapkan semula jangkaan kewangan.",
        "Jika tekanan sosial berpunca daripada media, lakukan detox digital berkala.",
      ],
    },
    reaksi_emosi: {
      "Sangat Rendah": [
        "Teruskan rutin penjagaan diri seperti tidur cukup dan senaman ringan.",
        "Gunakan teknik pernafasan apabila membuat keputusan kewangan penting.",
      ],
      Rendah: [
        "Wujudkan jadual rehat berkala untuk mengelak keletihan membuat bajet.",
        "Catat pencetus emosi berkaitan wang di jurnal untuk kesedaran diri.",
      ],
      Sederhana: [
        "Cuba teknik grounding atau meditasi sebelum mesyuarat kewangan keluarga.",
        "Berbincang dengan rakan dipercayai mengenai kebimbangan ekonomi.",
      ],
      Tinggi: [
        "Dapatkan sokongan profesional sekiranya kemarahan/cemas menjejaskan hubungan.",
        "Agihkan tugasan kewangan (contoh bayar bil) dengan pasangan/ahli keluarga.",
      ],
      "Sangat Tinggi": [
        "Hubungi kaunselor atau talian psikologi segera jika emosi terasa diluar kawalan.",
        "Gabungkan intervensi minda-badan seperti terapi seni atau senaman berstruktur.",
      ],
    },
  };

  const OVERALL_RECOMMENDATIONS = {
    "Sangat Rendah":
      "Risiko stres ekonomi minimum. Kekalkan disiplin semasa dan terus menilai perubahan kos hidup.",
    Rendah:
      "Tanda awal memerlukan perhatian ringan. Perkemas bajet dan pantau faktor yang mencatat skor sederhana.",
    Sederhana:
      "Kelonggaran kewangan semakin ketat. Rangka pelan tindakan 30-60 hari untuk faktor skor tinggi.",
    Tinggi:
      "Risiko jelas terhadap kesejahteraan kewangan. Sediakan pelan pemulihan menyeluruh dan dapatkan sokongan profesional.",
    "Sangat Tinggi":
      "Situasi kritikal. Segera hubungi penasihat kewangan/kaunselor bagi mendapatkan intervensi tersusun.",
  };

  function getLevel(mean) {
    if (mean <= LEVEL_THRESHOLDS["Sangat Rendah"]) return "Sangat Rendah";
    if (mean <= LEVEL_THRESHOLDS["Rendah"]) return "Rendah";
    if (mean <= LEVEL_THRESHOLDS["Sederhana"]) return "Sederhana";
    if (mean <= LEVEL_THRESHOLDS["Tinggi"]) return "Tinggi";
    return "Sangat Tinggi";
  }

  function showModal(message) {
    if (!modal) return alert(message);
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.add("hidden");
  }

  function resetResults() {
    resultsSection.classList.add("hidden");
    overallScoreEl.textContent = "--";
    overallLevelEl.textContent = "Skor belum dikira.";
    overallRecommendationEl.textContent =
      "Lengkapkan soal selidik untuk melihat cadangan.";

    Object.values(factorCards).forEach(({ mean, level, recos }) => {
      mean.textContent = "--";
      level.textContent = "--";
      recos.innerHTML = "";
    });
  }

  function collectResponses() {
    const values = {};

    for (const [key, meta] of Object.entries(FACTORS)) {
      const scores = meta.questions.map((name) => {
        const selected = form.querySelector(`input[name="${name}"]:checked`);
        if (!selected) {
          throw new Error(
            `Sila jawab semua soalan bagi faktor ${meta.label} sebelum meneruskan.`
          );
        }
        return Number(selected.value);
      });
      values[key] = scores;
    }

    return values;
  }

  function updateFactorCard(key, mean, level) {
    const card = factorCards[key];
    if (!card) return;

    card.mean.textContent = mean.toFixed(2);
    card.level.textContent = level;

    const recos = FACTOR_RECOMMENDATIONS[key]?.[level] || [];
    if (!recos.length) {
      card.recos.innerHTML = `<li>Tiada cadangan khusus.</li>`;
      return;
    }

    card.recos.innerHTML = recos.map((item) => `<li>${item}</li>`).join("");
  }

  // Step navigation functions
  function showStep(stepIndex) {
    factorCardsEl.forEach((card, index) => {
      if (index === stepIndex) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    // Update progress
    const progress = ((stepIndex + 1) / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    progressLabel.textContent = `Bahagian ${
      stepIndex + 1
    } daripada ${totalSteps}`;

    // Update button visibility
    prevButton.style.display = stepIndex === 0 ? "none" : "block";

    if (stepIndex === totalSteps - 1) {
      nextButton.style.display = "none";
      calculateButton.style.display = "block";
    } else {
      nextButton.style.display = "block";
      calculateButton.style.display = "none";
    }
  }

  function validateCurrentStep() {
    const currentFactor = factorKeys[currentStep];
    const factorMeta = FACTORS[currentFactor];

    for (const questionName of factorMeta.questions) {
      const selected = form.querySelector(
        `input[name="${questionName}"]:checked`
      );
      if (!selected) {
        return false;
      }
    }
    return true;
  }

  // Next button handler
  nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      showModal(
        `Sila jawab semua soalan bagi bahagian ini sebelum meneruskan.`
      );
      return;
    }

    if (currentStep < totalSteps - 1) {
      currentStep++;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Previous button handler
  prevButton.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  calculateButton.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      showModal(
        `Sila jawab semua soalan bagi bahagian ini sebelum meneruskan.`
      );
      return;
    }
    try {
      const responses = collectResponses();
      const factorMeans = {};

      Object.entries(responses).forEach(([key, scores]) => {
        const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;
        const level = getLevel(mean);
        factorMeans[key] = mean;
        updateFactorCard(key, mean, level);
      });

      const overallMean =
        Object.values(factorMeans).reduce((sum, val) => sum + val, 0) /
        Object.values(factorMeans).length;
      const overallLevel = getLevel(overallMean);

      overallScoreEl.textContent = overallMean.toFixed(2);
      overallLevelEl.textContent = overallLevel;
      overallRecommendationEl.textContent =
        OVERALL_RECOMMENDATIONS[overallLevel] ||
        "Tiada cadangan keseluruhan ditemui.";

      // Hide form and show results
      form.style.display = "none";
      introCard.style.display = "none";
      resultsSection.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showModal(error.message);
    }
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    resetResults();
    currentStep = 0;
    showStep(currentStep);
    form.style.display = "flex";
    introCard.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  modalCloseButton?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  // Initialize
  resetResults();
  showStep(0);
});
