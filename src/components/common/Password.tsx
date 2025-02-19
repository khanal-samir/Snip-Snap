"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function Password({ indentifer }: { indentifer: string }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        id={indentifer}
        name={indentifer}
        type={showPassword ? "text" : "password"}
        required
        placeholder="......"
      />
      <Button
        type="button"
        variant="ghost"
        onClick={() => setShowPassword(!showPassword)}
        className="hover:bg-transparent hover:opacity-100 absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
