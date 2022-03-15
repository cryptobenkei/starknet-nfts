import { Account, Contract, Provider, ec, stark, json, shortString } from 'starknet';
import fs from 'fs';

const readContract = (name) => json.parse(fs.readFileSync(`./artifacts/${name}.json`).toString('ascii'));

const main = async () => {
  const privateKey = stark.randomAddress()
  const starkKeyPair = ec.getKeyPair(privateKey)
  const starkKeyPub = ec.getStarkKey(starkKeyPair)
  console.log(`PKEY = ${privateKey}`)
  console.log(`PubKey = ${starkKeyPub}`)
  const compiledAccount = readContract('Account');
  const compiledErc20= readContract('ERC20_Mintable');
  const provider = new Provider({baseUrl: 'http://localhost:5000/'})

  const accountResponse = await provider.deployContract({
      contract: compiledAccount,
      addressSalt: starkKeyPub,
    });
  console.log(`Account = ${accountResponse.address}`); 
  const contract = new Contract(compiledAccount.abi, accountResponse.address);
  const account = new Account(provider, accountResponse.address, starkKeyPair);
  const data = stark.compileCalldata({
    name: shortString.encodeShortString('Test20'),
    symbol: shortString.encodeShortString('T20'),
    decimals: 18,
    initial_supply: 0,
    recipient: account.address,
    owner: account.address
  });
  const erc20Response = await provider.deployContract({
      contract: compiledErc20,
      constructorCalldata: data
    });
    // const erc20Address = erc20Response.address;
    // const erc20 = new Contract(compiledErc20.abi, erc20Address);
    // const mintResponse = await erc20.mint(account.address, '1000');
}

main();
