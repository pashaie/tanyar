import { Button } from '../ui/Button'

interface ConfirmFinishDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmFinishDialog({ open, onConfirm, onCancel }: ConfirmFinishDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-dialog-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
      >
        <h2 id="finish-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          پایان تمرین
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          آیا تمرین را تمام می‌کنید؟
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            انصراف
          </Button>
          <Button variant="primary" fullWidth onClick={onConfirm}>
            پایان
          </Button>
        </div>
      </div>
    </div>
  )
}
