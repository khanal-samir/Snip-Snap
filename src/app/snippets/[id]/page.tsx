import SnippetView from "@/components/snippet/snippet-view";

// Mock data for UI demonstration
const mockSnippet = {
  id: "snippet-123",
  title: "useLocalStorage.js",
  description:
    "A custom React hook to persist state in localStorage with automatic JSON serialization and type safety.",
  content: `import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value
 * @returns {[any, Function]} - State value and setter
 */
export function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function
  const setValue = (value) => {
    try {
      // Allow value to be a function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue];
}`,
  language: "javascript",
  isPublic: true,
  createdAt: "2023-06-15T10:30:00Z",
  updatedAt: "2023-06-16T14:45:00Z",
  userId: "user-123",
  user: {
    id: "user-123",
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=40&width=40",
  },
  stars: 42,
  forks: 12,
  starred: false,
};

export default async function SnippetPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the snippet and user data here
  const isOwner = true; // For UI demonstration

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <SnippetView snippet={mockSnippet} isOwner={isOwner} />
    </div>
  );
}
