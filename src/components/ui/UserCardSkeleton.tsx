import { Card, CardBody, CardHeader } from "@heroui/react";

import { cn, themePresets } from "@/utils/theme";

interface UserCardSkeletonProps {
  className?: string;
}

export default function UserCardSkeleton({ className }: UserCardSkeletonProps) {
  // Используем твою систему тем
  const skeletonColor = "bg-gray-200 dark:bg-gray-700";
  
  return (
    <Card className={cn(themePresets.card, "w-full max-w-sm mx-auto", className)}>
      <CardHeader className="flex gap-3 justify-between items-start">
        <div className="flex gap-3 items-center flex-1">
          {/* Avatar skeleton */}
          <div className={cn("w-12 h-12 rounded-full animate-pulse", skeletonColor)} />
          
          <div className="flex flex-col gap-1 flex-1">
            {/* Name skeleton */}
            <div className={cn("h-4 rounded animate-pulse w-32", skeletonColor)} />
            {/* Username skeleton */}
            <div className={cn("h-3 rounded animate-pulse w-24", skeletonColor)} />
          </div>
        </div>
        
        {/* Rank skeleton */}
        <div className={cn("w-12 h-12 rounded-full animate-pulse", skeletonColor)} />
      </CardHeader>
      
      <CardBody className="pt-0">
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className={cn("h-3 rounded animate-pulse w-full", skeletonColor)} />
          <div className={cn("h-3 rounded animate-pulse w-3/4", skeletonColor)} />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2 mb-4">
          <div className={cn("h-5 rounded animate-pulse w-12", skeletonColor)} />
          <div className={cn("h-5 rounded animate-pulse w-16", skeletonColor)} />
          <div className={cn("h-5 rounded animate-pulse w-14", skeletonColor)} />
        </div>
        
        {/* Progress skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className={cn("h-3 rounded animate-pulse w-20", skeletonColor)} />
            <div className={cn("h-3 rounded animate-pulse w-16", skeletonColor)} />
          </div>
          <div className={cn("h-2 rounded animate-pulse w-full", skeletonColor)} />
        </div>
      </CardBody>
    </Card>
  );
}
