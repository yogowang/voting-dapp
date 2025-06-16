import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Voting} from "../../../../anchor/target/types/voting";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
const IDL = require("../../../../anchor/target/idl/voting.json");
export async function GET(request: Request) {
    const actionMetadata : ActionGetResponse = {
        icon:"https://static.wikia.nocookie.net/rainbowsix/images/a/a2/Thorn_icon.png/revision/latest/scale-to-width-down/1000?cb=20211202225437",
        title: "vote for thorn",
        description: "Vote for your favorite option",
        label: "Vote",
        links: {
            actions:[
                {
                    label: "vote-thorn",
                    type:"post",
                    href: "/api/vote?candidate=thorn",
                    },
                    {
                    label: "vote-fuze",
                    type:"post",
                    href: "/api/vote?candidate=fuze",
                    },
            ]
    }
    };

    return Response.json(actionMetadata,{headers: ACTIONS_CORS_HEADERS});
}
export async function POST(request: Request) {
    
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");
    if (candidate !== "thorn" && candidate !== "fuze") {
        return new Response("Invalid candidate", { status: 400 , headers: ACTIONS_CORS_HEADERS});
    }
    const connection = new Connection("http://127.0.0.1:8899","confirmed");
    const program : Program<Voting> = new Program(IDL,{connection})
    const body: ActionPostRequest = await request.json();
    let voter;
    try {
        voter = new PublicKey(body.account);
    }
    catch(error){
        return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }
    const instruction = await program.methods.vote(candidate, new anchor.BN(1))
    .accounts({
        signer: voter,
    })
    .instruction();
    const blockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction(
        { 
            feePayer: voter, 
            blockhash: blockhash.blockhash,
            lastValidBlockHeight: blockhash.lastValidBlockHeight 
        }
    ).add(instruction);

    const response = await createPostResponse({
        fields:{
            transaction: transaction,
           type: "transaction",
        }
    })
    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}