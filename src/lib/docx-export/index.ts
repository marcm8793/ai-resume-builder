import { Document, Packer } from "docx";
import { saveAs } from "file-saver";
import { ResumeValues } from "../validation";
import { createClassicTemplate } from "./classicTemplate";
import { createModernTemplate } from "./modernTemplate";

async function fetchImageAsBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
      return null;
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

export async function exportToWord(resumeData: ResumeValues) {
  // Handle photo if it exists and is a URL string
  if (
    typeof resumeData.photo === "string" &&
    resumeData.photo.startsWith("http")
  ) {
    try {
      const imageBuffer = await fetchImageAsBuffer(resumeData.photo);
      if (imageBuffer) {
        // Replace the URL with the actual image data
        resumeData = {
          ...resumeData,
          photo: imageBuffer as unknown as string,
        };
      }
    } catch (error) {
      console.error("Failed to fetch profile photo:", error);
      resumeData = {
        ...resumeData,
        photo: null,
      };
    }
  }

  let doc: Document;

  if (resumeData.templateId === "modern") {
    doc = createModernTemplate(resumeData);
  } else {
    doc = createClassicTemplate(resumeData);
  }

  // Generate the document as a blob
  const blob = await Packer.toBlob(doc);

  // Save the blob as a file
  const fileName = resumeData.title
    ? `${resumeData.title.replace(/\s+/g, "_")}.docx`
    : "resume.docx";

  saveAs(blob, fileName);
}

// Export templates for direct use if needed
export { createClassicTemplate } from "./classicTemplate";
export { createModernTemplate } from "./modernTemplate";
