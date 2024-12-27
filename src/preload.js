const { contextBridge, ipcRenderer } = require('electron');
//const { get } = require('node:http');
//const { log } = require('electron-log/renderer')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('api', {
  weather: async () => {
      return await ipcRenderer.invoke('weatherApi', {});
  },
  currency: async () => {
      return await ipcRenderer.invoke('currencyApi', {});
  },
  notification: async () => {
    return await ipcRenderer.invoke('notificationApi', {});
  },
  logout: async () => {
    return await ipcRenderer.invoke('logoutApi', {});
  },
  screenshot: async () => {
    return await ipcRenderer.invoke('screenshotApi', {});
  },
  calculatorOpen: async () => {
    return await ipcRenderer.invoke('calculatorOpenApi', {});
  },
  ObsidianOpen: async () => {
    return await ipcRenderer.invoke('ObsidianOpenApi', {});
  },
  executionScript: async () => {
    return await ipcRenderer.invoke('executionScriptApi', {});
  },
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config)
});


contextBridge.exposeInMainWorld('user', {
    login: async (login, password) => {
      return await ipcRenderer.invoke('loginApi', {
        login: login,
        password: password
      });
    },
    autoFill: async () => {
      return await ipcRenderer.invoke('autoFillApi', {});
    }
});


contextBridge.exposeInMainWorld('dokumentooborot', {
  sendFile: async (filePath, fileName, fileBuffer, fileType) => {
    return await ipcRenderer.invoke('dokumentooborotSendFile', {
      path: filePath,
      name: fileName,
      buffer: fileBuffer,
      type: fileType
    });
  },
  getFolder: async (path) => {
    return await ipcRenderer.invoke('dokumentooborotGetFolders', {
      path: path
    });
  }
})

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName, path) => ipcRenderer.send('ondragstart', {
    fileName: fileName,
    filePath: path
  })
})

ipcRenderer.on('user-data', (event, data) => {
  // console.log(data); // { login: 'user123', password: 'pass123' }
});
