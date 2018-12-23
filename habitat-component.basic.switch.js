
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
        console.log(_e.type)
        this.checked = _e.currentTarget.checked
        this.dispatchEvent(new CustomEvent('changed', { detail: this.checked }))
        //_e.preventDefault()
      }

      _onCLick(_e)
      {
        console.log(_e.type)
        //_e.stopPropagation()
      }

      _onT(_e)
      {
        console.log(_e.type)
        this.checked = !this.checked
        var element =  this.shadowRoot.getElementById("switchCB")
        element.checked = this.checked
        this.dispatchEvent(new CustomEvent('changed', { detail: this.checked }))
        _e.stopPropagation()
        _e.preventDefault()
      }


      // https://materialdesignicons.com/
      // https://jasonette.com/

        // uses BAD workaround!!!!!
      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.switch.css"/>
          <label class="toggle-check" @touchstart="${this._onT}">
            <input id="switchCB" type="checkbox" class="toggle-check-input" .checked=${this.checked}>
            <span class="toggle-check-text"></span>
          </label>

        `
      }

    }

    customElements.define('habitat-component-switch', HabitatComponent_Basic_Switch);