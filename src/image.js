const path = require("path");
const connect = require("connect");
const serveStatic = require("serve-static");
const puppeteer = require("puppeteer");
const sitePath = path.resolve(__dirname, "../_site/");
const IMAGE_FILENAME_PREFIX = "img/logo";
const dimensions = [
	[1569, 2186], // original aspect ratio 4x
	[784, 1093], // original aspect ratio 2x
	[800, 800], // square 2x
	[400, 400], // square 1x
	[300, 418], // old image linked from github repo
	[200, 200], // new image linked from github repo
	[96, 96] // favicon
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
			let [width, height, scale] = dimension;
			await page.setViewport({
				width: width,
				height: height,
				deviceScaleFactor: scale || 1
			});

			// Save just logo
			let imageFilename = `${IMAGE_FILENAME_PREFIX}-${width}x${height}.png`;
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

