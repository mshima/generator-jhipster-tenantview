import { parse } from 'node-html-parser';
import { getNode } from '../../../tenantview/support/utils.js';

const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/list/${data.entityFileName}.component.html`;

const tmpls = [
  {
    // Hide if currentAccount has a tenant
    editFile: data => content => {
      const root = parse(content);
      const [thInit, thEnd] = getNode(
        root,
        `[jhiTranslate=${data.frontendAppName}.${data.entityTranslationKey}.${data.tenantRelationshipName}]`,
        'parentNode.parentNode.range',
      );
      const [tdInit, tdEnd] = getNode(
        root,
        `[\\[routerLink\\]="['/${data.tenantEntity.entityUrl}', ${data.entityInstance}.${data.tenantRelationshipName}.${data.tenantEntity.primaryKey.name}, 'view']"]`,
        'parentNode.parentNode.range',
      );

      return `${content.slice(0, thInit)}
      @if (showTenant()) {
${content.slice(thInit, thEnd)}
      }
${content.slice(thEnd, tdInit)}
      @if (showTenant()) {
${content.slice(tdInit, tdEnd)}
      }
${content.slice(tdEnd)}`;
    },
  },
];
export default {
  condition: data => data.tenantAware,
  file,
  tmpls,
};
