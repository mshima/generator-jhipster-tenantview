const file = data => `${data.CLIENT_MAIN_SRC_DIR}app/admin/${data.entityFolderName}/${data.entityFileName}.service.ts`;

const tmpls = [
  {
    condition: data => data.tenant,
    disabled: true,
    type: 'rewriteFile',
    target: () => 'type EntityResponseType',
    tmpl: () => `import { AccountService } from 'app/core';
`,
  },
  {
    condition: data => data.tenant,
    disabled: true,
    type: 'replaceContent',
    target: () => '(protected http: HttpClient)',
    tmpl: () => '(protected http: HttpClient, protected accountService: AccountService)',
  },
  {
    condition: data => data.tenant,
    disabled: true,
    type: 'rewriteFile',
    target: () => 'const options = createRequestOption(req);',
    tmpl: () => `    if (!this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
      return new Observable(observer => {
        observer.complete();
      });
    }
`,
  },
];

module.exports = {
  disabled: true,
  file,
  tmpls,
};
