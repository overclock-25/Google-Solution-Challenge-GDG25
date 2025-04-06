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
import { LucideUserPlus, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { firebaseErrorMessages } from "@/lib/utils";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client";

import GoogleIcon from "@/components/svgIcons/googleIcon";
import { useGetUserQuery } from "@/lib/redux/authApi";
import { useRouter } from "next/navigation";

const SignUpPage = () => {

  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();

  useEffect(() => {
    if (user) {
      router.replace("/farms");
    }
  }, [user, router]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordLength, setPasswordLength] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        setPasswordLength(value.length >= 8);
      }

      if (formData.password && formData.confirmPassword) {
        if (name === "password") {
          setPasswordMatch(value === formData.confirmPassword);
        } else {
          setPasswordMatch(value === formData.password);
        }
      }
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      // console.log({ user });
      const idToken = await user.getIdToken();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: formData.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return { success: true, token: idToken };
    } catch (error) {
      console.log("Sign up error:", error);
      throw new Error(error.message || "Sign up failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await handleSignUp();

      window.location.href = "/farms";
    } catch (err) {
      console.log(err.message);
      setError({
        title: "Sign up failed",
        description: "Please Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const idToken = await user.getIdToken();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "User",
        }),
      });

      if (response.ok) {
        window.location.href = "/farms";
      } else {
        console.log("Failed to register user in backend");
      }
    } catch (error) {
      console.log("Google sign-in error:", error);
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
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <LucideUserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to sign up
          </CardDescription>
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
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full ${
                  !passwordLength && formData.password
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {!passwordLength && formData.password && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Password must be at least 8 characters</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full ${
                  !passwordMatch && formData.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : formData.confirmPassword && passwordMatch
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
                }`}
              />

              {formData.confirmPassword && (
                <div
                  className={`flex items-center text-sm mt-1 ${
                    passwordMatch ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {passwordMatch ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              variant="success"
              disabled={
                !passwordMatch ||
                !passwordLength ||
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                loading
              }
            >
              {loading ? "Please wait..." : "Create account"}
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
            disabled={loading}
          >
            <GoogleIcon />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
