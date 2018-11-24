// TODO: Use molecule?!
import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";

class HabitatComponent_Light_Bar extends LitElement {
  static get properties() {
    return {
      habitatState: {
        type: Object
      },
      label: {
        type: String
      },
      lightType: {
        type: String
      },
      showIndividualColorSliders: {
        type: Boolean
      }
    };
  }

  constructor() {
    super(); // set some default values for the element to be sure there are no problems when
    // there is no state given from external

    this.habitatState = {};
    this.habitatState.isOn = false;
    this.habitatState.color = {
      'white': 127,
      'warmwhite': 127,
      'red': 127,
      'green': 127,
      'blue': 127 // the element has a type which light it is for now there is only TW but later
      // there should be L, TW, RGB, RGBW
      // ONE    ... Light
      // TW     ... Tunable White
      // RGB    ... RGB
      // RGBW   ... RGBW
      // RGBTW  ... RGBTW

    };
    this.lightType = "TW"; // default we do not set any individual color sliders

    this.showIndividualColorSliders = false; // this one is to set the range for the brightness
    // brightness greater 255 is not really usefull due artnet only does have a range from 0..255

    this.brightnessRange = 254;
  }
  /**
   * converts a color object ('white', warmWhite') to a tunable white value
   * TODO:  There may be better and correcter ways for converting, but for now we stick to this simple one
   *        We should outsource this to a ColorTools class
   * @param {Object} _color a color object with 'white' and 'warmWhite' values
   * @return {Number} the tunableWhite color (0..254)
   */


  colorToTunableWhite(_color) {
    return _color.warmwhite;
  }
  /**
   * converts a hue integer to a rgb color object
   * TODO:  We should outsource this to a ColorTools class
   * @param {Number} _HUE the tunableWhite color (0..359)
   * @return {Object} a color object with 'white' and 'warmWhite' values
   */


  HUEToRGB(_HUE) {
    //var thisOffset = _HUE;
    //var angle = (thisOffset/300)*360;
    //var hslColor = "hsl("+ _HUE + ", 100%, 50%)";
    var rgbArray = this.hslToRgb(_HUE / 359, 1, 0.5);
    var color = new Object();
    color.red = rgbArray[0];
    color.green = rgbArray[1];
    color.blue = rgbArray[2];
    return color;
  } //https://github.com/Qix-/color-convert/blob/master/conversions.js

  /**
  * converts a hue integer to a rgb color object
  * TODO:  We should outsource this to a ColorTools class
  * @param {Number} _HUE the tunableWhite color (0..359)
  * @return {Object} a color object with 'white' and 'warmWhite' values
  */


  RGBToHUE(_color) {
    return this.rgbToHsl(_color.red, _color.green, _color.blue)[0] * 359;
  }

