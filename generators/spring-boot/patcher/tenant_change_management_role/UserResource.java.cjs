const file = data => `${data.SERVER_MAIN_SRC_DIR}${data.packageFolder}/web/rest/UserResource.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '@PreAuthorize\\("hasAuthority\\(\\\\""',
    tmpl: context => `@PreAuthorize("hasAnyAuthority(\\"" + AuthoritiesConstants.${context.tenant.entityNameUpperCase}_ADMIN + ", "`,
  },
];

module.exports = {
  file,
  tmpls,
};
