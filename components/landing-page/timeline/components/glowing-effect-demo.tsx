"use client";

import { Box, Lock, Search, Settings, Sparkles, BotIcon } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import { cn } from "@/lib/utils";
import React from "react";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-7 md:grid-rows-3 lg:gap-4 xl:max-h-[30rem] md:my-8 xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Sparkles className="h-6 w-6" />}
        title="Find Out What Your Business Needs"
        description="Have your start-up analyzed by the ITT Assessment, an AI-powered workflow designed to identify the best next steps for your business. Our advanced algorithms provide in-depth insights tailored to your unique situation, ensuring you have a clear path forward."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<BotIcon className="h-6 w-6" />}
        title="Team Collaboration"
        description="Share reports and chats with your team to ensure everyone is aligned on the next steps. Collaborate effectively to refine your strategies and accelerate your business growth. Join the ITT Saturday events for hands-on support and industry-leading expertise."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-6 w-6" />}
        title="Innovator AI Assistant"
        description="Figure out the finer details with the Innovator AI Assistant, our intelligent chatbot. This tool helps you understand your report, take actionable steps, and guides you through the process using advanced reasoning and support. Whether it's forming ad campaigns or testing baseline ideas, the Innovator AI Assistant is here to help."
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
    <li className={cn("min-h-[11rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-2">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border-[0.75px] bg-background p-3 md:p-4 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="flex items-start gap-2 mb-1">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2 flex-shrink-0">
              {icon}
            </div>
            <h3 className="text-xl leading-tight font-semibold font-sans tracking-[-0.04em] pt-1 md:text-2xl md:leading-tight text-balance text-foreground">
              {title}
            </h3>
          </div>
          <div>
            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-snug md:text-base md:leading-snug text-muted-foreground">
              {description}
            </h2>
          </div>
        </div>
      </div>
    </li>
  );
};