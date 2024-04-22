const file = data => `${data.srcMainWebapp}app/admin/user-management/user-management-update.component.ts`;

const tmpls = [
  {
    type: 'replaceContent',
    disabled: true,
    target: /(import { ActivatedRoute(.*) } from '@angular\/router';)/,
    // eslint-disable-next-line prettier/prettier
    tmpl: () => `$1
import { HttpResponse } from '@angular/common/http';
`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(@Component\({)/,
    tmpl: data => `import { AccountService } from 'app/core/auth/account.service';
import { I${data.tenantEntity.entityClass} } from 'app/shared/model/${data.tenantEntity.entityInstance}.model';
import { ${data.tenantEntity.entityClass}Service } from 'app/entities/${data.tenantEntity.entityFolderName}/${data.tenantEntity.entityFileName}.service';

$1`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(\n(\s*)isSaving = false;)/,
    tmpl: () => `$1
$2currentAccount: any;
`,
  },
  {
    type: 'replaceContent',
    target: /(\n(\s*)authorities: \[](,?))/,
    tmpl: data => `$1,
$2${data.tenantEntity.entityInstance}: []$3
`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(\n(\s*)private fb: FormBuilder)/,
    tmpl: data => `$1,
$2private accountService: AccountService,
$2private ${data.tenantEntity.entityInstance}Service: ${data.tenantEntity.entityClass}Service
`,
  },
  {
    // Load currentAccount
    disabled: true,
    type: 'replaceContent',
    target: /(\n(\s*)ngOnInit\(\): void {\n(\s*))/,
    tmpl: data => `$1this.accountService.identity().subscribe((account) => {
$2$3this.currentAccount = account;
$3});

$3if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
$3    this.${data.tenantEntity.entityInstance}Service.query().subscribe(
$3        (res: HttpResponse<I${data.tenantEntity.entityClass}[]>) => this.${data.tenantEntity.entityInstancePlural} = res.body || []
$3    );
$3}

$3`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(\n(\s*)authorities: user.authorities)(,?)/,
    tmpl: data => `$1,
$2${data.tenantEntity.entityInstance}: user.${data.tenantEntity.entityInstance}$3`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(\n(\s*)user.authorities = this.editForm.get\(\['authorities']\)!.value;)/,
    tmpl: data => `$1
$2user.${data.tenantEntity.entityInstance} = this.editForm.get(['${data.tenantEntity.entityInstance}'])!.value;`,
  },
  {
    type: 'replaceContent',
    disabled: true,
    target: /(\n(\s*)private onSaveError\(\): void {(\s*))/,
    tmpl: data => `$2track${data.tenantEntity.entityClass}ById(index: number, item: I${data.tenantEntity.entityClass}): any {
$3return item.id;
$2}
$1`,
  },
];

export default {
  version: '>=6.6.0',
  file,
  tmpls,
};
