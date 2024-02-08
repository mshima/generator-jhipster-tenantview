// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/repository/UserRepository.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regexp: true,
    target: '@EntityGraph(attributePaths = "authorities")',
    tmpl: data => `@EntityGraph(attributePaths = {"authorities", "${data.tenantEntity.entityInstance}"})`,
  },
  {
    type: 'replaceContent',
    regexp: true,
    target: '@EntityGraph(attributePaths = "authorities")',
    tmpl: data => `@EntityGraph(attributePaths = {"authorities", "${data.tenantEntity.entityInstance}"})`,
  },
  {
    type: 'rewriteFile',
    target: data => `import ${data.packageName}.domain.User;`,
    tmpl: data => `import ${data.packageName}.domain.${data.tenantEntity.entityClass};`,
  },
  {
    type: 'rewriteFile',
    target: 'findAllByIdNot',
    tmpl: data => `
    void deleteByIdAnd${data.tenantEntity.entityClass}(Long id, ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance});

    Optional<User> findByIdAnd${data.tenantEntity.entityClass}(Long id, ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance});
`,
  },
];

export default {
  file,
  tmpls,
};
