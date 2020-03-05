# codecovorg

A thin wrapper for [codecov](https://www.npmjs.com/package/codecov) designed
for organizations that manage a large number of repos.

Provide the `api-key` parameter to `codecovorg`, it will in turn use this to
populate a `token` for `codecov`.

## Usage

### with c8

```bash
c8 report --reporter=text-lcov | npx codecovorg -a ${{ secrets.CODECOV_API_KEY }} --pipe
```

## License

Apache-2.0
