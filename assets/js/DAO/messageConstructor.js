function winCommunication(option){
    this.name = 'winCommunication';
    this.meta
    this.source = null; // mandatory
    this.destination = namespace.channel.Mediator; // mandatory
    this.action =  option;
    this.userInfo = {
        name : 'userInfo'
    }

}