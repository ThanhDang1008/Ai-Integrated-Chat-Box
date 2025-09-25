interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data?: T;
}

export default function ApiResponse<T>(
  code: number,
  message: string,
  status: string,
  data?: T
): ApiResponse<T> {
  return {
    code,
    message,
    status,
    data
  };
}
