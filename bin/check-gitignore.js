#!/usr/bin/env node
import { checkGitIgnoreTemplate } from './util/gitignoreUtil.js';

// Check if templates/boilerplate/.gitignore exists and matches the
// .gitignore.eta template. Exits with error if it does not match.
//
// Run 'node bin/generate-gitignore.js' to update the .gitignore file if
// template changed.
checkGitIgnoreTemplate();
