const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-detail.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => '((.*)<dt>.*>Created By<)',
        tmpl: context => {
            let trans = '';
            if (context.enableTranslation) trans = ` jhiTranslate="userManagement.${context.tenantNameLowerFirst}"`;
            return `$2<dt><span${trans}>${context.tenantNameUpperFirst}</span></dt>
$2<dd>{{user.${context.tenantNameLowerFirst}?.name}}</dd>
$1`;
        }
    }
];

module.exports = {
    file,
    tmpls
};
