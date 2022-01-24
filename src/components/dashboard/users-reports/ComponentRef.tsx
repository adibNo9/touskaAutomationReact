import React from "react";

export const ComponentToPrint = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    return <div ref={ref}></div>;
  }
);
