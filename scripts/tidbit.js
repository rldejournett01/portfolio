// Main Script
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

async function getUserLocation() {
  try {

    //CORS proxy
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiURL = 'https://ipapi.co/json/'

    //const response = await fetch('https://ipapi.co/json/');
    const response = await fetch(proxyUrl + apiURL);
    const data = await response.json();

    if (data.error) {
      console.error("IPAPI error:", data.reason);
      return null;
    }

    return {
      city: data.city,
      country: data.country_name,
      region: data.region,
    };
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return null;
  }
}

async function generateTidbits() {
  const tidbitEl = document.getElementById('tidbit-content');
  const location = await getUserLocation();
  let tidbits = [];

  // Browser & OS
  const isChrome = navigator.userAgent.includes('Chrome');
  const isWindows = navigator.userAgent.includes('Windows');
  tidbits.push(`you use ${isChrome ? 'Chrome, or some variant of it.' : 'a browser that isn\'t Chrome.'}`);
  if (isWindows) tidbits.push(`it works well enough on your Windows device.`);

  // CPU Cores
  const cores = navigator.hardwareConcurrency || 'unknown';
  tidbits.push(`you're reading this on a ${cores > 8 ? 'powerful' : 'decent'} machine. ${cores} cores is ${cores > 12 ? 'quite a bit' : 'enough'}.`);

  // Battery Status (if supported)
  if ('getBattery' in navigator) {
    const battery = await navigator.getBattery();
    tidbits.push(`you're reading this on a device that ${battery.charging ? 'is plugged in' : 'has a battery at ' + Math.round(battery.level * 100) + '%'}.`);
  }

  // Screen Size
  const isFullscreen = window.outerWidth > screen.width * 0.9;
  tidbits.push(`you ${isFullscreen ? 'like to give your apps room to breathe' : 'prefer a compact view'}—your browser window is ${isFullscreen ? 'almost as big as your screen' : 'not maximized'}.`);

  // Do Not Track
  const isTrackingAllowed = navigator.doNotTrack !== '1';
  tidbits.push(`your browser ${isTrackingAllowed ? 'hasn\'t told me that you don\'t want to be tracked' : 'wants privacy (Do Not Track is enabled)'}. not that it would make a difference here.`);

  // Storage (if supported)
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const storage = await navigator.storage.estimate();
    const freeSpace = storage.quota ? Math.round((storage.quota - (storage.usage || 0)) / (1024 ** 3)) : 'unknown';
    tidbits.push(`you have ${freeSpace}GB or so free on your device.`);
  }

  // GPU (if available)
  if ('gpu' in navigator) {
    const gpuInfo = await navigator.gpu.requestAdapter();
    const isNVIDIA = gpuInfo?.name?.includes('NVIDIA');
    if (isNVIDIA) tidbits.push(`you're content with the NVIDIA chip inside your computer. playing games is cool, and it's better than an integrated GPU.`);
  }

  // Location (approximate, via IP)
  // (You'd need an external API like ipapi.co or ipgeolocation.io)
  // tidbits.push(`you're safe in ${userCity}.`); // Example
  tidbits.push(`you're safe in ${location.city}, ${location.region}.`)

  // Display all tidbits
  tidbitEl.innerHTML = tidbits.join('<br><br>');
}

generateTidbits();