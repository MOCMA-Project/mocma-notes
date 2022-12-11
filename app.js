const { app, BrowserWindow, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const Shell = require("electron").shell;
const notes = "1.0.0";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./public/logo.png"),
    title: "MOCMA Notes",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
};

const NOTIFICATION_TITLE_UPDATE_YES = "Your application is up to date !";
const NOTIFICATION_BODY_UPDATE_YES = "You have the last version of MOCMA Notes";

const NOTIFICATION_TITLE_UPDATE_NO = "Your app is not update !";
const NOTIFICATION_BODY_UPDATE_NO =
  "A new tab has been opened in your main web browser to update the app";

function showNotificationUpdateYes() {
  new Notification({
    title: NOTIFICATION_TITLE_UPDATE_YES,
    body: NOTIFICATION_BODY_UPDATE_YES,
    icon: "./public/logo.png",
    closeButtonText: "Ok thanks !",
  }).show();
}

function showNotificationUpdateNo() {
  new Notification({
    title: NOTIFICATION_TITLE_UPDATE_NO,
    body: NOTIFICATION_BODY_UPDATE_NO,
    icon: "./public/logo.png",
    closeButtonText: "I have understand thanks !",
    click: Shell.openExternal("https://mocma-project.github.io/download.html"),
  }).show();
}

app.whenReady().then(() => {
  https
    .get("https://mocma-project.github.io/notes.txt", (resp) => {
      let content = "";

      // Un morceau de réponse est reçu
      resp.on("data", (chunk) => {
        content += chunk;
      });

      // La réponse complète à été reçue. On affiche le résultat.
      resp.on("end", () => {
        console.log(notes);
        console.log(content);
        if (content === notes) {
          showNotificationUpdateYes();
          console.log("Yes");
        } else {
          showNotificationUpdateNo();
          console.log("No");
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
