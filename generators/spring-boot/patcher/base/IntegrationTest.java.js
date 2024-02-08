// Ignore tests with account
const file = data => `${data.srcTestJava}${data.packageFolder}/IntegrationTest.java`;

const tmpls = [
  {
    type: 'replaceContent',
    target: data => `package ${data.packageName};
`,
    tmpl: data => `package ${data.packageName};

import ${data.packageName}.config.${data.tenantEntity.entityInstance}.${data.tenantEntity.entityClass}AwareSessionTestConfiguration;
`,
  },
  {
    type: 'replaceContent',
    target: data => `@SpringBootTest(classes = {${data.mainClass}.class,`,
    tmpl: data =>
      `@SpringBootTest(classes = {${data.mainClass}.class,  ${data.tenantEntity.entityClass}AwareSessionTestConfiguration.class,`,
  },
];

export default {
  file,
  tmpls,
};
