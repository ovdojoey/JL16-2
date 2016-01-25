var Metalsmith = require('metalsmith');
var autoprefixer = require('metalsmith-autoprefixer');
var sass = require('metalsmith-sass');
var cleanCSS = require('metalsmith-clean-css');
var uglify     = require('metalsmith-uglify');
var watch = require('metalsmith-watch');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');

Metalsmith(__dirname)
  .destination("public/")
  .use(collections({
    portfolio: {
      sortBy: 'date',
      reverse: true
    },
    blog: {
      sortBy: 'date',
      reverse: true
    },
    latestBlog: {
      pattern: 'blog/*.html',
      sortBy: 'date',
      limit: 3,
      reverse: true
    }
  }))
  .use(layouts({
    "engine" : "handlebars",
    "directory" : "src/layouts",
    "partials": "src/layouts/partials"
  }))
  .use(sass({
    outputDir: 'css/'
  }))
  .use(uglify())
  .use(autoprefixer())
  .use(cleanCSS())
  .use(
    watch({
      paths: {
        "${source}/**/*": "*",
        "${source}/**/**/*": true,
      },
      livereload: true,
    })
  )
  .build(function(err){
     if (err) throw err;
   });
