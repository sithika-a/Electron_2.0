module.exports = function(grunt) {
    grunt.initConfig({
        asarArchive: 'archive',
        pkg: grunt.file.readJSON('package.json'),
        distFolder: 'compiled',
        jsVersion: '<%= pkg.version %> - <%= grunt.template.today("mmm,dd yyyy HH:MM") %>',
        mode: '<%= pkg.mode %>',
        shell: {
            //    kDebug: {
            //     command: 'uglifyjs assets/js/services/logging/kDebug.js -c -m -o compiled/kDebugLogging.min.js',
            //     options: {
            //         async: false
            //     }
            // },
            //    FullClientApi: {
            //     command: 'uglifyjs assets/js/APIs/FullClientApi.js -c -m -o compiled/FullClientApi.min_intermediate.js',
            //     options: {
            //         async: false
            //     }
            // },
            //  webworker: {
            //     command: 'uglifyjs assets/extra/webworker-banner.js' 
            //        + ' assets/js/libs/Dexie.min.js'
            //        + ' assets/js/DAO/dbDAO.js' 
            //        + ' assets/js/APIs/worker.js'
            //        + ' assets/extra/webworker-footer.js -c -m -o compiled/webworker.min.js',
            //     options: {
            //         async: false
            //     }
            // },
            // background_page: {
            //     command: 'uglifyjs' +
            //         ' assets/js/background/main.js' //es6 
            //         // + ' assets/js/services/windowCreator.js'
            //         // + ' assets/js/services/windowEvents.js'
            //         // + ' assets/js/background/windowAccess.js' //es6
            //         // + ' assets/js/services/WindowManager.js' //es6
            //         // + ' assets/js/background/mainModuleLoader.js'
            //         // + ' assets/js/background/mainCrashManager.js'
            //         // + ' assets/js/background/mac-menuList.js'
            //         // + ' assets/js/background/win-menuList.js'
            //         // + ' assets/js/background/menuActions.js'
            //         +
            //         ' -o compiled/background.min.js',
            //     options: {
            //         async: false
            //     }
            // },
            hiddenWindow: {
                command: 'uglifyjs assets/js/container/hiddenWindow.js' +
                    ' assets/js/services/global.js' +
                    ' assets/js/services/utilities.js' +
                    ' assets/js/DAO/oldCommDAO.js' +
                    ' assets/comm/proto/message-proto.js' +
                    ' assets/js/services/notification.js' +
                    ' assets/js/services/mediatorMessaging.js -o compiled/hiddenWindow.min.js',
                options: {
                    async: false
                }
            },
            //    web: {
            //     command: 'uglifyjs assets/js/services/global.js'
            //        + ' assets/extra/common-banner.js' 
            //        + ' assets/js/services/utilities.js' 
            //        + ' assets/js/DAO/userDAO.js'
            //        + ' assets/js/DAO/oldCommDAO.js'
            //        + ' assets/comm/message_proto/message-proto.js'
            //        + ' assets/js/DAO/statusPanelDAO.js'
            //        + ' assets/js/DAO/goClockDAO.js' 
            //        + ' assets/js/container/web/web.js'
            //        + ' assets/js/controller/webviewController.js' 
            //        + ' assets/js/services/statusPanel/statusPanelController.js'
            //        + ' assets/js/services/statusPanel/statusPanelUI.js'
            //        + ' assets/js/services/goClock/goClockCore.js'
            //        + ' assets/js/services/linkPreview.js'
            //        + ' assets/js/services/restoration.js' 
            //        + ' assets/js/services/messageListener.js'
            //        + ' assets/js/services/menuBar.js' 
            //        + ' assets/js/services/tabs.js'
            //        + ' assets/js/services/tabLock.js'
            //        + ' assets/js/services/options.js'
            //        + ' assets/js/services/shortcut.js'
            //        + ' assets/js/services/mousemenu.js'
            //        + ' assets/js/services/answerPhrase.js'
            //        + ' assets/js/services/appRestart.js'
            //        + ' assets/js/services/appQuit.js'
            //        + ' assets/js/services/afkModule.js'
            //        + ' assets/js/services/feedback/feedbackCollector.js'
            //        + ' assets/js/services/localServer.js'
            //        + ' assets/js/services/writePermissionChecker.js'
            //        + ' assets/js/services/engineUpdater.js'
            //        // + ' assets/js/services/notification.js'
            //        + ' assets/js/services/privateBrowsing.js'
            //        + ' assets/js/services/audioNotification.js'
            //        + ' assets/js/services/processReduction.js'
            //        + ' assets/js/services/analytics/analytics.js'
            //        + ' assets/js/APIs/widgetCreator.js'
            //        + ' assets/js/services/timer/timer.js'
            //        + ' assets/js/services/softphone/phone.js'
            //        + ' assets/js/services/removeAccess.js'
            //        + ' assets/js/services/resizeTabs.js'
            //        + ' assets/js/services/networkDetect.js'
            //        + ' assets/js/services/networkStrength.js'
            //        + ' assets/js/services/maxTabCounter.js'
            //        + ' assets/js/services/findInPage.js'
            //        + ' assets/js/services/mailSender.js'
            //        + ' -o compiled/webContainer.min.js',
            //     options: {
            //         async: false
            //     }
            // },
            chat: {
                command: 'uglifyjs assets/js/services/global.js' +
                    ' assets/extra/common-banner.js' +
                    ' assets/js/services/utilities.js' +
                    ' assets/js/DAO/oldCommDAO.js' +
                    ' assets/js/DAO/userDAO.js' +
                    ' assets/comm/proto/message-proto.js' +
                    ' assets/js/services/fullAuth.js' +
                    ' assets/js/container/chat/chatUtils.js' +
                    ' assets/js/container/chat/chat.js' +
                    ' assets/js/container/chat/clientListener.js' +
                    ' assets/js/controller/webviewController.js' +
                    ' assets/js/services/asarUpdater.js' +
                    ' assets/js/services/appUpdater.js' +
                    ' assets/js/services/updateHelper.js' +
                    ' assets/js/services/appRestart.js' +
                    ' assets/js/controller/moduleController.js' +
                    ' assets/js/services/login.js' +
                    ' assets/js/services/userLoginRegister.js' +
                    ' assets/js/services/downloader.js' +
                    ' assets/js/services/notification.js' +
                    ' assets/js/services/privateBrowsing.js' +
                    ' assets/js/services/reLogin.js' +
                    ' assets/js/services/mousemenu.js' +
                    ' assets/js/services/writePermissionChecker.js' +
                    ' assets/js/services/engineUpdater.js' +
                    ' assets/js/services/updateUI.js' +
                    ' assets/js/services/mailSender.js' +
                    ' assets/js/services/removeAccess.js' +
                    ' -o compiled/chatContainer.min.js',
                options: {
                    async: false
                }
            },
            //      v2: {
            //          command: 'uglifyjs assets/js/services/global.js' 
            //             + ' assets/js/DAO/oldCommDAO.js' 
            //             + ' assets/js/services/utilities.js'
            //             + ' assets/js/controller/webviewController.js'
            //             + ' assets/js/services/shortcut.js' 
            //             + ' assets/js/services/mousemenu.js' 
            //             + ' assets/js/services/v2.js -o compiled/v2Container.min.js',
            //          options: {
            //              async: false
            //          }
            //      },
            //       timer: {
            //          command: 'uglifyjs assets/js/services/global.js' 
            //             + ' assets/js/DAO/oldCommDAO.js' 
            //             + ' assets/js/services/utilities.js'
            //             + ' assets/js/DAO/userDAO.js'
            //             + ' assets/js/APIs/widgetCreator.js' 
            //             + ' assets/js/services/timer/externalWidget.js' 
            //             + ' assets/js/controller/webviewController.js'
            //             + ' assets/js/services/analytics/analytics.js -o compiled/timerContainer.min.js',
            //          options: {
            //              async: false
            //          }
            //      }
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            libs: {
                src: [
                    'assets/js/libs/compare-versions.js', 'assets/js/libs/jquery.min.js', 'assets/js/libs/lodash.min.js', 'assets/js/libs/jquery-debounce.js', 'assets/js/libs/amplify.min.js', 'assets/js/libs/keymaster.min.js', 'assets/js/libs/locstor.js', 'assets/js/libs/tooltipster.js', 'assets/js/libs/uuid.js', 'assets/js/libs/Dexie.min.js', 'assets/js/DAO/dbDAO.js', '<%= distFolder %>/webworker.min.js', '<%= distFolder %>/kDebugLogging.min.js'
                ],
                dest: '<%= distFolder %>/libs.min.js'
            },
            // preloadContainer: {
            //     src: [
            //         'assets/js/preload/preloadContainer.js'
            //     ],
            //     dest: '<%= asarArchive %>/preloadContainer.min.js'
            // },
            // preloadHiddenWindow: {
            //     src: [
            //         'assets/js/preload/preloadHiddenWindow.js'
            //     ],
            //     dest: '<%= asarArchive %>/preloadHiddenWindow.min.js'
            // },
            //  preloadWebview: {
            //     src: [
            //         'assets/js/preload/preloadWebview.js'
            //     ],
            //     dest: '<%= asarArchive %>/preloadWebview.min.js'
            // },
            // background: {
            //     src: [
            //          'assets/js/background/*.js'
            //     ],
            //     dest: '<%= asarArchive %>/background.js'
            // },
            // web: {
            //     src:[
            //         '<%= distFolder %>/libs.min.js'
            //         ,'<%= distFolder %>/webContainer.min.js'
            //         ],
            //     dest: '<%= distFolder %>/webContainer.js'
            // },
            // v2: {
            //     src:[
            //         '<%= distFolder %>/libs.min.js'
            //         ,'<%= distFolder %>/v2Container.min.js'
            //         ],
            //     dest: '<%= distFolder %>/v2Container.js'
            // },
            hw: {
                src: [
                    '<%= distFolder %>/libs.min.js', '<%= distFolder %>/hiddenWindow.min.js'
                ],
                dest: '<%= distFolder %>/hiddenWindow.js'
            },
            chat: {
                src: [
                    '<%= distFolder %>/libs.min.js', '<%= distFolder %>/chatContainer.min.js'
                ],
                dest: '<%= distFolder %>/chatContainer.js'
            }
            // ,
            // timer: {
            //     src:[
            //         '<%= distFolder %>/libs.min.js'
            //         ,'<%= distFolder %>/timerContainer.min.js'
            //     ],
            //     dest: '<%= distFolder %>/timerContainer.js'
            // },
            // FullClientApi:{
            //     src:[
            //         '<%= distFolder %>/webworker.min.js'
            //         ,'<%=distFolder%>/kDebugLogging.min.js'
            //         ,'<%=distFolder%>/FullClientApi.min_intermediate.js'
            //     ],
            //     dest: '<%=distFolder%>/FullClientApi.min.js'
            // }
        },
        cssmin: {
            web: {
                options: {
                    report: 'min'
                },
                src: [
                    'assets/css/libs/font-awesome.min.css',
                    'assets/css/libs/switchery.css',
                    'assets/css/libs/tooltipster.css',
                    'assets/css/libs/hint.min.css',
                    'assets/css/web.css',
                    'assets/css/popup.css',
                    'assets/css/timer.css'
                ],
                dest: '<%= distFolder %>/webContainer.css'
            },
            // v2: {
            //   options: {
            //     report:'min'
            //   },
            //   src: [
            //         'assets/css/v2.css'
            //         ],
            //   dest: '<%= distFolder %>/v2Container.css'
            // },
            // timer: {
            //   options: {
            //     report:'min'
            //   },
            //   src: [
            //         'assets/css/libs/hint.min.css',
            //         'assets/css/timer.css',
            //         ],
            //   dest: '<%= distFolder %>/timerContainer.css'
            // },
            chat: {
                options: {
                    report: 'min'
                },
                src: [
                    'assets/css/chat.css',
                    'assets/css/popup.css'
                ],
                dest: '<%= distFolder %>/chatContainer.css'
            },
            websites: {
                options: {
                    report: 'min'
                },
                src: [
                    'assets/css/websites.css',
                ],
                dest: '<%= distFolder %>/websitesContainer.css'
            }
        },
        mkdir: {
            all: {
                options: {
                    create: ['asar']
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['full.asar'],
                    dest: ['asar']
                }]
            }
        }
        //,
        // shell: {
        //     sha: {
        //         command: 'openssl sha1 app.asar',
        //         options: {
        //             async: false,
        //             stdout: function(shaString) {
        //                 console.log('Sha1 check sum for asar file : ', shaString);
        //             }
        //         },
        //         stderr: false,
        //         execOptions: {
        //             cwd: 'asar/appDir'
        //         }
        //     },
            // asar: {
            //     command: 'asar pack <%= asarArchive %>/ asar/full.asar ',
            //     // command: 'asar pack <%= asarArchive %>/ asar/assets/js/background/preloadContainer.asar'
            // }
            // asar1: {
            //     command: 'asar pack <%= asarArchive %>/ asar/assets/js/preload/preloadContainer.asar'
            // }
       // }
    });
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-mkdir');

    grunt.registerTask('app', ['shell' , 'concat', 'cssmin', 'mkdir']);

};