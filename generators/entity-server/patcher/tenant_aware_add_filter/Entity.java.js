// Add jpa filter to the entity to remove entries from another tenant
const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/domain/${context.entityClass}.java`;

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
        target: context => `public class ${context.entityClass}`,
        tmpl: context => `@FilterDef(name = "TENANT_FILTER", parameters = {@ParamDef(name = "${
            context.tenantNameLowerFirst
        }Id", type = "long")})
@Filter(name = "TENANT_FILTER", condition = "${context.tenantNameLowerFirst}_id = :${context.tenantNameLowerFirst}Id")`
    }
];

module.exports = {
    file,
    tmpls
};
