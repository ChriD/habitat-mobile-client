/*
  TODO
  * automatic reconnecting
  * event for connected / disconnected

*/

/**
 * The Habitat client appliction
 */
class HabitatClient {
  constructor() {
    this.connection = null;
    this.clientUnique = this.generateGuid();
  }

  generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  connect(_host) {
    var self = this;
    console.log("Connecting to Habitat"); // TODO: @@@
    //this.connection = new WebSocket('ws://10.0.0.13:3030')

    this.connection = new WebSocket('ws://' + document.domain + ':3030');

    this.connection.onopen = function () {
      console.log('Connected to habitat');
    };

    this.connection.onerror = function (_error) {
      console.log('WebSocket Error: ' + JSON.stringify(_error)); // TODO: @@@

      var logger = document.getElementById('log');
      logger.innerHTML += 'WebSocket Error: ' + JSON.stringify(_error) + '<br />';
    };

    this.connection.onmessage = function (_e) {
      console.log('Received message from habitat: ' + _e.data);
      self.messageReceived(_e.data);
    };
  }

  close() {
    console.log("Closing habitat client");
    if (this.connection) this.connection.close();
  }

  messageReceived(_habitatEnvelopeData) {
    var habitatEnvelope = JSON.parse(_habitatEnvelopeData);

    if (habitatEnvelope.type.toUpperCase() == "NODESTATE") {
      var elements = document.querySelectorAll('[habitat-id=' + habitatEnvelope.nodeId + ']');

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.habitatState = habitatEnvelope.data;
        if (typeof element.stateUpdatedFromExt === 'function') element.stateUpdatedFromExt();
      }
    }
  }

  updateHabitatNodeStateForElement(_element) {
    var envelope = {}; // pack the current state into a data envelope and send it to all clients

    envelope.protocol = "HABITAT_ENVELOPE";
    envelope.version = 1;
    envelope.sender = "HABITAT MOBILE";
    envelope.senderUnique = this.clientUnique;
    envelope.nodeId = _element.getAttribute('habitat-id');
    envelope.type = "NODESTATE";
    envelope.data = _element.habitatState;
    if (this.connection) this.connection.send(JSON.stringify(envelope));
  }

} // ---------------------


var habitatClient = new HabitatClient();
habitatClient.connect(); /// -------------------

window.onbeforeunload = function () {
  habitatClient.close();
};

window.addEventListener("unload", function () {
  habitatClient.close();
});
document.addEventListener("unload", function () {
  habitatClient.close();
});