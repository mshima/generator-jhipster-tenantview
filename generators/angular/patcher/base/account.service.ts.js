import { patch } from '../../../tenantview/support/index.js';

export default patch({
  file: data => `${data.srcMainWebapp}app/core/auth/account.service.ts`,
  tmpls: [
    {
      type: 'rewriteFile',
      target: "from '@angular/core';",
      tmpl: "import { computed } from '@angular/core';",
    },
    {
      type: 'rewriteFile',
      target: 'trackCurrentAccount',
      tmpl: data => `    trackShowTenant(): Signal<boolean> {
      return computed(() => this.hasAnyAuthority([${data.tenantEntity.builtInUser ? "'ROLE_ADMIN'" : "'ROLE_ROOT_USER', 'ROLE_ROOT_ADMIN'"}]));
    }`,
    },
  ],
});
