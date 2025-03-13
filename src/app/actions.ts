'use server'

const API_KEY = process.env.APILAYER_API_KEY;
if (!API_KEY) {
    throw new Error("API key is not defined");
}

interface ExchangeResponse {
    success: boolean
    query: {
        from: string
        to: string
        amount: number
    }
    result: number
    error?: {
        code: string
        message: string
    }
}

export async function convertCurrency(from: string, to: string, amount: number) {
    if(!from || !to || isNaN(amount) || amount <= 0) {
        throw new Error("Invalid conversion parameters")
    }
    try {
        const encodedFrom = encodeURIComponent(from)
        const encodedTo = encodeURIComponent(to)

        const response = await fetch(
            `https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`,
            {
                headers: {
                    'apikey': API_KEY as string,  
                },
                cache: 'no-store',
            },
        )
        const data: ExchangeResponse = await response.json()
        if(!data.success) {
            throw new Error(data.error?.message || "Conversion failed")
        }
        return data 
    } catch(error) {
        console.error("Currency conversion error: ", error)
        throw error 
    }
}