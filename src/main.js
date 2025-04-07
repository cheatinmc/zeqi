const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

// Theme colors
const theme = {
  background: '#121212',
  cardBg: '#1E1E1E',
  primary: '#8A2BE2', // Purple
  secondary: '#00BFFF', // Blue
  accent: '#FF4500', // Orange
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336'
};

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Frameless window for custom titlebar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    backgroundColor: theme.background,
    icon: path.join(__dirname, 'assets/icon.ico')
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Center the window on screen
  mainWindow.center();

  // Open DevTools in development mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for window controls
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

// IPC handlers for application functionality
ipcMain.on('launch-tlauncher', () => {
  const filePath = path.join(process.cwd(), 'Minecraft', 'TL.exe');
  if (fs.existsSync(filePath)) {
    exec(`"${filePath}"`, (error) => {
      if (error) {
        mainWindow.webContents.send('notification', {
          message: `Error launching TLauncher: ${error.message}`,
          type: 'error'
        });
      } else {
        mainWindow.webContents.send('notification', {
          message: 'Opening TLauncher...',
          type: 'success'
        });
      }
    });
  } else {
    mainWindow.webContents.send('notification', {
      message: `File ${filePath} does not exist!`,
      type: 'error'
    });
  }
});

ipcMain.on('open-softether-vpn', () => {
  const vpnPath = 'C:\\Users\\Public\\Desktop\\SoftEther VPN Client Manager.lnk';
  if (fs.existsSync(vpnPath)) {
    exec(`"${vpnPath}"`, (error) => {
      if (error) {
        mainWindow.webContents.send('notification', {
          message: `Error opening SoftEther VPN: ${error.message}`,
          type: 'error'
        });
      } else {
        mainWindow.webContents.send('notification', {
          message: 'Opening SoftEther VPN Client Manager...',
          type: 'success'
        });
      }
    });
  } else {
    mainWindow.webContents.send('notification', {
      message: 'SoftEther VPN Client Manager not found!',
      type: 'error'
    });
  }
});

ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url);
});

ipcMain.on('open-minecraft-versions', () => {
  const appdata = process.env.APPDATA;
  const minecraftVersions = path.join(appdata, '.minecraft', 'versions');
  
  if (fs.existsSync(minecraftVersions)) {
    shell.openPath(minecraftVersions);
    mainWindow.webContents.send('notification', {
      message: `Opened: ${minecraftVersions}`,
      type: 'success'
    });
  } else {
    mainWindow.webContents.send('notification', {
      message: 'Minecraft versions folder not found!',
      type: 'error'
    });
  }
});

ipcMain.on('open-minecraft-mods', () => {
  const appdata = process.env.APPDATA;
  const minecraftMods = path.join(appdata, '.minecraft', 'mods');
  
  if (fs.existsSync(minecraftMods)) {
    shell.openPath(minecraftMods);
    mainWindow.webContents.send('notification', {
      message: `Opened: ${minecraftMods}`,
      type: 'success'
    });
  } else {
    mainWindow.webContents.send('notification', {
      message: 'Minecraft mods folder not found!',
      type: 'error'
    });
  }
}); 