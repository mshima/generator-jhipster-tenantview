const file = context => `${context.generator.CLIENT_MAIN_SRC_DIR}app/core/auth/account.service.ts`;

const tmpls = [
  {
    // Add tenant getter to account
    type: 'rewriteFile',
    regex: true,
    target: () => 'getImageUrl(): string {',
    tmpl: context => `get${context.tenant.entityClass}(): String {
    return this.userIdentity!.${context.tenant.entityInstance}.idName ? this.userIdentity!.${context.tenant.entityInstance}.idName : {id:3, idName: 'Mock${context.tenant.entityClass}'};
  }\n`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
