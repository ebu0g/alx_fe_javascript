// Initial array of quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" — ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Function to display quotes by category
function displayQuotesByCategory(category) {
  const display = document.getElementById("quoteDisplay");
  const filtered = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
  display.innerHTML = "";

  if (filtered.length === 0) {
    display.innerText = `No quotes found in "${category}" category.`;
    return;
  }

  const ul = document.createElement("ul");
  filtered.forEach(q => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}"`;
    ul.appendChild(li);
  });

  display.appendChild(ul);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("filterBtn").addEventListener("click", () => {
  const category = document.getElementById("filterCategory").value;
  displayQuotesByCategory(category);
});
