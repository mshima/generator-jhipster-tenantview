const file = context => 'package.json';

const tmpls = [
    {
        // Create peerDependencies
        type: 'replaceContent',
        target: /((\s*)"engines": \{)/,
        tmpl: '$2"peerDependencies": {$2},$1'
    },
    {
        type: 'replaceContent',
        target: /(\s*"generator-jhipster": "[\w.]*"),(.*"peerDependencies": \{)/s,
        tmpl: '$2$1'
    },
    {
        type: 'replaceContent',
        ignorePatchErrors: true,
        target: /("typescript": "[\w.]*",)(.*),(\n\s*"webdriver-manager": "[\w.]*".*"generator-jhipster": "[\w.]*")/s,
        tmpl: '$1$3,$2'
    }
];

module.exports = {
    file,
    tmpls
};
