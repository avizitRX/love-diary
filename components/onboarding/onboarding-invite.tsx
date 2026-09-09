"use client";

import { useState } from "react";
import { Check, Copy, Heart, Loader2, QrCode } from "lucide-react";
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

export function OnboardingInvite() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreateInvite() {
    try {
      setLoading(true);

      const result = await createInvite();

      if (!result.success) {
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

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-lg">
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
              They can join by scanning <strong>QR code</strong> or opening your <strong>invitation link.</strong>
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
    </main>
  );
};
