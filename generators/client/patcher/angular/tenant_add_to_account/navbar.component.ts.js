const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.ts`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: context => 'getImageUrl(): string {',
    tmpl: context => `has${context.tenantNameUpperFirst}(): boolean {
    return this.isAuthenticated() && this.accountService.get${context.tenantNameUpperFirst}() ? true : false;
  }
`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
