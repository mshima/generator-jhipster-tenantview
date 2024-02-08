import { getNode } from '../../../tenantview/support/utils.js';

const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/detail/${data.entityFileName}-detail.component.html`;

const tmpls = [
  {
    // Hide tenant if is defined
    editFile: data => content => {
      const label = getNode(
        content,
        `[jhiTranslate=${data.frontendAppName}.${data.entityTranslationKey}.${data.tenantRelationshipName}]`,
        'parentNode',
      );
      const [init] = label.range;
      const end = label.nextElementSibling.range[1];
      return content.slice(0, init) + ' @if (showTenant()) { ' + content.slice(init, end) + '}' + content.slice(end);
    },
  },
];

export default {
  file,
  tmpls,
};
