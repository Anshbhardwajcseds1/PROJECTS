const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const voiceBtn = document.getElementById("voiceBtn");
const searchForm = document.getElementById("searchForm");
const message = document.getElementById("message");
const resultsBox = document.getElementById("results");

async function fetchWikipediaResults(query) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Search request failed");
    }

    const data = await response.json();
    return data.query.search;
}

function renderResults(results) {
    if (!results || results.length === 0) {
        resultsBox.innerHTML = `
            <div class="result-card">
                <div class="snippet">No related results found for your search.</div>
            </div>
        `;
        return;
    }

    resultsBox.innerHTML = results.map(item => {
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`;
        const snippet = item.snippet.replace(/<[^>]+>/g, "");

        return `
            <div class="result-card">
                <a href="${wikiUrl}" target="_blank" rel="noreferrer">${item.title}</a>
                <div class="url">${wikiUrl}</div>
                <div class="snippet">${snippet}</div>
            </div>
        `;
    }).join("");
}

async function performSearch(event) {
    if (event) {
        event.preventDefault();
    }

    const query = searchInput.value.trim();

    if (query === "") {
        message.textContent = "Please enter something to search.";
        resultsBox.innerHTML = "";
        searchInput.focus();
        return;
    }

    message.textContent = `Searching for "${query}"...`;
    resultsBox.innerHTML = "";

    try {
        const results = await fetchWikipediaResults(query);
        message.textContent = `Showing results for "${query}"`;
        renderResults(results);
    } catch (error) {
        message.textContent = "Something went wrong while searching.";
        resultsBox.innerHTML = `
            <div class="result-card">
                <div class="snippet">Unable to load results right now. Please try again.</div>
            </div>
        `;
    }
}

searchForm.addEventListener("submit", performSearch);
searchBtn.addEventListener("click", performSearch);

voiceBtn.addEventListener("click", () => {
    const demoText = "javascript";
    searchInput.value = demoText;
    performSearch();
});