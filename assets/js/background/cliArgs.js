try{
    global.sharedObject = { cliArgs: require('minimist')(process.argv, { boolean: true }) }
    
} catch (e) {
    console.log('Error while parsing cli Args with minimist : ', e);
}