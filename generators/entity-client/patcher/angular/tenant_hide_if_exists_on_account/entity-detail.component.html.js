const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-detail.component.html`;

const condition = context => context.tenantAware;

const tmpls = [
    {
        // Hide tenant if is defined
        type: 'replaceContent',
        condition: context => context.tenantAware,
        regex: true,
        target: context => `<dt>(<span(.*)>${context.tenantNameUpperFirst}</span></dt>(\\s*)<dd>)`,
        tmpl: context => `<dt *ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">$1`
    }
];

module.exports = {
    file,
    condition,
    tmpls
};
