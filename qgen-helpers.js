const slugify = require('slugify');

const slug = function (str) {
	return slugify(str).toLowerCase();
};

module.exports = {
	slug: slug
};
