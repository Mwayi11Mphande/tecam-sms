import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex flex-col items-center gap-3 font-medium">
              <Image
                src="/logo2.png"
                width={180}
                height={180}
                alt="site_logo"
                className="object-contain"
                priority
              />
              <span className="sr-only">SS</span>
            </a>
        <LoginForm />
      </div>
    </div>
  )
}
