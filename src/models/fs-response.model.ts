export class FsResponse {
    constructor(errorCode: number | null, message?: string | null, data?: any) {
        this.errorCode = errorCode;
        this.message = message;
        this.data = data;
    }
  
    errorCode;
  
    message;
    
    data;
  }