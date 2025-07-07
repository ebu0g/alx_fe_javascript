// Load quotes from localStorage or fallback to default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote (based on filter if active)
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const selectedCategory = localStorage.getItem("lastCategoryFilter") || "all";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = `No quotes found in "${selectedCategory}" category.`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" — ${quote.category}`;

  // Save last quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories(); // Update dropdown
  showRandomQuote();
}

// Create the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "2em";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.style.marginRight = "0.5em";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.marginRight = "0.5em";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Populate category filter dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("lastCategoryFilter") || "all";

  // Clear existing options
  filter.innerHTML = "";

  // Get unique categories
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Create dropdown options
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    filter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);
  showRandomQuote();
}

// Export quotes to JSON
function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (e) {
      alert("Failed to parse JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  // Show random quote button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Category filter dropdown
  const dropdown = document.createElement("select");
  dropdown.id = "categoryFilter";
  dropdown.addEventListener("change", filterQuotes);
  document.body.insertBefore(dropdown, document.getElementById("quoteDisplay"));

  // File import
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.id = "importFile";
  importInput.onchange = importFromJsonFile;
  importInput.style.marginTop = "2em";
  document.body.appendChild(importInput);

  // Export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes as JSON";
  exportBtn.style.display = "block";
  exportBtn.style.marginTop = "1em";
  exportBtn.addEventListener("click", exportToJsonFile);
  document.body.appendChild(exportBtn);

  createAddQuoteForm();
  populateCategories();

  // Show last quote if available
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
  } else {
    showRandomQuote();
  }
});
