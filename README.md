daterangepicker
========================================

jquery plugin for daterange UI selectable widget

options
------------------------------------------------------------
- daterangeFrom
  - [String] selector
- daterangeTo
  - [String] selector
- display
  - [String] "fixed" or default(float style)
- presets
  - [Array]  items should be set as Hash (label and range(date-date))

Example
------------------------------------------------------------

- input#daterange_from and input#daterange_to
- div#daterangepicker

JavaScript:

    $("#datetimerangepicker_icon").click(function() {
      $("#daterangepicker").daterangepickerToggle({
        daterangeFrom: "#daterange_from",
        daterangeTo:   "#daterange_to",
        // display:       "fixed",
        presets: [
          {label: "January",   range: "2012/01/01-2012/01/31"},
          {label: "February",  range: "2012/02/01-2012/02/29"},
          {label: "March",     range: "2012/03/01-2012/03/31"},
          {label: "This Year", range: "2012/01/01-2012/12/31"}
        ]
      });
    });


