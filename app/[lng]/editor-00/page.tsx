"use client";

import { useState } from "react";
// import { SerializedEditorState } from "lexical" // Removed due to type issues

import { Editor } from "@/components/blocks/editor-00/editor";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

export default function EditorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorState, setEditorState] = useState(initialValue as any);
  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(value) => setEditorState(value)}
    />
  );
}
