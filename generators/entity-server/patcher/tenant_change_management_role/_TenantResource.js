const file = context =>
  `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/web/rest/${context.tenant.entityClass}Resource.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'rewriteFile',
    target: context => `public class ${context.tenant.entityClass}Resource {`,
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
