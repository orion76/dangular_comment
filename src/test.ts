// This file is required by karma.conf.js and loads recursively all the .spec and framework files
///usr/bin/chromium-browser
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./app/libraries/dangular_common/src/lib/entity/_testing', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
