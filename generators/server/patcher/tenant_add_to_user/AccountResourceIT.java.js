// Ignore tests with account
const file = gen => `${gen.constants.SERVER_TEST_SRC_DIR}${gen.storage.packageFolder}/web/rest/AccountResourceIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: 'import org.junit.jupiter.api.Disabled;',
    target: 'import org.junit.jupiter.api.Test;'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccount()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccountWithWrongKey()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testGetUnknownAccount()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterAdminIsIgnored()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateEmail()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateLogin()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterValid()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRequestPasswordReset()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRequestPasswordResetUpperCaseEmail()'
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testGetExistingAccount()'
  }
];

module.exports = {
  file,
  tmpls
};
