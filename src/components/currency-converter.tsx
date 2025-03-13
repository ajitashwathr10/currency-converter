"use client"

import {useState} from "react"
import {ArrowRightLeft} from "lucide-react"
import {convertCurrency} from "@/app/actions"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
} from "@/components/ui/select"
import {ThemeToggle} from "@/components/theme-toggle"
import {Alert, AlertDescription} from "@/components/ui/alert"

const FIAT_CURRENCIES = [
    {code: "USD", name: "US Dollar"},
    {code: "EUR", name: "Euro"},
    {code: "GBP", name: "British Pound"},
    {code: "JPY", name: "Japanese Yen"},
    {code: "INR", name: "Indian Rupee"},
]

const CRYPTOCURRENCIES = [
    {code: "BTC", name: "Bitcoin"},
    {code: "ETH", name: "Ethereum"},
    {code: "XRP", name: "Ripple"},
    {code: "LTC", name: "Litecoin"},
    {code: "BNB", name: "Binance Coin"},
]

export function CurrencyConverter() {
    const [amount, setAmount] = useState<string>("100")
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("EUR")
    const [result, setResult] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConvert = async () => {
        setError(null)
        setResult(null)
        const numAmount = Number(amount)
        if(isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0")
            return
        }
        try {
            setLoading(true)
            const data = await convertCurrency(fromCurrency, toCurrency, numAmount);
            setResult(data.result)
        } catch (err) {
            console.error("Conversion error:", err)
            setError(err instanceof Error ? err.message : "An error occurred while converting currency")
        } finally {
            setLoading(false)
        }
    }

    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
        setResult(null)
    }

    return (
        <Card className = "w-full max-w-md">
            <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className = "text-2xl font-bold">Currency Converter</CardTitle>
                <ThemeToggle/>
            </CardHeader>
            <CardContent className = "space-y-4">
                {error && (
                    <Alert variant = "destructive" className = "py-2">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className = "space-y-2">
                    <label className = "text-sm font-medium">Amount</label>
                    <Input
                        type = "number"
                        value = {amount}
                        onChange = {(e) => setAmount(e.target.value)}
                        placeholder = "Enter amount"
                        className = "text-lg"
                        min = "0.01"
                        step = "0.01"
                    />
                </div>

                <div className = "grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                    <div className = "space-y-2">
                        <label className = "text-sm font-medium">From</label>
                        <Select value = {fromCurrency} onValueChange = {setFromCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder = "Select currency"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Currencies</SelectLabel>
                                    {FIAT_CURRENCIES.map((currency) => (
                                        <SelectItem key = {currency.code} value = {currency.code}>
                                            {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Cryptocurrencies</SelectLabel>
                                    {CRYPTOCURRENCIES.map((currency) => (
                                        <SelectItem key = {currency.code} value = {currency.code}>
                                            {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant = "ghost" size = "icon" className = "h-10 w-10" onClick = {handleSwap}>
                        <ArrowRightLeft className = "h-4 w-4"/>
                    </Button>

                    <div className = "space-y-2">
                        <label className = "text-sm font-medium">To</label>
                        <Select value = {toCurrency} onValueChange = {setToCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder = "Select currency"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Currencies</SelectLabel>
                                    {FIAT_CURRENCIES.map((currency) => (
                                        <SelectItem key = {currency.code} value = {currency.code}>
                                            {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Cryptocurrencies</SelectLabel>
                                    {CRYPTOCURRENCIES.map((currency) => (
                                        <SelectItem key = {currency.code} value = {currency.code}>
                                            {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button className = "w-full" onClick = {handleConvert} disabled = {loading}>
                    {loading ? "Converting..." : "Convert"}
                </Button>

                {result !== null && (
                    <div className = "rounded-lg bg-muted p-4 text-center">
                        <p className = "text-sm text-muted-foreground">
                            {amount} {fromCurrency} =
                        </p>
                        <p className = "text-2xl font-bold">
                            {result.toFixed(2)} {toCurrency}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

