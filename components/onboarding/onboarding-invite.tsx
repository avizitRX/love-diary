"use client";

import { useState } from "react";
import { Check, Copy, Heart, Loader2, LogOut, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createInvite } from "@/app/dashboard/(onboarding)/onboarding/actions";
import Logo from "../branding/logo";
import { logout } from "@/app/(auth)/login/actions";

export function OnboardingInvite() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleCreateInvite() {
    try {
      setLoading(true);

      const result = await createInvite();

      if (!result.success || result.url == null) {
        throw new Error(result.error);
      }

      setInviteUrl(result.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!inviteUrl) return;

    await navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null);
      await logout();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string" &&
        ((err as { message: string }).message.includes("NEXT_REDIRECT") ||
          (err as { message: string }).message.includes("NEXT_NOT_FOUND"))
      ) {
        return;
      }
      setLogoutError("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-between p-6">
      <div className="flex w-full justify-center pt-2">
        <Logo />
      </div>

      <div className="w-full max-w-lg my-auto py-8">
        <div className="mb-8 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Heart className="size-6" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Invite your partner
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your little world starts with two. Invite your partner to create
            your private space together.
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Invite your partner</CardTitle>

            <CardDescription>
              They can join by scanning <strong>QR code</strong> or opening your{" "}
              <strong>invitation link.</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!inviteUrl ? (
              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateInvite}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating invitation...
                  </>
                ) : (
                  <>
                    <QrCode />
                    Create invitation
                  </>
                )}
              </Button>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="rounded-xl border bg-background p-5">
                    <QRCodeSVG
                      value={inviteUrl}
                      size={220}
                      level="M"
                      marginSize={2}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">Scan to join Love Diary</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your partner can scan this code with their phone.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs uppercase text-muted-foreground">
                    or
                  </span>
                  <Separator className="flex-1" />
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
                  <p className="min-w-0 flex-1 truncate px-2 text-sm">
                    {inviteUrl}
                  </p>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleCopy}
                    aria-label="Copy invitation link"
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy />
                      Copy invitation link
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  This invitation can only be used once.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full max-w-lg flex-col items-center pb-2">
        {logoutError && (
          <p className="px-2 pb-2 text-xs text-destructive">{logoutError}</p>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </main>
  );
}
