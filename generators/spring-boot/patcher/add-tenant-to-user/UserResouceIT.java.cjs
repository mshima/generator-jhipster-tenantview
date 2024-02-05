const file = ctx => `${ctx.SERVER_TEST_SRC_DIR}${ctx.packageFolder}/web/rest/UserResourceIT.java`;

const tmpls = [
  {
    type: 'replaceContent',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.security.test.context.support.WithMockUser;',
  },
  {
    type: 'rewriteFile',
    tmpl: ctx => `import ${ctx.packageName}.domain.${ctx.tenant.entityClass};`,
    target: ctx => `import ${ctx.packageName}.domain.User;`,
  },
  {
    type: 'replaceContent',
    tmpl: ctx => `@WithUserDetails("${ctx.tenant.entityInstance}_admin")`,
    target: '@WithMockUser(authorities = AuthoritiesConstants.ADMIN)',
  },
  {
    type: 'rewriteFile',
    tmpl: ctx => `${ctx.tenant.entityClass} ${ctx.tenant.entityInstance} = new ${ctx.tenant.entityClass}();
        ${ctx.tenant.entityInstance}.setId(2L);
        ${ctx.tenant.entityInstance}.setIdName("${ctx.tenant.entityInstance}");
        user.set${ctx.tenant.entityClass}(${ctx.tenant.entityInstance});
`,
    target: 'return user;',
  },
];

module.exports = {
  file,
  tmpls,
};
