"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function  Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 w-[42px] h-[42px] shrink-0 overflow-aut rounded-full", className)}
      {...props} />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  return (
    // <AvatarPrimitive.Image
    //   data-slot="avatar-image"
    //   className={cn("aspect-square", className)}
    //   {...props} />
    <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn(
      "w-full h-full rounded-full",
      className
    )}
    {...props}
  />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex w-full h-full items-center justify-center rounded-full text-xs",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }
