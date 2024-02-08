const file = data => `${data.srcMainWebapp}app/admin/user-management/user-management-detail.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)<dt>.*>Created By<)',
    tmpl: data => {
      const jhiTranslate = data.enableTranslation ? ` jhiTranslate="userManagement.${data.tenantEntity.entityInstance}"` : '';
      return `$2<dt><span${jhiTranslate}>${data.tenantEntity.entityClass}</span></dt>
$2<dd>{{user.${data.tenantEntity.entityInstance}?.name}}</dd>
$1`;
    },
  },
];

export default {
  file,
  tmpls,
};
