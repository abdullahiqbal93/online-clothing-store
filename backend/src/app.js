import { init } from "@/lib/init";
import { mainLogger } from "@/lib/logger/winston";
import { welcome } from "@/lib/welcome";

process.on("unhandledRejection", (...reason) => {
  mainLogger.error("Unhandled Rejection at:", reason);
});

init()
  .then(() => {
    mainLogger.info(welcome());
  })
  .catch((e) => {
    mainLogger.error("Application start error", e);
  });
