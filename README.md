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

sample:

  <!DOCYTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <script type="text/javascript" src="./javascript/jquery-1.7.1.min.js"></script>
      <script type="text/javascript" src="./javascript/jquery.daterangepicker.js"></script>
      <link type="text/css" rel="stylesheet" media="all" href="./stylesheet/jquery.daterangepicker.css"></script>
    </head>
    <body>
      from <input type="text" id="daterange_from" value="2012/01/12" />
      &nbsp;-&nbsp;
      to <input type="text" id="daterange_to" />
      &nbsp;
      <a href="#" id="datetimerangepicker_icon"><img src="./image/calendar.png" /></a>
      
      <div id="daterangepicker"></div>
      <br />
      <span>click calendar icon to open calendar widget</span>
      <script type="text/javascript">
        <!--
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
        -->
      </script>
    </body>
  </html>


