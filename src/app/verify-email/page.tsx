"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState("");

  const verifyEmail = useMutation(api.auth.verifyEmail);

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided. Please check the link in your email.");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail({ token });
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-page">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-subtle bg-accent-primary" />
            <span className="text-2xl font-serif font-bold tracking-tight">Proe</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              {status === "loading" && (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              )}
              {status === "error" && (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>
            {status === "loading" && (
              <>
                <CardTitle className="text-center">Verifying your email...</CardTitle>
                <CardDescription className="text-center">
                  Please wait while we verify your email address.
                </CardDescription>
              </>
            )}
            {status === "success" && (
              <>
                <CardTitle className="text-center">Email verified!</CardTitle>
                <CardDescription className="text-center">
                  Your email has been successfully verified. You can now log in to your account.
                </CardDescription>
              </>
            )}
            {status === "error" && (
              <>
                <CardTitle className="text-center">Verification failed</CardTitle>
                <CardDescription className="text-center">
                  {errorMessage || "The verification link is invalid or has expired."}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="flex justify-center">
            {status !== "loading" && (
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}