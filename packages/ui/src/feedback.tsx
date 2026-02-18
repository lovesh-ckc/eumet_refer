import React from "react";
import { cn } from "./utils";
import { Loader2 } from "lucide-react";

/**
 * Skeleton component for loading states
 * Uses a shimmer effect
 */
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
      {...props}
    />
  );
};

/**
 * Full screen loading overlay with branding
 */
export const LoadingScreen = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Eumetise Logo Placeholder or Spinner */}
        <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-accent-500 border-t-transparent animate-spin"></div>
            {/* Optional: Add Eumetise Logo center if available */}
        </div>
        <p className="text-body text-gray-500 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
};

/**
 * Section loading state
 */
export const LoadingSection = ({ className, text }: { className?: string; text?: string }) => {
    return (
        <div className={cn("flex flex-col items-center justify-center h-full min-h-[200px] w-full gap-3", className)}>
             <Loader2 className="h-8 w-8 text-accent-500 animate-spin" />
             {text && <p className="text-caption text-gray-400">{text}</p>}
        </div>
    );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full space-y-3">
            <div className="flex items-center space-x-4 mb-4">
               <Skeleton className="h-8 w-[250px]" />
               <div className="flex-1" />
               <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex gap-4">
                        {Array.from({ length: columns }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                             {Array.from({ length: columns }).map((_, j) => (
                                <Skeleton key={j} className="h-4 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
