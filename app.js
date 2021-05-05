const qrcode = require("qrcode");

const { Client, MessageMedia } = require("whatsapp-web.js");

const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const mime = require("mime-types");

const { makeid } = require("./functions/functions");

const app = express();
const sessionId = makeid(10);
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const client = new Client();
const createSessionMiddleware = (req, res, next) => {
	client.initialize().catch((err) => {
		res.json({ status: "error", message: err.message });
		res.end();
	});

	const path = "./public/data/qrcode/" + sessionId + ".png";

	client.on("qr", (qr) => {
		qrcode.toFile(path, qr, function (err) {
			if (err) {
				req.data = { status: "error", imageUrl: "" };
			} else {
				req.data = {
					status: "success",
					imageUrl:
						"http://127.0.0.1:3030/data/qrcode/" + sessionId + ".png",
				};
				next();
			}
		});
	});
};

const uploadMediaFileMiddleware = (req, res, next) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.send({ status: "error", message: "No files were uploaded." });
	}

	mediaFile = req.files.file;
	const ext = mime.extension(mediaFile.mimetype);
	const fileName = `${makeid(15)}.${ext}`;

	uploadPath = "./public/data/media/" + fileName;

	mediaFile.mv(uploadPath, function (err) {
		if (err)
			return res.send({
				status: "error",
				message: "Failed to Upload File",
			});

		req.dataMediaFile = uploadPath;
		next();
	});
};

app.get("/createSession", createSessionMiddleware, (req, res) => {
	const { imageUrl } = req.data;

	res.json({
		imageUrl: imageUrl,
	});
});

app.post("/sendMessage", async (req, res) => {
	const postNumber = req.body.number;
	const postMessage = req.body.message;

	try {
		if (postNumber.includes(",")) {
			const numbers = postNumber.split(",");
			let response = [];
			for (number of numbers) {
				let receipt = `${number}@c.us`.trim();
				let send = await client.sendMessage(receipt, postMessage);

				response.push(send);
			}

			res.json({ status: "success", message: response });
			res.end();
		} else {
			let receipt = `${postNumber}@c.us`;
			let send = await client.sendMessage(receipt, postMessage);
			res.json({ status: "success", message: send });
			res.end();
		}
	} catch (err) {
		res.send({
			status: "error",
			message: "Session failed, Please sign in again.",
		});
		res.end();
	}
});

app.post("/sendMedia", uploadMediaFileMiddleware, async (req, res) => {
	const postNumber = req.body.number;
	const postMessage = req.body.message;

	const media = MessageMedia.fromFilePath(req.dataMediaFile);
	try {
		if (postNumber.includes(",")) {
			const numbers = postNumber.split(",");
			let response = [];
			for (number of numbers) {
				let receipt = `${number}@c.us`.trim();
				let send = await client.sendMessage(receipt, media);

				if (postMessage.trim() !== "") {
					await client.sendMessage(receipt, postMessage);
				}

				response.push(send);
			}

			res.json({ status: "success", message: response });
			res.end();
		} else {
			const send = await client.sendMessage(postNumber, media);

			if (caption.trim() !== "") {
				await client.sendMessage(postNumber, postMessage);
			}
			res.json({ status: "success", message: send });
			res.end();
		}
	} catch (err) {
		res.send({
			status: "error",
			message: "Session failed, Please sign in again.",
		});
		res.end();
	}
});

client.on("ready", () => {
	console.log("Client is ready!");
});

client.on("authenticated", (session) => {
	console.log("User authenticated");
});

//when user log out
client.on("disconnected", () => {
	console.log("client disconnected");
});

client.on("auth_failure", () => {
	console.log("Authentication failure");
});

app.listen(3030);
