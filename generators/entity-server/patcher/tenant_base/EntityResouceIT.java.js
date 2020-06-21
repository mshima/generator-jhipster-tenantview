// Ignore tests with account
const file = ctx => `${ctx.constants.SERVER_TEST_SRC_DIR}${ctx.storage.packageFolder}/web/rest/${ctx.entity.entityClass}ResourceIT.java`;

const tmpls = [
  {
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.security.test.context.support.WithMockUser;'
  },
  {
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: '@WithMockUser'
  },
  {
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
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
  }
];

module.exports = {
  file,
  tmpls
};
