import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import ThirdPartyPasswordless from 'supertokens-web-js/recipe/thirdpartypasswordless'
import Session from 'supertokens-web-js/recipe/session'
import { AUTH_MODE, FRONTEND_URL, REDIRECT_URL } from 'lib/utils/config'
import { Platform } from './common.types'

type LoginWithEmailPasswordArgs = {
  email: string
  password: string
}

export const signupWithEmailPassword = async ({
  email,
  password,
}: LoginWithEmailPasswordArgs) => {
  if (AUTH_MODE === 'emailpassword') {
    return EmailPassword.signIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    })
  }

  return ThirdPartyEmailPassword.emailPasswordSignUp({
    formFields: [
      {
        id: 'email',
        value: email,
      },
      {
        id: 'password',
        value: password,
      },
    ],
  })
}

export const signinWithEmailPassword = async ({
  email,
  password,
}: LoginWithEmailPasswordArgs) => {
  if (AUTH_MODE === 'emailpassword') {
    return EmailPassword.signIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    })
  }

  return ThirdPartyEmailPassword.emailPasswordSignIn({
    formFields: [
      {
        id: 'email',
        value: email,
      },
      {
        id: 'password',
        value: password,
      },
    ],
  })
}

export const loginToThirdParty = async () => {
  if (AUTH_MODE === 'thirdparty') {
    return ThirdParty.signInAndUp()
  }

  if (AUTH_MODE === 'thirdpartypasswordless') {
    return ThirdPartyPasswordless.thirdPartySignInAndUp()
  }

  return ThirdPartyEmailPassword.thirdPartySignInAndUp()
}

export const signout = async () => Session.signOut()

export const resetPassword = async ({ password }: { password: string }) => {
  if (AUTH_MODE === 'emailpassword') {
    return EmailPassword.submitNewPassword({
      formFields: [
        {
          id: 'password',
          value: password,
        },
      ],
    })
  }

  return ThirdPartyEmailPassword.submitNewPassword({
    formFields: [
      {
        id: 'password',
        value: password,
      },
    ],
  })
}

export const requestPassword = async ({ email }: { email: string }) => {
  if (AUTH_MODE === 'emailpassword') {
    return EmailPassword.sendPasswordResetEmail({
      formFields: [
        {
          id: 'email',
          value: email,
        },
      ],
    })
  }

  return ThirdPartyEmailPassword.sendPasswordResetEmail({
    formFields: [
      {
        id: 'email',
        value: email,
      },
    ],
  })
}

const getThirdPartyURL = async (
  thirdPartyId: 'google' | 'apple' | 'github',
  authorisationURL: string,
) => {
  if (AUTH_MODE === 'thirdparty') {
    return ThirdParty.getAuthorisationURLWithQueryParamsAndSetState({
      providerId: thirdPartyId,
      authorisationURL,
    })
  }

  if (AUTH_MODE === 'thirdpartypasswordless') {
    return ThirdPartyPasswordless.getThirdPartyAuthorisationURLWithQueryParamsAndSetState(
      {
        providerId: thirdPartyId,
        authorisationURL,
      },
    )
  }

  return ThirdPartyEmailPassword.getAuthorisationURLWithQueryParamsAndSetState({
    providerId: thirdPartyId,
    authorisationURL,
  })
}

export const onThirdPartyLogin = async ({
  provider,
  platform,
}: {
  provider: 'google' | 'apple' | 'github'
  platform: Platform
}) => {
  try {
    const isApp = platform === 'APP'
    const authorisationURL = isApp
      ? `${REDIRECT_URL}/api/auth/redirect?provider=${provider}`
      : `${FRONTEND_URL}/auth/callback/${provider}`

    const response = await getThirdPartyURL(provider, authorisationURL)

    if (isApp) {
      window.open(response, '_self')
    } else {
      window.location.href = response
    }
  } catch (error) {
    // TODO: add your error handling here
    console.log(error)
  }
}

export const createPasswordlessCode = async (email: string) => {
  if (AUTH_MODE === 'thirdpartypasswordless') {
    return ThirdPartyPasswordless.createPasswordlessCode({
      email,
    })
  }

  return Passwordless.createCode({
    email,
  })
}

export const consumePasswordlessCode = async (userInputCode: string) => {
  if (AUTH_MODE === 'thirdpartypasswordless') {
    return ThirdPartyPasswordless.consumePasswordlessCode({
      userInputCode,
    })
  }

  return Passwordless.consumeCode({
    userInputCode,
  })
}

export type SuperTokensUserData = {
  note: string
  userId: string
  sessionHandle: string
  accessTokenPayload: {
    iat: number
    exp: number
    sub: string
    sessionHandle: string
    refreshTokenHash1: string
  }
}

export async function fetchUserData() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/user`)

    if (!res.ok) {
      console.error(`An error occurred: ${res.statusText}`)
      return null
    }

    const json = await res.json()
    return json as SuperTokensUserData
  } catch (error) {
    console.error(`Fetch failed: ${error}`)
    return null
  }
}
