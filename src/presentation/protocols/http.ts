export interface HttpRequest {
  body?: any;
  params?: Record<string, string>;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}
