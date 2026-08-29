import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="mx-auto min-h-svh max-w-md bg-gray-50 dark:bg-gray-950">
      <main className="px-4 pb-24 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
