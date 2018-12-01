// http://jscolor.com/
//https://www.cssscript.com/demo/minimal-hsla-color-picker-pure-javascript/
// http://johndyer.name/lab/colorpicker/
// https://codepen.io/anon/pen/OajOOd
import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";

class HabitatComponent_Basic_Slider extends LitElement {
  static get properties() {
    return {
      value: {
        type: Number
      },
      min: {
        type: Number
      },
      max: {
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
    this.min = 0;
    this.max = 254;
  } // https://github.com/Polymer/lit-html/issues/145


  _onRangeChanged(_e) {
    this.value = _e.currentTarget.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: this.value
    }));
  }

  _onButtonClick(_e) {
    // change value if button was clicked, we start
    if (parseInt(_e.currentTarget.dataset.direction) > 0) {
      this.value += 5;
      this.value > this.max ? this.value = this.max : this.value;
    } else {
      this.value -= 5;
      this.value < this.min ? this.value = this.min : this.value;
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.value
    }));
  }

  _stopPropagation(_e) {
    _e.stopPropagation();
  }

  render() {
    return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.slider.css"/>
          <div class="slider">
            <habitat-component-button class="button left" data-direction="-1" @click="${this._onButtonClick}">-</habitat-component-button>
            <div class="back ${"gradient" + this.gradient}">
              <input name="" type="range" .min=${this.min} .max=${this.max} @pointerdown="${this._stopPropagation}" @pointerup="${this._stopPropagation}" @click="${this._stopPropagation}" @touchstart="${this._stopPropagation}" @mousedown="${this._stopPropagation}" @mousemove="${this._stopPropagation}" @touchmove="${this._stopPropagation}" @change="${this._onRangeChanged}" .value=${this.value}>
            </div>
            <habitat-component-button class="button right" data-direction="1" @click="${this._onButtonClick}">+</habitat-component-button>
          </div>
        `;
  }

}

customElements.define('habitat-component-slider', HabitatComponent_Basic_Slider);