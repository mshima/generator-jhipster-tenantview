const path = require('path');
const os = require('os');
const fse = require('fs-extra');
const assert = require('yeoman-assert');

const Env = require('yeoman-environment');
const packagePath = Env.lookupGenerator('jhipster:app', {packagePath: true, npmPaths: [path.join(__dirname, '..', '..', 'node_modules')]});
const generatorsPath = `${packagePath}/generators`;

// eslint-disable-next-line import/no-dynamic-require
const Generator = require(`${generatorsPath}/generator-base`);
// eslint-disable-next-line import/no-dynamic-require
const constants = require(`${generatorsPath}/generator-constants`);

const DOCKER_DIR = constants.DOCKER_DIR;

module.exports = {
  generatorsPath,
  getFilesForOptions,
  shouldBeV3DockerfileCompatible,
  getJHipsterCli,
  testInTempDir: testInTemporaryDir
};

function getFilesForOptions(files, options, prefix, excludeFiles) {
  const generator = options;
  if (excludeFiles === undefined) {
    return Generator.prototype.writeFilesToDisk(files, generator, true, prefix);
  }

  return Generator.prototype.writeFilesToDisk(files, generator, true, prefix).filter(file => !excludeFiles.includes(file));
}

function shouldBeV3DockerfileCompatible(databaseType) {
  it('creates compose file without container_name, external_links, links', () => {
    assert.noFileContent(`${DOCKER_DIR}app.yml`, /container_name:/);
    assert.noFileContent(`${DOCKER_DIR}app.yml`, /external_links:/);
    assert.noFileContent(`${DOCKER_DIR}app.yml`, /links:/);
    assert.noFileContent(`${DOCKER_DIR + databaseType}.yml`, /container_name:/);
    assert.noFileContent(`${DOCKER_DIR + databaseType}.yml`, /external_links:/);
    assert.noFileContent(`${DOCKER_DIR + databaseType}.yml`, /links:/);
  });
}

function getJHipsterCli() {
  const cmdPath = path.join(__dirname, '../../cli/jhipster');
  let cmd = `node ${cmdPath} `;
  if (os.platform() === 'win32') {
    // Corrected test for windows user
    cmd = cmd.replace(/\\/g, '/');
  }

  /* eslint-disable-next-line no-console */
  console.log(cmd);
  return cmd;
}

function testInTemporaryDir(cb) {
  const cwd = process.cwd();
  /* eslint-disable-next-line no-console */
  console.log(`current cwd: ${cwd}`);
  const temporaryDir = path.join(os.tmpdir(), 'jhitemp');
  fse.removeSync(temporaryDir);
  fse.ensureDirSync(temporaryDir);
  process.chdir(temporaryDir);
  /* eslint-disable-next-line no-console */
  console.log(`New cwd: ${process.cwd()}`);
  cb(temporaryDir);
  process.chdir(cwd);
  /* eslint-disable-next-line no-console */
  console.log(`current cwd: ${process.cwd()}`);
}
