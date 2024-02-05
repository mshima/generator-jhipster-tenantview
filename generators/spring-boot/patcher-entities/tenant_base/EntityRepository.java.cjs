// Add jpa filter to the entity to remove entries from another tenant
const file = ctx => `${ctx.SERVER_MAIN_SRC_DIR}${ctx.packageFolder}/repository/${ctx.entityClass}Repository.java`;

const tmpls = [
  {
    condition: data => data.tenantAware,
    type: 'rewriteFile',
    tmpl: ctx => `import ${ctx.packageName}.domain.${ctx.tenant.entityClass};

import java.util.Optional;
`,
    target: 'import org.springframework.data.jpa.repository.*;',
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    regex: true,
    tmpl: ctx => `
    void deleteByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});

    Optional<${ctx.entityClass}> findByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});
$1`,
    target: `(}
$)`,
  },
];

module.exports = {
  file,
  tmpls,
};
