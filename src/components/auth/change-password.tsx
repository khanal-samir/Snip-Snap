"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import Password from "../common/Password";
import { useSearchParams } from "next/navigation";
import { IResponse } from "@/index";
import { useActionState, useEffect } from "react";
import { changePassword } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function ChangePassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const queries = useSearchParams();
  const router = useRouter();
  const initState: IResponse = {
    message: "",
    errors: {},
    status: 0,
  };
  const [state, formAction] = useActionState(changePassword, initState);
  useEffect(() => {
    if (state.status === 200) {
      toast.success(state.message);
      router.push("/login");
    }
    if (state.status && state.status >= 400 && state.status !== 422) {
      toast.error(state.message);
    }
    if (state.status == 422) {
      toast.warning(state.message);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.svg" height={100} width={100} alt="logo" />
            <h1 className="text-xl font-bold">Snip Snap</h1>
            <p className=" text-center text-balance text-muted-foreground">
              Enter your <strong>new password</strong>.
            </p>
          </div>

          <input
            type="token"
            value={queries.get("token") || ""}
            name="token"
            hidden
            readOnly
          />
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Email</Label>
              <Input
                type="email"
                value={queries.get("email") || ""}
                name="email"
                hidden
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Password indentifer="password" />
              {state.errors && (
                <span className="text-red-600 text-sm">
                  {state.errors.password}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Password indentifer="confirm-password" />
              {state.errors && (
                <span className="text-red-600 text-sm">
                  {state.errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <SubmitButton />
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
