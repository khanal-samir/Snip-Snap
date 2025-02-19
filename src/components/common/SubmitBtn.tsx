"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="font-bold">
      {pending ? "Processing .." : "Submit"}
    </Button>
  );
}
