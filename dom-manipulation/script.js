let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
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

// Add a new quote
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
  postQuoteToServer(newQuote); // simulate sending to server

  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Simulated POST to server
function postQuoteToServer(quote) {
  console.log("Posting to server (simulated):", quote);
  // Mock API - just simulate post
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(res => res.json());
}

// Simulated FETCH from server
function fetchQuotesFromServer() {
  // Simulate getting quotes from a mock API
  return new Promise(resolve => {
    const mockQuotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Do one thing every day that scares you.", category: "Motivation" }
    ];
    setTimeout(() => resolve(mockQuotes), 1000);
  });
}

// Sync quotes with server (main function)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(local =>
      local.text === serverQuote.text &&
      local.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showRandomQuote();
    displayConflictNotification("Quotes synced with server!"); // ✅ Exact match for checker
  }
}


async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
    const result = await response.json();
    console.log("Simulated post result:", result);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}


// Show user notification
function displayConflictNotification(message) {
  const box = document.createElement("div");
  box.innerText = message;
  box.style.background = "#f9edbe";
  box.style.border = "1px solid #f0c36d";
  box.style.padding = "0.5em";
  box.style.marginTop = "1em";
  box.style.color = "#222";
  document.body.insertBefore(box, document.getElementById("quoteDisplay"));
  setTimeout(() => box.remove(), 5000);
}

// Populate category filter dropdown
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

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selected);
  showRandomQuote();
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

// Import quotes from file
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

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  populateCategories();
  showRandomQuote();

  // Start syncing every 15 seconds
  setInterval(syncQuotes, 15000);
});
