export default {
  file: data => `${data.srcMainWebapp}app/core/interceptor/auth.interceptor.ts`,
  tmpls: [
    {
      type: 'rewriteFile',
      target: '@Injectable()',
      tmpl: "import { CurrentTenantService } from '../auth/current-tenant.service';",
    },
    {
      type: 'rewriteFile',
      target: '= inject(',
      tmpl: 'private tenantId = inject(CurrentTenantService).trackTenantId();',
    },
    {
      type: 'rewriteFile',
      target: 'Authorization:',
      tmpl: "'X-Tenant-ID': '' + (this.tenantId() ?? ''),",
    },
  ],
};
