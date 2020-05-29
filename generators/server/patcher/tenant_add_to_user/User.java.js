// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/domain/User.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(import org\\.hibernate\\.annotations\\.CacheConcurrencyStrategy;)',
    tmpl: () => `$1
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(public class User)',
    tmpl: context => `@FilterDef(name = "${context.tenant.entityUpperCase}_FILTER", parameters = {@ParamDef(name = "${context.tenant.entityNameSpinalCased}Id", type = "long")})
@Filter(name = "${context.tenant.entityUpperCase}_FILTER", condition = "${context.tenant.entityNameSpinalCased}_id = :${context.tenant.entityNameSpinalCased}Id")
$1`
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)public Long getId)',
    tmpl: context => `$2@ManyToOne
$2@JsonIgnoreProperties("users")
$2private ${context.tenant.entityClass} ${context.tenant.entityInstance};

$1`
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(@Override\n(.*)public boolean equals\\(Object o\\) \\{\n(.*)if)',
    tmpl: context => `public ${context.tenant.entityClass} get${context.tenant.entityClass}() {
$3return ${context.tenant.entityInstance};
$2}

$2public void set${context.tenant.entityClass}(${context.tenant.entityClass} ${context.tenant.entityInstance}) {
$3this.${context.tenant.entityInstance} = ${context.tenant.entityInstance};
$2}

$2$1`
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => "((.*)\", activationKey='\" \\+ activationKey \\+ '\\\\'' \\+)",
    tmpl: context => `$1
$2", ${context.tenant.entityInstance}='" + ${context.tenant.entityInstance} + '\\'' +`
  }
];

module.exports = {
  file,
  tmpls
};
