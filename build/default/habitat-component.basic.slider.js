// http://jscolor.com/
//https://www.cssscript.com/demo/minimal-hsla-color-picker-pure-javascript/
// http://johndyer.name/lab/colorpicker/
import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";

class HabitatComponent_Basic_Slider extends LitElement {
  static get properties() {
    return {
      value: {
        type: Number
      },
      gradient: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.gradient = "Brightness";
  } // https://github.com/Polymer/lit-html/issues/145


  _onRangeChanged(_e) {
    this.value = _e.currentTarget.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: this.value
    }));
  }

  render() {
    return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.slider.css"/>
          <div class="light ${"gradient" + this.gradient}">
            <input name="light" type="range" min="0" max="254" @change="${this._onRangeChanged}" value=${this.value}>
          </div>

        `;
  }

}

customElements.define('habitat-component-slider', HabitatComponent_Basic_Slider);