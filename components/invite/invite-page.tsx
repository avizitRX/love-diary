"use client";

import { useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  acceptInvite,
  declineInvite,
} from "@/app/invite/[token]/actions";

type InvitePageProps = {
  token: string;
  inviterName: string;
  expiresAt: string;
};

export function InvitePage({
  token,
  inviterName,
  expiresAt,
}: InvitePageProps) {
  const [isPending, startTransition] = useTransition();

  function handleAccept() {
    startTransition(() => {
      void acceptInvite(token);
    });
  }

  function handleDecline() {
    startTransition(() => {
      void declineInvite(token);
    });
  }

  const expiration = new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
    },
  ).format(new Date(expiresAt));

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="m-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Heart className="size-7" />
          </div>

          <CardTitle className="text-2xl">You&apos;ve been invited</CardTitle>

          <CardDescription>
            <strong>{inviterName}</strong> invited you to create your little
            world together on Love Diary.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <p className="font-medium">{inviterName}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              wants to be your partner on Love Diary
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={isPending}
            onClick={handleAccept}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Heart />
                Accept invitation
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            disabled={isPending}
            onClick={handleDecline}
          >
            Decline
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            This invitation expires on {expiration}.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
