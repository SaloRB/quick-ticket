type ResponseResult = {
  success: boolean;
  message: string;
};

type LogEventParams = {
  message: string;
  category?: string;
  level?: LogLevel;
  data?: Record<string, any>;
  error?: unknown;
};

type LogLevel = "fatal" | "error" | "warning" | "info" | "debug";
