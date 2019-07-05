const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        // Add condition to hide menu
        condition: context => context.isTenant,
        type: 'replaceContent',
        regex: false,
        target: context => new RegExp(`<li>\n(\\s*)(<a class="dropdown-item" routerLink="${context.tenantUrl}")`),
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    }
];

module.exports = {
    file,
    tmpls
};
