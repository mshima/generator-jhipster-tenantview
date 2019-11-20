const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/web/rest/${context.tenantNameUpperFirst}Resource.java`;

const tmpls = [
    {
        condition: context => context.isTenant,
        type: 'rewriteFile',
        target: context => `public class ${context.tenantNameUpperFirst}Resource {`,
        tmpl: context => '@PreAuthorize("hasRole(\\"" + AuthoritiesConstants.ADMIN + "\\")")'
    },
    {
        condition: context => context.isTenant,
        type: 'rewriteFile',
        target: context => 'import io.github.jhipster.web.util.HeaderUtil;',
        tmpl: context => `import ${context.packageName}.security.AuthoritiesConstants;
import org.springframework.security.access.prepost.PreAuthorize;
`
    }
];

module.exports = {
    file,
    tmpls
};
