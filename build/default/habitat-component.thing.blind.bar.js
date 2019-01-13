// TODO: Use molecule?!
import { LitElement, html } from "./node_modules/@polymer/lit-element/lit-element.js";

class HabitatComponent_Blind_Bar extends LitElement {
  static get properties() {
    return {
      habitatState: {
        type: Object
      },
      label: {
        type: String
      },
      blindType: {
        type: String
      }
    };
  }

  constructor() {
    super(); // set some default values for the element to be sure there are no problems when
    // there is no state given from external

    this.habitatState = {};
    this.habitatState.blindPosition = 0;
    this.habitatState.blindDegree = 0; // the element has a type which blind it is
    // ROLLERBLIND    ... Roller Blind
    // EXTERNALBLIND  ... External Blind

    this.blindType = "ROLLERBLIND";
  }
  /**
   * is called when the toggle settings button is clicked
   * @param {Event} _e the click event
   */


  _onToggleSettings(_e) {
    var element = this.shadowRoot.getElementById("settings");
    if (element.style.display == 'block') element.style.display = 'none';else element.style.display = 'block';
  }
  /**
   * is called whenever a button is clicked on this element
   * @param {Event} _e the click event
   */


  _onButtonClick(_e) {
    switch (_e.currentTarget.dataset.context.toUpperCase()) {
      case "BLINDPOSITION":
        this.habitatState.blindPosition = parseFloat(_e.currentTarget.dataset.value);
        habitatClient.updateHabitatNodeStateForElement(this, {
          blindPosition: this.habitatState.blindPosition
        });
        break;

      case "BLINDDEGREE":
        this.habitatState.blindDegree = parseFloat(_e.currentTarget.dataset.value);
        habitatClient.updateHabitatNodeStateForElement(this, {
          blindDegree: this.habitatState.blindDegree
        });
        break;
    }
  }

  render() {
    return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.bar.css"/>
          <link type="text/css" rel="stylesheet" href="habitat-component.thing.blind.bar.css"/>

          <div class="container">
            <div class="flex">
              <div class="left">
                ${this.habitatState.blindPosition}  ${this.habitatState.blindDegree}
                <label for="switch">${this.label}</label>
              </div>
              <div class="right" @click="${this._onToggleSettings}">
                <img src="tune.svg" style="margin: auto;">
              </div>
            </div>


            <div class="flex" id="settings" style="display: none;">
              <div class="flex buttons">
                <div class="column info">↕</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindPosition" data-value="0">0%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindPosition" data-value="25">25%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindPosition" data-value="50">50%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindPosition" data-value="75">75%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindPosition" data-value="100">100%</div>
              </div>

              ${this.blindType == "EXTERNALBLIND" ? html`
              <div class="flex buttons">
                <div class="column info">°</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindDegree" data-value="0">0%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindDegree" data-value="25">25%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindDegree" data-value="50">50%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindDegree" data-value="75">75%</div>
                <div class="column button" @click="${this._onButtonClick}" data-context="blindDegree" data-value="100">100%</div>
              </div>` : ''}

            </div>



          </div>
        `;
  }

}

customElements.define('habitat-thing-blind-bar', HabitatComponent_Blind_Bar);