// src/app/api/inngest/route.ts

import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest";
import { processLikeNotification } from "@/inngest/functions/processLikeNotification";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processLikeNotification],
});