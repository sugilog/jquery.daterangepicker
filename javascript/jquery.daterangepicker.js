/*!
 * jquery.daterangepicker v0.1.1
 *
 * Copyright (c) 2012 Takayuki Sugita, http://github.com/sugilog
 * Released under the MIT License
 *
*/
(function($) {
var daterangepicker = {
  exists: function(container) {
    return (typeof $(container).find("table.daterangepicker_widget").get(0) !== "undefined");
  }
};

$.fn.daterangepickerOpen = function(_options) {
  $("table.daterangepicker_widget").each(function() {
    $(this).parent().daterangepickerClose();
  });

  $(this).daterangepicker(_options);
};
$.fn.daterangepickerClose = function() {
  $(this).find("table.daterangepicker_widget").remove();
  $(this).daterangepicker({call: "close"})
};
$.fn.daterangepickerToggle = function(_options) {
  if (daterangepicker.exists(this)) {
    $(this).daterangepickerClose();
  }
  else {
    $(this).daterangepickerOpen(_options);
  }
};
$.fn.daterangepicker = function(_options) {
  var _this = this;

  if (typeof _options === "undefined") {
    _options = {};
  }
  if (typeof _options.extraButton === "undefined") {
    _options.extraButton = {};
  }

  var _from = (_from = $(this).find("input[type=text]").get(0)) ? _from.id : "daterange_from";
  var _to   = (_to = $(this).find("input[type=text]").get(1)) ? _to.id : "daterange_to";

  var daterange = {
    fields: {
      from: "#" + _from,
      to:   "#" + _to
    },
    extraButton: {
     blank: _options.extraButton.blank,
     close: _options.extraButton.close,
     fromNull: ( _options.extraButton.fromNull || undefined ),
     toNull:   ( _options.extraButton.toNull   || undefined )
    },
    callback: {
      onPick:         _options.onPick,
      onPickPreset:   _options.onPickPreset,
      onPickBlank:    _options.onPickBlank,
      onPickFromNull: _options.onPickFromNull,
      onPickToNull:   _options.onPickToNull
    }
  };

  daterange.fields.from = _options.daterangeFrom || daterange.fields.from;
  daterange.fields.to   = _options.daterangeTo   || daterange.fields.to;
  daterange.extraButton.nullify = daterange.extraButton.fromNull || daterange.extraButton.toNull;

  daterange.wrapFields = function(){
    return $(_this).find([daterange.fields.from, daterange.fields.to].join(",")).length === 2;
  };

  daterange.widgetArea = ["#" + _this.eq(0).prop("id")];

  if (typeof _options.widgetArea !== "undefined") {
    daterange.widgetArea.push(_options.widgetArea);
  }

  if (!daterange.wrapFields()) {
    daterange.widgetArea.push(daterange.fields.from);
    daterange.widgetArea.push(daterange.fields.to);
  }

  var daterangepickerWrapper = {
    from: "daterangepicker_widget_calendar_from",
    to:   "daterangepicker_widget_calendar_to"
  }

  var calendar = {
    defaultWeekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    create: function(date, type, options) {
      if (typeof options === "undefined") {
        options = {init: false};
      }

      if (options.init && daterange.extraButton.nullify) {
        date = new Date();
      }

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
        $.each(daterange.weekdays, function(idx, day){
          row.append($("<td>").addClass("daterangepicker_" + day).text(day));
        });
        return row;
      },
      dates: function(year, month, type) {
        var dateRows = new Array();
        var weeks = -1;
        var range = dateUtil.range(dateUtil.beginningOfCalendar(year, month), dateUtil.endOfCalendar(year, month));

        $.each(range, function(idx, date) {
          if (date.getDay() === daterange.startAt) {
            weeks++;
            dateRows[weeks] = $("<tr>").addClass("daterangepicker_week");
          }

          var d = $("<td>")
          d.addClass("daterangepicker_date")
            .prop("id", "date_" + type + "_" + dateUtil.format(date, "_"))
            .data("daterangeDate", {year: date.getFullYear(), month: (date.getMonth() + 1), day: date.getDate()})
            .data("daterangeType", type);

          if (!dateUtil.inMonth(date, year, month)) {
            d.addClass("daterangepicker_date_out_of_current_month");
          }

          d.append(calendar.row.link(date.getDate()));

          dateRows[weeks].append(d);
        })

        var dates = $("<tbody>");
        for (var i = 0; i < dateRows.length; i++) {
          dates.append(dateRows[i]);
        }

        return dates;
      },
      link: function(text) {
        return $("<a>").prop("href", "javascript: void(0);").css({display: "block"}).text(text);
      }
    },
    setCurrent: function(newDate, type, options) {
      if (typeof options === "undefined") {
        options = {switchCalendar: true};
      }

      currentDate = $("." + daterangepickerWrapper[type] + " table.daterangepicker_calendar").data().daterangeDate;

      if (typeof newDate !== "undefined" && options.switchCalendar) {
        if (dateUtil.isNullify(newDate)) {
          _currentDate = dateUtil[ type === "from" ? "beginningOfMonth" : "endOfMonth" ](currentDate.year, currentDate.month);
          $("." + daterangepickerWrapper[type]).html(calendar.create(_currentDate, type));
        }
        else if (newDate.getFullYear() !== currentDate.year || newDate.getMonth() + 1 !== currentDate.month) {
          $("." + daterangepickerWrapper[type]).html(calendar.create(newDate, type));
        }
      }

      $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).removeClass("current_selection");

      if (typeof newDate === "undefined") {
        $(daterange.fields[type]).val("");
      }
      else {
        daterange[type] = newDate;
        $("#date_" + type + "_" + dateUtil.format(daterange[type], "_")).addClass("current_selection");
        // TODO: date format
        $(daterange.fields[type]).val(dateUtil.format(daterange[type], "/"));
      }
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

        $.each(calendar.months, function(idx, month) {
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
        return $("<a>").prop("href", "javascript: void(0);").css({display: "block"}).text(text);
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

      if (base.getDay() === daterange.startAt) {
        return base;
      }
      else {
        var day = (base.getDay() === 0) ? 7 : base.getDay();
        return this.ago(base, day - daterange.startAt);
      }
    },
    endOfCalendar: function(year, month) {
      var base = this.endOfMonth(year, month);

      if (base.getDay() === daterange.endAt) {
        return base;
      }
      else {
        return this.since(base, 6 + daterange.startAt - base.getDay());
      }
    },
    ago: function(base, days) {
      base.setDate(base.getDate() - days * 1);
      return base;
    },
    since: function(base, days) {
      base.setDate(base.getDate() + days * 1);
      return base;
    },
    inMonth: function(date, year, month) {
      return date.getFullYear() === year && (date.getMonth() + 1) === month;
    },
    inRange: function(baseDate, fromDate, toDate) {
      // FIXME
      //return fromDate.getTime() <= baseDate.getTime() && toDate.getTime() >= baseDate.getTime();
      return fromDate <= baseDate && toDate >= baseDate;
    },
    parse: function(dateString) {
      return new Date(dateString.replace(/(_|\.)/g, "/"));
    },
    isNullify: function(date) {
      return date === dateUtil.minusInfinity || date === dateUtil.Infinity
    },
    minusInfinity: (new Date(0)),
    Infinity:      (new Date(3000, 11, 31)),
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
      if (!dateUtil.isNullify(date)) {
        y = date.getFullYear().toString();
        m = (date.getMonth() + 1).toString();
        d = date.getDate().toString();

        if (m < 10) { m = "0" + m.toString(); }
        if (d < 10) { d = "0" + d.toString(); }

        return [y, m, d].join(separator || "/");
      }
      else {
        return "";
      }
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

      var innerTable = $("<table>").addClass("daterangepicker_preset_item_list");
      $.each(presetsList, function(idx, preset) {
        var range, from, to;

        if (/([0-9_\/]*)-([0-9_\/]*)/.test(preset.range)) {
          from = RegExp.$1;
          to   = RegExp.$2;

          range = {
            from: (from && from !== "") ? new Date(RegExp.$1) : undefined,
            to:   (to   && to !== "")   ? new Date(RegExp.$2) : undefined
          }

          innerTable.append(
            $("<tr>").append(
              $("<td>").addClass("daterangepicker_preset_item")
                .append(
                  $("<a>")
                    .css({display: "block"})
                    .prop("href", "javascript: void(0);")
                    .text(preset.label)
                )
                .data("daterangePreset", range)
            )
          )
        }
      });

      tbody.append(
        $("<tr>").append(
          $("<td>").addClass("daterangepicker_preset_item_wrapper").append(
            $("<div>").addClass("daterangepicker_preset_item_list").append(innerTable)
          )
        )
      );
      return $("<table>").addClass("daterangepicker_preset").append(tbody);
    },
    adjust: function() {
      var target = $("div.daterangepicker_preset_item_list");
      var height = Math.max.apply(
        Math,
        $("table.daterangepicker_calendar").map(function() {
          var _height = $(this).height(),
              _rows   = $(this).find("tr").length;
          console.log(_height, _rows);
          return (_height / _rows) * (_rows - 1);
        }).toArray()
      );
      target.css({height: height});
    }
  };

  var extraButton = {
    create: function(types) {
      var rows = $("<tbody>");

      $.each(types, function(_, type) {
        if (typeof daterange.extraButton[type] !== "undefined") {
          rows.append(extraButton.build(type, daterange.extraButton[type]));
        }
      });

      return $("<table>").addClass("daterangepicker_extra_item").append(rows);
    },
    build: function(type, buttonLabel) {
      return $("<tr>")
        .append(
          $("<td>").addClass("daterangepicker_" + type + "_button").append(
            $("<a>").css({display: "block"}).prop({href: "javascript: void(0);"}).text(buttonLabel || type)
          )
        );
    }
  };

  var events = {
    target: {
      date:         _this.selector + " .daterangepicker_date",
      prevMonth:    _this.selector + " .daterangepicker_previous_month",
      nextMonth:    _this.selector + " .daterangepicker_next_month",
      currentMonth: _this.selector + " .daterangepicker_current_month",
      month:        _this.selector + " .daterangepicker_month_select",
      prevYear:     _this.selector + " .daterangepicker_previous_year",
      nextYear:     _this.selector + " .daterangepicker_next_year",
      preset:       _this.selector + " .daterangepicker_preset_item",
      close:        _this.selector + " .daterangepicker_close_button",
      blank:        _this.selector + " .daterangepicker_blank_button",
      fromNull:     _this.selector + " .daterangepicker_fromNull_button",
      toNull:       _this.selector + " .daterangepicker_toNull_button"
    },
    close: function() {
      $.each(this.target, function(_, selector) {
          $(document).off(selector, "click.daterangepicker");
      });

      $.each(["from", "to"], function(_, type) {
        $(daterange.fields[type]).off("blur.daterangepicker");
      });
    },
    open: function() {
      // Set Events For Date
	$(document).on("click.daterangepicker", this.target.date, function() {
        var type = $(this).data().daterangeType;
        var date = dateUtil.init($(this).data().daterangeDate);
        $(daterange.fields[type]).val(dateUtil.format(date));

        calendar.setCurrent(date, type);
        calendar.setRange();

        callbackArg = {};
        callbackArg[type] = date

        if (typeof daterange.callback.onPick !== "undefined") {
          daterange.callback.onPick.apply(_this, [callbackArg])
        }
        return false;
      });

      $(document).on("click.daterangepicker", this.target.prevMonth, function() {
        var wrapper = $(this).closest("div");
        var type = wrapper.data().daterangeType;
        var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

        var previousMonth = dateUtil.previousMonth(current.year, current.month);
        wrapper.html(calendar.create(previousMonth, type));

        calendar.setCurrent(daterange[type], type, {switchCalendar: false});
        calendar.setRange();

        return false;
      });

      $(document).on("click.daterangepicker", this.target.nextMonth, function() {
        var wrapper = $(this).closest("div");
        var type = wrapper.data().daterangeType;
        var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

        var nextMonth = dateUtil.nextMonth(current.year, current.month);
        wrapper.html(calendar.create(nextMonth, type));
        calendar.setCurrent(daterange[type], type, {switchCalendar: false});
        calendar.setRange();

        return false;
      });

      // Set Events For Month
      $(document).on("click.daterangepicker", this.target.currentMonth, function() {
        var wrapper = $(this).closest("div");
        var type = wrapper.data().daterangeType;
        var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

        wrapper.html(monthSelector.create(current.year, type));
        return false;
      });

      $(document).on("click.daterangepicker", this.target.month, function() {
        var wrapper = $(this).closest("div");
        var type = $(this).data().daterangeType;
        var date = dateUtil.init($(this).data().daterangeDate);

        wrapper.html(calendar.create(date, type));
        calendar.setCurrent(daterange[type], type, {switchCalendar: false});
        calendar.setRange();

        return false;
      });

      $(document).on("click.daterangepicker", this.target.prevYear, function() {
        var wrapper = $(this).closest("div");
        var type = wrapper.data().daterangeType;
        var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

        wrapper.html(monthSelector.create((current.year - 1), type));
        return false;
      });

      $(document).on("click.daterangepicker", this.target.nextYear, function() {
        var wrapper = $(this).closest("div");
        var type = wrapper.data().daterangeType;
        var current = wrapper.find(".daterangepicker_calendar").data().daterangeDate;

        wrapper.html(monthSelector.create((current.year + 1), type));
        return false;
      })

      // Set Event For PresetItems
      $(document).on("click.daterangepicker", this.target.preset, function() {
        var preset = $(this);
        var callbackArg = {};

        $.each(["from", "to"], function(_, type) {
          var date = preset.data().daterangePreset[type];
          calendar.setCurrent(date, type);
          callbackArg[type] = date
        });
        calendar.setRange();

        if (typeof daterange.callback.onPickPreset !== "undefined") {
          daterange.callback.onPickPreset.apply(_this, [callbackArg]);
        }
        return false;
      });

      $(document).on("click.daterangepicker", this.target.close, function(){
        _this.daterangepickerClose();
      });

      $(document).on("click.daterangepicker", this.target.blank, function(){
        $.each(["from", "to"], function(_, type) {
          calendar.setCurrent(undefined, type);
        });

        if (typeof daterange.callback.onPickBlank !== "undefined") {
          daterange.callback.onPickBlank.apply(_this);
        }
        return false;
      });

      $(document).on("click.daterangepicker", this.target.fromNull, function(){
        calendar.setCurrent(dateUtil.minusInfinity, "from");
        calendar.setRange();

        if (typeof daterange.callback.onPickFromNull !== "undefined") {
          daterange.callback.onPickFromNull.apply(_this);
        }
        return false
      });

      $(document).on("click.daterangepicker", this.target.toNull, function(){
        calendar.setCurrent(dateUtil.Infinity, "to");
        calendar.setRange();

        if (typeof daterange.callback.onPickToNull !== "undefined") {
          daterange.callback.onPickToNull.apply(_this);
        }
        return false
      });

      $.each(["from", "to"], function(_, type) {
        $(daterange.fields[type]).on("blur.daterangepicker", function() {
          if (daterangepicker.exists(_this)) {
            var date = dateUtil.parse($(this).val());

            if (!isNaN(date.getDay())) {
              calendar.setCurrent(date, type);
              calendar.setRange();
            }
          }
        })
      });
    }
  };

  if (typeof _options.call !== "undefined") {
    events[_options.call]();
    return false
  }


  daterange.startAt = _options.daterangeStartAt || 0;
  daterange.endAt = ((daterange.startAt === 0) ? 6 : daterange.startAt - 1);

  if (typeof daterange.weekdays === "undefined") {
    daterange.weekdays = calendar.defaultWeekdays;

    if (daterange.startAt !== 0) {
      var l = daterange.startAt;

      while(l--) {
        daterange.weekdays.push(daterange.weekdays.shift());
      }
    }
  }

  // make the date be parsed as midnight in the local TZ so it doesn't increment/decrement 
  var tzo=(new Date()).getTimezoneOffset();
  var tz_sign = tzo>0 ? '-' : '+';                         // the reverse of the sign of tzo
  var tzo_hours = ('0' + (Math.floor(tzo/60).toString())).substr(-2,2);
  var tzo_minutes = ('0' + ((tzo%60).toString())).substr(-2,2);
  var tz_string = tz_sign+tzo_hours+':'+tzo_minutes;

  $.each(["from", "to"], function(idx, type) {
    if ($(daterange.fields[type]).val() === "") {
      if (daterange.extraButton.nullify) {
        daterange[type] = dateUtil[ type === "from" ? "minusInfinity" : "Infinity" ];
      }
      else {
        daterange[type] = new Date();
      }
    }
    else {
      var dt_in = $(daterange.fields[type]).val();
      daterange[type] = new Date(dt_in + ' 00:00:00 ' + tz_string);
    }
  });

  $(this)
    .css({position: "relative"})
    .append(
      $("<table>")
        .addClass("daterangepicker_widget")
        .css(
          (_options.display === "fixed") ? {} : {
            position: "absolute",
            top: (daterange.wrapFields() ? $(daterange.fields.from).height() + 5 : 0),
            left: (daterange.wrapFields() ? $(daterange.fields.from).position().left - 10 : 0)
          }
        )
        .append(
          $("<tr>")
            .append(
              $("<td>")
                .css({verticalAlign: "top"})
                .prop("rowspan", (daterange.extraButton.nullify ? 1 : 2 ))
                .append(
                  $("<div>")
                    .addClass("daterangepicker_widget_calendar_from")
                    .append(calendar.create(daterange.from, "from", {init: true}))
                    .data("daterangeType", "from")
                )
            )
            .append(
              $("<td>")
                .css({verticalAlign: "top"})
                .prop("rowspan", (daterange.extraButton.nullify ? 1 : 2 ))
                .append(
                  $("<div>")
                    .addClass("daterangepicker_widget_calendar_to")
                    .append(calendar.create(daterange.to, "to", {init: true}))
                    .data("daterangeType", "to")
                )
            )
            .append(
              $("<td>")
                .css({verticalAlign: "top"})
                .addClass("daterangepicker_widget_presets")
                .append(presets.create(_options.presets))
            )
        )
        .append(
          $("<tr>")
            .append(
              !daterange.extraButton.nullify ? null : (
                $("<td>")
                  .css({verticalAlign: "bottom", height: "100%"})
                  .addClass("daterangepicker_widget_extra")
                  .append(extraButton.create(["fromNull"]))
              )
            )
            .append(
              !daterange.extraButton.nullify ? null : (
                $("<td>")
                  .css({verticalAlign: "bottom", height: "100%"})
                  .addClass("daterangepicker_widget_extra")
                  .append(extraButton.create(["toNull"]))
              )
            )
            .append(
              $("<td>")
                .css({verticalAlign: "bottom", height: "100%"})
                .addClass("daterangepicker_widget_extra")
                .append(extraButton.create(["blank", "close"]))
            )
        )
    );
  presets.adjust();
  calendar.setCurrent(daterange.from, "from");
  calendar.setCurrent(daterange.to, "to");
  calendar.setRange();

  $(daterange.widgetArea.join(",")).outerOn("click.daterangepicker", function() {
    $(_this).daterangepickerClose();
  });

  events.open();
};

if (typeof $.fn.outerOn === "undefined" && typeof $.fn.outerOff === "undefined") {
  $.fn.outerOn = function() {
    var args = $(arguments).toArray();
    var _this = this;
    var handleEvent = (args.shift() + [".outer" + "_" + _this.eq(0).prop("id")].join());
    var selector = "body";

    if (typeof args[0] !== "function") {
      selector = args.shift();
    }

    var callback = args.shift();

    $(selector).on(handleEvent, function(e) {
      if ($(e.target).closest(_this).length === 0) {
        callback.apply(_this, [e]);
      }
    });
  };

  $.fn.outerOff = function() {
    var args = $(arguments).toArray();
    var _this = this;
    var handleEvent = (args.shift() + [".outer" + "_" + _this.eq(0).prop("id")].join());
    var selector = "body";

    if (typeof args[0] !== "undefined") {
      selector = args.shift();
    }

    $(selector).off(handleEvent);
  }
}

})(jQuery);
