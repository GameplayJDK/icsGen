// Forked from icsFormatter (https://github.com/matthiasanderer/icsFormatter)

var icsGen = function () {
    'use strict';
    
    // IE is supported if the php backend is used, other wise, you should uncomment the 4 lines below:
//    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') === -1) {
//        window.console.log('Unsupported Browser');
//        return;
//    }
    
    var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n',
        calendarEvents = [],
        calendarStart = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0'
        ].join(SEPARATOR),
        calendarEnd = SEPARATOR + 'END:VCALENDAR';
    
    return {
        /**
         * Returns events array
         * @return {array} Events
         */
        'events': function () {
            return calendarEvents;
        },
        
        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        'calendar': function () {
            return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
        },
        
        /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
        'addEvent': function (subject, description, location, begin, stop) {
            // I'm not in the mood to make these optional... So they are all required
            if (typeof subject === 'undefined' || typeof description === 'undefined' || typeof location === 'undefined' || typeof begin === 'undefined' || typeof stop === 'undefined') {
                return false;
            }
            
            //TODO add time and time zone? use moment to format?
            var start_date = new Date(begin),
                end_date = new Date(stop),
                
                start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4),
                start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2),
                start_day = ("00" + ((start_date.getDate()).toString())).slice(-2),
                start_hours = ("00" + (start_date.getHours().toString())).slice(-2),
                start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2),
                start_seconds = ("00" + (start_date.getMinutes().toString())).slice(-2),
                
                end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4),
                end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2),
                end_day = ("00" + ((end_date.getDate()).toString())).slice(-2),
                end_hours = ("00" + (end_date.getHours().toString())).slice(-2),
                end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2),
                end_seconds = ("00" + (end_date.getMinutes().toString())).slice(-2),
                
            // Since some calendars don't add 0 second events, we need to remove time if there is none...
                start_time = '',
                end_time = '',
                start,
                end,
                calendarEvent;
                
            if (start_minutes + start_seconds + end_minutes + end_seconds !== 0) {
                start_time = 'T' + start_hours + start_minutes + start_seconds;
                end_time = 'T' + end_hours + end_minutes + end_seconds;
            }
            
            start = start_year + start_month + start_day + start_time;
            end = end_year + end_month + end_day + end_time;
            
            calendarEvent = [
                'BEGIN:VEVENT',
                'CLASS:PUBLIC',
                'DESCRIPTION:' + description,
                'DTSTART;VALUE=DATE:' + start,
                'DTEND;VALUE=DATE:' + end,
                'LOCATION:' + location,
                'SUMMARY;LANGUAGE=en-us:' + subject,
                'TRANSP:TRANSPARENT',
                'END:VEVENT'
            ].join(SEPARATOR);
            
            calendarEvents.push(calendarEvent);
            return calendarEvent;
        },
        
        /**
         * Download calendar using dlh.php
         * @param  {string} filename Filename
         * @param  {string} ext      Extention
         */
        'download': function (filename, ext, dlh) {
            if (calendarEvents.length < 1) {
                return false;
            }
            
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            dlh = (typeof dlh !== 'undefined') ? dlh : './dlh.php';
            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            
            if (dlh !== true) {
                window.open("data:text/calendar;charset=utf8," + encodeURIComponent(calendar));
            } else {
                window.location = encodeURI(dlh) + "?f=" + encodeURIComponent(filename + ext) + "&t=" + encodeURIComponent(calendar);
            }
        }
    };
};