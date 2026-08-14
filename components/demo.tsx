"use client";

import React from "react";
import { LiquidButton, MetalButton, Button } from "@/components/ui/liquid-glass-button";

export default function DemoOne() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative h-[120px] w-full max-w-[400px] flex items-center justify-center">
        <LiquidButton className="cursor-pointer">
          Liquid Glass
        </LiquidButton>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <MetalButton variant="default">Metal Default</MetalButton>
        <MetalButton variant="primary">Metal Primary</MetalButton>
        <MetalButton variant="gold">Metal Gold</MetalButton>
      </div>

      <div className="flex gap-3">
        <Button variant="cool">Cool Button</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
