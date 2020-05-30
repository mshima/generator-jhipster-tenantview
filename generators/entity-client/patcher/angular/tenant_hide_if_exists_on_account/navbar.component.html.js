const file = context => `${context.generator.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
  {
    // Add condition to hide menu
    condition: context => context.isTenant,
    type: 'replaceContent',
    regex: false,
    target: context => new RegExp(`<li>\n(\\s*)(<a class="dropdown-item" routerLink="${context.generator.entityStateName}")`),
    tmpl: () => `<li *jhiHasAnyAuthority="'ROLE_ADMIN'">\n$1$2`
  }
];

module.exports = {
  file,
  tmpls
};
