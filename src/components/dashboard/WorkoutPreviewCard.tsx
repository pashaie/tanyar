import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatPlanItemLabel } from '../../lib/plan'
import { toPersianDigits } from '../../lib/format'
import {
  DifficultyBars,
  WorkoutTypeIcon,
  workoutGradient,
  workoutTitle,
} from '../../lib/icons'
import type { PlanItem } from '../../types/plan'

interface WorkoutPreviewCardProps {
  item: PlanItem
  onStart?: () => void
}

function getDifficulty(item: PlanItem): 1 | 2 | 3 {
  if (item.type === 'rest') return 1
  if (item.type === 'strength') return 3
  if ((item.durationMinutes ?? 0) >= 60) return 3
  if ((item.durationMinutes ?? 0) >= 30) return 2
  return 1
}

export function WorkoutPreviewCard({ item, onStart }: WorkoutPreviewCardProps) {
  const navigate = useNavigate()

  if (item.type === 'rest') return null

  const duration = item.durationMinutes ?? 30
  const difficulty = getDifficulty(item)

  return (
    <Card padding="none" className="min-w-[220px] overflow-hidden">
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${workoutGradient(item.type)}`}>
        <div className="absolute inset-0 bg-black/10" />
        <span className="relative text-white/90">
          <WorkoutTypeIcon type={item.type} />
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{workoutTitle(item.type)}</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formatPlanItemLabel(item)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{toPersianDigits(duration)} دقیقه</span>
          <div className="flex items-center gap-1.5">
            <DifficultyBars level={difficulty} />
            <span>{difficulty === 1 ? 'مبتدی' : difficulty === 2 ? 'متوسط' : 'پیشرفته'}</span>
          </div>
        </div>
        <Button
          variant="outline"
          fullWidth
          className="min-h-10 text-sm"
          onClick={() => (onStart ? onStart() : navigate('/workout'))}
        >
          شروع تمرین
        </Button>
      </div>
    </Card>
  )
}
