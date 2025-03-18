export interface IPaginationResponse<T> {
    statusCode: number;
    data: T[];
    pagination: Pagination;
}

export interface Pagination {
    totalPages: number;
    totalItems: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
}
