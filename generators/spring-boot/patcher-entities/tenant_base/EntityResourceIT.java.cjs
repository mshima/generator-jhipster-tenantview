// Ignore tests with account
const file = data => `${data.SERVER_TEST_SRC_DIR}${data.packageFolder}/web/rest/${data.entityClass}ResourceIT.java`;

const tmpls = [
  {
    condition: data => data.tenantAware,
    type: 'rewriteFile',
    tmpl: data => `import static ${data.packageName}.TenantIntegrationTestUtils.*;`,
    target: 'import static org.assertj.core.api.Assertions.assertThat;',
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    tmpl: data => `import ${data.packageName}.IntegrationTest;
import org.springframework.context.ApplicationContext;
import org.junit.jupiter.api.AfterEach;`,
    target: data => `import ${data.packageName}.IntegrationTest;`,
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    tmpl: `
@WithMockUser(username = DEFAULT_TENANT_USER, authorities = { DEFAULT_TENANT_USER_AUTHORITY })
`,
    target: `
@WithMockUser
`,
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    tmpl: `
    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
`,
    target: `
    @Autowired
`,
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    tmpl: `@WithMockUser(username = DEFAULT_TENANT_ADMIN_USER, authorities = { DEFAULT_TENANT_ADMIN_USER_AUTHORITY })
    @Transactional
    public void initTest() {
        setupTenant(applicationContext);
`,
    target: 'public void initTest() {',
  },
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    tmpl: `
    @WithMockUser(username = DEFAULT_TENANT_ADMIN_USER, authorities = { DEFAULT_TENANT_ADMIN_USER_AUTHORITY })
    @AfterEach
    @Transactional
    public void tearDown() {
        tearDownTenant(applicationContext);
    }

    @Test
`,
    target: `
    @Test`,
  },
  {
    condition: data => data.tenantAware,
    disabled: true,
    type: 'rewriteFile',
    tmpl: 'import org.junit.jupiter.api.Disabled;',
    target: 'import org.junit.jupiter.api.Test;',
  },
  {
    disabled: true,
    condition: data => data.tenantAware,
    type: 'replaceContent',
    regex: true,
    ignorePatchErrors: true,
    tmpl: '',
    target: data => `
\\s*${data.tenant.entityClass} ${data.tenant.entityInstance};
.*
.*
.*
.*
.*
.*
.*
\\s*${data.entityInstance}.set${data.tenant.entityClass}\\(${data.tenant.entityInstance}\\);`,
  },
  {
    condition: data => data.tenantAware && data.jpaMetamodelFiltering,
    type: 'rewriteFile',
    tmpl: '@Disabled',
    target: data => `getAll${data.entityClassPlural}By${data.tenant.entityClass}IsEqualToSomething()`,
  },
];

module.exports = {
  file,
  tmpls,
};
