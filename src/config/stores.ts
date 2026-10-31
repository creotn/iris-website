export const APP_STORE_URL = "https://apps.apple.com/sa/app/iris/id6809477836";
export const PRO_APP_STORE_URL = "https://apps.apple.com/sa/app/iris-pro/id6809588223";

// The Android app isn't released yet: the Play Store home page stands in until it has a listing.
export const PLAY_STORE_URL = "https://play.google.com/store";

// Runs before first paint so a phone never flashes the other store's badge. Desktops get no
// attribute and keep both. iPadOS reports itself as a Mac, so it is told apart by its touch points.
// A fixed string with no interpolated input, so injecting it is not an XSS sink.
export const platformInitScript = `try{var u=navigator.userAgent,d=document.documentElement.dataset;if(/android/i.test(u))d.platform="android";else if(/iphone|ipad|ipod/i.test(u)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1))d.platform="ios"}catch(e){}`;
