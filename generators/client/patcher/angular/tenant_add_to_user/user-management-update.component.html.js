const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-update.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        // eslint-disable-next-line prettier/prettier
        target: context => /((.*)<div class="form-group">\n(\s*)<label jhiTranslate="userManagement\.profiles">Profiles<\/label>)/g,
        tmpl: context => {
            return `$2<div class="form-group" *ngIf="!currentAccount.${context.tenantNameLowerFirst} && ${
                context.tenantInstancePlural
            } && ${context.tenantInstancePlural}.length > 0">
$3<label class="form-control-label" jhiTranslate="userManagement.${context.tenantNameLowerFirst}">${context.tenantNameUpperFirst}</label>
$3<select class="form-control" id="field_${context.tenantNameLowerFirst}" name="${context.tenantNameLowerFirst}" formControlName="${
                context.tenantNameLowerFirst
            }">
$3    <option *ngIf="!editForm.get('${context.tenantNameLowerFirst}').value" [ngValue]="null" selected></option>
$3    <option [ngValue]="${context.tenantNameLowerFirst}Option.id === editForm.get('${
                context.tenantNameLowerFirst
            }').value?.id ? editForm.get('${context.tenantNameLowerFirst}').value : ${context.tenantNameLowerFirst}Option" *ngFor="let ${
                context.tenantNameLowerFirst
            }Option of companies trackBy: track${context.tenantNameUpperFirst}ById">{{${context.tenantNameLowerFirst}Option.name}}</option>
$3</select>
$2</div>
$1`;
        }
    }
];

module.exports = {
    file,
    tmpls
};
