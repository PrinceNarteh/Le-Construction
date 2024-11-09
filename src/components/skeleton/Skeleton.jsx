import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-md w-full h-5 bg-slate-200 relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent isolate overflow-hidden shadow-md shadow-black/5 before:border-t before:border-rose-100/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
