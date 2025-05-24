declare module 'express' {
    interface Response {
      [x: string]: any;
      sendResponse(data: any, message?: string, status?: number): void;
    }
  }