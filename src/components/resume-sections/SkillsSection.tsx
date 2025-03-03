import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ResumeSectionProps } from "@/lib/types";

export default function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="flex flex-col">
      <hr
        className={cn("mt-2 w-full border-2")}
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="mt-2 break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Skills
        </p>
        <div className="space-y-2">
          {skills.map((skillGroup, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              {skillGroup.title && (
                <span
                  className="min-w-[120px] text-sm font-medium"
                  style={{ color: colorHex }}
                >
                  {skillGroup.title}:
                </span>
              )}
              <div className={cn("flex flex-wrap items-center gap-1")}>
                {skillGroup.skillItems.map((skill, index) => (
                  <Badge
                    key={index}
                    className="rounded-md bg-black text-white hover:bg-black"
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
