const file = ctx => `${ctx.generator.CLIENT_MAIN_SRC_DIR}app/core/auth/account.service.ts`;

const tmpls = [
  {
    // Add tenant getter to account
    type: 'rewriteFile',
    target: "import { Account } from 'app/core/user/account.model';",
    tmpl: ctx => `import { I${ctx.tenant.entityClass} } from 'app/shared/model/${ctx.tenant.entityInstance}.model';`
  },
  {
    // Add tenant getter to account
    type: 'rewriteFile',
    regex: true,
    target: () => 'getImageUrl(): string {',
    tmpl: ctx => `get${ctx.tenant.entityClass}(): I${ctx.tenant.entityClass} {
    return this.userIdentity!.${ctx.tenant.entityInstance};
  }\n`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
