
import { faker } from "@faker-js/faker";
export default (user,count,voucheridIds,useridIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
id: faker.lorem.sentence(1),
voucherid: voucheridIds[i % voucheridIds.length],
userid: useridIds[i % useridIds.length],
quantity: faker.lorem.sentence(1),
completeddate: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
