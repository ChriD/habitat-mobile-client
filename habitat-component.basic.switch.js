
import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Basic_Switch extends LitElement {

      static get properties() {
        return {
          checked : {type: Boolean}
        }
      }

      constructor() {
        super()
        this.checked = false
      }

      _onCheckedChanged(_e)
      {
        this.checked = _e.currentTarget.checked
        this.dispatchEvent(new CustomEvent('change', { detail: this.checked }));
      }


      // https://materialdesignicons.com/
      // https://jasonette.com/

      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.switch.css"/>
          <label class="toggle-check">
            <input type="checkbox" class="toggle-check-input" @click="${this._onCheckedChanged}" .checked=${this.checked}>
            <span class="toggle-check-text"></span>
          </label>
        `
      }

    }

    customElements.define('habitat-component-switch', HabitatComponent_Basic_Switch);