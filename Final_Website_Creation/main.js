/* Shared Functionality */

var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;

    var navbar = document.querySelector('.navbar');
    if (navbar) {
        if (prevScrollpos > currentScrollPos) {
            navbar.style.transform = "translateY(0)";
        } else {
            navbar.style.transform = "translateY(-100%)";
        }
    }

    prevScrollpos = currentScrollPos;

    scrollFunction();
};

let mybutton = document.getElementById("myBtn");

function scrollFunction() {
    if (!mybutton) return;

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/* Index, Activities, Eating - Card Carousel */
if (document.querySelector('#carouselExample') || document.querySelector('#carouselBottom')) {
    const carouselId = document.querySelector('#carouselExample') ? '#carouselExample' : '#carouselBottom';
    const wrapper = document.querySelector(carouselId + ' .carousel-inner');
    const allCards = document.querySelectorAll(carouselId + ' .card-div');
    const indicators = document.querySelector(carouselId + ' .carousel-indicators');

    if (wrapper && allCards.length > 0 && indicators) {
        function getCardsPerSlide() {
            if (window.innerWidth >= 1200) return 4;
            if (window.innerWidth >= 992) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateSlides() {
            const cardsPerSlide = getCardsPerSlide();
            const totalSlides = Math.ceil(allCards.length / cardsPerSlide);

            wrapper.innerHTML = '';

            for (let i = 0; i < totalSlides; i++) {
                const slide = document.createElement('div');
                slide.className = i === 0 ? 'carousel-item active' : 'carousel-item';

                const cardsWrapper = document.createElement('div');
                cardsWrapper.className = 'cards-wrapper';

                const startIndex = i * cardsPerSlide;
                const endIndex = Math.min(startIndex + cardsPerSlide, allCards.length);

                for (let j = startIndex; j < endIndex; j++) {
                    cardsWrapper.appendChild(allCards[j].cloneNode(true));
                }

                slide.appendChild(cardsWrapper);
                wrapper.appendChild(slide);
            }

            indicators.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('data-bs-target', carouselId);
                btn.setAttribute('data-bs-slide-to', i);
                if (i === 0) {
                    btn.className = 'active';
                    btn.setAttribute('aria-current', 'true');
                }
                indicators.appendChild(btn);
            }
        }

        updateSlides();
        window.addEventListener('resize', updateSlides);
    }

    document.querySelectorAll('.carousel').forEach(function(carousel) {
        if (typeof bootstrap !== 'undefined') {
            new bootstrap.Carousel(carousel, {
                interval: false
            });
        }
    });
}

/* Flights Page - API and Filters */
// Flight API integration - Generated with assistance from ChatGPT (OpenAI)
if (document.querySelector('#flight-section')) {
    const API_KEY = 'f7848f8287921e91198af346861bfc6c';
    const AIRPORT_CODE = 'ZQN';
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cardCols = document.querySelectorAll('.card-col');
    const emptyState = document.getElementById('empty-state');

    function checkApiKey() {
        if (!API_KEY || API_KEY === 'your_api_key_here') {
            const apiWarning = document.getElementById('api-warning');
            const apiLoading = document.getElementById('api-loading');
            if (apiWarning) apiWarning.classList.remove('d-none');
            if (apiLoading) apiLoading.classList.add('d-none');
            return false;
        }
        return true;
    }

    function updateLastUpdated() {
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-NZ', {
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdatedEl.textContent = timeString;
        }
    }

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const apiContent = document.getElementById('api-content');
            const apiLoading = document.getElementById('api-loading');
            const apiError = document.getElementById('api-error');

            if (apiContent) apiContent.classList.add('d-none');
            if (apiLoading) apiLoading.classList.remove('d-none');
            if (apiError) apiError.classList.add('d-none');
            fetchLiveFlights();
        });
    }

    if (checkApiKey()) {
        fetchLiveFlights();
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCat = btn.dataset.cat;
                let visibleCount = 0;

                if (cardCols.length > 0) {
                    cardCols.forEach(col => {
                        const matches = selectedCat === 'all' || col.dataset.cat === selectedCat;
                        col.classList.toggle('hidden', !matches);
                        if (matches) visibleCount++;
                    });

                    if (emptyState) {
                        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                    }
                }
            });
        });
    }

    async function fetchLiveFlights() {
        const url = `https://api.aviationstack.com/v1/flights?arr_iata=${AIRPORT_CODE}&access_key=${API_KEY}&limit=10`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error');
            }

            displayFlights(data.data || []);

        } catch (error) {
            console.error('API Error:', error);
            const apiLoading = document.getElementById('api-loading');
            const apiError = document.getElementById('api-error');
            const errorText = document.getElementById('error-text');

            if (apiLoading) apiLoading.classList.add('d-none');
            if (apiError) apiError.classList.remove('d-none');
            if (errorText) errorText.textContent = error.message;
        }
    }

    function displayFlights(flights) {
        const apiLoading = document.getElementById('api-loading');
        const apiContent = document.getElementById('api-content');
        const tbody = document.getElementById('flights-body');

        if (apiLoading) apiLoading.classList.add('d-none');
        if (apiContent) apiContent.classList.remove('d-none');

        if (!tbody) return;

        if (!flights || flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No flights currently available</td></tr>';
            return;
        }

        let html = '';
        for (let i = 0; i < flights.length; i++) {
            const flight = flights[i];

            const airline = flight.airline?.name || 'Unknown';
            const flightNum = getFlightNumber(flight);
            const from = flight.departure?.iata || 'N/A';
            const time = formatTime(flight.arrival?.scheduled);
            const status = formatStatus(flight.flight_status);
            const statusClass = getStatusClass(flight.flight_status);

            html += `
                <tr>
                    <td><strong>${flightNum}</strong></td>
                    <td>${airline}</td>
                    <td>${from}</td>
                    <td>${time}</td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                </tr>
            `;
        }

        tbody.innerHTML = html;
        updateLastUpdated();
    }

    function getFlightNumber(flight) {
        if (flight.flight?.iata) {
            return flight.flight.iata;
        }
        if (flight.airline?.iata_code && flight.flight?.number) {
            return flight.airline.iata_code + flight.flight.number;
        }
        return 'N/A';
    }

    function formatTime(dateTimeString) {
        if (!dateTimeString) return '--';

        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-NZ', {
            timeZone: 'Pacific/Auckland',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function formatStatus(status) {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    function getStatusClass(status) {
        const statusMap = {
            'active': 'bg-success',
            'scheduled': 'bg-primary',
            'landed': 'bg-info',
            'delayed': 'bg-warning',
            'cancelled': 'bg-danger',
            'en route': 'bg-secondary'
        };
        return statusMap[status?.toLowerCase()] || 'bg-secondary';
    }
}

/* Visit Page - Filters */
if (document.querySelector('.filter-btn') && !document.querySelector('#flight-section')) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cardCols = document.querySelectorAll('.card-col');
    const emptyState = document.getElementById('empty-state');

    if (filterBtns.length > 0 && cardCols.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCat = btn.dataset.cat;
                let visibleCount = 0;

                cardCols.forEach(col => {
                    const matches = selectedCat === 'all' || col.dataset.cat === selectedCat;
                    col.classList.toggle('hidden', !matches);
                    if (matches) visibleCount++;
                });

                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }
}
