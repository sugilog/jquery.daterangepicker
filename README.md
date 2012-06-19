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
  <dt>extraButton.close</dt>
  <dd>
    [String] label of blank button to blank fields and close widget (default: undefined => hide blank button)
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


to know more usage, please see the sample.html and its source


Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
