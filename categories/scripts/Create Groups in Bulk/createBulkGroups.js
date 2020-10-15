const groupJSON = require('./groups-to-create.json');
const Axios = require('axios').default;

const salsifyOrgId = process.env.salsifyOrgId;
const salsifyToken = process.env.salsifyToken;

const salsifyURL = `https://app.salsify.com/api/orgs/${salsifyOrgId}/groups`;

const requestData = groupJSON.map(group => {
	const accessRules = group.accessRules.map(role => {
		return {
			entity: role.entityName,
			actions: role.roles
		}
	});
	return {
		name: group.groupName,
		action_permissions: accessRules
	}
});

console.log(JSON.stringify(requestData))

// const createGroup = async (groupName) => {
// 	const requestData = {
// 		data: {
// 			name: groupName,
// 			action_permissions: [
// 				{
// 					entity: 'Product',
// 					actions: ['read'],
// 				},
// 				{
// 					entity: 'ProfilesController',
// 					actions: ['manage'],
// 				},
// 				{
// 					entity: 'Property',
// 					actions: ['read'],
// 				},
// 				{
// 					entity: 'List',
// 					actions: ['read'],
// 				},
// 				{
// 					entity: 'WorkflowTask',
// 					actions: ['read'],
// 				},
// 				{
// 					entity: 'DigitalAsset',
// 					actions: ['read'],
// 				},
// 			],
// 		},
//     };
    
//     const config = {
//         headers: {
//             Authorization: `Bearer ${salsifyToken}`
//         }
//     };
    
//     try {
//         await Axios.post(salsifyURL, requestData, config);
//         return {
//             groupName: groupName,
//             status: `success`,
//             errors: null
//         }
//     } catch (error) {
//         return {
//             groupName: groupName,
//             status: 'error',
//             errors: error.message
//         }
//     }
// };

// groupJSON.forEach(async group => {
//     const response = await createGroup(group);
//     console.log(`Group Name: ${response.groupName}\nStatus: ${response.status}\n${response.errors ? `Errors: ${response.errors}\n` : ''}`)
// });