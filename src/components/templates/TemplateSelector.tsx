import { TemplateValues } from "@/lib/validation";
import { EditorFormProps } from "@/lib/types";
import { getTemplates } from "./templateService";
import ResumePreview from "@/components/ResumePreview";

export default function TemplateSelector({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const templates = getTemplates();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Choose a template</h2>
        <p className="text-sm text-muted-foreground">
          Select a template design for your resume.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template: TemplateValues) => (
          <button
            key={template.templateId}
            className={`rounded-lg border p-4 text-start transition-colors hover:bg-accent ${
              (resumeData.templateId || "classic") === template.templateId
                ? "border-primary"
                : ""
            }`}
            onClick={() => {
              setResumeData({
                ...resumeData,
                templateId: template.templateId || "classic",
              });
            }}
          >
            <div className="mb-2 aspect-[210/297] w-full overflow-hidden rounded-md border">
              <div
                style={{
                  transform: "scale(0.3)",
                  transformOrigin: "top left",
                  width: "calc(100% / 0.3)",
                  height: "calc(100% / 0.3)",
                }}
              >
                <ResumePreview
                  resumeData={{
                    ...resumeData,
                    templateId: template.templateId || "classic",
                  }}
                />
              </div>
            </div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
