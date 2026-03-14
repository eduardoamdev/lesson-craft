import React from "react";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Title component for section or page headings.
 * Applies consistent styling for main titles.
 */
const Title: React.FC<TitleProps> = ({ children, className = "" }) => (
  <h1
    className={`text-4xl font-bold tracking-wide text-[#5daaf0] ${className}`.trim()}
  >
    {children}
  </h1>
);

export default Title;
