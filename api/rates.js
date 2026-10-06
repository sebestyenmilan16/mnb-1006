import {XMLParser} from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,   // az attribútumok (curr, unit, date) is kellenek
    attributeNamePrefix: '@_', // attribútum kulcsok: @_curr, @_unit, @_date
    removeNSPrefix: true,      // s:Envelope -> Envelope
    parseTagValue: false,      // a "367,73000" maradjon string
})

function parseRates(resXml) {
    // 1. lépés: SOAP boríték
    const envelope = parser.parse(resXml)
    const innerXml =
        envelope.Envelope.Body.GetCurrentExchangeRatesResponse.GetCurrentExchangeRatesResult

    // 2. lépés: a benne lévő XML string
    const inner = parser.parse(innerXml)
    const day = inner.MNBCurrentExchangeRates.Day

    return {
        date: day['@_date'],
        rates: [].concat(day.Rate).map((r) => ({
            curr: r['@_curr'],
            unit: Number(r['@_unit']),
            value: Number(r['#text'].replace(',', '.')),
        })),
    }
}

/** 
 * GET /rates
 * Endpoint for getting currency rates against HUF from MNB by SOAP
@param {Request} req
@param {Response} res
*/

export default async function handler(req, res) {

    const {method = 'GET'} = req
    
    switch (req.method) {
        case 'GET':
            // Callout to MNB by SOAP API
            const endpoint = "http://www.mnb.hu/arfolyamok.asmx"
            const reqBodyXml = `<?xml version="1.0" encoding="UTF-8"?>
                                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                                    <soap:Body>
                                        <GetCurrentExchangeRatesResponse xmlns="http://www.mnb.hu/webservices/">
                                        <GetCurrentExchangeRatesResult>sample_string</GetCurrentExchangeRatesResult>
                                        </GetCurrentExchangeRatesResponse>
                                    </soap:Body>
                                </soap:Envelope>` 

            const soapRes = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': '"http://www.mnb.hu/webservices/MNBArfolyamServicesSoap/GetCurrentExchangeRates"'
                },
                body: reqBodyXml
            })
            console.log('soapRes: ', soapRes)

            if (!soapRes.ok) return res.status(soapRes.status).json({error: soapRes.statusText})

            const resXml = await soapRes.text()
            console.log('resXml: ', resXml)    

            const parsed = parseRates(resXml)
            console.log('parsed: ', parsed)

            

            const {date = new Date(Date.now()), rates = []} = parsed
            return res.status(200).json({date, rates})

        default:
            return res.status(405).json({error: "Method Not Allowed"})    
    }

}