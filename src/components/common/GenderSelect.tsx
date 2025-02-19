"use client";
// components/common/GenderSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
  name?: string;
}

export function GenderSelect({ name = "gender" }: GenderSelectProps) {
  return (
    <Select name={name}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Male</SelectItem>
        <SelectItem value="female">Female</SelectItem>
        <SelectItem value="others">Others</SelectItem>
      </SelectContent>
    </Select>
  );
}
