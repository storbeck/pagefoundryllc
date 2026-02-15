import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Paragraph({title, children}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold leading-7 sm:text-2xl sm:leading-8">
        {title}
      </h2>
      {children}
    </div>
  );
}
