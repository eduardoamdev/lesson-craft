interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaProps) {
  return (
    <div className="space-y-3">
      <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 text-[#cbd5e1] min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 resize-none transition-all placeholder:text-[#475569]"
        placeholder={placeholder}
      />
    </div>
  );
}
