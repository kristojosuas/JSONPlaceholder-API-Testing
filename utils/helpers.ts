import { faker } from '@faker-js/faker';

export class Helpers {
    // Data generators
    static generateRandomPostData() {
        return {
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(2),
        };
    }

    static generateRandomUserData() {
        return {
            name: faker.person.fullName(),
            username: faker.internet.username(),
            email: faker.internet.email(),
            address: {
                street: faker.location.street(),
                suite: faker.location.secondaryAddress(),
                city: faker.location.city(),
                zipcode: faker.location.zipCode(),
                geo: {
                    lat: faker.location.latitude().toString(),
                    lng: faker.location.longitude().toString(),
                }
            },
            phone: faker.phone.number(),
            website: faker.internet.domainName(),
            company: {
                name: faker.company.name(),
                catchPhrase: faker.company.catchPhrase(),
                bs: faker.company.buzzPhrase()
            },
        }
    }
}