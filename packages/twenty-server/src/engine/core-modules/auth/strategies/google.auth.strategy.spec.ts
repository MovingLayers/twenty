import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

import { GoogleStrategy } from './google.auth.strategy';

const KEYCLOAK =
  'https://auth.example.com/realms/example/protocol/openid-connect';

const buildStrategy = (overrides: Record<string, string | undefined> = {}) => {
  const values: Record<string, string | undefined> = {
    AUTH_GOOGLE_CLIENT_ID: 'client-id',
    AUTH_GOOGLE_CLIENT_SECRET: 'client-secret',
    AUTH_GOOGLE_CALLBACK_URL: 'https://twenty.example.com/auth/google/redirect',
    ...overrides,
  };
  const twentyConfigService = {
    get: (key: string) => values[key],
  } as unknown as TwentyConfigService;

  // oxlint-disable-next-line typescript/no-explicit-any
  return new GoogleStrategy(twentyConfigService) as any;
};

describe('GoogleStrategy', () => {
  it('uses the Google endpoints when no override is set', () => {
    const strategy = buildStrategy();

    expect(strategy._oauth2._authorizeUrl).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
    expect(strategy._oauth2._accessTokenUrl).toBe(
      'https://www.googleapis.com/oauth2/v4/token',
    );
    expect(strategy._userProfileURL).toBe(
      'https://www.googleapis.com/oauth2/v3/userinfo',
    );
  });

  it('uses the configured OpenID Connect endpoints when set', () => {
    const strategy = buildStrategy({
      AUTH_GOOGLE_AUTHORIZATION_URL: `${KEYCLOAK}/auth`,
      AUTH_GOOGLE_TOKEN_URL: `${KEYCLOAK}/token`,
      AUTH_GOOGLE_USERINFO_URL: `${KEYCLOAK}/userinfo`,
    });

    expect(strategy._oauth2._authorizeUrl).toBe(`${KEYCLOAK}/auth`);
    expect(strategy._oauth2._accessTokenUrl).toBe(`${KEYCLOAK}/token`);
    expect(strategy._userProfileURL).toBe(`${KEYCLOAK}/userinfo`);
    expect(strategy._userProfileFormat).toBe('openid');
  });

  it('sends the access token in the Authorization header', () => {
    const strategy = buildStrategy();

    expect(strategy._oauth2._useAuthorizationHeaderForGET).toBe(true);
  });

  it('requests the openid scope', () => {
    const strategy = buildStrategy();

    expect(strategy._scope).toEqual(['openid', 'email', 'profile']);
  });
});
