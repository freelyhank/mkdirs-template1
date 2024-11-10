import { useMemo } from "react";
import { MarkdownInput, type MarkdownInputProps } from "sanity-plugin-markdown";

import "@/styles/mde.css";
import "easymde/dist/easymde.min.css";

// more options available, see:
// https://github.com/Ionaru/easy-markdown-editor#options-list
// remove the fullscreen button, looks bad in the studio;
// remove the image button, it just inserts a empty image tag;
// NOTICE: editor preview in dark mode is not working
// so please use the preivew of item page instead
// if you want to see the preview in dark mode
const mdeOptions = {
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
    "upload-image",
    "horizontal-rule",
    "preview",
    "side-by-side",
  ],
  previewClass: [
    "prose",
    "prose-slate",
    "dark:prose-invert",
    "bg-background",
    "text-foreground",
  ],
};

/**
 * https://www.sanity.io/plugins/sanity-plugin-markdown
 *
 * 1. Customizing the default markdown input editor
 * https://github.com/sanity-io/sanity-plugin-markdown?tab=readme-ov-file#customizing-the-default-markdown-input-editor
 *
 * 2. Customizing editor preview
 * https://github.com/sanity-io/sanity-plugin-markdown?tab=readme-ov-file#customizing-editor-preview
 */
export function CustomMarkdownInput(props: MarkdownInputProps) {
  // @ts-ignore for warning caused by "upload-image"
  const reactMdeProps: MarkdownInputProps["reactMdeProps"] = useMemo(() => {
    return {
      options: mdeOptions,
      // more props available, see:
      // https://github.com/RIP21/react-simplemde-editor#react-simplemde-easymde-markdown-editor
    };
  }, []);

  return <MarkdownInput {...props} reactMdeProps={reactMdeProps} />;
}
