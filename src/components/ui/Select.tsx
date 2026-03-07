interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

/**
 * A reusable labeled dropdown select component.
 *
 * @param {SelectProps} props - Component properties including label and options.
 * @returns {JSX.Element} The rendered select element with custom styling.
 */
export default function Select({
  label,
  value,
  onChange,
  options,
}: SelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl px-6 py-4 text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 transition-all appearance-none cursor-pointer"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#1c1c1c]"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569]">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
