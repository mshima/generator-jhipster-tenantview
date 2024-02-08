const file = data => `${data.srcMainWebapp}app/admin/user-management/user-management.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)<th(.*)>\\s*<span(.*)>Profiles)',
    tmpl: data => {
      const jhiTranslate = data.enableTranslation ? ` jhiTranslate="userManagement.${data.tenantEntity.entityInstance}"` : '';
      // eslint-disable-next-line prettier/prettier
      return `$2<th$3 jhiSortBy="${data.tenantEntity.entityInstance}" *ngIf="currentAccount?.${data.tenantEntity.entityInstance}?.id === 0"><span${jhiTranslate}>${data.tenantEntity.entityClass}</span> <fa-icon [icon]="'sort'"></fa-icon></th>
$1`;
    },
  },
  {
    type: 'replaceContent',
    regex: true,
    target: /((\s*)<td>(\s*)<div \*ngFor="let authority of user.authorities">)/,
    tmpl: data =>
      `$2<td *ngIf="currentAccount?.${data.tenantEntity.entityInstance}?.id === 0">{{user.${data.tenantEntity.entityInstance}?.name}}</td>$1`,
  },
];

export default {
  file,
  tmpls,
};
