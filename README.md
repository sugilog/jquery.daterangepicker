jquery.daterangepicker
========================================

jquery plugin for daterange UI selectable widget


Options
------------------------------------------------------------
<dl>
  <dt>daterangeFrom</dt>
  <dd>
    [String] selector (optional when wrap inputs)
  </dd>
  <dt>daterangeTo</dt>
  <dd>
    [String] selector (optional when wrap inputs)
  </dd>
  <dt>daterangeStartAt</dt>
  <dd>
    [number] day of week in number, default: 0 (Sunday)
  </dd>
  <dt>display</dt>
  <dd>
    [String] "fixed" or default(float style)
  </dd>
  <dt>presets</dt>
  <dd>
    [Array]  items should be set as Hash (label and range(date-date))
  </dd>
  <dt>widgetArea</dd>
  <dd>
    [String] selector; define widget area not to include widget close area
  </dd>
  <dt>extraButton</dt>
  <dd>
    [-] container of button settings
  </dd>
  <dt>extraButton.close</dt>
  <dd>
    [String] label of close button to close widget (default: undefined => hide close button)
  </dd>
  <dt>extraButton.blank</dt>
  <dd>
    [String] label of blank button to blank fields (default: undefined => hide blank button)
  </dd>
  <dt>extraButton.fromNull</dt>
  <dd>
    [String] label of fromNull button to blank "from field" and assign none to assigned "to date" (default: undefined => hide fromNull button)
  </dd>
  <dt>extraButton.toNull</dt>
  <dd>
    [String] label of toNull button to blank "to field" and assign assigned "from date" to none (default: undefined => hide toNull button)
  </dd>
</dl>

Callbacks
------------------------------------------------------------
set as options

<dl>
  <dt>onPick</dt>
  <dd>
    [function] callback on pick(click) date item.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] daterangepicker caller.
      </dd>
      <dt>arguments</dt>
      <dd>
        [Object (hash)] changed date set: key has "from" or "to", and value has Date object.
      </dd>
    </dl>
  </dd>
  <dt>onPickPreset</dt>
  <dd>
    [function] callback on pick(click) preset item.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] daterangepicker caller.
      </dd>
      <dt>arguments</dt>
      <dd>
        [Object (hash)] changed date set: key has "from" and "to", and value has each Date objects.
      </dd>
    </dl>
  </dd>
  <dt>onPickBlank</dt>
  <dd>
    [function] callback on pick(click) extraButton blank item.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] daterangepicker caller.
      </dd>
      <dt>arguments</dt>
      <dd>
        none
      </dd>
    </dl>
  </dd>
  <dt>onPickFromNull, onPickToNull</dt>
  <dd>
    [function] callback on pick(click) extraButton fromNull/toNull item.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] daterangepicker caller.
      </dd>
      <dt>arguments</dt>
      <dd>
        none
      </dd>
    </dl>
  </dd>
</dl>


example (using wrap selector of daterangepicker and inputs:

    $(icon_for_daterangepicker).click(function() {
      $(wrap_selector_of_daterangepicker_and_inputs).daterangepickerToggle({
        // daterangeFrom: "#daterange_from",
        // daterangeTo:   "#daterange_to",
        // daterangeStartAt: 1,
        // display:       "fixed",
        presets: [
          {label: "January",   range: "2012/01/01-2012/01/31"},
          {label: "February",  range: "2012/02/01-2012/02/29"},
          {label: "March",     range: "2012/03/01-2012/03/31"},
          {label: "This Year", range: "2012/01/01-2012/12/31"}
        ]
      });
    });

example (using callback):

    $(icon_for_daterangepicker).click(function() {
      $(wrap_selector_of_daterangepicker_and_inputs).daterangepickerToggle({
        // daterangeFrom: "#daterange_from",
        // daterangeTo:   "#daterange_to",
        // daterangeStartAt: 1,
        // display:       "fixed",
        presets: [
          {label: "January",   range: "2012/01/01-2012/01/31"},
          {label: "February",  range: "2012/02/01-2012/02/29"},
          {label: "March",     range: "2012/03/01-2012/03/31"},
          {label: "This Year", range: "2012/01/01-2012/12/31"}
        ],
        extraButton: {
          blank: "BLANK",
          close: "CLOSE",
          fromNull: "FROM NULL",
          toNull:   "TO NULL"
        },
        onPick: function(){
          // some function
        },
        onPickPreset: function(){
          // some function
          // close
          $(this).daterangepickerClose();
        },
        onPickBlank: function(){
          // some function
          // close
          $(this).daterangepickerClose();
        },
        onPickFromNull: function(){
          // some function
          // close
          $(this).daterangepickerClose();
        },
        onPicktoNull: function(){
          // some function
          // close
          $(this).daterangepickerClose();
        }
      });
    });

to know more usage, please see the sample.html and its source


Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
