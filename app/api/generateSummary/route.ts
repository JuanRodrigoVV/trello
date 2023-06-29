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
        content: "Cuando respondes, da la bienvenida al usuario suponiendo que siempre es del equipo boca juniors, con algun mensaje como, aguante boquita carajo."
        },
        {role: 'user',
        content: `Proveer un resumen de la siguiente lista de todos. Cuantos hay, cuantos hay que terminar, cuantos estan en progreso. Luego saluda al usuario como buen hincha de boca juniors, con un vamos boquita. Here is the data ${JSON.stringify(
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