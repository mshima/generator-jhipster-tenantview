import { patch } from '../../../tenantview/support/patcher.js';

export default patch({
  file: data => `${data.srcMainJava}${data.packageFolder}/security/DomainUserDetailsService.java`,
  tmpls: [
    {
      type: 'rewriteFile',
      target: 'return new org.springframework.security.core.userdetails.User',
      tmpl: `        if (user.getTenant().getId() == 0) {
            grantedAuthorities = TenantUtils.addRootGrantedAuthorities(grantedAuthorities);
        }`,
    },
  ],
});
