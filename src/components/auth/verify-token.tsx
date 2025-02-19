"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { SubmitButton } from "../common/SubmitBtn";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { IToken } from "@/index";
import { Input } from "../ui/input";

const VerifyToken = ({
  isActive = false,
  setIsActive,
  email = null,
}: IToken) => {
  return (
    <Dialog open={isActive} onOpenChange={setIsActive}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          <div className="mx-auto rounded-full bg-blue-100 p-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Verify Your Email
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to
            {email && (
              <span className="mx-1 font-medium text-blue-600">{email}</span>
            )}
            . Enter the code below to confirm your email address.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 flex flex-col items-center justify-center gap-4">
          <Input className="hidden" name="email" value={email!} readOnly />

          <InputOTP maxLength={6} name="token" className="gap-2">
            <InputOTPGroup className="gap-2">
              <InputOTPSlot
                index={0}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <InputOTPSlot
                index={1}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <InputOTPSlot
                index={2}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-2">-</InputOTPSeparator>
            <InputOTPGroup className="gap-2">
              <InputOTPSlot
                index={3}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <InputOTPSlot
                index={4}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <InputOTPSlot
                index={5}
                className="h-12 w-12 border-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </InputOTPGroup>
          </InputOTP>

          <div className="flex w-full flex-col gap-4">
            <SubmitButton />
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Didn&apos;t receive the code? Resend
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyToken;
