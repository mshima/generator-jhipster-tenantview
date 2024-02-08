// Ignore tests with account
const file = data => `${data.srcTestJava}${data.packageFolder}/web/rest/AccountResourceIT.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser("unknown_user")',
    target: 'testGetUnknownAccount()',
  },
  /*
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser(TEST_USER_LOGIN)',
    target: 'testGetExistingAccount()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@WithMockUser(TEST_USER_LOGIN)',
    target: 'testAuthenticatedUser()',
  },
  */
  {
    type: 'rewriteFile',
    tmpl: 'import org.junit.jupiter.api.Disabled;',
    target: 'import org.junit.jupiter.api.Test;',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccount()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testActivateAccountWithWrongKey()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterAdminIsIgnored()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateEmail()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterDuplicateLogin()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterValid()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidLogin()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidEmail()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterNullPassword()',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Disabled("Self registration disabled")',
    target: 'testRegisterInvalidPassword()',
  },
];

export default {
  file,
  tmpls,
};
