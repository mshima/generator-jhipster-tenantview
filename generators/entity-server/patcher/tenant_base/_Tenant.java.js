const file = context =>
  `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/domain/${context.entity.entityClass}.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'replaceContent',
    regex: false,
    target: context => `@OneToMany(mappedBy = "${context.entity.entityInstance}")`,
    tmpl: context => `@OneToMany(mappedBy = "${context.entity.entityInstance}", fetch = FetchType.EAGER)`
  }
];

module.exports = {
  file,
  tmpls
};
