
// http://jscolor.com/
//https://www.cssscript.com/demo/minimal-hsla-color-picker-pure-javascript/

// http://johndyer.name/lab/colorpicker/

// https://codepen.io/anon/pen/OajOOd


import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Basic_Slider extends LitElement {

      static get properties() {
        return {
          value : {type: Number},
          min : {type: Number},
          max : {type: Number},
          gradient : {type: String}
        }
      }

      constructor() {
        super()
        this.value = 0
        this.gradient = "Brightness"
        this.min = 0
        this.max = 254
      }


      // https://github.com/Polymer/lit-html/issues/145
      _onRangeChanged(_e)
      {
        this.value = _e.currentTarget.value
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
      }


      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.slider.css"/>
          <div class="back ${"gradient" + this.gradient}">
            <input name="" type="range" .min=${this.min} .max=${this.max} @change="${this._onRangeChanged}" .value=${this.value}>
          </div>
        `
      }

    }

    customElements.define('habitat-component-slider', HabitatComponent_Basic_Slider);