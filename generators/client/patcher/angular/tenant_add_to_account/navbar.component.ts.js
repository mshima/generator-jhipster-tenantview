const file = gen => `${gen.generator.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.ts`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => 'getImageUrl(): string {',
    tmpl: context => `has${context.tenant.entityClass}(): boolean {
    return this.isAuthenticated() && this.accountService.get${context.tenant.entityClass}() ? true : false;
  }
`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
