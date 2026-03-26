// Logger 工具
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string, data?: any) {
    console.log(`[${this.context}] ${message}`, data || "");
  }

  error(message: string, error?: any) {
    console.error(`[${this.context}] ${message}`, error || "");
  }

  warn(message: string, data?: any) {
    console.warn(`[${this.context}] ${message}`, data || "");
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${this.context}] ${message}`, data || "");
    }
  }
}
