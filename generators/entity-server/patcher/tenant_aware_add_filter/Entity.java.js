// Add jpa filter to the entity to remove entries from another tenant
const file = context => `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/domain/${context.entity.entityClass}.java`;

const tmpls = [
  {
    condition: context => context.tenantAware,
    type: 'rewriteFile',
    target: 'import javax.persistence.*;',
    tmpl: generator => `import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
`
  },
  {
    condition: context => context.tenantAware,
    type: 'rewriteFile',
    target: context => `public class ${context.entity.entityClass}`,
    tmpl: context => `@FilterDef(name = "TENANT_FILTER", parameters = {@ParamDef(name = "${context.tenant.entityInstance}Id", type = "long")})
@Filter(name = "TENANT_FILTER", condition = "${context.tenant.entityInstance}_id = :${context.tenant.entityInstance}Id")`
  }
];

module.exports = {
  file,
  tmpls
};
