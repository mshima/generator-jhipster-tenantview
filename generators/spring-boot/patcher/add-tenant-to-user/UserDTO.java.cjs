// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.SERVER_MAIN_SRC_DIR}${gen.packageFolder}/service/dto/UserDTO.java`;

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
    target: gen => `(import ${gen.packageName}\\.domain\\.User;)`,
    tmpl: gen => `$1
import ${gen.packageName}.domain.${gen.tenant.entityClass};`,
  },
  {
    type: 'rewriteFile',
    target: 'public UserDTO() {',
    tmpl: gen => `@JsonIgnoreProperties({"users"})
    private ${gen.tenant.entityClass} ${gen.tenant.entityInstance};
`,
  },
  {
    type: 'replaceContent',
    regex: true,
    disabled: true,
    target: () => `(\n(.*)this\\.authorities = user\\.getAuthorities\\(\\)\\.stream\\(\\)
(.*)\\.map\\(Authority::getName\\)
(.*)collect\\(Collectors.toSet\\(\\)\\);)`,
    tmpl: context => `$1
$2this.${context.tenant.entityInstance} = user.get${context.tenant.entityClass}();`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => `(\n(.*)this\\.login = login;
(.*)\\})`,
    tmpl: context => `$1

$3public ${context.tenant.entityClass} get${context.tenant.entityClass}() {
$2return ${context.tenant.entityInstance};
$3}

$3public void set${context.tenant.entityClass}(${context.tenant.entityClass} ${context.tenant.entityInstance}) {
$2this.${context.tenant.entityInstance} = ${context.tenant.entityInstance};
$3}`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => "((.*)\", login='\" \\+ login \\+ '\\\\'' \\+)",
    tmpl: context => `$1
$2", ${context.tenant.entityInstance}='" + ${context.tenant.entityInstance} + '\\'' +`,
  },
];

module.exports = {
  file,
  tmpls,
};
