// Ignore tests with account
const file = ctx => `${ctx.constants.SERVER_TEST_SRC_DIR}${ctx.storage.packageFolder}/web/rest/${ctx.entity.entityClass}ResourceIT.java`;

const tmpls = [
  {
    condition: ctx => !ctx.isTenant,
    type: 'replaceContent',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.security.test.context.support.WithMockUser;'
  },
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'rewriteFile',
    tmpl: 'import org.junit.jupiter.api.Disabled;',
    target: 'import org.junit.jupiter.api.Test;'
  },
  {
    condition: ctx => !ctx.isTenant && ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: '@WithMockUser'
  },
  {
    condition: ctx => !ctx.isTenant && !ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    tmpl: '@WithUserDetails("user")',
    target: '@WithMockUser'
  },
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
    ignorePatchErrors: true,
    tmpl: '',
    target: ctx => `
\\s*${ctx.tenant.entityClass} ${ctx.tenant.entityInstance};
.*
.*
.*
.*
.*
.*
.*
\\s*${ctx.entity.entityInstance}.set${ctx.tenant.entityClass}\\(${ctx.tenant.entityInstance}\\);`
  },
  {
    condition: ctx => ctx.entity.definitions.tenantAware && ctx.entity.definitions.jpaMetamodelFiltering,
    type: 'rewriteFile',
    tmpl: '@Disabled',
    target: ctx => `getAll${ctx.entity.entityClassPlural}By${ctx.tenant.entityClass}IsEqualToSomething()`
  }
];

module.exports = {
  file,
  tmpls
};
