import { app, BrowserWindow } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";

let inDevelopment: boolean;
if (process.env.NODE_ENV === "development") {
    inDevelopment = true;
} else {
    inDevelopment = false;
}

function createWindow() {
    const preload = path.join(__dirname, "preload.js");
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            devTools: inDevelopment,
            contextIsolation: true,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: false,
            preload: preload,
        },
        titleBarStyle: "hidden",
    });
    registerListeners(mainWindow);

    if (inDevelopment) {
        mainWindow.webContents.on('before-input-event', (event, input) => {
            if (input.key.toLowerCase() === 'f12') {
                mainWindow.webContents.toggleDevTools();
                event.preventDefault();
            }
        });
    }

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});