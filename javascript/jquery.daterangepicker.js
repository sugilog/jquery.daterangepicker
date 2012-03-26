/*!
 * jquery.daterangepicker
 * Copyright 2012, TAKAYUKI SUGITA (sugilog)
*/
(function($) {
var daterangepicker = {
  weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fields: {
    from: "#daterange_from",
    to:   "#daterange_to"
  },
  exists: function() {
    return (typeof $("table.daterangepicker_widget").get(0) !== "undefined");
  }
};

$.fn.daterangepickerOpen = function(options) {
  $(this).daterangepicker(options);
};
$.fn.daterangepickerClose = function() {
  $(this).find("table.daterangepicker_widget").remove();
  $(daterangepicker.fields.from).off("blur.daterangepicker");
  $(daterangepicker.fields.to).off("blur.daterangepicker");
};
$.fn.daterangepickerToggle = function(options) {
  if (daterangepicker.exists()) {
    $(this).daterangepickerClose();
  }
  else {
    $(this).daterangepickerOpen(options);
  }
};
$.fn.daterangepicker = function(options) {
  var calendar = {
    create: function(date, type) {
      var year  = date.getFullYear();
      var month = date.getMonth() + 1;

      return $("<table>")
        .addClass("daterangepicker_calendar")
        .append(calendar.row.header(year, month))
        .append(calendar.row.dayname())
        .append(calendar.row.dates(year, month, type))
        .data("daterangeDate", {year: year, month: month});
    },
    row: {
      header: function(year, month) {
        return $("<tr>").addClass("daterangepicker_month")
          .append($("<td>").addClass("daterangepicker_previous_month").append(this.link("<<")))
          // TODO: year month selector
          .append($("<td>").addClass("daterangepicker_current_month").prop("colspan", 5).append(this.link(year + "/" + month)))
          .append($("<td>").addClass("daterangepicker_next_month").append(this.link(">>")));
      },
      dayname: function() {
        var row = $("<tr>").addClass("daterangepicker_dayname");
        $.each(daterangepicker.weekdays, function(idx, day){
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
            d.addClass("daterangepicker_date")
              .prop("id", "date_" + type + "_" + dateUtil.format(date, "_"))
              .data("daterangeDate", {year: year, month: month, day: date.getDate()})
              .data("daterangeType", type);
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
    setCurrent: function(newDate, type, options) {
      if (typeof options === "undefined") {
        options = {switchCalendar: true};
      }

      currentDate = $("." + daterangepickerWrapper[type] + " table.daterangepicker_calendar").data().daterangeDate;

      if (options.switchCalendar) {
        if (newDate.getFullYear() !== currentDate.year || newDate.getMonth() + 1 !== currentDate.month) {
          $("." + daterangepickerWrapper[type]).html(calendar.create(newDate, type));
        }
      }

      $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).removeClass("current_selection");
      daterange[type] = newDate;
      $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).addClass("current_selection");
      // TODO: date format
      $(daterangepicker.fields[type]).val(dateUtil.format(daterange[type], "/"));
    },
    setRange: function() {
      $.each(["from", "to"], function(idx, type) {
        jQuery("." + daterangepickerWrapper[type]).find("td.daterangepicker_date").each(function(idx, td) {
          var tdDate = dateUtil.init($(td).data().daterangeDate);

          if (dateUtil.inRange(tdDate, daterange["from"], daterange["to"]) && !$(td).hasClass("current_selection")) {
            $(td).addClass("current_range");
          }
          else {
            $(td).removeClass("current_range")
          }
        });
      });
    }
  };

  var monthSelector = {
    create: function(year, type) {
      return $("<table>")
        .addClass("daterangepicker_calendar")
        .append(monthSelector.row.header(year))
        .append(monthSelector.row.months(year, type))
        .data("daterangeDate", {year: year});
    },
    row: {
      header: function(year, month) {
        return $("<tr>").addClass("daterangepicker_year")
          .append($("<td>").addClass("daterangepicker_previous_year").append(this.link("<<")))
          .append($("<td>").addClass("daterangepicker_current_year").prop("colspan", 2).text(year))
          .append($("<td>").addClass("daterangepicker_next_year").append(this.link(">>")));
      },
      months: function(year, type) {
        var monthRows = new Array();
        var row = -1;

        $.each(daterangepicker.months, function(idx, month) {
          if (idx % 4 === 0) {
            row++;
            monthRows[row] = $("<tr>").addClass("daterangepicker_months_row");
          }

          var d = $("<td>")
          d.addClass("daterangepicker_month_select")
            .prop("id", "month_" + type + "_" + (idx + 1))
            .data("daterangeDate", {year: year, month: idx + 1})
            .data("daterangeType", type);
          d.append(monthSelector.row.link(month));

          monthRows[row].append(d);
        })

        var months = $("<tbody>");
        for (var i = 0; i < monthRows.length; i++) {
          months.append(monthRows[i]);
        }

        return months;
      },
      link: function(text) {
        return $("<a>").prop("href", "#").css({display: "block"}).text(text);
      }
    }
  };

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
      return date.getFullYear() === year && (date.getMonth() + 1) === month;
    },
    inRange: function(baseDate, fromDate, toDate) {
      return fromDate.getTime() <= baseDate.getTime() && toDate.getTime() >= baseDate.getTime();
    },
    parse: function(dateString) {
      return new Date(dateString.replace(/(_|\.)/g, "/"));
    },
    init: function(year_or_set, month, day) {
      if (typeof year_or_set.year === "undefined") {
        var year = year_or_set;
        month = month - 1;
      }
      else {
        var year = year_or_set.year;
        month = year_or_set.month - 1;
        day = year_or_set.day || 1;
      }

      return new Date(year, month, day);
    },
    format: function(date, separator) {
      y = date.getFullYear().toString();
      m = (date.getMonth() + 1).toString();
      d = date.getDate().toString();

      if (m < 10) { m = "0" + m.toString(); }
      if (d < 10) { d = "0" + d.toString(); }

      return [y, m, d].join(separator || "/");
    }
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
        if (/([0-9_\/]*)-([0-9_\/]*)/.test(preset.range)) {
          var range = {
            from: new Date(RegExp.$1),
            to:   new Date(RegExp.$2)
          }

          tbody.append(
            $("<tr>").append(
              $("<td>").addClass("daterangepicker_preset_item")
                .append(
                  $("<a>")
                    .css({display: "block"})
                    .prop("href", "#")
                    .text(preset.label)
                )
                .data("daterangePreset", range)
            )
          )
        }
      });

      // Set Event For PresetItems
      $(".daterangepicker_preset_item a").live("click.daterangepicker", function() {
        var preset = $(this).closest("td");

        $.each(["from", "to"], function(idx, type) {
          calendar.setCurrent(preset.data().daterangePreset[type], type);
        });
        calendar.setRange();

        return false;
      });

      return $("<table>").addClass("daterangepicker_preset").append(tbody);
    }
  }

  var closeButton = {
    create: function(_caller) {
      var tbody = $("<tbody>").append(
        $("<tr>").append(
          $("<td>").addClass("daterangepicker_close_button").append(
            $("<a>").css({display: "block"}).prop({href: "#"}).text("close")
          )
        )
      );

      $(".daterangepicker_close_button").live("click.daterangepicker", function(){
        _caller.daterangepickerClose();
      });

      return $("<table>").addClass("daterangepicker_extra_item").append(tbody);
    }
  };

  // Initialize
  if (typeof options === "undefined") {
    options = {};
  }

  daterangepicker.fields.from = options.daterangeFrom || daterangepicker.fields.from;
  daterangepicker.fields.to   = options.daterangeTo   || daterangepicker.fields.to;

  var daterangepickerWrapper = {
    from: "daterangepicker_widget_calendar_from",
    to:   "daterangepicker_widget_calendar_to"
  }

  var daterange = {};

  $.each(["from", "to"], function(idx, type) {
    if ($(daterangepicker.fields[type]).val() === "") {
      daterange[type] = new Date();
    }
    else {
      daterange[type] = new Date($(daterangepicker.fields[type]).val());
    }

    // Set Event For InputFields
    $(daterangepicker.fields[type]).on("blur.daterangepicker", function() {
      if (daterangepicker.exists()) {
        var date = dateUtil.parse($(this).val());

        if (!isNaN(date.getDay())) {
          calendar.setCurrent(date, type);
          calendar.setRange()
        }
      }
    })
  });

  // Initialize Calendar
  $(this).css({position: "relative"});
  $(this).append(
    $("<table>")
      .addClass("daterangepicker_widget")
      .css(options.display === "fixed" ? {} : {position: "absolute", top: 0, left: 0})
      .append(
        $("<tr>")
          .append($("<td>").css({verticalAlign: "top"}).prop("rowspan", 2).append($("<div>").addClass("daterangepicker_widget_calendar_from").append(calendar.create(daterange.from, "from")).data("daterangeType", "from")))
          .append($("<td>").css({verticalAlign: "top"}).prop("rowspan", 2).append($("<div>").addClass("daterangepicker_widget_calendar_to").append(calendar.create(daterange.to, "to")).data("daterangeType", "to")))
          .append($("<td>").css({verticalAlign: "top"}).addClass("daterangepicker_widget_presets").append(presets.create(options.presets)))
      )
      .append(
        $("<tr>").append($("<td>").css({verticalAlign: "top", height: "100%"}).addClass("daterangepicker_widget_extra").append(closeButton.create(this)))
      )
  );
  calendar.setCurrent(daterange.from, "from");
  calendar.setCurrent(daterange.to, "to");
  calendar.setRange();

  // Set Events For Date
  $(".daterangepicker_date").live("click.daterangepicker", function() {
    var type = $(this).data().daterangeType;
    var date = dateUtil.init($(this).data().daterangeDate);
    $(daterangepicker.fields[type]).val(dateUtil.format(date));

    calendar.setCurrent(date, type);
    calendar.setRange()

    return false;
  });

  $(".daterangepicker_previous_month").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = wrapper.data().daterangeType;
    var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

    var previousMonth = dateUtil.previousMonth(current.year, current.month);
    wrapper.html(calendar.create(previousMonth, type));
    calendar.setCurrent(daterange[type], type, {switchCalendar: false});
    calendar.setRange()

    return false;
  })

  $(".daterangepicker_next_month").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = wrapper.data().daterangeType;
    var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

    var nextMonth = dateUtil.nextMonth(current.year, current.month);
    wrapper.html(calendar.create(nextMonth, type));
    calendar.setCurrent(daterange[type], type, {switchCalendar: false});
    calendar.setRange()

    return false;
  })

  // Set Events For Month
  $(".daterangepicker_current_month").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = wrapper.data().daterangeType;
    var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

    wrapper.html(monthSelector.create(current.year, type));
    return false;
  });

  $(".daterangepicker_month_select").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = $(this).data().daterangeType;
    var date = dateUtil.init($(this).data().daterangeDate);

    wrapper.html(calendar.create(date, type));
    calendar.setCurrent(daterange[type], type, {switchCalendar: false});
    calendar.setRange()

    return false;
  });

  $(".daterangepicker_previous_year").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = wrapper.data().daterangeType;
    var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

    wrapper.html(monthSelector.create((current.year - 1), type));
    return false;
  })

  $(".daterangepicker_next_year").live("click.daterangepicker", function() {
    var wrapper = $(this).closest("div");
    var type = wrapper.data().daterangeType;
    var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

    wrapper.html(monthSelector.create((current.year + 1), type));
    return false;
  })
};
})(jQuery);
