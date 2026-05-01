const logLevels = {
  INFO: '\x1b[36mINFO\x1b[0m',
  SUCCESS: '\x1b[32mSUCCESS\x1b[0m',
  WARNING: '\x1b[33mWARNING\x1b[0m',
  ERROR: '\x1b[31mERROR\x1b[0m',
};

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[${logLevels.INFO}] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  success: (message: string, meta?: any) => {
    console.log(`[${logLevels.SUCCESS}] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  warning: (message: string, meta?: any) => {
    console.warn(`[${logLevels.WARNING}] ${new Date().toISOString()} - ${message}`, meta || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[${logLevels.ERROR}] ${new Date().toISOString()} - ${message}`, error || '');
  },
};
