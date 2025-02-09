export function isAvailable(value: Available | APIError): value is Available {
  return (value as Available).available !== undefined;
}
