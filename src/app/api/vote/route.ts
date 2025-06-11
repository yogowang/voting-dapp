import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
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
}