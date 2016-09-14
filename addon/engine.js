import Ember from 'ember';
import EngineScopedLinkComponent from './-private/link-to-component';
import ExternalLinkComponent from './-private/link-to-external-component';

// Load extensions to Ember
import './-private/route-ext';
import './-private/router-ext';
import './-private/engine-instance-ext';

const { Engine } = Ember;

export default Engine.extend();
