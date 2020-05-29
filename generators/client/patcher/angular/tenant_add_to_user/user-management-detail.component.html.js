const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-detail.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)<dt>.*>Created By<)',
    tmpl: context => {
      const jhiTranslate = context.enableTranslation ? ` jhiTranslate="userManagement.${context.tenant.entityInstance}"` : '';
      return `$2<dt><span${jhiTranslate}>${context.tenant.entityClass}</span></dt>
$2<dd>{{user.${context.tenant.entityInstance}?.name}}</dd>
$1`;
    }
  }
];

module.exports = {
  file,
  tmpls
};
