const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-update.component.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: /(import \{ ActivatedRoute(.*) \} from '@angular\/router';)/,
        // eslint-disable-next-line prettier/prettier
        tmpl: context => `$1
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
`
    },
    {
        type: 'replaceContent',
        target: /(@Component\(\{)/,
        tmpl: context => `import { AccountService } from 'app/core/auth/account.service';
import { I${context.tenantNameUpperFirst} } from '../../${context.tenantModelPath}/${context.tenantNameLowerFirst}.model';
import { ${context.tenantNameUpperFirst}Service } from '../${context.tenantFolderName}/${context.tenantServiceFileName}.service';

$1`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)isSaving: boolean;)/,
        tmpl: context => `$1
$2currentAccount: any;
$2${context.tenantNamePluralLowerFirst}: I${context.tenantNameUpperFirst}[];
`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)authorities: \[\](,?))/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: []$3
`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)private fb: FormBuilder)/,
        tmpl: context => `$1,
$2private accountService: AccountService,
$2protected jhiAlertService: JhiAlertService,
$2private ${context.tenantNameLowerFirst}Service: ${context.tenantNameUpperFirst}Service
`
    },
    {
        // Load currentAccount
        type: 'replaceContent',
        target: /(\n(\s*)ngOnInit\(\) {\n(\s*))/,
        tmpl: context => `$1this.accountService.identity().subscribe((account) => {
$2$3this.currentAccount = account;
$3});

$3`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)this.authorities = \[\];)/,
        tmpl: context => `

$2this.${context.tenantNameLowerFirst}Service.query()
$2.pipe(
$2    filter((mayBeOk: HttpResponse<I${context.tenantNameUpperFirst}[]>) => mayBeOk.ok),
$2        map((response: HttpResponse<I${context.tenantNameUpperFirst}[]>) => response.body)
$2)
$2.subscribe(
$2    (res: I${context.tenantNameUpperFirst}[]) => (this.${
            context.tenantNamePluralLowerFirst
        } = res), (res: HttpErrorResponse) => this.onError(res.message)
$2);

$1`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)authorities: user.authorities)(,?)/,
        tmpl: context => `$1,
$2${context.tenantNameLowerFirst}: user.${context.tenantNameLowerFirst}$3`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)user.authorities = this.editForm.get\(\['authorities'\]\).value;)/,
        tmpl: context => `$1
$2user.${context.tenantNameLowerFirst} = this.editForm.get(['${context.tenantNameLowerFirst}']).value;`
    },
    {
        type: 'replaceContent',
        target: /(\n(\s*)private onSaveError\(\) \{(\s*))/,
        tmpl: context => `$2protected onError(errorMessage: string) {
$3this.jhiAlertService.error(errorMessage, null, null);
$2}

$2track${context.tenantNameUpperFirst}ById(index: number, item: I${context.tenantNameUpperFirst}) {
$3return item.id;
$2}
$1`
    }
];

module.exports = {
    version: '^6.4.0',
    file,
    tmpls
};
