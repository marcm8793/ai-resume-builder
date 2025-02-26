import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TemplateValues } from "@/lib/validation";
import { EditorFormProps } from "@/lib/types";
import { getTemplates } from "./templateService";

export default function TemplateSelector({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [open, setOpen] = useState(false);
  const templates = getTemplates();

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Change Template
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose a template</DialogTitle>
            <DialogDescription>
              Select a template design for your resume.
            </DialogDescription>
          </DialogHeader>
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
                  setOpen(false);
                }}
              >
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
