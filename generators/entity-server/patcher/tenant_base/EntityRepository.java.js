// Add jpa filter to the entity to remove entries from another tenant
const file = ctx =>
  `${ctx.constants.SERVER_MAIN_SRC_DIR}${ctx.storage.packageFolder}/repository/${ctx.entity.entityClass}Repository.java`;

const tmpls = [
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'rewriteFile',
    tmpl: ctx => `import ${ctx.storage.packageName}.domain.${ctx.tenant.entityClass};

import java.util.Optional;
`,
    target: 'import org.springframework.data.jpa.repository.*;'
  },
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
    tmpl: ctx => `
    void deleteByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});

    Optional<BankAccount> findByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});
$1`,
    target: `(}
$)`
  }
];

module.exports = {
  file,
  tmpls
};
