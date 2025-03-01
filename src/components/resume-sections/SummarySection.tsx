import { cn } from "@/lib/utils";
import { ResumeSectionProps } from "@/lib/types";

export default function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

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
      <div className="mt-2 break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </div>
  );
}
