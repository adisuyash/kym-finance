'use client'


interface AmountInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onMax?: () => void
  balance?: string
  placeholder?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export function AmountInput({
  label,
  value,
  onChange,
  onMax,
  balance,
  placeholder = '0.00',
  disabled = false,
  icon,
}: AmountInputProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium text-white/70'>{label}</label>
        {balance && (
          <span className='text-xs text-white/50'>
            Balance: <span className='text-white/70'>{balance}</span>
          </span>
        )}
      </div>
      <div className='relative'>
        <div className='flex items-center gap-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg p-4 focus-within:border-indigo-500/50 transition-colors'>
          {icon && <div className='text-white/50'>{icon}</div>}
          <input
            type='number'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className='flex-1 bg-transparent text-white text-lg font-medium outline-none placeholder:text-white/30'
          />
          {onMax && (
            <button
              onClick={onMax}
              className='px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md transition-colors'
            >
              MAX
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
