const fs = require('fs');
const { Authenticator, Client} = require("minecraft-launcher-core");
const client = new Client();

window.onload = (e) => {
    if(localStorage.getItem('auth')) {
        const auth = JSON.parse(localStorage.getItem('auth'));
        document.querySelector('.login > h2').innerText = `Last logged in as: ${auth.name}`;
        if(auth.offline) return;
        Authenticator.validate(auth.access_token, auth.client_token).then(e => {
            document.querySelector('.login > h2').innerText = `Logged in as: ${auth.name}`;
            document.getElementsByClassName('wrapper')[0].classList.add('disabled');
        }).catch(e => {
            console.warn(e)
        })
    }
};

async function init() {
    if(localStorage.getItem('auth')) {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if(auth.offline) {
            await processClient(JSON.parse(localStorage.getItem('auth')));
            return;
        }
        Authenticator.validate(auth.access_token, auth.client_token).then(async e => {
            await processClient(JSON.parse(localStorage.getItem('auth')));
        }).catch(e => {
            prependError('wrongPass');
            console.warn(e)
        });
        return;
    }

    const login = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    if(!login.username) {
        prependError('missingField');
    }

    Authenticator.getAuth(login.username, login.password).then(async e => {
        if(!login.password) e.offline = true;
        localStorage.setItem('auth', JSON.stringify(e));
        await processClient(e);
    }).catch(e => {
        prependError('wrongPass');
        console.warn(e);
    });
}

async function processClient(e) {
    document.getElementsByClassName('login')[0].classList.add('disabled');
    document.getElementsByClassName('look')[0].style.display = "block";
    await client.launch({
        authorization: e,
        root: "./game",
        version: {
            number: document.getElementsByClassName('versionBox')[0].value,
            type: "release"
        },
        memory: {
            max: "1024",
            min: "1024"
        }
    }).catch(e => {
        prependError('genericError', e.message)
    })
}

client.on('debug', (e) => console.log(e));
client.on('data', (e) => console.log(e));
client.on('close', (e) => {
    document.getElementsByClassName('login')[0].classList.remove('disabled');
    document.getElementsByClassName('look')[0].style.display = "none";
});
