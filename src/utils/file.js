const { app, BrowserWindow, ipcMain, dialog } = require('electron');

app.whenReady().then(createWindow);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,  // 请根据 Electron 的安全建议适当设置
    }
  });
  mainWindow.loadFile('index.html');
}


function openFile() {
  const win = BrowserWindow.getFocusedWindow();
  dialog.showOpenDialog(win, {
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      console.log(result.filePaths);  // 控制台输出路径
      win.webContents.send('file-selected', result.filePaths[0]); // 发送第一个选中的文件路径
    }
  }).catch(err => {
    console.log(err);
  });
}

ipcMain.on('trigger-file-dialog', (event) => {
  openFile();
});
