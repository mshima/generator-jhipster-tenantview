// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.SERVER_MAIN_SRC_DIR}${data.packageFolder}/domain/${data.entityClass}.java`;

const tmpls = [
  {
    condition: data => data.tenantAware,
    type: 'rewriteFile',
    target: 'import jakarta.persistence.*;',
    tmpl: () => `import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
`,
  },
  {
    condition: data => data.tenantAware,
    type: 'rewriteFile',
    target: data => `public class ${data.entityClass}`,
    tmpl: data => `@FilterDef(name = "${data.tenant.entityNameUpperCase}_FILTER", parameters = {@ParamDef(name = "${data.tenant.entityInstance}Id", type = ${data.tenant.primaryKey.type}.class)})
@Filter(name = "${data.tenant.entityNameUpperCase}_FILTER", condition = "${data.tenant.entityInstance}_id = :${data.tenant.entityInstance}Id")`,
  },
];

module.exports = {
  file,
  tmpls,
};
