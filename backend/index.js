// index.js
import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import Groq from "groq-sdk"

const app = express()
const PORT = process.env.PORT || 8000

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

app.use(
  cors({
    origin: ["http://localhost:3000", "http://34.204.9.129"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
)

app.use(cors({ origin: "*" }));


app.use(bodyParser.json())

// SSE clients
const clients = new Set()

// Chat API endpoint
app.post("/api/chatAPI", async (req, res) => {
  try {
    const userMessage = req.body.inputCode || req.body.message

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" })
    }

    console.log("Received message:", userMessage)

    // Call Groq AI with streaming
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "Llama-3.3-70B-Versatile", // You can also use "llama2-70b-4096" or other models
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })

    // Stream response chunks to SSE clients
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || ""
      
      if (content) {
        const payload = {
          type: "chunk",
          content: content,
        }
        
        clients.forEach((client) => {
          try {
            client.write(`data: ${JSON.stringify(payload)}\n\n`)
          } catch (err) {
            console.error("Error writing to client:", err)
          }
        })
      }
    }

    // Send done signal
    const donePayload = {
      type: "done",
    }
    clients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify(donePayload)}\n\n`)
      } catch (err) {
        console.error("Error writing done signal to client:", err)
      }
    })
    
    return res.json({ success: true })
  } catch (error) {
    console.error("Error in /api/chatAPI:", error)
    
    // Send error to SSE clients
    const errorPayload = {
      type: "error",
      content: error.message,
    }
    clients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify(errorPayload)}\n\n`)
      } catch (err) {
        console.error("Error writing error to client:", err)
      }
    })
    
    return res.status(500).json({ error: error.message })
  }
})

// SSE endpoint for streaming messages
app.get("/messages", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  console.log("Client connected to /messages")
  clients.add(res)

  res.write(
    `data: ${JSON.stringify({
      type: "connected",
      message: "Connected to chat stream",
    })}\n\n`
  )

  req.on("close", () => {
    console.log("Client disconnected from /messages")
    clients.delete(res)
  })
})

process.on("SIGINT", () => {
  console.log("Shutting down...")
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
