import { HTTPError } from "npm:ky";

type ErrorDetails = {
  "@type": string;
  stack_entries: unknown[];
  detail: string;
};

export type PikPakErrorResponse = {
  error: string;
  error_code: number;
  error_url: string;
  error_description: string;
  error_details: ErrorDetails[];
};

export class PikpakError extends HTTPError {
  public readonly code: number;
  public readonly id: string;

  private readonly _error: PikPakErrorResponse;
  constructor(httpError: HTTPError, json: PikPakErrorResponse) {
    super(httpError.response, httpError.request, httpError.options);
    this.code = json.error_code;
    this.id = json.error;
    this._error = json;
    this.message = json.error_description
  }

  get raw() {
    return this._error;
  }

  public readonly name = "PikpakError";
}
