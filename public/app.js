document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    console.log(`Searching for: ${query}`);
    searchJobs(query);
});

async function searchJobs(query) {
    try {
        // Anfrage für das Access Token
        const tokenResponse = await fetch('/api/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!tokenResponse.ok) {
            throw new Error('Token request failed with status: ' + tokenResponse.status);
        }

        const tokenData = await tokenResponse.json();
        console.log('Token data:', tokenData);

        const accessToken = tokenData.access_token;

        // Anfrage für die Jobsuche
        const response = await fetch(`/api/search?query=${query}&accessToken=${accessToken}`);

        if (!response.ok) {
            throw new Error('Job search request failed with status: ' + response.status);
        }

        const data = await response.json();
        console.log('Job search data:', data);

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
