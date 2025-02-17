import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function GetStarted() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Get Started For Free
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Start organizing and sharing your code snippets today. No payment
          required.
        </p>
        <Button size="lg" className="font-semibold">
          Start Creating Snippets
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          ✨ Start sharing your code in seconds
        </p>
      </div>
    </div>
  );
}
