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
	await page.goto("http://localhost:8080/logo/index.html", {
		waitUntil: "load"
	});
	await page.setViewport({
		width: 1600,
		height: 1200,
		deviceScaleFactor: 2
	});
	await page.screenshot({
		path: IMAGE_FILENAME,
		omitBackground: true,
		clip: {
			x: 200,
			y: 0,
			width: 1200,
			height: 1093
		}
	});
	await browser.close();

	server.close();
	console.log( `Screenshot saved to ${IMAGE_FILENAME}.` );
});