  rgbToHsl(r, g, b) {
    /*
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    let l = (min + max) / 2;
    let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return [h * 60, s, l];*/
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  hslToRgb(h, s, l) {
    /*
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let hp = h / 60.0;
    let x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb1;
    if (isNaN(h)) rgb1 = [0, 0, 0];
    else if (hp <= 1) rgb1 = [c, x, 0];
    else if (hp <= 2) rgb1 = [x, c, 0];
    else if (hp <= 3) rgb1 = [0, c, x];
    else if (hp <= 4) rgb1 = [0, x, c];
    else if (hp <= 5) rgb1 = [x, 0, c];
    else if (hp <= 6) rgb1 = [c, 0, x];
    let m = l - c * 0.5;
    return [
      Math.round(255 * (rgb1[0] + m)),
      Math.round(255 * (rgb1[1] + m)),
      Math.round(255 * (rgb1[2] + m))];
      */
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  /**
         * converts tuneable white value into a color object ('white', warmWhite')
         * TODO:  There may be better and correcter ways for converting, but for now we stick to this simple one
         *        We should outsource this to a ColorTools class
         * @param {Number} _tuneableWhite the tunableWhite color (0..254)
         * @return {Object} a color object with 'white' and 'warmWhite' values
         */


  tunableWhiteToColor(_tuneableWhite) {
    var color = new Object();

    if (_tuneableWhite >= 127) {
      color.warmwhite = _tuneableWhite;
      color.white = 127 - (_tuneableWhite - 127);
    } else {
      color.warmwhite = _tuneableWhite;
      color.white = 127 + (127 - _tuneableWhite);
    }

    return color;
  }
  /**
   * is called when the satte was updated by external functions
   */


  stateUpdatedFromExt() {
    // force a rerender of the state
    console.log("State UPDATED!!!"); //this.requestUpdate()
  }
  /**
   * is called whenever a slider value is changed by the user
   * it will handle the state update for the slider id for the element and also will trigger a
   * update to the noe habitat application
   * @param {Event} _e the range event
   */


  _onSliderValueChanged(_e) {
    var curValue = parseInt(_e.currentTarget.value);

    switch (_e.currentTarget.id.toUpperCase()) {
      // the tuned white value is from 0..254 and has to be converted to warmwhite and white values
      // which is done by the 'tunableWhiteToColor' method
      case 'TUNEDWHITE':
        this.habitatState.color = this.tunableWhiteToColor(curValue);
        break;
      // brightness value is 0..1 in floating point, so we have to divide the value we get from the
      // range control to have a maimum value of 1

      case 'BRIGHTNESS':
        this.habitatState.brightness = curValue / this.brightnessRange;
        break;
      // white value is 0..254
      // this is used on RGBW lamps

      case 'WHITE':
        this.habitatState.color.white = curValue;
        break;
      // red value is 0..254
      // this is used on RGBW lamps

      case 'RED':
        this.habitatState.color.red = curValue;
        break;
      // green value is 0..254

      case 'GREEN':
        this.habitatState.color.green = curValue;
        break;
      // blue value is 0..254

      case 'BLUE':
        this.habitatState.color.blue = curValue;
        break;
      // HUE Value

      case 'HUE':
        this.habitatState.color = this.HUEToRGB(curValue);
        break;
    } // a change of the slider control should update the state in the habitat app, for that we call
    // the updateHabitatNodeStateForElement method on the habitat client which will handle this
    // stuff for us


    habitatClient.updateHabitatNodeStateForElement(this);
  }
  /**
   * is called whenever a switch value is changed by the user
   * @param {Event} _e the checked event
   */


  _onSwitchValueChanged(_e) {
    switch (_e.currentTarget.id.toUpperCase()) {
      // the onOff switch does turn on and off the lamp
      case "ONOFF":
        if (this.habitatState.isOn != _e.currentTarget.checked) this.habitatState.isOn = _e.currentTarget.checked;
        break;
    } // a change of the switch control should update the state in the habitat app, for that we call
    // the updateHabitatNodeStateForElement method on the habitat client which will handle this
    // stuff for us


    habitatClient.updateHabitatNodeStateForElement(this);
  }
  /**
   * is called when the toggle settings button is clicked
   * @param {Event} _e the click event
   */


  _onToggleSettings(_e) {
    var element = this.shadowRoot.getElementById("settings");
    if (element.style.display == 'block') element.style.display = 'none';else element.style.display = 'block';
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

              ${this.lightType == "TW" || this.lightType == "RGBTW" ? html`
                <div class="colorSliderContainer">
                  <habitat-component-slider id="tunedWhite" min="0" max="254" gradient="TunableWhite" @change="${this._onSliderValueChanged}" .value=${this.colorToTunableWhite(this.habitatState.color)}></habitat-component-slider>
                </div>` : ''}

              ${this.lightType == "RGBW" ? html`
                <div class="colorSliderContainer">
                  <habitat-component-slider id="white" min="0" max="254" gradient="White" @change="${this._onSliderValueChanged}" .value=${this.habitatState.color.white}></habitat-component-slider>
                </div>` : ''}

              ${this.lightType == "RGB" || this.lightType == "RGBW" ? html`
                <div class="colorSliderContainer">
                  <habitat-component-slider id="hue" gradient="HUE" min="0" max="359" @change="${this._onSliderValueChanged}"  .value=${this.RGBToHUE(this.habitatState.color)}></habitat-component-slider>
                </div>` : ''}


              ${(this.lightType == "RGB" || this.lightType == "RGBW" || this.lightType == "RGBTW") && this.showIndividualColorSliders == true ? html`
                <div class="colorSliderContainer">
                  <habitat-component-slider id="red" min="0" max="254" gradient="Red" @change="${this._onSliderValueChanged}" .value=${this.habitatState.color.red}></habitat-component-slider>
                </div>
                <div class="colorSliderContainer">
                  <habitat-component-slider id="green" min="0" max="254" gradient="Green" @change="${this._onSliderValueChanged}" .value=${this.habitatState.color.green}></habitat-component-slider>
                </div>
                <div class="colorSliderContainer">
                  <habitat-component-slider id="blue" min="0" max="254" gradient="Blue" @change="${this._onSliderValueChanged}" .value=${this.habitatState.color.blue}></habitat-component-slider>
                </div>` : ''}


              <div class="colorSliderContainer">
                <habitat-component-slider id="brightness" min="0" .max=${this.brightnessRange} gradient="Brightness" @change="${this._onSliderValueChanged}" .value=${this.habitatState.brightness * this.brightnessRange}></habitat-component-slider>
              </div>

            </div>

          </div>
        `;
  }

}

customElements.define('habitat-thing-light-bar', HabitatComponent_Light_Bar);