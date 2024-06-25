import * as Link from 'multiformats/link'
import * as raw from 'multiformats/codecs/raw'
import * as PieceHasher from './main.js'

const randomBytes = size => {
  const bytes = new Uint8Array(size)
  while (size) {
    const chunk = new Uint8Array(Math.min(size, 65_536))
    crypto.getRandomValues(chunk)
    size -= chunk.length
    bytes.set(chunk, size)
  }
  return bytes
}

export const test = {
  'hashes the piece with a worker': async (/** @type {import('entail').assert} */ assert) => {
    const hasher = PieceHasher.create('worker.min.js')
    const input = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
    const digest = await hasher.digest(input)
    const link = Link.create(raw.code, digest)
    assert.equal(link.toString(), 'bafkzcibcoubejw4nmktwc33ltx33ooycrmpz7kh23rmnt63tbzovse7y6vf5wly')
  },

  'does not block the event loop': async (/** @type {import('entail').assert} */ assert) => {
    const hasher = PieceHasher.create('worker.min.js')
    const input = randomBytes(1024 * 1024 * 133)

    let start = Date.now()
    setTimeout(() => {
      const blocked = Date.now() - start > 1100
      assert.ok(!blocked)
      if (!blocked) console.log('not blocked!')
    }, 1000)

    await hasher.digest(input)
  }
}
