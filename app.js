const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./public/logo.png"),
    title: "MOCMA Notes",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const menu = Menu.buildFromTemplate([
  {
    label: "MOCMA Notes",
    submenu: [
      {
        label: "Quit Free Note",
        click: () => {
          app.quit();
        },
        accelerator: "CmdOrCtrl+Q",
      },
    ],
  },
]);

Menu.setApplicationMenu(menu);
