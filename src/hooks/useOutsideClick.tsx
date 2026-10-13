import { useEffect } from "react";

interface Props {
  ref?: React.RefObject<HTMLElement>;
  handler: (event: Event) => void;
  msTimeout?: number;
}

export default function useOutsideClick({ ref, handler, msTimeout = 0 }: Props) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref?.current || ref.current.contains(event.target as Node)) return;

      if (msTimeout > 0) {
        setTimeout(() => handler(event), msTimeout);
      } else {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("focusin", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("focusin", listener);
    };
  }, [ref, handler, msTimeout]);

  return null;
}
