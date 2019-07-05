const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.ts`;

const condition = context => context.tenantAware;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => `app/entities/${context.tenantNameLowerFirst}/${context.tenantNameLowerFirst}.service`,
        tmpl: context => `app/entities/${context.tenantFolderName}/${context.tenantNameLowerFirst}.service`
    }
];

module.exports = {
    file,
    condition,
    tmpls
};
