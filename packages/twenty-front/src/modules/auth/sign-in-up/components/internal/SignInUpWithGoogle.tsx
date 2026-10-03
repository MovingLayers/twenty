import { isDefined } from 'twenty-shared/utils';
import { useHasMultipleAuthMethods } from '@/auth/sign-in-up/hooks/useHasMultipleAuthMethods';
import { useSignInWithGoogle } from '@/auth/sign-in-up/hooks/useSignInWithGoogle';
import { lastAuthenticatedMethodState } from '@/auth/states/lastAuthenticatedMethodState';
import {
  SignInUpStep,
  signInUpStepState,
} from '@/auth/states/signInUpStepState';
import { AuthenticatedMethod } from '@/auth/types/AuthenticatedMethod.enum';
import { type SocialSsoSignInUpActionType } from '@/auth/types/SocialSsoSignInUpActionType';
import { memo } from 'react';
import { MainButton } from 'twenty-ui/components';
import { IconKey } from 'twenty-ui/icon';
import { HorizontalSeparator } from 'twenty-ui/primitives/layout';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { LastUsedPill } from './LastUsedPill';
import { StyledSsoButtonContainer } from './SignInUpSsoButtonStyles';
import { useTheme } from 'twenty-ui/theme';

// MovingLayers fork: the Google flow is pointed at Keycloak through the
// AUTH_GOOGLE_*_URL variables, so the button names our login, not Google.
// oxlint-disable-next-line lingui/no-unlocalized-strings
const SIGN_IN_BUTTON_LABEL = 'Login via MovingLayers';

const GoogleIcon = memo(() => {
  const theme = useTheme();
  return <IconKey size={theme.icon.size.md} />;
});

export const SignInUpWithGoogle = ({
  action,
  isGlobalScope,
}: {
  action: SocialSsoSignInUpActionType;
  isGlobalScope?: boolean;
}) => {
  const signInUpStep = useAtomStateValue(signInUpStepState);
  const [lastAuthenticatedMethod, setLastAuthenticatedMethod] = useAtomState(
    lastAuthenticatedMethodState,
  );
  const { signInWithGoogle } = useSignInWithGoogle();
  const hasMultipleAuthMethods = useHasMultipleAuthMethods();

  const handleClick = () => {
    setLastAuthenticatedMethod(AuthenticatedMethod.GOOGLE);
    signInWithGoogle({ action });
  };

  const isLastUsed = lastAuthenticatedMethod === AuthenticatedMethod.GOOGLE;

  return (
    <>
      <StyledSsoButtonContainer>
        <MainButton
          startIcon={isDefined(GoogleIcon) ? <GoogleIcon /> : undefined}
          onClick={handleClick}
          fullWidth
          variant={signInUpStep === SignInUpStep.Init ? 'solid' : 'outline'}
        >
          {SIGN_IN_BUTTON_LABEL}
        </MainButton>
        {isLastUsed && (isGlobalScope || hasMultipleAuthMethods) && (
          <LastUsedPill />
        )}
      </StyledSsoButtonContainer>
      <HorizontalSeparator visible={false} />
    </>
  );
};
