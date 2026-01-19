// index.js
import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import Groq from "groq-sdk"
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const app = express()
const PORT = process.env.PORT || 8000

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Initialize Lambda client
const lambdaClient = new LambdaClient({ 
  region: process.env.AWS_REGION || "us-east-1" 
})

// Initialize S3 client
const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || "us-east-1" 
})

app.use(cors({ origin: "*" }))


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

// End conversation endpoint - Generate summary and save to S3
app.post("/api/end-conversation", async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No conversation provided" })
    }

    console.log("Generating conversation summary for", messages.length, "messages")

    const jobId = `job_${Date.now()}`

    const payload = {
      jobId,
      messages: messages,
      timestamp: new Date().toISOString(),
    }

    // Invoke Lambda function directly from EC2
    const lambdaFunctionName = process.env.LAMBDA_FUNCTION_NAME || "YOUR_LAMBDA_NAME"
    
    console.log(`Invoking Lambda function: ${lambdaFunctionName}`)

    const command = new InvokeCommand({
      FunctionName: lambdaFunctionName,
      InvocationType: "RequestResponse", // Synchronous invocation to get response
      Payload: Buffer.from(JSON.stringify(payload)),
    })

    const lambdaResponse = await lambdaClient.send(command)

    // Parse Lambda response
    const responsePayload = JSON.parse(Buffer.from(lambdaResponse.Payload).toString())
    
    console.log("Lambda response:", responsePayload)

    // Check if Lambda execution was successful
    if (lambdaResponse.FunctionError) {
      throw new Error(`Lambda error: ${responsePayload.errorMessage}`)
    }

    // Parse the body from Lambda response
    const lambdaData = typeof responsePayload.body === 'string' 
      ? JSON.parse(responsePayload.body) 
      : responsePayload.body

    // Return the S3 key to the frontend
    return res.json({
      ok: true,
      jobId: lambdaData.jobId || jobId,
      s3Key: lambdaData.s3Key || lambdaData.key,
      message: "Conversation saved successfully"
    })
  } catch (error) {
    console.error("Error in /api/end-conversation:", error)
    return res.status(500).json({ error: error.message })
  }
})

// Download conversation endpoint - Generate presigned URL for S3 file
app.get("/api/download-conversation", async (req, res) => {
  try {
    const { key } = req.query
    
    if (!key) {
      return res.status(400).json({ error: "Missing S3 key parameter" })
    }

    console.log(`Generating presigned URL for key: ${key}`)

    const bucketName = process.env.BUCKET_NAME || process.env.AWS_S3_BUCKET
    
    if (!bucketName) {
      return res.status(500).json({ error: "S3 bucket name not configured" })
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentType: "text/html",
      ResponseContentDisposition: `attachment; filename="conversation-${Date.now()}.html"`,
    })

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }) // 5 minutes
    
    console.log("Presigned URL generated successfully")
    
    return res.json({ downloadUrl })
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    return res.status(500).json({ error: error.message })
  }
})

// SSE endpoint for streaming messages
app.get("/api/messages", (req, res) => {
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

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})

process.on("SIGINT", () => {
  console.log("Shutting down...")
  server.close(() => process.exit(0))
})

process.on("SIGTERM", () => {
  console.log("Shutting down...")
  server.close(() => process.exit(0))
})

