"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import Image from "next/image";
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
import { toast } from "sonner";
import { snippetSchema } from "@/schema/snippetSchema";
import CodeEditor from "./CodeEditor";
import { languages } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FileCode, Globe, Lock, Save, AlignLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateSnippet() {
  const [isPublic, setIsPublic] = useState(true);
  // zod resolver
  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      isPublic: true,
      language: "javascript",
    },
  });

  // create snippet api call
  const mutation = useMutation({
    mutationFn: async (newSnippet: z.infer<typeof snippetSchema>) => {
      const { data } = await axios.post("/api/snippets", newSnippet);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Snippet created successfully");
      form.reset();
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Snip Snap Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Snip</span>
            <span>Snap</span>
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Create a new code snippet
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                mutation.mutate({ ...data, isPublic })
              )}
              className="space-y-0"
            >
              <div className="bg-muted/20 border-b p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 flex-1">
                    <FileCode className="h-5 w-5 text-primary" />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Filename including extension..."
                              className="border-0 bg-transparent text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
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
                            height="300px"
                            readOnly={false}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted/50 px-3 py-2 border-b flex items-center gap-2">
                          <AlignLeft className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            Description
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add a description for your code snippet (optional)"
                            className="resize-none min-h-[120px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-3 text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-2">
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
                    disabled={mutation.isPending}
                    className="px-4 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {mutation.isPending ? "Creating..." : "Create snippet"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
