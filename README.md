# streskonomi

Based on the workflow document provided, here is a structured `README.md` file describing the **Streskonomi** system.

This file outlines the system's purpose, data input methods, calculation logic, and interpretation of results.

---

# Streskonomi Assessment System

## Overview

**Streskonomi** is a diagnostic system designed to evaluate an individual's economic stress level ("Streskonomi"). [cite_start]It utilizes a survey-based approach using Likert-scale questions categorized by specific economic and psychological factors[cite: 1, 17]. [cite_start]The system processes these inputs to calculate both specific factor scores and an overall weighted stress score, providing actionable recommendations based on the severity of the stress[cite: 22, 53].

---

## 1. Data Input & Coding

The system accepts user responses based on a **5-point Likert Scale**. [cite_start]Users answer a series of items derived from specific factors[cite: 2, 3].

### Likert Scale Coding

| Code  | Description (Malay) | Description (English)                   |
| :---- | :------------------ | :-------------------------------------- |
| **1** | Sangat Tidak Setuju | [cite_start]Strongly Disagree [cite: 4] |
| **2** | Tidak Setuju\*      | [cite_start]Disagree [cite: 5]          |
| **3** | Sederhana           | [cite_start]Neutral/Moderate [cite: 6]  |
| **4** | Setuju              | [cite_start]Agree [cite: 7, 8]          |
| **5** | Sangat Setuju       | [cite_start]Strongly Agree [cite: 9]    |

_> Note: While the source text contains formatting variations, the scale progresses from 1 (lowest agreement) to 5 (highest agreement)._

### Assessment Factors

[cite_start]The questions are categorized into six distinct factors[cite: 10, 46]:

1.  [cite_start]**Kewangan** (Finance) [cite: 12]
2.  [cite_start]**Pendapatan & Pekerjaan** (Income & Employment) [cite: 13]
3.  [cite_start]**Simpanan** (Savings) [cite: 14]
4.  [cite_start]**Hutang** (Debt) [cite: 32]
5.  [cite_start]**Ekonomi Sosial** (Social Economy) [cite: 33]
6.  [cite_start]**Ekonomi Emosi dan Psikologi** (Economic Emotion & Psychology) [cite: 59]

---

## 2. Data Processing & Calculation Logic

[cite_start]The system processes data in two stages: calculating the mean for individual factors and calculating the weighted mean for the overall score[cite: 16, 19].

### A. Calculation by Factor

For each of the six factors, the score is calculated using the mean of the items:

$$\text{Factor Score} = \frac{\sum \text{Skor}}{\text{bilangan item soalan}}$$

[cite_start]_(Sum of scores divided by the number of question items)_[cite: 34, 35].

### B. Overall Streskonomi Calculation

The overall stress level is calculated using a **Weighted Mean Formula**. [cite_start]Specific weights are assigned to each factor to determine the final score[cite: 36, 38, 39].

**Formula:**
$$\text{Overall Score} = (A \times 0.25) + (B \times 0.20) + (C \times 0.15) + (D \times 0.20) + (E \times 0.10) + (F \times 0.10)$$

**Weight Distribution:**

- [cite_start]**0.25:** Factor A (Kewangan) [cite: 40]
- [cite_start]**0.20:** Factor B (Pendapatan) [cite: 41]
- [cite_start]**0.15:** Factor C (Simpanan) [cite: 42]
- [cite_start]**0.20:** Factor D (Hutang) [cite: 43]
- [cite_start]**0.10:** Factor E (Ekonomi Sosial) [cite: 44]
- [cite_start]**0.10:** Factor F (Ekonomi Emosi) [cite: 45]

---

## 3. Output Interpretation

The final calculated score determines the user's stress category.

### Stress Level Thresholds

| Score Range       | Stress Level (Tahap)                                 |
| :---------------- | :--------------------------------------------------- |
| **< 1.25**        | [cite_start]Sangat Rendah (Very Low) [cite: 24, 26]  |
| **1.25 – 2.50**   | [cite_start]Rendah (Low) [cite: 27]                  |
| **2.50 – < 3.00** | [cite_start]Sederhana (Moderate) [cite: 27, 28]      |
| **3.00 – < 4.00** | [cite_start]Tinggi (High) [cite: 27]                 |
| **4.00 – 5.00**   | [cite_start]Sangat Tinggi (Very High) [cite: 27, 29] |

---

## 4. Action Recommendations

[cite_start]Based on the interpreted score, the system provides specific advice[cite: 22, 54]:

- **Low / Very Low Stress:**

  > "Status kesihatan streskonomik anda baik-baik sahaja."
  > [cite_start]_(Your economic stress health status is fine.)_ [cite: 55]

- **Moderate Stress:**

  > "Perlu mula ambil tindakan yang dicadangkan dan perlu mula memerlukan pemantauan."
  > [cite_start]_(Need to start taking suggested actions and requires monitoring.)_ [cite: 56]

- **High / Very High Stress:**
  > "Perlu segera ambil tindakan penambaikan yang dicadangkan, dan perlu dapatkan kaunseling profesional."
  > [cite_start]_(Must immediately take suggested improvement actions and seek professional counseling.)_ [cite: 57, 58]

---

## System Flowchart

The workflow moves sequentially from:

1.  **Data Coding** (Input)
2.  **Data Processing** (Formulas)
3.  **Output Interpretation** (Classification)
4.  **Action Proposal** (Recommendations)

---
