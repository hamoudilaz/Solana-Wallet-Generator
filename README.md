# Solana Wallet Generator

This is a simple tool for generating Solana wallets but instead of running on just one thread it uses multiple threads to speed things up. The more CPU threads your machine has the faster it runs.

When you run `node generateWallet.js` it fires up multiple threads. Each generating wallets as fast as possible until one of them finds a match. It keeps track of the total attempts across all threads and once a wallet with the desired pattern is found it prints the result.

For example if you're searching for a wallet that starts with "WWW" you will see something like this:

```
Total attempts across all threads: 13000
Total attempts across all threads: 40000
Total attempts across all threads: 64000
Total attempts across all threads: 86000
Total attempts across all threads: 110000
Total attempts across all threads: 134000
Total attempts across all threads: 158000
Total attempts across all threads: 182000
Total attempts across all threads: 201000
Total attempts across all threads: 224000
Total attempts across all threads: 248000
Total attempts across all threads: 270000
Total attempts across all threads: 294000
Total attempts across all threads: 318000
Total attempts across all threads: 342000
Thread 0 found a match!
Wallet Address: WWWHVSStLiBHnWKbnV5EjFX965DaG7StZ3ypHL4nMe1
Private Key: 5i6E8of1hxVv7Dg83AqGxRJCykFtTBQVWHAVQ3t5oP3RUvcGHUPCHcaodLCoCPzLaHyf3HAc2xHDFHAGr8FxcbhB
```

You can tweak the script to look for different patterns. If you change this line:

```js
const desiredPattern = /^WWW/;
```

It will only stop when it finds a wallet that starts with "WWW". The longer the pattern the longer it takes. Three unique characters usually takes from 2 min to 1 hour, four can take several hours, and five or more could take days or even a week. It’s all about odds and luck :D

Thats pretty much it. Just let it run and wait for it to find something cool.

