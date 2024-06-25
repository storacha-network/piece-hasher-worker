import { digest } from '@web3-storage/data-segment/multihash'

onmessage = e => postMessage(digest(e.data).bytes)
