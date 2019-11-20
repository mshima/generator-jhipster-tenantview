const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        target: /(<li )([^<.]*\n\s*<a[^<.]* routerLink="\/")/,
        tmpl: '$1id="home-menu-container" $2'
    },
    {
        type: 'replaceContent',
        target: /(<li )([^<.]*\n\s*<a[^<.]* id="entity-menu")/,
        tmpl: '$1id="entity-menu-container" $2'
    },
    {
        type: 'replaceContent',
        target: /(<li )([^<.]*\n\s*<a[^<.]* id="admin-menu")/,
        tmpl: '$1id="admin-menu-container" $2'
    },
    {
        condition: context => context.enableTranslation,
        type: 'replaceContent',
        target: /(<li )([^<.]*\.[^<.]*\n\s*<a[^<.]* id="languagesnavBarDropdown")/,
        tmpl: '$1id="languages-menu-container" $2'
    },
    {
        type: 'replaceContent',
        target: /(<li )([^<.]*\n\s*<a[^<.]* id="account-menu")/,
        tmpl: '$1id="account-menu-container" $2'
    },
    {
        type: 'rewriteFile',
        target: '- jhipster-needle-add-element-to-menu -',
        tmpl: context => `<li *jhiHasAnyAuthority="'ROLE_${context.tenantNameUpperCase}_ADMIN'" ngbDropdown id="${
            context.tenantNameLowerCase
        }-admin-menu-container" class="nav-item dropdown pointer" display="dynamic" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <a class="nav-link dropdown-toggle" ngbDropdownToggle href="javascript:void(0);" id="${
                    context.tenantNameLowerFirst
                }-admin-menu">
                    <span>
                        <fa-icon icon="user-plus"></fa-icon>
                        <span jhiTranslate="global.menu.${context.tenantNameLowerFirst}Admin.main">${
            context.tenantNameUpperFirst
        } Administration</span>
                    </span>
                </a>
                <ul class="dropdown-menu" ngbDropdownMenu aria-labelledby="admin-menu">
                    <li>
                        <a class="dropdown-item" routerLink="${
                            context.tenantNameLowerFirst
                        }-admin/user-management" routerLinkActive="active" (click)="collapseNavbar()">
                            <fa-icon icon="user" fixedWidth="true"></fa-icon>
                            <span jhiTranslate="global.menu.admin.userManagement">User management</span>
                        </a>
                    </li>
                    <!-- jhipster-needle-add-element-to-${context.tenantNameLowerFirst}-admin-menu - JHipster will add entities to the ${
            context.tenantNameLowerFirst
        } admin menu here -->
                </ul>
            </li>
`
    }
];

module.exports = {
    file,
    tmpls
};
