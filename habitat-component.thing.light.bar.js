// TODO: Use molecule?!

import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Light_Bar extends LitElement
    {

      static get properties() {
        return {
          habitatState : {type: Object},
          label : {type: String},
          type : {type: String}
        }
      }

      constructor()
      {
        super()
        // set some default values for the element to be sure there are no problems when
        // there is no state given from external
        this.habitatState = {}
        this.habitatState.isOn  = false
        this.habitatState.color = {
                                    'white'     : 127,
                                    'warmwhite' : 127
                                  }
        // the element has a type which light it is for now there is only TW but later
        // there should be L, TW, RGB, RGBW
        // L    ... Light
        // TW   ... Tunable White
        // RGB  ... RGB
        // RGBW ... RGBW
        this.type = "TW"

        // this one is to set the range for the brightness
        // brightness greater 255 is not really usefull due artnet only does have a range from 0..255
        this.brightnessRange = 254
      }


      /**
       * converts a color object ('white', warmWhite') to a tunable white value
       * TODO:  There may be better and correcter ways for converting, but for now we stick to this simple one
       *        We should outsource this to a ColorTools class
       * @param {Object} _color a color object with 'white' and 'warmWhite' values
       * @return {Number} the tunableWhite color (0..254)
       */
      colorToTunableWhite(_color)
      {
          return _color.warmwhite
      }


      /**
       * converts tuneable white value into a color object ('white', warmWhite')
       * TODO:  There may be better and correcter ways for converting, but for now we stick to this simple one
       *        We should outsource this to a ColorTools class
       * @param {Number} _tuneableWhite the tunableWhite color (0..254)
       * @return {Object} a color object with 'white' and 'warmWhite' values
       */
      tunableWhiteToColor(_tuneableWhite)
      {
        var color = new Object()
        if(_tuneableWhite >= 127)
        {
          color.warmwhite = _tuneableWhite
          color.white     = 127 - (_tuneableWhite - 127)
        }
        else
        {
          color.warmwhite = _tuneableWhite
          color.white     = 127 + (127 - _tuneableWhite)
        }
        return color
      }


      /**
       * is called whenever a slider value is changed by the user
       * it will handle the state update for the slider id for the element and also will trigger a
       * update to the noe habitat application
       * @param {Event} _e the range event
       */
      _onSliderValueChanged(_e)
      {
        var curValue = parseInt(_e.currentTarget.value)

        switch(_e.currentTarget.id.toUpperCase())
        {
          // the tuned white value is from 0..254 and has to be converted to warmwhite and white values
          // which is done by the 'tunableWhiteToColor' method
          case 'TUNEDWHITE' :
            this.habitatState.color = this.tunableWhiteToColor(curValue)
            break
          // brightness value is 0..1 in floating point, so we have to divide the value we get from the
          // range control to have a maimum value of 1
          case 'BRIGHTNESS' :
            this.habitatState.brightness = (curValue / this.brightnessRange )
            break
        }

        // a change of the slider control should update the state in the habitat app, for that we call
        // the updateHabitatNodeStateForElement method on the habitat client which will handle this
        // stuff for us
        habitatClient.updateHabitatNodeStateForElement(this)
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


      /*
      _render(props) {
        return html`
              ${props.shouldRenderThis ? html`<mwc-button label="add" on-click="${_ => this.addFunction()}"></mwc-button>` : ''}
        `;
      }
      */

      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.light.bar.css"/>

          <div class="container">
            <div class="flex">
              <div class="left">
                <habitat-component-switch id="onOff" @change="${this._onSwitchValueChanged}" .checked=${this.habitatState.isOn} ></habitat-component-switch>
                <label for="switch">${this.label}</label>
              </div>
              <div class="right" @click="${this._onToggleSettings}">
                <img src="tune.svg" style="margin: auto;">
              </div>
            </div>

            <div class="flex" id="settings" style="display: none;">

              <div class="colorSliderContainer">
                <habitat-component-slider id="tunedWhite" min="0" max="254" gradient="TunableWhite" @change="${this._onSliderValueChanged}" value=${this.colorToTunableWhite(this.habitatState.color)}></habitat-component-slider>
              </div>

              <div class="colorSliderContainer">
                <habitat-component-slider id="brightness" min="0" max=${this.brightnessRange} gradient="Brightness" @change="${this._onSliderValueChanged}" value=${this.habitatState.brightness * this.brightnessRange}></habitat-component-slider>
              </div>

            </div>

          </div>
        `
      }





    }

    customElements.define('habitat-thing-light-bar', HabitatComponent_Light_Bar);