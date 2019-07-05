const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => '((.*)<th(.*)>\\s*<span jhiTranslate="userManagement.profiles">)',
        tmpl: context => {
            // eslint-disable-next-line prettier/prettier
            return `$2<th$3 jhiSortBy="${context.tenantNameLowerFirst}" *ngIf="!currentAccount.${context.tenantNameLowerFirst}"><span jhiTranslate="userManagement.${context.tenantNameLowerFirst}">${context.tenantNameUpperFirst}</span> <fa-icon [icon]="'sort'"></fa-icon></th>
$1`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: /((\s*)<td>(\s*)<div \*ngFor="let authority of user.authorities">)/,
        tmpl: context =>
            `$2<td *ngIf="!currentAccount.${context.tenantNameLowerFirst}">{{user.${context.tenantNameLowerFirst}?.name}}</td>$1`
    }
];

module.exports = {
    file,
    tmpls
};
