const file = data => `${data.srcMainWebapp}app/admin/user-management/user-management-update.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    // eslint-disable-next-line prettier/prettier
    target: () => /((.*)<div class="form-group">\n(\s*)<label(.*)>Profiles<\/label>)/g,
    tmpl: data => {
      const jhiTranslate = data.enableTranslation ? ` jhiTranslate="userManagement.${data.tenantEntity.entityInstance}"` : '';
      return `$2<div class="form-group" *ngIf="(!currentAccount || currentAccount.${data.tenantEntity.entityInstance}?.id === 0) && ${data.tenantEntity.entityInstancePlural} && ${data.tenantEntity.entityInstancePlural}.length > 0">
$3<label class="form-control-label"${jhiTranslate}>${data.tenantEntity.entityClass}</label>
$3<select class="form-control" id="field_${data.tenantEntity.entityInstance}" name="${data.tenantEntity.entityInstance}" formControlName="${data.tenantEntity.entityInstance}">
$3    <option *ngIf="!editForm.get('${data.tenantEntity.entityInstance}')!.value" [ngValue]="null" selected></option>
$3    <option [ngValue]="${data.tenantEntity.entityInstance}Option.id === editForm.get('${data.tenantEntity.entityInstance}')!.value?.id ? editForm.get('${data.tenantEntity.entityInstance}')!.value : ${data.tenantEntity.entityInstance}Option" *ngFor="let ${data.tenantEntity.entityInstance}Option of ${data.tenantEntity.entityInstancePlural} trackBy: track${data.tenantEntity.entityClass}ById">{{${data.tenantEntity.entityInstance}Option.name}}</option>
$3</select>
$2</div>
$1`;
    },
  },
];

export default {
  file,
  tmpls,
};
