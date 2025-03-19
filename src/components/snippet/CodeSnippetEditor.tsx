"use client";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetSchema } from "@/schema/snippetSchema";
import CodeEditor from "../../helpers/CodeEditor";
import { languages } from "@/lib/utils";
import { FileCode, Globe, Lock, Save, AlignLeft, Code2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CodeSnippetEditorProps, SnippetFormValues } from "@/index";

export default function CodeSnippetEditor({
  defaultValues = {
    title: "",
    description: "",
    content: "",
    isPublic: true,
    language: "javascript",
  },
  onSubmit,
  submitButtonText = "Create snippet",
  loadingText = "Creating...",
  isLoading = false,
}: CodeSnippetEditorProps) {
  const [isPublic, setIsPublic] = useState<boolean>(defaultValues.isPublic);

  // zod resolver
  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues,
  });

  return (
    <Card className="border shadow-md overflow-hidden">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit({ ...data, isPublic })
            )}
            className="space-y-0"
          >
            {/* Header section with title and language selector */}
            <div className="bg-muted/30 border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">
                    {submitButtonText === "Create snippet"
                      ? "New Snippet"
                      : "Edit Snippet"}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem
                                key={lang}
                                value={lang}
                                className="text-xs"
                              >
                                {lang.toLocaleUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Filename input */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Filename</span>
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter filename..."
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Code editor */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="overflow-hidden rounded-md border bg-background">
                        <CodeEditor
                          language={form.watch("language")}
                          value={field.value}
                          onChange={field.onChange}
                          height="350px"
                          readOnly={false}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description section with improved styling */}
            <div className="p-4 space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                        <AlignLeft className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Description</span>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add a description for your code snippet (optional)"
                          className="resize-none min-h-[150px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-sm"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Footer with public/private toggle and submit button */}
              <div className="flex items-center justify-between pt-4 border-t mt-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-switch"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <label
                      htmlFor="public-switch"
                      className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      {isPublic ? (
                        <>
                          <Globe className="h-4 w-4 text-primary" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Private
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? loadingText : submitButtonText}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
