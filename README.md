# Next.js + Tailwind CSS + Supertokens + Capacitor Mobile Starter

This monorepo provides a starter project for building a web application with Next.js, Tailwind CSS, and Supertokens for authentication and session management, as well as a mobile application using Capacitor. This allows you to use the same React UI for iOS, Android and the Web. The project is structured using Turborepo, with one repository for the web application and another for the mobile app. The code for both is shared using a `ui` package and other packages.

---

## Differences from related repositories:

[Next.js + Tailwind CSS + Ionic Framework + Capacitor Mobile Starter](https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter) - This current repository uses Turborepo, while the [Ionic example](https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter) does not. In addition, this current repository uses Supertokens for authentication and session management, while the Ionic example does not. This current repository also uses Tailwind CSS for all of it's styling instead of the Ionic Framework. It serves as a good example of how to use Ionic with Capacitor, but does not address the issues that arise when using Supertokens with Capacitor in a Monorepo setup. (note that it is purely a choice not to use Ionic)

[SuperTokens Example](https://github.com/supertokens/next.js/tree/canary/examples/with-supertokens): The Supertokens dev team does not yet have an example with Capacitor or clearly address Capacitor-related issues such as CORS, cookies, and domain configuration. The previous Supertokens example uses Server Side Rendering in Next.js and the supertokens-auth-react package, while this starter project utilizes supertokens-web-js and ThirdPartyEmailPassword. It serves as a good example of how to use Supertokens in a Next.js app, but does not address the issues that arise when using Supertokens with Capacitor. Also, for styling we use Tailwind CSS, meaning that we use the custom UI in Supertokens. Here you can find the corresponding docs for our scenario: [Supertokens Docs](https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/init/frontend)

[Turborepo Tutorial](https://github.com/leoroese/turborepo-tutorial) - This current repository is build on top of the Turborepo tutorial. This makes it easier to follow along for those that have not heard of Turborepo yet. The Turborepo tutorial comes with a corresponding [video on YouTube.](https://www.youtube.com/watch?v=YQLw5kJ1yrQ&t=1s) The Turborepo tutorial does not use Capacitor or Supertokens.

---

## What's inside?

This turborepo uses Yarn as a package manager. It includes the following packages/apps:

### Apps and Packages

- `next-app`: a [Next.js](https://nextjs.org) app using [Supertokens](https://supertokens.com/) and [Capacitor](https://capacitorjs.com/)
- `next-web`: another [Next.js](https://nextjs.org) app using only [Supertokens](https://supertokens.com/)
- `ui`: a React component library shared by both `next-web` and `next-app` applications
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`) and configurations for CORS domains and Supertokens config
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [Capacitor](https://capacitorjs.com/) A cross-platform native runtime for web apps.
- [Supertokens](https://supertokens.com/) Open-source authentication and session management system for your web apps.

## Caveats

The `next-app` in this starter project relies on the API routes of the `next-web` for utilizing Supertokens. However, because the `next-app` must be able to run purely client-side and use `Next.js's Export` command, it does not support Server Side Rendering. This means that certain features and functionality are not available in the next-app, including image optimization, internationalized routing, API routes, rewrites, redirects, headers, middleware, incremental static regeneration, and the fallback and getServerSideProps options.

### Develop

To develop all apps and packages, run the following command:

```
yarn dev
```

To open the iOS app (make sure you have xCode setup): 

```
cd packages
cd next-app
yarn build
yarn open:ios
```


