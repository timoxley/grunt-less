/*
 * grunt-less
 * https://github.com/jachardi/grunt-less
 *
 * Copyright (c) 2012 Jake Harding
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  // external dependencies
  var fs = require('fs');
  var path = require('path');
  var less = require('less');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('less', 'Compile LESS files.', function() {
    var src = this.file.src;
    var dest = this.file.dest;
    var options = this.data.options || {};

    if (!src) {
      grunt.warn('no src provided');
    }

    if (!dest) {
      grunt.warn('no dest provided');
    }

    var srcFiles = file.expandFiles(src);

    var done = this.async();

    utils.async.map(srcFiles, grunt.helper('less', options), function(err, results) {
      if (err) {
        grunt.warn(err);
        done(false);
      }
      
      file.write(dest, results.join('\n')); 
      done();
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('less', function(options, callback) {
    return function(src, callback) {
      var parser = new less.Parser({
        paths: [path.dirname(src)]
      });

      // read source file
      fs.readFile(src, 'utf8', function(err, data) {
        if (err) {
          callback(err);
        }
        
        // send data from source file to LESS parser to get CSS
        parser.parse(data, function(err, tree) {
          if (err) {
            callback(err);
          }

          var css = null;
          try {
            css = tree.toCSS({
              compress: options.compress,
              yuicompress: options.yuicompress
            });
          } catch(e) {
            callback(e);
            return;
          }

          callback(null, css);
        });
      });
    };
  });
};
