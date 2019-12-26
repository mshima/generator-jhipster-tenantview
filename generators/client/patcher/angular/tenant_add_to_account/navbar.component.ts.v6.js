const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => 'getImageUrl() {',
        tmpl: context => `has${context.tenantNameUpperFirst}() {
    return this.isAuthenticated() && this.accountService.get${context.tenantNameUpperFirst}() ? true : false;
  }
`
    }
];

module.exports = {
    version: '6.3.0 - 6.5.1',
    file,
    tmpls
};
