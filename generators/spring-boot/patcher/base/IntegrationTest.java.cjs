// Ignore tests with account
const file = data => `${data.SERVER_TEST_SRC_DIR}${data.packageFolder}/IntegrationTest.java`;

const tmpls = [
  {
    type: 'replaceContent',
    target: data => `package ${data.packageName};
`,
    tmpl: data => `package ${data.packageName};

import ${data.packageName}.config.${data.tenant.entityInstance}.${data.tenant.entityClass}AwareSessionTestConfiguration;
`,
  },
  {
    type: 'replaceContent',
    target: data => `@SpringBootTest(classes = {${data.mainClass}.class,`,
    tmpl: data => `@SpringBootTest(classes = {${data.mainClass}.class,  ${data.tenant.entityClass}AwareSessionTestConfiguration.class,`,
  },
];

module.exports = {
  file,
  tmpls,
};
