import { NextResponse } from "next/server";

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface PaginatedData<T> {
  total: number;
  list: T[];
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    code: 0,
    message: "请求成功",
    data,
  });
}

export function paginatedResponse<T>(data: PaginatedData<T>): NextResponse<ApiResponse<PaginatedData<T>>> {
  return NextResponse.json({
    code: 0,
    message: "请求成功",
    data,
  });
}

export function errorResponse(message: string, status: number = 500): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      code: -1,
      message,
      data: null,
    },
    { status }
  );
}

export function handleApiError(error: unknown, resourceName: string): NextResponse<ApiResponse<null>> {
  console.error(`获取${resourceName}失败:`, error);
  return errorResponse(`获取${resourceName}失败`, 500);
}
