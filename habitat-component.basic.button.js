
import {LitElement, html} from '@polymer/lit-element';

    class HabitatComponent_Basic_Button extends LitElement {

      static get properties() {
        return {
          longPressClickInterval : {type: Number},
          longClickInterval : {type: Number},
        }
      }

      constructor() {
        super()
        this.longPressClickInterval = 0
        this.longPressClickIntervalTmp = 0
        this.longPressClickIntervalCount = 0
        this.longPressIntervalId = null
      }


      /**
       * dispatch the click event to the subscribers
       * @param {integer} _longPressClickIntervalCount a value which indicates (>0) if the click comes from an long click interval
       */
      dispatchClick(_longPressClickIntervalCount)
      {
        this.dispatchEvent(new CustomEvent('clicked', { detail: { count: _longPressClickIntervalCount} }));
      }


      buttonPressedInterval()
      {
        var self = this
        self.longPressClickIntervalCount++
        self.dispatchClick(self.longPressClickIntervalCount)

        self.longPressClickIntervalTmp -= self.longPressClickIntervalCount
        self.longPressClickIntervalTmp = self.longPressClickIntervalTmp < self.longPressClickInterval ? self.longPressClickInterval : self.longPressClickIntervalTmp

        clearInterval(self.longPressIntervalId)
        self.longPressIntervalId = setInterval(self.buttonPressedInterval.bind(this), self.longPressClickIntervalTmp)
      }


      /**
       * may be called by mousedown, touchstart, pointerdown event on the button itself
       * @param {_event} _e the event
       */
      _onDown(_e)
      {
        var self = this

        console.log(_e.type)

        // on a new down event we have to clear the exiating interval
        // in fact this should never be the case because the 'onUp' will clear the interval too
        if(self.longPressIntervalId)
          clearInterval(self.longPressIntervalId)

        // if the user presses the button and we do have some long click interval defined we
        // are starting a intervall which will trigger the clicked event, so the user can stay on the
        // button and the value will change. It's no science  but it does the job

        if(self.longPressClickInterval)
        {
          self.longPressClickIntervalCount = 0
          self.longPressClickIntervalTmp = self.longPressClickInterval * 4
          self.longPressIntervalId = setInterval(self.buttonPressedInterval.bind(this), self.longPressClickIntervalTmp)
        }

        /*
        self.longPressClickIntervalCount = 0
        self.longPressIntervalId = setInterval(function(){
          self.longPressClickIntervalCount++
          self.dispatchClick(self.longPressClickIntervalCount)
        }, self.longPressClickInterval)
        */

        // be sure we stop the propagation so that, if we are embedded in swipers, can use the button either way
        // another thing is that we call this method from multiple events (touch, mouseclick, ...) and it should only
        // be called once
       // _e.stopPropagation()
        _e.preventDefault()
      }


      /**
       * may be called by mouseup, touchend, pointerup event on the button itself
       * @param {_event} _e the event
       */
      _onUp(_e)
      {
        console.log(_e.type)

        // clear the intervall and dispacth the last click
        if(this.longPressIntervalId)
          clearInterval(this.longPressIntervalId)
        this.dispatchClick(this.longPressClickIntervalCount)
        this.longPressClickIntervalCount = 0

        //_e.stopPropagation()
        _e.preventDefault()
      }


      /**
       * this method is used to stop the propagation of the event.
       * this has be done for some events for some external reasons (embeddedin swipers aso...)
       * @param {_event} _e the event
       */
      _stopPropagation(_e)
      {
        console.log(_e.type)
        //  _e.stopPropagation()
        //_e.preventDefault()
      }

      /**
       * render
       * @return {html}
       */
      render() {
        return html`
          <link type="text/css" rel="stylesheet" href="habitat-component.basic.button.css"/>
          <button id="button" @pointerdown="${this._onDown}" @pointerup="${this._onUp}">
            <slot></slot>
          </button>
        `
      }

    }

    customElements.define('habitat-component-button', HabitatComponent_Basic_Button)