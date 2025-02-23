"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Password from "../common/Password";
import Link from "next/link";
import { SubmitButton } from "../common/SubmitBtn";
import { IResponse } from "@/index";
import { useActionState, useEffect } from "react";
import { checkLogin } from "@/actions/authActions";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const initState: IResponse = {
    errors: {},
    message: "",
    status: 0,
    data: {},
  };
  const [state, formAction] = useActionState(checkLogin, initState);
  useEffect(() => {
    if (state.status === 200) {
      signIn("credentials", {
        email: state.data?.email,
        password: state.data?.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
      toast.success(state.message);
    }
    if (state.status && state.status >= 400 && state.status !== 422) {
      toast.error(state.message);
    }
    if (state.status === 422) {
      toast.warning(state.message);
    }
  }, [state]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Snip Snap account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                <span className="text-sm text-red-600">
                  {state.errors?.email}
                </span>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Password indentifer="password" />
                <span className="text-sm text-red-600">
                  {state.errors?.password}
                </span>
              </div>

              <SubmitButton />
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Register
                </Link>
              </div>
            </div>
          </form>
          <Image
            src="/Hero.svg"
            width={300}
            alt="hero-1"
            height={300}
            className="m-auto w-full h-full"
            priority
          />
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
