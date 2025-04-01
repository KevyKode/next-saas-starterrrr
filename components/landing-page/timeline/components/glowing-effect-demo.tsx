"use client";

import { Box, Lock, Search, Settings, Sparkles, BotIcon } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import { cn } from "@/lib/utils";
import React from "react";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-7 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] md:my-16 xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Sparkles className="h-6 w-6" />}
        title="Find out what your business needs"
        description="Have your start-up analyzed by the ITT Business Analysis Report that's an A.I powered workflow to find the best next steps to take"
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<BotIcon className="h-6 w-6" />}
        title="Figure out the finer details with the Innovator Assisstant"
        description="Get the help you need for the next set of iterations! From correctly formed ad campaigns to baseline idea testing with the Innovator Assistant "
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-6 w-6" />}
        title="Team Collaboration"
        description="Share reports and chats with your team to get them on the same page of what you need to build out next in order to get into the ITT Incubator, accelerators like Y Combinator, or even re-thinking square one!"
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
