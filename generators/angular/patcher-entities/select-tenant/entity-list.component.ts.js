export default {
  file: data =>
    `${data.srcMainWebapp}app/${data.builtInUserManagement ? '' : 'entities/'}${data.entityFolderName}/list/${data.entityFileName}.component.ts`,
  tmpls: [
    {
      type: 'rewriteFile',
      target: "import SharedModule from 'app/shared/shared.module';",
      tmpl: "import { CurrentTenantService } from 'app/core/auth/current-tenant.service';",
    },
    {
      type: 'rewriteFile',
      target: data => (data.builtInUserManagement ? 'private userService = ' : 'public router = inject'),
      tmpl: `
  currentTenant = inject(CurrentTenantService).trackTenantId();
`,
    },
    {
      type: 'rewriteFile',
      target: data => (data.builtInUserManagement ? 'ngOnInit()' : `track${data.primaryKey.nameCapitalized} =`),
      tmpl: `
  private currentTenantService = inject(CurrentTenantService);
  setCurrentTenantId = (tenantId: number):void => this.currentTenantService.setTenantId(tenantId);
`,
    },
  ],
};
