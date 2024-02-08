import { patch } from '../../../tenantview/support/patcher.js';

export default patch({
  file: data => `${data.srcMainJava}${data.packageFolder}/web/rest/AccountResource.java`,
  tmpls: [
    {
      type: 'rewriteFile',
      target: '.orElseThrow(() -> new AccountResourceException("User could not be found"));',
      tmpl: `.map(user -> {
    user.setAuthorities(TenantUtils.getCurrentLoginAuthorities());
    return user;
})`,
    },
    {
      type: 'rewriteFile',
      target: 'import ',
      tmpl: data => `import ${data.packageName}.security.TenantUtils;`,
    },
  ],
});
