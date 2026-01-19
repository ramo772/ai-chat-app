// Example Lambda Function for Conversation Summary
// This is a reference implementation - deploy this to AWS Lambda
// and connect it to API Gateway

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event) => {
  try {
    // Parse the incoming request
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { messages, conversation, timestamp } = body;

    if (!messages || messages.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No conversation provided' }),
      };
    }

    console.log('Generating PDF for conversation with', messages.length, 'messages');

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add title
    page.drawText('Conversation Summary', {
      x: 50,
      y: 750,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Add timestamp
    page.drawText(`Generated: ${new Date(timestamp).toLocaleString()}`, {
      x: 50,
      y: 720,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Add conversation messages
    let yPosition = 680;
    const lineHeight = 20;
    const maxWidth = 500;

    for (const message of messages) {
      const role = message.role === 'user' ? 'User' : 'Assistant';
      const roleText = `${role}:`;
      
      // Draw role label in bold
      page.drawText(roleText, {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: message.role === 'user' ? rgb(0, 0, 1) : rgb(0.5, 0, 0.5),
      });

      yPosition -= lineHeight;

      // Draw message content (with word wrapping)
      const words = message.content.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, 11);
        
        if (textWidth > maxWidth && line !== '') {
          page.drawText(line, {
            x: 50,
            y: yPosition,
            size: 11,
            font: font,
            color: rgb(0, 0, 0),
          });
          line = word + ' ';
          yPosition -= lineHeight;
          
          // Add new page if needed
          if (yPosition < 50) {
            page = pdfDoc.addPage([600, 800]);
            yPosition = 750;
          }
        } else {
          line = testLine;
        }
      }
      
      if (line !== '') {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 11,
          font: font,
          color: rgb(0, 0, 0),
        });
      }

      yPosition -= lineHeight * 1.5;

      // Add new page if needed
      if (yPosition < 50) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = 750;
      }
    }

    // Save PDF to buffer
    const pdfBytes = await pdfDoc.save();
    const fileName = `conversation-${Date.now()}.pdf`;
    const bucketName = process.env.S3_BUCKET_NAME;

    // Upload to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: `conversations/${fileName}`,
      Body: pdfBytes,
      ContentType: 'application/pdf',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate S3 URL (pre-signed or public)
    const s3Url = `https://${bucketName}.s3.amazonaws.com/conversations/${fileName}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        s3Url: s3Url,
        fileName: fileName,
        // Alternatively, return the PDF as base64
        // fileData: Buffer.from(pdfBytes).toString('base64')
      }),
    };
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to generate conversation summary',
        message: error.message,
      }),
    };
  }
};
