import { ReactNode } from "react";

function Wrapper(props: {
  children: ReactNode,
  className?: string,
  limitWidth?: boolean,
  maxWidth?: string,
}) {
  const {
    className,
    children,
    limitWidth = true,
    maxWidth = "max-w-[1280px]",
  } = props;
  return (
    <div className="w-full flex justify-center flex-grow">
      <div className={
        "container w-full flex-grow"
        + " "
        + className
        + " "
        + (limitWidth ? maxWidth : "")}
      >
        {children}
      </div>
    </div>
  );
}

export default Wrapper;
