const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/detail/${data.entityFileName}-detail.component.ts`;

const tmpls = [
  {
    // Add tenant getter to account
    type: 'rewriteFile',
    target: "from '@angular/router';",
    tmpl: data => `import { inject } from '@angular/core';`,
  },
  {
    // Add imports account
    type: 'rewriteFile',
    target: "import SharedModule from 'app/shared/shared.module';",
    tmpl: "import { AccountService } from 'app/core/auth/account.service';",
  },
  {
    // Add currentAccount field
    type: 'replaceContent',
    regex: true,
    target: /(export class .* {\n(\s*))/,
    tmpl: '$1$2showTenant = inject(AccountService).trackShowTenant();\n$2',
  },
];

export default {
  file,
  tmpls,
};
