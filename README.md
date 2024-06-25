# piece-hasher-worker

Web worker for creating piece hashes.

Piece hashes are the primary means of addressing data stored on Filecoin. Piece hashes are generated on the client for provability and verification, however they are computationally expensive to create. By moving the work into a dedicated web worker the main thread does not get blocked.

## Install

```sh
npm install @web3-storage/piece-hasher-worker
```

## Usage

1. Import the module in your application:

    ```js
    import * as PieceHasher from '@web3-storage/piece-hasher-worker'
    ```
2. Make the worker script available for your application to download. i.e. the file at `./node_modules/@web3-storage/piece-hasher-worker/worker.min.js`. It MUST be hosted on the same domain as your application.
3. Create a hasher passing the worker script URL, and create a multihash from some data:
    ```js
    const pieceHasher = PieceHasher.create('https://example.org/worker.js')
    const digest = await pieceHasher.digest(crypto.getRandomValues(new Uint8Array(100)))
    ```
4. Optionally, build a CID from the returned multihash:
    ```js
    import * as Link from 'multiformats/link'
    import * as raw from 'multiformats/codecs/raw'

    const cid = Link.create(raw.code, digest)
    console.log(cid.toString())
    ```

### Example

Use with the web3.storage client:

```js
import * as Client from '@web3-storage/w3up-client'
import * as PieceHasher from '@web3-storage/piece-hasher-worker'

const client = Client.create(/* ... */)
const pieceHasher = PieceHasher.create('https://example.org/worker.js')

const cid = await client.uploadFile(new Blob(['some data']), {
  pieceHasher,
  onShardStored ({ piece }) {
    console.log(`Stored a shard with Piece CID: ${piece}`)
  }
})
console.log(cid.toString())
```

## Contributing

Feel free to join in. All welcome. [Open an issue](https://github.com/storacha-network/piece-hasher-worker/issues)!

## License

Dual-licensed under [MIT + Apache 2.0](LICENSE.md)
