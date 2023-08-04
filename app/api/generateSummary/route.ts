import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // todos in the body of the POST req
    const {todos} = await request.json();
    console.log(todos);

    // OpenAI GPT-3
    const response = await openai.createChatCompletion({
       model: 'gpt-3.5-turbo',
       temperature: 0.8,
       n: 1,
       stream: false,
       messages: [
        {role: 'system',
        content: "Welcome the user with a positive message."
        },
        {role: 'user',
        content: `
        Provide a summary of the following list of all. How many are there, how many need to be finished, how many are in progress. Then greet the user. Here are the tasks ${JSON.stringify(
            todos
        )}`
        },
       ]
    });

    const {data} = response;
    
    console.log('Data is', data);
    console.log(data.choices[0].message);

    return NextResponse.json(data.choices[0].message)

}