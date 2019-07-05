const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/app-routing.module.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => '...LAYOUT_ROUTES',
        tmpl: context => `        {
          path: '${context.tenantNameLowerFirst}-admin',
          data: {
              authorities: ['ROLE_${context.tenantNameUpperCase}_ADMIN']
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./${context.tenantNameLowerFirst}-admin/${
            context.tenantNameLowerFirst
        }-admin-routing.module').then(m => m.${context.tenantNameUpperFirst}AdminRoutingModule)
        },`
    }
];

module.exports = {
    file,
    tmpls
};
