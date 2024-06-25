import { name, code } from '@web3-storage/data-segment/multihash'
import { decode as decodeDigest } from 'multiformats/hashes/digest'

export { name, code }

/**
 * @param {string|URL} workerURL
 * @returns {import('multiformats').MultihashHasher<typeof code>}
 */
export const create = workerURL => new PieceHasher(workerURL)

class PieceHasher {
  #workerURL

  /** @param {string|URL} workerURL */
  constructor (workerURL) {
    this.#workerURL = workerURL
  }

  get code () {
    return code
  }

  get name () {
    return name
  }

  /** @param {Uint8Array} input */
  digest (input) {
    return digest(input, this.#workerURL)
  }
}

/**
 * @param {Uint8Array} input
 * @param {string|URL} [workerURL]
 */
export const digest = async (input, workerURL) => {
  const bytes = await new Promise((resolve, reject) => {
    const worker = new Worker(workerURL ?? 'worker.min.js')
    worker.onmessage = e => resolve(e.data)
    worker.onerror = e => {
      console.error(e)
      reject(e.error)
    }
    worker.postMessage(input)
  })
  return /** @type {import('multiformats').MultihashDigest<typeof code>} */ (
    decodeDigest(bytes)
  )
}
