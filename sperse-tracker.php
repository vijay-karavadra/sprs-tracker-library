<?php
/**
 * Plugin Name: Sperse Tracker Integration
 * Description: Adds visitor tracking to the site using the sperse-tracker UMD library.
 * Version: 1.1
 * Author: Vijay Karavadra
 */

add_action('wp_footer', 'sti_enqueue_tracker_script');

function sti_enqueue_tracker_script() {
    ?>
    <script>
      (function loadSperseTracker() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/vijay-karavadra/sprs-tracker-library@main/dist/index.umd.js';
        script.async = true;

        script.onload = function() {
          console.log('✅ Sperse Tracker script loaded.');
          initTracker();
        };

        script.onerror = function() {
          console.error('❌ Failed to load Sperse Tracker script from CDN.');
        };

        document.head.appendChild(script);

        function initTracker() {
          if (typeof VisitorTracker !== 'undefined') {
            const tracker = new VisitorTracker(
              '379c5cdb-2c56-41e2-b44f-97960e984544',
              'https://localhost:7060/api/Tracking/debug/batch',
              {
                enableGeolocation: true,
                batchSendInterval: 30000
              }
            );
            console.log('✅ Sperse Tracker initialized:', tracker);
            window.__sperseTracker = tracker;
          } else {
            // If VisitorTracker is not available even after script loaded
            console.error('❌ VisitorTracker is not defined after script loaded.');
          }
        }
      })();
    </script>
    <?php
}
