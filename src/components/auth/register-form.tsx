"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Password from "../common/Password";
import { SubmitButton } from "../common/SubmitBtn";
import { useActionState, useEffect, useState } from "react";
import { handleRegister } from "@/actions/authActions";
import { IResponse as IState } from "@/index";
import Link from "next/link";
import VerifyToken from "./verify-token";
import { toast } from "sonner";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const initState: IState = {
    status: 0,
    message: "",
    errors: {},
  };
  const [active, setIsActive] = useState(false);
  const [state, formAction] = useActionState(handleRegister, initState);
  const [inputField, setInputField] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (state.status === 201) {
      toast.success(state.message);
      setIsActive(true);
    }
    if (state.status && state.status >= 400 && state.status !== 422) {
      toast.error(state.message);
    }
    if (state.status === 422) {
      toast.warning(state.message);
    }
  }, [state]);
  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        action={formAction}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            Register to <span className="text-primary">Snip</span>
            <span>Snap</span>
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to register your account.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="JohnDoe@123"
              value={inputField.username}
              onChange={(e) =>
                setInputField({ ...inputField, username: e.target.value })
              }
              required
            />
            {state.errors && (
              <span className="text-red-600 text-sm">
                {state.errors.username}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={inputField.email}
              onChange={(e) =>
                setInputField({ ...inputField, email: e.target.value })
              }
              placeholder="m@example.com"
              required
            />
            {state.errors && (
              <span className="text-red-600 text-sm">{state.errors.email}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Password indentifer="password" />
            {state.errors && (
              <span className="text-red-600 text-sm">
                {state.errors.password}
              </span>
            )}
          </div>
          <SubmitButton />
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
      <VerifyToken
        isActive={active}
        setIsActive={setIsActive}
        email={inputField.email}
      />
    </>
  );
}
