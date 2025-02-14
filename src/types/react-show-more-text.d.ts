// src/types/react-show-more-text.d.ts
declare module "react-show-more-text" {
  import { ReactNode } from "react";

  interface ShowMoreTextProps {
    lines: number;
    more: ReactNode;
    less: ReactNode;
    anchorClass?: string;
    expanded?: boolean;
    truncatedEndingComponent?: ReactNode;
    children?: ReactNode;
  }

  const ShowMoreText: React.FC<ShowMoreTextProps>;
  export default ShowMoreText;
}
