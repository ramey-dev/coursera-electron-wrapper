const { app, BrowserWindow, nativeTheme, session } = require('electron');
const { url } = require('inspector');
const path = require('path');


function createWindow() {
    const userSession = session.fromPartition('persist:coursera-cache');
    const win = new BrowserWindow( {
        width: 2000,
        height: 1440,
        backgroundColor: '#121212',
        show: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            session: userSession
        }
    });

    win.loadURL('https://coursera.org');

    win.once('ready-to-show', () => {
        win.show();
    });

    win.webContents.on('did-finish-load', async () => {
        win.webContents.closeDevTools();
        
        win.webContents.insertCSS(`
            html, body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }

            header, footer, div[class*="rc-Navigation"], [class*="rc-Footer"] {
                background-color: #1e1e1e !important;
                border-radius: 10px;
                padding-left: 10px;
                padding-right: 10px;
            }

            nav:not([data-testid="page-header-wrapper"][data-e2e="page-header"]) {
                background-color: #1e1e1e !important;
                border-radius: 10px;
                padding-left: 10px;
                padding-right: 10px;
            }
            
            [aria-label="Primary"] {
                padding-top: 5px;
                padding-bottom: 5px;
            }

            a, p, h1, h2, h3, h4, h5, h6, span, div {
                color: #e0e0e0 !important;
                background-color: transparent !important;
            }

            img {
                background-color: transparent !important;
            }
            
            video {
                filter: brightness(0.8) contrast(1.1);
                background-color: #1e1e1e !important;
            }

            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-thumb {
                background-color: #555;
                border-radius: 4px;
            }
   
        `);

         win.webContents.executeJavaScript(`
            (function resizeCourseraVideo() {
                const isVideoPage = window.location.href.includes('/lecture/');
                if (!isVideoPage) return;

                function applyLayoutChanges() {
                    const videoContainer = document.querySelector('[class*="rc-VideoItem"]');
                    const sidebar = document.querySelector('[class*="rc-ItemSidebar"]');
                    const topBar = document.querySelector('[class*="TopBar"]');
                    const navBar = document.querySelector('[class*="rc-Navigation"]');

                    if (sidebar) sidebar.style.display = 'none';
                    if (topBar) topBar.style.display = 'none';
                    if (navBar) navBar.style.display = 'none';
                }

                applyLayoutChanges();

            })();
        `);

    });

    win.webContents.setWindowOpenHandler(({url}) => {
        win.loadURL(url);
        return { action: 'deny'};
    });

    win.removeMenu();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});