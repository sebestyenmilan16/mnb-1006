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
            // TODO - callout to MNB by SOAP API
            const rates= []
            return res.status(200).json({rates})
            
        default:
            return res.status(405).json({error: "Method Not Allowed"})    
    }

}