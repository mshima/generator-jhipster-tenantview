const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/web/rest/UserResource.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: context => '@PreAuthorize\\("hasAuthority\\(\\\\""',
    tmpl: context => `@PreAuthorize("hasAnyAuthority(\\"" + AuthoritiesConstants.${context.tenant.entityUpperCase}_ADMIN + ", "`
  }
];

module.exports = {
  file,
  tmpls
};
