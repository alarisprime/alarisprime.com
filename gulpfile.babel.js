import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import del from 'del';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import browserSync from 'browser-sync'; // eslint-disable-line import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default
import through2 from 'through2';
import merge from 'merge-stream';
import metalsmithMarkdown from 'metalsmith-markdownit';
import md5 from 'md5';

import Metalsmith from 'metalsmith';

const $ = gulpLoadPlugins();
const md = metalsmithMarkdown({
	breaks: true,
	typographer: true,
	html: true
});

const siteConfig = require('./site.config.json');

siteConfig.date = new Date();

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('metalsmith', cb => {
	const metalsmith = new Metalsmith(__dirname);

	metalsmith
		.source('./src')
		.destination('./dist')
		.clean(false)
		.use(require('metalsmith-define')({
			site: siteConfig,
			console,
			md5,
			objectKeys: Object.keys
		}))
		.use(require('metalsmith-ignore')([
			'**/_*',
			'includes/**',
			'layouts/**',
			'macros/**',
			'images/**'
		]))
		.use(require('metalsmith-collections')({
			members: {
				pattern: 'members/**/*',
				sortBy: 'name'
			},
			projects: {
				pattern: 'projects/**/*',
				sortBy: 'date',
				reverse: true
			},
			testimonials: {
				pattern: 'testimonials/**/*',
				sortBy: 'order',
				reverse: true
			}
		}))
		.use(md)
		.use(require('metalsmith-ignore')([
			'projects/*',
			'members/*',
			'testimonials/*'
		]))
		.use(require('metalsmith-in-place')({
			engineOptions: {
				cache: false,
				noCache: true,
				root: `${__dirname}/src`
			}
		}))
		.use(require('metalsmith-permalinks')())
		.use(require('metalsmith-sitemap')({
			hostname: siteConfig.baseUrl,
			priority: 0.5,
			changefreq: 'weekly'
		}))
		.use(require('metalsmith-hyphenate')({
			elements: ['p', 'figcaption', 'li', 'ol']
		}))
		.build(err => {
			if (err) {
				throw err;
			}

			cb();
		});
});

const webpackConfig = require('./webpack.config');

gulp.task('scripts', cb => {
	webpack(webpackConfig, (err, stats) => {
		if (err) {
			throw new $.util.PluginError('webpack', err);
		}

		$.util.log('[webpack]', stats.toString());
		cb();
	});
});

gulp.task('stylesheets', () => {
	const plugins = [
		require('postcss-smart-import')({
			plugins: [
				require('stylelint')()
			]
		}),
		require('postcss-modular-scale')(),
		require('postcss-mixins')(),
		require('postcss-cssnext')(),
		require('postcss-reporter')({clearReportedMessages: true})
	];

	return gulp.src('css/main.css')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.postcss(plugins))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('copy:root', () => {
	return gulp.src([
		'root/**/*'
	])
	.pipe(gulp.dest('dist'));
});

gulp.task('copy:images', () => {
	return gulp.src([
		'src/images/**/*'
	])
	.pipe(gulp.dest('dist/images'));
});

gulp.task('copy', ['copy:root', 'copy:images']);

gulp.task('lint:scripts', () => {
	return gulp.src([
		'scripts/**/*.js',
		'./*.js'
	], {base: './'})
	.pipe($.xo());
});

gulp.task('lint', ['lint:scripts']);

gulp.task('sitemap', () => {
	gulp.src(['dist/sitemap.xml'])
		.pipe($.replace('index.html', ''))
		.pipe(gulp.dest('dist'));
});

gulp.task('useref', () => {
	const userefConfig = {
		searchPath: ['dist', '.']
	};

	return gulp.src('dist/**/*.html')
		.pipe($.useref(userefConfig))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.html', $.htmlmin({
			removeComments: true,
			cleanConditionalComment: false,
			collapseWhitespace: true,
			conservativeCollapse: true,
			collapseBooleanAttributes: true
		})))
		.pipe(gulp.dest('dist'));
});

gulp.task('assets-rev', () => {
	return gulp.src([
		'./dist/images/*',
		'./dist/fonts/*',
		'./dist/scripts/*.js',
		'./dist/css/*.css'
	], {base: './dist/'})
	.pipe($.rev())
	.pipe(gulp.dest('./dist/'))
	.pipe($.rev.manifest())
	.pipe(gulp.dest('./dist/'))
	.pipe(through2.obj((file, enc, next) => {
		const manifest = require(file.path); // eslint-disable-line import/no-dynamic-require
		const paths = Object.keys(manifest).map(x => './dist/' + x);

		del.sync(paths);

		next(null, file);
	}));
});

gulp.task('assets-rev-replace', ['assets-rev'], () => {
	const manifest = gulp.src('./dist/rev-manifest.json');

	return gulp.src([
		'./dist/**'
	])
	.pipe($.revReplace({
		manifest,
		replaceInExtensions: ['.js', '.css', '.html', '.xml']
	}))
	.pipe(gulp.dest('dist'));
});

gulp.task('build-core', cb => {
	return runSequence(
		['metalsmith', 'scripts', 'stylesheets', 'copy'],
		cb
	);
});

gulp.task('postbuild:cleanup', () => {
	return del.sync(['./dist/rev-manifest.json']);
});

gulp.task('size', () => {
	const scriptSize = gulp.src('dist/scripts/*')
		.pipe($.size({
			title: 'scripts',
			gzip: true,
			showFiles: true,
			showTotal: false
		}));

	const stylesheetSize = gulp.src('dist/css/*')
		.pipe($.size({
			title: 'scripts',
			gzip: true,
			showFiles: true,
			showTotal: false
		}));

	const totalBuildSize = gulp.src('dist/**/*')
		.pipe($.size({
			title: 'build',
			gzip: true
		}));

	return merge(scriptSize, stylesheetSize, totalBuildSize);
});

gulp.task('serve', ['build-core'], () => {
	browserSync({
		server: {
			baseDir: ['dist/'],
			routes: {
				'/node_modules': 'node_modules'
			}
		},
		rewriteRules: [
			{
				match: /<body/g,
				fn() {
					return '<body data-turbolinks="false"';
				}
			}
		],
		reloadDelay: 500
	});

	gulp.watch([
		'src/**/*.md',
		'src/**/*.njk',
		'includes/**/*.njk',
		'macros/**/*.njk',
		'layouts/**/*.njk',
		'src/**/*.svg'
	], ['metalsmith']);

	gulp.watch([
		'images/**/*',
		'root/**/*'
	], ['copy']);

	gulp.watch([
		'scripts/**/*.js',
		'gulpfile.babel.js'
	], ['lint:scripts', 'scripts']);

	gulp.watch('css/**/*.css', ['stylesheets']);

	gulp.watch([
		'dist/**/*'
	]).on('change', browserSync.reload);
});

gulp.task('build', cb => {
	return runSequence(
		['clean', 'lint'],
		['build-core'],
		['sitemap'],
		['useref'],
		['assets-rev-replace'],
		['postbuild:cleanup'],
		['size'],
		cb
	);
});

gulp.task('default', () => {
	gulp.start('build');
});
