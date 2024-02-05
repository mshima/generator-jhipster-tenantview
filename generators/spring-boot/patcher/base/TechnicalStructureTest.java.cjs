const file = ctx => `${ctx.srcTestJava}${ctx.packageFolder}TechnicalStructureTest.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: 'ignoreDependency(',
    tmpl: '.ignoreDependency(resideInAPackage("..aop.."), alwaysTrue())',
  },
  {
    type: 'rewriteFile',
    target: 'import static com.tngtech.archunit.library.Architectures.layeredArchitecture;',
    tmpl: 'import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAPackage;',
  },
];

module.exports = {
  file,
  tmpls,
};
