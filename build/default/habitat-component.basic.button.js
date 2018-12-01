import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";

class HabitatComponent_Basic_Button extends LitElement {
  static get properties() {
    return {
      logClickInterval: {
        type: Number
      }
    };
  }

  constructor() {
    super();
    this.logClickInterval = 150;
    this.intervalCount = 0;
    this.intervalId = null;
  }

  dispatchClick(_intervalCount) {
    this.dispatchEvent(new CustomEvent('click', {
      detail: {
        count: _intervalCount
      }
    }));
  } // events:
  // click
  // longClick
  // when the button is hold, we do trigger the event 'buttonHold' with a predefined period
  // TODO: prevent double calling from vents!!!!!


  _onDown(_e) {
    var self = this;
    if (self.intervalId) clearInterval(self.intervalId);
    self.intervalCount = 0;
    self.intervalId = setInterval(function () {
      self.intervalCount++;
      console.log("Click:" + self.intervalCount.toString());
      self.dispatchClick(self.intervalCount);
    }, self.logClickInterval);

    _e.stopPropagation();

    _e.preventDefault();
  }

  _onUp(_e) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.dispatchClick(self.intervalCount);
    this.intervalCount = 0;

    _e.stopPropagation();

    _e.preventDefault();
  }

  _stopPropagation(_e) {
    _e.stopPropagation();
  }

  render() {
    return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.button.css"/>
          <button id="button" @pointerdown="${this._onDown}" @pointerup="${this._onUp}" @mousedown="${this._onDown}" @mouseup="${this._onUp}" @touchstart="${this._onDown}" @touchend="${this._onUp}"  @click="${this._stopPropagation}">
            <slot></slot>
          </button>
        `;
  }

}

customElements.define('habitat-component-button', HabitatComponent_Basic_Button);