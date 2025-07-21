
import { faker } from "@faker-js/faker";
export default (user,count,categoryidIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
id: faker.lorem.sentence(""),
categoryid: categoryidIds[i % categoryidIds.length],
points: faker.lorem.sentence(""),
title: faker.lorem.sentence(""),
image: faker.lorem.sentence("8"),
description: faker.lorem.sentence(""),
Termsandcondition: faker.lorem.sentence("8"),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
