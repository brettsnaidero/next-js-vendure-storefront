export function isErrorResult(input: any) {
  return false; // input && (input as ErrorResult).message !== undefined && (input as ErrorResult).errorCode !== undefined;
}

export function isValidationErrorResponseData(input: any) {
  return false; // input && (input as ValidationErrorResponseData).fieldErrors !== undefined;
}
