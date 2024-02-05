const file = context => `${context.srcMainWebapp}app/layouts/navbar/navbar.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    target: /(<li )([^<.]*\n\s*<a[^<.]* routerLink="\/")/,
    tmpl: '$1id="home-menu-container" $2',
  },
  {
    type: 'replaceContent',
    target: /(<li )([^<.]*\n\s*<a[^<.]* id="entity-menu")/,
    tmpl: '$1id="entity-menu-container" $2',
  },
  {
    type: 'replaceContent',
    target: /(<li )([^<.]*\n\s*<a[^<.]* id="admin-menu")/,
    tmpl: '$1id="admin-menu-container" $2',
  },
  {
    condition: data => data.enableTranslation,
    type: 'replaceContent',
    target: /(<li )([^<.]*\.[^<.]*\n\s*<a[^<.]* id="languagesnavBarDropdown")/,
    tmpl: '$1id="languages-menu-container" $2',
  },
  {
    type: 'replaceContent',
    target: /(<li )([^<.]*\n\s*<a[^<.]* id="account-menu")/,
    tmpl: '$1id="account-menu-container" $2',
  },
  {
    type: 'rewriteFile',
    target: '- jhipster-needle-add-element-to-menu -',
    tmpl: context => {
      const jhiTranslate = context.enableTranslation ? ` jhiTranslate="global.menu.${context.tenant.entityInstance}Admin.main"` : '';
      const jhiTranslate2 = context.enableTranslation ? ' jhiTranslate="global.menu.admin.userManagement"' : '';
      return `<li *jhiHasAnyAuthority="'ROLE_${context.tenant.entityNameUpperCase}_ADMIN'" ngbDropdown id="${context.tenant.entityLowerCase}-admin-menu-container" class="nav-item dropdown pointer" display="dynamic" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <a class="nav-link dropdown-toggle" ngbDropdownToggle href="javascript:void(0);" id="${context.tenant.entityInstance}-admin-menu">
                    <span>
                        <fa-icon icon="user-plus"></fa-icon>
                        <span${jhiTranslate}>${context.tenant.entityClass} Administration</span>
                    </span>
                </a>
                <ul class="dropdown-menu" ngbDropdownMenu aria-labelledby="admin-menu">
                    <li>
                        <a class="dropdown-item" routerLink="${context.tenant.entityInstance}-admin/user-management" routerLinkActive="active" (click)="collapseNavbar()">
                            <fa-icon icon="user" [fixedWidth]="true"></fa-icon>
                            <span${jhiTranslate2}>User management</span>
                        </a>
                    </li>
                    <!-- jhipster-needle-add-element-to-${context.tenant.entityInstance}-admin-menu - JHipster will add entities to the ${context.tenant.entityInstance} admin menu here -->
                </ul>
            </li>
`;
    },
  },
];

module.exports = {
  file,
  tmpls,
};
