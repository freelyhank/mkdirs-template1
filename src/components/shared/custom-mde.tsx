"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import React from "react";

// if directly import, frontend error: document is not defined
// import { SimpleMdeReact } from "react-simplemde-editor";
// but if dynamic import, no error reported
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// if import SimpleMDE from react-simplemde-editor, SimpleMDE.Options can't be found
// import SimpleMDE from "react-simplemde-editor";
// but import type SimpleMDE from "easymde" is ok
import type SimpleMDE from "easymde";

// import this css to style the editor
import "@/styles/mde.css";
import "easymde/dist/easymde.min.css";

interface CustomMdeProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * https://github.com/RIP21/react-simplemde-editor
 *
 * https://github.com/sanity-io/sanity-plugin-markdown?tab=readme-ov-file#customizing-editor-preview
 */
const CustomMde = React.forwardRef<HTMLDivElement, CustomMdeProps>(
  ({ value, onChange }, ref) => {
    const theme = useTheme();

    // https://github.com/RIP21/react-simplemde-editor?tab=readme-ov-file#options
    // useMemo to memoize options so they do not change on each rerender
    // https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file#options-example
    // don't show image or upload-image button, images are uploaded in the image field of form
    // don't show side-by-side, it will trigger fullscreen and has some bugs in UI
    // show preview? tailwindcss reset all styles, so by default the preview is not working,
    // but if add class `prose` to the previewClass, it will work, but not perfect
    const mdeOptions = useMemo(() => {
      return {
        status: false,
        autofocus: false,
        spellChecker: false,
        placeholder: "Enter your content here...",
        toolbar: [
          "heading",
          "bold",
          "italic",
          "strikethrough",
          "code",
          "quote",
          "unordered-list",
          "ordered-list",
          "link",
          "preview",
          "guide",
        ],
        previewClass: [
          "prose",
          "prose-slate",
          "dark:prose-invert",
          "bg-background",
          "text-foreground",
        ],
      } as SimpleMDE.Options;
    }, []);

    return (
      <div ref={ref} data-theme={theme} style={{ maxWidth: "none" }}>
        <SimpleMdeReact
          options={mdeOptions}
          value={value}
          onChange={onChange}
          className="shadow-none"
        />
      </div>
    );
  }
);

CustomMde.displayName = "CustomMde";

export default CustomMde;
