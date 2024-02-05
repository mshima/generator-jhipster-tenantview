/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import ejs from 'ejs';
import path from 'path';

const ANY_HTML_NEEDLE =
  / *<!-- jhipster-needle-start-(?<name>[\w-]*)( - (?<comment>.*))? -->\n?(?<needle>[\S\s]*)<!-- jhipster-needle-end-\k<name> -->\n?/gi;
const htmlNeedleReader = name =>
  new RegExp(
    ` *<!-- jhipster-needle-start-${name}( - (?<comment>.*))? -->\n?(?<needle>[\\S\\s]*)<!-- jhipster-needle-end-${name} -->\n?`,
    'gi',
  );
const htmlNeedleWriter = name => new RegExp(` *<!-- jhipster-needle-${name}( - (?<comment>.*))? -->\n?`, 'gi');

const getNeedleGroup = result => {
  if (!result || !result.groups || !result.groups.needle) {
    return undefined;
  }

  // Remove trailing empty spaces
  return result.groups.needle.replace(/( +)$/, '');
};

/**
 * Escape regular expressions.
 *
 * @param {string} str string
 * @returns {string} string with regular expressions escaped
 */
function escapeRegExp(string) {
  // eslint-disable-next-line no-useless-escape,unicorn/better-regex
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export default class {
  constructor(filePath, fs, reader) {
    if (path.isAbsolute(filePath)) {
      this.path = filePath;
    } else {
      this.path = path.join(process.cwd(), filePath);
    }

    this.fs = fs;
    const ext = path.extname(this.path);
    if (ext === '.html' || ext === '.ejs') {
      this.anyRegexp = ANY_HTML_NEEDLE;
      this.regexp = reader ? htmlNeedleReader : htmlNeedleWriter;
    }
  }

  /**
   * Read in-memory file content.
   *
   * @returns {string} current file in-memory content
   */
  read() {
    return this.fs.read(this.path);
  }

  /**
   * Write in-memory file content.
   *
   * @param {string} content - new content
   */
  write(content) {
    this.fs.write(this.path, content);
  }

  /**
   * Write in-memory file content.
   *
   * @param {string} needleName - needle name
   * @param {string} content - content to be written before needle
   * @param {Object} options
   * @param {string} options.body - cached file content
   * @returns {boolean} true if file has changed.
   */
  writeNeedle(needleName, content, options = {}) {
    // Use cached body
    options.body = options.body || this.read();
    const result = this.findNeedle(needleName, options.body);
    if (!result) {
      return false;
    }

    this.write(options.body.slice(0, result.index) + content + options.body.slice(result.index));
    return true;
  }

  /**
   * Render needle content.
   *
   * @param {string} needleName - needle name
   * @param {Object} obj - object for ejs template substitution.
   * @param {Object} options
   * @returns {string} rendered content
   */
  render(needleName, object, options = {}) {
    const content = this.read();
    const result = this.findNeedle(needleName, content);
    if (!result) {
      return undefined;
    }

    const needle = getNeedleGroup(result);
    if (!needle) {
      return undefined;
    }

    return ejs.render(needle, object, { ...options, delimiter: '$' });
  }

  /**
   * Remove needles.
   *
   * @param {string} needleName - needle name
   * @param {Object} obj - object for ejs template substitution.
   * @param {Object} options
   * @returns {string} rendered content
   */
  removeNeedles(content) {
    const matches = this.findNeedles(content);
    content = content || this.read();
    matches.reverse().forEach(match => {
      content = content.slice(0, match.index) + content.slice(match.lastIndex);
    });
    this.write(content);
    return content;
  }

  /**
   * Find needle.
   *
   * @param {string} needleName - needle name
   * @param {string} [body] - cached body content
   * @returns {Object} regexp result
   */
  findNeedle(needleName, body) {
    if (this.regexp === undefined) {
      const ext = path.extname(this.path);
      throw new Error(`Needle not implemented for type ${ext}`);
    }

    return this.regexp(needleName).exec(body || this.read());
  }

  /**
   * Get needle from a start-end needle content.
   *
   * @param {string} needleName - needle name
   * @returns {Object} needle
   */
  getNeedle(needleName) {
    return getNeedleGroup(this.findNeedle(needleName));
  }

  /**
   * Get all start-end needles.
   *
   * @param {string} [body] - cached body content
   * @returns {Array} array of regexp result
   */
  findNeedles(body) {
    if (this.anyRegexp === undefined) {
      const ext = path.extname(this.path);
      throw new Error(`Needle not implemented for type ${ext}`);
    }

    body = body || this.read();
    const regex = new RegExp(this.anyRegexp.source, this.anyRegexp.flags);
    const allMatches = [];
    let matches = regex.exec(body);
    while (matches) {
      allMatches.push(matches);
      matches.lastIndex = regex.lastIndex;
      matches = regex.exec(body);
    }

    return allMatches;
  }

  /**
   * Get all start-end needles name.
   *
   * @param {string} [body] - cached body content
   * @returns {Array} array of string
   */
  getNeedles(body) {
    if (this.anyRegexp === undefined) {
      const ext = path.extname(this.path);
      throw new Error(`Needle not implemented for type ${ext}`);
    }

    body = body || this.read();
    const regex = new RegExp(this.anyRegexp.source, this.anyRegexp.flags);
    const allNames = [];
    let matches = regex.exec(body);
    while (matches) {
      if (matches.groups && matches.groups.name) {
        allNames.push(matches.groups.name);
      }

      matches = regex.exec(body);
    }

    return allNames;
  }

  /**
   * Replace a regexp pattern at in-memory file.
   *
   * @param {string} pattern - pattern to match
   * @param {string} content - content to replace
   * @param {boolean} [regex] - convert to RegExp
   * @returns {boolean} true if file content changes
   */
  replaceContent(pattern, content, regex) {
    const re = regex ? new RegExp(pattern, 'g') : pattern;
    const body = this.read();
    const newBody = body.replace(re, content);
    this.write(newBody);
    if (newBody !== body) {
      return true;
    }

    if (re instanceof RegExp) {
      return re.test(body);
    }

    return false;
  }

  /**
   * Write a content at in-memory file before 'before' if the content doesn't exists on file.
   *
   * @param {string} reference - line
   * @param {string} content - content to write
   * @returns {boolean} true if file content changed
   */
  addContent(before, content, skipTest = true) {
    // Check if content is already in the body text
    const re = new RegExp(`\\s*${escapeRegExp(content)}`);

    const body = this.read();
    if (!skipTest && re.test(body)) {
      return false;
    }

    const lines = body.split('\n');

    let otherwiseLineIndex = -1;
    lines.forEach((line, i) => {
      if (line.includes(before)) {
        otherwiseLineIndex = i;
      }
    });

    if (otherwiseLineIndex === -1) {
      throw new Error(`Fail to add content, '${before}' was not found.`);
    }

    let spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
      spaces += 1;
    }

    let spaceString = '';

    while ((spaces -= 1) >= 0) {
      spaceString += ' ';
    }

    lines.splice(otherwiseLineIndex, 0, spaceString + content);

    this.write(lines.join('\n'));
    return true;
  }
}
