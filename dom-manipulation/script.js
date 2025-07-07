// Load quotes from localStorage or fallback to default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote and store it in sessionStorage
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" — ${quote.category}`;

  // Save last shown quote to session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote, update array, save, and show it
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
  saveQuotes(); // Save to localStorage

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote(); // Optional: show new quote immediately
}

// Dynamically create the Add Quote form
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

// Export quotes as JSON
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

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

// Set up all event listeners and UI elements
document.addEventListener("DOMContentLoaded", () => {
  // Show quote button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Import file input
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

  // Load last quote if available from sessionStorage
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
  }

  // Create add-quote form
  createAddQuoteForm();
});
