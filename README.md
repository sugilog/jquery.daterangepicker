jquery.daterangepicker
========================================

jquery plugin for daterange UI selectable widget


Options
------------------------------------------------------------
- daterangeFrom
  - [String] selector (optional when wrap inputs)
- daterangeTo
  - [String] selector (optional when wrap inputs)
- daterangeStartAt
  - [number] day of week in number, default: 0 (Sunday)
- display
  - [String] "fixed" or default(float style)
- presets
  - [Array]  items should be set as Hash (label and range(date-date))
- widgetArea
  define widget area not to include widget close area


Example
------------------------------------------------------------

- input#daterange_from and input#daterange_to
- div#daterangepicker wrap these inputs

- no need to define From and To selectors

JavaScript:

    $("#datetimerangepicker_icon").click(function() {
      $("#daterangepicker").daterangepickerToggle({
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


- input#daterange_from and input#daterange_to
- div#daterangepicker

JavaScript:

    $("#datetimerangepicker_icon").click(function() {
      $("#daterangepicker").daterangepickerToggle({
        daterangeFrom: "#daterange_from",
        daterangeTo:   "#daterange_to",
        // daterangeStartAt: 1,
        // display:       "fixed",
        presets: [
          {label: "January",   range: "2012/01/01-2012/01/31"},
          {label: "February",  range: "2012/02/01-2012/02/29"},
          {label: "March",     range: "2012/03/01-2012/03/31"},
          {label: "This Year", range: "2012/01/01-2012/12/31"}
        ],
        // widgetArea: "selector"
      });
    });


Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
