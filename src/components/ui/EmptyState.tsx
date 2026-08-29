interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/50">
      <p className="text-base font-medium text-gray-700 dark:text-gray-200">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      ) : null}
    </div>
  )
}
