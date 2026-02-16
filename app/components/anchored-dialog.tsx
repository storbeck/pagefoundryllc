"use client";

import { forwardRef, type ReactNode } from "react";

type AnchoredDialogProps = {
  children: ReactNode;
  width?: "md" | "lg";
};

const widthClass: Record<NonNullable<AnchoredDialogProps["width"]>, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
};

const AnchoredDialog = forwardRef<HTMLDialogElement, AnchoredDialogProps>(
  function AnchoredDialog({ children, width = "lg" }, ref) {
    return (
      <dialog
        ref={ref}
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
