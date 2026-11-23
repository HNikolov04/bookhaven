namespace BookHaven.Api.Dtos;

public sealed record PagedApiDto<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
