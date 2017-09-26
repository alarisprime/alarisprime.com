const FontFaceObserver = require('fontfaceobserver');

const baseFontFamily = 'Source Serif Pro';
const timeout = 6000;
const fontCheckRegular = new FontFaceObserver(baseFontFamily, {weight: 'normal'}).load(null, timeout);
const fontCheckBold = new FontFaceObserver(baseFontFamily, {weight: 'bold'}).load(null, timeout);

const initWebFonts = () => {
	Promise.all([fontCheckRegular, fontCheckBold])
		.then(() => {
			document.documentElement.className += ' base-fonts-loaded';
		}, () => {
			document.documentElement.className += ' base-fonts-loading-expired';
		});
};

export default initWebFonts;
