# End Conversation Feature - Setup Guide

## Overview
This feature allows users to end a conversation and download a PDF summary. The implementation involves:
1. Frontend button to trigger the end conversation flow
2. Backend endpoint that calls AWS Lambda via API Gateway
3. Lambda function that generates PDF and stores it in S3
4. File download in the frontend

## Implementation Steps

### 1. Frontend ✅ (Already Implemented)
- Added "End Conversation & Download Summary" button
- Button only appears when there are messages
- Sends entire conversation to backend endpoint
- Downloads the PDF file automatically

### 2. Backend ✅ (Already Implemented)
- Created `/api/end-conversation` endpoint in `backend/index.js`
- Accepts conversation messages
- Calls Lambda via API Gateway (URL needs to be configured)
- Returns PDF file to frontend for download

### 3. Lambda Function (To be deployed)

#### Lambda Setup
1. **Create Lambda Function:**
   - Go to AWS Console → Lambda
   - Create new function (Node.js 18.x or later)
   - Copy code from `lambda-example.js`

2. **Install Dependencies:**
   ```bash
   # In a separate directory for Lambda
   npm init -y
   npm install @aws-sdk/client-s3 pdf-lib
   # Zip the contents including node_modules
   zip -r function.zip .
   ```

3. **Lambda Configuration:**
   - Set environment variables:
     - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
     - `S3_BUCKET_NAME`: Your S3 bucket name
   - Set IAM role with S3 permissions:
     ```json
     {
       "Effect": "Allow",
       "Action": [
         "s3:PutObject",
         "s3:GetObject"
       ],
       "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
     }
     ```

4. **Create API Gateway:**
   - Go to API Gateway in AWS Console
   - Create REST API
   - Create POST method
   - Connect to your Lambda function
   - Enable CORS
   - Deploy the API
   - Copy the API Gateway URL

5. **Update Backend Configuration:**
   In `backend/index.js`, replace:
   ```javascript
   const lambdaApiGatewayUrl = "YOUR_API_GATEWAY_URL_HERE"
   ```
   With your actual API Gateway URL:
   ```javascript
   const lambdaApiGatewayUrl = "https://your-api-id.execute-api.region.amazonaws.com/prod/generate-summary"
   ```

### 4. S3 Bucket Setup

1. **Create S3 Bucket:**
   - Go to AWS Console → S3
   - Create new bucket
   - Enable versioning (optional)
   - Configure CORS if serving files publicly:
     ```json
     [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedOrigins": ["*"],
         "ExposeHeaders": []
       }
     ]
     ```

2. **Set Bucket Permissions:**
   - Option A: Make files public (simpler)
   - Option B: Use pre-signed URLs (more secure)

### Alternative: Using Groq for Summary (Simpler Approach)

If you want to avoid Lambda complexity, you can generate the summary using Groq AI directly in your backend:

```javascript
// Add to backend/index.js
import PDFDocument from 'pdfkit';
import fs from 'fs';

app.post("/api/end-conversation", async (req, res) => {
  try {
    const { messages } = req.body;

    // Generate summary using Groq
    const summaryPrompt = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const summary = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Summarize the following conversation concisely, highlighting key points and conclusions."
        },
        {
          role: "user",
          content: summaryPrompt
        }
      ],
      model: "Llama-3.3-70B-Versatile",
    });

    // Create PDF
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="conversation-summary.pdf"');
      res.send(pdfData);
    });

    doc.fontSize(20).text('Conversation Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(summary.choices[0].message.content);
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow:**
   - Have a conversation with the chatbot
   - Click "End Conversation & Download Summary"
   - PDF should download automatically

## Troubleshooting

- **CORS errors**: Ensure API Gateway has CORS enabled
- **S3 access denied**: Check IAM role permissions
- **Lambda timeout**: Increase timeout in Lambda settings (default is 3s, increase to 30s)
- **Large conversations**: Consider pagination or chunking for very long conversations

## Next Steps

1. Deploy Lambda function to AWS
2. Create and configure S3 bucket
3. Set up API Gateway
4. Update backend with API Gateway URL
5. Test end-to-end flow
