const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)<th(.*)>\\s*<span(.*)>Profiles)',
    tmpl: context => {
      const jhiTranslate = context.enableTranslation ? ` jhiTranslate="userManagement.${context.tenant.entityInstance}"` : '';
      // eslint-disable-next-line prettier/prettier
            return `$2<th$3 jhiSortBy="${context.tenant.entityInstance}" *ngIf="!currentAccount || !currentAccount.${context.tenant.entityInstance}"><span${jhiTranslate}>${context.tenant.entityClass}</span> <fa-icon [icon]="'sort'"></fa-icon></th>
$1`;
    }
  },
  {
    type: 'replaceContent',
    regex: true,
    target: /((\s*)<td>(\s*)<div \*ngFor="let authority of user.authorities">)/,
    tmpl: context =>
      `$2<td *ngIf="!currentAccount || !currentAccount.${context.tenant.entityInstance}">{{user.${context.tenant.entityInstance}?.name}}</td>$1`
  }
];

module.exports = {
  file,
  tmpls
};
