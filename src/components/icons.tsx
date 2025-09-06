import type { SVGProps } from "react";

export const Icons = {
  DharmaWheel: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
      <path d="M12 14a2 2 0 0 1-2-2" />
      <path d="M14 12a2 2 0 0 1-2 2" />
      <path d="M10 12a2 2 0 0 1 2-2" />
      <path d="M12 10a2 2 0 0 1 2 2" />
    </svg>
  ),
};
