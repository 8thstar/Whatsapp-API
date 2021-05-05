const fs = require("fs");

const makeid = (length) => {
	var result = [];
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}
	return result.join("");
};

// Writes QR in specified path
const exportQR = (qrCode, filename) => {
	qrCode = qrCode.replace("data:image/png;base64,", "");
	const imageBuffer = Buffer.from(qrCode, "base64");

	const path = "./public/data/qrcode/" + filename;
	// Creates 'marketing-qr.png' file
	fs.writeFileSync(path, imageBuffer);
};

module.exports = {
	exportQR,
	makeid,
};
