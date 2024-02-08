const file = data => `${data.srcMainJava}${data.packageFolder}/web/rest/AccountResource.java`;

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

export default {
  file,
  tmpls,
};
