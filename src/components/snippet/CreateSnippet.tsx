"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { snippetSchema } from "@/schema/snippetSchema";
import CodeEditor from "./CodeEditor";
import { languages } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function CreateSnippet() {
  //zod resolver
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
      // add caching and revaliadte query
      //   console.log(data);
      toast.success("Snippet created successfully");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Snippet title" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter description title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <CodeEditor
                  language={form.watch("language")} // dynamically update the language
                  value={field.value}
                  onChange={field.onChange}
                  height="300px"
                  readOnly={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Create Snippet"}
        </Button>
      </form>
    </Form>
  );
}

// queryClient.setQueryData(["posts", data.id], data)// immediately caches after creating prevents loading
//   queryClient.invalidateQueries(["posts"], { exact: true })// if there is cached timer to invalidate the cach and fetch new data
