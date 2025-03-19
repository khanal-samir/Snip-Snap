"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeCode } from "@/lib/gemini";
interface AiExplanationDialogProps {
  snippetContent: string;
}

export default function AiExplanationDialog({
  snippetContent,
}: AiExplanationDialogProps) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeCode = async () => {
    if (!snippetContent) {
      toast.error("No code snippet to analyze");
      return;
    }

    try {
      setIsLoading(true);
      setOpen(true);
      const response = await analyzeCode(snippetContent);
      setExplanation(response);
    } catch (error) {
      toast.error("Failed to analyze code. Please try again.");
      console.error("AI analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className="text-xs gap-1.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        onClick={handleAnalyzeCode}
      >
        <Sparkles className="h-4 w-4" />
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl px-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Code Analysis
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Analyzing your code...</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This may take a few moments
                </p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {explanation ? (
                  <div className="whitespace-pre-wrap">{explanation}</div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No analysis available
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
