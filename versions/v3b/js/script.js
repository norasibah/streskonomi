document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("streskonomi-form");
  const calculateButton = document.getElementById("calculate-button");
  const resetButton = document.getElementById("reset-button");
  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");

  const summaryPage1 = document.getElementById("summary-page-1");
  const summaryPage2 = document.getElementById("summary-page-2");
  const nextToSummaryButton = document.getElementById("next-to-summary-button");
  const backToDimensionsButton = document.getElementById(
    "back-to-dimensions-button"
  );

  const overallScoreEl = document.getElementById("overall-score");
  const overallLevelEl = document.getElementById("overall-level");
  const interpretationSection = document.getElementById(
    "interpretation-section"
  );
  const overallRecommendationEl = document.getElementById(
    "overall-recommendation"
  );

  const modal = document.getElementById("alert-modal");
  const modalMessage = document.getElementById("modal-message");
  const modalCloseButton = document.getElementById("modal-close");

  const thankYouModal = document.getElementById("thank-you-modal");
  const thankYouCloseButton = document.getElementById("thank-you-close");
  const finishButton = document.getElementById("finish-button");

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
    document.querySelectorAll("tr[data-result]")
  ).reduce((acc, row) => {
    const key = row.getAttribute("data-result");
    acc[key] = {
      mean: row.querySelector(".factor-mean"),
      level: row.querySelector(".factor-level"),
    };
    return acc;
  }, {});

  const LEVEL_THRESHOLDS = {
    "Sangat Rendah": 1.49,
    Rendah: 2.49,
    Sederhana: 3.49,
    Tinggi: 4.49,
    "Sangat Tinggi": 5.0,
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

  // const FACTOR_RECOMMENDATIONS = {
  //   kewangan: {
  //     "Sangat Rendah": [
  //       "Teruskan rutin bajet anda dan rekodkan aliran tunai mingguan.",
  //       "Kekalkan dana kecemasan sekurang-kurangnya tiga bulan perbelanjaan.",
  //     ],
  //     Rendah: [
  //       "Semak semula keutamaan perbelanjaan agar masih selari dengan matlamat.",
  //       "Perkenalkan had perbelanjaan fleksibel pada kategori gaya hidup.",
  //     ],
  //     Sederhana: [
  //       "Wujudkan belanjawan mikro untuk kos berubah seperti makanan dan pengangkutan.",
  //       "Kenal pasti bil yang boleh dirunding atau dialihkan kepada pakej lebih murah.",
  //     ],
  //     Tinggi: [
  //       "Automatikkan pembayaran bil penting untuk elak penalti dan caj lewat.",
  //       "Gunakan aplikasi pengesanan perbelanjaan harian bagi melihat kebocoran tunai.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Berunding dengan kaunselor kewangan atau AKPK untuk pelan pemulihan kos hidup.",
  //       "Pertimbangkan sumber pendapatan sampingan jangka pendek bagi menampung kos asas.",
  //     ],
  //   },
  //   pendapatan: {
  //     "Sangat Rendah": [
  //       "Teruskan pembangunan kemahiran profesional yang menyokong gaji semasa.",
  //       "Kekalkan rangkaian kerjaya aktif melalui komuniti atau mentor.",
  //     ],
  //     Rendah: [
  //       "Kemas kini CV dan profil profesional anda untuk peluang baharu.",
  //       "Tetapkan sasaran peningkatan pendapatan tahunan dan pantau kemajuan.",
  //     ],
  //     Sederhana: [
  //       "Lakukan semakan pasaran gaji untuk memahami jurang imbuhan semasa.",
  //       "Rancang sijil mikro/kursus pendek yang meningkatkan kebolehpasaran.",
  //     ],
  //     Tinggi: [
  //       "Sediakan pelan kontinjensi kerjaya termasuk sumber pendapatan alternatif.",
  //       "Bincang dengan majikan mengenai laluan kenaikan gaji atau fleksibiliti kerja.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Pertimbangkan konsultasi kerjaya profesional bagi menilai semula hala tuju pekerjaan.",
  //       "Jika perlu, rangka bajet survival berasaskan pendapatan minimum sementara mencari kerja.",
  //     ],
  //   },
  //   simpanan: {
  //     "Sangat Rendah": [
  //       "Teruskan komitmen simpanan automatik dan semak pulangan pelaburan.",
  //       "Pastikan dana pendidikan/persaraan diimbangi antara risiko dan masa.",
  //     ],
  //     Rendah: [
  //       "Tambah peratus simpanan tetap apabila menerima kenaikan pendapatan.",
  //       "Tetapkan sasaran simpanan tematik seperti pendidikan, kecemasan dan persaraan.",
  //     ],
  //     Sederhana: [
  //       "Gunakan kaedah 50/30/20 atau variasinya untuk memaksa simpanan konsisten.",
  //       "Nilai semula tabiat perbelanjaan yang menghalang pertumbuhan dana masa depan.",
  //     ],
  //     Tinggi: [
  //       "Mulakan tabung kecemasan mikro (RM1k-RM3k) sebelum simpanan besar.",
  //       "Pertimbangkan akaun pelaburan patuh syariah kos rendah untuk disiplin simpanan.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Dapatkan nasihat perancang kewangan bertauliah untuk pelan persaraan menyeluruh.",
  //       "Rangka strategi hutang-kepada-simpanan seperti snowball untuk menambah baki tunai.",
  //     ],
  //   },
  //   hutang: {
  //     "Sangat Rendah": [
  //       "Teruskan pembayaran melebihi minima bagi mempercepat penutupan pinjaman.",
  //       "Audit hutang setiap tiga bulan untuk memastikan nisbah kekal sihat.",
  //     ],
  //     Rendah: [
  //       "Gunakan kaedah avalanche/snowball untuk mempercepat pelunasan hutang kecil.",
  //       "Semak semula polisi insurans kredit bagi melindungi pinjaman utama.",
  //     ],
  //     Sederhana: [
  //       "Gabungkan hutang faedah tinggi kepada kadar rata jika kosnya lebih rendah.",
  //       "Elakkan hutang baru sehingga komitmen sedia ada stabil di bawah 40% pendapatan.",
  //     ],
  //     Tinggi: [
  //       "Hubungi pemiutang bagi merundingkan jadual bayaran lebih fleksibel.",
  //       "Jejaki penggunaan kad kredit secara harian untuk mengekang caj faedah berganda.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Segera hubungi AKPK atau penasihat kewangan untuk pelan pengurusan hutang formal.",
  //       "Jual aset tidak kritikal bagi menurunkan baki hutang jangka pendek.",
  //     ],
  //   },
  //   tekanan_sosial: {
  //     "Sangat Rendah": [
  //       "Kekalkan perspektif sihat terhadap gaya hidup orang lain melalui jurnal syukur.",
  //       "Teruskan perbualan terbuka dengan keluarga tentang had kewangan.",
  //     ],
  //     Rendah: [
  //       "Tetapkan garis panduan hadiah/derma agar tidak menjejaskan bajet utama.",
  //       "Kurangkan pendedahan kandungan yang mencetus perbandingan tidak sihat.",
  //     ],
  //     Sederhana: [
  //       "Bincangkan tanggungjawab kewangan keluarga secara terancang bukannya ad-hoc.",
  //       "Rancang aktiviti sosial kos rendah bagi mengganti acara mahal.",
  //     ],
  //     Tinggi: [
  //       "Bina skrip komunikasi untuk menolak permintaan kewangan tanpa rasa bersalah.",
  //       "Libatkan ahli keluarga lain supaya tanggungan tidak hanya pada anda.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Pertimbangkan sesi kaunseling keluarga bagi menetapkan semula jangkaan kewangan.",
  //       "Jika tekanan sosial berpunca daripada media, lakukan detox digital berkala.",
  //     ],
  //   },
  //   reaksi_emosi: {
  //     "Sangat Rendah": [
  //       "Teruskan rutin penjagaan diri seperti tidur cukup dan senaman ringan.",
  //       "Gunakan teknik pernafasan apabila membuat keputusan kewangan penting.",
  //     ],
  //     Rendah: [
  //       "Wujudkan jadual rehat berkala untuk mengelak keletihan membuat bajet.",
  //       "Catat pencetus emosi berkaitan wang di jurnal untuk kesedaran diri.",
  //     ],
  //     Sederhana: [
  //       "Cuba teknik grounding atau meditasi sebelum mesyuarat kewangan keluarga.",
  //       "Berbincang dengan rakan dipercayai mengenai kebimbangan ekonomi.",
  //     ],
  //     Tinggi: [
  //       "Dapatkan sokongan profesional sekiranya kemarahan/cemas menjejaskan hubungan.",
  //       "Agihkan tugasan kewangan (contoh bayar bil) dengan pasangan/ahli keluarga.",
  //     ],
  //     "Sangat Tinggi": [
  //       "Hubungi kaunselor atau talian psikologi segera jika emosi terasa diluar kawalan.",
  //       "Gabungkan intervensi minda-badan seperti terapi seni atau senaman berstruktur.",
  //     ],
  //   },
  // };

  const OVERALL_RECOMMENDATIONS = {
    "Sangat Rendah": {
      icon: "🟩",
      title: "TAHAP 1: Stres Ekonomi Sangat Rendah (1.00 – 1.49)",
      interpretation:
        "Streskonomi anda secara keseluruhan adalah rendah dan stabil.",
      actions: [
        "Kekalkan amalan kewangan sihat.",
        "Teruskan tabiat menyimpan yang konsisten.",
        "Pantau perubahan kewangan (contoh: pendapatan, perbelanjaan, simpanan, hutang) yang berlaku, dan bertindakbalas dengan sewajarnya.",
      ],
    },
    Rendah: {
      icon: "🟦",
      title: "TAHAP 2: Stres Ekonomi Rendah (1.50 – 2.49)",
      interpretation:
        "Streskonomi tahap Rendah; saiz tekanan yang kecil dan terkawal.",
      actions: [
        "Kurangkan perbelanjaan tidak perlu.",
        "Bangunkan tabiat menyimpan yang konsisten",
        "Bertindakbalas terhadap perubahan kewangan (contoh: pendapatan, perbelanjaan, simpanan, hutang) yang berlaku dengan sewajarnya.",
        "Tingkatkan pengetahuan kewangan asas (dalam topik: hutang, simpanan, perlindungan).",
      ],
    },
    Sederhana: {
      icon: "🟨",
      title: "TAHAP 3: Stres Ekonomi Sederhana (2.50 – 3.49)",
      interpretation:
        "Streskonomi tahap SEDERHANA; berpotensi memberi kesan negatif pada emosi, keyakinan kewangan dan perancangan masa depan.",
      actions: [
        "Utamakan perbelanjaan keperluan.",
        "Melakukan simpanan secara tetap.",
        "Elak hutang baharu.",
        "Tingkatkan kemahiran bagi peluang tambah pendapatan.",
        "Pantau aliran kewangan (contoh: pendapatan, perbelanjaan, simpanan, hutang); melalui aplikasi atau perekodan secara manual.",
        "Amalkan teknik pengurusan stres (seperti penulisan jurnal, senaman ringan dan pernafasan).",
      ],
    },
    Tinggi: {
      icon: "🟥",
      title: "TAHAP 4: Stres Ekonomi Tinggi (3.50 – 4.49)",
      interpretation:
        "Streskonomi tahap TINGGI; berpotensi beri kesan negatif pada kesihatan mental, hubungan sosial dan prestasi kerja.",
      actions: [
        "Sediakan pelan kewangan, bantu laksana bajet secara terancang.",
        "Cari sumber pendapatan tambahan untuk menampung kurangan.",
        "Berbelanja ikut keperluan, bukan gaya hidup.",
        "Jika perlu, struktur semula hutang (contoh: re-financing)",
        "Dapatkan nasihat professional dalam hal pengurusan kewangan (Contoh: AKPK - Agensi Kaunseling dan Pengurusan Kredit, sebuah agensi yang ditubuhkan oleh Bank Negara Malaysia (BNM) untuk membantu individu mengurus kewangan, hutang dan literasi kewangan).",
      ],
    },
    "Sangat Tinggi": {
      icon: "🔴",
      title: "TAHAP 5: Stres Ekonomi Sangat Tinggi (4.50 - 5.00)",
      interpretation:
        "Streskonomi tahap TINGGI; anda berisiko tinggi menghadapi masalah kebimbangan (Anxiety) dan depresi (Depression) jika tidak dirawat.",
      actions: [
        "Sediakan pelan kewangan formal, bantu laksana bajet secara terancang.",
        "Laksanakan 'financial reset' yang merangkumi aktiviti: Fokus perbelanjaan keperluan sahaja, Struktur semula hutang, mengamalkan kaedah Bajet dari kosong (Zero-Based Budget (ZBB)) - satu kaedah bajet di mana setiap ringgit mesti ada tujuan yang jelas, sama ada untuk belanja, simpan, hutang atau pelaburan.",
        "Berbincang dengan majikan/keluarga untuk sokongan dan tindakan bersama.",
        "Juga, dapatkan bantuan profesional dalam hal pengurusan kewangan & psikologi.",
      ],
    },
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

  const toggleCalcBtn = document.getElementById("toggle-calc-btn");
  const calculationBreakdown = document.getElementById("calculation-breakdown");

  function resetResults() {
    summaryPage1.classList.add("hidden");
    summaryPage2.classList.add("hidden");
    overallScoreEl.textContent = "--";
    overallLevelEl.textContent = "Skor belum dikira.";
    overallRecommendationEl.innerHTML = `
      <p style="margin: 0; text-align: center; color: #6b7280;">
        Lengkapkan soal selidik untuk melihat cadangan.
      </p>
    `;

    // Reset calculation breakdown
    toggleCalcBtn.classList.add("hidden");
    calculationBreakdown.classList.add("hidden");
    calculationBreakdown.innerHTML = "";

    Object.values(factorCards).forEach(({ mean, level }) => {
      mean.textContent = "--";
      level.textContent = "--";
    });
  }

  toggleCalcBtn.addEventListener("click", () => {
    calculationBreakdown.classList.toggle("hidden");
    const isHidden = calculationBreakdown.classList.contains("hidden");
    toggleCalcBtn.innerHTML = isHidden
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Lihat Pengiraan`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Tutup Pengiraan`;
  });

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
    prevButton.style.display = "block";
    if (stepIndex === 0) {
      prevButton.textContent = "← Kembali";
    } else {
      prevButton.textContent = "← Sebelumnya";
    }

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
      factorCardsEl[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  // Previous button handler
  prevButton.addEventListener("click", () => {
    if (currentStep === 0) {
      // On first section, go back to intro page
      window.location.href = "index.html";
    } else if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      factorCardsEl[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  calculateButton.addEventListener("click", async () => {
    if (!validateCurrentStep()) {
      showModal(
        `Sila jawab semua soalan bagi bahagian ini sebelum meneruskan.`
      );
      return;
    }
    try {
      const responses = collectResponses();
      const factorMeans = {};

      // Calculate mean for each dimension
      Object.entries(responses).forEach(([key, scores]) => {
        const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;
        const level = getLevel(mean);
        factorMeans[key] = mean;
        updateFactorCard(key, mean, level);
      });

      // Calculate weighted overall mean using the new formula
      // SKOR MIN STRESKONOMI = [(Mean_A*0.25) + (Mean_B*0.20) + (Mean_C*0.15) + (Mean_D*0.20) + (Mean_E*0.10) + (Mean_F*0.10)]/6
      const weights = {
        kewangan: 0.25,
        pendapatan: 0.2,
        simpanan: 0.15,
        hutang: 0.2,
        tekanan_sosial: 0.1,
        reaksi_emosi: 0.1,
      };

      let breakdownHtml = "";
      const weightedSum = Object.entries(factorMeans).reduce(
        (sum, [key, mean]) => {
          const weight = weights[key];
          const contribution = mean * weight;
          const label = FACTORS[key].label;

          breakdownHtml += `
            <div class="calc-row">
                <span>${label} (${mean.toFixed(2)}) × ${weight}</span>
                <span>= ${contribution.toFixed(3)}</span>
            </div>
          `;

          return sum + contribution;
        },
        0
      );

      // const overallMean = weightedSum / 6;
      const overallMean = weightedSum;

      breakdownHtml += `
        <div class="calc-total">
            <div class="calc-row">
                <span>Jumlah Pemberat</span>
                <span>= ${weightedSum.toFixed(3)}</span>
            </div>
        </div>
      `;

      // Update breakdown container
      calculationBreakdown.innerHTML = breakdownHtml;
      toggleCalcBtn.classList.remove("hidden");

      const overallLevel = getLevel(overallMean);
      const recommendation = OVERALL_RECOMMENDATIONS[overallLevel];

      overallScoreEl.textContent = overallMean.toFixed(2);
      overallLevelEl.textContent = overallLevel;

      // Display new detailed recommendation
      if (recommendation) {
        // Parse title components to separate "TAHAP X" and "Main Title" (without range)
        let titleHtml = recommendation.title;
        const titleParts = recommendation.title.split(":");

        if (titleParts.length > 1) {
          const prefix = titleParts[0].trim(); // "TAHAP X"
          const rest = titleParts.slice(1).join(":").trim();
          const lastParenIndex = rest.lastIndexOf("(");

          if (lastParenIndex !== -1) {
            const mainTitle = rest.substring(0, lastParenIndex).trim();

            titleHtml = `
                    <span class="tahap-label">${prefix}</span>
                    <span class="main-title">${mainTitle}</span>
                `;
          }
        }

        // Update interpretation section
        interpretationSection.innerHTML = `
          <h4>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </span> 
            Interpretasi
          </h4>
          <p>${recommendation.interpretation}</p>
        `;

        // Update recommendation section
        overallRecommendationEl.innerHTML = `
          <h4>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
              </svg>
            </span> 
            Cadangan Tindakan
          </h4>
          <ul class="action-list">
            ${recommendation.actions
              .map((action) => `<li>${action}</li>`)
              .join("")}
          </ul>
        `;
      }

      // Hide form and show results
      form.style.display = "none";
      summaryPage1.classList.remove("hidden");
      summaryPage2.classList.add("hidden");
      summaryPage1.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      showModal(error.message);
    }
  });

  // Navigation between summary pages
  nextToSummaryButton.addEventListener("click", () => {
    summaryPage1.classList.add("hidden");
    summaryPage2.classList.remove("hidden");
    summaryPage2.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  backToDimensionsButton.addEventListener("click", () => {
    summaryPage2.classList.add("hidden");
    summaryPage1.classList.remove("hidden");
    summaryPage1.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    resetResults();
    currentStep = 0;
    showStep(currentStep);
    form.style.display = "flex";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  modalCloseButton?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  // Finish button - show thank you modal
  finishButton.addEventListener("click", () => {
    thankYouModal.classList.remove("hidden");
  });

  // Thank you modal close - redirect to index.html
  thankYouCloseButton?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  thankYouModal?.addEventListener("click", (event) => {
    if (event.target === thankYouModal) {
      window.location.href = "index.html";
    }
  });

  // Initialize
  resetResults();
  showStep(0);
});
