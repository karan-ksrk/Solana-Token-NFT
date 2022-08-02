import { clusterApiUrl, Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, Account, getMint, getAccount, createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';

// Special setup to add a Budder class, becaue it's missing
window.Buffer = window.Buffer || require('buffer').Buffer;

const MintNft = () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();
    let mint: PublicKey;
    let fromTokenAccount: Account;


    async function createNft() {
        const fromAIrdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        const latestBlockHash = await connection.getLatestBlockhash()

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAIrdropSignature,
        });

        mint = await createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            0 // only allow whole tokens
        );

        console.log(`Create token: ${mint.toBase58()}`);

        // Get the Nft account of the fromWallet address, and if it does not exits, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log(`Create NFT Account: ${fromTokenAccount.address.toBase58()}`);
    }


    async function mintNft() {

        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            1
        );
        console.log(`Mint signature: ${signature}`);
    }

    async function lockNft() {
        let transaction = new Transaction().add(createSetAuthorityInstruction(
            mint,
            fromWallet.publicKey,
            AuthorityType.MintTokens,
            null
        ));

        const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log(`Lock signature: ${signature}`);
    }

    return (
        <div>
            Mint NFT Section
            <div>
                <button onClick={createNft}>Create NFT</button>
                <button onClick={mintNft}>Mint NFT</button>
                <button onClick={lockNft}>Lock NFT</button>
            </div>
        </div>
    )
}

export default MintNft