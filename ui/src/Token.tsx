import React, {useEffect, useState} from 'react';

import { useAuth0 } from "@auth0/auth0-react";


export const Token = () => {
    const { getIdTokenClaims } = useAuth0();
    const [idToken, setIdToken] = useState('');

    useEffect(() => {
        (async () => {
          try {
            setIdToken((await getIdTokenClaims()).__raw);
          } catch (e) {
            console.error(e);
          }
        })();
      }, [getIdTokenClaims, idToken]);

    return <code>{idToken}</code>
}