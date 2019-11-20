const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}.component.html`;

const tmpls = [
    {
        // Hide if currentAccount has a tenant
        condition: context => context.tenantAware,
        type: 'replaceContent',
        regex: true,
        target: context => `<th(.*)><span(.*)>${context.tenantNameUpperFirst}</span>`,
        tmpl: context => `<th$1 *ngIf="!currentAccount.${context.tenantNameLowerFirst}"><span$2>${context.tenantNameUpperFirst}</span>`
    },
    {
        // Hide if currentAccount has a tenant
        condition: context => context.tenantAware,
        type: 'replaceContent',
        regex: true,
        target: context => `<td>\n(\\s*)(<div \\*ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">)`,
        tmpl: context => `<td *ngIf="!currentAccount.${context.tenantNameLowerFirst}">\n$1$2`
    }
];
module.exports = {
    file,
    tmpls
};
