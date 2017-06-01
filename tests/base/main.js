const electron = require('electron')
const {
    app,
    BrowserWindow,
    crashReporter,
    dialog,
    ipcMain,
    protocol,
    webContents
} = electron

const fs = require('fs')
const path = require('path')
const url = require('url')
var argv = require('yargs')
    .boolean('ci')
    .string('g').alias('g', 'grep')
    .boolean('i').alias('i', 'invert')
    .argv



app.commandLine.appendSwitch('js-flags', '--expose_gc')
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-renderer-backgrounding')

var window = null;

app.on('ready', () => {
    window = new BrowserWindow({
        title: 'Electron Tests',
        show: true,
        width: 800,
        height: 600
    });
    window.loadURL(url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file',
        query: {
            grep: argv.grep,
            invert: argv.invert ? 'true' : ''
        }
    }));
    window.on('close', (event) => {
    console.log('dont allow window to close')
    event.preventDefault();
});

});

app.on('before-quit', (e) => {
  console.log('Before Quit...')
        e.preventDefault();
    })
    // const {Coverage} = require('electabul')




// const coverage = new Coverage({
//   outputPath: path.join(__dirname, '..', '..', 'out', 'coverage')
// })
// coverage.setup()

// ipcMain.on('get-main-process-coverage', function (event) {
//   event.returnValue = global.__coverage__ || null
// })