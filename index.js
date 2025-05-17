const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');
const MUSTACHE_MAIN_DIR = './main.mustache';

const DATA = {
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
    const latitude = 43.817749;
    const longitude = -111.783011;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5fba60eb0816d6da484e2f051161727d&units=imperial`;

    await fetch(apiUrl)
        .then(r => r.json())
        .then(r => {
            DATA.temp = r.main.temp.toString().split('.')[0];
        });
    DATA.time = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Denver",
        hour: 'numeric',
        minute: 'numeric',
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