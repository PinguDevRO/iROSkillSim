import React from "react";
import { Typography } from "@mui/material";

interface ColoredPart {
  color: string;
  content: string;
};

interface ColoredTextBlockProps {
  lines: string[];
  jobId: number;
};

const parseColoredLine = (line: string, initialColor: string): {
  parts: ColoredPart[];
  lastColor: string;
} => {
  const parts: ColoredPart[] = [];
  const regex = /\^([0-9a-fA-F]{6})/g;
  let lastIndex = 0;
  let currentColor = initialColor;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    const index = match.index;

    if (index > lastIndex) {
      parts.push({
        color: currentColor,
        content: line.slice(lastIndex, index),
      });
    }

    currentColor = `#${match[1]}`;
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push({
      color: currentColor,
      content: line.slice(lastIndex),
    });
  }

  return { parts, lastColor: currentColor };
};

const ColoredText: React.FC<ColoredTextBlockProps> = ({ lines, jobId }) => {
  let currentColor = "#010101";

  const filteredLines = lines.filter((line) => {
    const match = line.match(/^(\d+)\^.*Skill/i);
    if (match) {
      return parseInt(match[1], 10) === jobId;
    }
    return true;
  });

  return (
    <>
      {filteredLines.map((line, index) => {
        // Remove the jobId prefix if present and relevant
        const cleanLine = line.match(/^(\d+)\^.*Skill/i)
          ? line.replace(/^\d+/, "")
          : line;

        const { parts, lastColor } = parseColoredLine(cleanLine, currentColor);
        currentColor = lastColor;

        return (
          <Typography
            key={index}
            variant="body2"
            component="div"
            fontSize={12}
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {parts.map((part, idx) => (
              <span
                key={idx}
                style={{
                  color: part.color,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  display: "inline",
                }}
              >
                {part.content}
              </span>
            ))}
          </Typography>
        );
      })}
    </>
  );
};

export default ColoredText;
