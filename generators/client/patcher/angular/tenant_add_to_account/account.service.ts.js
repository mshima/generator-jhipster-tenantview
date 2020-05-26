const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/auth/account.service.ts`;

const tmpls = [
  {
    // Add tenant getter to account
    type: 'rewriteFile',
    regex: true,
    target: context => 'getImageUrl(): string {',
    tmpl: context => `get${context.tenant.entityClass}(): String {
    return this.isAuthenticated() ? this.userIdentity!.${context.tenant.entityInstance} : '';
  }\n`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
