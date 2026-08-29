import type { WorkoutSession } from '../../types/workout'
import { EmptyState } from '../ui/EmptyState'
import { SessionCard } from './SessionCard'

interface SessionListProps {
  sessions: WorkoutSession[]
  emptyTitle?: string
  emptyDescription?: string
}

export function SessionList({
  sessions,
  emptyTitle = 'هنوز تمرینی ثبت نشده',
  emptyDescription = 'اولین تمرین خود را شروع کنید.',
}: SessionListProps) {
  if (sessions.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
