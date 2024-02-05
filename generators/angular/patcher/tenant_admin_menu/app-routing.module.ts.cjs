const file = context => `${context.srcMainWebapp}app/app-routing.module.ts`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => '...LAYOUT_ROUTES',
    tmpl: context => `        {
          path: '${context.tenant.entityInstance}-admin',
          data: {
              authorities: ['ROLE_${context.tenant.entityNameUpperCase}_ADMIN']
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./${context.tenant.entityInstance}-admin/${context.tenant.entityInstance}-admin-routing.module').then(m => m.${context.tenant.entityClass}AdminRoutingModule)
        },`,
  },
];

module.exports = {
  file,
  tmpls,
};
