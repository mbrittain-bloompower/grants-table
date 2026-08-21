import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Grant: a.model({
    name:                    a.string().required(),
    url:                     a.string().required(),
    contactEmail:            a.string(),
    nextDeadline:            a.string(),
    eligibilityRequirements: a.string(),
    bloomPowerFitNotes:      a.string(),
    geographicEligibility:   a.string().required(),
    typicalAward:            a.string().required(),
    applicationStatus:       a.string().required(),
  })
  .authorization(allow => [allow.authenticated()]),
});

export type Schema = typeof schema;
export const data = defineData({ schema, authorizationModes: { defaultAuthorizationMode: 'userPool' } });
