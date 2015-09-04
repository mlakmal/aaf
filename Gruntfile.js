// Generated on 2015-02-17 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  //environment switch value is used to setup the angular app environment specific config load
  var environment = grunt.option('env') || '';

  //baseHref is used in angular html5 push state meta tag base href value.
  var baseHref = grunt.option('baseHref') || 'http://localhost:9000/';

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    pkg: 'aaf'
  };

  var testFile = grunt.option('file') || '';

  var currDate = new Date();
  //current date time stamp is used to setup the script hash for index.html css/js files as well as requirejs script loads
  var hashValue = currDate.getTime();

  //rewrite module is used to simulate apache web server rewrite/redirect rules for local testing
  var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    appConfig: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= appConfig.app %>/<%= appConfig.pkg %>/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: [
          '<%= appConfig.app %>/assets/styles/{,*/}*.css',
          '<%= appConfig.app %>/*/assets/styles/main.css'
        ],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.app %>/<%= appConfig.pkg %>/{,*/}*.html',
          '.tmp/assets/styles/{,*/}*.css',
          '<%= appConfig.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      rules: [
        {
          from: '^/jsons/(.+)$',
          to: '/test/jsons/$1'
        },
        {
          from: '^/consumer/logout.html$',
          to: '/',
          redirect: 'permanent'
        },
        {
          from: '^/consumer/(.+)$',
          to: '/'
        },
        {
          from: '^/public/(.+)$',
          to: '/'
        },
        {
          from: '^/test/?$',
          to: '/'
        },
        {
          from: '^/examples/?$',
          to: '/'
        }
      ],
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            //new middleware support for mocking rest api calls with defined json files
            var newMiddleware = function (req, res, next) {
              var apiToJsonMap = [
                {
                  apiRegEx: 'claims/member/[A-Za-z0-9 _]*/summary',
                  jsonFile: 'claimsModel.json'
                },
                {
                  apiRegEx: 'membership/member/metadata',
                  jsonFile: 'metadata.json'
                },
                {
                  apiRegEx: 'membership/member/[A-Za-z0-9 _]*/address',
                  jsonFile: 'address.json'
                },
                {
                  apiRegEx: 'billing/member/[A-Za-z0-9 _]*/pay/account',
                  jsonFile: 'addPayment.json'
                },
                {
                  apiRegEx: 'billing/member/[A-Za-z0-9 _]*/history',
                  jsonFile: 'payments.json'
                },
                {
                  apiRegEx: '^(?!.*mediaType=PNG)(?!.*mail).*idcard/member/[A-Za-z0-9 _]*',
                  jsonFile: 'listCards.json'
                },
                {
                  apiRegEx: '.*idcard/member/[A-Za-z0-9 _]*/mail*/[A-Za-z0-9]*',
                  jsonFile: 'mailCards.json'
                },
                {
                  apiRegEx: 'billing/member/[A-Za-z0-9 _]*/summary',
                  jsonFile: 'summaryBill.json'
                },
                {
                  apiRegEx: 'billing/member/[A-Za-z0-9 _]*/current',
                  jsonFile: 'currentBills.json'
                }
              ];

              var jsonFileName = '';
              if (req.url.indexOf('.json') >= 0) {
                jsonFileName = req.url.substring(req.url.lastIndexOf('/') + 1);
                if (jsonFileName.indexOf('?') >= 0) {
                  jsonFileName = jsonFileName.substring(0, jsonFileName.indexOf('?'));
                }
              }
              else if (req.url.indexOf('/secure/api/') >= 0) {
                for (var index = 0; index < apiToJsonMap.length; index++) {
                  console.log("Requested url: " + req.url);
                  console.log("ApiToJsonMap: " + apiToJsonMap[index].apiRegEx);
                  var regEx = new RegExp(apiToJsonMap[index].apiRegEx, 'i');
                  if (regEx.test(req.url)) {
                    jsonFileName = apiToJsonMap[index].jsonFile;
                    console.log("jsonFileName: " + jsonFileName);
                    break;
                  }
                }
              }

              // console.log("jsonFileName: " + jsonFileName + " - end jsonFileName");

              //               var apiToImgMap = [
              //                 {
              //                   apiRegEx: 'idcard/member/[A-Az-z0-9]*/.*mediaType=PNG',
              //                   imgFile: '123--456.png'
              //                 }
              //               ]

              //               var imgFileName = '';
              //               if (req.url.indexOf('.png') >= 0){
              //                 imgFileName = req.url.substring(req.url.lastIndexOf('/') + 1);
              //                 if (imgFileName.indexOf('?') >= 0){
              //                   imgFileName = imgFileName.substring(0, imgFileName.indexOf('?'));
              //                 }
              //               }else if (req.url.indexOf('/secure/api/') >= 0){
              //                 for (var index = 0; index < apiToImgMap.length; index++) {
              //                   console.log(req.url);
              //                   console.log(apiToImgMap[index].apiRegEx);
              //                   var regEx = new RegExp(apiToImgMap[index].apiRegEx, 'i');
              //                   if (regEx.test(req.url)) {
              //                     imgFileName = apiToImgMap[index].imgFile;
              //                     break;
              //                   }
              //                 }
              //               }
              //               console.log("imgFileName: " + imgFileName);
              // imgFileName = "";

              //support env configs changes locally
              if (environment.length > 0 && req.url.indexOf('configConst.js') >= 0) {
                var configFile = 'app/aaf/init/values/configs/configConst.' + environment + '.js';
                res.end(grunt.file.read(configFile));
              }

              if (jsonFileName.length > 0) {
                res.end(grunt.file.read('app/aaf/test/jsons/' + jsonFileName));
              }
              else {
                return next();
              }
            };

            return [
              newMiddleware,
              rewriteRulesSnippet,
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
                ),
              connect().use(
                '/app/assets/styles',
                connect.static('./app/assets/styles')
                ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>'
        }
      }
    },

    // Make sure coding standards are validated
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        //force: true
      },
      all: {
        src: [
          '<%= appConfig.app %>/<%= appConfig.pkg %>/**/*.js',
          '!<%= appConfig.app %>/assets/**/*.js',
          '!<%= appConfig.app %>/<%= appConfig.pkg %>/test/**/*.js',
          '!<%= appConfig.app %>/<%= appConfig.pkg %>/example/**/*.js',
          '!<%= appConfig.app %>/<%= appConfig.pkg %>/common/services/d3Lib.js'
        ]
      },
      test: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    //code style
    jscs: {
      options: {
        config: '.jscsrc',
        validateLineBreaks: process.platform == 'win32' ? 'CRLF' : 'LF'
      },
      all: {
        files: {
          src: [
            '<%= appConfig.app %>/<%= appConfig.pkg %>/**/*.js',
            '!<%= appConfig.app %>/assets/**/*.js',
            '!<%= appConfig.app %>/<%= appConfig.pkg %>/test/**/*.js',
            '!<%= appConfig.app %>/<%= appConfig.pkg %>/example/**/*.js',
            '!<%= appConfig.app %>/<%= appConfig.pkg %>/common/services/d3Lib.js'
          ]
        }
      }
    },

    //html linter to validate html code for any issues
    htmllint: {
      all: {
        options: {
          ignore: [
            /Illegal character in path segment/,
            /Start tag seen without seeing a doctype first/,
            'Element "head" is missing a required instance of child element "title".',
            'Attribute "name" not allowed on element "div" at this point.',
            'Attribute "required" not allowed on element "div" at this point.',
            'Element "title" must not be empty.'
          ]
        },
        src: [
          '<%= appConfig.app %>/<%= appConfig.pkg %>/**/*.html',
          '!<%= appConfig.app %>/<%= appConfig.pkg %>/test/**/*.html',
          '!<%= appConfig.app %>/<%= appConfig.pkg %>/example/**/*.html'
        ]
      }
    },

    //css linter to validate css files
    csslint: {
      all: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: [
          '<%= appConfig.app %>/assets/styles/**/*.css',
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/assets/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    // disabled image,font file renaming due to some problems with using external html templates. we can add that later.
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/scripts/*.js',
          '<%= appConfig.dist %>/styles/{,*/}*.css',
          '<%= appConfig.app %>/*/assets/styles/main.css',
          '<%= appConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= appConfig.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.app %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              // Chinh - temporary disable uglify js: ['concat', 'uglifyjs'],
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: [
        '<%= appConfig.dist %>/assets/styles/{,*/}*.css',
        '<%= appConfig.app %>/*/assets/styles/main.css'
      ],
      options: {
        assetsDirs: [
          '<%= appConfig.dist %>',
          '<%= appConfig.dist %>/assets/images',
          '<%= appConfig.dist %>/assets/styles'
        ],
        blockReplacements: {
          baseHref: function (block) {
            return '<base href="' + baseHref + '" />';
          },
          bootstrapjs: function (block) {
            return '';
          }
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    //cssmin: {
    //  dist: {
    //    files: {
    //      '<%= appConfig.dist %>/assets/styles/main.css': [
    //        '.tmp/styles/{,*/}*.css'
    //      ]
    //    }
    //  }
    //},
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= appConfig.dist %>/scripts/scripts.js': [
    //         '<%= appConfig.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },
    concat: {
      localScripts: {
        src: [
          '<%= appConfig.dist %>/assets/scripts/scripts.js',
          '.tmp/rjs/app.bootstrap.js'
        ],
        dest: '<%= appConfig.dist %>/assets/scripts/scripts.js'
      },
      ie9css: {
        src: [
          '<%= appConfig.dist %>/assets/styles/main-ie9.css',
          '<%= appConfig.app %>/*/assets/styles/main-ie9.css'
        ],
        dest: '<%= appConfig.dist %>/assets/styles/main-ie9.css'
      },
      cssPkg: {
        src: [
          '<%= appConfig.app %>/assets/styles/partials/*.css',
          '<%= appConfig.app %>/assets/styles/main.css'
        ],
        dest: '<%= appConfig.dist %>/<%= appConfig.pkg %>/assets/styles/main.css'
      },
      cssIe9Pkg: {
        src: [
          '<%= appConfig.app %>/assets/styles/main-ie9.css'
        ],
        dest: '<%= appConfig.dist %>/<%= appConfig.pkg %>/assets/styles/main-ie9.css'
      },
      scriptPkg: {
        src: [
          '<%= appConfig.app %>/assets/scripts/**/*.js'
        ],
        dest: '<%= appConfig.dist %>/<%= appConfig.pkg %>/assets/scripts/scripts.js'
      }
    },
    uglify: {
      custom: {
        options: {
          mangle: false
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>/',
          src: ['**/*.js', '!**/*.spec.js'],
          dest: '<%= appConfig.dist %>/'
        }]

      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/assets/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: [
            '*.html',
            '**/*.html'
          ],
          dest: '<%= appConfig.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= appConfig.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '**/*.html',
            '**/*.json',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/{,*/}*.*',
            '**/*Dir.js'
          ]
        }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= appConfig.dist %>/assets/images',
            src: ['generated/*']
          }, {
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= appConfig.dist %>'
          }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.app %>',
        dest: '.tmp',
        src: [
          '*/assets/styles/main.css',
          'assets/styles/{,*/}*.css'
        ]
      },
      pkg: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '<%= appConfig.pkg %>/**/*.js',
            '<%= appConfig.pkg %>/**/*.html',
            '!<%= appConfig.pkg %>/**/*.spec.js',
            '!<%= appConfig.pkg %>/test/**/*.js',
            '!<%= appConfig.pkg %>/example/**/*.js',
            '!<%= appConfig.pkg %>/main/**/*.js',
            '!<%= appConfig.pkg %>/test/**/*.html',
            '!<%= appConfig.pkg %>/example/**/*.html',
            '!<%= appConfig.pkg %>/main/**/*.html'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin',
        'requirejs:dist'
      ],
      pkg: [
        'requirejs:pkg'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        testFile: testFile,
        client: {
          args: [testFile]
        }
      }
    },

    requirejs: {
      dist: {
        options: {
          keepBuildDir: false,
          generateSourceMaps: false,
          baseUrl: '<%= appConfig.app %>',
          mainConfigFile: '<%= appConfig.app %>/requirejs.config.js',
          dir: '.tmp/rjs',
          optimize: 'none'
        }
      },
      pkg: {
        options: {
          keepBuildDir: false,
          generateSourceMaps: false,
          baseUrl: '<%= appConfig.app %>',
          mainConfigFile: '<%= appConfig.app %>/requirejs.config.js',
          dir: '.tmp/rjs',
          optimize: 'none'
        }
      }
    },
    html2js: {
      options: {
        // custom options, see below
        rename: function (moduleName) {
          console.log(moduleName);
          return moduleName.replace('../app/', '');
        }
      },
      main: {
        src: ['<%= appConfig.app %>/<%= appConfig.pkg %>/**/*.html'],
        dest: '.tmp/templates.js'
      },
    },
    replace: {
      hash: {
        options: {
          patterns: [
            {
              match: /\.js/g,
              replacement: function () {
                return '.js?' + hashValue;
              }
            },
            {
              match: /\.css/g,
              replacement: function () {
                return '.css?' + hashValue;
              }
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['<%= appConfig.dist %>/index.html'], dest: '<%= appConfig.dist %>' }
        ]
      },
      configuration: {
        options: {
          patterns: [
            {
              match: 'buildHash',
              replacement: function () {
                return hashValue;
              }
            }
          ]
        },
        files: [
          {
            expand: true,
            src: [
              '<%= appConfig.dist %>/assets/scripts/scripts.js'
            ],
            dest: ''
          }
        ]
      },
      pkg: {
        options: {
          patterns: [
            {
              match: /'aaf\//g,
              replacement: function () {
                return '\'private_packages/' + appConfig.pkg + '/';
              }
            }
          ]
        },
        files: [
          {
            expand: true,
            src: [
              '<%= appConfig.dist %>/**/*.js',
              '!<%= appConfig.dist %>/<%= appConfig.pkg %>/assets/*.js'
            ],
            dest: ''
          }
        ]
      }
    },
    preprocess: {
      dist: {
        options: {
          context: {
            env: environment
          },
        },
        files: {
          '.tmp/rjs/app.bootstrap.js': '.tmp/rjs/app.bootstrap.js'
        },
      },
    },
    compress: {
      pkg: {
        options: {
          archive: 'dist/<%= appConfig.pkg %>.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/<%= appConfig.pkg %>/',
            src: ['**'],
            dest: '/<%= appConfig.pkg %>/'
          }
        ]
      }
    }
  });

  grunt.registerTask('bower', 'install bower dependencies', function () {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('bower install', { cwd: './' }, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb();
    });

    exec('bower install', { cwd: './app' }, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb();
    });
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'configureRewriteRules',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'csslint:all',
    'htmllint:all',
    'jshint:all',
    'jscs:all',
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer:server',
    'html2js',
    'karma',
    'clean:server',
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer:server',
    'preprocess:dist', //setup environment specific code blocks
    'concat:generated',
    'copy:dist',
    'cssmin',
    'usemin',
    'replace:configuration',//replace scripthash value for js/css file refs and requirejs config
    'concat:localScripts',
    'htmlmin',
    'replace:hash',
    'concat:ie9css',
  //'uglify:custom',//TODO: enable uglify later
    'clean:server'
  ]);

  grunt.registerTask('package', [
    'clean:dist',
  //'requirejs:pkg',
    'copy:pkg',
    'concat:cssPkg',
    'concat:cssIe9Pkg',
    'concat:scriptPkg',
    'compress:pkg',
    'replace:pkg',
    'clean:server'
  ]);

  grunt.registerTask('code', [
    'jshint:all',
    'jscs:all'
  ]);
};
