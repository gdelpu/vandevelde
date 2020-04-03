module.exports = {
    coverage: true,
    'coverage-path': './lib',
    'coverage-exclude': [
        'node_modules'
    ],
    reporter: ['console', 'lcov', 'junit'],
    output: ['stdout',  './reports/lcov.info', './reports/tests.xml'],
    threshold: 80,
    lint: true,
    verbose: false
};
