const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}.component.ts`;

const condition = context => context.tenantAware;

const tmpls = [
  {
    // Add imports account
    type: 'rewriteFile',
    target: 'import { JhiEventManager',
    tmpl: context => "import { AccountService } from 'app/core/auth/account.service';"
  },
  {
    // Add currentAccount field
    type: 'replaceContent',
    regex: true,
    target: /(implements OnInit, OnDestroy {\n(\s*))/,
    tmpl: '$1$2currentAccount: any;\n'
  },
  {
    type: 'replaceContent',
    target: /(constructor\(\n(\s*))/,
    tmpl: context => '$1$2private accountService: AccountService,\n'
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)ngOnInit\(\)(: void)? {\n(\s*)this.loadAll\(\);)/,
    tmpl: context => `$1
$4this.accountService.identity().subscribe((account) => {
$2$4this.currentAccount = account;
$4});
$4`
  }
];

module.exports = {
  version: '>=6.5.0',
  file,
  condition,
  tmpls
};
