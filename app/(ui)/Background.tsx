import { ReactNode } from "react";

function Background(props: {
  children: ReactNode,
  scrollable?: boolean,
  className?: string,
}) {
  const {
    children,
    scrollable = true,
    className,
  } = props;
  return (
    <div>
        {children}
    </div>
  );
}

export default Background;
