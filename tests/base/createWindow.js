const {app, BrowserWindow} = require('electron')

const windows = []

function createWindow (id) {
  const window = new BrowserWindow({show: true})
  window.loadURL(`data:,window${id}`)
  windows.push(window)
}

app.on('ready', () => {
  for (let i = 1; i <= 3; i++) {
    createWindow(i)
  }
  app.on('before-quit', (e) => {
  console.log('Before Quit...')
        e.preventDefault();
    })

  setTimeout(function () {
    app.exit(123)
  },5000)
})
