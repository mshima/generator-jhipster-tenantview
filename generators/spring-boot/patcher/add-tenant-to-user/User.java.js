// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/domain/User.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(import org\\.hibernate\\.annotations\\.CacheConcurrencyStrategy;)',
    tmpl: () => `$1
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(public class User)',
    tmpl: data => `@FilterDef(name = "${data.user.entityNameUpperCase}_${data.tenantEntity.entityNameUpperCase}_FILTER", parameters = {@ParamDef(name = "${data.tenantEntity.entityInstance}Id", type = ${data.tenantEntity.primaryKey.type}.class)})
@Filter(name = "${data.user.entityNameUpperCase}_${data.tenantEntity.entityNameUpperCase}_FILTER", condition = "${data.tenantEntity.entityInstance}_id = :${data.tenantEntity.entityInstance}Id")
$1`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '((.*)public Long getId)',
    tmpl: data => `$2@ManyToOne
$2@JsonIgnoreProperties("users")
$2@JoinColumn(nullable = false)
$2private ${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance};

$1`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => '(@Override\n(.*)public boolean equals\\(Object o\\) \\{\n(.*)if)',
    tmpl: data => `public ${data.tenantEntity.entityClass} get${data.tenantEntity.entityClass}() {
$3return ${data.tenantEntity.entityInstance};
$2}

$2public void set${data.tenantEntity.entityClass}(${data.tenantEntity.entityClass} ${data.tenantEntity.entityInstance}) {
$3this.${data.tenantEntity.entityInstance} = ${data.tenantEntity.entityInstance};
$2}

$2$1`,
  },
  {
    type: 'replaceContent',
    regex: true,
    target: () => "((.*)\", activationKey='\" \\+ activationKey \\+ '\\\\'' \\+)",
    tmpl: data => `$1
$2", ${data.tenantEntity.entityInstance}='" + ${data.tenantEntity.entityInstance} + '\\'' +`,
  },
];

export default {
  file,
  tmpls,
};
