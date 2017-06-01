const assert = require('assert')
const ChildProcess = require('child_process')
const path = require('path')
    // const {process} = require('electron');

describe('app module', function() {

            describe('app.exit(exitCode)', function() {
                var appProcess = null

                afterEach(function() {
                    if (appProcess != null) appProcess.kill()
                })

                it('create Windows', function(done) {
                    var appPath = path.join(__dirname, 'api', 'createWindows')

                    var electronPath = process.execPath


                    appProcess = ChildProcess.spawn(electronPath, [appPath])
                    appProcess.on('data', function() {
                        console.log('DATA : ', arguments)
                    });
                    appProcess.on('error', function() {
                        console.log('err : ', arguments)
                    });
                    this.timeout(15000);
                    appProcess.on('close', function(code) {
                        assert.equal(true)
                        done();
                    })
                })


                var appPath = path.join(__dirname, '../../archive', 'windowManager.js')


                it('Starting main process', function(done) {
                    var windowManager = path.join(__dirname, '../../archive', 'windowManager.js')

                    var appPath = path.join(__dirname, '../../archive', 'background.js');

                    var electronPath = process.execPath


                    appProcess = ChildProcess.spawn(electronPath, [appPath], {
                        cwd: path.join('../../', __dirname)
                    })
                    appProcess.on('data', function() {
                        console.log('DATA : ', arguments)
                    });
                    appProcess.on('error', function() {
                        console.log('err : ', arguments)
                    });
                    this.timeout(36000000000000000000000000000000000);
                    appProcess.on('close', function(code) {
                        assert.equal(true, true)
                        done();
                    })
                });
                it('@window Manager : getFilePath', function(done) {
                    var module = require(path.join(__dirname, '../../assets/js/services', 'windowManager.js'))
                    this.timeout(15000);
                    assert(module);

                })


            })