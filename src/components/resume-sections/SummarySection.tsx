import { cn } from "@/lib/utils";
import { ResumeSectionProps } from "@/lib/types";

export default function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex, templateId } = resumeData;
  // TODO: Check if I need isModernTemplate
  const isModernTemplate = templateId === "modern";

  if (!summary) return null;

  return (
    // TODO: Check if I need flex flex-col
    <div className="flex flex-col">
      <hr
        className={cn("mt-2 w-full border-2")}
        style={{
          borderColor: colorHex,
        }}
      />
      <div
        className={cn(
          "mt-2 break-inside-avoid space-y-3",
          isModernTemplate && "space-y-2",
        )}
      >
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Profile
        </p>
        <div
          className={cn(
            "whitespace-pre-line text-sm",
            isModernTemplate && "text-xs",
          )}
        >
          {summary}
        </div>
      </div>
    </div>
  );
}
