/*!
 * jquery.daterangepicker
 * Copyright 2012, TAKAYUKI SUGITA (sugilog)
*/
(function($) {
var daterangepicker = {}
daterangepicker.weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

$.fn.daterangepickerOpen = function(options) {
  $(this).daterangepicker(options);
}
$.fn.daterangepickerClose = function() {
  $(this).html("");
}
$.fn.daterangepickerToggle = function(options) {
  if ($(this).html() === "") {
    $(this).daterangepickerOpen(options);
  }
  else {
    $(this).daterangepickerClose();
  }
}
$.fn.daterangepicker = function(options) {
  var calendar = {
    create: function(date, type) {
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;

      return $("<table>")
        .addClass("daterangepicker_calendar")
        // FIXME: do not keep year month as class
        .addClass(year + "_" + month)
        .append(calendar.row.header(year, month))
        .append(calendar.row.dayname())
        .append(calendar.row.dates(year, month, type));
    },
    row: {
      header: function(year, month) {
        return $("<tr>").addClass("daterangepicker_month")
          .append($("<td>").addClass("daterangepicker_previous_month").append(this.link("<<")))
          // TODO: year month selector
          .append($("<td>").addClass("daterangepicker_current_month").prop("colspan", 5).text(year + "/" + month))
          .append($("<td>").addClass("daterangepicker_next_month").append(this.link(">>")));
      },
      dayname: function() {
        var row = $("<tr>").addClass("daterangepicker_dayname");
        $.each(daterangepicker.weekdays, function(idx, day){
          // FIXME: do not keep day as class
          row.append($("<td>").addClass("daterangepicker_" + day).text(day));
        });
        return row;
      },
      dates: function(year, month, type) {
        var dateRows = new Array();
        var weeks = -1;
        var range = dateUtil.range(dateUtil.beginningOfCalendar(year, month), dateUtil.endOfCalendar(year, month));

        $.each(range, function(idx, date) {
          if (date.getDay() === 0) {
            weeks++;
            dateRows[weeks] = $("<tr>").addClass("daterangepicker_week");
          }

          var d = $("<td>")
          if (dateUtil.inMonth(date, year, month)) {
            // FIXME: do not keep day as class
            d.addClass("daterangepicker_date").prop("id", "date_" + type + "_" + dateUtil.format(date, "_"));
            d.append(calendar.row.link(date.getDate()));
          }

          dateRows[weeks].append(d);
        })

        var dates = $("<tbody>");
        for (var i = 0; i < dateRows.length; i++) {
          dates.append(dateRows[i]);
        }

        return dates;
      },
      link: function(text) {
        return $("<a>").prop("href", "#").css({display: "block"}).text(text);
      }
    },
    setCurrent: function(newDate, type) {
      // FIXME: change date judging
      if (/([0-9]+)_([0-9]+)/.test($("." + daterangepickerWrapper[type] + " table.daterangepicker_calendar").prop("class"))) {
        var year  = parseInt(RegExp.$1);
        var month = parseInt(RegExp.$2);

        if (newDate.getYear() + 1900 !== year || newDate.getMonth() + 1 !== month) {
          $("." + daterangepickerWrapper[type]).html(calendar.create(new Date(year, month - 1, 1), type));
        }
      }

      // FIXME: change date judging
      $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).removeClass("current_selection");
      daterange[type] = newDate;
      // FIXME: change date judging
      $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).addClass("current_selection");
      $("#" + daterangeFields[type]).val(dateUtil.format(daterange[type], "/"));
    },
    setRange: function() {
      $.each(["from", "to"], function(idx, type) {
        jQuery("." + daterangepickerWrapper[type]).find("td.daterangepicker_date").each(function(idx, td) {
          // FIXME: change date judging
          if (/^date_(from|to)_([0-9_]+)$/.test(td.id)) {
            var tdDate = new Date(RegExp.$2.replace(/_/g, "/"));

            if (dateUtil.inRange(tdDate, daterange["from"], daterange["to"]) && !$(td).hasClass("current_selection")) {
              $(td).addClass("current_range");
            }
            else {
              $(td).removeClass("current_range")
            }
          }
          else {
            $(td).removeClass("current_range")
          }
        });
      });
    }
  }

  var dateUtil = {
    range: function(from, to) {
      var days = new Array();
      var day;

      if (from < to) {
        day = from;
      }
      else {
        day = to;
        to = from;
      }

      while(day <= to) {
        days.push(new Date(day.getTime()));
        day = this.since(day, 1);
      }

      return days;
    },
    beginningOfMonth: function(year, month) {
      return new Date(year, (month - 1), 1);
    },
    endOfMonth: function(year, month) {
      // DO NOT: month - 1
      return new Date(year, month, 0);
    },
    previousMonth: function(year, month) {
      if (month.toString() === "1") {
        return new Date(parseInt(year) - 1, 12 - 1);
      }
      else {
        return new Date(year, parseInt(month) - 2);
      }
    },
    nextMonth: function(year, month) {
      if (month.toString() === "12") {
        return new Date(parseInt(year) + 1, 1 - 1);
      }
      else {
        return new Date(year, month);
      }
    },
    beginningOfCalendar: function(year, month) {
      var base = this.beginningOfMonth(year, month);

      if (base.getDay() > 0) {
        return this.ago(base, base.getDay());
      }
      else {
        return base;
      }
    },
    endOfCalendar: function(year, month) {
      var base = this.endOfMonth(year, month);

      if (base.getDay() < 6) {
        return this.since(base, 6 - base.getDay());
      }
      else {
        return base;
      }
    },
    ago: function(base, days) {
      base.setTime(base.getTime() - days * 86400000);
      return base;
    },
    since: function(base, days) {
      base.setTime(base.getTime() + days * 86400000);
      return base;
    },
    inMonth: function(date, year, month) {
      return (date.getYear() + 1900) === year && (date.getMonth() + 1) === month;
    },
    inRange: function(baseDate, fromDate, toDate) {
      return fromDate.getTime() <= baseDate.getTime() && toDate.getTime() >= baseDate.getTime();
    },
    parse: function(dateString) {
      return new Date(dateString.replace(/(_|\.)/g, "/"));
    },
    format: function(date, separator) {
      y = (date.getYear() + 1900).toString();
      m = (date.getMonth() + 1).toString();
      d = date.getDate().toString();

      if (m < 10) { m = "0" + m.toString(); }
      if (d < 10) { d = "0" + d.toString(); }

      return [y, m, d].join(separator || "/");
    },
  };

  var presets = {
    create: function(presetsList) {
      if (typeof presetsList === "undefined") {
        presetsList = [];
      }

      var tbody = $("<tbody>").append(
        $("<tr>").addClass("daterangepicker_preset_header")
          .append($("<td>").text("presets"))
      );

      $.each(presetsList, function(idx, preset) {
        tbody.append(
          $("<tr>").append(
            $("<td>").addClass("daterangepicker_preset_item").addClass("range_" + preset.range)
              .append($("<a>").css({display: "block"}).prop("href", "#").text(preset.label))
          )
        )
      });

      $(".daterangepicker_preset_item a").live("click", function() {
          // FIXME: change date judging
        if (/range_([0-9_\/]*)-([0-9_\/]*)/.test($(this).closest("td").prop("class"))) {
          var range = {
            from: new Date(RegExp.$1),
            to:   new Date(RegExp.$2)
          }

          $.each(["from", "to"], function(idx, type) {
            calendar.setCurrent(range[type], type);
          });
          calendar.setRange();
        }

        return false;
      });

      return $("<table>").addClass("daterangepicker_preset").append(tbody);
    }
  }

  if (typeof options === "undefined") {
    options = {};
  }

  var daterangeFields = {
    from: (options.daterangeFrom || "daterange_from"),
    to:   (options.daterangeTo   || "daterange_to")
  };

  var daterangepickerWrapper = {
    from: "daterangepicker_widget_calendar_from",
    to:   "daterangepicker_widget_calendar_to"
  }

  var daterange = {};

  $.each(["from", "to"], function(idx, type) {
    if ($("#" + daterangeFields[type]).val() === "") {
      daterange[type] = new Date();
    }
    else {
      daterange[type] = new Date($("#" + daterangeFields[type]).val());
    }
  });

  $(this).append(
    $("<table>").addClass("daterangepicker_widget")
      .append(
        $("<tr>")
          .append($("<td>").css({verticalAlign: "top"}).append($("<div>").addClass("daterangepicker_widget_calendar_from").append(calendar.create(daterange.from, "from"))))
          .append($("<td>").css({verticalAlign: "top"}).append($("<div>").addClass("daterangepicker_widget_calendar_to").append(calendar.create(daterange.to, "to"))))
          .append($("<td>").css({verticalAlign: "top"}).addClass("daterangepicker_widget_presets").append(presets.create(options.presets)))
      )
  );
  calendar.setCurrent(daterange.from, "from");
  calendar.setCurrent(daterange.to, "to");
  calendar.setRange();


  $(".daterangepicker_date a").live("click", function() {
    // FIXME: change date judging
    if ((/^date_(from|to)_([0-9_]+)$/).test($(this).closest("td").prop("id"))) {
      var type = RegExp.$1;
      var date = dateUtil.parse(RegExp.$2);
      $("#" + daterangeFields[type]).val(dateUtil.format(date));

      calendar.setCurrent(date, type);
      calendar.setRange()
    }

    return false;
  });



  $(".daterangepicker_previous_month a").live("click", function() {
    if (/^daterangepicker_widget_calendar_(from|to)$/.test($(this).closest("div").prop("class"))) {
      var type = RegExp.$1;
      var currentMonth = $(this).closest("div").find(".daterangepicker_current_month").text();
      var previousMonth = dateUtil.previousMonth(currentMonth.split("/")[0], currentMonth.split("/")[1]);
      $(this).closest("div").html(calendar.create(previousMonth, type));
      calendar.setCurrent(daterange[type], type);
      calendar.setRange()
    }

    return false;
  })

  $(".daterangepicker_next_month a").live("click", function() {
    if (/^daterangepicker_widget_calendar_(from|to)$/.test($(this).closest("div").prop("class"))) {
      var type = RegExp.$1;
      var currentMonth = $(this).closest("div").find(".daterangepicker_current_month").text();
      var nextMonth = dateUtil.nextMonth(currentMonth.split("/")[0], currentMonth.split("/")[1]);
      $(this).closest("div").html(calendar.create(nextMonth, type));
      calendar.setCurrent(daterange[type], type);
      calendar.setRange()
    }

    return false;
  })
};
})(jQuery);
