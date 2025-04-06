"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LucideLogIn, Mail, AlertCircle } from "lucide-react";
import GoogleIcon from "@/components/svgIcons/googleIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client";

import { useGetUserQuery } from "@/lib/redux/authApi";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/farms");
    }
  }, [user, router]);

  async function handleSignIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log({ user });
      const idToken = await user.getIdToken();

      return { success: true, token: idToken };
    } catch (error) {
      // console.log("Sign in error:", error);
      // console.log(error.code)
      if (error.code == "auth/invalid-credential") {
        setError({
          title: "Invalid credentials",
          description:
            "The provided credentials are invalid. Please try again.",
        });
      } else {
        setError({
          title: "Sign in failed",
          description: "Please Try again.",
        });
      }
      throw new Error(error || "Sign in failed");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await handleSignIn();
      window.location.href = "/farms";
    } catch (err) {
      // console.log(err.code, err.message)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      window.location.href = "/farms";
    } catch (error) {
      // console.log(error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-emerald-300">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-emerald-300 rounded-full flex items-center justify-center">
              <LucideLogIn className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {error.title && (
          <Alert
            variant="destructive"
            className="animate-in fade-in duration-300"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error?.title}</AlertTitle>
            <AlertDescription>{error?.description}</AlertDescription>
          </Alert>
        )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                className="w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              size="lg"
              type="submit"
              variant="success"
              disabled={!email || !password || loading}
            >
              {loading ? "Please wait..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-muted-foreground text-sm">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
