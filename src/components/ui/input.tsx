import * as React from "react";

import { cn } from "./utils";

export interface InputProps extends React.ComponentProps<"input"> {
  disablePast?: boolean;
}

function Input({ className, type, disablePast, onKeyDown, min, ...props }: InputProps) {
  // Tính toán min cho ngày nếu có disablePast hoặc số dương
  const computedMin = React.useMemo(() => {
    if (min !== undefined) return min;
    if (type === "date" && disablePast) {
      return new Date().toISOString().split("T")[0];
    }
    if (type === "number") {
      return 0; // Mặc định số dương không âm
    }
    return undefined;
  }, [min, type, disablePast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Chặn nhập ký tự chữ khoa học (e, E), dấu cộng (+), và dấu trừ (-) nếu min >= 0
      const isNegativeBlocked = computedMin === undefined || Number(computedMin) >= 0;
      if (["e", "E", "+"].includes(e.key) || (isNegativeBlocked && e.key === "-")) {
        e.preventDefault();
      }
    }
    onKeyDown?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      const pasteText = e.clipboardData.getData("text");
      const isNegativeBlocked = computedMin === undefined || Number(computedMin) >= 0;
      if ((isNegativeBlocked && pasteText.includes("-")) || /[a-zA-Z]/.test(pasteText)) {
        e.preventDefault();
      }
    }
    props.onPaste?.(e);
  };

  return (
    <input
      type={type}
      min={computedMin}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

