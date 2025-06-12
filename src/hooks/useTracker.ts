import { useEffect, useState } from 'react';
import { VisitorTracker } from '../index';
import trackerConfig from '../config/tracker-config.json';
import { TrackingConfig } from '../types/TrackingConfig';

export function useTracker(siteId: string, batchAPIUrl: string) {
  const [tracker, setTracker] = useState<VisitorTracker | null>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      const { ...options } = trackerConfig as TrackingConfig;

      const trackerInstance = new VisitorTracker(
        siteId,
        batchAPIUrl,
        options
      );
      
      setTracker(trackerInstance);

      // Cleanup on unmount
      return () => {
        trackerInstance.destroy();
      };
    }
  }, []);

  return tracker;
}