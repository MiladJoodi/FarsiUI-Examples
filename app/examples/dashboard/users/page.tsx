import { UsersDirectory } from "@/components/users/users-directory"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">مدیریت کاربران</h1>
        <p className="text-sm text-muted-foreground">
          فهرست کارت‌محور تیم و مشتریان با فیلتر سریع
        </p>
      </div>
      <UsersDirectory />
    </div>
  )
}
