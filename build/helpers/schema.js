const bookListQuerySanitizer = (path, value, toInt) => {
    console.log(`bookListQuerySanitizer: ${path} ${value} ${toInt}`);
    if (!value)
        return null;
    let values = String(value)
        .split(",")
        .map((s) => (toInt ? parseInt(s.trim()) : s.trim()));
    if (values.length === 0)
        return null;
    if (values.length === 1)
        return values[0];
    console.log(`bookListQuerySanitizer: ${JSON.stringify(values)}`);
    return values;
};
const bookListQuery = {
    skip: {
        in: ["query"],
        notEmpty: true,
        isInt: true,
        customSanitizer: {
            options: (value) => parseInt(value),
        },
    },
    pageSize: {
        in: ["query"],
        notEmpty: true,
        isInt: true,
        customSanitizer: {
            options: (value) => (parseInt(value) > 25 ? 25 : parseInt(value)),
        },
    },
    id: {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, true),
        },
        errorMessage: "passed id wrong",
    },
    title: {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, false),
        },
        errorMessage: "passed title is wrong",
    },
    author: {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, false),
        },
        errorMessage: "passed author value is wrong",
    },
    lang: {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, false),
        },
        errorMessage: "passed lang value is wrong",
    },
    topic: {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, false),
        },
        errorMessage: "passed topic value wrong",
    },
    "mime-type": {
        in: ["query"],
        customSanitizer: {
            options: (value, { path }) => bookListQuerySanitizer(path, value, false),
        },
        errorMessage: "passed mimeType is wrong",
    },
};
export default {
    bookListQuery,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hlbHBlcnMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sc0JBQXNCLEdBQUcsQ0FDN0IsSUFBWSxFQUNaLEtBQWdDLEVBQ2hDLEtBQWMsRUFDZCxFQUFFO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDeEIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUN2QixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDckMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFDRixNQUFNLGFBQWEsR0FBVztJQUM1QixJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO1FBQ1gsZUFBZSxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQ3BDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO1FBQ1gsZUFBZSxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xFO0tBQ0Y7SUFDRCxFQUFFLEVBQUU7UUFDRixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDYixlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7U0FDeEU7UUFDRCxZQUFZLEVBQUUsaUJBQWlCO0tBQ2hDO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDO1FBQ2IsZUFBZSxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1NBQ3pFO1FBQ0QsWUFBWSxFQUFFLHVCQUF1QjtLQUN0QztJQUNELE1BQU0sRUFBRTtRQUNOLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUNiLGVBQWUsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUN6RTtRQUNELFlBQVksRUFBRSw4QkFBOEI7S0FDN0M7SUFDRCxJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDYixlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7U0FDekU7UUFDRCxZQUFZLEVBQUUsNEJBQTRCO0tBQzNDO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDO1FBQ2IsZUFBZSxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1NBQ3pFO1FBQ0QsWUFBWSxFQUFFLDBCQUEwQjtLQUN6QztJQUNELFdBQVcsRUFBRTtRQUNYLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUNiLGVBQWUsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUN6RTtRQUNELFlBQVksRUFBRSwwQkFBMEI7S0FDekM7Q0FDRixDQUFDO0FBRUYsZUFBZTtJQUNiLGFBQWE7Q0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcImV4cHJlc3MtdmFsaWRhdG9yL3NyYy9taWRkbGV3YXJlcy9zY2hlbWFcIjtcclxuXHJcbmNvbnN0IGJvb2tMaXN0UXVlcnlTYW5pdGl6ZXIgPSAoXHJcbiAgcGF0aDogc3RyaW5nLFxyXG4gIHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxyXG4gIHRvSW50OiBib29sZWFuXHJcbikgPT4ge1xyXG4gIGNvbnNvbGUubG9nKGBib29rTGlzdFF1ZXJ5U2FuaXRpemVyOiAke3BhdGh9ICR7dmFsdWV9ICR7dG9JbnR9YCk7XHJcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgbGV0IHZhbHVlcyA9IFN0cmluZyh2YWx1ZSlcclxuICAgIC5zcGxpdChcIixcIilcclxuICAgIC5tYXAoKHMpID0+ICh0b0ludCA/IHBhcnNlSW50KHMudHJpbSgpKSA6IHMudHJpbSgpKSk7XHJcbiAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xyXG4gIGlmICh2YWx1ZXMubGVuZ3RoID09PSAxKSByZXR1cm4gdmFsdWVzWzBdO1xyXG4gIGNvbnNvbGUubG9nKGBib29rTGlzdFF1ZXJ5U2FuaXRpemVyOiAke0pTT04uc3RyaW5naWZ5KHZhbHVlcyl9YCk7XHJcbiAgcmV0dXJuIHZhbHVlcztcclxufTtcclxuY29uc3QgYm9va0xpc3RRdWVyeTogU2NoZW1hID0ge1xyXG4gIHNraXA6IHtcclxuICAgIGluOiBbXCJxdWVyeVwiXSxcclxuICAgIG5vdEVtcHR5OiB0cnVlLFxyXG4gICAgaXNJbnQ6IHRydWUsXHJcbiAgICBjdXN0b21TYW5pdGl6ZXI6IHtcclxuICAgICAgb3B0aW9uczogKHZhbHVlKSA9PiBwYXJzZUludCh2YWx1ZSksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGFnZVNpemU6IHtcclxuICAgIGluOiBbXCJxdWVyeVwiXSxcclxuICAgIG5vdEVtcHR5OiB0cnVlLFxyXG4gICAgaXNJbnQ6IHRydWUsXHJcbiAgICBjdXN0b21TYW5pdGl6ZXI6IHtcclxuICAgICAgb3B0aW9uczogKHZhbHVlKSA9PiAocGFyc2VJbnQodmFsdWUpID4gMjUgPyAyNSA6IHBhcnNlSW50KHZhbHVlKSksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgaWQ6IHtcclxuICAgIGluOiBbXCJxdWVyeVwiXSxcclxuICAgIGN1c3RvbVNhbml0aXplcjoge1xyXG4gICAgICBvcHRpb25zOiAodmFsdWUsIHsgcGF0aCB9KSA9PiBib29rTGlzdFF1ZXJ5U2FuaXRpemVyKHBhdGgsIHZhbHVlLCB0cnVlKSxcclxuICAgIH0sXHJcbiAgICBlcnJvck1lc3NhZ2U6IFwicGFzc2VkIGlkIHdyb25nXCIsXHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgaW46IFtcInF1ZXJ5XCJdLFxyXG4gICAgY3VzdG9tU2FuaXRpemVyOiB7XHJcbiAgICAgIG9wdGlvbnM6ICh2YWx1ZSwgeyBwYXRoIH0pID0+IGJvb2tMaXN0UXVlcnlTYW5pdGl6ZXIocGF0aCwgdmFsdWUsIGZhbHNlKSxcclxuICAgIH0sXHJcbiAgICBlcnJvck1lc3NhZ2U6IFwicGFzc2VkIHRpdGxlIGlzIHdyb25nXCIsXHJcbiAgfSxcclxuICBhdXRob3I6IHtcclxuICAgIGluOiBbXCJxdWVyeVwiXSxcclxuICAgIGN1c3RvbVNhbml0aXplcjoge1xyXG4gICAgICBvcHRpb25zOiAodmFsdWUsIHsgcGF0aCB9KSA9PiBib29rTGlzdFF1ZXJ5U2FuaXRpemVyKHBhdGgsIHZhbHVlLCBmYWxzZSksXHJcbiAgICB9LFxyXG4gICAgZXJyb3JNZXNzYWdlOiBcInBhc3NlZCBhdXRob3IgdmFsdWUgaXMgd3JvbmdcIixcclxuICB9LFxyXG4gIGxhbmc6IHtcclxuICAgIGluOiBbXCJxdWVyeVwiXSxcclxuICAgIGN1c3RvbVNhbml0aXplcjoge1xyXG4gICAgICBvcHRpb25zOiAodmFsdWUsIHsgcGF0aCB9KSA9PiBib29rTGlzdFF1ZXJ5U2FuaXRpemVyKHBhdGgsIHZhbHVlLCBmYWxzZSksXHJcbiAgICB9LFxyXG4gICAgZXJyb3JNZXNzYWdlOiBcInBhc3NlZCBsYW5nIHZhbHVlIGlzIHdyb25nXCIsXHJcbiAgfSxcclxuICB0b3BpYzoge1xyXG4gICAgaW46IFtcInF1ZXJ5XCJdLFxyXG4gICAgY3VzdG9tU2FuaXRpemVyOiB7XHJcbiAgICAgIG9wdGlvbnM6ICh2YWx1ZSwgeyBwYXRoIH0pID0+IGJvb2tMaXN0UXVlcnlTYW5pdGl6ZXIocGF0aCwgdmFsdWUsIGZhbHNlKSxcclxuICAgIH0sXHJcbiAgICBlcnJvck1lc3NhZ2U6IFwicGFzc2VkIHRvcGljIHZhbHVlIHdyb25nXCIsXHJcbiAgfSxcclxuICBcIm1pbWUtdHlwZVwiOiB7XHJcbiAgICBpbjogW1wicXVlcnlcIl0sXHJcbiAgICBjdXN0b21TYW5pdGl6ZXI6IHtcclxuICAgICAgb3B0aW9uczogKHZhbHVlLCB7IHBhdGggfSkgPT4gYm9va0xpc3RRdWVyeVNhbml0aXplcihwYXRoLCB2YWx1ZSwgZmFsc2UpLFxyXG4gICAgfSxcclxuICAgIGVycm9yTWVzc2FnZTogXCJwYXNzZWQgbWltZVR5cGUgaXMgd3JvbmdcIixcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGJvb2tMaXN0UXVlcnksXHJcbn07XHJcbiJdfQ==