const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/web/rest/UserResource.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: context => '@PreAuthorize\\("hasAuthority\\(\\\\""',
    tmpl: context => `@PreAuthorize("hasAnyAuthority(\\"" + AuthoritiesConstants.${context.tenantNameUpperCase}_ADMIN + ", "`
  }
];

module.exports = {
  file,
  tmpls
};
