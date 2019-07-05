const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.component.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: context => "this.router.navigate(['/admin/user-management'], {",
        tmpl: context => `this.router.navigate(['./'], {
        relativeTo: this.activatedRoute.parent,`
    }
];

module.exports = {
    file,
    tmpls
};
