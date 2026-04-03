"use client";

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step.active
                ? "bg-blue-600 text-white"
                : step.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step.active
                  ? "bg-white text-blue-600"
                  : step.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-white"
              }`}
            >
              {step.completed ? "✓" : i + 1}
            </span>
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                step.completed ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
