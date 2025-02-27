import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ResumeSectionProps } from "@/lib/types";

export default function WorkExperienceSection({
  resumeData,
}: ResumeSectionProps) {
  const { workExperiences, colorHex, templateId } = resumeData;
  const isModernTemplate = templateId === "modern";

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    // TODO: Check if I need flex flex-col
    <div className="flex flex-col">
      <hr
        className={cn("mt-2 w-full border-2")}
        style={{
          borderColor: colorHex,
        }}
      />
      <div className={cn("mt-2 space-y-3", isModernTemplate && "space-y-2")}>
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Work experience
        </p>
        <div className={cn(isModernTemplate && "space-y-3")}>
          {workExperiencesNotEmpty.map((exp, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: colorHex,
                }}
              >
                <span>{exp.position}</span>
                {exp.startDate && (
                  <span className={cn(isModernTemplate && "text-xs")}>
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "Present"}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold">{exp.company}</p>
              <div
                className={cn(
                  "whitespace-pre-line text-xs font-semibold",
                  isModernTemplate && "text-[10px]",
                )}
              >
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
