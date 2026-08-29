interface StatCardProps {
  label: string
  value: string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  )
}
