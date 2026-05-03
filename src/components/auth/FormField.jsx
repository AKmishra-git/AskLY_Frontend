export default function FormField({ label, error, ...inputProps }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium dark:text-white/60 text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className={`w-full rounded-xl px-4 py-3 text-sm
          dark:bg-white/5 bg-gray-50
          dark:border border border-transparent dark:focus:border-accent-500/50 focus:border-accent-500/50
          dark:text-white text-gray-900
          dark:placeholder-white/25 placeholder-gray-400
          focus:outline-none focus:ring-2 dark:focus:ring-accent-500/20 focus:ring-accent-500/20
          transition-all duration-200
          ${error ? 'border-red-500/50 dark:border-red-500/50 focus:ring-red-500/20' : ''}
          ${inputProps.className || ''}`}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  )
}
