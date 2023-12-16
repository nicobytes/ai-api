```
npm install
npm run dev
```

```
npm run deploy
```

```
npx wrangler vectorize create movies_index --dimensions=768 --metric=cosine
npx wrangler vectorize delete movies_index
npx wrangler vectorize insert movies_index --file=data.ndjson
```
