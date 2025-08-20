import { CommonHeader } from '@/shared/CommonHeader'
import { Login } from '@/widgets/home/Login'

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <CommonHeader title="로그인" />
      <main className="mx-auto pt-[75px]">
        <Login />
      </main>
    </div>
  )
}
