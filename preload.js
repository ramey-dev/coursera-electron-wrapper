// preload.js
const css = `
  html, body {
    background-color: #121212 !important;
    color: #e0e0e0 !important;
  }

  * {
    background-color: transparent !important;
    color: #e0e0e0 !important;
    border-color: #444 !important;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
`;

window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.innerText = css;
  document.head.appendChild(style);
});
