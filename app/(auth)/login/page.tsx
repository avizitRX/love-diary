import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";

import { LoginForm } from "@/components/login/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message, next } = await searchParams;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="self-center font-medium">
          Love Diary
        </Link>

        {error ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>

            {message ? <AlertDescription>{message}</AlertDescription> : null}
          </Alert>
        ) : null}

        <LoginForm next={next} />
      </div>
    </main>
  );
}
