interface WorkoutControlsProps {
  status: 'idle' | 'running' | 'paused'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onFinish: () => void
}

export function WorkoutControls({
  status,
  onStart,
  onPause,
  onResume,
  onFinish,
}: WorkoutControlsProps) {
  return (
    <div className="flex items-end justify-center gap-6">
      <ControlButton label="پایان" onClick={onFinish} disabled={status === 'idle'}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5l7 7-7 7M14 5l7 7-7 7" />
        </svg>
      </ControlButton>

      {status === 'idle' ? (
        <ControlButton label="شروع" primary onClick={onStart}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </ControlButton>
      ) : status === 'running' ? (
        <ControlButton label="مکث" primary onClick={onPause}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
          </svg>
        </ControlButton>
      ) : (
        <ControlButton label="ادامه" primary onClick={onResume}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </ControlButton>
      )}

      <ControlButton label="شروع" disabled onClick={onStart}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 5v14l11-7z" />
        </svg>
      </ControlButton>
    </div>
  )
}

function ControlButton({
  children,
  label,
  primary = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode
  label: string
  primary?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex flex-col items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        className={[
          'flex items-center justify-center rounded-full transition-transform active:scale-95',
          primary
            ? 'h-20 w-20 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : 'h-14 w-14 bg-white text-emerald-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700',
        ].join(' ')}
      >
        {children}
      </span>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}</span>
    </button>
  )
}
