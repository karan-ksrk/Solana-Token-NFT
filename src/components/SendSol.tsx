import { clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, Account, NATIVE_MINT, getMint, getAccount, getAssociatedTokenAddress, createSetAuthorityInstruction, AuthorityType, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

// Special setup to add a Budder class, becaue it's missing
window.Buffer = window.Buffer || require('buffer').Buffer;

const SendSol = () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();
    const toWallet = new PublicKey("8dxFPfYKBiWNMGJsTBQEVrE9H3TLyfeefKj6NZXw5pfD");
    let mint: PublicKey;
    let fromTokenAccount: Account;
    let associatedTokenAccount: PublicKey;

    async function wrapSol() {
        const airdropSignature = await connection.requestAirdrop(fromWallet.publicKey, 2 * LAMPORTS_PER_SOL);
        const latestBlockHash = await connection.getLatestBlockhash()
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        });
        associatedTokenAccount = await getAssociatedTokenAddress(
            NATIVE_MINT, // sol1111111
            fromWallet.publicKey,
        );
        console.log(associatedTokenAccount.toBase58())

        // Create token account to hold your wrapped SOL

        const ataTransaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                fromWallet.publicKey,
                associatedTokenAccount,
                fromWallet.publicKey,
                NATIVE_MINT
            )
        );

        await sendAndConfirmTransaction(connection, ataTransaction, [fromWallet]);
    }





    return (
        <div>
            Mint NFT Section
            <div>
                <button onClick={wrapSol}>Wrap SOL</button>
                {/* <button onClick={unwrapSol}>Unwrap SOL</button>
                <button onClick={sendSol}>Send SOl</button> */}
            </div>
        </div>
    )
}

export default SendSol