const Axios = require('axios').default;

const orgID = 'YOUR-ORG-ID';
const apiKey = 'YOUR-API-KEY';
const url = `https://app.salsify.com/api/orgs/${orgID}/products`;

const auditUnusedProperties = async (propertyList) => {
	const propertyResults = propertyList.map(async property => {
		const config = {
			headers: { Authorization: `Bearer ${apiKey}` },
			data: {
                filter: `='${property}':*`
            }
		};
        
		try {
            const response = await Axios.get(url, config);
            const { products } = response.data;
            
			return {
                property,
				empty: products.length !== 0 ? false : true,
			};
		} catch (error) {
            console.log(`Error auditing '${property}'\n${error.message}\n`);
            return {
                property,
                error: error.message
            }
		}
    });
    return console.log(await Promise.all(propertyResults));
};

module.exports = auditUnusedProperties;