import pkg from '@lmstudio/sdk';
const { LMStudioClient } = pkg;
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from 'fs';


dotenv.config();

// function to encode file data to base64 encoded string
async function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file);
	// convert binary data to base64 encoded string
	return new Buffer.from(bitmap).toString('base64');
}

export const renderHandler = (req, res, next) => {
	const features = {
		title: 'Generative AI Showcase'
	}
	res.render('index', { features });
}

export const textgenerationHandler = async (req, res, next) => {
	// Create a client to connect to LM Studio, then load a model
	const client = new LMStudioClient();
	const model = await client.llm.load("lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF", {
		config: {
			gpuOffload: "off"
		}
	});
	// Predict!
	const prediction = model.respond([
		{ role: "user", content: req.body.userInput },
	]);
	let reply = '';
	for await (const text of prediction) {
		process.stdout.write(text);
		reply += text
	}
	res.json({ response: reply });
}

export const visionDiscussionHandler = async (req, res, next) => {
	const { userInput, userImageInput } = req.body;
	const client = new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: process.env.OPEN_API_KEY });
	const base64image = await base64_encode(`images/${userImageInput}`);
	const response = await client.chat.completions.create({
		model: "xtuner/llava-phi-3-mini-gguf",
		messages: [
			{
				role: "user",
				content: [
					{ type: "text", text: "Lets talk about this image. In 2 sentences." },
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${base64image}`
						}
					},
				],
			},
			{
			  "role": "user",
			  "content": `${userInput}`
			},
		],
	});
	res.json({ response: response.choices[0].message.content });
}