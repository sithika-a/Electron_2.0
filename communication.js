var message = {
	sender : 'chat',
	receiver  :'v2',
	eType : 'pushStatus',
	metaData : {
	status : 'Available'
	}
}
var mediator = {
sendToHost: function(msg){
messenger.broadCast(namespace.Mediator,msg);
}
}
mediator.sendToHost(message);

// hidden window code : 

var getReceiverInfo = (title) => {

}


messenger.getReceiverInfo(); 
getReceiverInfo = {
	V2 : {
		name : 'V2',
		channel : namespace.V2,
		eventsList : ['pushStatus'],
		events : {
			pushStatus : {
				name : 'pushStatus'
			}
		}
	},
	Mediator : {
		name : 'Mediator',
		channel : namespace.Mediator,
		eventsList : ['AFK'],
		events : {
			AFK : {
				name : 'AwayFromKeyBoard'
			}
		}
	}
	,SB : {
		name : 'SwitchBoard',
		channel : namespace.SB,
		eventsList : ['StatusChange'],
		events : {
			StatusChange : {
				name : 'StatusChange',
				type : 'manual', // or Auto
				status : 'Avaialble'
			}
		}
	}
}