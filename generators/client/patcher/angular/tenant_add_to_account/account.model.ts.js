const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/user/account.model.ts`;

const tmpls = [
  {
    // Add tenant to account
    type: 'rewriteFile',
    target: () => 'public imageUrl: string',
    tmpl: context => `public ${context.tenant.entityInstance}: string,`
  }
];

module.exports = {
  file,
  tmpls
};
