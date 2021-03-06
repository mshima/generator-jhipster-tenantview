const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/entities/${context.entity.entityFolderName}/${context.entity.entityFileName}-update.component.ts`;

const condition = context => context.entity.definitions.tenantAware;

const tmpls = [
  {
    // Add imports account
    type: 'rewriteFile',
    target: "import { Observable } from 'rxjs';",
    tmpl: () => "import { AccountService } from 'app/core/auth/account.service';"
  },
  {
    // Add currentAccount field
    type: 'replaceContent',
    regex: true,
    target: '(\n(\\s*)isSaving = false;)',
    tmpl: '\n$2currentAccount: any;\n$2$1'
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)private fb: FormBuilder)/,
    tmpl: () => `$1,
$2private accountService: AccountService`
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)ngOnInit\(\): void {\n(\s*))/,
    tmpl: () => `$1this.accountService.identity().subscribe((account) => {
$2$3this.currentAccount = account;
$3});

$3`
  },
  {
    type: 'rewriteFile',
    regex: true,
    target: 'this.updateForm',
    tmpl: context => `      if (this.currentAccount.${context.tenant.entityInstance}) {
        ${context.entity.entityInstance}.${context.tenant.entityInstance} = this.currentAccount.${context.tenant.entityInstance};
      }`
  },
  {
    type: 'replaceContent',
    regex: true,
    target: context => `\n((\\s*)this\\.${context.tenant.entityInstance}Service\\.query\\(\\)[^]?.*;)`,
    tmpl: () => `$2if (this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
  $1
$2};
`
  }
];

module.exports = {
  version: '>=6.6.0',
  file,
  condition,
  tmpls
};
