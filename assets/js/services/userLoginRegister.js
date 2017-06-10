/**
 * Shows user login in top of app and
 * Clocks User into SpreadhSheet with
 * Last login date and time.
 **/

((R, $, util) => {

    let childProcess = require(`child_process`);

    let getOS = {
        getSystemInfo() {
            let defer = $.Deferred();
            childProcess.exec(`systeminfo`, (error, sysout, syserr) => {
                if (!error) {
                    console.log(`System INFO ::  ${sysout} : ${syserr}`);
                    defer.resolve(sysout || syserr);
                }
                defer.reject(error);
            });
            return defer;
        },
        platform() {
            return (util.platform.isMac()) ? this.mac() : this.win();
        },
        getRelease() {
            return FULLClient.require(`os`).release();
        },
        win() {
            let osVer = this.getRelease(),
                kernalVer = /\d*\.\d*/.exec(osVer)[0];

            switch (kernalVer) {
                case `10.0`:
                    return `Windows 10`;
                case `6.3`:
                    return `Windows 8.1`;
                case `6.2`:
                    return `Windows 8`;
                case `6.1`:
                    return `Windows 7`;
                case `6.0`:
                    return `Windows vista`;
                default:
                    return `OlderOrLatest`;
            }
        },
        mac() {

            let kernalVer = this.getRelease(),
                kernalVer = /\d*/.exec(kernalVer)[0];

            switch (kernalVer) {
                case `13`:
                    return `Mavericks`;
                case `14`:
                    return `Yosemite`;
                case `15`:
                    return `El Capitan`;
                case `16`:
                    return `Sierra`;
                default:
                    return `olderOrLatest`;
            }
        }
    }


    try {
        let specs, os_details = FULLClient.require(`os`);
        // specs = "Hostname         : " + os_details.hostname() + "\n OS platform      : " + getOS.platform() + "\n CPU model        : " + os_details.cpus()[0].model + "\n OS architecture  : " + os_details.arch() + "\n Total memory     : " + Math.round((os_details.totalmem() / (1024 * 1024 * 1024))) + "GB" + "\n Free Memory      : " + Math.round((os_details.freemem() / (1024 * 1024))) + "MB" + "\n Exec Path : " + process.execPath + "\n Env Path : " + process.env.PATH;
        specs = `Hostname         :  ${os_details.hostname()}  \n OS platform      :   ${getOS.platform()}  \n CPU model        :   ${os_details.cpus()[0].model}  \n OS architecture  :   ${os_details.arch()}  \n Total memory     :   ${Math.round((os_details.totalmem() / (1024 * 1024 * 1024)))}  GB  \n Free Memory      :   ${Math.round((os_details.freemem() / (1024 * 1024)))}  MB  \n Exec Path :   ${process.execPath}  \n Env Path :   ${process.env.PATH}`;
    } catch (e) {
        console.error(`Exception while getting system info ::  ${e.message}`);
        console.error(`Exception while getting system info ::  ${e.stack}`);
        console.error(`Exception while getting system info ::  ${e}`);
        specs = `${e.message}  \n  ${e.stack}`;
    }

    let registerUser = {
        ip: `0.0.0.0`,
        name: `RegisterUserInSpreadsheet`,
        log() {
            util.log.apply(this, arguments);
        },
        setSpeckInfo(speckInfo) {
            return {
                version: `App :  ${FULLClient.manifest.version}  , Engine :   ${process.versions.electron}`, // Mandatory
                os: getOS.platform(), // Mandatory
                name: util.user.getEmail(), // Mandatory
                mode: FULLClient.getMode(), // Mandatory
                systeminfo: speckInfo || `Still Not Taken`, // Optional
                ip: this.ip // Optional
            };
        },
        getSpecDetails(cb){
            if (cb) {
                cb.call(this,{
                    appVersion: FULLClient.manifest.version,
                    engine: process.versions.electron,
                    platform: process.platform,
                    os: getOS.platform(),
                    mode: FULLClient.getMode(),
                    ipaddress: this.ip
                });
            }
            
        },
        getSpecks() {
            if (util.platform.isMac()) {
                let defer = $.Deferred();
                defer.resolve(specs);
                return defer;
            } else if (util.platform.isWin()) {
                return getOS.getSystemInfo();
            }
        },
        storeInSpreadsheet() {
            if (util.user.getEmail()) {
                this.log(`Storing in Spreadsheet user info `);
                this.getSpecks()
                    .done( systemInfo => {
                        let info = registerUser.setSpeckInfo(systemInfo)
                        $.post(`https://script.google.com/macros/s/AKfycbzyZf4grFPDwclO9WUtlfqW9-R4JRole_IWE0GXU-2pXhWvoPc/exec?`, { 'userInfo': (JSON.stringify(info)) });
                    })
                    .fail( err => {
                        // fall back to older mechanism
                        console.warn(`User-system information collection error :  ${err.message}`);
                        console.warn(`User-system information collection error :  ${err.stack}`);
                        let info = registerUser.setSpeckInfo(specs)
                        $.post(`https://script.google.com/macros/s/AKfycbzyZf4grFPDwclO9WUtlfqW9-R4JRole_IWE0GXU-2pXhWvoPc/exec?`, { 'userInfo': (JSON.stringify(info)) });
                    })
            }
        },
        getIP() {
            $.get(`http://l2.io/ip`)
                .done($.proxy( ipAddress => {
                    this.log(`Got IPAddress :   ${ipAddress}`);
                    this.ip = ipAddress;
                }, this))
                .fail($.proxy(() => {
                    this.log(`Getting IP address failed !!!`);
                }, this))
                .then($.proxy(this.storeInSpreadsheet, this));
        }
    }
    module.exports = registerUser;
    util.subscribe(`module/controller/login`, registerUser, registerUser.getIP);
    util.subscribe(`/userInfo/getSpecDetails/`,registerUser,registerUser.getSpecDetails);
})(window, jQuery, util);