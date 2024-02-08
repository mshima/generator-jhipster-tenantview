// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/repository/${data.entityClass}Repository.java`;

const tmpls = [
  {
    condition: data => data.tenantAware,
    type: 'rewriteFile',
    tmpl: data => `import ${data.packageName}.domain.${data.tenantEntity.entityClass};

import java.util.Optional;
`,
    target: 'import org.springframework.data.jpa.repository.*;',
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    regex: true,
    tmpl: data => `
    void deleteByIdAnd${data.tenantEntity.entityClass}(Long id, ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance});

    Optional<${data.entityClass}> findByIdAnd${data.tenantEntity.entityClass}(Long id, ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance});
$1`,
    target: `(}
$)`,
  },
];

export default {
  file,
  tmpls,
};
