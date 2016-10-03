module.exports = {
  test: {
    src: 'test/tests/**.js',
    options: {
      reportFormats: [ 'html' ],
      check: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100
      },
      print: 'detail',
      root: 'lib'
    }
  }
};
