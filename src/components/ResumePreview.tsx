import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import React, { useRef } from "react";
import { defaultTemplates } from "@/lib/templates";
import ModernTemplate from "./templates/ModernTemplate";
import PersonalInfoHeader from "@/components/resume-sections/PersonalInfoHeader";
import SummarySection from "@/components/resume-sections/SummarySection";
import WorkExperienceSection from "@/components/resume-sections/WorkExperienceSection";
import EducationSection from "@/components/resume-sections/EducationSection";
import SkillsSection from "@/components/resume-sections/SkillsSection";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  const template =
    defaultTemplates.find((t) => t.templateId === resumeData.templateId) ||
    defaultTemplates[0];

  const resumeDataWithTemplate = {
    ...resumeData,
    photoPosition: template.photoPosition,
    templateId: template.templateId,
  };

  const components = {
    PersonalInfoHeader,
    SummarySection,
    WorkExperienceSection,
    EducationSection,
    SkillsSection,
  };

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("flex flex-col space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {template.templateId === "modern" ? (
          <ModernTemplate
            resumeData={resumeDataWithTemplate}
            components={components}
          />
        ) : (
          <div className="flex flex-col">
            <PersonalInfoHeader resumeData={resumeDataWithTemplate} />
            <SummarySection resumeData={resumeDataWithTemplate} />
            <WorkExperienceSection resumeData={resumeDataWithTemplate} />
            <EducationSection resumeData={resumeDataWithTemplate} />
            <SkillsSection resumeData={resumeDataWithTemplate} />
          </div>
        )}
      </div>
    </div>
  );
}
