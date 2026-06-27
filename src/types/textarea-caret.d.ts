// Local declaration for textarea-caret until @types/textarea-caret is available.
declare module "textarea-caret" {
  interface Coordinates {
    top: number;
    left: number;
    height: number;
  }
  function getCaretCoordinates(
    element: HTMLTextAreaElement | HTMLInputElement,
    position: number,
    options?: object,
  ): Coordinates;
  export = getCaretCoordinates;
}
