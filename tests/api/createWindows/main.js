const {app, BrowserWindow} = require('electron')

const windows = []

function createWindow (id) {
  const window = new BrowserWindow({show: true})
  window.loadURL(`data:,window${id}`)
  windows.push(window)
}

app.once('ready', () => {
  for (let i = 1; i <= 5; i++) {
    createWindow(i)
  }

  setTimeout(function () {
    app.exit(123)
  },10000)
})
