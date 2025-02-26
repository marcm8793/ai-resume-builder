import { ResumeValues } from "@/lib/validation";

interface ModernTemplateProps {
  resumeData: ResumeValues;
  components: {
    PersonalInfoHeader: (props: { resumeData: ResumeValues }) => JSX.Element;
    SummarySection: (props: { resumeData: ResumeValues }) => JSX.Element | null;
    WorkExperienceSection: (props: {
      resumeData: ResumeValues;
    }) => JSX.Element | null;
    EducationSection: (props: {
      resumeData: ResumeValues;
    }) => JSX.Element | null;
    SkillsSection: (props: { resumeData: ResumeValues }) => JSX.Element | null;
  };
}

export default function ModernTemplate({
  resumeData,
  components,
}: ModernTemplateProps) {
  return (
    <div
      className="grid grid-cols-3 gap-x-4"
      style={{ gridTemplateColumns: "1fr 2fr" }}
    >
      <div className="col-span-3">
        {/* Header spans full width */}
        {components.PersonalInfoHeader({
          resumeData,
        })}
      </div>

      {/* Left column */}
      <div className="flex flex-col">
        {components.SummarySection({
          resumeData,
        })}

        {components.SkillsSection({
          resumeData,
        })}
      </div>

      {/* Right column */}
      <div className="flex flex-col">
        {components.WorkExperienceSection({
          resumeData,
        })}

        {components.EducationSection({
          resumeData,
        })}
      </div>
    </div>
  );
}
