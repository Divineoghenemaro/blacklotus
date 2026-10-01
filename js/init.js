// Runs right after the Tailwind script is loaded. It does two things.

// 1. Apply the saved theme (light or dark) before the page is drawn, so it does not flash.
try {
  var savedTheme = localStorage.getItem('bl-theme');   // 'dark', 'light' or nothing yet
  var useDark = savedTheme
    ? savedTheme === 'dark'                              // the visitor chose before
    : matchMedia('(prefers-color-scheme:dark)').matches; // otherwise follow the device setting
  var rootEl = document.documentElement;
  rootEl.classList.toggle('dark', useDark);              // Tailwind reads the "dark" class
  rootEl.dataset.theme = useDark ? 'dark' : 'light';
} catch (e) {}                                           // storage can be blocked; ignore that

// 2. Tailwind settings: dark mode is switched by the "dark" class, and these are the fonts.
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif"', 'Georgia', 'serif']
      }
    }
  }
};
