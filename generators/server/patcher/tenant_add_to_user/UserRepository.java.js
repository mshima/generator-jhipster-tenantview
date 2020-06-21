// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/repository/UserRepository.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regexp: true,
    target: '@EntityGraph(attributePaths = "authorities")',
    tmpl: context => `@EntityGraph(attributePaths = {"authorities", "${context.tenant.entityInstance}"})`
  },
  {
    type: 'replaceContent',
    regexp: true,
    target: '@EntityGraph(attributePaths = "authorities")',
    tmpl: context => `@EntityGraph(attributePaths = {"authorities", "${context.tenant.entityInstance}"})`
  },
  {
    type: 'rewriteFile',
    target: 'import io.github.jhipster.sample.domain.User;',
    tmpl: ctx => `import io.github.jhipster.sample.domain.${ctx.tenant.entityClass};`
  },
  {
    type: 'rewriteFile',
    target: 'findAllByLoginNot',
    tmpl: ctx => `
    void deleteByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});

    Optional<User> findByIdAnd${ctx.tenant.entityClass}(Long id, ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance});
`
  }
];

module.exports = {
  file,
  tmpls
};
