"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import { IResponse } from "@/index";
import { useActionState, useEffect } from "react";
import { forgotPassword } from "@/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const initState: IResponse = {
    message: "",
    status: 0,
    errors: {},
  };
  const [state, formAction] = useActionState(forgotPassword, initState);
  const router = useRouter();
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
            <h1 className="text-xl font-bold">
              {" "}
              <span className="text-primary">Snip</span>
              <span>Snap</span>
            </h1>
            <p className=" text-center text-balance text-muted-foreground">
              Forgot your password? <br />
              Enter your <strong>email</strong> to get{" "}
              <strong>password reset link</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
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
