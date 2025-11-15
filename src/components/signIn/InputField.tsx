/**
 * InputField Component
 * 
 * A reusable input field component with:
 * - Label
 * - Input with icon support
 * - Optional password visibility toggle
 * - Consistent styling and focus states
 * - Full responsive design
 * 
 * @param label - The label text for the input
 * @param type - Input type (text, email, password, etc.)
 * @param name - Name attribute for form handling
 * @param value - Current input value
 * @param onChange - Change handler function
 * @param placeholder - Placeholder text
 * @param icon - Optional icon component to display inside the input
 * @param showPassword - For password fields, whether to show password
 * @param onTogglePassword - For password fields, toggle visibility handler
 * @param required - Whether the field is required
 */
interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
}

export default function InputField({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  icon,
  showPassword,
  onTogglePassword,
  required = false,
}: InputFieldProps) {
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          required={required}
        />
        {type === 'password' && onTogglePassword ? (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        ) : (
          icon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )
        )}
      </div>
    </div>
  );
}

