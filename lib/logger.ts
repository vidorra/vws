type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  /** Log an informational message */
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),

  /** Log a warning */
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),

  /** Log an error, accepting an Error object or a plain string */
  error: (message: string, errorOrContext?: Error | Record<string, unknown>) => {
    if (errorOrContext instanceof Error) {
      log('error', message, { error: errorOrContext.message, stack: errorOrContext.stack });
    } else {
      log('error', message, errorOrContext);
    }
  },
};
