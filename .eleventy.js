module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("img/logo.svg");
	return {
		"templateFormats": ["njk", "jpg", "css", "png", "svg"]
	};
};