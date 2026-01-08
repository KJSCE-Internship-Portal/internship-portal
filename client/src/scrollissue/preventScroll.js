export const preventNumberInputScroll = () => {
  document.addEventListener(
    "wheel",
    function (event) {
      const focused = document.activeElement;
      if (focused && focused.type === "number") {
        event.preventDefault();
      }
    },
    { passive: false }
  );
};
