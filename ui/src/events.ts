export const getEvents = (
    rules: {[id: string]: any},
    token: string
) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(rules),
        redirect: 'follow'
    };

    return fetch(process.env.REACT_APP_TRANSACTIONS_ENDPOINT as string, requestOptions as unknown as any)
        .then(response => response.json())
}