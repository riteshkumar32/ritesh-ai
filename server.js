const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.static("public")
);

const upload = multer({
  dest: "uploads/",
});

let chatHistory = [];

let uploadedContext = "";

let currentFile = {
  type: null,
  name: null,
};

global.uploadedImageBase64 =
  null;

app.post(
  "/api/chat",

  async (req, res) => {

    try {

      const { message } =
        req.body;

      const history =
        chatHistory
          .map(
            (m) =>
              `${m.role}: ${m.text}`
          )
          .join("\n");

      const finalPrompt = `
You are Ritesh AI.

If uploaded content exists,
use it carefully.

Uploaded File:
${currentFile.name || "None"}

Uploaded Content:
${uploadedContext || "No uploaded content"}

Chat History:
${history}

User:
${message}
`;

      let messages = [];

      if (
        global.uploadedImageBase64
      ) {

        messages = [
          {
            role: "user",

            content: [
              {
                type: "text",

                text: finalPrompt,
              },

              {
                type: "image_url",

                image_url: {
                  url:
                    `data:image/jpeg;base64,${global.uploadedImageBase64}`,
                },
              },
            ],
          },
        ];

      }

      else {

        messages = [
          {
            role: "user",

            content:
              finalPrompt,
          },
        ];

      }

      const response =
        await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",

          {
            model:
              "openai/gpt-4o-mini",

            messages,
          },

          {
            headers: {
              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const text =
        response.data
          .choices[0]
          .message.content;

      chatHistory.push({
        role: "User",
        text: message,
      });

      chatHistory.push({
        role: "Assistant",
        text,
      });

      res.json({
        response: text,
      });

    }

    catch (error) {

      console.error(
        error.response?.data ||
        error.message
      );

      res.status(500).json({
        error:
          "AI response failed",
      });

    }

  }
);

app.post(
  "/api/upload",

  upload.single("file"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error:
            "No file uploaded",
        });

      }

      const filePath =
        req.file.path;

      const ext =
        path.extname(
          req.file.originalname
        ).toLowerCase();

      currentFile.name =
        req.file.originalname;

      if (
        ext === ".txt"
      ) {

        currentFile.type =
          "text";

        global.uploadedImageBase64 =
          null;

        const text =
          fs.readFileSync(
            filePath,
            "utf8"
          );

        uploadedContext =
          text;

      }

      else if (
        ext === ".pdf"
      ) {

        currentFile.type =
          "pdf";

        global.uploadedImageBase64 =
          null;

        const dataBuffer =
          fs.readFileSync(
            filePath
          );

        const pdfData =
          await pdfParse(
            dataBuffer
          );

        const cleanText =
          pdfData.text
            .replace(/\s+/g, " ")
            .trim();

        uploadedContext =
          cleanText.slice(
            0,
            12000
          );

      }

      else if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg"
      ) {

        currentFile.type =
          "image";

        uploadedContext = "";

        const imageBuffer =
          fs.readFileSync(
            filePath
          );

        global.uploadedImageBase64 =
          imageBuffer.toString(
            "base64"
          );

      }

      fs.unlinkSync(
        filePath
      );

      res.json({
        success: true,

        fileType:
          currentFile.type,

        fileName:
          currentFile.name,
      });

    }

    catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Upload failed",
      });

    }

  }
);

app.post(
  "/api/new-chat",

  (req, res) => {

    chatHistory = [];

    uploadedContext = "";

    currentFile = {
      type: null,
      name: null,
    };

    global.uploadedImageBase64 =
      null;

    res.json({
      success: true,
    });

  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`
==================================
Ritesh AI running on:
http://localhost:${PORT}
==================================
`);

});