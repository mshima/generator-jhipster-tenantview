// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/domain/${data.entityClass}.java`;

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
    tmpl: data => `@FilterDef(name = "${data.entityNameUpperCase}_${data.tenantEntity.entityNameUpperCase}_FILTER", parameters = {@ParamDef(name = "${data.tenantEntity.entityInstance}Id", type = ${data.tenantEntity.primaryKey.type}.class)})
@Filter(name = "${data.entityNameUpperCase}_${data.tenantEntity.entityNameUpperCase}_FILTER", condition = "${data.tenantEntity.entityInstance}_id = :${data.tenantEntity.entityInstance}Id")`,
  },
];

export default {
  file,
  tmpls,
};
