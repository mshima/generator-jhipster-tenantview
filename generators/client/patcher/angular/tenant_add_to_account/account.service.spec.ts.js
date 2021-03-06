const file = context => `${context.constants.CLIENT_TEST_SRC_DIR}spec/app/core/user/account.service.spec.ts`;

const tmpls = [
  {
    type: 'replaceContent',
    target: /(\n(\s*)imageUrl: '')(,?)/,
    tmpl: context => `$1,
$2${context.tenant.entityInstance}: ''$3`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
