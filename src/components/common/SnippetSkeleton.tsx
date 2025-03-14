import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Code, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SnippetsLoading() {
  const placeholders = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {placeholders.map((placeholder) => (
        <Card key={placeholder} className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <div className="flex items-center text-sm text-muted-foreground">
                <Code className="mr-1 h-3 w-3 text-muted-foreground/50" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground/30" />
              <span className="sr-only">Menu</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Eye className="mr-1 h-3 w-3 text-muted-foreground/30" />
                View
              </Button>
              <div className="flex items-center text-xs text-muted-foreground/30">
                <Calendar className="mr-1 h-3 w-3" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
