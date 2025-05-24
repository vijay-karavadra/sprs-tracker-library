<?php
/*
Plugin Name: Sperse tracker
Description: Loads a custom tracking library from GitHub.
Version: 1.0
Author: Vijay Karavadra
*/

function sperse_tracker_enqueue_script() {
    wp_enqueue_script(
        'sperse-tracker',
        'https://cdn.jsdelivr.net/gh/vijay-karavadra/sprs-tracker-library@main/dist/index.umd.js',
        array(),
        null,
        true
    );
}

function sperse_tracker_inline_script() {
    echo "<script>
        if (window.MySharedLib && typeof MySharedLib.trackUserVisit === 'function') {
            MySharedLib.trackUserVisit();
        }
    </script>";
}

// Define the shortcode [sprs_tracker]
function sperse_tracker_shortcode() {
    // Make sure scripts are enqueued
    sperse_tracker_enqueue_script();

    // Return the inline script inside shortcode output
    ob_start();
    sperse_tracker_inline_script();
    return ob_get_clean();
}
add_shortcode('sprs_tracker', 'sperse_tracker_shortcode');
