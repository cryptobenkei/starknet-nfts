import { defaultProvider, ec, stark } from 'starknet';

function main() {
  const privateKey = stark.randomAddress()
  const starkKeyPair = ec.getKeyPair(privateKey)
  const starkKeyPub = ec.getStarkKey(starkKeyPair)
  console.log(`PKEY=${starkKeyPair}`, starkKeyPair)
  console.log(`PubKey=${starkKeyPub}`)
}

main();
