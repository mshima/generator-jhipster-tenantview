const file = data => `${data.srcMainWebapp}app/core/user/user.model.ts`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => 'export interface IUser',
    tmpl: data => `import { I${data.tenantEntity.entityClass} } from '../../shared/model/${data.tenantEntity.entityInstance}.model';
`,
  },
  {
    type: 'replaceContent',
    target: /((\n\s*)password\?: string;)/,
    tmpl: data => `$1$2${data.tenantEntity.entityInstance}?: I${data.tenantEntity.entityClass};`,
  },
  {
    type: 'replaceContent',
    target: /((\n\s*)public password\?: string)/,
    tmpl: data => `$1,$2public ${data.tenantEntity.entityInstance}?: I${data.tenantEntity.entityClass}`,
  },
];

export default {
  version: '>=6.6.0',
  file,
  tmpls,
};
