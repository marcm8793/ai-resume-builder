import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ResumeSectionProps } from "@/lib/types";

export default function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle, templateId } = resumeData;

  if (!skills?.length) return null;

  const isModernTemplate = templateId === "modern";

  return (
    <div className="flex flex-col">
      <hr
        className={cn("mt-2 w-full border-2")}
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="mt-2 break-inside-avoid space-y-3">
        <p
          className={cn("text-lg font-semibold", isModernTemplate && "text-xl")}
          style={{ color: colorHex }}
        >
          Skills
        </p>
        <div
          className={cn(
            "space-y-2",
            isModernTemplate && "flex flex-col space-y-4",
          )}
        >
          {skills.map((skillGroup, groupIndex) => (
            <div
              key={groupIndex}
              className={cn(
                "flex flex-wrap items-center gap-x-2 gap-y-1",
                isModernTemplate && "flex-col items-start",
              )}
            >
              {skillGroup.title && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    isModernTemplate
                      ? "mb-2 text-base font-semibold"
                      : "min-w-[120px]",
                  )}
                  style={{ color: isModernTemplate ? colorHex : "inherit" }}
                >
                  {skillGroup.title}:
                </span>
              )}
              <div
                className={cn(
                  "flex flex-wrap items-center gap-1",
                  isModernTemplate && "w-full",
                )}
              >
                {skillGroup.skillItems.map((skill, index) => (
                  <Badge
                    key={index}
                    className={cn(
                      "rounded-md bg-black text-white hover:bg-black",
                      isModernTemplate && "mb-1",
                    )}
                    style={{
                      backgroundColor: colorHex,
                      borderRadius:
                        borderStyle === BorderStyles.SQUARE
                          ? "0px"
                          : borderStyle === BorderStyles.CIRCLE
                            ? "9999px"
                            : "8px",
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
