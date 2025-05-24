export function greet(name) {
  return `Hello, mr. ${name}!`;
}

export function trackUserVisit() {
  const data = {
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'Direct',
    entryUrl: window.location.href,
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    connection: navigator.connection?.effectiveType || 'unknown',
  };

  console.log('Tracking data:', data);
}