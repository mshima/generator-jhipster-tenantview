const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/admin/${context.entity.entityFolderName}/${context.entity.entityFileName}.route.ts`;

const tmpls = [
  {
    // Add ROLE
    condition: context => context.isTenant,
    type: 'replaceContent',
    regex: true,
    target: () => 'authorities: \\[Authority.USER\\]',
    tmpl: () => 'authorities: [Authority.ADMIN]'
  }
];

module.exports = {
  file,
  tmpls
};
