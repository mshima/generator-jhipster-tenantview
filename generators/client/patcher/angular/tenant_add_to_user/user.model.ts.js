const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/user/user.model.ts`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: context => 'export interface IUser',
    tmpl: context => `import { ${context.tenant.entityClass} } from '../../shared/admin/${context.tenant.entityInstance}.model';
`
  },
  {
    type: 'replaceContent',
    target: /((\n\s*)password\?: string;)/,
    tmpl: context => `$1$2${context.tenant.entityInstance}?: ${context.tenant.entityClass};`
  },
  {
    type: 'replaceContent',
    target: /((\n\s*)public password\?: string)/,
    tmpl: context => `$1,$2public ${context.tenant.entityInstance}?: ${context.tenant.entityClass}`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  tmpls
};
