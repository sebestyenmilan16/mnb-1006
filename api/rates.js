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
            console.log('soapRes: ', )

            const rates= []
            return res.status(200).json({rates})

        default:
            return res.status(405).json({error: "Method Not Allowed"})    
    }

}