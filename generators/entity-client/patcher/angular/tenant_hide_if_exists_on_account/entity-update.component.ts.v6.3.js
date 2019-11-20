const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.ts`;

const condition = context => context.tenantAware;

const tmpls = [
    {
        // Add imports account
        type: 'rewriteFile',
        target: "import { Observable } from 'rxjs';",
        tmpl: context => "import { AccountService } from 'app/core/auth/account.service';"
    },
    {
        // Add currentAccount field
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)isSaving: boolean;',
        tmpl: '\n$1currentAccount: any;\n$1isSaving: boolean;'
    },
    {
        // Load currentAccount
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)private fb: FormBuilder\n(\\s*)\\) {(\\s*)}',
        tmpl: context => `\n$1private fb: FormBuilder,
$1private accountService: AccountService
$2) {
$1this.accountService.identity().then(account => {
$1$2this.currentAccount = account;
$1});
$2}`
    },
    {
        // Load currentAccount
        type: 'rewriteFile',
        regex: true,
        target: 'this.updateForm',
        tmpl: context => `      if (this.currentAccount.${context.tenantNameLowerFirst}) {
        ${context.entityInstance}.${context.tenantNameLowerFirst} = this.currentAccount.${context.tenantNameLowerFirst};
      }`
    }
];

module.exports = {
    file,
    condition,
    tmpls
};
