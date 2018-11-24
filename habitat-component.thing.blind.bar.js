// TODO: Use molecule?!

import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Blind_Bar extends LitElement
    {

      static get properties() {
        return {
          habitatState : {type: Object},
          label : {type: String},
          blindType : {type: String},
        }
      }

      constructor()
      {
        super()
        // set some default values for the element to be sure there are no problems when
        // there is no state given from external
        this.habitatState = {}
        this.habitatState.blindPosition = 0

        // the element has a type which blind it is
        // ROLLERBLIND    ... Roller Blind
        // EXTERNALBLIND  ... External Blind
        this.lightType = "ROLLERBLIND"
      }


      /**
       * is called whenever a switch value is changed by the user
       * @param {Event} _e the checked event
       */
      _onSwitchValueChanged(_e)
      {
        switch(_e.currentTarget.id.toUpperCase())
        {
          // the onOff switch does turn on and off the lamp
          case "ONOFF":
            if(this.habitatState.isOn != _e.currentTarget.checked)
              this.habitatState.isOn = _e.currentTarget.checked
            break
        }

        // a change of the switch control should update the state in the habitat app, for that we call
        // the updateHabitatNodeStateForElement method on the habitat client which will handle this
        // stuff for us
        habitatClient.updateHabitatNodeStateForElement(this)
      }


      /**
       * is called when the toggle settings button is clicked
       * @param {Event} _e the click event
       */
      _onToggleSettings(_e)
      {
        var element = this.shadowRoot.getElementById("settings");
        if(element.style.display == 'block')
          element.style.display = 'none';
        else
          element.style.display = 'block';
      }


      /**
       * is called when the toggle settings button is clicked
       * @param {Event} _e the click event
       */
      _onButtonClick(_e)
      {
        switch(_e.currentTarget.dataset.context.toUpperCase())
        {
          case "blindPosition":
            this.habitatState.blindPosition = parseInt(_e.currentTarget.dataset.value)
            break
        }

        // we have to update the state on the habitat app
        habitatClient.updateHabitatNodeStateForElement(this)
      }


      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.blind.bar.css"/>

          <div class="container">
            <div class="flex">
              <div class="left">
                <button @click="${this._onButtonClick}" data-context="blindPosition" data-value="0">0%</button>
                <button @click="${this._onButtonClick}" data-context="blindPosition" data-value="25">25%</button>
                <button @click="${this._onButtonClick}" data-context="blindPosition" data-value="50">50%</button>
                <button @click="${this._onButtonClick}" data-context="blindPosition" data-value="75">75%</button>
                <button @click="${this._onButtonClick}" data-context="blindPosition" data-value="100">100%</button>
                ${this.habitatState.blindPosition}
                <label for="switch">${this.label}</label>
              </div>
              <div class="right" @click="${this._onToggleSettings}">
                <img src="tune.svg" style="margin: auto;">
              </div>
            </div>


            <div class="flex" id="settings" style="display: none;">
            </div>

          </div>
        `
      }





    }

    customElements.define('habitat-thing-blind-bar', HabitatComponent_Blind_Bar);