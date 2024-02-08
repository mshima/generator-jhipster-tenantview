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
      target: ' = inject(',
      tmpl: `
  currentTenantService = inject(CurrentTenantService);
  currentTenant = this.currentTenantService.trackTenantId();
  setCurrentTenantId = (tenantId: number) => this.currentTenantService.setTenantId(tenantId);
`,
    },
  ],
};
