const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/${context.entityFolderName}/${context.entityFileName}.route.ts`;

const tmpls = [
    {
        // Add ROLE
        condition: context => context.isTenant,
        type: 'replaceContent',
        regex: true,
        target: context => "authorities: \\['ROLE_USER'\\]",
        tmpl: context => "authorities: ['ROLE_ADMIN']"
    }
];

module.exports = {
    file,
    tmpls
};
