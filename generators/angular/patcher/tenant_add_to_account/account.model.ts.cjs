const file = context => `${context.srcMainWebapp}app/core/user/account.model.ts`;

const tmpls = [
  {
    // Add tenant to account
    type: 'rewriteFile',
    target: () => 'export class Account',
    tmpl: context => `import { ${context.tenant.entityClass} } from '../../shared/model/${context.tenant.entityInstance}.model';
`,
  },
  {
    // Add tenant to account
    type: 'rewriteFile',
    target: () => 'public imageUrl: string',
    tmpl: context => `public ${context.tenant.entityInstance}: ${context.tenant.entityClass},`,
  },
];

module.exports = {
  file,
  tmpls,
};
