// Add jpa filter to the entity to remove entries from another tenant
const file = ctx =>
  `${ctx.constants.SERVER_MAIN_SRC_DIR}${ctx.storage.packageFolder}/repository/${ctx.entity.entityClass}Repository.java`;

const tmpls = [
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'rewriteFile',
    target: ctx => `
import ${ctx.storage.packageName}.domain.${ctx.entity.entityClass};

import java.util.Optional;`,
    tmpl: 'import org.springframework.data.jpa.repository.*;'
  },
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    target: ctx => `
    void deleteByIdAnd${ctx.entity.entityClass}(Long id, ${ctx.entity.entityClass} ${ctx.entity.entityInstance});

    Optional<BankAccount> findByIdAnd${ctx.entity.entityClass}(Long id, ${ctx.entity.entityClass} ${ctx.entity.entityInstance});`,
    tmpl: `}
$`
  }
];

module.exports = {
  file,
  tmpls
};
