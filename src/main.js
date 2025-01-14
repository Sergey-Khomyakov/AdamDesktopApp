import { app, BrowserWindow, ipcMain, nativeTheme, dialog, Notification, nativeImage, net, desktopCapturer, screen } from 'electron';
import { xml2json } from 'xml-js'
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import child from 'node:child_process';
import process from 'node:process';
import http from 'node:http';
import { createCipheriv, createDecipheriv, randomUUID } from 'node:crypto';
import { privateKey, iv } from '../secretConfig.json';
import started from 'electron-squirrel-startup';
import log from 'electron-log/main';
import {authorization} from '../src/settings/userConfig.json';
import dropIconData from '../src/assets/icons/SelectionBackground.png';
import AutoLaunch  from 'auto-launch';
import {updateElectronApp, UpdateSourceType } from 'update-electron-app';


log.initialize();
log.info(`Start Application: ${app.getVersion()} (${process.platform})`);
const dropIcon = nativeImage.createFromDataURL(dropIconData)
const isDevelopment = process.env.NODE_ENV === "production";


if(app.isPackaged){
  
  // Auto louncher start
  if(isDevelopment){
    const appFolder = path.dirname(process.execPath)
    const exeName = path.basename(process.execPath)
    
    var autoLouncher = new AutoLaunch({
      name: 'AdamWeb',
      path: path.join(appFolder, exeName)
    });
    
    autoLouncher.isEnabled()
    .then(function(isEnabled){
      if(isEnabled){
          return;
      }
      autoLouncher.enable();
    })
    .catch(function(err){
        // handle error
    });
  }
  
  // Auto louncher end
}




// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  let authorizationWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
    },
    icon: path.join(__dirname, 'src/assets/favicon.ico'),
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    authorizationWindow.loadURL(path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, `/authorization.html`));
  } else {
    authorizationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/authorization.html`));
  }
  authorizationWindow.on('close', (ev) => {
    authorizationWindow = null;
  });
  //authorizationWindow.webContents.executeJavaScriptInIsolatedWorld(5647);
  // Open the DevTools.

  //authorizationWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  // Update app start
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: 'Sergey-Khomyakov/AdamDesktopApp',
        host: 'https://github.com/'
      },
      updateInterval: '5 minutes',
      logger: log
    })
  // Update app end


  createWindow();
  
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle('dialog', (event, method, params) => {
    dialog[method](params);
  });

  ipcMain.handle('notificationApi', (event, params) => {
    try {
      params.icon = nativeImage.createFromPath(path.join(`src/assets/favicon.png`));
      new Notification(params).show();
    } catch (error) {
      return `Error: ${error}`;
    }
  });

  ipcMain.handle('weatherApi', async (event, params) => {
    try {
      // 37.617134 55.755793 - Москва
      const response = await net.fetch("https://api.openweathermap.org/data/2.5/weather?lat=55.755793&lon=37.617134&appid=4b94f5075f71d2d311470774ed097003&units=metric");
      if (response.ok) {
        return await response.json()
      }else{
        return `Error: ${response.status}`
      }
  } catch (error) {
      console.error('Ошибка при запросе к API:', error);
      throw error; // Пробрасываем ошибку
  }
  });

  ipcMain.handle('currencyApi', async (event, params) => {
    try {
      const response = await net.fetch("https://cbr.ru/scripts/XML_daily.asp");
        if (response.ok) {
          const textDecoder = new TextDecoder("windows-1251");
          const arrayBuffer = await response.arrayBuffer();
          const xml = textDecoder.decode(arrayBuffer);
          return JSON.parse(xml2json(xml, {compact: true, spaces: 4, ignoreDeclaration: true, ignoreAttributes: true}));// Return the parsed XML document
        }else{
          return `Error: ${response.status}`
        }
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        throw error; // Пробрасываем ошибку
    }
  });

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  }) 

  ipcMain.handle('loginApi', async (event, params) => {
    try {
      params.login = criptoEncoding(params.login);
      params.password = criptoEncoding(params.password);
      // TODO: Реализация аутентификации пользователя в системе

      if(criptoDecoding(params.login) === 'admin' && criptoDecoding(params.password)=== 'admin') {
        authorization.login = params.login;
        authorization.password = params.password;
        
        BrowserWindow.getAllWindows().forEach((window) => {
          window.close();
        })
        log.info(`Пользователь авторизировался в системе: ${params.login} (${process.platform})`);
        const primaryDisplay = screen.getPrimaryDisplay()
        const { width, height } = primaryDisplay.workAreaSize
        // Create the browser window.
        let mainWindow = new BrowserWindow({
          width: width,
          height: height,
          webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            spellcheck: true
          },
          icon: path.join(__dirname, 'src/assets/favicon.png'),
        });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
          mainWindow.loadURL(path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, `/index.html`));
        } else {
          mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
        }

        // Передача данных в новое окно
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('user-data', { login: params.login, password: params.password  });
        });
        
        mainWindow.on('close', (ev) => {
          mainWindow = null;
        });
          // Open the DevTools.
          //mainWindow.webContents.openDevTools();

      } else {
        return false;
      }
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        throw error; // Пробрасываем ошибку
    }
  });

  ipcMain.handle('autoFillApi', async (event, params) => {
    try {
      return {
        login: criptoDecoding(authorization.login),
        password: criptoDecoding(authorization.password)
      }
      //return false;
    } catch (error) {
        console.log(error);
        return false;
    }
  });

  ipcMain.handle('logoutApi', async (event, params) => {
    try {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.close();
      })
      log.info(`Пользователь вышел из системы`);

      let authorizationWindowNew = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
          preload: path.join(__dirname, '/preload.js'),
        },
        icon: path.join(__dirname, 'src/assets/favicon.png'),
      });
      
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        authorizationWindowNew.loadURL(path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, `/authorization.html`));
      } else {
        authorizationWindowNew.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/authorization.html`));
      }
      authorizationWindowNew.on('close', (ev) => {
        authorizationWindowNew = null;
      });
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
    }
  });
  
  ipcMain.handle('screenshotApi', () => {
    try{
      const sizeWindow = mainWindow.getSize();
      const windowWidth = sizeWindow[0];
      const windowHeight = sizeWindow[1];
      desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: windowWidth, height: windowHeight }}).then(async sources => {
        for (const source of sources) {
            // Filter: main screen
            if ((source.name === "Entire screen")) {
                try{
                    const filePath = path.join(app.getPath('desktop'), 'screenshot.png');

                    fs.writeFileSync(filePath, source.thumbnail.toPNG());
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
    }catch (error) {
        console.error('Ошибка при запросе к API:', error);
    }
  })

  ipcMain.handle('calculatorOpenApi', async () => {
    try{
      child.exec('start calc.exe', (err, data) => {
        console.log(err)
        console.log(data.toString());
      });
    }catch (error) {
        console.log('Ошибка при запросе к API:', error);
    }
  })

  ipcMain.handle('ObsidianOpenApi', async () =>{
    try{
      const rootFolders = getLocalDiskNames();
      const fileName = "Obsidian.exe";
      rootFolders.forEach(folder => {
        const foundPath = child.spawn(`where /R ${folder} ${fileName}`, { shell: 'cmd' });

        foundPath.stdout.on('data', (data) => {
          if (data) {
            const path = data.toString().trim();
            console.log(path)
            if (path) {
              child.execFile(path, (err, data) => {
                if (err) {
                  console.error('Ошибка при запуске файла:', err);
                }
              });
            }
          }
        });

        foundPath.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });

      });

    }catch (error) {
        console.log('Ошибка при запросе к API:', error);
    }
  })

  ipcMain.handle('executionScriptApi', async () => {
    const fileUrl = "http://localhost:3000/update";
    const idrequest = randomUUID();
    try {
      log.info(`executionScriptApi Выполняем скрипт url - ${fileUrl} - ${idrequest}`);
      http.get(fileUrl, (response) => {
        let scriptContent = '';
        // Читаем данные из ответа
        response.on('data', (chunk) => {
            scriptContent += chunk;
        });

        // Когда все данные получены
        response.on('end', () => {
          // Выполняем скрипт
          child.exec(scriptContent, (error, stdout, stderr) => {
              if (error) {
                  console.error(`Ошибка выполнения скрипта: ${error.message} - ${idrequest}`);
                  return;
              }
              if (stderr) {
                  console.error(`Ошибка: ${stderr} - ${idrequest}`);
                  return;
              }
              log.info(`Скрипт успешно выполнен - ${idrequest}`);
          });
      });
      }).on('error', (err) => {
        log.error(`Не удалось скачать файл url - ${fileUrl} - ${idrequest} - ${err}`);
      });
    }catch (error) {
        log.error(`Ошибка при запросе к API: ${error} - ${idrequest}`);
    }
  })

  ipcMain.handle('dokumentooborotSendFile', async (ev, obj) => {
    try {
        const options = {
            method: 'POST',
            host: 'localhost',
            port: 3000,
            path: `/sendFile?path=${encodeURIComponent(obj.path)}&name=${encodeURIComponent(obj.name)}&type=${encodeURIComponent(obj.type)}`,
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Length': Buffer.byteLength(obj.buffer),
            },
        };

        const addFile = await new Promise((resolve, reject) => {
            const req = http.request(options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (error) {
                        reject(new Error('Error parsing JSON: ' + error.message));
                    }
                });
            });

            req.write(obj.buffer);

            req.on('error', (err) => {
                reject(new Error('Error with HTTP request: ' + err.message));
            });
        });

        return addFile; // Return the result from the server
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
    }
  });


  ipcMain.handle('dokumentooborotGetFolders', async (event, params) => {
    try {
      let folderUrl = "http://localhost:3000/folder";
      if (params.path !== undefined && params.path !== "/" && params.path !== null) {
        console.log(params.path)
        folderUrl += `?path=${params.path}`;
      }
      console.log(folderUrl)
      const folders = await new Promise((resolve, reject) => {
        http.get(folderUrl, (response) => {
          let res = '';
  
          // Collect data chunks
          response.on("data", (chunk) => {
            res += chunk;
          });
  
          // Handle end of response
          response.on("end", () => {
            try {
              const parsedData = JSON.parse(res);
              resolve(parsedData); // Resolve the promise with parsed data
            } catch (error) {
              reject(new Error('Error parsing JSON: ' + error.message));
            }
          });
  
          // Handle errors
          response.on("error", (err) => {
            reject(new Error('Error with HTTP request: ' + err.message));
          });
        }).on("error", (err) => {
          reject(new Error('Error with HTTP request: ' + err.message));
        });
      });
      return folders;
    }catch (error) {
        console.error('Ошибка при запросе к API:', error);
    }
  });

  ipcMain.on('ondragstart', (event, obj) => {
    const regex = /https?:\/\/[^\/]+/g;
    const domain = obj.filePath.match(regex)[0];
    const pathLink = obj.filePath.replace(regex, "")
    const url = domain + "/getFile?path=" + pathLink;
    const fileName = obj.fileName
    http.get(url, (response) =>{
      const tempFilePath = path.join(os.tmpdir(), fileName); // Temporary path to save the file

      // Create a write stream to save the file
      const fileStream = fs.createWriteStream(tempFilePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(); // Close the stream after finishing
        console.log('File downloaded successfully:', tempFilePath);

        // Start drag operation
        event.sender.startDrag({
            file: tempFilePath,
            icon: dropIcon,// Path to your icon
      });

        fileStream.on('error', (err) => {
          console.error('Error writing file:', err);
          event.sender.send('drag-error', { message: "Error retrieving files", error: err.message });
      });
    });
  })

    // event.sender.startDrag({
    //   file: filePath,
    //   icon: './src/assets/icons/SelectionBackground.png'
    // })
  })

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.info(`Close Application: ${app.getVersion()} (${process.platform})`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


const getLocalDiskNames = () => {
  const buffer = child.execSync(`wmic logicaldisk get Caption /format:list`).toString();
  const lines = buffer.split('\r\r\n');

  const disks = [];

  for (const line of lines) {
    if(!line) {
      continue;
    }

    const lineData = line.split('=');
    disks.push(lineData[1] + '\\');
  }
  return disks;
}

const criptoEncoding = (data) =>{
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(privateKey), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const criptoDecoding = (data) => {
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(privateKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}