<?php

if (isset($_GET['f']) && isset($_GET['t'])) {
    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: inline; filename="' . rawurldecode($_GET['f']). '"');
    echo (rawurldecode($_GET['t']));
}

echo ("");

?>