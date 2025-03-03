import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ResumeSectionProps } from "@/lib/types";

export default function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

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
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        <div className="space-y-2">
          {educationsNotEmpty.map((edu, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-base font-semibold"
                style={{
                  color: colorHex,
                }}
              >
                <span className="overflow-hidden text-ellipsis">
                  {edu.degree}
                </span>
                {edu.startDate && (
                  <span className="ml-2 whitespace-nowrap">
                    {edu.startDate &&
                      `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
