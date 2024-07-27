document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    searchJobs(query);
});

async function searchJobs(query) {
    const clientId = 'YOUR_CLIENT_ID';  // Ersetze durch deine Client ID
    const clientSecret = 'YOUR_CLIENT_SECRET';  // Ersetze durch deinen Client Secret
    const authToken = btoa(`${clientId}:${clientSecret}`);

    try {
        const tokenResponse = await fetch('https://apis.indeed.com/oauth/v2/tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authToken}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const response = await fetch(`https://apis.indeed.com/v2/search?q=${query}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data', error);
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.jobs && data.jobs.length > 0) {
        data.jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.innerHTML = `
                <h2>${job.title}</h2>
                <p>${job.company}</p>
                <p>${job.location}</p>
                <a href="${job.url}" target="_blank">Mehr erfahren</a>
            `;
            resultsDiv.appendChild(jobElement);
        });
    } else {
        resultsDiv.innerHTML = '<p>Keine Ergebnisse gefunden</p>';
    }
}
