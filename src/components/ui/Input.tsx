interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

/**
 * A reusable labeled text input component.
 *
 * @param {InputProps} props - Input properties including label and value handlers.
 * @returns {JSX.Element} The rendered input field with label.
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <div className="space-y-3">
      <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl px-6 py-4 text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 transition-all placeholder:text-[#475569]"
        placeholder={placeholder}
      />
    </div>
  );
}
