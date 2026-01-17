const GITHUB_USERNAME = 'Thien879811';

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' 
        ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>'
        : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>';
}

// Fetch GitHub Repos
async function fetchRepos() {
    const loader = document.getElementById('repos-loader');
    const container = document.getElementById('projects-grid');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
        const repos = await response.json();

        loader.style.display = 'none';

        repos.forEach(repo => {
            if (repo.name.toLowerCase() === GITHUB_USERNAME.toLowerCase() + '.github.io') return;
            
            const card = document.createElement('div');
            card.className = 'project-card animate';
            
            const languageTag = repo.language ? `<span class="tag">${repo.language}</span>` : '';
            
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description provided.'}</p>
                <div class="project-tags">
                    ${languageTag}
                    <span class="tag">⭐ ${repo.stargazers_count}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    View Project 
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching repos:', error);
        loader.innerHTML = '<p>Failed to load projects. Please visit my GitHub profile.</p>';
    }
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Initialize
fetchRepos();
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
    }
});
