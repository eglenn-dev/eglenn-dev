const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');
const MUSTACHE_MAIN_DIR = './main.mustache';

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

async function generateReadMe() {
    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

async function build() {
    await setWeatherInformation();
    await generateReadMe();
}

build();