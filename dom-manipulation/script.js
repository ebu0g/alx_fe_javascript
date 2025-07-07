let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  // Simulate pushing to server
  simulatePostToServer(newQuote);

  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function createAddQuoteForm() {
  const form = document.createElement("div");
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(form);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("lastCategoryFilter") || "all";

  filter.innerHTML = "";
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selected) opt.selected = true;
    filter.appendChild(opt);
  });
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selected);
  showRandomQuote();
}

// Simulated server fetch (every 10 seconds)
function syncWithServer() {
  console.log("Syncing with mock server...");

  simulateFetchFromServer().then(serverQuotes => {
    let newQuotes = [];

    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(local => local.text === serverQuote.text && local.category === serverQuote.category)) {
        newQuotes.push(serverQuote);
      }
    });

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      notifyUser("New quotes synced from server.");
    }
  });
}

// Notification message
function notifyUser(message) {
  const note = document.createElement("div");
  note.innerText = message;
  note.style.background = "#ddf";
  note.style.padding = "0.5em";
  note.style.margin = "1em 0";
  document.body.insertBefore(note, document.getElementById("quoteDisplay"));
  setTimeout(() => note.remove(), 5000);
}

// Simulate fetch from server
function simulateFetchFromServer() {
  return new Promise(resolve => {
    const mockServerQuotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Do one thing every day that scares you.", category: "Motivation" }
    ];
    setTimeout(() => resolve(mockServerQuotes), 1000);
  });
}

// Simulate post to server (log only)
function simulatePostToServer(quote) {
  console.log("Pushed to server (simulated):", quote);
}

// JSON Import/Export
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
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  createAddQuoteForm();
  populateCategories();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
  } else {
    showRandomQuote();
  }

  // Start periodic server sync
  setInterval(syncWithServer, 10000);
});
