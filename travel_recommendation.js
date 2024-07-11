document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('btnSearch');
    const clearButton = document.getElementById('btnclear');
    const resultsContainer = document.querySelector('.container');
    const originalContent = resultsContainer.innerHTML; 

    let currentResults = []; 


    async function fetchData() {
        try {
            const response = await fetch('./travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; 
        }
    }

    function handleSearch(keyword) {
        fetchData()
            .then(data => {
                keyword = keyword.toLowerCase().trim();
                let results = [];

                if (keyword === 'beach' || keyword === 'beaches') {
                    results = data.beaches || [];
                } else if (keyword === 'temple' || keyword === 'temples') {
                    results = data.temples || [];
                } else if (keyword === 'country' || keyword === 'countries') {
                    results = data.countries || [];
                } else {
                    resultsContainer.innerHTML = '<p style="font-size: 3rem;">Please enter a keyword.</p>';
                    currentResults = [];
                    return;
                }

                currentResults = results; 
                displayResults(results);
            })
            .catch(error => {
                console.error('Error in handleSearch:', error);
                resultsContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
                currentResults = [];
            });
    }

  
    function displayResults(results) {
        resultsContainer.innerHTML = ''; 

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(result => {
            const card = document.createElement('div');
            card.classList.add('destination-card');

            const img = document.createElement('img');
            img.src = result.imageUrl;
            img.alt = result.name;
            img.style.width = '50%'; 
            img.style.height = 'auto'; 
            card.appendChild(img);

            const title = document.createElement('h3');
            title.textContent = result.name;
            card.appendChild(title);

            const description = document.createElement('p');
            description.textContent = result.description;
            description.style.fontSize = '1.6rem';
            card.appendChild(description);

            const visitButton = document.createElement('a');
            visitButton.href = '#book-now';
            visitButton.textContent = 'Visit';
            visitButton.classList.add('visit-button');
            card.appendChild(visitButton);

            resultsContainer.appendChild(card);
        });
    }


    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        const searchInput = document.getElementById('conditionInput').value;
        if (searchInput) {
            handleSearch(searchInput);
        } else {
            resultsContainer.innerHTML = '<p style="font-size: 3rem;">Please enter a keyword.</p>';
            currentResults = [];
        }
    });


    clearButton.addEventListener('click', function() {
        resultsContainer.innerHTML = originalContent; 
        document.getElementById('conditionInput').value = ''; 
        currentResults = []; 
    });
});
