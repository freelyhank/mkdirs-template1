import { CustomMarkdownInput } from '@/sanity/components/custom-markdown-input';
import documentNode from '@/sanity/document-node';
import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/lib/api';
import { singletonPlugin } from '@/sanity/plugins/singleton';
import { schemaTypes } from '@/sanity/schemas';
import settings from '@/sanity/schemas/documents/settings';
import { structure } from '@/sanity/structure';
import { codeInput } from '@sanity/code-input';
import { 
  dashboardTool, 
  projectInfoWidget, 
  projectUsersWidget, 
  sanityTutorialsWidget 
} from "@sanity/dashboard";
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from 'sanity-plugin-media';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'Studio',
  basePath: studioUrl,
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    // https://www.sanity.io/docs/structure-tool-api
    // The Structure Tool is a top-level view within Sanity Studio 
    // where editors can drill down to specific documents to edit them.
    structureTool({
      defaultDocumentNode: documentNode,
      structure: structure(),
    }),

    // https://www.sanity.io/docs/the-vision-plugin
    // Vision is a plugin that lets you quickly test your GROQ queries right from the Studio.
    visionTool({
      title: 'Query',
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),

    // https://www.sanity.io/docs/configuring-the-presentation-tool
    // https://www.sanity.io/docs/draft-mode
    // The Presentation tool enables Visual Editing for interactive live previews.
    // demo: https://github.com/javayhu/sanity-press/blob/main/sanity/src/presentation.ts#L4
    // demo: https://github.com/javayhu/sanity-press/blob/main/sanity/sanity.config.ts#L32
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft" } },
    }),

    // https://www.sanity.io/plugins/sanity-plugin-media
    // A convenient way to browse, manage and select all your Sanity assets.
    media(),

    // https://www.sanity.io/plugins/sanity-plugin-markdown
    markdownSchema({ input: CustomMarkdownInput }),

    // https://www.sanity.io/docs/dashboard
    // Dashboard is a Sanity Studio tool that allows you to add widgets that display information 
    // about your content, project details, or anything else you'd want to put there.
    dashboardTool({
      widgets: [
        projectInfoWidget(),
        projectUsersWidget(
          { layout: { width: 'large' } }
        ),
        sanityTutorialsWidget()
      ],
    }),

    // Configures the global "new document" button, and document actions, 
    // hide the "duplicate" action on the Singletons (such as Settings)
    singletonPlugin([settings.name]),

    // https://www.sanity.io/plugins/code-input
    // Syntax highlighted editor for code.
    // if you need codeInput, you need to install @sanity/code-input
    codeInput(),

    // https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash
    // Search photos on Unsplash and insert them directly inside of your Sanity Studio.
    unsplashImageAsset(),
  ],
})
