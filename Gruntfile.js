function getConfig( name ) {
  return require(`./build/${ name }`);
}

module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: getConfig('jshint'),
    eslint: getConfig('eslint'),
    mocha_istanbul: getConfig('mocha')
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.registerTask( 'default', [ 'jshint', 'eslint', 'mocha_istanbul' ] );
};
