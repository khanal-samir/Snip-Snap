import Image from "next/image";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import Password from "../common/Password";

export default function ChangePassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.svg" height={100} width={100} alt="logo" />
            <h1 className="text-xl font-bold">Snip Snap</h1>
            <p className=" text-center text-balance text-muted-foreground">
              Enter your <strong>new password</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Password indentifer="password" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Password indentifer="confirm-password" />
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
