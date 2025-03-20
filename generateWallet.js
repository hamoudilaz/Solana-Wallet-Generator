import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const desiredPattern = /^WWW/;
const numThreads = 6;

if (isMainThread) {
  let found = false;
  let totalAttempts = 0;

  console.log(`Starting wallet generation on ${numThreads} threads...`);

  const progressInterval = setInterval(() => {
    console.log(`Total attempts across all threads: ${totalAttempts}`);
  }, 1000);

  const startWorker = (threadId) => {
    return new Promise((resolve) => {
      const worker = new Worker(__filename, {
        workerData: {
          desiredPattern: desiredPattern.source,
          flags: desiredPattern.flags,
          threadId,
        },
      });

      worker.on("message", (message) => {
        if (message.found && !found) {
          found = true;
          console.log(`Thread ${message.threadId} found a match!`);
          console.log(`Wallet Address: ${message.publicKey}`);
          console.log(`Private Key: ${message.privateKey}`);
          clearInterval(progressInterval);
          resolve();
        } else if (message.attempts) {
          totalAttempts += message.attempts;
        }
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker ${threadId} stopped with exit code ${code}`);
        }
        resolve();
      });
    });
  };


  (async () => {
    const workers = [];
    for (let i = 0; i < numThreads; i++) {
      workers.push(startWorker(i));
    }
    await Promise.all(workers);
    console.log("All workers have completed.");
  })();
} else {
  const { desiredPattern, flags, threadId } = workerData;
  const regex = new RegExp(desiredPattern, flags);
  let attempts = 0;

  const generateWallet = () => {
    while (true) {
      attempts++;
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();

      if (regex.test(publicKey)) {
        const privateKey = bs58.encode(Buffer.from(keypair.secretKey));
        parentPort.postMessage({
          found: true,
          threadId,
          publicKey,
          privateKey,
        });
        return;
      }

      if (attempts % 1000 === 0) {
        parentPort.postMessage({ attempts: 1000 });
      }
    }
  };

  generateWallet();
}
