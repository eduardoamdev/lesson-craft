import React from "react";

interface ActionBarProps {
  children: React.ReactNode;
}

/**
 * A responsive container for action buttons in the overview page.
 * Adapts the layout based on the number of buttons and screen size.
 *
 * @param {ActionBarProps} props - The children elements to be rendered as buttons.
 * @returns {JSX.Element} The rendered action bar.
 */
export default function ActionBar({ children }: ActionBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:justify-center gap-3 sm:gap-4 w-full max-w-5xl mx-auto px-4 py-2">
      {children}
    </div>
  );
}
