
"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { useAuthStore } from "@/stores/auth/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    console.log('Login attempt with email:', email, 'and password:', password);

    try {
      await login(email, password);

      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        setError("Login failed: no user data");
        return;
      }

      // Route based on role
      switch (currentUser.role) {
        case "SUPER_ADMIN":
          router.push("/dev-dash");
          break;
        case "OWNER":
          router.push("/shop-owner");
          break;
        case "CASHIER":
          router.push("/shop-cashier");
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  )
}
