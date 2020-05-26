const file = context => `${context.constants.SERVER_MAIN_SRC_DIR}${context.storage.packageFolder}/web/rest/${context.tenant.entityClass}Resource.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'rewriteFile',
    target: context => `${context.tenant.entityInstance}Service.delete(id);`,
    tmpl: context => `${context.tenant.entityClass} ${context.tenant.entityInstance} = ${context.tenant.entityInstance}Service.findOne(id).orElse(null);
        if(${context.tenant.entityInstance} == null || !${context.tenant.entityInstance}.getUsers().isEmpty()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(applicationName, true, ENTITY_NAME, "deletefail", "Delete Failed. Please remove users first")).build();
        }`
  }
];

module.exports = {
  file,
  tmpls
};
