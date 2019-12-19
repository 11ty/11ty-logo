const path = require("path");
const connect = require("connect");
const serveStatic = require("serve-static");
const puppeteer = require("puppeteer");
const sitePath = path.resolve(__dirname, "../_site/");
const IMAGE_FILENAME_PREFIX = "img/logo";
const dimensions = [
	[1569, 2186],
	[784, 1093],
	[392, 546],
	[800, 800],
	[400, 400]
];

let server = connect().use(serveStatic(sitePath)).listen(8099, async function() {
	console.log("Web server started for puppeteer on 8099...");

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("http://localhost:8099/logo.html", {
		waitUntil: ["load", "networkidle0"]
	});

	const bodyEl = await page.$("body");
	if( !bodyEl ) {
		console.error("Could not find the body element!");
	} else {
		for( let dimension of dimensions ) {
			await page.setViewport({
				width: dimension[0],
				height: dimension[1],
				deviceScaleFactor: 2
			});

			// Save just logo
			let imageFilename = `${IMAGE_FILENAME_PREFIX}-${dimension[0]}x${dimension[1]}.png`;
			await bodyEl.screenshot({
				path: imageFilename,
				omitBackground: true
			});
			console.log( `Screenshot saved to ${imageFilename}.` );
		}
	}

	await browser.close();
	server.close();
});

