import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TabStopType,
} from "docx";
import { ResumeValues } from "../validation";

export function createClassicTemplate(resumeData: ResumeValues): Document {
  const sections = [];

  // Header with name, job title and contact info
  const nameAndJobTitle = [];

  // Name
  nameAndJobTitle.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${resumeData.firstName || ""} ${resumeData.lastName || ""}`,
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
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
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Create header table to place photo and name side by side
  if (resumeData.photo) {
    // If there's a photo, create a table with photo and name side by side
    try {
      // The photo can be an ArrayBuffer, a string URL, or a File
      let photoData: string | ArrayBuffer | Buffer | Uint8Array | null = null;

      if (typeof resumeData.photo === "string") {
        // If it's a string, we assume it's a base64 data URL
        photoData = resumeData.photo;
      } else if (resumeData.photo instanceof File) {
        // We can't directly handle File objects in the server environment
        photoData = null;
      } else {
        // Should be an ArrayBuffer from fetchImageAsBuffer
        photoData = resumeData.photo as ArrayBuffer;
      }

      if (photoData) {
        const table = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
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
                // Photo cell (left)
                new TableCell({
                  width: {
                    size: 15,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: photoData,
                          transformation: {
                            width: 100,
                            height: 100,
                          },
                          type: "png",
                        }),
                      ],
                    }),
                  ],
                }),
                // Name and job title cell (right)
                new TableCell({
                  width: {
                    size: 85,
                    type: WidthType.PERCENTAGE,
                  },
                  children: nameAndJobTitle,
                }),
              ],
            }),
          ],
        });
        sections.push(table);
      } else {
        // If we couldn't get photo data, just add the name sections
        sections.push(...nameAndJobTitle);
      }
    } catch (error) {
      console.error("Error adding photo:", error);
      // Fallback to text-only header
      sections.push(...nameAndJobTitle);
    }
  } else {
    // No photo, just add the name and job title
    sections.push(...nameAndJobTitle);
  }

  // Add horizontal line after header
  sections.push(
    new Paragraph({
      thematicBreak: true,
      spacing: {
        after: 120,
      },
    }),
  );

  // Profile/Summary section
  if (resumeData.summary) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Profile",
            bold: true,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 120,
          before: 120,
        },
      }),
      new Paragraph({
        text: resumeData.summary,
        spacing: {
          after: 120,
        },
      }),
      new Paragraph({
        thematicBreak: true,
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Work Experience section
  if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Work experience",
            bold: true,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 120,
          before: 120,
        },
      }),
    );

    resumeData.workExperiences.forEach((job) => {
      // Format date to show only month and year
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          // Format as "MM/YYYY"
          return `${date.getMonth() + 1}/${date.getFullYear()}`;
        } catch (error) {
          console.error("Error formatting date:", error);
          // If parsing fails, return the original string
          return dateString;
        }
      };

      const startDate = formatDate(job.startDate);
      const endDate = formatDate(job.endDate);
      const dateString =
        startDate && endDate
          ? `${startDate} - ${endDate}`
          : startDate || endDate;

      // Job title/company with right-aligned date
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.position || "",
              bold: true,
            }),
            new TextRun({
              text: job.company ? `, ${job.company}` : "",
              bold: true,
            }),
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: dateString,
              color: "666666",
            }),
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 10980, // Use calculated content width for right alignment
            },
          ],
          spacing: {
            after: 60,
          },
        }),
      );

      // Job description with bullet points
      if (job.description) {
        // Split description by new lines and add as bullet points
        const descriptionLines = job.description.split("\n");
        descriptionLines.forEach((line, index) => {
          if (line.trim()) {
            sections.push(
              new Paragraph({
                text: line.trim(),
                bullet: {
                  level: 0,
                },
                spacing: {
                  after: index === descriptionLines.length - 1 ? 120 : 60,
                },
              }),
            );
          }
        });
      }
    });

    // Add a horizontal line after work experience
    sections.push(
      new Paragraph({
        thematicBreak: true,
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Education section
  if (resumeData.educations && resumeData.educations.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Education",
            bold: true,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 120,
          before: 120,
        },
      }),
    );

    resumeData.educations.forEach((edu) => {
      // Format date to show only month and year
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          // Format as "MM/YYYY"
          return `${date.getMonth() + 1}/${date.getFullYear()}`;
        } catch (error) {
          console.error("Error formatting date:", error);
          // If parsing fails, return the original string
          return dateString;
        }
      };

      const startDate = formatDate(edu.startDate);
      const endDate = formatDate(edu.endDate);
      const dateString =
        startDate && endDate
          ? `${startDate} - ${endDate}`
          : startDate || endDate;

      // Degree with right-aligned date (matching PDF format)
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || "",
              bold: true,
            }),
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: dateString,
              color: "666666",
            }),
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 10980,
            },
          ],
          spacing: {
            after: 60,
          },
        }),
      );

      // School name on next line if provided
      if (edu.school) {
        sections.push(
          new Paragraph({
            text: edu.school,
            spacing: {
              after: 120,
            },
          }),
        );
      }
    });

    // Add a horizontal line after education
    sections.push(
      new Paragraph({
        thematicBreak: true,
        spacing: {
          after: 120,
        },
      }),
    );
  }

  // Skills section
  if (resumeData.skills && resumeData.skills.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Skills",
            bold: true,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 120,
          before: 120,
        },
      }),
    );

    resumeData.skills.forEach((skillGroup, skillGroupIndex) => {
      const paragraphChildren: TextRun[] = [];

      // Add skill group title if it exists
      if (skillGroup.title) {
        paragraphChildren.push(
          new TextRun({
            text: `${skillGroup.title}:`,
            bold: true,
          }),
        );
      }

      // Add comma-separated skills if they exist
      if (skillGroup.skillItems && skillGroup.skillItems.length > 0) {
        // Add a space after the title if title also exists
        if (skillGroup.title) {
          paragraphChildren.push(new TextRun({ text: " " }));
        }
        paragraphChildren.push(
          new TextRun({ text: skillGroup.skillItems.join(", ") }),
        );
      }

      // Only add the paragraph if it has content
      if (paragraphChildren.length > 0) {
        sections.push(
          new Paragraph({
            children: paragraphChildren,
            spacing: {
              after:
                skillGroupIndex === (resumeData.skills?.length || 0) - 1
                  ? 0
                  : 120, // Add spacing after each skill group except the last
            },
          }),
        );
      }
    });
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch in twips
              right: 540,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: sections,
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
