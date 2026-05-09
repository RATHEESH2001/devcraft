# TODO — Static hosting fixes

- [x] Identify non-static template syntax causing static build/host failures.
- [x] Convert `nav.html` to pure static HTML (remove `{{ url('/') }}`).
- [x] Convert `footer.html` to pure static HTML (remove `{{ url('/') }}` and `{{ date('Y') }}`).
- [x] Ensure `footer.html` contains a `#footerYear` element (for `main.js`).

- [x] Re-run repo search for `{{ ... }}` inside `*.html` to confirm no Blade/template syntax remains.

- [ ] Manual test: open `index.html` in browser (no build step) and verify header/footer work.

