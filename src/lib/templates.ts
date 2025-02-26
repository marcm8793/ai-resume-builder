import { TemplateValues } from "./validation";

export const defaultTemplates: TemplateValues[] = [
  {
    templateId: "classic",
    name: "Classic",
    description: "Traditional resume layout with a clean, professional look",
    photoPosition: "left",
    defaultBorderStyle: "squircle",
  },
  {
    templateId: "modern",
    name: "Modern",
    description: "Contemporary design with a two-column layout",
    photoPosition: "right",
    defaultBorderStyle: "circle",
  },
];
