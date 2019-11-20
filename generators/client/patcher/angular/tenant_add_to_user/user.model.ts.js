const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/user/user.model.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => 'export interface IUser',
        tmpl: context => `import { ${context.tenantNameUpperFirst} } from '../../shared/admin/${context.tenantNameLowerFirst}.model';
`
    },
    {
        type: 'replaceContent',
        target: /((\n\s*)password\?: string;)/,
        tmpl: context => `$1$2${context.tenantNameLowerFirst}?: ${context.tenantNameUpperFirst};`
    },
    {
        type: 'replaceContent',
        target: /((\n\s*)public password\?: string)/,
        tmpl: context => `$1,$2public ${context.tenantNameLowerFirst}?: ${context.tenantNameUpperFirst}`
    },
    {
        type: 'replaceContent',
        regex: true,
        target: /((\n\s*)this.password = password \? password : null;)/,
        tmpl: context =>
            `$1$2this.${context.tenantNameLowerFirst} = ${context.tenantNameLowerFirst} ? ${context.tenantNameLowerFirst} : null;`
    }
];

module.exports = {
    file,
    tmpls
};
