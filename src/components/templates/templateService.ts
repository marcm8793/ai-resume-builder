import { TemplateValues } from "@/lib/validation";
import { defaultTemplates } from "../../lib/templates";

/**
 * Gets the template name from a template ID
 */
export function getTemplateName(templateId: string): string {
  return (
    defaultTemplates.find((t) => t.templateId === templateId)?.name || "Classic"
  );
}

/**
 * Gets all available templates
 */
export function getTemplates(): TemplateValues[] {
  return defaultTemplates;
}

/**
 * Updates the template ID in resume data
 */
export function updateTemplateId<T extends { templateId?: string }>(
  resumeData: T,
  templateId: string,
): T {
  return { ...resumeData, templateId };
}
