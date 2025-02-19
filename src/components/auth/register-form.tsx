"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Password from "../common/Password";
import { SubmitButton } from "../common/SubmitBtn";
import { GenderSelect } from "../common/GenderSelect";
import { useActionState } from "react";
import { handleRegister } from "@/actions/authActions";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [error, formAction] = useActionState(handleRegister, null);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={formAction}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to Snip Snap</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to register your account
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
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Password indentifer="confirm-password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gender</Label>
          <GenderSelect
            name="gender" // Important: name attribute is used by FormData
          />
        </div>
        <SubmitButton />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
