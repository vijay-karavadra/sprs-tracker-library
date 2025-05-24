<?php
/*
Plugin Name: SPRS Tracker
Description: Loads a custom tracking library from GitHub.
Version: 1.0
Author: Vijay Karavadra
*/

function sprs_tracker_enqueue_script() {
    wp_enqueue_script(
        'sperse-tracker',
        'https://cdn.jsdelivr.net/gh/vijay-karavadra/sprs-tracker-library@main/dist/index.umd.js',
        array(),
        null,
        true
    );

    wp_add_inline_script(
        'sprs-tracker',
        'if (window.MySharedLib && typeof MySharedLib.trackUserVisit === "function") {
            MySharedLib.trackUserVisit();
        }'
    );
}
add_action('wp_enqueue_scripts', 'sperse_tracker_enqueue_script');
