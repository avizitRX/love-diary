"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, AlertCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { signup, SignupActionState } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SignupFormProps = React.ComponentProps<"div"> & {
  next?: string;
};

export function SignupForm({ className, next, ...props }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState<
    SignupActionState,
    FormData
  >(signup, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to start your love diary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {next ? <input type="hidden" name="next" value={next} /> : null}

            {state?.error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{state.error}</AlertTitle>
                {state.message && (
                  <AlertDescription>{state.message}</AlertDescription>
                )}
              </Alert>
            )}

            <FieldGroup>
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    placeholder="John"
                    defaultValue={state?.inputs?.firstName ?? ""}
                    disabled={isPending}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    placeholder="Doe"
                    defaultValue={state?.inputs?.lastName ?? ""}
                    disabled={isPending}
                    required
                  />
                </Field>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  defaultValue={state?.inputs?.email ?? ""}
                  disabled={isPending}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isPending}
                  required
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isPending}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <FieldDescription className="text-center pt-2">
                  Already have an account?{" "}
                  <Link
                    href={
                      next
                        ? `/login?next=${encodeURIComponent(next)}`
                        : "/login"
                    }
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
