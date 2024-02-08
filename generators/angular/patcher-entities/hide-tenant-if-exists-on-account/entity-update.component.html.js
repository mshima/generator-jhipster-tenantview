import { getNode } from '../../../tenantview/support/utils.js';

const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/update/${data.entityFileName}-update.component.html`;

const tmpls = [
  {
    // Hide the tenant if the current account is from a tenant (field)
    editFile: data => content => {
      const [init, end] = getNode(content, `[for=field_${data.tenantRelationshipName}]`, 'parentNode.range');
      return content.slice(0, init) + ' @if (showTenant()) { ' + content.slice(init, end) + '}' + content.slice(end);
    },
  },
];

export default {
  file,
  tmpls,
};
