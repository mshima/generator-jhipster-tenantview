const file = data => `${data.srcTestJava}${data.packageFolder}TechnicalStructureTest.java`;

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

export default {
  file,
  tmpls,
};
