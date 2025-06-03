<?php
/**
 * Plugin Name: Simple Console Logger
 * Description: Logs a custom message in the browser console on every page load.
 * Version: 1.0
 * Author: Vijay Karavadra
 */

 // Hook to add JavaScript to the frontend
add_action('wp_footer', 'scl_add_console_log');

function scl_add_console_log() {
    ?>
    <script>
        console.log("🚀 Simple Console Logger Plugin is active!");
    </script>
    <?php
}
