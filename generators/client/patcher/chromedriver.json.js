const file = context => 'package.json';

const tmpls = [
    {
        condition: context => context.protractorTests,
        type: 'replaceContent',
        target: /("webdriver-manager": )"[\w.]*"/,
        tmpl: '$1"latest"'
    }
];

module.exports = {
    file,
    tmpls
};
