const psApi = require('../services/powerschoolapi')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const run = async () => {
    try {
        const token = await psApi.getAccessToken()
        const schoolIds = process.argv.slice(2)
        const timer = 15000
        const batchSize = 150
        let continueProcessing = true
        let errors = 0
				console.log(token)
        const contactCountTotal = await psApi.getNonAccessContactCount(token.access_token, {method: "POST", body: {"schoolid": schoolIds}})
				console.log(contactCountTotal)
        let runningTotal = contactCountTotal.count
        let numberOfBatches = contactCountTotal && contactCountTotal.count > 0 ? Math.floor(contactCountTotal.count / batchSize) : false
        if (numberOfBatches) {
            let estTime = (numberOfBatches * timer)
            console.log(`Processing ${contactCountTotal.count} deletions for schools: ${schoolIds.join(',')}`)
            console.log(`This should take aproximately ${((estTime / 1000) / 60)} minutes`)
            while (continueProcessing) {
                const contactIds = await psApi.getNonAccessContacts(token.access_token, {method: "POST", body: {"schoolid": schoolIds}})
                if (contactIds && contactIds.record && contactIds.record.length > 0) {
                    let contactBatch = contactIds.record.map((value, index) => value['personid'])
                    while (contactBatch.length > 0) {
                        let smallBatch = contactBatch.splice(0, batchSize)
                        let startTime = new Date()
                        let deleteContacts = await psApi.deleteContacts(token.access_token, smallBatch)
                        deleteContacts.forEach((value, index) => {
                            if (value.status === 'VALID') {
                                runningTotal--
                            } else {
                                errors++
                            }
                        })
                        console.log('Remaining: ' + runningTotal + ' Errors: ' + errors)

                        let endTime = timer - (new Date() - startTime)
                        if (endTime > 0) {
                            await new Promise(r => setTimeout(r, endTime))
                        }
                        estTime -= timer
                        console.log(`${(estTime / 1000) / 60} minutes remaining`)
                    }
                } else {
                    continueProcessing = false
                }

            }
        } else {
            console.log('No records found to process')
        }

    } catch(error) {
        console.log(error)
    }
}
run()
