import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PROMPTS = {
  improve:   (t) => `Improve this text to be clearer and more engaging. Return ONLY the improved text:\n\n${t}`,
  summarise: (t) => `Summarise this text concisely in 2-3 sentences. Return ONLY the summary:\n\n${t}`,
  formal:    (t) => `Rewrite this text in a formal, professional tone. Return ONLY the rewritten text:\n\n${t}`,
  continue:  (t) => `Continue writing naturally from where this text ends. Return ONLY the continuation:\n\n${t}`,
  grammar:   (t) => `Fix all grammar and spelling errors. Return ONLY corrected text:\n\n${t}`,
  shorter:   (t) => `Make this text shorter while keeping key info. Return ONLY shortened text:\n\n${t}`,
};

export async function POST(request) {
  try {
    const { text, action } = await request.json();

    if (!text || !action || !PROMPTS[action]) {
      return new Response("Invalid request", { status: 400 });
    }

    // 🔥 Groq streaming response
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: PROMPTS[action](text),
        },
      ],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (err) {
    console.error("Groq AI route error:", err);
    return new Response("AI request failed", { status: 500 });
  }
}
