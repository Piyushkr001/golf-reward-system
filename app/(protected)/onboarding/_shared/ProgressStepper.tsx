"use client";

interface ProgressStepperProps {
  current: number;
  total: number;
  labels: string[];
}

export function ProgressStepper({ current, total, labels }: ProgressStepperProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const active = index + 1 <= current;
          return (
            <div key={index} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  active
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                    : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                {index + 1}
              </div>
              {index !== total - 1 && (
                <div className={`h-1 flex-1 rounded-full ${active ? "bg-cyan-400/70" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {labels.map((label, index) => (
          <p
            key={label}
            className={`text-xs sm:text-sm ${index + 1 === current ? "text-slate-100" : "text-slate-400"}`}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}