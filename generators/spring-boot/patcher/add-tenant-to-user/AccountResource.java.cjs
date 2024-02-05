const file = ctx => `${ctx.SERVER_MAIN_SRC_DIR}${ctx.packageFolder}/web/rest/AccountResource.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    tmpl: 'import org.springframework.transaction.annotation.Transactional;',
    target: 'import org.springframework.web.bind.annotation.*;',
  },
  {
    type: 'rewriteFile',
    tmpl: '@Transactional(readOnly = true)',
    target: 'public void saveAccount',
  },
];

module.exports = {
  file,
  tmpls,
};
