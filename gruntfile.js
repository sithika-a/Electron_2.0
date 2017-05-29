module.exports = function(grunt) {
    grunt.initConfig({
      distFolder: 'compiled',
      asarArchive: 'archive',
      pkg: grunt.file.readJSON('package.json'),
      jsVersion : '<%= pkg.version %> - <%= grunt.template.today("mmm,dd yyyy HH:MM") %>',
      mode : '<%= pkg.mode %>',
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'es5/main.js': 'es6/main.js',
                    'assets/js/preload/preloadContainer.js': 'es6/preloadContainer.js',
                     'assets/js/background/mainMessagingEmitter.js': 'es6/mainMessagingEmitter.js',

                }
            }
        },
        uglify: {
          options: {
        mangle: false, // true will change the name to single letter alphabets, Difficult to debug.
        preserveComments:false, // We dont need comments in min.
        compress:false, // both these params will be useful.
        beautify:true, // both these params will be useful.
        report:'min',
        banner: ' var jsVersion = \'<%= jsVersion %>\'; \
                  var nwUserAgent = navigator.userAgent + " Tc-webkit";',
        footer: '/* FullClient */'
      },
      kDebug : {
          options: {
          mangle: true, // true will change the name to single letter alphabets, Difficult to debug.
          compress:true, // both these params will be useful.
          beautify:false, // both these params will be useful.
          report:'min',
          banner: '/* KDebug Logs Api */',
          footer: '/* 2015 FULLClient */'
        },
        src: [
        'assets/js/services/logging/kDebug.js'
        ],
        dest: '<%= distFolder%>/kDebugLogging.min.js'
      },
      preloadWeb: {
        options:{
          banner : "/* Preload JS */"
        },
        src:[
          'assets/js/preload/preload.js'
          ,'assets/js/preload/preloadWeb.js'
        ],
        dest : '<%= asarArchive %>/webPreload.min.js'
      },
      preloadContainer: {
        options:{
          banner : "/* Preload JS */"
        },
        src:[
          'assets/js/preload/preloadContainer.js'
        ],
        dest : '<%= asarArchive %>/preloadContainer.min.js'
      },
            // background: {
            //     src: [
            //         'es5/main.js'
            //     ],
            //     dest: '<%= asarArchive %>/main.js'
            // },
            // preload: {
            //     src: [
            //         'preload.js'
            //     ],
            //     dest: '<%= asarArchive %>/preload.js'
            // },
            // webPreload: {
            //     src: [
            //         'webPreload.js'
            //     ],
            //     dest: '<%= asarArchive %>/webPreload.js'
            // },
            background_page: {
                options: {
                    banner: '/* Background JS */ var jsVersion = \'<%= jsVersion %>\';'
                },
                src: [
                    'assets/js/DAO/oldCommDAO.js',
                    // 'assets/js/background/bLog.js',
                    'es5/main.js',
                    'assets/js/services/windowCreator.js',
                    'assets/js/services/windowEvents.js',
                    'assets/js/services/WindowManager.js',
                    'assets/js/background/mainMessagingEmitter.js',
                    'assets/js/background/mainModuleLoader.js',
                    'assets/js/background/mainCrashManager.js',
                    'assets/js/background/mac-menuList.js',
                    'assets/js/background/win-menuList.js',
                    'assets/js/background/menuActions.js'
                ],
                dest: '<%= distFolder %>/background.min.js'
            },
            // hr: {
            //     src: [
            //         'assets/js/container/hiddenWindow.js'

            //     ],
            //     dest: '<%= distFolder %>/hiddenWindow.min.js'
            // },
            // web: {
            //     src: [
            //         'assets/js/container/sb.js'

            //     ],
            //     dest: '<%= distFolder %>/webContainer.min.js'
            // },
            // v2: {
            //     src: [
            //         'assets/js/container/v2.js'

            //     ],
            //     dest: '<%= distFolder %>/v2Container.min.js'
            // },
            chat: {
                src: [
                    'assets/js/services/global.js'
                    ,'assets/js/services/utilities.js'
                    ,'assets/js/DAO/oldCommDAO.js'
                    ,'assets/js/DAO/userDAO.js'
                    ,'assets/js/services/fullAuth.js'
                    ,'assets/js/controller/webviewController.js'
                    ,'assets/js/container/chat.js'
                    ,'assets/js/services/asarUpdater.js'
                    ,'assets/js/services/appUpdater.js'
                    ,'assets/js/services/updateHelper.js'
                    ,'assets/js/services/appRestart.js'
                    ,'assets/js/controller/moduleController.js'
                    ,'assets/js/services/login.js'
                    ,'assets/js/services/userLoginRegister.js'
                    ,'assets/js/services/downloader.js'
                    ,'assets/js/services/notification.js'
                    ,'assets/js/services/privateBrowsing.js'
                    ,'assets/js/services/reLogin.js'
                    ,'assets/js/services/mousemenu.js'
                    ,'assets/js/services/writePermissionChecker.js'
                    ,'assets/js/services/engineUpdater.js'
                    ,'assets/js/services/updateUI.js'
                    ,'assets/js/services/mailSender.js'
                    ,'assets/js/services/removeAccess.js'
          
                ],
                dest: '<%= distFolder %>/chatContainer.min.js'
            }
        },
         concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      libs: {
        src:[
            'assets/js/libs/compare-versions.js'
            ,'assets/js/libs/jquery.min.js'
            ,'assets/js/libs/lodash.min.js'
            ,'assets/js/libs/jquery-debounce.js'
            ,'assets/js/libs/amplify.min.js'
            ,'assets/js/libs/keymaster.min.js'
            ,'assets/js/libs/locstor.js'
            ,'assets/js/libs/tooltipster.js'
            ,'assets/js/libs/uuid.js'
            ,'assets/js/libs/Dexie.min.js'
            ,'assets/js/DAO/dbDAO.js'
            , '<%= distFolder %>/webworker.min.js'
            ,'<%= distFolder %>/kDebugLogging.min.js'
        ],
        dest : '<%= distFolder %>/libs.min.js'
      },
      background: {
        src:[
            '<%= distFolder %>/background.min.js'
            ],
        dest: '<%= asarArchive %>/background.js'
      },
       chat: {
        src:[
            '<%= distFolder %>/libs.min.js'
            ,'<%= distFolder %>/chatContainer.min.js'
            ],
        dest: '<%= distFolder %>/chatContainer.js'
      }
      },
         cssmin: {
      // web: {
      //   options: {
      //     report:'min'
      //   },
      //   src: [
      //         'assets/css/libs/font-awesome.min.css',
      //         'assets/css/libs/switchery.css',
      //         'assets/css/libs/tooltipster.css',
      //         'assets/css/libs/hint.min.css',
      //         'assets/css/web.css',
      //         'assets/css/popup.css',
      //         'assets/css/timer.css'
      //         ],
      //   dest: '<%= distFolder %>/webContainer.css'
      // },
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
          report:'min'
        },
        src: [
              'assets/css/chat.css',
              'assets/css/popup.css'
              ],
        dest: '<%= distFolder %>/chatContainer.css'
      }
      ,
      // websites: {
      //   options: {
      //     report:'min'
      //   },
      //   src: [
      //         'assets/css/websites.css',
      //         ],
      //   dest: '<%= distFolder %>/websitesContainer.css'
      // }
    }
        // ,
        // mkdir: {
        //     all: {
        //         options: {
        //             create: ['asar/appDir']
        //         }
        //     }
        // },
        // copy: {
        //     main: {
        //         files: [{
        //             expand: true,
        //             src: ['app.asar'],
        //             dest: 'asar/appDir'
        //         }]
        //     }
        // },
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
        //     asar: {
        //         command: 'asar pack archive app.asar',
        //     },
        //     echo: {
        //         command: 'echo Finish',
        //     }
        // }
    });
    grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
                grunt.loadNpmTasks('grunt-contrib-concat');


    // grunt.loadNpmTasks('grunt-shell-spawn');
    // grunt.loadNpmTasks('grunt-contrib-copy');
        // grunt.registerTask('app', ['babel', 'uglify', 'shell:asar', 'mkdir', 'copy', 'shell:echo', 'shell:sha']);

    grunt.registerTask('app', ['babel', 'uglify','concat','cssmin']);

};