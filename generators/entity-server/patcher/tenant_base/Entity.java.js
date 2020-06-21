// Add jpa filter to the entity to remove entries from another tenant
const file = context =>
  `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/domain/${context.entity.entityClass}.java`;

const tmpls = [
  {
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    target: 'import javax.persistence.*;',
    tmpl: () => `import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
`
  }
];

module.exports = {
  file,
  disabled: true,
  tmpls
};
