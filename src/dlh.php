<?php

// If the GET params f and t are set...
if (isset($_GET['f']) && isset($_GET['t'])) {
    // ... set 'Content-Type' to 'text/calendar' and 'charset=' to 'utf-8'.
    header('Content-Type: text/calendar; charset=utf-8');
    // ... set 'Content-Disposition' to 'inline' and 'filename' to the GET param f (filename).
    header('Content-Disposition: inline; filename="' . rawurldecode($_GET['f']). '"');
    // ... print the GET param t (text).
    echo (rawurldecode($_GET['t']));
}

// In any case, put something onto the page:
echo ("");

?>