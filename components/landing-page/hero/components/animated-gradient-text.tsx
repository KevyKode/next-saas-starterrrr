"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-black/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#6e3bff1f] backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#3b7dff3f]",
        className,
      )}
    >
      <div
        className={`absolute inset-0 block h-full w-full animate-gradient-x bg-gradient-to-r from-[#6e3bff]/50 via-[#3b7dff]/50 to-[#6e3bff]/50 bg-[length:200%_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  );
}