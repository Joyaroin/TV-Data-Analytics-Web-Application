// API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

let shows = [];
let interests = [];

// Initialize with data from backend
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch interests
        const interestsResponse = await fetch(`${API_BASE_URL}/interests`);
        interests = await interestsResponse.json();

        // Fetch shows
        const showsResponse = await fetch(`${API_BASE_URL}/shows`);
        shows = await showsResponse.json();

        // Populate interest select
        const userInterestsSelect = document.getElementById('userInterests');
        interests.forEach(interest => {
            const option = document.createElement('option');
            option.value = interest.InterestID;
            option.textContent = interest.InterestName;
            userInterestsSelect.appendChild(option);
        });

        // Initialize show list
        updateShowList();

        // Setup event listeners
        setupEventListeners();
        
        // Update user select
        await updateUserSelect();
        
        // Update show select
        updateShowSelect();

        // Initial load of ratings and stats
        await updateAgeGroupRatings();
        await updateOverallAgeGroupStats();
        
        // Initial load of detailed ratings
        await updateDetailedRatings();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading data. Please try again later.');
    }
});

function setupEventListeners() {
    // User form submission
    document.getElementById('userForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addUser();
    });

    // Show search
    document.getElementById('showSearch').addEventListener('input', (e) => {
        filterShows(e.target.value);
    });

    // Rating form submission
    document.getElementById('ratingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addRating();
    });

    // Stats refresh button
    const refreshStatsBtn = document.getElementById('refreshStats');
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', async () => {
            refreshStatsBtn.disabled = true;
            try {
                await Promise.all([
                    updateAgeGroupRatings(),
                    updateOverallAgeGroupStats()
                ]);
            } finally {
                refreshStatsBtn.disabled = false;
            }
        });
    }
    
    // Detailed ratings refresh button
    const refreshDetailedBtn = document.getElementById('refreshDetailedRatings');
    if (refreshDetailedBtn) {
        refreshDetailedBtn.addEventListener('click', async () => {
            refreshDetailedBtn.disabled = true;
            try {
                await updateDetailedRatings();
            } finally {
                refreshDetailedBtn.disabled = false;
            }
        });
    }
}

async function addUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const age = parseInt(document.getElementById('userAge').value);
    const selectedInterests = Array.from(document.getElementById('userInterests').selectedOptions)
        .map(option => parseInt(option.value));

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                age,
                interests: selectedInterests
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add user');
        }

        const result = await response.json();
        await updateUserSelect();
        document.getElementById('userForm').reset();
        alert('User added successfully!');
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user. Please try again.');
    }
}

function filterShows(filter = '') {
    updateShowList(filter);
}

function updateShowList(filter = '') {
    const showList = document.getElementById('showList');
    showList.innerHTML = '';

    const filteredShows = shows.filter(show => 
        show.Title.toLowerCase().includes(filter.toLowerCase())
    );

    filteredShows.forEach(show => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <h5 class="mb-1">${show.Title}</h5>
            <p class="mb-1">Release Year: ${show.ReleaseYear}</p>
            <small>Platform: ${show.StreamingPlatform}</small>
        `;
        showList.appendChild(item);
    });
}

async function updateUserSelect() {
    const userSelect = document.getElementById('ratingUser');
    userSelect.innerHTML = '<option value="">Select User</option>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.UserID;
            option.textContent = user.Name;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function updateShowSelect() {
    const showSelect = document.getElementById('ratingShow');
    showSelect.innerHTML = '<option value="">Select Show</option>';
    
    shows.forEach(show => {
        const option = document.createElement('option');
        option.value = show.ShowID;
        option.textContent = show.Title;
        showSelect.appendChild(option);
    });
}

async function addRating() {
    const userId = document.getElementById('ratingUser').value;
    const showId = document.getElementById('ratingShow').value;
    const score = parseInt(document.getElementById('ratingScore').value);
    const reviewText = document.getElementById('ratingReview').value;

    try {
        const response = await fetch(`${API_BASE_URL}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                showId,
                score,
                reviewText
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add rating');
        }

        const result = await response.json();
        document.getElementById('ratingForm').reset();
        alert('Rating submitted successfully!');
        
        // Update both rating displays
        await Promise.all([
            updateAgeGroupRatings(),
            updateOverallAgeGroupStats(),
            updateDetailedRatings()
        ]);
    } catch (error) {
        console.error('Error adding rating:', error);
        alert('Error submitting rating. Please try again.');
    }
}

async function updateAgeGroupRatings() {
    try {
        const response = await fetch(`${API_BASE_URL}/ratings/by-age-group`);
        const ratingsByAgeGroup = await response.json();
        
        const container = document.getElementById('ageGroupRatings');
        container.innerHTML = '';
        
        Object.entries(ratingsByAgeGroup).forEach(([ageGroup, ratings]) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';
            
            const card = document.createElement('div');
            card.className = 'card h-100';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header bg-primary text-white';
            cardHeader.innerHTML = `<h4 class="mb-0">${ageGroup}</h4>`;
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const ratingsList = document.createElement('ul');
            ratingsList.className = 'list-group list-group-flush';
            
            ratings.forEach(rating => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${rating.title}</span>
                        <div>
                            <span class="badge bg-primary rounded-pill me-2">★ ${rating.averageScore.toFixed(1)}</span>
                            <small class="text-muted">(${rating.numberOfRatings} ratings)</small>
                        </div>
                    </div>
                `;
                ratingsList.appendChild(listItem);
            });
            
            cardBody.appendChild(ratingsList);
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            col.appendChild(card);
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Error fetching age group ratings:', error);
        const container = document.getElementById('ageGroupRatings');
        container.innerHTML = '<div class="alert alert-danger">Error loading age group ratings. Please try again.</div>';
    }
}

async function updateOverallAgeGroupStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/ratings/overall-by-age-group`);
        const stats = await response.json();
        
        const container = document.getElementById('overallAgeGroupStats');
        container.innerHTML = '';
        
        const statsRow = document.createElement('div');
        statsRow.className = 'row g-4';
        
        stats.forEach(stat => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            
            const card = document.createElement('div');
            card.className = 'card text-center h-100 stats-card';
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const score = document.createElement('h2');
            score.className = 'display-4 mb-0';
            score.innerHTML = `★ ${parseFloat(stat.AverageScore).toFixed(1)}`;
            
            const ageGroup = document.createElement('p');
            ageGroup.className = 'text-muted mb-2';
            ageGroup.textContent = stat.AgeRange;
            
            const details = document.createElement('p');
            details.className = 'small mb-0';
            details.innerHTML = `
                <span class="text-primary">${stat.NumberOfUsers}</span> users<br>
                <span class="text-secondary">${stat.TotalRatings}</span> total ratings
            `;
            
            // Progress bar for visual representation
            const progress = document.createElement('div');
            progress.className = 'progress mt-3';
            progress.style.height = '8px';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = `${(stat.AverageScore / 10) * 100}%`;
            progressBar.style.backgroundColor = `hsl(${(stat.AverageScore / 10) * 120}, 70%, 50%)`;
            
            progress.appendChild(progressBar);
            
            cardBody.appendChild(score);
            cardBody.appendChild(ageGroup);
            cardBody.appendChild(details);
            cardBody.appendChild(progress);
            card.appendChild(cardBody);
            col.appendChild(card);
            statsRow.appendChild(col);
        });
        
        container.appendChild(statsRow);
        
        // Update the chart
        updateAgeGroupChart(stats);
    } catch (error) {
        console.error('Error fetching overall age group stats:', error);
        const container = document.getElementById('overallAgeGroupStats');
        container.innerHTML = '<div class="alert alert-danger">Error loading statistics. Please try again.</div>';
    }
}

function updateAgeGroupChart(stats) {
    const chartContainer = document.getElementById('ageGroupChart');
    chartContainer.innerHTML = '';
    
    const chart = document.createElement('div');
    chart.className = 'progress';
    chart.style.height = '30px';
    
    const totalUsers = stats.reduce((sum, stat) => sum + stat.NumberOfUsers, 0);
    
    stats.forEach(stat => {
        const segment = document.createElement('div');
        segment.className = 'progress-bar';
        segment.style.width = `${(stat.NumberOfUsers / totalUsers) * 100}%`;
        segment.style.backgroundColor = `hsl(${(stat.AverageScore / 10) * 120}, 70%, 50%)`;
        segment.setAttribute('data-bs-toggle', 'tooltip');
        segment.setAttribute('data-bs-placement', 'top');
        segment.setAttribute('title', `${stat.AgeRange}: ${stat.NumberOfUsers} users`);
        
        chart.appendChild(segment);
    });
    
    chartContainer.appendChild(chart);
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

async function updateDetailedRatings() {
    try {
        const response = await fetch(`${API_BASE_URL}/ratings/detailed`);
        const ratings = await response.json();
        
        const tbody = document.getElementById('detailedRatings');
        tbody.innerHTML = '';
        
        ratings.forEach(rating => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="fw-bold">${rating.UserName}</div>
                    <small class="text-muted">Age: ${rating.Age}</small>
                </td>
                <td>${rating.AgeRange}</td>
                <td>${rating.ShowTitle}</td>
                <td>
                    <span class="badge bg-primary rounded-pill">★ ${rating.Score}</span>
                </td>
                <td>
                    <p class="mb-0 text-wrap">${rating.ReviewText || '<em>No review</em>'}</p>
                </td>
                <td>
                    <small class="text-muted">${rating.UserInterests ? rating.UserInterests.split(',').join(', ') : 'None'}</small>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching detailed ratings:', error);
        const tbody = document.getElementById('detailedRatings');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Error loading detailed ratings. Please try again.
                </td>
            </tr>
        `;
    }
}
