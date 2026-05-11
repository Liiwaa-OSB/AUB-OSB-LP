// Shared list of universities (alphabetical order recommended)
const universityList = [
  "American University of Beirut (AUB)",
  "Lebanese American University (LAU)",
  "Balamand University",
  "Université Saint Joseph (USJ)",
  "Notre Dame University (NDU)",
  "Rafic Al-Hariri University",
  "Beirut Arab University (BAU)",
  "Islamic University of Lebanon (IUL)",
  "Arts, Sciences, and Technology University in Lebanon",
  "Holy Spirit University of Kaslik (USEK)",
  "Antonine University",
  "Lebanese International University (LIU)",
  "Lebanese University (LU)",
  "Haigazian University",
  "American University of Science and Technology (AUST)",
  "Arab Open University",
  "Lebanese Canadian University",
  "CNAM",
  "American University of Culture & Education (AUCE)",
  "Sagesse University",
  "Al Maaref University",
  "American University of Sharjah",
  "American University in Dubai",
  "United Arab Emirates University",
  "Khalifa University",
  "Sharjah University",
  "New York University Abu Dhabi",
  "The American University of Cairo",
  "Cairo University",
  "Alexandria University",
  "Ain Shams University",
  "King Abdul Aziz University",
  "King Fahd University of Petroleum and Minerals",
  "King Abdullah University of Science and Technology",
  "University of Jordan",
  "Jordan University of Science and Technology",
  "Princess Sumaya University for Technology",
  "Qatar University",
  "Texas A&M University Qatar",
  "Sultan Qaboos University",
  "University of Baghdad",
  "American University of the Middle East (AUM)"
];

// Optional: function to populate any select element with these options
function populateUniversitySelect(selectElement, includeOther = true) {
  if (!selectElement) return;
  // Clear existing options (keep the first "Select" option if any)
  selectElement.innerHTML = '<option value="">-- Select --</option>';
  universityList.forEach(uni => {
    const option = document.createElement('option');
    option.value = uni;
    option.textContent = uni;
    selectElement.appendChild(option);
  });
  if (includeOther) {
    const otherOption = document.createElement('option');
    otherOption.value = "Other";
    otherOption.textContent = "Other";
    selectElement.appendChild(otherOption);
  }
}