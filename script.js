const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortSelect = document.getElementById('sortBy');
const stackoverflowResultsContainer = document.getElementById('stackoverflowResults');
const redditResultsContainer = document.getElementById('redditResults');

async function searchStackOverflow(query, sort) {
    const baseUrl = 'https://api.stackexchange.com/2.3/search/advanced';
    const params = new URLSearchParams({
        q: query,
        site: 'stackoverflow',
        order: 'desc',
        sort: sort,
        pagesize: 7
    });

    try {
        const response = await fetch(`${baseUrl}?${params}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching Stack Overflow data:', error);
        return [];
    }
}

async function searchReddit(query, sort) {
    const baseUrl = 'https://www.reddit.com/search.json';
    const params = new URLSearchParams({
        q: query,
        sort: sort === 'votes' ? 'top' : sort,
        limit: 5
    });

    try {
        const response = await fetch(`${baseUrl}?${params}`);
        const data = await response.json();
        return data.data.children;
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        return [];
    }
}

function displayStackOverflowResults(results) {
    stackoverflowResultsContainer.innerHTML = '';

    if (results.length === 0) {
        stackoverflowResultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <div class="result-title">${item.title}</div>
            <div class="result-meta">
                <span>Score: ${item.score}</span> | 
                <span>Answers: ${item.answer_count}</span>
            </div>
            <div class="result-link">
                <a href="${item.link}" target="_blank">View on Stack Overflow</a>
            </div>
        `;

        stackoverflowResultsContainer.appendChild(card);
    });
}

function displayRedditResults(results) {
    redditResultsContainer.innerHTML = '';

    if (results.length === 0) {
        redditResultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <div class="result-title">${item.data.title}</div>
            <div class="result-meta">
                <span>Score: ${item.data.score}</span> | 
                <span>Comments: ${item.data.num_comments}</span>
            </div>
            <div class="result-link">
                <a href="https://www.reddit.com${item.data.permalink}" target="_blank">View on Reddit</a>
            </div>
        `;

        redditResultsContainer.appendChild(card);
    });
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    stackoverflowResultsContainer.innerHTML = '<p>Searching...</p>';
    redditResultsContainer.innerHTML = '<p>Searching...</p>';

    const sort = sortSelect.value;
    const stackOverflowResults = await searchStackOverflow(query, sort);
    const redditResults = await searchReddit(query, sort);

    displayStackOverflowResults(stackOverflowResults);
    displayRedditResults(redditResults);
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});
sortSelect.addEventListener('change', performSearch);