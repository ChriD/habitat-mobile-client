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
      type: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.habitatState = {};
    this.habitatState.isOn = false;
    this.type = "TW"; // TW ... Tunable White
  }

  _onCheckedChanged(_e) {
    if (this.habitatState.isOn != _e.currentTarget.checked) {
      this.habitatState.isOn = _e.currentTarget.checked;
      habitatClient.updateHabitatNodeStateForElement(this);
    }
  }

  colorToTunableWhite(_color) {
    return _color.warmwhite;
  }

  tunableWhiteToColor(_tunableWhite) {
    var color = new Object();

    if (_tunableWhite >= 127) {
      color.warmwhite = _tunableWhite;
      color.white = 127 - (_tunableWhite - 127);
    } else {
      color.warmwhite = _tunableWhite;
      color.white = 127 + (127 - _tunableWhite);
    }

    return color;
  } // TODO: color to wharwhite and elsewhat


  _onSliderChanged(_e) {
    var curValue = parseInt(_e.currentTarget.value);
    if (_e.currentTarget.id == 'tunedWhite') this.habitatState.color = this.tunableWhiteToColor(curValue);
    if (_e.currentTarget.id == 'white') this.habitatState.color.white = curValue;
    if (_e.currentTarget.id == 'warmwhite') this.habitatState.color.warmwhite = curValue;
    if (_e.currentTarget.id == 'red') this.habitatState.color.red = curValue;
    if (_e.currentTarget.id == 'green') this.habitatState.color.green = curValue;
    if (_e.currentTarget.id == 'blue') this.habitatState.color.blue = curValue;
    habitatClient.updateHabitatNodeStateForElement(this);
  }

  _onToggleSettings(_e) {
    var element = this.shadowRoot.getElementById("settings");
    if (element.style.display == 'block') element.style.display = 'none';else element.style.display = 'block';
  } //TODO: @@@ we have to use event or something like this instead of @click

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
                <habitat-component-switch id="switch" @click="${this._onCheckedChanged}" .checked=${this.habitatState.isOn} ></habitat-component-switch>
                <label for="switch">${this.label}</label>
              </div>
              <div class="right" @click="${this._onToggleSettings}">
                <img src="tune.svg" style="margin: auto;">
              </div>
            </div>

            <div class="flex" id="settings" style="display: none;">

              <div class="colorSliderContainer">
                <habitat-component-slider id="tunedWhite" gradient="TunableWhite" @change="${this._onSliderChanged}" value=${this.colorToTunableWhite(this.habitatState.color)}></habitat-component-slider>
              </div>

              <div class="colorSliderContainer">
                <habitat-component-slider id="brightness" gradient="Brightness" @change="${this._onSliderChanged}" value=${this.habitatState.color.white}></habitat-component-slider>
              </div>

            </div>

          </div>
        `;
  }

}

customElements.define('habitat-thing-light-bar', HabitatComponent_Light_Bar);