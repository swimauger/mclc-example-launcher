const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 347,
        height: 409,
        webPreferences: {
            nodeIntegration: true
        },
        center: true,
        maximizable: false,
        titleBarStyle: false,
        frame: false,
        show: false,
        resizable: false
    });

    mainWindow.loadFile(path.join(__dirname, 'src/html/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.webContents.on('did-finish-load', () => mainWindow.show());
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
