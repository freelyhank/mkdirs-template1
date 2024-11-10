import { dataset, projectId } from "@/sanity/lib/api";
import { defineCliConfig } from "sanity/cli";

/**
 * https://www.sanity.io/docs/cli
 * Build, deploy, init plugin boilerplate, run scripts, 
 * and wrangle datasets and webhooks, all from the command line
 */
export default defineCliConfig({
    api: {
        projectId,
        dataset
    }
});
