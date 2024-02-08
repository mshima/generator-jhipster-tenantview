// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/service/dto/UserDTO.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => `(import java.io.Serializable;)`,
    tmpl: () => `$1
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: data => `(import ${data.packageName}\\.domain\\.User;)`,
    tmpl: data => `$1
import ${data.packageName}.domain.${data.tenantEntity.entityClass};`,
  },
  {
    type: 'rewriteFile',
    target: 'public UserDTO() {',
    tmpl: data => `@JsonIgnoreProperties({"users"})
    private ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance};
`,
  },
  {
    type: 'replaceContent',
    regex: true,
    disabled: true,
    target: () => `(\n(.*)this\\.authorities = user\\.getAuthorities\\(\\)\\.stream\\(\\)
(.*)\\.map\\(Authority::getName\\)
(.*)collect\\(Collectors.toSet\\(\\)\\);)`,
    tmpl: data => `$1
$2this.${data.tenantEntity.entityInstance} = user.get${data.tenantEntity.entityClass}();`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => `(\n(.*)this\\.login = login;
(.*)\\})`,
    tmpl: data => `$1

$3public ${data.tenantEntity.entityClass} get${data.tenantEntity.entityClass}() {
$2return ${data.tenantEntity.entityInstance};
$3}

$3public void set${data.tenantEntity.entityClass}(${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance}) {
$2this.${data.tenantEntity.entityInstance} = ${data.tenantEntity.entityInstance};
$3}`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => "((.*)\", login='\" \\+ login \\+ '\\\\'' \\+)",
    tmpl: data => `$1
$2", ${data.tenantEntity.entityInstance}='" + ${data.tenantEntity.entityInstance} + '\\'' +`,
  },
];

export default {
  file,
  tmpls,
};
