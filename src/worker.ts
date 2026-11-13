// Worker entry, as EmDash's Cloudflare guide gives it: Astro's handler plus EmDash's
// scheduled handler (publishing, maintenance) and its Durable Object classes.
import handler, {
  createScheduledHandler,
  EmDashRoom,
  EmDashRoomSite,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";

export { EmDashRoom, EmDashRoomSite, PluginBridge };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
