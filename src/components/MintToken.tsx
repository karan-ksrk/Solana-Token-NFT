import React from 'react'

import { clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, Account, getMint, getAccount } from '@solana/spl-token';

// Special setup to add a Budder class, becaue it's missing
window.Buffer = window.Buffer || require('buffer').Buffer;

const MintToken = () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();
    const toWallet = new PublicKey("8dxFPfYKBiWNMGJsTBQEVrE9H3TLyfeefKj6NZXw5pfD");
    let mint: PublicKey;
    let fromTokenAccount: Account;



    async function createToken() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        const latestBlockHash = await connection.getLatestBlockhash()

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirdropSignature,
        });

        // Create new token mint
        mint = await createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            9 // here 9 means we have decimal of 9 0's
        );
        console.log(`Create token: ${mint.toBase58()}`);

        // Get the token account of the fromWallet address, and if it does not exits, create it 
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    }

    async function mintToken() {
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            10000000000 // 10 billion
        );
        console.log(`Mint Token: ${signature}`);
    }

    async function checkBalance() {
        const mintInfo = await getMint(connection, mint);
        console.log(mintInfo.supply);

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log(tokenAccountInfo.amount);
    }

    async function sendToken() {
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount ${toTokenAccount.address.toBase58()}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000 // 1 billion
        );
        console.log(`finished transer with signature: ${signature}`);
    }

    return (
        <div>
            Mint Token Section
            <div>
                <button onClick={createToken}>Create token</button>
                <button onClick={mintToken}>Mint token</button>
                <button onClick={checkBalance}>Check balance</button>
                <button onClick={sendToken}>Send Token</button>
            </div>
        </div>
    )
}

export default MintToken