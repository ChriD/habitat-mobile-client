
import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Basic_Button extends LitElement {

      static get properties() {
        return {
        }
      }

      constructor() {
        super()
      }


      // events:
      // click
      // longClick

      // when the button is hold, we do trigger the event 'buttonHold' with a predefined period

      _onPointerDown(_e)
      {
        console.log("DOWN")
        // TODO: start intervall while the pointer is down
        _e.stopPropagation()
      }


      _onPointerUp(_e)
      {
        console.log("UP")
        this.dispatchEvent(new CustomEvent('click', { detail: 0 }));
        _e.stopPropagation()
      }

      _stopPropagation(_e)
      {
        console.log("STOP")
        _e.stopPropagation()
      }


      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.button.css"/>
          <button id="button" @pointerdown="${this._onPointerDown}" @pointerup="${this._onPointerUp}" @mousedown="${this._onPointerDown}" @mouseup="${this._onPointerUp}" @touchstart="${this._onPointerDown}" @touchend="${this._onPointerUp}"  @click="${this._stopPropagation}">
            <slot></slot>
          </button>
        `
      }

    }

    customElements.define('habitat-component-button', HabitatComponent_Basic_Button)