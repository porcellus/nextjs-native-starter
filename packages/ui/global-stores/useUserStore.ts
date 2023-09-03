import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { doesSessionExist } from 'supertokens-web-js/recipe/session'
import { logError } from 'lib/utils/logError'
import { getAccessTokenPayload, signout } from 'lib/utils/supertokensUtilities'
import { Role_Enum } from 'graphql-generated/admin'
import { toastError } from 'ui/components/Toast/toast'
import { getUserFromDatabase } from 'ui/global-stores/helpers/useUserStore.helpers'
import { GetPersonQuery } from 'graphql-generated/moderator'

export type User = Pick<GetPersonQuery, 'person'>['person'][0]

const allowedRoles = [Role_Enum.Moderator, Role_Enum.User]

type UserState = {
  user: User | null
  isFetched: boolean
  isSupertokensAuthenticated: boolean
  deviceToken?: string
}

const getDefaultValues = (): UserState => ({
  user: null,
  isFetched: false,
  isSupertokensAuthenticated: false,
})

export const useUserStore = create(
  combine(getDefaultValues(), set => ({
    setDeviceToken: (deviceToken: string) =>
      set(state => ({ ...state, deviceToken })),
    fetchUser: async () => {
      try {
        const validSession = await doesSessionExist()

        if (!validSession) {
          set(getDefaultValues())
          set(state => ({ ...state, isFetched: true }))
          return
        }

        const hasuraClaims = await getAccessTokenPayload()

        if (!hasuraClaims) {
          set(getDefaultValues())
          set(state => ({
            ...state,
            isFetched: true,
            // isSupertokensAuthenticated: true,
          }))
          return
        }

        if (!hasuraClaims['https://hasura.io/jwt/claims']) {
          toastError('You are not allowed to access this page')
          set(getDefaultValues())

          set(state => ({
            ...state,
            isFetched: true,
            isSupertokensAuthenticated: true,
          }))
          return
        }

        const role = hasuraClaims['https://hasura.io/jwt/claims'][
          'x-hasura-default-role'
        ] as Role_Enum

        // check if role is allowed else signout and redirect to login
        //  in createNewSessionPayload.ts we are setting allowed roles based on UUID
        if (!allowedRoles.includes(role)) {
          toastError('You are not allowed to access this page')

          await signout()
          if (window && window.location.href !== '/login') {
            window.location.href = '/login'
          }
          set(state => ({
            ...state,
            isFetched: true,
            isSupertokensAuthenticated: true,
          }))
          return
        }

        const user = await getUserFromDatabase()

        if (!user) {
          toastError('Something went wrong, please try again later.')
          logError('No user found in database')
          await signout()
          if (window) {
            window.location.href = '/login'
          }
          return
        }

        set(state => ({
          ...state,
          user: user?.person[0],
          isFetched: true,
          isSupertokensAuthenticated: true,
        }))
      } catch (err) {
        await signout()
        if (window) {
          window.location.href = '/login'
        }
        logError(err)
      }
    },
  })),
)
