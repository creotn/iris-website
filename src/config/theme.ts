export const THEME_STORAGE_KEY = "iris-theme";

// Runs before first paint so a saved dark theme never flashes light. A fixed string with no
// interpolated input, so injecting it is not an XSS sink.
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
