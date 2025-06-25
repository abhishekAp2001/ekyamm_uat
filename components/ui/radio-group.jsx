"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid", className)}
      {...props} />
  );
}

function RadioGroupItem({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square w-5 h-5 shrink-0 rounded-full border-[2px] border-black shadow-xs transition-[color,box-shadow]  focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center">
        <CircleIcon
          className="fill-primary absolute top-[-5.7px] left-[1.5px] w-[13px] h-[11px]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem }
