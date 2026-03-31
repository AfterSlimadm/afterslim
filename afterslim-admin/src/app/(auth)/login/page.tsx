"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(isSupportPortal ? "Login failed" : "Falha no login", {
          description: error.message,
        });
        return;
      }

      toast.success(isSupportPortal ? "Welcome back!" : "Bem-vindo de volta!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error(isSupportPortal ? "Unexpected error. Try again." : "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand logo */}
        <div className="flex flex-col items-center space-y-3">
          <Image
            src="/logo-afterslim.svg"
            alt="AfterSlim"
            width={200}
            height={52}
            className="h-12 w-auto"
            priority
          />
          <p className="text-sm text-muted-foreground">
            {isSupportPortal ? "Support Portal" : "Painel Administrativo"}
          </p>
        </div>

        {/* Login card */}
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">
              {isSupportPortal ? "Sign In" : "Entrar"}
            </CardTitle>
            <CardDescription>
              {isSupportPortal
                ? "Enter your credentials to access the support portal"
                : "Insira suas credenciais para acessar o painel"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isSupportPortal ? "your@email.com" : "admin@afterslim.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {isSupportPortal ? "Password" : "Senha"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isSupportPortal ? "Enter your password" : "Digite sua senha"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSupportPortal ? "Signing in..." : "Entrando..."}
                  </>
                ) : (
                  isSupportPortal ? "Sign In" : "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          {isSupportPortal
            ? "Authorized personnel only. All actions are logged."
            : "Uso interno. Acesso nao autorizado e proibido."}
        </p>
      </div>
    </div>
  );
}
