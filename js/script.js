google.charts.load('current', {
    packages: ['geochart']
  });

  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    const rawData = google.visualization.arrayToDataTable([
      ['Latitude', 'Longitude', 'City', 'Intensity'],
      [28.5383, -81.3792, '📌 We are here (Orlando Kannada Sangha)', 100]
    ]);

    // Hide the intensity from tooltip
    const view = new google.visualization.DataView(rawData);
    view.setColumns([0, 1, 2]); // omit the intensity column from tooltip

    const options = {
      region: 'US',
      resolution: 'provinces',
      displayMode: 'markers',
      backgroundColor: '#f5ede1',
      datalessRegionColor: '#ede1cf',
      colorAxis: { colors: ['#ffcccc', '#ff0000'] },
      legend: 'none',
      tooltip: { trigger: 'focus' }
    };

    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(view, options);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 550,
      events: [
        {
          title: 'Music Concert',
          start: '2024-03-03'
        },
        {
          title: 'Art Exhibition',
          start: '2024-04-10'
        },
        {
          title: 'Tech Conference',
          start: '2024-05-20'
        }
      ]
    });
    calendar.render();
  });

  function updateCalendar() {
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    // Pad with 0s
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

    document.getElementById("month").textContent = month;
    document.getElementById("day").textContent = day;
    document.getElementById("year").textContent = year;
    document.getElementById("time").textContent = timeString;
  }

  // Call once initially, then update every second
  updateCalendar();
  setInterval(updateCalendar, 1000);

  async function getOrlandoWeather() {
    const city = 'Orlando';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${config.weatherApiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        
        const data = await response.json();
        
        // Extract relevant information
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        // Update your HTML elements
        document.getElementById('weather-info').innerHTML = `
            <p><img src="${iconUrl}" alt="${description}" /> ${data.name}</p>
            <p>${temperature} °C</p>
            <p>${description}</p>
        `;
    } catch (error) {
        console.error('Weather error:', error);
        document.getElementById('weather-info').textContent = 'Unable to load weather data.';
    }
}

// Call the weather function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getOrlandoWeather();
    // Update weather every 30 minutes
    setInterval(getOrlandoWeather, 30 * 60 * 1000);
});

// Initialize infinite scroll
document.addEventListener('DOMContentLoaded', () => {
  const scrollContent = document.querySelector('.scroll-content');
  const images = scrollContent.querySelectorAll('.scroll-image');
  
  // Clone images for infinite effect
  images.forEach(img => {
    const clone = img.cloneNode(true);
    scrollContent.appendChild(clone);
  });

  // Pause animation on hover
  scrollContent.addEventListener('mouseenter', () => {
    scrollContent.style.animationPlayState = 'paused';
  });
  
  scrollContent.addEventListener('mouseleave', () => {
    scrollContent.style.animationPlayState = 'running';
  });
});

// Remove old scroll functions since we're using CSS animation
function scrollImages(direction) {
  const content = document.querySelector('.scroll-content');
  if (direction === 'left') {
    content.style.animationDirection = 'reverse';
  } else {
    content.style.animationDirection = 'normal';
  }
} 

// Update membership year
document.addEventListener('DOMContentLoaded', () => {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Update membership year
    const membershipYearElement = document.getElementById('membership-year');
    if (membershipYearElement) {
        membershipYearElement.textContent = currentYear;
    }
}); 