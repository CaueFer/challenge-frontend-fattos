import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";

type CustomScrollBarProps = {
  children: ReactNode;
};

const CustomScrollBar = ({ children }: CustomScrollBarProps) => {
  return <SimpleBar style={{ maxHeight: "300px" }}>{children}</SimpleBar>;
};

export default CustomScrollBar;
