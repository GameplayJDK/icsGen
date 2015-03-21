icsGen
======

A generator for .ics files written in javascript with an optional php backend.

**This was forked from [icsFormatter](https://github.com/matthiasanderer/icsFormatter) which was originally forked from [ics.js](https://github.com/nwcell/ics.js).**


How To Use
----------
Just invoke the object and use the functions...

```javascript
var cal = ics();
cal.addEvent(subject, description, location, begin, end);
cal.addEvent(subject, description, location, begin, end);
cal.download(filename, extension, dlh);
```

`begin` and `end` need to be formatted in a way that is friendly to `Date()`. `dlh` has to be a valid url to a version of the `dlh.php` file, otherwise the download won't work, or equal `false` (or any other falsey value), if you wish to use the javascript only way instead.

You can have multiple events. Events can be either one of three types: *Fixed time*, *All day*, *Multi day*.
But please notice that some calendar clients behave differently. They might offset the end date by -1 day or the start time by +1 minute.


Example
-------

```html
<script>
    var cal = icsGen();
    cal.addEvent('Demo Event', 'This is an all day event', 'Nome, AK', '8/7/2015', '8/7/2015');
    cal.addEvent('Demo Event', 'This is a thirty minut event', 'Nome, AK', '8/7/2015 5:30 pm', '8/7/2015 6:00 pm');
    cal.addEvent('Demo Event', 'This is a multi day event', 'Nome, AK', '8/7/2015', '8/9/2015');
</script>
<a href="javascript:cal.download('calendar', 'ics', './php/dlh.php')">Demo</a> <!-- with php backend    -->
<a href="javascript:cal.download('calendar', 'ics', false)">Demo</a>           <!-- without php backend -->
```

Make sure you have the right path to the `dlh.php` file set! It can also be an absolute instead of a relative path.


Credits
-------

* [Travis Krause](https://github.com/nwcell): Original author
* [Kyle Hornberg](https://github.com/khornberg): Added multi event functionality and made everything a package firendly
* [matthiasanderer](https://github.com/matthiasanderer): Fixed the bug which made chrome open the ics text instead of starting the download
* [GameplayJDK](https://github.com/GameplayJDK): Added optional php backend with alternative pure javascript fallback and line ending conversion script
