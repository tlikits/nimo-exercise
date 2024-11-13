const ENDPOINT = 'https://api.coingecko.com';
const API_KEY = process.env.COINGECKO_API_KEY ?? '';

export async function getCoinDataById(id: string) {
    const url = `${ENDPOINT}/api/v3/coins/${id}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': API_KEY,
        },
    };

    const result = await fetch(url, options)
        .then(res => res.json())
        .catch(err => console.error(err));
    return result;
}
