import Document, { Html, Main, Head, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />

        <body>
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
