const file = context => 'package.json';

const tmpls = [
    {
        condition: context => context.protractorTests,
        type: 'replaceContent',
        target: /("webdriver-manager": )"[\w.]*"/,
        tmpl: '$1"latest"',
        ignorePatchErrors: true
    }
];

module.exports = {
    file,
    tmpls
};
