const path = require("path");
const connect = require("connect");
const serveStatic = require("serve-static");
const puppeteer = require("puppeteer");
const sitePath = path.resolve(__dirname, "../_site/");
const IMAGE_FILENAME = "logo.png";

let server = connect().use(serveStatic(sitePath)).listen(8080, async function() {
	console.log("Web server started for puppeteer on 8080...");

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("http://localhost:8080/logo.html", {
		waitUntil: ["load", "networkidle0"]
	});
	await page.setViewport({
		width: 1600,
		height: 1200,
		deviceScaleFactor: 2
	});

	// Save just logo
	const logoEl = await page.$(".logo");
	if( !logoEl ) {
		console.error("Could not find the .logo element!");
	} else {
		await logoEl.screenshot({
			path: IMAGE_FILENAME,
			omitBackground: true
		});
		console.log( `Screenshot saved to ${IMAGE_FILENAME}.` );
	}

	await browser.close();
	server.close();
});

