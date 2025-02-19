"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Password from "../common/Password";
import { SubmitButton } from "../common/SubmitBtn";
import { GenderSelect } from "../common/GenderSelect";
import { useActionState, useState } from "react";
import { handleRegister } from "@/actions/authActions";
import { IState } from "@/index";
import Link from "next/link";
import VerifyToken from "./verify-token";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const initState: IState = {
    status: 0,
    message: "",
    errors: {},
    data: {},
  };
  const [active, setIsActive] = useState(true);
  const [state, formAction] = useActionState(handleRegister, initState);
  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        action={formAction}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register to Snip Snap</h1>
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
              required
            />
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Password indentifer="passsword" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <GenderSelect />
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
        email="gdssamir@gmail.com"
      />
    </>
  );
}
