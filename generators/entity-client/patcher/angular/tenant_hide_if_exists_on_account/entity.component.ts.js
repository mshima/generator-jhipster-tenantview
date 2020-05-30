const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/entities/${context.entity.entityFolderName}/${context.entity.entityFileName}.component.ts`;

const condition = context => context.entity.definitions.tenantAware;

const tmpls = [
  {
    // Add imports account
    type: 'rewriteFile',
    target: 'import { JhiEventManager',
    tmpl: () => "import { AccountService } from 'app/core/auth/account.service';"
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
    tmpl: () => '$1$2private accountService: AccountService,\n'
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)ngOnInit\(\)(: void)? {\n(\s*)this.loadAll\(\);)/,
    tmpl: () => `$1
$4this.accountService.identity().subscribe((account) => {
$2$4this.currentAccount = account;
$4});
$4`
  }
];

module.exports = {
  file,
  condition,
  tmpls
};
