type Props = {
  id: string;
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export function FormField({
  id,
  name,
  label,
  type = 'text',
  multiline,
  rows = 4,
  autoComplete,
  defaultValue,
  placeholder,
  error,
  required,
}: Props) {
  const errorId = `${id}-error`;
  const common = {
    id,
    name,
    defaultValue,
    placeholder,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `mt-2 block w-full rounded-2xl border bg-neutral-100 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
      error ? 'border-orange-500' : 'border-transparent'
    }`,
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm text-neutral-500">
        {label}
      </label>
      {multiline ? (
        <textarea {...common} rows={rows} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-[#9A4A33]">
          {error}
        </p>
      )}
    </div>
  );
}
