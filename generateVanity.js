import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import GPU from "gpu.js";

const DESIRED_PREFIX = "test";

const gpu = new GPU();

const findVanityAddress = gpu
  .createKernel(function (pattern) {
    const charset =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    function generateRandomChar() {
      return charset[Math.floor(Math.random() * charset.length)];
    }

    for (let i = 0; i < 100000; i++) {
      let randomAddress = "";
      for (let j = 0; j < 5; j++) {
        randomAddress += generateRandomChar();
      }

      if (randomAddress.startsWith(pattern)) {
        return randomAddress;
      }
    }

    return "";
  })
  .setOutput([1]);

function generateWallet() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const privateKey = bs58.encode(Buffer.from(keypair.secretKey));
  return { publicKey, privateKey };
}

async function searchVanityWallet() {
  console.log(
    `Searching for a Solana wallet address starting with '${DESIRED_PREFIX}'...`
  );

  while (true) {
    const { publicKey, privateKey } = generateWallet();
    if (publicKey.startsWith(DESIRED_PREFIX)) {
      console.log("Match found!");
      console.log(`Public Key: ${publicKey}`);
      console.log(`Private Key: ${privateKey}`);
      break;
    }
  }
}

searchVanityWallet();
