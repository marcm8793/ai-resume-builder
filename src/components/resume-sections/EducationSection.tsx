import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ResumeSectionProps } from "@/lib/types";

export default function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex, templateId } = resumeData;
  // TODO: Check if I need isModernTemplate
  const isModernTemplate = templateId === "modern";

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    // TODO: Check if I need flex flex-col
    <div className="flex flex-col">
      <hr
        className={cn("mt-2 w-full border-2")}
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="mt-2 space-y-3">
        <p
          className={cn("text-lg font-semibold", isModernTemplate && "text-xl")}
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        <div className={cn(isModernTemplate && "space-y-4")}>
          {educationsNotEmpty.map((edu, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className={cn(
                  "flex items-center justify-between text-sm font-semibold",
                  isModernTemplate && "text-base",
                )}
                style={{
                  color: colorHex,
                }}
              >
                <span>{edu.degree}</span>
                {edu.startDate && (
                  <span className={cn(isModernTemplate && "text-xs")}>
                    {edu.startDate &&
                      `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs font-semibold",
                  isModernTemplate && "text-sm",
                )}
              >
                {edu.school}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
