import { patch } from '../../../tenantview/support/index.js';

export default patch({
  condition: data => data.tenantAware || (!data.tenantEntity.builtInUser && data.builtInUser),
  file: data => `${data.srcMainJava}${data.entityAbsoluteFolder}domain/${data.persistClass}.java`,
  tmpls: [
    {
      type: 'replaceContent',
      target: ' Serializable',
      tmpl: data => ` Serializable, Abstract${data.tenantEntity.persistClass}Aware`,
    },
    {
      condition: data => data.tenantEntity.entityPackage,
      type: 'rewriteContent',
      target: 'import',
      tmpl: data => `import ${data.tenantEntity.entityAbsoluteClass};`,
    },
  ],
});
