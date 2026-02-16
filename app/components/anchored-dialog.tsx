"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";

type AnchoredDialogProps = {
  children: ReactNode;
  width?: "md" | "lg" | "xl";
};

const widthClass: Record<NonNullable<AnchoredDialogProps["width"]>, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-5xl",
};

const AnchoredDialog = forwardRef<HTMLDialogElement, AnchoredDialogProps>(
  function AnchoredDialog({ children, width = "lg" }, ref) {
    const innerRef = useRef<HTMLDialogElement | null>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLDialogElement, []);

    useEffect(() => {
      const dialog = innerRef.current;
      if (!dialog) return;

      const body = document.body;
      const previousOverflow = body.style.overflow;
      const previousPaddingRight = body.style.paddingRight;

      const lockBody = () => {
        const scrollBarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollBarWidth > 0) {
          body.style.paddingRight = `${scrollBarWidth}px`;
        }
      };

      const unlockBody = () => {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;
      };

      const syncState = () => {
        if (dialog.open) lockBody();
        else unlockBody();
      };

      const observer = new MutationObserver(syncState);
      observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
      dialog.addEventListener("close", syncState);
      dialog.addEventListener("cancel", syncState);
      syncState();

      return () => {
        observer.disconnect();
        dialog.removeEventListener("close", syncState);
        dialog.removeEventListener("cancel", syncState);
        unlockBody();
      };
    }, []);

    return (
      <dialog
        ref={innerRef}
        className={[
          "fixed left-1/2 top-1/2 m-0 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 border bg-white dark:bg-black dark:text-white p-0 shadow-xl",
          widthClass[width],
        ].join(" ")}
      >
        {children}
      </dialog>
    );
  },
);

export default AnchoredDialog;
