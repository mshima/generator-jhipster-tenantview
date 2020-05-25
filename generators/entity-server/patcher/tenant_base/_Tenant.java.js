const file = context => `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/domain/${context.tenantNameUpperFirst}.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'replaceContent',
    regex: false,
    target: context => `@OneToMany(mappedBy = "${context.tenantNameLowerFirst}")`,
    tmpl: context => `@OneToMany(mappedBy = "${context.tenantNameLowerFirst}", fetch = FetchType.EAGER)`
  }
];

module.exports = {
  file,
  tmpls
};
