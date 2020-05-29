const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/${context.entityFolderName}/${context.entityFileName}.service.ts`;

const tmpls = [
  {
    condition: context => context.isTenant,
    disabled: true,
    type: 'rewriteFile',
    target: () => 'type EntityResponseType',
    tmpl: () => `import { AccountService } from 'app/core';
`
  },
  {
    condition: context => context.isTenant,
    disabled: true,
    type: 'replaceContent',
    target: () => '(protected http: HttpClient)',
    tmpl: () => '(protected http: HttpClient, protected accountService: AccountService)'
  },
  {
    condition: context => context.isTenant,
    disabled: true,
    type: 'rewriteFile',
    target: () => 'const options = createRequestOption(req);',
    tmpl: () => `    if (!this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
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
