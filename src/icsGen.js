// (Non-JSDoc3 data):
// icsGen, a generator for .ics files written in javascript with an optional php backend.
// Edited by GameplayJDK (https://github.com/GameplayJDK); Repository can be found at https://github.com/GameplayJDK/icsGen.
// Please report bugs or feature requests to https://github.com/GameplayJDK/icsGen/issues.
// Forked from icsFormatter (https://github.com/matthiasanderer/icsFormatter) which was originally forked from ics.js (https://github.com/nwcell/ics.js).

/**
 * icsGen, a generator for .ics files written in javascript with an optional php backend.
 * @see {@link https://github.com/GameplayJDK/icsGen/blob/master/README.md README.md} for a detailed description.
 * @file Holds the icsGen source code
 * @author GameplayJDK <github@gameplayjdk.de>
 * @version 1.0
 * @todo (GameplayJDK): Add support for more stuff from the .ics spec?
 */
var icsGen = function () {
    'use strict';
    
    // IE is supported if the php backend is used, other wise, you should uncomment the 4 lines below:
    //if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') === -1) {
    //    window.console.log('Unsupported Browser');
    //    return;
    //}
    
    /**
     * Generates a unique identifier (UID)
     * @return {string} UID
     */
    var UID = function (length) {
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789_",
            inString = "icsGen".toLowerCase(),
            outString = "",
            i;
        while (inString.length < length) {
            inString += inString;
        }
        for (i = 0; i < length; i += 1) {
            outString += chars.charAt(chars.indexOf(inString.charAt(i)));
        }
        return (outString);
    },
        SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n',
        events = [],
        calendarEvents = [],
        calendarStart = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0'
        ].join(SEPARATOR),
        /**
         * @todo (GameplayJDK): Add support for timezones
         */
        calendarTimezone = [
        ],
        calendarEnd = 'END:VCALENDAR';
    
    return {
        /**
         * Returns raw events array (raw)
         * @return {array} Raw events
         */
        'eventsRaw': function () {
            return calendarEvents;
        },
        
        /**
         * Returns events array (object)
         * @return {array} Events
         */
        'events': function () {
            return events;
        },
        
        
        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        'calendar': function () {
            return [calendarStart, calendarTimezone, calendarEvents.join(SEPARATOR), calendarEnd].join(SEPARATOR);
        },
        
        /**
         * Add event to the calendar
         * @param  {string} subject        Subject/Title of event
         * @param  {string} description    Description of event
         * @param  {string} location       Location of event
         * @param  {string} begin          Beginning date of event
         * @param  {string} stop           Ending date of event
         * @param  {string} [uid=UID(21)]  Unique identifier of event, leave null for normal behaviour
         */
        'addEvent': function (subject, description, location, begin, stop, uid) {
            
            if (uid === null) {
                uid = UID(21);
            }
            
            if (typeof subject === 'undefined' || typeof description === 'undefined' || typeof location === 'undefined' || typeof begin === 'undefined' || typeof stop === 'undefined' || typeof uid === 'undefined') {
                return false;
            }
            
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
                calendarEvent,
                event;
                
            if (start_minutes + start_seconds + end_minutes + end_seconds !== 0) {
                start_time = 'T' + start_hours + start_minutes + start_seconds;
                end_time = 'T' + end_hours + end_minutes + end_seconds;
            }
            
            start = start_year + start_month + start_day + start_time;
            end = end_year + end_month + end_day + end_time;
            
            calendarEvent = [
                'BEGIN:VEVENT',
                'UID:' + 'icsGen-' + uid,
                'CLASS:PUBLIC',
                'DESCRIPTION:' + description,
                'DTSTART;VALUE=DATE:' + start,
                'DTEND;VALUE=DATE:' + end,
                'LOCATION:' + location,
                'SUMMARY;LANGUAGE=en-us:' + subject,
                'TRANSP:TRANSPARENT',
                'END:VEVENT'
            ].join(SEPARATOR);
            event = {
                "uid": uid,
                "description": description,
                "start": start,
                "end": end,
                "location": location,
                "subject": subject
            };
            
            events.push(event);
            calendarEvents.push(calendarEvent);
            return calendarEvent;
        },
        
        /**
         * Download calendar using dlh.php
         * @param  {string} [filename=calendar]  Filename
         * @param  {string} [ext=js]             Extention
         * @param  {string} [dlh=./dlh.php]      Path to the dlh.php file
         */
        'download': function (filename, ext, dlh) {
            if (calendarEvents.length < 1) {
                return false;
            }
            
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            dlh = (typeof dlh !== 'undefined') ? dlh : './dlh.php';
            var calendar = [calendarStart, calendarTimezone, calendarEvents.join(SEPARATOR), calendarEnd].join(SEPARATOR);
            
            if (!dlh) {
                window.open("data:text/calendar;charset=utf8," + encodeURIComponent(calendar));
            } else {
                window.location = encodeURI(dlh) + "?f=" + encodeURIComponent(filename + "." + ext) + "&t=" + encodeURIComponent(calendar);
            }
        }
    };
};