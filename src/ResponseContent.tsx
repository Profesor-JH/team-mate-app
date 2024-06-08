import React from "react";

interface ResponseContentProps {
  content: string;
}

const ResponseContent: React.FC<ResponseContentProps> = ({ content }) => {
  const formatContent = (text: string) => {
    const sections = text.split("\n\n");
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        {section.split("\n").map((line, i) => (
          <p key={i} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    ));
  };

  return <div>{formatContent(content)}</div>;
};

export default ResponseContent;
