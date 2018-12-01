

/*
  TODO
  * automatic reconnecting
  * event for connected / disconnected

*/


/**
 * The Habitat client appliction
 */
class HabitatClient
{
  constructor()
  {
    this.connection = null
    this.clientUnique = this.generateGuid()
  }


  generateGuid()
  {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


  connect(_host)
  {
    var self = this

    console.log("Connecting to Habitat")

    // TODO: @@@
    //this.connection = new WebSocket('ws://10.0.0.13:3030')
    this.connection = new WebSocket('ws://' + document.domain + ':3030')

    this.connection.onopen = function () {
      console.log('Connected to habitat')
    }

    this.connection.onerror = function (_error) {
      console.log('WebSocket Error: ' + JSON.stringify(_error))
      // TODO: @@@
      var logger = document.getElementById('log')
      logger.innerHTML += 'WebSocket Error: ' + JSON.stringify(_error) + '<br />';
    }

    this.connection.onmessage = function (_e) {
      console.log('Received message from habitat: ' + _e.data)
      self.messageReceived(_e.data)
    }
  }


  close()
  {
    console.log("Closing habitat client")
    if(this.connection)
      this.connection.close()
  }


  messageReceived(_habitatEnvelopeData)
  {
    var habitatEnvelope = JSON.parse(_habitatEnvelopeData)

    if(habitatEnvelope.type.toUpperCase() == "NODESTATE")
    {
      var elements = document.querySelectorAll('[habitat-id=' + habitatEnvelope.nodeId + ']')
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        if(habitatEnvelope.data)
        {
          // check if state was set by the element itself, then we do not have to update the state
          if(!habitatEnvelope.originator || habitatEnvelope.originator.clientUnique != this.clientUnique || habitatEnvelope.originator.objectUnique != element.getAttribute('habitat-unique'))
          {
            element.habitatState = habitatEnvelope.data
            if(typeof element.stateUpdatedFromExt === 'function')
              element.stateUpdatedFromExt()
          }
        }
        else
        {
          // TODO: Log Error: No state retrieved
        }
      }
    }
  }


  updateHabitatNodeStateForElement(_element, _state = null)
  {
    var envelope = {}

    // pack the current state into a data envelope and send it to all clients
    envelope.protocol     = "HABITAT_ENVELOPE"
    envelope.version      = 1
    envelope.sender       = "HABITAT MOBILE"
    envelope.senderUnique = this.clientUnique
    envelope.nodeId       = _element.getAttribute('habitat-id')
    envelope.originator   = {
                              objectUnique : _element.getAttribute('habitat-unique'),
                              clientUnique : this.clientUnique
                            }
    envelope.type         = "NODESTATE"
    if(_state)
      envelope.data       =  JSON.parse(JSON.stringify(_state))
    else
      envelope.data       =  JSON.parse(JSON.stringify(_element.habitatState))

    if(this.connection)
      this.connection.send(JSON.stringify(envelope))
  }
}

// ---------------------

var habitatClient = new HabitatClient()
habitatClient.connect()


/// -------------------

window.onbeforeunload = function() {
    habitatClient.close()
 }

window.addEventListener("unload", function(){
  habitatClient.close()
})

document.addEventListener("unload", function(){
  habitatClient.close()
})