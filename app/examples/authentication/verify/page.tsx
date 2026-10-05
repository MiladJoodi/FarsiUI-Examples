import { AuthVerify } from "@/components/auth-example/auth-verify"

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; from?: string }>
}) {
  const params = await searchParams
  return <AuthVerify email={params.email} from={params.from} />
}
