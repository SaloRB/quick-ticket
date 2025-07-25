type AuthPayload = {
  userId: string;
};

type LogEventParams = {
  message: string;
  category?: string;
  level?: LogLevel;
  data?: Record<string, any>;
  error?: unknown;
};

type LogLevel = "fatal" | "error" | "warning" | "info" | "debug";

type ResponseResult = {
  success: boolean;
  message: string;
};
