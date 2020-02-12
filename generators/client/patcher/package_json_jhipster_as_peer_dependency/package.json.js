const file = context => 'package.json';

const tmpls = [
    {
        // Create peerDependencies
        type: 'replaceContent',
        target: /((\s*)"engines": \{)/,
        tmpl: '$2"peerDependencies": {$2},$1'
    },
    {
        // Move generator-jhipster to peerDependencies
        type: 'replaceContent',
        target: /(\s*"generator-jhipster": "[\w.]*"),(.*"peerDependencies": \{)/s,
        tmpl: '$2$1'
    },
    {
        // Move blueprints and modules to peerDependencies
        condition: context => context.protractorTests,
        type: 'replaceContent',
        target: /("typescript": "[\w.]*",)(.*),(\n\s*"webdriver-manager": "[\w.]*".*"generator-jhipster": "[\w.]*")/s,
        tmpl: '$1$3,$2'
    },
    {
        // Move blueprints and modules to peerDependencies
        condition: context => !context.protractorTests,
        type: 'replaceContent',
        target: /("typescript": "[\w.]*",)(.*),(\n\s*"webpack": "[\w.]*".*"generator-jhipster": "[\w.]*")/s,
        tmpl: '$1$3,$2'
    }
];

module.exports = {
    file,
    tmpls
};
