import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export interface ResumeSectionProps {
  resumeData: ResumeValues;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  skillGroups: {
    include: {
      skills: true,
    },
  },
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
