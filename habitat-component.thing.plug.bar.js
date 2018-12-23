import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Plug_Bar extends LitElement
    {

      static get properties() {
        return {
          habitatState : {type: Object},
          label : {type: String}
        }
      }

      constructor()
      {
        super()
        // set some default values for the element to be sure there are no problems when
        // there is no state given from external
        this.habitatState = {}
        this.habitatState.isOn  = false
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
            console.log("SWITCHED!!!!!")
            break
        }

        // a change of the switch control should update the state in the habitat app, for that we call
        // the updateHabitatNodeStateForElement method on the habitat client which will handle this
        // stuff for us
        habitatClient.updateHabitatNodeStateForElement(this)
      }


      stateUpdatedFromExt()
      {
        super.stateUpdatedFromExt()
        //
      }


      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.bar.css"/>
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.plug.bar.css"/>
          <div class="container">
            <div class="flex">
              <div class="left">
                <habitat-component-switch id="onOff" @changed="${this._onSwitchValueChanged}" .checked=${this.habitatState.isOn} ></habitat-component-switch>
                <label for="onOff">${this.label}</label>
              </div>
              <div class="right">
              </div>

            </div>
          </div>
        `
      }
    }

    customElements.define('habitat-thing-plug-bar', HabitatComponent_Plug_Bar);