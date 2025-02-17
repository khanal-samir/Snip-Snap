import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout, Code2, UserCircle, Star, GitFork, Bot } from "lucide-react";

const featureItems = [
  {
    icon: Layout,
    title: "Intuitive Dashboard",
    description:
      "Clean and organized interface to manage all your code snippets in one place",
  },
  {
    icon: Code2,
    title: "Smart Snippets",
    description:
      "Store and organize your code snippets with syntax highlighting and tags",
  },
  {
    icon: UserCircle,
    title: "Developer Profiles",
    description:
      "Showcase your expertise and share your coding knowledge with the community",
  },
  {
    icon: Star,
    title: "Favorites",
    description: "Save and bookmark your most-used snippets for quick access",
  },
  {
    icon: GitFork,
    title: "Fork & Modify",
    description:
      "Build upon others' work by forking and customizing snippets to your needs",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Get intelligent suggestions and help with your code using our AI features",
  },
];

export default function Features() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-10">
        Features
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <item.icon className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
              <CardDescription className="mt-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-20 bg-blue-100 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
