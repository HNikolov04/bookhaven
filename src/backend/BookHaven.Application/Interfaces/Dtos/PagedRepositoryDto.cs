namespace BookHaven.Application.Interfaces.Dtos;

public sealed record PagedRepositoryDto<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount);
