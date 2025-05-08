import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  BorderStyle,
  TabStopType,
} from "docx";
import { ResumeValues } from "../validation";

export function createModernTemplate(resumeData: ResumeValues): Document {
  // Use provided colorHex or default to a blue color
  const themeColor = resumeData.colorHex || "#0366d6";

  const sections = [];

  // Header with name, job title and contact info (similar to classic)
  const nameAndJobTitle = [];

  // Name
  nameAndJobTitle.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${resumeData.firstName || ""} ${resumeData.lastName || ""}`,
          bold: true,
          color: themeColor,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 120,
      },
    }),
  );

  // Job title
  if (resumeData.jobTitle) {
    nameAndJobTitle.push(
      new Paragraph({
        text: resumeData.jobTitle,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Contact information line
  const contactInfo = [];
  if (resumeData.city && resumeData.country) {
    contactInfo.push(`${resumeData.city}, ${resumeData.country}`);
  } else if (resumeData.city || resumeData.country) {
    contactInfo.push(resumeData.city || resumeData.country || "");
  }
  if (resumeData.phone) contactInfo.push(resumeData.phone);
  if (resumeData.email) contactInfo.push(resumeData.email);

  if (contactInfo.length > 0) {
    nameAndJobTitle.push(
      new Paragraph({
        text: contactInfo.join(" • "),
        style: "lightText",
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Create header table to place photo and name side by side (if photo exists)
  if (resumeData.photo) {
    try {
      let photoData: string | ArrayBuffer | Buffer | Uint8Array | null = null;
      if (typeof resumeData.photo === "string") {
        photoData = resumeData.photo;
      } else if (resumeData.photo instanceof File) {
        photoData = null; // Cannot handle File directly server-side
      } else {
        photoData = resumeData.photo as ArrayBuffer;
      }

      if (photoData) {
        const headerTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER, // Center photo in its cell
                      children: [
                        new ImageRun({
                          data: photoData,
                          transformation: { width: 100, height: 100 },
                          type: "png",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 85, type: WidthType.PERCENTAGE },
                  children: nameAndJobTitle,
                }),
              ],
            }),
          ],
        });
        sections.push(headerTable);
      } else {
        sections.push(...nameAndJobTitle); // Fallback if photo data fails
      }
    } catch (error) {
      console.error("Error adding photo:", error);
      sections.push(...nameAndJobTitle); // Fallback on error
    }
  } else {
    sections.push(...nameAndJobTitle); // No photo
  }

  // Helper to format dates (copied from classic)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // --- Start Two-Column Layout ---

  // Left Column Content
  const leftColumnChildren = [];

  // Summary section
  if (resumeData.summary) {
    leftColumnChildren.push(
      new Paragraph({
        thematicBreak: true,
        border: {
          bottom: {
            color: themeColor,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { before: 120, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Profile", bold: true, color: themeColor }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 120 },
      }),
      new Paragraph({
        text: resumeData.summary,
        spacing: { after: 120 },
      }),
    );
  }

  // Skills section
  if (resumeData.skills && resumeData.skills.length > 0) {
    leftColumnChildren.push(
      new Paragraph({
        thematicBreak: true,
        border: {
          bottom: {
            color: themeColor,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { before: 120, after: 60 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Skills", bold: true, color: themeColor }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 120 },
      }),
    );
    resumeData.skills.forEach((skillGroup, skillGroupIndex) => {
      const paragraphChildren: TextRun[] = [];
      if (skillGroup.title) {
        paragraphChildren.push(
          new TextRun({
            text: `${skillGroup.title}:`,
            bold: true,
            color: themeColor,
          }),
        );
      }
      if (skillGroup.skillItems && skillGroup.skillItems.length > 0) {
        if (skillGroup.title) {
          paragraphChildren.push(new TextRun({ text: " " }));
        }
        paragraphChildren.push(
          new TextRun({ text: skillGroup.skillItems.join(", ") }),
        );
      }
      if (paragraphChildren.length > 0) {
        leftColumnChildren.push(
          new Paragraph({
            children: paragraphChildren,
            spacing: {
              after:
                skillGroupIndex === (resumeData.skills?.length || 0) - 1
                  ? 0
                  : 120,
            },
          }),
        );
      }
    });
    leftColumnChildren.push(new Paragraph({ spacing: { after: 120 } })); // Add space after the last skill group
  }

  // Right Column Content
  const rightColumnChildren = [];

  // Work Experience section
  if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
    rightColumnChildren.push(
      new Paragraph({
        thematicBreak: true,
        border: {
          bottom: {
            color: themeColor,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { before: 120, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Work experience",
            bold: true,
            color: themeColor,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 120 },
      }),
    );
    resumeData.workExperiences.forEach((job) => {
      const startDate = formatDate(job.startDate);
      const endDate = formatDate(job.endDate);
      const dateString =
        startDate && endDate
          ? `${startDate} - ${endDate}`
          : startDate || endDate;

      rightColumnChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.position || "",
              bold: true,
              color: themeColor,
            }),
            new TextRun({
              text: job.company ? `, ${job.company}` : "",
              bold: true,
            }),
            new TextRun({ text: "\t" }),
            new TextRun({ text: dateString, color: "666666" }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 7000 }],
          spacing: { after: 60 },
        }),
      );

      if (job.description) {
        const descriptionLines = job.description.split("\n");
        descriptionLines.forEach((line, index) => {
          if (line.trim()) {
            rightColumnChildren.push(
              new Paragraph({
                text: line.trim(),
                bullet: { level: 0 },
                spacing: {
                  after: index === descriptionLines.length - 1 ? 120 : 60,
                },
              }),
            );
          }
        });
      } else {
        // Add spacing even if no description
        rightColumnChildren.push(new Paragraph({ spacing: { after: 120 } }));
      }
    });
  }

  // Education section
  if (resumeData.educations && resumeData.educations.length > 0) {
    rightColumnChildren.push(
      new Paragraph({
        thematicBreak: true,
        border: {
          bottom: {
            color: themeColor,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { before: 120, after: 60 },
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Education", bold: true, color: themeColor }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 120 },
      }),
    );
    resumeData.educations.forEach((edu) => {
      const startDate = formatDate(edu.startDate);
      const endDate = formatDate(edu.endDate);
      const dateString =
        startDate && endDate
          ? `${startDate} - ${endDate}`
          : startDate || endDate;

      rightColumnChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || "",
              bold: true,
              color: themeColor,
            }),
            new TextRun({ text: "\t" }),
            new TextRun({ text: dateString, color: "666666" }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 7000 }],
          spacing: { after: 60 },
        }),
      );

      if (edu.school) {
        rightColumnChildren.push(
          new Paragraph({
            text: edu.school,
            spacing: { after: 120 },
          }),
        );
      } else {
        // Add spacing even if no school
        rightColumnChildren.push(new Paragraph({ spacing: { after: 120 } }));
      }
    });
  }

  // Create the main two-column table
  const mainTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      // Remove borders for the layout table
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Left column (33%)
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: leftColumnChildren,
            margins: { right: 200 }, // Add right margin for spacing
          }),
          // Right column (67%)
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            children: rightColumnChildren,
            margins: { left: 200 }, // Add left margin for spacing
          }),
        ],
      }),
    ],
  });

  // Add the main layout table to the sections
  sections.push(mainTable);

  return new Document({
    sections: [
      {
        properties: {
          // Add page margins similar to classic
          page: {
            margin: {
              top: 720,
              right: 720, // Standard margin for modern
              bottom: 720,
              left: 720,
            },
          },
        },
        children: sections, // Use the combined sections array
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: "lightText",
          name: "Light Text",
          basedOn: "Normal",
          run: {
            color: "666666",
            size: 20,
          },
        },
      ],
    },
  });
}
