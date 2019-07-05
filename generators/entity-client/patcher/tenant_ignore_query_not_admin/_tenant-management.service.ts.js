const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/${context.entityFolderName}/${context.entityFileName}.service.ts`;

const tmpls = [
    {
        condition: context => context.isTenant,
        disabled: true,
        type: 'rewriteFile',
        target: context => 'type EntityResponseType',
        tmpl: context => `import { AccountService } from 'app/core';
`
    },
    {
        condition: context => context.isTenant,
        disabled: true,
        type: 'replaceContent',
        target: context => '(protected http: HttpClient)',
        tmpl: context => '(protected http: HttpClient, protected accountService: AccountService)'
    },
    {
        condition: context => context.isTenant,
        disabled: true,
        type: 'rewriteFile',
        target: context => 'const options = createRequestOption(req);',
        tmpl: context => `    if (!this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      return new Observable(observer => {
        observer.complete();
      });
    }
`
    }
];

module.exports = {
    file,
    tmpls
};
