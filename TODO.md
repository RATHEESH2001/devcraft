# TODO - Convert Laravel Blade to Pure HTML/CSS/JS

- [ ] Replace `index.html` with a standalone pure HTML page (remove Blade directives, add full `<html>/<head>/<body>`).

- [x] Convert contact form in `index.html` from Blade (`route`, `@csrf`, `old`, `@error`) to pure HTML.
- [x] Add form success/error containers (`#formSuccess`, `#formError`) for JS.


- [x] Update `main.js` to handle contact form submit frontend-only and remove any assumptions about Blade/server responses.

- [ ] Convert `nav.html` and `footer.html` Blade helpers to static HTML (optional if they’re inlined later).
- [ ] Run a repo search to ensure no Blade syntax remains in HTML (`@csrf`, `@error`, `{{ route`, `{{ url`, `@extends`, `@section`, `@endsection`, `old(`, `session(`).
- [ ] Quick manual test: open `index.html` in browser and verify nav scrolling, reveal animations, and contact form UX.

