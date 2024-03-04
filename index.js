const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';

const username = 'eglenn-dev';
const apiUrl = `https://api.github.com/users/${username}/events`;

let DATA = {
    name: 'Ethan',
    refresh_date: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: 'America/Denver',
    }),
};

async function setWeatherInformation() {
    await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=rexburg&appid=41b040317d7c966d88f7697cb552aba4&unit=metric`
    )
        .then(r => r.json())
        .then(r => {
            DATA.city_temp = Math.round(r.main.temp - 273.15);
        });
}

async function githubStats() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Find the latest push event (commit) in the user's contributions
            const pushEvent = data.find(event => event.type === 'PushEvent');

            if (pushEvent) {
                const lastCommitDate = new Date(pushEvent.created_at).toLocaleDateString();
                DATA.last_commit_date = lastCommitDate;
                console.log('Last commit date:', lastCommitDate);
            } else {
                console.error('No push events found in the GitHub data.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

async function generateReadMe() {
    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

async function build() {
    await setWeatherInformation();
    await githubStats();
    await generateReadMe();
}

build();