"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ConsentToggleProps {
  name: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function ConsentToggle({
  name,
  label,
  description,
  checked,
  onChange,
  icon,
  className,
}: ConsentToggleProps) {
  const id = React.useId();

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
        checked
          ? "bg-teal-50 border-teal-200"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
      onClick={() => onChange(name, !checked)}
    >
      {icon && (
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            checked ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-500"
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`${id}-${name}`}
          className={cn(
            "block text-sm font-medium cursor-pointer transition-colors",
            checked ? "text-teal-900" : "text-slate-700"
          )}
        >
          {label}
        </label>
        {description && (
          <p
            className={cn(
              "mt-1 text-xs transition-colors",
              checked ? "text-teal-700" : "text-slate-500"
            )}
          >
            {description}
          </p>
        )}
      </div>
      <Switch
        id={`${id}-${name}`}
        checked={checked}
        onCheckedChange={(val) => onChange(name, val)}
        className="flex-shrink-0"
      />
    </div>
  );
}

interface ConsentGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ConsentGroup({
  title,
  description,
  children,
  icon,
}: ConsentGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
