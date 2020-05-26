const file = context => `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/domain/${context.tenant.entityClass}.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'replaceContent',
    regex: false,
    target: context => `@OneToMany(mappedBy = "${context.tenant.entityInstance}")`,
    tmpl: context => `@OneToMany(mappedBy = "${context.tenant.entityInstance}", fetch = FetchType.EAGER)`
  }
];

module.exports = {
  file,
  tmpls
};
