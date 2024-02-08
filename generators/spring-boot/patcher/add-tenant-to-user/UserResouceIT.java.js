const file = data => `${data.srcTestJava}${data.packageFolder}/web/rest/UserResourceIT.java`;

const tmpls = [
  {
    type: 'replaceContent',
    tmpl: 'import org.springframework.security.test.context.support.WithUserDetails;',
    target: 'import org.springframework.security.test.context.support.WithMockUser;',
  },
  {
    type: 'rewriteFile',
    tmpl: data => `import ${data.packageName}.domain.${data.tenantEntity.entityClass};`,
    target: data => `import ${data.packageName}.domain.User;`,
  },
  {
    type: 'replaceContent',
    tmpl: data => `@WithUserDetails("${data.tenantEntity.entityInstance}_admin")`,
    target: '@WithMockUser(authorities = AuthoritiesConstants.ADMIN)',
  },
  {
    type: 'rewriteFile',
    tmpl: data => `${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance} = new ${data.tenantEntity.entityClass}();
        ${data.tenantEntity.entityInstance}.setId(2L);
        user.set${data.tenantEntity.entityClass}(${data.tenantEntity.entityInstance});
`,
    target: 'return user;',
  },
];

export default {
  file,
  tmpls,
};
