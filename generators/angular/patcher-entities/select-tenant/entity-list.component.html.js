export default {
  file: data =>
    `${data.srcMainWebapp}app/${data.builtInUserManagement ? '' : 'entities/'}${data.entityFolderName}/list/${data.entityFileName}.component.html`,
  tmpls: [
    {
      type: 'replaceContent',
      target: '<div class="btn-group">',
      tmpl: data => `<div class="btn-group">
                  @if (${data.builtInUserManagement ? 'user' : data.entityInstance}.${data.builtInUserManagement ? 'id' : data.primaryKey.name} !== 0) {
                    <button
                      type="submit"
                      (click)="setCurrentTenantId(${data.builtInUserManagement ? 'user' : data.entityInstance}.${data.builtInUserManagement ? 'id' : data.primaryKey.name}!)"
                      class="btn btn-primary btn-sm"
                      data-cy="entitySelectButton"
                    >
                      <fa-icon [icon]="currentTenant() === ${data.builtInUserManagement ? 'user' : data.entityInstance}.${data.builtInUserManagement ? 'id' : data.primaryKey.name} ? 'times' : 'check'"></fa-icon>
                      <span class="d-none d-md-inline">{{ currentTenant() === ${data.builtInUserManagement ? 'user' : data.entityInstance}.${data.builtInUserManagement ? 'id' : data.primaryKey.name} ? 'Deselect' : 'Select' }}</span>
                    </button>
                  }
`,
    },
  ],
};
