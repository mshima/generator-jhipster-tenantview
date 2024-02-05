const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/list/${data.entityFileName}.component.ts`;

const condition = data => data.tenantAware;

const tmpls = [
  {
    // Add imports account
    type: 'rewriteFile',
    target: "import SharedModule from 'app/shared/shared.module';",
    tmpl: () => "import { AccountService } from 'app/core/auth/account.service';",
  },
  {
    // Add currentAccount field
    type: 'replaceContent',
    regex: true,
    target: /(implements OnInit {\n(\s*))/,
    tmpl: '$1$2currentAccount: any;\n',
  },
  {
    type: 'rewriteFile',
    target: data => `protected ${data.entityInstance}Service = inject(${data.entityAngularName}Service);`,
    tmpl: () => '  protected accountService = inject(AccountService);',
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)ngOnInit\(\)(: void)? {\n(\s*)this.loadAll\(\);)/,
    tmpl: () => `$1
$4this.accountService.identity().subscribe((account) => {
$2$4this.currentAccount = account;
$4});
$4`,
  },
];

module.exports = {
  file,
  condition,
  tmpls,
};
