"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { Eye, EyeOff, Lock, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
          <Loader2 className="h-8 w-8 animate-spin text-[#0091CC]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSupportPortal = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.location.hostname.startsWith("tauk.");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(isSupportPortal ? "Login failed" : "Falha no login", {
          description: error.message,
        });
        return;
      }

      // Verify user exists in admin_users table
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id, role, is_active")
        .eq("id", signInData.user.id)
        .single();

      if (!adminUser || !adminUser.is_active) {
        await supabase.auth.signOut();
        toast.error(
          isSupportPortal
            ? "Unauthorized account. Contact your administrator."
            : "Conta nao autorizada. Contate o administrador."
        );
        return;
      }

      toast.success(
        isSupportPortal ? "Welcome back!" : "Bem-vindo de volta!"
      );

      // Route based on role
      const destination = adminUser.role === "support" ? "/support-dashboard" : redirectTo;
      router.push(destination);
      router.refresh();
    } catch {
      toast.error(
        isSupportPortal
          ? "Unexpected error. Try again."
          : "Erro inesperado. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ── Left: Brand Canvas ─────────── */}
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#e6f6fc] via-[#f0f9ff] to-[#f8f9fa] md:w-3/5 md:min-h-screen">
        {/* Soft aurora blobs */}
        <div
          className="absolute -left-[20%] top-[10%] h-[500px] w-[600px] rounded-full opacity-[0.30] blur-[120px]"
          style={{
            background: "radial-gradient(ellipse, #c8e6ff 0%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-[10%] top-[30%] h-[400px] w-[500px] rounded-full opacity-[0.25] blur-[100px]"
          style={{
            background: "radial-gradient(ellipse, #86ceff 0%, transparent 70%)",
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[30%] h-[350px] w-[450px] rounded-full opacity-[0.18] blur-[110px]"
          style={{
            background: "radial-gradient(ellipse, #0091CC 0%, transparent 70%)",
            animation: "pulse 7s ease-in-out infinite 4s",
          }}
        />

        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col px-8 py-16 md:px-20 md:py-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/logo-afterslim.svg"
            alt="AfterSlim"
            width={240}
            height={60}
            className="h-14 w-auto md:h-16"
            priority
          />
          <motion.p
            className="mt-4 text-lg font-medium tracking-tight text-[#00628c]/70 md:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {isSupportPortal
              ? "Support Portal"
              : "Supplement Management Platform"}
          </motion.p>
        </motion.div>

        {/* Secure badge (desktop only) - glass */}
        <motion.div
          className="absolute bottom-12 left-20 hidden items-center gap-3 rounded-xl glass-subtle px-5 py-3 md:flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Shield className="h-4 w-4 text-[#0091CC]" />
          <span className="text-sm font-medium tracking-wide text-[#3f484f]">
            Secure Admin Access
          </span>
        </motion.div>
      </section>

      {/* ── Right: Login Form ───────────────────────── */}
      <main className="flex w-full flex-1 flex-col items-center justify-center bg-white px-6 py-12 md:w-2/5 md:px-12">
        <motion.div
          className="flex w-full max-w-[420px] flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          {/* Header */}
          <header className="mb-10">
            <h2 className="text-headline text-[#09141e]">
              {isSupportPortal ? "Welcome back" : "Bem-vindo de volta"}
            </h2>
            <p className="mt-2 text-sm text-[#6f7881]">
              {isSupportPortal
                ? "Sign in to your account"
                : "Entre na sua conta"}
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <label className="text-label ml-1 block text-[#6f7881]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isSupportPortal ? "your@email.com" : "admin@afterslim.com"
                }
                required
                autoComplete="email"
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] placeholder:text-[#bec8d1] transition-all duration-300 focus:border-[#0091CC] focus:outline-none focus:ring-2 focus:ring-[#0091CC]/20 focus:shadow-glow-blue disabled:opacity-50"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <div className="ml-1 flex items-center justify-between">
                <label className="text-label text-[#6f7881]">
                  {isSupportPortal ? "Password" : "Senha"}
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#0091CC] transition-colors hover:text-[#007CB0]"
                >
                  {isSupportPortal ? "Forgot password?" : "Esqueceu a senha?"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] px-4 pr-12 text-sm text-[#191c1d] placeholder:text-[#bec8d1] transition-all duration-300 focus:border-[#0091CC] focus:outline-none focus:ring-2 focus:ring-[#0091CC]/20 focus:shadow-glow-blue disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bec8d1] transition-colors hover:text-[#6f7881]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg shadow-[#0091CC]/15 transition-all duration-300 hover:shadow-[#0091CC]/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #0091CC 0%, #007CB0 100%)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSupportPortal ? "Signing in..." : "Entrando..."}
                </>
              ) : isSupportPortal ? (
                "Sign in"
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.footer
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-xs text-[#bec8d1]">
              {isSupportPortal
                ? "Authorized personnel only. All actions are logged."
                : "Uso interno. Acesso nao autorizado e proibido."}
            </p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
}
