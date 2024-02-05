import fs from 'fs';
import os from 'os';
import path from 'path';
import { create as createMemFs } from 'mem-fs';
import { create as createEditor } from 'mem-fs-editor';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import NeedleFile from '../lib/needle-file';
import { afterEach, beforeEach, describe, it } from 'vitest';

const tmpdir = path.join(os.tmpdir(), 'needle-file');

function rm(filepath) {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(path);
  }
}

describe('Unit tests for needle-file', () => {
  let beforeDir;
  let filePath;
  let memFs;
  let fs;
  let needleFile;
  let writeNeedleFile;

  beforeEach(helpers.setUpTestDirectory(tmpdir));

  beforeEach(function () {
    beforeDir = process.cwd();
    filePath = path.join(tmpdir, 'test.html');
    memFs = createMemFs();
    fs = createEditor(memFs);
    needleFile = new NeedleFile(filePath, fs, true);
    writeNeedleFile = new NeedleFile(filePath, fs);
  });

  afterEach(function () {
    rm(filePath);
    process.chdir(beforeDir);
  });

  describe('Html', () => {
    it('#getNeedles()', function () {
      needleFile.write('<!-- jhipster-needle-start-some-name - xx xx --><!-- jhipster-needle-end-some-name -->');
      assert.equal(needleFile.getNeedles(), 'some-name');
    });

    it('multiline #getNeedles()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx --><!-- jhipster-needle-end-some-name -->
            <!-- jhipster-needle-start-some-name2 - xx xx --><!-- jhipster-needle-end-some-name2 -->`);
      assert.deepStrictEqual(needleFile.getNeedles(), ['some-name', 'some-name2']);
    });

    it('case insensitive #getNeedles()', function () {
      needleFile.write(`<!-- JHIPSTER-needle-start-some-name - xx xx --><!-- jhipster-needle-end-some-name -->

            <!-- jhipster-NEEDLE-start-some-name2 - xx xx --><!-- jhipster-needle-end-some-name2 -->`);
      assert.deepStrictEqual(needleFile.getNeedles(), ['some-name', 'some-name2']);
    });

    it('2 lines #getNeedles()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx -->
                    a 
                    <!-- jhipster-needle-end-some-name -->`);
      assert.deepStrictEqual(needleFile.getNeedles(), ['some-name']);
    });

    it('#getNeedle()', function () {
      needleFile.write('<!-- jhipster-needle-start-some-name - xx xx -->aaa<!-- jhipster-needle-end-some-name -->');
      assert.equal(needleFile.getNeedle('some-name'), 'aaa');
    });

    it('multiline #getNeedle()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx -->
            aaaa
            <!-- jhipster-needle-end-some-name -->`);
      assert.equal(
        needleFile.getNeedle('some-name'),
        `            aaaa
`,
      );
    });

    it('#writeNeedle()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->
            <!-- jhipster-needle-some-name - xx xx -->`);
      const content = needleFile.render('some-name', { value: 'test' });
      writeNeedleFile.writeNeedle('some-name', content);
      assert.equal(
        writeNeedleFile.read(),
        `<!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->
            a test
            <!-- jhipster-needle-some-name - xx xx -->`,
      );
    });

    it.skip('#removeNeedles()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->`);
      needleFile.removeNeedles();
      assert.equal(needleFile.read(), '');
    });

    it.skip('leading white space #removeNeedles()', function () {
      needleFile.write(`   <!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->`);
      needleFile.removeNeedles();
      assert.equal(needleFile.read(), '');
    });

    it.skip('leading line #removeNeedles()', function () {
      needleFile.write(`
            <!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->
            after`);
      needleFile.removeNeedles();
      assert.equal(needleFile.read(), '\n            after');
    });

    it.skip('trailing new line #removeNeedles()', function () {
      needleFile.write(`<!-- jhipster-needle-start-some-name - xx xx -->
            a <$= value; $>
            <!-- jhipster-needle-end-some-name -->
`);
      needleFile.removeNeedles();
      assert.equal(needleFile.read(), '');
    });

    it('#addContent()', function () {
      needleFile.write('<!-- jhipster-needle-start-some-name - xx xx --><!-- jhipster-needle-end-some-name -->');
      needleFile.addContent('jhipster-needle-start-some-name', ' aaa ');
      needleFile.addContent('jhipster-needle-start-some-name', ' aaa ', false);

      assert.ok(needleFile.read().includes(' aaa \n'));
      assert.ok(!needleFile.read().includes(' aaa \n aaa \n'));

      needleFile.addContent('jhipster-needle-start-some-name', ' aaa ');
      assert.ok(needleFile.read().includes(' aaa \n aaa \n'));

      needleFile.addContent('jhipster-needle-start-some-name', ' bbb \n ccc ');
      assert.ok(needleFile.read().includes(' aaa \n bbb \n ccc \n'));
    });

    it('#addContent() throws on not found', function () {
      needleFile.write('<!-- jhipster-needle-start-some-name - xx xx --><!-- jhipster-needle-end-some-name -->');
      assert.throws(
        () => needleFile.addContent('jhipster-needle-start-some-name-foo', ' aaa '),
        /^Error: Fail to add content, 'jhipster-needle-start-some-name-foo' was not found.$/,
      );
    });
  });
});
