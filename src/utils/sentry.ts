import * as Sentry from "@sentry/nextjs";

export function logEvent({
  message,
  category = "general",
  level = "info",
  data,
  error,
}: LogEventParams) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  });

  if (error) {
    Sentry.captureException(error, { extra: data });
  }
  else {
    Sentry.captureMessage(message, level);
  }
}
